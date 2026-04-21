import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X } from "lucide-react";
import { uploadProductImage } from "@/lib/firebase";

const SIZES = ["P", "M", "G", "GG", "EXG", "G1", "G2", "Tamanho Único"];

interface ProductFormProps {
  product?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const createProduct = trpc.products.create.useMutation({
    onSuccess: () => {
      onSuccess();
    },
  });

  const updateProduct = trpc.products.update.useMutation({
    onSuccess: () => {
      onSuccess();
    },
  });

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || "");
      setPrice(product.price);
      setImagePreview(product.imageUrl || "");
      const sizes = typeof product.availableSizes === "string"
        ? JSON.parse(product.availableSizes)
        : product.availableSizes || [];
      setSelectedSizes(sizes);
    }
  }, [product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      if (!name || !price || selectedSizes.length === 0) {
        alert("Por favor, preencha todos os campos obrigatórios");
        setIsSubmitting(false);
        return;
      }

      let imageUrl = imagePreview;

      // Upload image to Firebase if a new image was selected
      if (imageFile && !product) {
        setUploadProgress(50);
        imageUrl = await uploadProductImage(imageFile, Date.now());
        setUploadProgress(100);
      } else if (imageFile && product) {
        setUploadProgress(50);
        imageUrl = await uploadProductImage(imageFile, product.id);
        setUploadProgress(100);
      }

      if (product) {
        await updateProduct.mutateAsync({
          id: product.id,
          name,
          description,
          price,
          availableSizes: selectedSizes,
          imageUrl,
        });
      } else {
        await createProduct.mutateAsync({
          name,
          description,
          price,
          availableSizes: selectedSizes,
          imageUrl,
        });
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar produto. Tente novamente.");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Nome do Produto *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded-lg"
          placeholder="Nome do produto"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Descrição</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded-lg"
          placeholder="Descrição do produto"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Preço (R$) *</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded-lg"
          placeholder="0.00"
          required
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Imagem do Produto</label>
        <div className="space-y-4">
          {imagePreview && (
            <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {imageFile && (
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview("");
                  }}
                  className="absolute top-2 right-2 bg-destructive text-white p-2 rounded-lg hover:bg-destructive/90"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              <span className="text-sm font-medium">
                {imageFile ? "Clique para trocar" : "Clique para fazer upload"}
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-muted rounded-lg overflow-hidden">
              <div
                className="bg-primary h-2 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-4">Tamanhos Disponíveis *</label>
        <div className="grid grid-cols-4 gap-2">
          {SIZES.map((size) => (
            <label
              key={size}
              className="flex items-center gap-2 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50"
            >
              <input
                type="checkbox"
                checked={selectedSizes.includes(size)}
                onChange={() => handleSizeToggle(size)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">{size}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {product ? "Atualizar Produto" : "Criar Produto"}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-muted hover:bg-muted/80 text-foreground py-2 rounded-lg font-semibold"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
