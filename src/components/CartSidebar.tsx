import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, clearCart } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-40 overlay-fade-in"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <aside className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-[#111] z-50 flex flex-col shadow-2xl cart-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-white font-bold text-xl">Seu Pedido</h2>
          <button
            onClick={closeCart}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <span className="text-5xl">🍱</span>
              <p className="text-gray-400">Seu carrinho está vazio.</p>
              <p className="text-gray-600 text-sm">Adicione itens do cardápio para começar.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-3 bg-white/5 rounded-xl p-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-semibold truncate">{item.product.name}</h4>
                  <p className="text-red-400 text-sm font-medium mt-0.5">
                    R$ {item.product.price.toFixed(2).replace('.', ',')}
                  </p>
                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-lg leading-none"
                    >
                      −
                    </button>
                    <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-lg leading-none"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="ml-auto text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/10 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-white font-bold text-lg">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <p className="text-gray-600 text-xs">
              Frete e taxas serão calculados na finalização.
            </p>
            <button
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors"
              onClick={() => {
                closeCart();
                navigate('/checkout');
              }}
            >
              Finalizar Pedido
            </button>
            <button
              className="w-full text-gray-500 hover:text-gray-300 text-sm transition-colors"
              onClick={clearCart}
            >
              Limpar carrinho
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
