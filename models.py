from pydantic import BaseModel, Field
from typing import List, Optional

# --- Modelo de Pagamento ---

class Pagamento(BaseModel):
    valor: float
    forma_pagamento: str # Ex: "cartao-debito", "pix", "dinheiro"

# --- Modelos de Categoria ---

class Categoria(BaseModel):
    id: int
    nome: str

class CategoriaCreate(BaseModel):
    nome: str

class CategoriaUpdate(BaseModel):
    nome: str

# --- Modelos de Item do Menu ---

class ItemMenu(BaseModel):
    id: int
    nome: str
    descricao: str
    preco: float
    categoria_id: int

class ItemPedido(BaseModel):
    item_menu: ItemMenu
    quantidade: int
    preco_unitario: float

class ItemMenuCreate(BaseModel):
    nome: str
    descricao: str
    preco: float
    categoria_id: int

class ItemMenuUpdate(BaseModel):
    nome: str | None = None
    descricao: str | None = None
    preco: float | None = None
    categoria_id: int | None = None

# --- Modelo de Pedido ---

class Pedido(BaseModel):
    id: int
    id_cliente: int
    data_pedido: str
    valor_total: float
    status: str = Field(default="Pendente")
    itens: List[ItemPedido]
    pagamentos: Optional[List[Pagamento]] = []
    valor_pago: float = Field(default=0)

class PedidoCreateItem(BaseModel):
    item_id: int
    quantidade: int

class PedidoCreate(BaseModel):
    id_cliente: int
    itens: List[PedidoCreateItem]

# --- Modelos de Cliente e Login ---

class PagamentoCreate(BaseModel):
    id_pedido: int
    valor: float
    forma_pagamento: str


class Cliente(BaseModel):
    id: int
    nome: str
    email: str
    senha: str

class LoginRequest(BaseModel):
    email: str
    senha: str