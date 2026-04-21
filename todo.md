# Rosalie Ateliê - E-commerce TODO

## Fase 1: Configuração Base e Design System
- [x] Configurar paleta de cores (Terracota, Off-white, Marrom Café, Verde Oliva) no Tailwind
- [x] Importar fontes Google (Serif para títulos, Sans-serif para corpo)
- [x] Criar componentes base (Button, Card, Input, etc.) com estilo Boho Chic
- [x] Configurar tema global e variáveis CSS

## Fase 2: Backend - API de Produtos e Autenticação
- [x] Criar schema de banco de dados (Products, Orders, Users, Admin)
- [x] Implementar CRUD de produtos via tRPC
- [x] Implementar autenticação admin (protectedProcedure)
- [x] Criar validação e cálculo de preços no backend
- [x] Implementar upload de imagens para S3
- [x] Criar testes unitários para API de produtos

## Fase 3: Frontend - Contexto e Componentes Core
- [x] Criar Context API para carrinho (CartContext)
- [x] Implementar hooks customizados (useCart, useProducts)
- [x] Criar componentes de navegação (Header, Footer)
- [x] Criar layout base com navegação

## Fase 4: Páginas Públicas - Home e Produtos
- [x] Desenvolver Home Page com hero section rústico
- [x] Criar seção "Novidades" com grid de produtos
- [x] Criar seção "Nossa História"
- [x] Desenvolver página de listagem de produtos
- [x] Desenvolver página de detalhes do produto com galeria de imagens
- [x] Implementar seletor de tamanhos (P, M, G, GG, EXG, G1, G2, Tamanho Único)
- [x] Implementar botão "Adicionar ao Carrinho"

## Fase 5: Carrinho e Checkout
- [x] Implementar side drawer do carrinho
- [x] Criar componentes de item do carrinho (quantidade, remover)
- [x] Implementar cálculo de total do carrinho
- [x] Criar calculadora de frete mockup (Entrega Local + Envio Nacional)
- [x] Implementar botão "Finalizar Pedido via WhatsApp"
- [x] Integrar envio de mensagem pré-formatada para WhatsApp (41992063104)
- [x] Configurar CEPs para entrega local (Motoboy)

## Fase 6: Painel Administrativo
- [x] Criar layout do painel admin com sidebar
- [x] Implementar página de listagem de produtos (admin)
- [x] Implementar formulário de adicionar produto com upload de imagens
- [x] Implementar matriz de tamanhos (checkboxes)
- [x] Implementar formulário de editar produto
- [x] Implementar funcionalidade de deletar produto
- [x] Proteger rotas admin com autenticação

## Fase 7: Integração e Testes
- [x] Testar fluxo completo de compra
- [ ] Testar upload de imagens
- [x] Testar cálculo de frete
- [x] Testar envio de mensagem WhatsApp
- [x] Testes de segurança (validação de preços no backend)
- [x] Testes de lógica de frete com CEPs

## Fase 8: Deploy e Publicação
- [x] Criar checkpoint final
- [ ] Publicar projeto
- [ ] Validar funcionamento em produção

## Fase 9: Melhorias e Integrações
- [x] Configurar Firebase para armazenamento de imagens
- [x] Implementar upload de imagens no painel admin
- [x] Proteger painel admin - remover link visível, acessível apenas via URL
- [x] Criar schema de contas de clientes (para pagamento online futuro)
- [x] Preparar integração com API de frete
- [x] Testar upload de imagens e painel admin protegido

## Fase 10: Validação e Testes de Integração
- [ ] Testar upload real de imagem com Firebase Storage
- [x] Validar acesso protegido ao painel admin (sem link visível)
- [x] Confirmar tabela customers criada no banco de dados
- [x] Criar documentação para integração futura de API de frete (SHIPPING_API_INTEGRATION.md)

## Fase 11: Integração do Logo
- [x] Fazer upload do logo para armazenamento
- [x] Usar logo no Header (versão pequena)
- [x] Usar logo na Hero Section (versão grande com descrição embaixo)
- [x] Testar responsividade do logo em diferentes tamanhos
