# 🍣 Sakura — Restaurante Japonês

Cardápio online com carrinho de pedidos, construído em **React + TypeScript + Tailwind CSS v4 + Vite**.

---

## 🚀 Como rodar o projeto

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173` no navegador.

---

## 📁 Estrutura de arquivos

```
src/
├── types/
│   └── index.ts              # Tipos TypeScript (Product, CartItem, Category...)
├── data/
│   └── products.ts           # Dados mockados dos produtos
├── services/
│   └── productService.ts     # Camada de serviço (integração futura com API)
├── context/
│   └── CartContext.tsx        # Estado global do carrinho
├── components/
│   ├── Navbar.tsx             # Cabeçalho com logo e botão do carrinho
│   ├── CategoryFilter.tsx     # Filtro de categorias (Entradas, Makis, etc.)
│   ├── ProductCard.tsx        # Card individual de cada produto
│   └── CartSidebar.tsx        # Painel lateral do carrinho
├── pages/
│   └── MenuPage.tsx           # Página principal (hero + cardápio + sobre + contato)
├── App.tsx                    # Raiz da aplicação
├── App.css                    # Animações CSS (slide do carrinho, fade)
└── index.css                  # Estilos globais + import do Tailwind
```

---

## 📄 O que cada arquivo faz

### `src/types/index.ts`
Define todos os tipos TypeScript usados no projeto.

| Tipo | Descrição |
|------|-----------|
| `Category` | União de strings com as categorias do cardápio |
| `Product` | Estrutura de um produto (id, nome, preço, imagem, etc.) |
| `CartItem` | Um produto + quantidade dentro do carrinho |
| `Cart` | Lista de itens, total e contagem |

> **Campos do `Product`:**
> - `id` — identificador único
> - `name` — nome do produto
> - `description` — descrição curta
> - `price` — preço em reais
> - `image` — URL da imagem
> - `imageHeight?` — altura customizada da imagem no card (ex: `'h-64'`). Opcional — padrão é `h-48`
> - `category` — categoria do produto
> - `available` — se está disponível para pedido
> - `featured?` — exibe o badge "Destaque". Opcional

---

### `src/data/products.ts`
Lista com todos os produtos do cardápio. É aqui que você:

- ✏️ **Altera nome, descrição ou preço** de um produto
- 🖼️ **Troca a imagem** (campo `image`)
- 📏 **Muda o tamanho da imagem** de um produto específico (campo `imageHeight`)
- ➕ **Adiciona novos produtos**
- 🔴 **Desativa um produto** (`available: false`)
- ⭐ **Marca como destaque** (`featured: true`)

**Exemplo de produto:**
```ts
{
  id: '1',
  name: 'Edamame',
  description: 'Grãos de soja cozidos no vapor com sal marinho.',
  price: 18.90,
  image: 'https://url-da-imagem.jpg',
  imageHeight: 'h-64',  // opcional — remove a linha para usar o padrão
  category: 'Entradas',
  available: true,
  featured: false,
}
```

**Para adicionar uma nova categoria**, edite também `src/types/index.ts` e adicione o novo valor ao tipo `Category`.

---

### `src/services/productService.ts`
Camada intermediária entre os dados e a interface. Todas as funções retornam `Promise`, simulando uma chamada de API.

| Função | O que faz |
|--------|-----------|
| `getProducts()` | Retorna todos os produtos |
| `getProductsByCategory(category)` | Retorna produtos de uma categoria |
| `getFeaturedProducts()` | Retorna apenas os produtos em destaque |
| `getProductById(id)` | Retorna um produto pelo id |

> **🔌 Para integrar com backend:** substitua o conteúdo de cada função pelo `fetch` correspondente. Os comentários `// TODO (backend)` marcam exatamente onde fazer isso.

**Exemplo de integração:**
```ts
export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products`);
  return response.json();
}
```

Basta descomentar a linha `// const API_BASE_URL = ...` no topo do arquivo e preencher com a URL da sua API.

---

### `src/context/CartContext.tsx`
Gerencia o estado global do carrinho usando `useReducer`. Disponibiliza para toda a aplicação:

| Valor/Função | Descrição |
|--------------|-----------|
| `items` | Lista de itens no carrinho |
| `itemCount` | Quantidade total de itens |
| `total` | Valor total em reais |
| `isOpen` | Se o painel do carrinho está visível |
| `addItem(product)` | Adiciona um produto (ou incrementa a quantidade) |
| `removeItem(productId)` | Remove um produto do carrinho |
| `updateQuantity(productId, qty)` | Altera a quantidade de um item |
| `clearCart()` | Limpa todo o carrinho |
| `openCart()` / `closeCart()` | Abre/fecha o painel lateral |

**Para usar em qualquer componente:**
```tsx
import { useCart } from '../context/CartContext';

const { addItem, total } = useCart();
```

---

### `src/components/Navbar.tsx`
Cabeçalho fixo no topo da página.

- Logo com emoji e nome do restaurante
- Links de navegação (ocultos no mobile)
- Botão do carrinho com contador de itens

> **Para alterar:** nome do restaurante, links do menu, cores.

---

### `src/components/CategoryFilter.tsx`
Barra de filtro horizontal com botões para cada categoria.

- Scroll horizontal no mobile
- Botão "Todos" para exibir todos os produtos
- Destaca a categoria selecionada em vermelho

> **Para adicionar categorias:** edite o array `categories` neste arquivo e adicione o novo valor no tipo `Category` em `src/types/index.ts`.

---

### `src/components/ProductCard.tsx`
Card visual de cada produto no grid.

- Imagem com hover de zoom
- Badge "Destaque" para produtos com `featured: true`
- Overlay "Indisponível" para produtos com `available: false`
- Botão **Adicionar** que coloca o item no carrinho e abre o painel

> **Para alterar a altura da imagem globalmente:** troque o valor padrão `h-48` no componente.
> **Para alterar a imagem de um produto específico:** use o campo `imageHeight` no produto em `products.ts`.

---

### `src/components/CartSidebar.tsx`
Painel lateral deslizante do carrinho.

- Abre sobre a página com overlay escurecido
- Lista todos os itens com controles de quantidade (+/-)
- Botão de remover item individualmente
- Exibe o subtotal
- Botão **Finalizar Pedido** (pronto para conectar ao checkout)
- Botão **Limpar carrinho**

> **Para integrar o checkout:** substitua o `alert(...)` no botão "Finalizar Pedido" pela chamada à sua API de pedidos.

---

### `src/pages/MenuPage.tsx`
Única página da aplicação, dividida em seções:

| Seção | id | Descrição |
|-------|----|-----------|
| Hero | — | Banner principal com imagem de fundo e chamada para ação |
| Cardápio | `#menu` | Grid de produtos com filtro por categoria |
| Sobre | `#sobre` | História do restaurante e estatísticas |
| Contato | `#contato` | Endereço, horário e telefone |
| Footer | — | Copyright |

> **Para editar as informações do restaurante** (endereço, horário, telefone, história): altere diretamente as strings neste arquivo.

---

### `src/App.tsx`
Ponto de entrada da aplicação. Envolve tudo com o `CartProvider` e renderiza os três elementos principais:

```tsx
<CartProvider>       // Estado global do carrinho
  <Navbar />         // Cabeçalho
  <CartSidebar />    // Painel do carrinho
  <MenuPage />       // Conteúdo da página
</CartProvider>
```

> **Para adicionar novas páginas** (ex: página de login, histórico de pedidos): importe e renderize aqui, idealmente com o `react-router-dom`.

---

## 🎨 Estilização

| Arquivo | O que controla |
|---------|----------------|
| `src/index.css` | Estilos globais, reset CSS, scrollbar customizada |
| `src/App.css` | Animações: `cart-slide-in` e `overlay-fade-in` |
| Classes Tailwind | Toda a estilização dos componentes |

A cor principal do projeto é **vermelho** (`red-600`). Para trocar a identidade visual, substitua as classes `red-600`, `red-500` e `red-700` pela cor desejada em todos os componentes.

---

## 🔌 Roteiro de integração com backend

1. **Produtos** → edite `src/services/productService.ts`, substituindo os dados mock por chamadas `fetch`
2. **Carrinho / Pedidos** → no botão "Finalizar Pedido" em `src/components/CartSidebar.tsx`, envie `items` e `total` para a API
3. **Autenticação** → adicione um `AuthContext` similar ao `CartContext` e proteja as rotas
4. **Variável de ambiente** → crie um arquivo `.env` na raiz com `VITE_API_URL=https://sua-api.com`

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| React | 19 | Interface |
| TypeScript | 5.9 | Tipagem |
| Tailwind CSS | 4.2 | Estilização |
| Vite | 7.3 | Build e dev server |