const metrics = [
  {
    id: 1,
    icon: 'directions_boat',
    value: '8',
    label: 'Embarcações',
    description: 'Ativas na produção',
  },
  {
    id: 2,
    icon: 'assignment',
    value: '48',
    label: 'OFs Totais',
    description: 'Todas as embarcações',
  },
  {
    id: 3,
    icon: 'precision_manufacturing',
    value: '32',
    label: 'Em Execução',
    description: '67% do total',
  },
  {
    id: 4,
    icon: 'person_outline',
    value: '10',
    label: 'A Iniciar',
    description: '21% do total',
  },
  {
    id: 5,
    icon: 'groups',
    value: '289 / 320',
    label: 'Pessoas',
    description: 'Em produção',
  },
  {
    id: 6,
    icon: 'group_off',
    value: '31 / 320',
    label: 'Fora de Produção',
    description: 'Não alocadas',
    variant: 'danger',
  },
  {
    id: 7,
    icon: 'pause_circle',
    value: '18 / 320',
    label: 'Em Paralisação',
    description: 'Em paralisação',
    variant: 'warning',
  },
  {
    id: 8,
    icon: 'task_alt',
    value: '17',
    label: 'OFs Finalizadas',
    description: 'Concluídas na produção',
    variant: 'success',
  },
];

const phases = [
  {
    id: 1,
    label: 'Lam',
    key: 'laminacao',
  },
  {
    id: 2,
    label: 'Pré-Mont',
    key: 'pre-montagem',
  },
  {
    id: 3,
    label: 'Pintura',
    key: 'pintura',
  },
  {
    id: 4,
    label: 'MF',
    key: 'mini-fabrica',
  },
  {
    id: 5,
    label: 'Piscina',
    key: 'piscina',
  },
  {
    id: 6,
    label: 'Qual.',
    key: 'qualidade',
  },
];

const miniPhases = [
  {
    id: 1,
    label: 'Elétrica',
    key: 'eletrica',
  },
  {
    id: 2,
    label: 'Tapeçaria',
    key: 'tapecaria',
  },
  {
    id: 3,
    label: 'Marcenaria',
    key: 'marcenaria',
  },
  {
    id: 4,
    label: 'Serralheria',
    key: 'serralheria',
  },
  {
    id: 5,
    label: 'Laminação',
    key: 'laminacao',
  },
  {
    id: 6,
    label: 'Pré Montagem',
    key: 'pre-montagem',
  },
  {
    id: 7,
    label: 'MF Elétrica',
    key: 'mf-eletrica',
  },
  {
    id: 8,
    label: 'Montagem Final',
    key: 'montagem-final',
  },
];

const boats = [
  {
    id: 1,
    number: 1,
    code: 'EMB-00145',
    name: 'Lancha Oceanic',
    image: '/barco.webp',
    status: 'no-prazo',
    occupation: 95,
    progress: 65,
    totalOfs: 6,
    notStarted: 2,
    inProgress: 4,
    completed: 0,
    or: 1,
    orp: 1,
    startDate: '10/01/2026',
    endDate: '10/10/2026',
    currentPhaseIndex: 4,
  },
  {
    id: 2,
    number: 2,
    code: 'EMB-00146',
    name: 'Lancha Explorer',
    image: '/barco.webp',
    status: 'no-prazo',
    occupation: 93,
    progress: 58,
    totalOfs: 6,
    notStarted: 2,
    inProgress: 5,
    completed: 0,
    or: 0,
    orp: 1,
    startDate: '15/01/2026',
    endDate: '15/10/2026',
    currentPhaseIndex: 4,
  },
  {
    id: 3,
    number: 3,
    code: 'EMB-00148',
    name: 'Lancha Atlantic',
    image: '/barco.webp',
    status: 'atencao',
    occupation: 78,
    progress: 42,
    totalOfs: 6,
    notStarted: 3,
    inProgress: 3,
    completed: 0,
    or: 2,
    orp: 1,
    startDate: '12/01/2026',
    endDate: '12/10/2026',
    currentPhaseIndex: 3,
  },
  {
    id: 4,
    number: 4,
    code: 'EMB-00149',
    name: 'Lancha Horizon',
    image: '/barco.webp',
    status: 'no-prazo',
    occupation: 90,
    progress: 60,
    totalOfs: 6,
    notStarted: 2,
    inProgress: 4,
    completed: 0,
    or: 0,
    orp: 0,
    startDate: '10/01/2026',
    endDate: '10/10/2026',
    currentPhaseIndex: 4,
  },
  {
    id: 5,
    number: 5,
    code: 'EMB-00150',
    name: 'Lancha Seawind',
    image: '/barco.webp',
    status: 'atencao',
    occupation: 88,
    progress: 55,
    totalOfs: 6,
    notStarted: 2,
    inProgress: 4,
    completed: 0,
    or: 1,
    orp: 1,
    startDate: '20/01/2026',
    endDate: '20/10/2026',
    currentPhaseIndex: 3,
  },
  {
    id: 6,
    number: 6,
    code: 'EMB-00151',
    name: 'Lancha Legacy',
    image: '/barco.webp',
    status: 'atencao',
    occupation: 71,
    progress: 38,
    totalOfs: 6,
    notStarted: 3,
    inProgress: 3,
    completed: 0,
    or: 2,
    orp: 2,
    startDate: '18/01/2026',
    endDate: '18/10/2026',
    currentPhaseIndex: 2,
  },
  {
    id: 7,
    number: 7,
    code: 'EMB-00152',
    name: 'Lancha Infinity',
    image: '/barco.webp',
    status: 'no-prazo',
    occupation: 94,
    progress: 62,
    totalOfs: 6,
    notStarted: 2,
    inProgress: 4,
    completed: 0,
    or: 0,
    orp: 0,
    startDate: '05/01/2026',
    endDate: '05/10/2026',
    currentPhaseIndex: 4,
  },
  {
    id: 8,
    number: 8,
    code: 'EMB-00153',
    name: 'Lancha Master',
    image: '/barco.webp',
    status: 'atrasada',
    occupation: 94,
    progress: 62,
    totalOfs: 6,
    notStarted: 2,
    inProgress: 4,
    completed: 0,
    or: 0,
    orp: 0,
    startDate: '05/01/2026',
    endDate: '05/10/2026',
    currentPhaseIndex: 2,
  },
];

const miniFactories = [
  {
    id: 101,
    boatId: 1,
    number: 1,
    code: 'MF-001',
    name: 'Mini Fábrica Elétrica',
    image: '/lancha.webp',
    status: 'no-prazo',
    occupation: 96,
    progress: 72,
    totalOfs: 8,
    notStarted: 1,
    inProgress: 5,
    completed: 2,
    or: 0,
    orp: 1,
    startDate: '05/01/2026',
    endDate: '05/08/2026',
    currentPhaseIndex: 6,
  },
  {
    id: 102,
    boatId: 1,
    number: 2,
    code: 'MF-002',
    name: 'Mini Fábrica Tapeçaria',
    image: '/lancha.webp',
    status: 'no-prazo',
    occupation: 91,
    progress: 60,
    totalOfs: 7,
    notStarted: 2,
    inProgress: 4,
    completed: 1,
    or: 1,
    orp: 0,
    startDate: '10/01/2026',
    endDate: '10/08/2026',
    currentPhaseIndex: 5,
  },
  {
    id: 103,
    boatId: 1,
    number: 3,
    code: 'MF-003',
    name: 'Mini Fábrica Marcenaria',
    image: '/lancha.webp',
    status: 'atencao',
    occupation: 82,
    progress: 48,
    totalOfs: 9,
    notStarted: 3,
    inProgress: 4,
    completed: 2,
    or: 2,
    orp: 1,
    startDate: '15/01/2026',
    endDate: '15/09/2026',
    currentPhaseIndex: 4,
  },
  {
    id: 104,
    boatId: 1,
    number: 4,
    code: 'MF-004',
    name: 'Mini Fábrica Serralheria',
    image: '/lancha.webp',
    status: 'atrasada',
    occupation: 70,
    progress: 35,
    totalOfs: 6,
    notStarted: 2,
    inProgress: 3,
    completed: 1,
    or: 2,
    orp: 2,
    startDate: '20/01/2026',
    endDate: '20/09/2026',
    currentPhaseIndex: 3,
  },
  {
    id: 105,
    boatId: 1,
    number: 5,
    code: 'MF-005',
    name: 'Mini Fábrica Laminação',
    image: '/lancha.webp',
    status: 'no-prazo',
    occupation: 94,
    progress: 80,
    totalOfs: 10,
    notStarted: 1,
    inProgress: 3,
    completed: 6,
    or: 0,
    orp: 0,
    startDate: '25/01/2026',
    endDate: '25/09/2026',
    currentPhaseIndex: 7,
  },
  {
    id: 106,
    boatId: 1,
    number: 6,
    code: 'MF-006',
    name: 'Mini Fábrica Montagem Final',
    image: '/lancha.webp',
    status: 'atencao',
    occupation: 86,
    progress: 55,
    totalOfs: 8,
    notStarted: 2,
    inProgress: 5,
    completed: 1,
    or: 1,
    orp: 1,
    startDate: '30/01/2026',
    endDate: '30/09/2026',
    currentPhaseIndex: 6,
  },
];

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function cloneItems(items) {
  return items.map((item) => ({
    ...item,
  }));
}

async function getMetrics() {
  await delay(250);

  return cloneItems(metrics);
}

async function getPhases() {
  await delay(150);

  return cloneItems(phases);
}

async function getMiniPhases() {
  await delay(150);

  return cloneItems(miniPhases);
}

async function getBoats() {
  await delay(250);

  return boats.map((boat) => ({
    ...boat,
    code: boat.code.toUpperCase(),
    name: boat.name.trim(),
  }));
}

async function getMiniFactories() {
  await delay(250);

  return miniFactories.map((item) => ({
    ...item,
    code: item.code.toUpperCase(),
    name: item.name.trim(),
  }));
}

async function getBoatById(id) {
  const data = await getBoats();

  return data.find((boat) => boat.id === Number(id));
}

async function getMiniFactoryById(id) {
  const data = await getMiniFactories();

  return data.find((item) => item.id === Number(id));
}

const gestaoProducaoService = {
  getMetrics,
  getPhases,
  getMiniPhases,
  getBoats,
  getMiniFactories,
  getBoatById,
  getMiniFactoryById,
};

export default gestaoProducaoService;
