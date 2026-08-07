const phases = [
  { key: 'laminacao', label: 'Laminação' },
  { key: 'pre-montagem', label: 'Pré Montagem' },
  { key: 'montagem-final-e1', label: 'Montagem Final E1' },
  { key: 'montagem-final-e2', label: 'Montagem Final E2' },
  { key: 'montagem-final-e3', label: 'Montagem Final E3' },
  { key: 'pintura', label: 'Pintura' },
  { key: 'qualidade', label: 'Qualidade' },
  { key: 'piscina', label: 'Piscina' },
];

const periods = [
  {
    value: '01/08/2025-06/08/2025',
    label: '01/08/2025 - 06/08/2025',
  },
  {
    value: '25/07/2025-31/07/2025',
    label: '25/07/2025 - 31/07/2025',
  },
  {
    value: '01/07/2025-31/07/2025',
    label: '01/07/2025 - 31/07/2025',
  },
];

const boats = [
  {
    id: 1,
    code: 'INTM-5001',
    name: 'Vitoria Five',
    phase: 'Laminação',
    phaseKey: 'laminacao',
    phaseClass: 'phaseBlue',
    auditsCreated: 12,

    status: {
      novo: 8,
      emReparo: 15,
      aguardandoValidacao: 6,
      concluido: 22,
      cancelado: 2,
      reprovado: 3,
    },
  },

  {
    id: 2,
    code: 'INTM-5002',
    name: 'Sea Breeze',
    phase: 'Pré Montagem',
    phaseKey: 'pre-montagem',
    phaseClass: 'phaseGreen',
    auditsCreated: 9,

    status: {
      novo: 5,
      emReparo: 10,
      aguardandoValidacao: 4,
      concluido: 18,
      cancelado: 1,
      reprovado: 2,
    },
  },

  {
    id: 3,
    code: 'INTM-5003',
    name: 'Blue Ocean',
    phase: 'Montagem Final E1',
    phaseKey: 'montagem-final-e1',
    phaseClass: 'phasePurple',
    auditsCreated: 14,

    status: {
      novo: 7,
      emReparo: 12,
      aguardandoValidacao: 5,
      concluido: 25,
      cancelado: 0,
      reprovado: 4,
    },
  },

  {
    id: 4,
    code: 'INTM-5004',
    name: 'Ocean Pearl',
    phase: 'Montagem Final E2',
    phaseKey: 'montagem-final-e2',
    phaseClass: 'phasePurple',
    auditsCreated: 11,

    status: {
      novo: 6,
      emReparo: 9,
      aguardandoValidacao: 3,
      concluido: 17,
      cancelado: 1,
      reprovado: 1,
    },
  },

  {
    id: 5,
    code: 'INTM-5005',
    name: 'Wave Rider',
    phase: 'Montagem Final E3',
    phaseKey: 'montagem-final-e3',
    phaseClass: 'phasePurple',
    auditsCreated: 10,

    status: {
      novo: 4,
      emReparo: 11,
      aguardandoValidacao: 2,
      concluido: 16,
      cancelado: 1,
      reprovado: 2,
    },
  },

  {
    id: 6,
    code: 'INTM-5006',
    name: 'Sea Dream',
    phase: 'Pintura',
    phaseKey: 'pintura',
    phaseClass: 'phasePink',
    auditsCreated: 13,

    status: {
      novo: 9,
      emReparo: 14,
      aguardandoValidacao: 5,
      concluido: 20,
      cancelado: 2,
      reprovado: 3,
    },
  },

  {
    id: 7,
    code: 'INTM-5007',
    name: 'Marine Star',
    phase: 'Qualidade',
    phaseKey: 'qualidade',
    phaseClass: 'phaseOrange',
    auditsCreated: 15,

    status: {
      novo: 6,
      emReparo: 13,
      aguardandoValidacao: 6,
      concluido: 24,
      cancelado: 1,
      reprovado: 2,
    },
  },

  {
    id: 8,
    code: 'INTM-5008',
    name: 'Islander',
    phase: 'Piscina',
    phaseKey: 'piscina',
    phaseClass: 'phaseCyan',
    auditsCreated: 8,

    status: {
      novo: 3,
      emReparo: 6,
      aguardandoValidacao: 2,
      concluido: 12,
      cancelado: 0,
      reprovado: 1,
    },
  },
];

const summary = {
  auditoriasCriadas: 102,
  novo: 48,
  emReparo: 100,
  aguardandoValidacao: 33,
  concluidos: 164,
  cancelados: 8,
  reprovados: 18,
};

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function clone(items) {
  return JSON.parse(JSON.stringify(items));
}

async function getBoats() {
  await delay(250);

  return clone(boats);
}

async function getBoatById(id) {
  await delay(200);

  return boats.find((boat) => boat.id === Number(id));
}

async function getPhases() {
  await delay(120);

  return clone(phases);
}

async function getPeriods() {
  await delay(120);

  return clone(periods);
}

async function getSummary() {
  await delay(150);

  return {
    ...summary,
  };
}

const auditoriaService = {
  getBoats,
  getBoatById,
  getPhases,
  getPeriods,
  getSummary,
};

export default auditoriaService;
