const sugestoesMock = [
  {
    id: 1,
    operador: 'João Carlos',
    ra: '125478',
    cargo: 'Caldeireiro',
    area: 'Laminação',
    embarcacao: 'INT-405',
    of: 'OF-2026-01458',
    descricao: 'Laminação - Casco Bombordo',
    ultimoApontamento: {
      data: '03/08/2026',
      inicio: '07:18',
      fim: '16:42',
    },
    tempo: '08h24min',
    status: 'Em andamento',
    sugestao: {
      tipo: 'Mesma OF',
      descricao: 'Reatrelar operador à mesma OF.',
      prioridade: 'Alta prioridade de reatrelação.',
    },
  },
  {
    id: 2,
    operador: 'Carlos Eduardo',
    ra: '234567',
    cargo: 'Soldador',
    area: 'Laminação',
    embarcacao: 'INT-405',
    of: 'OF-2026-01432',
    descricao: 'Laminação - Longarina 12 BE',
    ultimoApontamento: {
      data: '03/08/2026',
      inicio: '07:05',
      fim: '15:30',
    },
    tempo: '08h25min',
    status: 'Pausada',
    sugestao: {
      tipo: 'Mesma OF',
      descricao: 'Reatrelar operador à mesma OF.',
      prioridade: 'Alta prioridade de reatrelação.',
    },
  },
  {
    id: 3,
    operador: 'Marcos Oliveira',
    ra: '345678',
    cargo: 'Caldeireiro',
    area: 'Laminação',
    embarcacao: 'INT-405',
    of: 'OF-2026-01415',
    descricao: 'Laminação - Fundo',
    ultimoApontamento: {
      data: '03/08/2026',
      inicio: '06:50',
      fim: '14:10',
    },
    tempo: '07h20min',
    status: 'Paralisada',
    sugestao: {
      tipo: 'Outra OF',
      descricao: 'Direcionar operador para OF pendente.',
      prioridade: 'Média prioridade.',
    },
  },
  {
    id: 4,
    operador: 'Alexandre Santos',
    ra: '456789',
    cargo: 'Montador',
    area: 'Montagem',
    embarcacao: 'INT-402',
    of: 'OF-2026-01388',
    descricao: 'Laminação - Chapa Convés',
    ultimoApontamento: {
      data: '03/08/2026',
      inicio: '07:40',
      fim: '16:20',
    },
    tempo: '08h40min',
    status: 'Em andamento',
    sugestao: {
      tipo: 'Mesma OF',
      descricao: 'Reatrelar operador à mesma OF.',
      prioridade: 'Alta prioridade de reatrelação.',
    },
  },
  {
    id: 5,
    operador: 'Felipe Santos',
    ra: '552321',
    cargo: 'Eletricista',
    area: 'Elétrica',
    embarcacao: 'INT-405',
    of: 'OF-2026-01502',
    descricao: 'Instalação elétrica',
    ultimoApontamento: {
      data: '03/08/2026',
      inicio: '08:00',
      fim: '17:00',
    },
    tempo: '09h00min',
    status: 'Em andamento',
    sugestao: {
      tipo: 'Mesma OF',
      descricao: 'Continuar apontamento anterior.',
      prioridade: 'Alta prioridade.',
    },
  },
  {
    id: 6,
    operador: 'Ricardo Lopes',
    ra: '7412',
    cargo: 'Laminador',
    area: 'Laminação',
    embarcacao: 'INT-405',
    of: 'OF-2026-01510',
    descricao: 'Laminação estrutural',
    ultimoApontamento: {
      data: '03/08/2026',
      inicio: '07:20',
      fim: '16:50',
    },
    tempo: '09h30min',
    status: 'Pausada',
    sugestao: {
      tipo: 'Mesma OF',
      descricao: 'Retomar última atividade.',
      prioridade: 'Alta prioridade.',
    },
  },
];

const indicadoresMock = {
  totalOperadores: 42,
  sugestoesEncontradas: 18,
  ofsPendentes: 9,
  operadoresDisponiveis: 24,
  operadoresAtrelados: 18,
};

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function getSugestoes() {
  await delay(300);

  return sugestoesMock.map((item) => ({
    ...item,
    ultimoApontamento: {
      ...item.ultimoApontamento,
    },
    sugestao: {
      ...item.sugestao,
    },
  }));
}

async function getIndicadores() {
  await delay(200);

  return {
    ...indicadoresMock,
  };
}

async function getSugestoesFiltradas(filters) {
  await delay(300);

  let data = [...sugestoesMock];

  if (filters?.area) {
    data = data.filter((item) => item.area === filters.area);
  }

  if (filters?.operador) {
    data = data.filter((item) =>
      item.operador.toLowerCase().includes(filters.operador.toLowerCase()),
    );
  }

  if (filters?.embarcacao && filters.embarcacao !== 'Todas') {
    data = data.filter((item) => item.embarcacao === filters.embarcacao);
  }

  if (filters?.of) {
    data = data.filter((item) => item.of === filters.of);
  }

  if (filters?.data) {
    const dataFormatada = new Date(filters.data).toLocaleDateString('pt-BR');

    data = data.filter((item) => item.ultimoApontamento.data === dataFormatada);
  }

  return data;
}

async function atrelarOperador(id) {
  await delay(500);

  return {
    success: true,
    message: 'Operador atrelado com sucesso',
    id,
  };
}

async function iniciarApontamento(id) {
  await delay(500);

  return {
    success: true,
    message: 'Apontamento iniciado',
    id,
  };
}

async function ignorarSugestao(id) {
  await delay(500);

  return {
    success: true,
    message: 'Sugestão ignorada',
    id,
  };
}

const sugestaoAtrelamentoService = {
  getSugestoes,
  getIndicadores,
  getSugestoesFiltradas,
  atrelarOperador,
  iniciarApontamento,
  ignorarSugestao,
};

export default sugestaoAtrelamentoService;
