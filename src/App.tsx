import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { CartSidebar } from './components/CartSidebar';
import { MenuPage } from './pages/MenuPage';

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-[#0d0d0d]">
        <Navbar />
        <CartSidebar />
        <MenuPage />
      </div>
    </CartProvider>
  );
}

export default App;
