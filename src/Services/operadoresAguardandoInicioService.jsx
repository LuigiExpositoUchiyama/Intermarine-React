const operadoresAguardandoInicioMock = [
  {
    id: 1,

    name: 'ANA PAULA COSTA',

    initials: 'AC',

    ra: '123458',

    area: 'Laminação',

    leader: 'Carlos Silva',

    status: 'Aguardando',

    boatId: 1,

    boat: 'Intermarine 60',

    of: 'OF-00145',

    phase: 'Laminação',

    time: '00:35',
  },

  {
    id: 2,

    name: 'LUCAS FERREIRA',

    initials: 'LF',

    ra: '123459',

    area: 'Laminação',

    leader: 'Carlos Silva',

    status: 'Aguardando',

    boatId: 1,

    boat: 'Intermarine 60',

    of: 'OF-00146',

    phase: 'Laminação',

    time: '00:50',
  },

  {
    id: 3,

    name: 'FERNANDA LIMA',

    initials: 'FL',

    ra: '123461',

    area: 'Pré-Montagem',

    leader: 'Marcos Oliveira',

    status: 'Aguardando',

    boatId: 1,

    boat: 'Intermarine 60',

    of: 'OF-00147',

    phase: 'Pré-Montagem',

    time: '01:15',
  },

  {
    id: 4,

    name: 'CARLOS HENRIQUE',

    initials: 'CH',

    ra: '123462',

    area: 'Pintura',

    leader: 'João Souza',

    status: 'Aguardando',

    boatId: 2,

    boat: 'Intermarine 70',

    of: 'OF-00210',

    phase: 'Pintura',

    time: '00:20',
  },

  {
    id: 5,

    name: 'PEDRO ALVES',

    initials: 'PA',

    ra: '123463',

    area: 'Montagem Final E1',

    leader: 'João Souza',

    status: 'Aguardando',

    boatId: 2,

    boat: 'Intermarine 70',

    of: 'OF-00211',

    phase: 'Montagem Final E1',

    time: '00:45',
  },
];

export async function getWaitingOperatorsByBoat(boatId) {
  return operadoresAguardandoInicioMock.filter(
    (operator) => operator.boatId === Number(boatId),
  );
}

export async function getWaitingOperators() {
  return operadoresAguardandoInicioMock;
}
