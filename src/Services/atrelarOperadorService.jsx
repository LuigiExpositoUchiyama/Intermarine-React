const operadoresAtrelamentoMock = [
  {
    id: 1,
    nome: 'ANA PAULA COSTA',
    ra: '123458',
    centroCusto: '1001',
    area: 'Laminação',
    status: 'Disponível',
    ofAtual: '-',
  },
  {
    id: 2,
    nome: 'LUCAS FERREIRA',
    ra: '123459',
    centroCusto: '1001',
    area: 'Laminação',
    status: 'Disponível',
    ofAtual: '-',
  },
  {
    id: 3,
    nome: 'FERNANDA LIMA',
    ra: '123461',
    centroCusto: '1001',
    area: 'Laminação',
    status: 'Disponível',
    ofAtual: '-',
  },
  {
    id: 4,
    nome: 'RICARDO SANTOS',
    ra: '123465',
    centroCusto: '1001',
    area: 'Laminação',
    status: 'Disponível',
    ofAtual: '-',
  },
  {
    id: 5,
    nome: 'JOÃO CARLOS SILVA',
    ra: '123456',
    centroCusto: '1001',
    area: 'Laminação',
    status: 'Ativo',
    ofAtual: 'OF-2026-00158',
  },
  {
    id: 6,
    nome: 'MARCOS ALMEIDA',
    ra: '123457',
    centroCusto: '1001',
    area: 'Laminação',
    status: 'Ativo',
    ofAtual: 'OF-2026-00187',
  },
  {
    id: 7,
    nome: 'RAFAEL OLIVEIRA',
    ra: '123460',
    centroCusto: '1001',
    area: 'Laminação',
    status: 'Ativo',
    ofAtual: 'OF-2026-00164',
  },
  {
    id: 8,
    nome: 'JULIANA MENDES',
    ra: '123468',
    centroCusto: '1001',
    area: 'Laminação',
    status: 'Ativo',
    ofAtual: 'OF-2026-00163',
  },
  {
    id: 9,
    nome: 'GABRIELA SOUZA',
    ra: '223451',
    centroCusto: '1002',
    area: 'Pré-Montagem',
    status: 'Disponível',
    ofAtual: '-',
  },
  {
    id: 10,
    nome: 'PEDRO HENRIQUE',
    ra: '223452',
    centroCusto: '1002',
    area: 'Pré-Montagem',
    status: 'Disponível',
    ofAtual: '-',
  },
  {
    id: 11,
    nome: 'BRUNO MARTINS',
    ra: '323451',
    centroCusto: '1003',
    area: 'Pintura',
    status: 'Disponível',
    ofAtual: '-',
  },
  {
    id: 12,
    nome: 'LETÍCIA ROCHA',
    ra: '423451',
    centroCusto: '1004',
    area: 'Montagem Final E1',
    status: 'Disponível',
    ofAtual: '-',
  },
];

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

function normalize(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

const atrelarOperadorService = {
  async getOperadoresPorArea(area) {
    await delay();

    const areaNormalizada = normalize(area);

    const operadores = areaNormalizada
      ? operadoresAtrelamentoMock.filter(
          (operador) => normalize(operador.area) === areaNormalizada,
        )
      : operadoresAtrelamentoMock;

    return operadores.map((operador) => ({ ...operador }));
  },

  async atrelarOperador({ ordemId, ordemCodigo, operadorId }) {
    await delay(600);

    const operador = operadoresAtrelamentoMock.find(
      (item) => item.id === operadorId,
    );

    if (!operador) {
      throw new Error('Colaborador não encontrado.');
    }

    if (operador.status !== 'Disponível') {
      throw new Error('Este colaborador já está atrelado a outra ordem.');
    }

    operador.status = 'Ativo';
    operador.ofAtual = ordemCodigo || String(ordemId);

    return {
      success: true,
      message: 'Colaborador atrelado com sucesso.',
      operador: { ...operador },
      ordemId,
    };
  },

  async desatrelarOperador(operadorId) {
    await delay(400);

    const operador = operadoresAtrelamentoMock.find(
      (item) => item.id === operadorId,
    );

    if (!operador) {
      throw new Error('Colaborador não encontrado.');
    }

    operador.status = 'Disponível';
    operador.ofAtual = '-';

    return {
      success: true,
      message: 'Colaborador desatrelado com sucesso.',
      operador: { ...operador },
    };
  },
};

export default atrelarOperadorService;
