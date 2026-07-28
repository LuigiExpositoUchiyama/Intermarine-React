const operatorsStatus = [
  {
    id: 1,

    name: 'João Santos',
    ra: '12345',
    initials: 'JS',

    status: 'Trabalhando',

    area: 'Laminação',

    leader: 'Carlos Lima',

    of: 'OF-2025-0087',

    boat: 'Ventus 38',

    phase: 'Laminação',

    startTime: '07:35',

    time: '03:25h',
  },

  {
    id: 2,

    name: 'Maria Camila',
    ra: '12398',
    initials: 'MC',

    status: 'Trabalhando',

    area: 'Pré Montagem',

    leader: 'Roberto Silva',

    of: 'OF-2025-0087',

    boat: 'Ventus 38',

    phase: 'Pré Montagem',

    startTime: '07:20',

    time: '03:40h',
  },

  {
    id: 3,

    name: 'Rafael Pereira',
    ra: '12567',
    initials: 'RP',

    status: 'Trabalhando',

    area: 'Pintura',

    leader: 'Paulo Mendes',

    of: 'OF-2025-0086',

    boat: 'Solaris 44',

    phase: 'Pintura',

    startTime: '06:50',

    time: '04:10h',
  },

  {
    id: 4,

    name: 'Fernando Lima',
    ra: '12411',
    initials: 'FL',

    status: 'Aguardando',

    area: 'Montagem Final',

    leader: 'Carlos Lima',

    of: 'OF-2025-0085',

    boat: 'Oceanus 50',

    phase: '-',

    startTime: '-',

    time: '00:45h',
  },

  {
    id: 5,

    name: 'Ana Paula',
    ra: '12500',
    initials: 'AP',

    status: 'Aguardando',

    area: 'Piscina',

    leader: 'Marcos Oliveira',

    of: '-',

    boat: '-',

    phase: '-',

    startTime: '-',

    time: '01:20h',
  },

  {
    id: 6,

    name: 'Gabriel Barbosa',
    ra: '12622',
    initials: 'GB',

    status: 'Férias',

    area: 'Laminação',

    leader: 'Carlos Lima',

    of: '-',

    boat: '-',

    phase: '-',

    startTime: '-',

    time: '-',
  },

  {
    id: 7,

    name: 'Carlos Mendes',
    ra: '12980',
    initials: 'CM',

    status: 'Afastado',

    area: 'Pré Montagem',

    leader: 'Roberto Silva',

    of: '-',

    boat: '-',

    phase: '-',

    startTime: '-',

    time: '-',
  },

  {
    id: 8,

    name: 'Pedro Henrique',
    ra: '12744',
    initials: 'PH',

    status: 'Suspenso',

    area: 'Qualidade',

    leader: 'Fernanda Costa',

    of: '-',

    boat: '-',

    phase: '-',

    startTime: '-',

    time: '-',
  },

  {
    id: 9,

    name: 'Lucas Martins',
    ra: '12913',
    initials: 'LM',

    status: 'Trabalhando',

    area: 'Piscina',

    leader: 'Carlos Lima',

    of: 'OF-2025-0090',

    boat: 'Poseidon 52',

    phase: 'Piscina',

    startTime: '08:00',

    time: '02:55h',
  },

  {
    id: 10,

    name: 'André Souza',
    ra: '12091',
    initials: 'AS',

    status: 'Aguardando',

    area: 'Qualidade',

    leader: 'Fernanda Costa',

    of: 'OF-2025-0091',

    boat: 'Oceanus 50',

    phase: '-',

    startTime: '-',

    time: '00:30h',
  },
];

export async function getOperatorsStatus() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(operatorsStatus);
    }, 400);
  });
}
