import { useCart } from '../context/CartContext';

export function Navbar() {
  const { itemCount, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍣</span>
          <div>
            <h1 className="font-japonesa text-white font-bold text-xl leading-none tracking-wide">
              Sakura
            </h1>
            <p className="font-japonesa text-red-500 text-xs tracking-widest uppercase">
              Japanese Restaurant
            </p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#menu" className="text-gray-300 hover:text-white text-sm tracking-wide transition-colors">
            Cardápio
          </a>
          <a href="#sobre" className="text-gray-300 hover:text-white text-sm tracking-wide transition-colors">
            Sobre
          </a>
          <a href="#contato" className="text-gray-300 hover:text-white text-sm tracking-wide transition-colors">
            Contato
          </a>
        </nav>

        {/* Cart button */}
        <button
          onClick={openCart}
          className="relative flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="hidden sm:inline">Carrinho</span>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
