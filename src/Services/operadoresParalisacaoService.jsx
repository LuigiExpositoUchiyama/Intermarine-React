const operadoresParalisacaoMock = [
  {
    id: 1,
    name: 'ANA PAULA COSTA',
    initials: 'AP',
    ra: '123458',
    area: 'Laminação',
    leader: 'Carlos Silva',
    of: 'OF-00145-01',
    boat: 'Lancha Oceanic',
    phase: 'Laminação',
    reason: 'Falta de material',
    time: '01:35',
    start: '08:20',
    status: 'Paralisado',
  },

  {
    id: 2,
    name: 'LUCAS FERREIRA',
    initials: 'LF',
    ra: '123459',
    area: 'Pintura',
    leader: 'João Santos',
    of: 'OF-00180-02',
    boat: 'Intermarine 60',
    phase: 'Pintura',
    reason: 'Manutenção',
    time: '00:45',
    start: '09:10',
    status: 'Paralisado',
  },

  {
    id: 3,
    name: 'JOÃO CARLOS SILVA',
    initials: 'JC',
    ra: '123456',
    area: 'Pré-Montagem',
    leader: 'Marcos Lima',
    of: 'OF-00155-01',
    boat: 'Intermarine 50',
    phase: 'Pré-Montagem',
    reason: 'Aguardando liberação',
    time: '02:10',
    start: '07:45',
    status: 'Paralisado',
  },

  {
    id: 4,
    name: 'MARCOS ALMEIDA',
    initials: 'MA',
    ra: '123457',
    area: 'Montagem Final E1',
    leader: 'Carlos Souza',
    of: 'OF-00187-03',
    boat: 'Intermarine 70',
    phase: 'Montagem Final E1',
    reason: 'Problema equipamento',
    time: '00:55',
    start: '09:00',
    status: 'Paralisado',
  },

  {
    id: 5,
    name: 'RAFAEL OLIVEIRA',
    initials: 'RO',
    ra: '123460',
    area: 'Laminação',
    leader: 'Carlos Silva',
    of: 'OF-00164-01',
    boat: 'Oceanic',
    phase: 'Laminação',
    reason: 'Falta de material',
    time: '01:20',
    start: '08:40',
    status: 'Paralisado',
  },
];

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getOperatorsStop() {
  await delay();

  return operadoresParalisacaoMock.map((item) => ({
    ...item,
  }));
}

export async function removeOperatorStop(id, motivo) {
  await delay(500);

  const operator = operadoresParalisacaoMock.find((item) => item.id === id);

  if (!operator) {
    throw new Error('Operador não encontrado.');
  }

  return {
    success: true,

    message: 'Paralisação retirada com sucesso.',

    operator,

    motivo,
  };
}
