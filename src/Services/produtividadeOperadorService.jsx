const metrics = [
  {
    id: 1,
    icon: 'groups',
    value: '28',
    label: 'Operadores Ativos',
    description: 'Atrelados e apontando',
    variant: 'success',
  },

  {
    id: 2,
    icon: 'person_off',
    value: '7',
    label: 'Operadores Inativos',
    description: 'Não atrelados / sem apontamento',
    variant: 'warning',
  },

  {
    id: 3,
    icon: 'schedule',
    value: '148:30',
    label: 'Tempo Planejado Total',
    description: 'Horas',
  },

  {
    id: 4,
    icon: 'timer',
    value: '121:45',
    label: 'Tempo Executado Total',
    description: 'Horas',
  },

  {
    id: 5,
    icon: 'trending_up',
    value: '81,9%',
    label: 'Eficiência Média',
    description: 'Executado / Planejado',
    variant: 'success',
  },

  {
    id: 6,
    icon: 'trending_down',
    value: '00:12',
    label: 'Gap Médio',
    description: 'Atraso médio',
    variant: 'danger',
  },
];

const operators = [
  {
    id: 1,
    name: 'João Santos',
    ra: '12345',
    initials: 'JS',
    status: 'ativo',
    of: 'OF-2025-0087',
    boat: 'Ventius 38',
    phase: 'Laminação',
    or: 'OR-2025-0041',
    orp: 'ORP-2025-0012',
    plannedTime: '08:00',
    executedTime: '06:45',
    delayDate: '15/07/2025 07:30',
    startTime: '15/07/2025 07:42',
    gap: '00:12',
    efficiency: 84.4,
    efficiencyStatus: 'excelente',
  },

  {
    id: 2,
    name: 'Maria Camila',
    ra: '12398',
    initials: 'MC',
    status: 'ativo',
    of: 'OF-2025-0087',
    boat: 'Ventius 38',
    phase: 'Pré Montagem',
    or: 'OR-2025-0042',
    orp: '-',
    plannedTime: '07:30',
    executedTime: '05:50',
    delayDate: '15/07/2025 07:20',
    startTime: '15/07/2025 07:25',
    gap: '00:05',
    efficiency: 78,
    efficiencyStatus: 'atencao',
  },

  {
    id: 3,
    name: 'Rafael Pereira',
    ra: '12567',
    initials: 'RP',
    status: 'ativo',
    of: 'OF-2025-0086',
    boat: 'Solaris 44',
    phase: 'Pintura',
    or: 'OR-2025-0040',
    orp: 'ORP-2025-0010',
    plannedTime: '08:00',
    executedTime: '07:10',
    delayDate: '15/07/2025 06:50',
    startTime: '15/07/2025 07:10',
    gap: '00:15',
    efficiency: 89.6,
    efficiencyStatus: 'excelente',
  },

  {
    id: 4,
    name: 'Fernando Lima',
    ra: '12411',
    initials: 'FL',
    status: 'ativo',
    of: 'OF-2025-0085',
    boat: 'Oceanus 50',
    phase: 'Montagem Final',
    or: 'OR-2025-0039',
    orp: '-',
    plannedTime: '10:00',
    executedTime: '09:20',
    delayDate: '15/07/2025 06:40',
    startTime: '15/07/2025 06:55',
    gap: '00:15',
    efficiency: 93.3,
    efficiencyStatus: 'excelente',
  },

  {
    id: 5,
    name: 'Ana Paula',
    ra: '12500',
    initials: 'AP',
    status: 'ativo',
    of: 'OF-2025-0084',
    boat: 'Poseidon 52',
    phase: 'Piscina',
    or: 'OR-2025-0038',
    orp: 'ORP-2025-0009',
    plannedTime: '06:00',
    executedTime: '04:50',
    delayDate: '15/07/2025 06:20',
    startTime: '15/07/2025 06:30',
    gap: '00:18',
    efficiency: 80.6,
    efficiencyStatus: 'atencao',
  },

  {
    id: 6,
    name: 'Gabriel Barbosa',
    ra: '12622',
    initials: 'GB',
    status: 'inativo',
    of: '-',
    boat: '-',
    phase: '-',
    or: '-',
    orp: '-',
    plannedTime: '-',
    executedTime: '-',
    delayDate: '-',
    startTime: '-',
    gap: '-',
    efficiency: 0,
    efficiencyStatus: 'critico',
  },
];

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function getMetrics() {
  await delay(200);

  return metrics.map((metric) => ({
    ...metric,
  }));
}

async function getOperators() {
  await delay(300);

  return operators.map((operator) => ({
    ...operator,
  }));
}

const produtividadeOperadorService = {
  getMetrics,
  getOperators,
};

export default produtividadeOperadorService;
