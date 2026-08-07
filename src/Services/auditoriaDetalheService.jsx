const filterOptions = {
  embarcacoes: [
    {
      value: 'INTM-5001',
      label: 'INTM-5001',
    },
    {
      value: 'INTM-5002',
      label: 'INTM-5002',
    },
    {
      value: 'INTM-5003',
      label: 'INTM-5003',
    },
  ],

  matriculas: [
    {
      value: 'INTM-5001-25',
      label: 'INTM-5001-25',
    },
    {
      value: 'INTM-5002-25',
      label: 'INTM-5002-25',
    },
    {
      value: 'INTM-5003-25',
      label: 'INTM-5003-25',
    },
  ],

  fases: [
    {
      value: 'Montagem Final',
      label: 'Montagem Final',
    },
    {
      value: 'Laminação',
      label: 'Laminação',
    },
    {
      value: 'Pintura',
      label: 'Pintura',
    },
    {
      value: 'Qualidade',
      label: 'Qualidade',
    },
  ],

  estagios: [
    {
      value: 'Acabamentos',
      label: 'Acabamentos',
    },
    {
      value: 'Estrutura',
      label: 'Estrutura',
    },
    {
      value: 'Elétrica',
      label: 'Elétrica',
    },
  ],

  ambientes: [
    {
      value: 'Interno',
      label: 'Interno',
    },
    {
      value: 'Externo',
      label: 'Externo',
    },
  ],
};

let audits = [
  {
    id: 1,

    title: 'Auditoria de Embarcação #001',

    status: 'EM ANDAMENTO',

    createdAt: '06/08/2025 08:30',

    auditor: 'João da Silva',

    boat: 'INTM-5001',

    phase: 'Montagem Final',

    points: [
      {
        id: 1,

        code: 'AP-001',

        category: 'Elétrica',

        defect: 'Fiação / Conexões',

        severity: 'Alta',

        responsibleSector: 'Elétrica',

        status: 'EM REPARO',
      },

      {
        id: 2,

        code: 'AP-002',

        category: 'Estrutural',

        defect: 'Soldagem',

        severity: 'Média',

        responsibleSector: 'Estrutural',

        status: 'AGUARDANDO APROVAÇÃO',
      },

      {
        id: 3,

        code: 'AP-003',

        category: 'Acabamento',

        defect: 'Pintura',

        severity: 'Baixa',

        responsibleSector: 'Acabamento',

        status: 'APROVADO',
      },
    ],
  },

  {
    id: 2,

    title: 'Auditoria de Embarcação #002',

    status: 'CONCLUÍDA',

    createdAt: '05/08/2025 14:10',

    auditor: 'Maria Oliveira',

    boat: 'INTM-5002',

    phase: 'Pintura',

    points: [
      {
        id: 4,

        code: 'AP-001',

        category: 'Pintura',

        defect: 'Risco superficial',

        severity: 'Baixa',

        responsibleSector: 'Pintura',

        status: 'APROVADO',
      },

      {
        id: 5,

        code: 'AP-002',

        category: 'Acabamento',

        defect: 'Mancha na pintura',

        severity: 'Média',

        responsibleSector: 'Acabamento',

        status: 'CONCLUÍDA',
      },
    ],
  },

  {
    id: 3,

    title: 'Auditoria de Embarcação #003',

    status: 'RASCUNHO',

    createdAt: '05/08/2025 16:40',

    auditor: 'Carlos Souza',

    boat: 'INTM-5003',

    phase: 'Qualidade',

    points: [],
  },
];

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

async function getFilterOptions() {
  await delay(200);

  return clone(filterOptions);
}

async function getAudits() {
  await delay(250);

  return clone(audits);
}

async function getAuditById(id) {
  await delay(200);

  return clone(audits.find((audit) => audit.id === Number(id)));
}

async function createAudit() {
  await delay(200);

  const nextId = Math.max(...audits.map((item) => item.id)) + 1;

  const audit = {
    id: nextId,

    title: `Auditoria de Embarcação #${String(nextId).padStart(3, '0')}`,

    status: 'RASCUNHO',

    createdAt: '06/08/2025 10:00',

    auditor: 'João da Silva',

    boat: 'INTM-5001',

    phase: 'Montagem Final',

    points: [],
  };

  audits.push(audit);

  return clone(audit);
}

async function createPoint(auditId) {
  await delay(200);

  const audit = audits.find((item) => item.id === Number(auditId));

  const point = {
    id: Date.now(),

    code: `AP-${String(audit.points.length + 1).padStart(3, '0')}`,

    category: 'Nova Categoria',

    defect: 'Novo Defeito',

    severity: 'Baixa',

    responsibleSector: 'A definir',

    status: 'EM REPARO',
  };

  audit.points.push(point);

  return clone(point);
}

async function deletePoint(auditId, pointId) {
  await delay(150);

  audits = audits.map((audit) => {
    if (audit.id !== Number(auditId)) {
      return audit;
    }

    return {
      ...audit,

      points: audit.points.filter((point) => point.id !== Number(pointId)),
    };
  });

  return true;
}

async function saveAudits(updatedAudits) {
  await delay(300);

  audits = clone(updatedAudits);

  return true;
}

async function finishAudit(id) {
  await delay(200);

  audits = audits.map((audit) => {
    if (audit.id !== Number(id)) {
      return audit;
    }

    return {
      ...audit,

      status: 'CONCLUÍDA',
    };
  });

  return true;
}

const auditoriaDetalheService = {
  getFilterOptions,

  getAudits,

  getAuditById,

  createAudit,

  createPoint,

  deletePoint,

  saveAudits,

  finishAudit,
};

export default auditoriaDetalheService;
