const operators = [
  {
    id: 1,

    name: 'João Santos',
    ra: '12345',
    area: 'Laminação',
    leader: 'Carlos Lima',

    image: '/assets/operators/joao.png',

    phase: 'Laminação',

    companyTime: '2 anos e 8 meses',

    efficiency: 94.8,

    workedHours: '164h',
    executedHours: '155,8h',
    plannedHours: '168h',

    gap: '00:04',

    completedOF: 18,
    runningOF: 2,

    averageTime: '08:40',

    reworks: 1,
    stops: 3,
    stoppedTime: '01:15',

    occupation: '94,1%',

    lastUpdate: '15/07/2025 10:30',

    indicators: [
      {
        label: 'Eficiência Média',
        value: '94,8%',
        variant: 'success',
      },
      {
        label: 'Horas Trabalhadas',
        value: '164h',
        variant: 'success',
      },
      {
        label: 'Horas Executadas',
        value: '155,8h',
        variant: 'success',
      },
      {
        label: 'Horas Planejadas',
        value: '168h',
        variant: 'success',
      },
      {
        label: 'Gap Médio',
        value: '00:04',
        variant: 'success',
      },
      {
        label: 'OFs Concluídas',
        value: '18',
        variant: 'success',
      },
      {
        label: 'OFs Em Andamento',
        value: '2',
        variant: 'warning',
      },
      {
        label: 'Tempo Médio OF',
        value: '08:40',
        variant: 'success',
      },
      {
        label: 'Retrabalhos',
        value: '1',
        variant: 'warning',
      },
      {
        label: 'Paralisações',
        value: '3',
        variant: 'warning',
      },
    ],

    areas: [
      {
        name: 'Laminação',

        efficiency: 95.6,

        gap: '00:04',

        operators: [
          {
            name: 'João Santos',
            efficiency: 95.6,
            ofs: 10,
            gap: '00:04',
          },
          {
            name: 'Marcos Tavares',
            efficiency: 92.3,
            ofs: 8,
            gap: '00:06',
          },
          {
            name: 'Pedro Lima',
            efficiency: 90.6,
            ofs: 7,
            gap: '00:08',
          },
        ],

        summary: {
          operators: 28,
          hours: '1.248h',
          completed: 156,
        },
      },

      {
        name: 'Pré Montagem',

        efficiency: 91.4,

        gap: '00:06',

        operators: [
          {
            name: 'Maria Camila',
            efficiency: 93.7,
            ofs: 18,
            gap: '00:05',
          },
          {
            name: 'Ana Paula',
            efficiency: 91.4,
            ofs: 14,
            gap: '00:07',
          },
          {
            name: 'Bruno Rocha',
            efficiency: 89.2,
            ofs: 12,
            gap: '00:09',
          },
        ],

        summary: {
          operators: 24,
          hours: '1.102h',
          completed: 142,
        },
      },

      {
        name: 'Pintura',

        efficiency: 89.8,

        gap: '00:10',

        operators: [
          {
            name: 'Rafael Pereira',
            efficiency: 92.1,
            ofs: 16,
            gap: '00:05',
          },
          {
            name: 'Jonas Ferreira',
            efficiency: 90.3,
            ofs: 14,
            gap: '00:07',
          },
          {
            name: 'Felipe Nunes',
            efficiency: 88.7,
            ofs: 11,
            gap: '00:10',
          },
        ],

        summary: {
          operators: 22,
          hours: '948h',
          completed: 128,
        },
      },

      {
        name: 'Montagem Final',

        efficiency: 92.2,

        gap: '00:07',

        operators: [
          {
            name: 'Lucas Costa',
            efficiency: 93.2,
            ofs: 17,
            gap: '00:05',
          },
          {
            name: 'André Luiz',
            efficiency: 91,
            ofs: 16,
            gap: '00:07',
          },
          {
            name: 'Matheus Alves',
            efficiency: 89.4,
            ofs: 15,
            gap: '00:08',
          },
        ],

        summary: {
          operators: 26,
          hours: '1.156h',
          completed: 146,
        },
      },

      {
        name: 'Piscina',

        efficiency: 88.8,

        gap: '00:08',

        operators: [
          {
            name: 'Carlos Lima',
            efficiency: 90.5,
            ofs: 15,
            gap: '00:06',
          },
          {
            name: 'Douglas Rocha',
            efficiency: 88.8,
            ofs: 14,
            gap: '00:08',
          },
          {
            name: 'Paulo Henrique',
            efficiency: 87.3,
            ofs: 13,
            gap: '00:09',
          },
        ],

        summary: {
          operators: 18,
          hours: '842h',
          completed: 104,
        },
      },

      {
        name: 'Qualidade',

        efficiency: 93.2,

        gap: '00:05',

        operators: [
          {
            name: 'Fernanda Silva',
            efficiency: 94,
            ofs: 12,
            gap: '00:04',
          },
          {
            name: 'Juliana Costa',
            efficiency: 92.2,
            ofs: 10,
            gap: '00:05',
          },
          {
            name: 'Camila Pereira',
            efficiency: 90.1,
            ofs: 9,
            gap: '00:07',
          },
        ],

        summary: {
          operators: 20,
          hours: '1.024h',
          completed: 136,
        },
      },
    ],

    heatmap: [
      {
        day: 'Seg',
        values: [90, 92, 88, 95, 94],
      },
      {
        day: 'Ter',
        values: [92, 95, 90, 96, 93],
      },
      {
        day: 'Qua',
        values: [88, 91, 94, 92, 97],
      },
      {
        day: 'Qui',
        values: [95, 98, 96, 99, 97],
      },
      {
        day: 'Sex',
        values: [91, 93, 90, 95, 94],
      },
    ],

    history: [
      {
        date: '15/07/2025',
        of: 'OF-2025-0087',
        boat: 'Ventus 38',
        phase: 'Laminação',
        planned: '08:00',
        executed: '07:35',
        efficiency: 94.8,
        gap: '00:04',
      },
      {
        date: '14/07/2025',
        of: 'OF-2025-0086',
        boat: 'Solaris 44',
        phase: 'Pré Montagem',
        planned: '07:30',
        executed: '07:10',
        efficiency: 92.5,
        gap: '00:05',
      },
      {
        date: '13/07/2025',
        of: 'OF-2025-0085',
        boat: 'Oceanus 50',
        phase: 'Pintura',
        planned: '08:00',
        executed: '08:20',
        efficiency: 89.7,
        gap: '00:10',
      },
      {
        date: '12/07/2025',
        of: 'OF-2025-0084',
        boat: 'Poseidon 52',
        phase: 'Piscina',
        planned: '06:00',
        executed: '05:45',
        efficiency: 91.8,
        gap: '00:08',
      },
      {
        date: '11/07/2025',
        of: 'OF-2025-0083',
        boat: 'Oceanus 50',
        phase: 'Montagem Final',
        planned: '09:00',
        executed: '08:40',
        efficiency: 93.4,
        gap: '00:06',
      },
    ],

    ranking: [
      {
        label: 'Geral',
        position: '1º',
      },
      {
        label: 'Área',
        position: '1º',
      },
      {
        label: 'Semana',
        position: '1º',
      },
      {
        label: 'Mês',
        position: '2º',
      },
      {
        label: 'Ano',
        position: '3º',
      },
    ],
  },
];

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function getOperatorById(id) {
  await delay(300);

  const operator = operators.find((item) => item.id === Number(id));

  if (!operator) {
    return undefined;
  }

  return structuredClone(operator);
}

const operadorDetalheService = {
  getOperatorById,
};

export default operadorDetalheService;
