export interface Categoria {
  id: number;
  nome: string;
}

export interface ItemMenu {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria_id: number;
}

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

export interface Pagamento {
  valor: number;
  forma_pagamento: string;
}

export interface ItemPedido {
  id: number;
  item_menu: ItemMenu;
  quantidade: number;
  preco_unitario: number;
}

export interface Pedido {
  id: number;
  id_cliente: number;
  data_pedido: string;
  valor_total: number;
  status: string;
  itens: ItemPedido[];
  pagamentos: Pagamento[];
  valor_pago: number;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface PedidoCreate {
  id_cliente: number;
  itens: number[];
}

export interface PagamentoCreate {
  id_pedido: number;
  valor: number;
  forma_pagamento: string;
}