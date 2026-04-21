# Integração de API de Frete - Documentação Técnica

## Visão Geral

Este documento descreve a arquitetura e o plano de integração para conectar a plataforma Rosalie Ateliê com APIs de frete em tempo real. Atualmente, o sistema utiliza uma calculadora mockup com custos pré-configurados.

## Status Atual

**Modo**: Mockup com custos configuráveis
**Funcionalidades Implementadas**:
- Validação de CEP para Curitiba (80000-82799)
- Cálculo de frete local (Motoboy)
- Placeholder para envio nacional
- Integração com WhatsApp para confirmação de pedidos

## Provedores de Frete Recomendados

### 1. **Melhor Envio**
- **URL**: https://www.melhorenvio.com.br/
- **Documentação**: https://www.melhorenvio.com.br/api
- **Suporta**: Correios, Sedex, PAC, Loggi, Jadlog
- **Autenticação**: Bearer Token

### 2. **Frenet**
- **URL**: https://www.frenet.com.br/
- **Documentação**: https://www.frenet.com.br/api
- **Suporta**: Múltiplas transportadoras
- **Autenticação**: API Key

### 3. **Shipping Easy**
- **URL**: https://www.shippingeasy.com.br/
- **Documentação**: https://www.shippingeasy.com.br/api
- **Suporta**: Integração com múltiplos marketplaces
- **Autenticação**: OAuth2

## Arquitetura de Integração Proposta

### Backend (Node.js/Express + tRPC)

```typescript
// server/shipping-providers.ts
export interface ShippingProvider {
  name: string;
  apiUrl: string;
  apiKey: string;
  authenticate(): Promise<void>;
  calculateShipping(params: ShippingParams): Promise<ShippingQuote[]>;
  createShipment(order: Order): Promise<ShipmentResponse>;
  trackShipment(trackingCode: string): Promise<TrackingInfo>;
}

export interface ShippingParams {
  originZipCode: string;
  destinationZipCode: string;
  weight: number; // em kg
  height: number; // em cm
  width: number;
  length: number;
  value: number; // valor declarado em R$
}

export interface ShippingQuote {
  provider: string;
  service: string;
  estimatedDays: number;
  cost: number;
  deliveryDate: Date;
}
```

### Variáveis de Ambiente

```env
# Melhor Envio
SHIPPING_PROVIDER=melhor-envio
MELHOR_ENVIO_API_KEY=seu_token_aqui
MELHOR_ENVIO_API_URL=https://api.melhorenvio.com.br

# Ou Frenet
FRENET_API_KEY=sua_chave_aqui
FRENET_API_URL=https://api.frenet.com.br

# Configurações de Frete Local
LOCAL_SHIPPING_ENABLED=true
LOCAL_SHIPPING_ZIP_CODES_START=80000
LOCAL_SHIPPING_ZIP_CODES_END=82799
LOCAL_SHIPPING_COST=15.00
LOCAL_SHIPPING_DAYS=1
```

### Procedimento tRPC para Cálculo de Frete

```typescript
// server/routers.ts - adicionar ao router de shipping
shipping: router({
  calculateQuotes: publicProcedure
    .input(z.object({
      originZipCode: z.string(),
      destinationZipCode: z.string(),
      weight: z.number(),
      dimensions: z.object({
        height: z.number(),
        width: z.number(),
        length: z.number(),
      }),
      value: z.number(),
    }))
    .query(async ({ input }) => {
      // Implementar lógica de cálculo com provider configurado
      const quotes = await calculateShippingQuotes(input);
      return quotes;
    }),

  createShipment: protectedProcedure
    .input(z.object({
      orderId: z.number(),
      selectedService: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Implementar criação de etiqueta e rastreamento
      const shipment = await createShipmentWithProvider(input);
      return shipment;
    }),
})
```

### Frontend (React)

```typescript
// client/src/components/ShippingCalculator.tsx
export function ShippingCalculator({ zipCode, cartValue }) {
  const { data: quotes, isLoading } = trpc.shipping.calculateQuotes.useQuery({
    originZipCode: "80000",
    destinationZipCode: zipCode,
    weight: calculateCartWeight(),
    dimensions: { height: 20, width: 20, length: 20 },
    value: cartValue,
  });

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        quotes?.map((quote) => (
          <ShippingOption key={quote.service} quote={quote} />
        ))
      )}
    </div>
  );
}
```

## Fluxo de Integração

### Fase 1: Preparação
- [ ] Criar conta em provedor de frete escolhido
- [ ] Obter credenciais de API
- [ ] Testar conexão com API em ambiente de desenvolvimento

### Fase 2: Implementação Backend
- [ ] Criar módulo de integração com provider
- [ ] Implementar validação de CEP expandida
- [ ] Implementar cálculo de frete em tempo real
- [ ] Adicionar tratamento de erros e fallback

### Fase 3: Integração Frontend
- [ ] Atualizar componente de calculadora de frete
- [ ] Implementar seleção de opções de frete
- [ ] Integrar com carrinho e checkout
- [ ] Adicionar rastreamento de pedidos

### Fase 4: Testes e Deploy
- [ ] Testes unitários de integração
- [ ] Testes de integração end-to-end
- [ ] Deploy em staging
- [ ] Deploy em produção

## Implementação Passo a Passo (Melhor Envio)

### 1. Instalar SDK
```bash
npm install melhor-envio
```

### 2. Criar Serviço de Integração
```typescript
// server/shipping-providers/melhor-envio.ts
import axios from 'axios';

export class MelhorEnvioProvider {
  private apiUrl = process.env.MELHOR_ENVIO_API_URL;
  private apiKey = process.env.MELHOR_ENVIO_API_KEY;

  async calculateShipping(params: ShippingParams) {
    const response = await axios.post(
      `${this.apiUrl}/shipping`,
      {
        from: { postal_code: params.originZipCode },
        to: { postal_code: params.destinationZipCode },
        products: [{
          id: 1,
          width: params.width,
          height: params.height,
          length: params.length,
          weight: params.weight,
          insurance_value: params.value,
        }],
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.map(quote => ({
      provider: 'Melhor Envio',
      service: quote.name,
      estimatedDays: quote.delivery_time,
      cost: quote.price,
      deliveryDate: new Date(Date.now() + quote.delivery_time * 24 * 60 * 60 * 1000),
    }));
  }
}
```

### 3. Adicionar ao Banco de Dados
```sql
ALTER TABLE orders ADD COLUMN shippingProvider VARCHAR(50);
ALTER TABLE orders ADD COLUMN trackingCode VARCHAR(100);
ALTER TABLE orders ADD COLUMN shippingLabel VARCHAR(500);
```

## Considerações de Segurança

1. **Nunca exponha chaves de API no frontend**
   - Todas as chamadas devem ser feitas via backend
   - Use variáveis de ambiente para armazenar credenciais

2. **Validação de CEP**
   - Validar formato antes de enviar para API
   - Implementar cache de CEPs válidos

3. **Tratamento de Erros**
   - Implementar fallback para frete mockup se API falhar
   - Logar erros para monitoramento

4. **Rate Limiting**
   - Implementar rate limiting para chamadas de API
   - Usar cache para resultados recentes

## Testes

```typescript
// server/shipping-integration.test.ts
describe("Shipping Integration", () => {
  it("should calculate shipping quotes", async () => {
    const quotes = await calculateShippingQuotes({
      originZipCode: "80000",
      destinationZipCode: "01310",
      weight: 2,
      dimensions: { height: 20, width: 20, length: 20 },
      value: 100,
    });

    expect(quotes).toHaveLength(greaterThan(0));
    expect(quotes[0]).toHaveProperty("cost");
    expect(quotes[0]).toHaveProperty("estimatedDays");
  });
});
```

## Próximos Passos

1. Escolher provedor de frete
2. Criar conta e obter credenciais
3. Implementar módulo de integração
4. Testar em desenvolvimento
5. Deploy em produção

## Referências

- [Melhor Envio API](https://www.melhorenvio.com.br/api)
- [Frenet API](https://www.frenet.com.br/api)
- [Shipping Easy API](https://www.shippingeasy.com.br/api)
