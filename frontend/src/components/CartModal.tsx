import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { pedidoService } from '../services/api';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const { cliente, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFinalizarPedido = async () => {
    if (!isAuthenticated || !cliente) {
      alert('Você precisa estar logado para fazer um pedido');
      return;
    }

    setLoading(true);
    try {
      const itensParaPedido = items.map(item => ({
        item_id: item.id,
        quantidade: item.quantidade,
      }));

      await pedidoService.criar({
        id_cliente: cliente.id,
        itens: itensParaPedido,
      });

      setSuccess(true);
      clearCart();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      alert('Erro ao criar pedido');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md mx-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Seu Pedido</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {success ? (
            <div className="text-center py-8">
              <ShoppingBag size={48} className="mx-auto text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-green-600 mb-2">
                Pedido realizado com sucesso!
              </h3>
              <p className="text-gray-600">
                Seu pedido foi enviado para a cozinha.
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Seu carrinho está vazio</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.nome}</h4>
                    <p className="text-sm text-gray-600">
                      R$ {item.preco.toFixed(2)} cada
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    
                    <span className="w-8 text-center font-medium">
                      {item.quantidade}
                    </span>
                    
                    <button
                      onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 hover:bg-red-100 text-red-600 rounded-full transition-colors ml-2"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && !success && (
          <div className="border-t p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-primary-600">
                R$ {total.toFixed(2)}
              </span>
            </div>
            
            <button
              onClick={handleFinalizarPedido}
              disabled={loading || !isAuthenticated}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Finalizando...' : 'Finalizar Pedido'}
            </button>
            
            {!isAuthenticated && (
              <p className="text-sm text-gray-600 text-center mt-2">
                Faça login para finalizar o pedido
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;