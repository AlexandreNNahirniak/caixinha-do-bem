import './style.css';

const API_URL = 'http://localhost:3000/api';

let db = {
  doadores: [],
  itens: [],
  doacoes: []
};

// Busca todos os dados do MySQL
async function carregarDados() {
  try {
    const [resDoadores, resItens, resDoacoes] = await Promise.all([
      fetch(`${API_URL}/doadores`),
      fetch(`${API_URL}/itens`),
      fetch(`${API_URL}/doacoes`)
    ]);

    db.doadores = await resDoadores.json();
    db.itens = await resItens.json();
    db.doacoes = await resDoacoes.json();

    atualizarTela();
  } catch (erro) {
    console.error('Erro ao conectar na API:', erro);
  }
}

// Controle das Abas
const botoesAba = document.querySelectorAll('.aba-btn');
const conteudosAba = document.querySelectorAll('.aba-conteudo');

botoesAba.forEach((botao) => {
  botao.addEventListener('click', () => {
    botoesAba.forEach((b) => b.classList.remove('ativa'));
    conteudosAba.forEach((c) => c.classList.remove('ativa'));

    botao.classList.add('ativa');
    document.getElementById(`aba-${botao.dataset.aba}`).classList.add('ativa');
  });
});

// Cadastrar Doador no MySQL
document.getElementById('form-doador').addEventListener('submit', async (e) => {
  e.preventDefault();
  await fetch(`${API_URL}/doadores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: document.getElementById('nome-doador').value,
      telefone: document.getElementById('telefone-doador').value,
      email: document.getElementById('email-doador').value
    })
  });
  e.target.reset();
  carregarDados();
});

// Cadastrar Item no MySQL
document.getElementById('form-item').addEventListener('submit', async (e) => {
  e.preventDefault();
  await fetch(`${API_URL}/itens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: document.getElementById('nome-item').value,
      categoria: document.getElementById('categoria-item').value
    })
  });
  e.target.reset();
  carregarDados();
});

// Registrar Doação no MySQL
document.getElementById('form-doacao').addEventListener('submit', async (e) => {
  e.preventDefault();
  await fetch(`${API_URL}/doacoes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      doador_id: document.getElementById('select-doador').value,
      item_id: document.getElementById('select-item').value,
      quantidade: document.getElementById('qtd-doacao').value,
      observacao: document.getElementById('obs-doacao').value
    })
  });
  e.target.reset();
  carregarDados();
});

// Excluir registro do MySQL
window.removerRegistro = async (tipo, id) => {
  await fetch(`${API_URL}/${tipo}/${id}`, { method: 'DELETE' });
  carregarDados();
};

// Renderiza listas e menus de seleção
function atualizarTela() {
  const selectDoador = document.getElementById('select-doador');
  const selectItem = document.getElementById('select-item');

  selectDoador.innerHTML = '<option value="">Selecione um doador...</option>' +
    db.doadores.map((d) => `<option value="${d.id}">${d.nome}</option>`).join('');

  selectItem.innerHTML = '<option value="">Selecione um item...</option>' +
    db.itens.map((i) => `<option value="${i.id}">${i.nome} (${i.categoria})</option>`).join('');

  const listaDoacoes = document.getElementById('lista-doacoes');
  listaDoacoes.innerHTML = db.doacoes.length === 0
    ? '<p class="vazio">Nenhuma doação registrada.</p>'
    : db.doacoes.map((d) => {
      const dataFormatada = new Date(d.data_doacao).toLocaleDateString('pt-BR');
      return `
        <div class="item-lista">
          <div class="item-info">
            <strong>${d.quantidade}x ${d.item}</strong>
            <span>Doador: ${d.doador} • Data: ${dataFormatada} ${d.observacao ? `• ${d.observacao}` : ''}</span>
          </div>
          <button class="btn-excluir" onclick="removerRegistro('doacoes', ${d.id})">Excluir</button>
        </div>
      `;
    }).join('');

  const listaDoadores = document.getElementById('lista-doadores');
  listaDoadores.innerHTML = db.doadores.length === 0
    ? '<p class="vazio">Nenhum doador cadastrado.</p>'
    : db.doadores.map((d) => `
      <div class="item-lista">
        <div class="item-info">
          <strong>${d.nome}</strong>
          <span>${d.telefone} ${d.email ? `• ${d.email}` : ''}</span>
        </div>
        <button class="btn-excluir" onclick="removerRegistro('doadores', ${d.id})">Excluir</button>
      </div>
    `).join('');

  const listaItens = document.getElementById('lista-itens');
  listaItens.innerHTML = db.itens.length === 0
    ? '<p class="vazio">Nenhum item cadastrado.</p>'
    : db.itens.map((i) => `
      <div class="item-lista">
        <div class="item-info">
          <strong>${i.nome}</strong>
          <span>Categoria: ${i.categoria}</span>
        </div>
        <button class="btn-excluir" onclick="removerRegistro('itens', ${i.id})">Excluir</button>
      </div>
    `).join('');
}

carregarDados();
