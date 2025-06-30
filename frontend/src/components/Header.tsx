import React from 'react';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface HeaderProps {
  onCartClick: () => void;
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick, onLoginClick }) => {
  const { cliente, logout, isAuthenticated } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">
              Cardápio Digital
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User size={20} className="text-gray-600" />
                  <span className="text-sm text-gray-700">{cliente?.nome}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="btn-primary"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;