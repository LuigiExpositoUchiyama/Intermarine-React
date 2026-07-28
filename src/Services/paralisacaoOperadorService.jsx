const operatorStop = {
  id: 1,

  operator: {
    name: 'João Silva Santos',
    ra: '1246',
    area: 'Laminação',
    leader: 'Carlos Silva',
    avatar: '/avatar.png',
  },

  currentStatus: 'paralisado',

  stoppedTime: '01:45:12',

  stoppedSince: '26/06/2024 08:30',

  stopData: {
    startDate: '26/06/2024 08:30',

    reason: 'Falta de resina estrutural',

    responsible: 'Carlos Silva (Gestor)',

    observation: 'Aguardando liberação do material no posto de trabalho.',
  },

  previousOrder: {
    code: 'OF-1234',

    description: 'Fabricação do Casco',

    phase: 'Laminação',

    cc: '1001',

    boat: 'Lancha Oceanic',

    plannedStart: '25/06/2024',

    plannedEnd: '02/07/2024',
  },

  flow: [
    {
      id: 1,

      title: 'Desatrelar da OF',

      description: 'Operador removido da ordem de fabricação atual.',

      completed: true,
    },

    {
      id: 2,

      title: 'Registrar Paralisação',

      description: 'Motivo da paralisação registrado no sistema.',

      completed: true,
    },

    {
      id: 3,

      title: 'Retirar Paralisação',

      description: 'Aguardando retorno do operador para produção.',

      completed: false,
    },
  ],

  history: [
    {
      id: 1,

      date: '26/06/2024 08:30',

      title: 'Operador desatrelado da OF-1234',

      description: 'Operador removido da ordem de fabricação atual.',

      responsible: 'Carlos Silva (Gestor)',

      status: 'success',
    },

    {
      id: 2,

      date: '26/06/2024 08:32',

      title: 'Paralisação registrada',

      description: 'Motivo: Falta de resina estrutural.',

      responsible: 'Carlos Silva (Gestor)',

      status: 'danger',
    },

    {
      id: 3,

      date: '',

      title: 'Aguardando retirada da paralisação',

      description: 'Operador permanece aguardando retorno.',

      responsible: '',

      status: 'waiting',
    },
  ],
};

export function getOperatorStop() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(operatorStop);
    }, 400);
  });
}
