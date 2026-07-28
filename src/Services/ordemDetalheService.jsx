const orders = [
  {
    id: 101,
    type: 'OF',

    code: 'OF-00145-01',
    boatCode: 'EMB-00145',
    boatName: 'Lancha Oceanic',
    sector: 'Laminação externa',
    responsible: 'João Silva',

    productionStatus: 'concluida',
    deadlineStatus: 'no-prazo',

    plannedTime: '48h 00min',
    currentTime: '46h 20min',
    delayTime: '0h 00min',
    delayPercentage: '0% acima do planejado',

    progress: 100,

    operatorEfficiency: 96,
    efficiencyGoal: 90,

    timeline: [
      {
        id: 1,
        date: '14/07/2026',
        time: '07:00',
        title: 'Início planejado',
        description: 'Início previsto da operação',
        icon: 'calendar_month',
        variant: 'info',
      },
      {
        id: 2,
        date: '14/07/2026',
        time: '07:05',
        title: 'Início real',
        description: 'Operação iniciada',
        icon: 'play_arrow',
        variant: 'success',
      },
      {
        id: 3,
        date: '14/07/2026',
        time: '07:10',
        title: 'Entrada de operador',
        description: 'João Silva',
        icon: 'person',
        variant: 'neutral',
      },
      {
        id: 4,
        date: '14/07/2026',
        time: '07:12',
        title: 'Entrada de operador',
        description: 'Carlos Souza',
        icon: 'person',
        variant: 'neutral',
      },
      {
        id: 5,
        date: '15/07/2026',
        time: '12:00',
        title: 'Pausa para almoço',
        description: 'João Silva',
        duration: '01h 00min',
        icon: 'pause',
        variant: 'warning',
      },
      {
        id: 6,
        date: '15/07/2026',
        time: '14:20',
        title: 'Paralisação',
        description: 'Falta de material',
        duration: '01h 25min',
        icon: 'warning',
        variant: 'danger',
      },
      {
        id: 7,
        date: '15/07/2026',
        time: '15:45',
        title: 'Paralisação resolvida',
        description: 'Material disponibilizado',
        icon: 'check',
        variant: 'success',
      },
      {
        id: 8,
        date: '15/07/2026',
        time: '17:00',
        title: 'Saída de operador',
        description: 'Carlos Souza',
        icon: 'logout',
        variant: 'info',
      },
      {
        id: 9,
        date: '15/07/2026',
        time: '18:00',
        title: 'Ordem concluída',
        description: 'Execução finalizada com sucesso',
        icon: 'task_alt',
        variant: 'success',
      },
    ],

    activeOperators: [
      {
        id: 1,
        name: 'João Silva',
        ra: '1246',
        role: 'Operador',
        active: false,
        continuousTime: '03h 25min',
        workedTime: '22h 15min',
        pauseTime: '01h 40min',
        stopTime: '01h 25min',
      },
      {
        id: 2,
        name: 'Carlos Souza',
        ra: '3321',
        role: 'Operador',
        active: false,
        continuousTime: '01h 42min',
        workedTime: '18h 30min',
        pauseTime: '01h 30min',
        stopTime: '00h 35min',
      },
      {
        id: 3,
        name: 'Pedro Santos',
        ra: '4788',
        role: 'Auxiliar',
        active: false,
        continuousTime: '02h 10min',
        workedTime: '10h 50min',
        pauseTime: '00h 35min',
        stopTime: '00h 00min',
      },
    ],

    operatorSummary: [
      {
        id: 1,
        name: 'João Silva',
        ra: '1246',
        role: 'Operador',
        active: false,
        continuousTime: '03h 25min',
        workedTime: '22h 15min',
        pauseTime: '01h 40min',
        stopTime: '01h 25min',
      },
      {
        id: 2,
        name: 'Carlos Souza',
        ra: '3321',
        role: 'Operador',
        active: false,
        continuousTime: '01h 42min',
        workedTime: '18h 30min',
        pauseTime: '01h 30min',
        stopTime: '00h 35min',
      },
      {
        id: 3,
        name: 'Pedro Santos',
        ra: '4788',
        role: 'Auxiliar',
        active: false,
        continuousTime: '02h 10min',
        workedTime: '10h 50min',
        pauseTime: '00h 35min',
        stopTime: '00h 20min',
      },
    ],

    stops: [
      {
        id: 1,
        start: '14:20',
        end: '15:45',
        reason: 'Falta de material',
        duration: '1h 25min',
        status: 'resolvida',
      },
      {
        id: 2,
        start: '09:10',
        end: '09:45',
        reason: 'Ajuste de projeto',
        duration: '35min',
        status: 'resolvida',
      },
    ],

    relatedReworks: [
      {
        id: 1,
        code: 'OR-00145-01',
        operationDate: '20/01/2026',
        reason: 'Correção de acabamento',
        duration: '01h 25min',
        status: 'concluida',
      },
    ],

    totalProductionTime: '46h 20min',
    totalStopTime: '2h 00min',
    totalPauseTime: '3h 25min',
    effectiveProductionTime: '40h 55min',
  },

  {
    id: 401,
    type: 'OF',

    code: 'OF-00145-07',
    boatCode: 'EMB-00145',
    boatName: 'Lancha Oceanic',
    sector: 'Instalação elétrica',
    responsible: 'Rafael Costa',

    productionStatus: 'em-producao',
    deadlineStatus: 'atrasado',

    plannedTime: '48h 00min',
    currentTime: '52h 35min',
    delayTime: '4h 35min',
    delayPercentage: '9,48% acima do planejado',

    progress: 82,

    operatorEfficiency: 94,
    efficiencyGoal: 90,

    timeline: [
      {
        id: 1,
        date: '14/07/2026',
        time: '07:00',
        title: 'Início planejado',
        description: 'Início previsto da operação',
        icon: 'calendar_month',
        variant: 'info',
      },
      {
        id: 2,
        date: '14/07/2026',
        time: '07:05',
        title: 'Início real',
        description: 'Operação iniciada',
        icon: 'play_arrow',
        variant: 'success',
      },
      {
        id: 3,
        date: '14/07/2026',
        time: '07:10',
        title: 'Entrada de operador',
        description: 'João Silva',
        icon: 'person',
        variant: 'neutral',
      },
      {
        id: 4,
        date: '14/07/2026',
        time: '07:12',
        title: 'Entrada de operador',
        description: 'Carlos Souza',
        icon: 'person',
        variant: 'neutral',
      },
      {
        id: 5,
        date: '15/07/2026',
        time: '12:00',
        title: 'Pausa para almoço',
        description: 'João Silva',
        duration: '01h 00min',
        icon: 'pause',
        variant: 'warning',
      },
      {
        id: 6,
        date: '15/07/2026',
        time: '14:20',
        title: 'Paralisação',
        description: 'Falta de material elétrico',
        duration: '01h 25min',
        icon: 'warning',
        variant: 'danger',
      },
      {
        id: 7,
        date: '15/07/2026',
        time: '15:45',
        title: 'Paralisação resolvida',
        description: 'Material recebido',
        icon: 'check',
        variant: 'success',
      },
      {
        id: 8,
        date: '15/07/2026',
        time: '17:00',
        title: 'Saída de operador',
        description: 'Carlos Souza',
        icon: 'logout',
        variant: 'info',
      },
      {
        id: 9,
        date: '15/07/2026',
        time: '18:00',
        title: 'Fim planejado',
        description: 'Previsão atual de conclusão: 20:35',
        icon: 'schedule',
        variant: 'neutral',
      },
    ],

    activeOperators: [
      {
        id: 1,
        name: 'João Silva',
        ra: '1246',
        role: 'Operador',
        active: true,
        continuousTime: '03h 25min',
        workedTime: '22h 15min',
        pauseTime: '01h 40min',
        stopTime: '01h 25min',
      },
      {
        id: 2,
        name: 'Pedro Santos',
        ra: '4788',
        role: 'Auxiliar',
        active: true,
        continuousTime: '01h 42min',
        workedTime: '10h 50min',
        pauseTime: '00h 35min',
        stopTime: '00h 00min',
      },
    ],

    operatorSummary: [
      {
        id: 1,
        name: 'João Silva',
        ra: '1246',
        role: 'Operador',
        active: true,
        continuousTime: '03h 25min',
        workedTime: '22h 15min',
        pauseTime: '01h 40min',
        stopTime: '01h 25min',
      },
      {
        id: 2,
        name: 'Carlos Souza',
        ra: '3321',
        role: 'Operador',
        active: false,
        continuousTime: '00h 00min',
        workedTime: '18h 30min',
        pauseTime: '01h 30min',
        stopTime: '00h 35min',
      },
      {
        id: 3,
        name: 'Pedro Santos',
        ra: '4788',
        role: 'Auxiliar',
        active: true,
        continuousTime: '01h 42min',
        workedTime: '10h 50min',
        pauseTime: '00h 35min',
        stopTime: '00h 00min',
      },
    ],

    stops: [
      {
        id: 1,
        start: '14:20',
        end: '15:45',
        reason: 'Falta de material elétrico',
        duration: '1h 25min',
        status: 'resolvida',
      },
      {
        id: 2,
        start: '09:10',
        end: '09:45',
        reason: 'Ajuste de projeto',
        duration: '35min',
        status: 'resolvida',
      },
      {
        id: 3,
        start: '16:30',
        end: '-',
        reason: 'Falha no equipamento',
        duration: '20min',
        status: 'aberta',
      },
    ],

    relatedReworks: [
      {
        id: 1,
        code: 'OR-0097-A',
        operationDate: '15/05/2026',
        reason: 'Correção de solda',
        duration: '00h 15min',
        status: 'concluida',
      },
      {
        id: 2,
        code: 'OR-0097-B',
        operationDate: '18/05/2026',
        reason: 'Ajuste de acabamento',
        duration: '02h 30min',
        status: 'em-andamento',
      },
      {
        id: 3,
        code: 'OR-0097-C',
        operationDate: '21/05/2026',
        reason: 'Refazer ligação',
        duration: '01h 45min',
        status: 'pendente',
      },
    ],

    totalProductionTime: '52h 35min',
    totalStopTime: '2h 20min',
    totalPauseTime: '3h 25min',
    effectiveProductionTime: '46h 50min',
  },

  {
    id: 404,
    type: 'ORP',

    code: 'ORP-00145-03',
    boatCode: 'EMB-00145',
    boatName: 'Lancha Oceanic',
    sector: 'Reprocesso da instalação elétrica',
    responsible: 'Rafael Costa',

    productionStatus: 'em-producao',
    deadlineStatus: 'atrasado',

    plannedTime: '08h 00min',
    currentTime: '09h 35min',
    delayTime: '1h 35min',
    delayPercentage: '19,79% acima do planejado',

    progress: 50,

    operatorEfficiency: 86,
    efficiencyGoal: 90,

    timeline: [
      {
        id: 1,
        date: '14/07/2026',
        time: '08:00',
        title: 'ORP criada',
        description: 'Reprocesso autorizado',
        icon: 'assignment',
        variant: 'info',
      },
      {
        id: 2,
        date: '14/07/2026',
        time: '08:15',
        title: 'Execução iniciada',
        description: 'Rafael Costa',
        icon: 'play_arrow',
        variant: 'success',
      },
      {
        id: 3,
        date: '14/07/2026',
        time: '10:40',
        title: 'Pausa técnica',
        description: 'Análise do circuito',
        duration: '45min',
        icon: 'pause',
        variant: 'warning',
      },
      {
        id: 4,
        date: '14/07/2026',
        time: '11:25',
        title: 'Execução retomada',
        description: 'Correção iniciada',
        icon: 'refresh',
        variant: 'success',
      },
    ],

    activeOperators: [
      {
        id: 1,
        name: 'Rafael Costa',
        ra: '5510',
        role: 'Eletricista',
        active: true,
        continuousTime: '02h 15min',
        workedTime: '07h 10min',
        pauseTime: '00h 45min',
        stopTime: '00h 45min',
      },
    ],

    operatorSummary: [
      {
        id: 1,
        name: 'Rafael Costa',
        ra: '5510',
        role: 'Eletricista',
        active: true,
        continuousTime: '02h 15min',
        workedTime: '07h 10min',
        pauseTime: '00h 45min',
        stopTime: '02h 20min',
      },
    ],

    stops: [
      {
        id: 1,
        start: '10:40',
        end: '11:25',
        reason: 'Análise do circuito',
        duration: '45min',
        status: 'resolvida',
      },
    ],

    relatedReworks: [],

    totalProductionTime: '09h 35min',
    totalStopTime: '00h 45min',
    totalPauseTime: '00h 20min',
    effectiveProductionTime: '08h 30min',
  },

  {
    id: 405,
    type: 'OR',

    code: 'OR-00145-03',
    boatCode: 'EMB-00145',
    boatName: 'Lancha Oceanic',
    sector: 'Ajuste em painel elétrico',
    responsible: 'Rafael Costa',

    productionStatus: 'atrasada',
    deadlineStatus: 'atrasado',

    plannedTime: '05h 00min',
    currentTime: '07h 20min',
    delayTime: '2h 20min',
    delayPercentage: '46,67% acima do planejado',

    progress: 45,

    operatorEfficiency: 78,
    efficiencyGoal: 90,

    timeline: [
      {
        id: 1,
        date: '14/07/2026',
        time: '09:00',
        title: 'OR criada',
        description: 'Retrabalho autorizado',
        icon: 'build',
        variant: 'info',
      },
      {
        id: 2,
        date: '14/07/2026',
        time: '09:20',
        title: 'Execução iniciada',
        description: 'Rafael Costa',
        icon: 'play_arrow',
        variant: 'success',
      },
      {
        id: 3,
        date: '14/07/2026',
        time: '11:10',
        title: 'Paralisação',
        description: 'Aguardando componente',
        duration: '02h 20min',
        icon: 'warning',
        variant: 'danger',
      },
    ],

    activeOperators: [
      {
        id: 1,
        name: 'Rafael Costa',
        ra: '5510',
        role: 'Eletricista',
        active: false,
        continuousTime: '00h 00min',
        workedTime: '04h 40min',
        pauseTime: '02h 20min',
        stopTime: '00h 45min',
      },
    ],

    operatorSummary: [
      {
        id: 1,
        name: 'Rafael Costa',
        ra: '5510',
        role: 'Eletricista',
        active: false,
        continuousTime: '00h 00min',
        workedTime: '04h 40min',
        pauseTime: '02h 20min',
        stopTime: '02h 20min',
      },
    ],

    stops: [
      {
        id: 1,
        start: '11:10',
        end: '-',
        reason: 'Aguardando componente',
        duration: '2h 20min',
        status: 'aberta',
      },
    ],

    relatedReworks: [],

    totalProductionTime: '07h 20min',
    totalStopTime: '02h 20min',
    totalPauseTime: '00h 20min',
    effectiveProductionTime: '04h 40min',
  },
];

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function cloneOrder(order) {
  if (!order) {
    return undefined;
  }

  return {
    ...order,

    timeline: order.timeline.map((item) => ({
      ...item,
    })),

    activeOperators: order.activeOperators.map((operator) => ({
      ...operator,
    })),

    operatorSummary: order.operatorSummary.map((operator) => ({
      ...operator,
    })),

    stops: order.stops.map((stop) => ({
      ...stop,

      // O mock Angular mais recente não possui estes dois campos em todos os
      // registros, mas a tela React exibe RA e nome no histórico.
      operatorRa: stop.operatorRa ?? '-',
      operatorName: stop.operatorName ?? '-',
    })),

    relatedReworks: order.relatedReworks.map((rework) => ({
      ...rework,
    })),
  };
}

async function getOrderById(type, id) {
  await delay(300);

  const normalizedType = String(type ?? '')
    .trim()
    .toUpperCase();

  const normalizedId = Number(id);

  if (!normalizedType || !Number.isFinite(normalizedId) || normalizedId <= 0) {
    return undefined;
  }

  const order = orders.find(
    (item) => item.id === normalizedId && item.type === normalizedType,
  );

  return cloneOrder(order);
}

function getOrders() {
  return orders.map((order) => cloneOrder(order));
}

const ordemDetalheService = {
  getOrderById,
  getOrders,
};

export default ordemDetalheService;
