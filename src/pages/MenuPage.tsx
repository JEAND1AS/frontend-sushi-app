import { useEffect, useState } from 'react';
import type { Category, Product } from '../types';
import { getProducts } from '../services/productService';
import { CategoryFilter } from '../components/CategoryFilter';
import { ProductCard } from '../components/ProductCard';

export function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Todos'>('Todos');

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    selectedCategory === 'Todos'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <main>
      {/* Hero */}
      <section className="relative flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1600&q=80"
          alt="Sushi"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0d0d0d]" />
        <div className="relative text-center px-5 w-full max-w-2xl mx-auto">
          <p className="text-red-400 text-xs sm:text-sm tracking-[0.3em] uppercase mb-2 sm:mb-3 font-medium mt-3">
            Autêntica culinária japonesa
          </p>
          <h2 className="text-white text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
            Uma experiência<br />
            <span className="text-red-500">única</span> a cada peça
          </h2>
          <p className="text-gray-300 text-sm sm:text-lg max-w-lg mx-auto hidden sm:block">
            Ingredientes frescos, técnicas tradicionais e um toque de modernidade em cada prato.
          </p>
          <a
            href="#menu"
            className="inline-block mt-5 sm:mt-8 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl transition-colors text-sm sm:text-base"
          >
            Ver Cardápio
          </a>
        </div>
      </section>

      {/* Menu section */}
      <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-white text-2xl sm:text-3xl font-bold mb-1">Cardápio</h2>
          <p className="text-gray-500">Escolha suas peças favoritas e monte seu pedido</p>
        </div>

        {/* Category filter */}
        <div className="mb-8">
          <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />
        </div>

        {/* Product grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-20">Nenhum item encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Sobre section */}
      <section id="sobre" className="bg-[#111] py-12 sm:py-16 mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500 text-xs sm:text-sm tracking-widest uppercase mb-3">Nossa história</p>
          <h2 className="text-white text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">O Restaurante Sakura</h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Fundado em 2010, o Sakura traz a essência da culinária japonesa para o Brasil.
            Nossos chefs são treinados no Japão e utilizam apenas ingredientes selecionados
            para garantir uma experiência gastronômica autêntica e inesquecível.
          </p>
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-10 sm:mt-12">
            {[
              { value: '15+', label: 'Anos de experiência' },
              { value: '200+', label: 'Itens no cardápio' },
              { value: '50k+', label: 'Clientes satisfeitos' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-red-500 text-2xl sm:text-3xl font-bold">{value}</p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contato section */}
      <section id="contato" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 text-center">
          {[
            {
              icon: '📍',
              title: 'Endereço',
              lines: ['Rua das Flores, 123', 'São Paulo – SP'],
            },
            {
              icon: '🕐',
              title: 'Horário',
              lines: ['Terça a Domingo', '12h às 23h'],
            },
            {
              icon: '📞',
              title: 'Contato',
              lines: ['(11) 99999-9999', 'contato@sakura.com.br'],
            },
          ].map(({ icon, title, lines }) => (
            <div key={title} className="bg-[#1a1a1a] rounded-2xl p-6">
              <span className="text-3xl">{icon}</span>
              <h3 className="text-white font-semibold mt-3 mb-2">{title}</h3>
              {lines.map((line) => (
                <p key={line} className="text-gray-400 text-sm">{line}</p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} Sakura Japanese Restaurant. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
