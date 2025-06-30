from models import Categoria, ItemMenu, Cliente, Pedido, ItemPedido
from datetime import datetime

categorias = [
    Categoria(id=1, nome="Pizzas"),
    Categoria(id=2, nome="Bebidas"),
    Categoria(id=3, nome="Sobremesas")
]

itens_menu = [
    ItemMenu(id=1, nome="Pizza Margherita", descricao="Molho de tomate, mussarela e manjericão", preco=35.50, categoria_id=1),
    ItemMenu(id=2, nome="Pizza Calabresa", descricao="Molho de tomate, mussarela e calabresa", preco=38.00, categoria_id=1),
    ItemMenu(id=3, nome="Pizza Quatro Queijos", descricao="Molho de tomate, mussarela, provolone, parmesão e gorgonzola", preco=42.00, categoria_id=1),
    ItemMenu(id=4, nome="Refrigerante", descricao="Coca-Cola, Guaraná ou Fanta", preco=6.00, categoria_id=2),
    ItemMenu(id=5, nome="Suco Natural", descricao="Laranja, abacaxi ou morango", preco=8.00, categoria_id=2),
    ItemMenu(id=6, nome="Pudim", descricao="Pudim de leite condensado", preco=10.00, categoria_id=3),
    ItemMenu(id=7, nome="Mousse de Chocolate", descricao="Mousse de chocolate meio amargo", preco=12.00, categoria_id=3)
]

clientes = [
    Cliente(id=1, nome="João da Silva", email="joao.silva@example.com", senha="123"),
    Cliente(id=2, nome="Maria Oliveira", email="maria.oliveira@example.com", senha="456"),
    Cliente(id=3, nome="Pedro Santos", email="pedro.santos@example.com", senha="789")
]

pedidos: list[Pedido] = [
    Pedido(
        id=1,
        id_cliente=1,
        data_pedido=datetime.now().isoformat(),
        valor_total=41.50,
        status="Concluido",
        itens=[
            ItemPedido(item_menu=itens_menu[0], quantidade=1, preco_unitario=35.50),
            ItemPedido(item_menu=itens_menu[3], quantidade=1, preco_unitario=6.00)
        ],
        pagamentos=[],
        valor_pago=0
    ),
    Pedido(
        id=2,
        id_cliente=2,
        data_pedido=datetime.now().isoformat(),
        valor_total=56.00,
        status="Pendente",
        itens=[
            ItemPedido(item_menu=itens_menu[1], quantidade=1, preco_unitario=38.00),
            ItemPedido(item_menu=itens_menu[4], quantidade=1, preco_unitario=8.00),
            ItemPedido(item_menu=itens_menu[5], quantidade=1, preco_unitario=10.00)
        ],
        pagamentos=[],
        valor_pago=0
    ),
    Pedido(
        id=3,
        id_cliente=1,
        data_pedido=datetime.now().isoformat(),
        valor_total=60.00,
        status="Pendente",
        itens=[
            ItemPedido(item_menu=itens_menu[2], quantidade=1, preco_unitario=42.00),
            ItemPedido(item_menu=itens_menu[3], quantidade=1, preco_unitario=6.00),
            ItemPedido(item_menu=itens_menu[6], quantidade=1, preco_unitario=12.00)
        ],
        pagamentos=[],
        valor_pago=0
    )
]
