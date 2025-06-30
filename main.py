from models import Categoria, ItemMenu, Pedido, LoginRequest, Pagamento, PagamentoCreate, PedidoCreate, ItemPedido
from data import categorias, itens_menu, clientes, pedidos
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import (
    Categoria, CategoriaCreate, CategoriaUpdate,
    ItemMenu, ItemMenuCreate, ItemMenuUpdate
)
from datetime import datetime

app = FastAPI(title="Cardapio Digital API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- CATEGORIAS --------------------
@app.get("/categorias")
def listar_categorias():
    return categorias

@app.post("/categorias", status_code=201)
def criar_categoria(cat: CategoriaCreate):
    novo_id = (max([c.id for c in categorias]) + 1) if categorias else 1
    nova = Categoria(id=novo_id, nome=cat.nome)
    categorias.append(nova)
    return nova

@app.put("/categorias/{cat_id}")
def editar_categoria(cat_id: int, cat: CategoriaUpdate):
    for c in categorias:
        if c.id == cat_id:
            c.nome = cat.nome
            return c
    raise HTTPException(404, "Categoria não encontrada")

@app.delete("/categorias/{cat_id}", status_code=204)
def remover_categoria(cat_id: int):
    global categorias, itens_menu
    categorias = [c for c in categorias if c.id != cat_id]
    # opcional: remover também itens ligados
    itens_menu = [i for i in itens_menu if i.categoria_id != cat_id]
    return {"detail": "Categoria removida"}


# -------------------- ITENS DO MENU --------------------
@app.post("/menu", status_code=201)
def criar_item(item: ItemMenuCreate):
    # precisa existir categoria
    if not any(c.id == item.categoria_id for c in categorias):
        raise HTTPException(404, "Categoria não encontrada")
    novo_id = (max([i.id for i in itens_menu]) + 1) if itens_menu else 1
    novo = ItemMenu(id=novo_id, **item.model_dump())
    itens_menu.append(novo)
    return novo

@app.put("/menu/{item_id}")
def editar_item(item_id: int, dados: ItemMenuUpdate):
    for i in itens_menu:
        if i.id == item_id:
            update = dados.model_dump(exclude_none=True)
            # se mudar categoria, checar se existe
            if "categoria_id" in update and not any(
                c.id == update["categoria_id"] for c in categorias
            ):
                raise HTTPException(404, "Categoria não encontrada")
            for k, v in update.items():
                setattr(i, k, v)
            return i
    raise HTTPException(404, "Item não encontrado")

@app.delete("/menu/{item_id}", status_code=204)
def remover_item(item_id: int):
    global itens_menu
    itens_menu = [i for i in itens_menu if i.id != item_id]
    return

@app.get("/menu")
def listar_menu():
    return itens_menu


# ---- Login ----
@app.post("/login")
def login(request: LoginRequest):
    for cliente in clientes:
        if cliente.senha == request.senha and cliente.email == request.email:
            return {"mensagem": "Login bem-sucedido", "cliente": cliente}
    raise HTTPException(status_code=401, detail="Credenciais inválidas")


# ---- Pedidos ----

@app.post("/pedidos", status_code=201)
def criar_pedido(pedido_create: PedidoCreate):
    if not any(c.id == pedido_create.id_cliente for c in clientes):
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    # Calcula o valor total do pedido e constrói a lista de ItemPedido
    itens_do_pedido = []
    valor_total = 0
    for item_data in pedido_create.itens:
        item_menu = next((i for i in itens_menu if i.id == item_data.item_id), None)
        if not item_menu:
            raise HTTPException(status_code=404, detail=f"Item de menu com id {item_data.item_id} não encontrado")
        
        item_pedido = ItemPedido(
            item_menu=item_menu,
            quantidade=item_data.quantidade,
            preco_unitario=item_menu.preco # Preço unitário no momento do pedido
        )
        itens_do_pedido.append(item_pedido)
        valor_total += item_pedido.quantidade * item_pedido.preco_unitario

    novo_id = (max([p.id for p in pedidos]) + 1) if pedidos else 1
    novo_pedido = Pedido(
        id=novo_id,
        id_cliente=pedido_create.id_cliente,
        data_pedido=datetime.now().isoformat(),
        valor_total=valor_total,
        status="Pendente", # Status inicial do pedido
        itens=itens_do_pedido,
        pagamentos=[],
        valor_pago=0
    )
    pedidos.append(novo_pedido)
    return novo_pedido

@app.get("/pedidos/cliente/{cliente_id}")
def listar_pedidos_por_cliente(cliente_id: int):
    pedidos_cliente = [p for p in pedidos if p.id_cliente == cliente_id]
    if not pedidos_cliente:
        raise HTTPException(status_code=404, detail="Nenhum pedido encontrado para este cliente")
    return pedidos_cliente

@app.get("/pedidos")
def listar_pedidos():
    return pedidos

@app.get("/pedidos/{pedido_id}")
def obter_pedido(pedido_id: int):
    for pedido in pedidos:
        if pedido.id == pedido_id:
            return pedido
    raise HTTPException(status_code=404, detail="Pedido não encontrado")

# ---- Pagamentos ------

@app.post("/pagamento")
def fazer_pagamento(pagamento: PagamentoCreate):
    for pedido in pedidos:
        if pedido.id == pagamento.id_pedido:
            pedido.pagamentos.append(Pagamento(valor=pagamento.valor, forma_pagamento=pagamento.forma_pagamento))
            pedido.valor_pago += pagamento.valor
            return {"mensagem": "Pagamento realizado com sucesso.", "pagamento": pagamento}
    raise HTTPException(status_code=404, detail="Pedido não encontrado")

@app.get("/pagamentos")
def listar_pagamentos():
    todos_pagamentos = []
    for pedido in pedidos:
        todos_pagamentos.extend(pedido.pagamentos)
    return todos_pagamentos

