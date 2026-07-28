const planning = [
  {
    id: 1,
    code: 'EMB-00145',
    name: 'Oceanic 45',
    status: 'atencao',

    plannedDelivery: '10/10/2026',
    replannedDelivery: '15/10/2026',

    delayDays: 5,

    lamination: {
      plannedStart: '10/01/2026',
      executedStart: '10/01/2026',
      plannedEnd: '20/02/2026',
      executedEnd: '20/02/2026',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'no-prazo',
    },

    preAssembly: {
      plannedStart: '21/02/2026',
      executedStart: '22/02/2026',
      plannedEnd: '30/03/2026',
      executedEnd: '30/03/2026',

      replannedStart: '22/02/2026',
      replannedEnd: '-',

      status: 'no-prazo',
    },

    painting: {
      plannedStart: '01/04/2026',
      executedStart: '01/04/2026',
      plannedEnd: '30/04/2026',
      executedEnd: '30/04/2026',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'no-prazo',
    },

    miniFactory: {
      plannedStart: '01/05/2026',
      executedStart: '03/05/2026',
      plannedEnd: '30/06/2026',
      executedEnd: '-',

      replannedStart: '03/05/2026',
      replannedEnd: '05/07/2026',

      status: 'atencao',
    },

    finalAssemblyE2: {
      plannedStart: '01/05/2026',
      executedStart: '03/05/2026',
      plannedEnd: '30/06/2026',
      executedEnd: '-',

      replannedStart: '03/05/2026',
      replannedEnd: '05/07/2026',

      status: 'atencao',
    },

    finalAssemblyE3: {
      plannedStart: '01/05/2026',
      executedStart: '03/05/2026',
      plannedEnd: '30/06/2026',
      executedEnd: '-',

      replannedStart: '03/05/2026',
      replannedEnd: '05/07/2026',

      status: 'atencao',
    },

    pool: {
      plannedStart: '01/07/2026',
      executedStart: '05/07/2026',
      plannedEnd: '20/08/2026',
      executedEnd: '-',

      replannedStart: '05/07/2026',
      replannedEnd: '25/08/2026',

      status: 'atencao',
    },

    quality: {
      plannedStart: '26/08/2026',
      executedStart: '-',
      plannedEnd: '10/10/2026',
      executedEnd: '-',

      replannedStart: '-',
      replannedEnd: '15/10/2026',

      status: 'nao-iniciada',
    },
  },

  {
    id: 2,
    code: 'EMB-00146',
    name: 'Explorer 42',
    status: 'atrasada',

    plannedDelivery: '20/10/2026',
    replannedDelivery: '31/10/2026',

    delayDays: 11,

    lamination: {
      plannedStart: '15/01/2026',
      executedStart: '15/01/2026',
      plannedEnd: '28/02/2026',
      executedEnd: '28/02/2026',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'no-prazo',
    },

    preAssembly: {
      plannedStart: '01/03/2026',
      executedStart: '03/03/2026',
      plannedEnd: '20/04/2026',
      executedEnd: '-',

      replannedStart: '03/03/2026',
      replannedEnd: '25/04/2026',

      status: 'atrasada',
    },

    painting: {
      plannedStart: '26/04/2026',
      executedStart: '-',
      plannedEnd: '31/05/2026',
      executedEnd: '-',

      replannedStart: '01/05/2026',
      replannedEnd: '06/06/2026',

      status: 'nao-iniciada',
    },

    miniFactory: {
      plannedStart: '01/06/2026',
      executedStart: '-',
      plannedEnd: '31/07/2026',
      executedEnd: '-',

      replannedStart: '07/06/2026',
      replannedEnd: '10/08/2026',

      status: 'nao-iniciada',
    },

    finalAssemblyE2: {
      plannedStart: '01/06/2026',
      executedStart: '-',
      plannedEnd: '31/07/2026',
      executedEnd: '-',

      replannedStart: '07/06/2026',
      replannedEnd: '10/08/2026',

      status: 'nao-iniciada',
    },

    finalAssemblyE3: {
      plannedStart: '01/06/2026',
      executedStart: '-',
      plannedEnd: '31/07/2026',
      executedEnd: '-',

      replannedStart: '07/06/2026',
      replannedEnd: '10/08/2026',

      status: 'nao-iniciada',
    },

    pool: {
      plannedStart: '01/08/2026',
      executedStart: '-',
      plannedEnd: '20/09/2026',
      executedEnd: '-',

      replannedStart: '11/08/2026',
      replannedEnd: '30/09/2026',

      status: 'nao-iniciada',
    },

    quality: {
      plannedStart: '21/09/2026',
      executedStart: '-',
      plannedEnd: '20/10/2026',
      executedEnd: '-',

      replannedStart: '01/10/2026',
      replannedEnd: '31/10/2026',

      status: 'nao-iniciada',
    },
  },

  {
    id: 3,
    code: 'EMB-00147',
    name: 'Atlantic 50',
    status: 'atrasada',

    plannedDelivery: '25/10/2026',
    replannedDelivery: '08/11/2026',

    delayDays: 14,

    lamination: {
      plannedStart: '20/01/2026',
      executedStart: '20/01/2026',
      plannedEnd: '05/03/2026',
      executedEnd: '05/03/2026',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'no-prazo',
    },

    preAssembly: {
      plannedStart: '06/03/2026',
      executedStart: '10/03/2026',
      plannedEnd: '30/04/2026',
      executedEnd: '-',

      replannedStart: '10/03/2026',
      replannedEnd: '10/05/2026',

      status: 'atrasada',
    },

    painting: {
      plannedStart: '11/05/2026',
      executedStart: '-',
      plannedEnd: '10/06/2026',
      executedEnd: '-',

      replannedStart: '15/05/2026',
      replannedEnd: '18/06/2026',

      status: 'nao-iniciada',
    },

    miniFactory: {
      plannedStart: '11/06/2026',
      executedStart: '-',
      plannedEnd: '20/08/2026',
      executedEnd: '-',

      replannedStart: '19/06/2026',
      replannedEnd: '28/08/2026',

      status: 'nao-iniciada',
    },

    finalAssemblyE2: {
      plannedStart: '11/06/2026',
      executedStart: '-',
      plannedEnd: '20/08/2026',
      executedEnd: '-',

      replannedStart: '19/06/2026',
      replannedEnd: '28/08/2026',

      status: 'nao-iniciada',
    },

    finalAssemblyE3: {
      plannedStart: '11/06/2026',
      executedStart: '-',
      plannedEnd: '20/08/2026',
      executedEnd: '-',

      replannedStart: '19/06/2026',
      replannedEnd: '28/08/2026',

      status: 'nao-iniciada',
    },

    pool: {
      plannedStart: '21/08/2026',
      executedStart: '-',
      plannedEnd: '30/09/2026',
      executedEnd: '-',

      replannedStart: '29/08/2026',
      replannedEnd: '10/10/2026',

      status: 'nao-iniciada',
    },

    quality: {
      plannedStart: '01/10/2026',
      executedStart: '-',
      plannedEnd: '25/10/2026',
      executedEnd: '-',

      replannedStart: '11/10/2026',
      replannedEnd: '08/11/2026',

      status: 'nao-iniciada',
    },
  },

  {
    id: 4,
    code: 'EMB-00148',
    name: 'Horizon 40',
    status: 'no-prazo',

    plannedDelivery: '05/11/2026',
    replannedDelivery: '-',

    delayDays: 0,

    lamination: {
      plannedStart: '01/02/2026',
      executedStart: '01/02/2026',
      plannedEnd: '15/03/2026',
      executedEnd: '14/03/2026',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'no-prazo',
    },

    preAssembly: {
      plannedStart: '16/03/2026',
      executedStart: '16/03/2026',
      plannedEnd: '30/04/2026',
      executedEnd: '29/04/2026',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'no-prazo',
    },

    painting: {
      plannedStart: '01/05/2026',
      executedStart: '01/05/2026',
      plannedEnd: '31/05/2026',
      executedEnd: '30/05/2026',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'no-prazo',
    },

    miniFactory: {
      plannedStart: '01/06/2026',
      executedStart: '01/06/2026',
      plannedEnd: '31/07/2026',
      executedEnd: '-',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'no-prazo',
    },

    finalAssemblyE2: {
      plannedStart: '01/06/2026',
      executedStart: '01/06/2026',
      plannedEnd: '31/07/2026',
      executedEnd: '-',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'no-prazo',
    },

    finalAssemblyE3: {
      plannedStart: '01/06/2026',
      executedStart: '01/06/2026',
      plannedEnd: '31/07/2026',
      executedEnd: '-',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'no-prazo',
    },

    pool: {
      plannedStart: '01/08/2026',
      executedStart: '-',
      plannedEnd: '30/09/2026',
      executedEnd: '-',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'nao-iniciada',
    },

    quality: {
      plannedStart: '01/10/2026',
      executedStart: '-',
      plannedEnd: '05/11/2026',
      executedEnd: '-',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'nao-iniciada',
    },
  },

  {
    id: 5,
    code: 'EMB-00149',
    name: 'Seawind 48',
    status: 'atencao',

    plannedDelivery: '12/11/2026',
    replannedDelivery: '17/11/2026',

    delayDays: 5,

    lamination: {
      plannedStart: '05/02/2026',
      executedStart: '05/02/2026',
      plannedEnd: '20/03/2026',
      executedEnd: '20/03/2026',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'no-prazo',
    },

    preAssembly: {
      plannedStart: '21/03/2026',
      executedStart: '22/03/2026',
      plannedEnd: '05/05/2026',
      executedEnd: '07/05/2026',

      replannedStart: '22/03/2026',
      replannedEnd: '07/05/2026',

      status: 'atencao',
    },

    painting: {
      plannedStart: '06/05/2026',
      executedStart: '08/05/2026',
      plannedEnd: '10/06/2026',
      executedEnd: '-',

      replannedStart: '08/05/2026',
      replannedEnd: '13/06/2026',

      status: 'atencao',
    },

    miniFactory: {
      plannedStart: '11/06/2026',
      executedStart: '-',
      plannedEnd: '20/08/2026',
      executedEnd: '-',

      replannedStart: '14/06/2026',
      replannedEnd: '23/08/2026',

      status: 'nao-iniciada',
    },

    finalAssemblyE2: {
      plannedStart: '11/06/2026',
      executedStart: '-',
      plannedEnd: '20/08/2026',
      executedEnd: '-',

      replannedStart: '14/06/2026',
      replannedEnd: '23/08/2026',

      status: 'nao-iniciada',
    },

    finalAssemblyE3: {
      plannedStart: '11/06/2026',
      executedStart: '-',
      plannedEnd: '20/08/2026',
      executedEnd: '-',

      replannedStart: '14/06/2026',
      replannedEnd: '23/08/2026',

      status: 'nao-iniciada',
    },

    pool: {
      plannedStart: '21/08/2026',
      executedStart: '-',
      plannedEnd: '10/10/2026',
      executedEnd: '-',

      replannedStart: '24/08/2026',
      replannedEnd: '15/10/2026',

      status: 'nao-iniciada',
    },

    quality: {
      plannedStart: '11/10/2026',
      executedStart: '-',
      plannedEnd: '12/11/2026',
      executedEnd: '-',

      replannedStart: '16/10/2026',
      replannedEnd: '17/11/2026',

      status: 'nao-iniciada',
    },
  },

  {
    id: 6,
    code: 'EMB-00150',
    name: 'Legacy 44',
    status: 'no-prazo',

    plannedDelivery: '18/11/2026',
    replannedDelivery: '-',

    delayDays: 0,

    lamination: {
      plannedStart: '10/02/2026',
      executedStart: '10/02/2026',
      plannedEnd: '25/03/2026',
      executedEnd: '24/03/2026',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'no-prazo',
    },

    preAssembly: {
      plannedStart: '26/03/2026',
      executedStart: '26/03/2026',
      plannedEnd: '10/05/2026',
      executedEnd: '10/05/2026',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'no-prazo',
    },

    painting: {
      plannedStart: '11/05/2026',
      executedStart: '11/05/2026',
      plannedEnd: '15/06/2026',
      executedEnd: '-',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'no-prazo',
    },

    miniFactory: {
      plannedStart: '16/06/2026',
      executedStart: '-',
      plannedEnd: '25/08/2026',
      executedEnd: '-',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'nao-iniciada',
    },

    finalAssemblyE2: {
      plannedStart: '16/06/2026',
      executedStart: '-',
      plannedEnd: '25/08/2026',
      executedEnd: '-',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'nao-iniciada',
    },

    finalAssemblyE3: {
      plannedStart: '16/06/2026',
      executedStart: '-',
      plannedEnd: '25/08/2026',
      executedEnd: '-',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'nao-iniciada',
    },

    pool: {
      plannedStart: '26/08/2026',
      executedStart: '-',
      plannedEnd: '15/10/2026',
      executedEnd: '-',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'nao-iniciada',
    },

    quality: {
      plannedStart: '16/10/2026',
      executedStart: '-',
      plannedEnd: '18/11/2026',
      executedEnd: '-',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'nao-iniciada',
    },
  },

  {
    id: 7,
    code: 'EMB-00151',
    name: 'Infinity 55',
    status: 'atrasada',

    plannedDelivery: '25/11/2026',
    replannedDelivery: '10/12/2026',

    delayDays: 15,

    lamination: {
      plannedStart: '15/02/2026',
      executedStart: '18/02/2026',
      plannedEnd: '31/03/2026',
      executedEnd: '05/04/2026',

      replannedStart: '18/02/2026',
      replannedEnd: '05/04/2026',

      status: 'atrasada',
    },

    preAssembly: {
      plannedStart: '01/04/2026',
      executedStart: '06/04/2026',
      plannedEnd: '20/05/2026',
      executedEnd: '-',

      replannedStart: '06/04/2026',
      replannedEnd: '28/05/2026',

      status: 'atrasada',
    },

    painting: {
      plannedStart: '21/05/2026',
      executedStart: '-',
      plannedEnd: '30/06/2026',
      executedEnd: '-',

      replannedStart: '29/05/2026',
      replannedEnd: '10/07/2026',

      status: 'nao-iniciada',
    },

    miniFactory: {
      plannedStart: '01/07/2026',
      executedStart: '-',
      plannedEnd: '10/09/2026',
      executedEnd: '-',

      replannedStart: '11/07/2026',
      replannedEnd: '20/09/2026',

      status: 'nao-iniciada',
    },

    finalAssemblyE2: {
      plannedStart: '01/07/2026',
      executedStart: '-',
      plannedEnd: '10/09/2026',
      executedEnd: '-',

      replannedStart: '11/07/2026',
      replannedEnd: '20/09/2026',

      status: 'nao-iniciada',
    },

    finalAssemblyE3: {
      plannedStart: '01/07/2026',
      executedStart: '-',
      plannedEnd: '10/09/2026',
      executedEnd: '-',

      replannedStart: '11/07/2026',
      replannedEnd: '20/09/2026',

      status: 'nao-iniciada',
    },

    pool: {
      plannedStart: '11/09/2026',
      executedStart: '-',
      plannedEnd: '31/10/2026',
      executedEnd: '-',

      replannedStart: '21/09/2026',
      replannedEnd: '15/11/2026',

      status: 'nao-iniciada',
    },

    quality: {
      plannedStart: '01/11/2026',
      executedStart: '-',
      plannedEnd: '25/11/2026',
      executedEnd: '-',

      replannedStart: '16/11/2026',
      replannedEnd: '10/12/2026',

      status: 'nao-iniciada',
    },
  },

  {
    id: 8,
    code: 'EMB-00152',
    name: 'Majesty 46',
    status: 'no-prazo',

    plannedDelivery: '02/12/2026',
    replannedDelivery: '-',

    delayDays: 0,

    lamination: {
      plannedStart: '20/02/2026',
      executedStart: '20/02/2026',
      plannedEnd: '05/04/2026',
      executedEnd: '05/04/2026',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'no-prazo',
    },

    preAssembly: {
      plannedStart: '06/04/2026',
      executedStart: '06/04/2026',
      plannedEnd: '20/05/2026',
      executedEnd: '20/05/2026',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'no-prazo',
    },

    painting: {
      plannedStart: '21/05/2026',
      executedStart: '21/05/2026',
      plannedEnd: '25/06/2026',
      executedEnd: '-',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'no-prazo',
    },

    miniFactory: {
      plannedStart: '26/06/2026',
      executedStart: '-',
      plannedEnd: '05/09/2026',
      executedEnd: '-',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'nao-iniciada',
    },

    finalAssemblyE2: {
      plannedStart: '26/06/2026',
      executedStart: '-',
      plannedEnd: '05/09/2026',
      executedEnd: '-',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'nao-iniciada',
    },

    finalAssemblyE3: {
      plannedStart: '26/06/2026',
      executedStart: '-',
      plannedEnd: '05/09/2026',
      executedEnd: '-',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'nao-iniciada',
    },

    pool: {
      plannedStart: '06/09/2026',
      executedStart: '-',
      plannedEnd: '20/10/2026',
      executedEnd: '-',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'nao-iniciada',
    },

    quality: {
      plannedStart: '21/10/2026',
      executedStart: '-',
      plannedEnd: '02/12/2026',
      executedEnd: '-',

      replannedStart: '-',
      replannedEnd: '-',

      status: 'nao-iniciada',
    },
  },
];

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function clonePhase(phase) {
  return {
    ...phase,
  };
}

function cloneBoat(boat) {
  return {
    ...boat,
    lamination: clonePhase(boat.lamination),
    preAssembly: clonePhase(boat.preAssembly),
    painting: clonePhase(boat.painting),
    miniFactory: clonePhase(boat.miniFactory),
    finalAssemblyE2: clonePhase(boat.finalAssemblyE2),
    finalAssemblyE3: clonePhase(boat.finalAssemblyE3),
    pool: clonePhase(boat.pool),
    quality: clonePhase(boat.quality),
  };
}

async function getPlanning() {
  await delay(350);

  return planning.map((boat) => cloneBoat(boat));
}

async function getPlanningByBoatId(boatId) {
  await delay(250);

  const id = Number(boatId);

  const boat = planning.find((item) => item.id === id);

  return boat ? cloneBoat(boat) : undefined;
}

const dashboardProducaoService = {
  getPlanning,
  getPlanningByBoatId,
};

export default dashboardProducaoService;
