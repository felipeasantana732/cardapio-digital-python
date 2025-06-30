import React from 'react';
import { Plus } from 'lucide-react';
import { ItemMenu } from '../types';
import { useCart } from '../contexts/CartContext';

interface MenuCardProps {
  item: ItemMenu;
}

const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(item);
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg text-gray-900">{item.nome}</h3>
        <span className="text-lg font-bold text-primary-600">
          R$ {item.preco.toFixed(2)}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {item.descricao}
      </p>
      
      <button
        onClick={handleAddToCart}
        className="w-full btn-primary flex items-center justify-center space-x-2"
      >
        <Plus size={18} />
        <span>Adicionar ao Pedido</span>
      </button>
    </div>
  );
};

export default MenuCard;