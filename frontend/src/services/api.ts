import axios from 'axios';
import { 
  Categoria, 
  ItemMenu, 
  Cliente, 
  Pedido, 
  LoginRequest, 
  PedidoCreate, 
  PagamentoCreate 
} from '../types';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const categoriaService = {
  listar: () => api.get<Categoria[]>('/categorias'),
};

export const menuService = {
  listar: () => api.get<ItemMenu[]>('/menu'),
};

export const authService = {
  login: (credentials: LoginRequest) => api.post<{ mensagem: string; cliente: Cliente }>('/login', credentials),
};

export const pedidoService = {
  criar: (pedido: PedidoCreate) => api.post<Pedido>('/pedidos', pedido),
  listar: () => api.get<Pedido[]>('/pedidos'),
  obter: (id: number) => api.get<Pedido>(`/pedidos/${id}`),
};

export const pagamentoService = {
  fazer: (pagamento: PagamentoCreate) => api.post('/pagamento', pagamento),
};

export default api;