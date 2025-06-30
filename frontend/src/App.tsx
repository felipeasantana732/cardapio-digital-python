import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import MenuCard from './components/MenuCard';
import CategoryFilter from './components/CategoryFilter';
import LoginModal from './components/LoginModal';
import CartModal from './components/CartModal';
import OrdersModal from './components/OrdersModal';
import { categoriaService, menuService } from './services/api';
import { Categoria, ItemMenu } from './types';

function App() {
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [menuItems, setMenuItems] = useState<ItemMenu[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, menuResponse] = await Promise.all([
          categoriaService.listar(),
          menuService.listar()
        ]);
        
        setCategories(categoriesResponse.data);
        setMenuItems(menuResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.categoria_id === selectedCategory)
    : menuItems;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Header
            onCartClick={() => setIsCartModalOpen(true)}
            onLoginClick={() => setIsLoginModalOpen(true)}
            onOrdersClick={() => setIsOrdersModalOpen(true)}
          />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Nosso Cardápio
              </h2>
              <p className="text-gray-600">
                Escolha seus pratos favoritos e monte seu pedido
              </p>
            </div>

            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  Nenhum item encontrado nesta categoria.
                </p>
              </div>
            )}
          </main>

          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
          />

          <CartModal
            isOpen={isCartModalOpen}
            onClose={() => setIsCartModalOpen(false)}
          />

          <OrdersModal
            isOpen={isOrdersModalOpen}
            onClose={() => setIsOrdersModalOpen(false)}
          />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;