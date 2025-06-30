import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { pedidoService } from '../services/api';
import { Pedido } from '../types';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose }) => {
  const { cliente } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && cliente?.id) {
      const fetchPedidos = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await pedidoService.listarPedidosPorCliente(cliente.id);
          setPedidos(response.data);
        } catch (err) {
          console.error('Erro ao buscar pedidos:', err);
          setError('Não foi possível carregar os pedidos. Tente novamente mais tarde.');
        } finally {
          setLoading(false);
        }
      };
      fetchPedidos();
    }
  }, [isOpen, cliente?.id]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Meus Pedidos</h2>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando pedidos...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Erro:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {!loading && !error && pedidos.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">Você ainda não fez nenhum pedido.</p>
          </div>
        )}

        {!loading && !error && pedidos.length > 0 && (
          <div className="space-y-4">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg text-gray-700">Pedido #{pedido.id}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    pedido.status === 'Concluido' ? 'bg-green-100 text-green-800' :
                    pedido.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {pedido.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">Data: {new Date(pedido.data_pedido).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500 mb-2">Total: R$ {pedido.valor_total.toFixed(2)}</p>
                
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <h4 className="font-medium text-gray-600 mb-2">Itens do Pedido:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {pedido.itens.map((item, index) => (
                      <li key={index}>
                        {item.quantidade}x {item.item_menu.nome} - R$ {item.preco_unitario.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersModal;
