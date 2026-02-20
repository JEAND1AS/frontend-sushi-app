import type { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCart();

  function handleAdd() {
    addItem(product);
    openCart();
  }

  return (
    <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden flex flex-col group hover:ring-1 hover:ring-red-500/50 transition-all duration-300">
      {/* Imagem */}
      <div className={`relative overflow-hidden h-48 ${!product.available ? 'grayscale' : ''}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.featured && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Destaque
          </span>
        )}
        {!product.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-medium text-sm">Indisponível</span>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-white font-semibold text-base leading-tight">{product.name}</h3>
          <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full shrink-0">
            {product.category}
          </span>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed flex-1 mt-1 mb-4">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-white font-bold text-lg">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
          <button
            onClick={handleAdd}
            disabled={!product.available}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
