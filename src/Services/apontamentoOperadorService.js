import atrelarOperadorService from './atrelarOperadorService';

function delay(value, time = 300) {
  return new Promise((resolve) =>
    window.setTimeout(() => resolve(value), time),
  );
}

function getNowBrazilian() {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

const apontamentoOperadorService = {
  async getOperadoresParaApontamento(area, ordem) {
    const operadores = await atrelarOperadorService.getOperadoresPorArea(area);

    const ordemCodigo = ordem?.code ?? '';

    const ordemRa = String(ordem?.ra ?? '').trim();

    const jaExiste = operadores.some(
      (operador) => ordemRa && String(operador.ra) === ordemRa,
    );

    const lista = [...operadores];

    if (ordemRa && !jaExiste && ordem?.operator && ordem.operator !== '-') {
      lista.unshift({
        id: `ordem-${ordem.id}`,

        nome: ordem.operator,

        ra: ordemRa,

        centroCusto: ordem.centroCusto ?? '-',

        area: area ?? '-',

        status: 'Ativo',

        ofAtual: ordemCodigo,
      });
    }

    return lista.map((operador) => ({
      ...operador,

      podeIniciar:
        operador.status === 'Ativo' &&
        (operador.ofAtual === ordemCodigo || String(operador.ra) === ordemRa),
    }));
  },

  async iniciarApontamento({ ordemId, ordemCodigo, operadores }) {
    if (!ordemId || !operadores || !operadores.length) {
      throw new Error('Ordem ou colaboradores não informados.');
    }

    const operadorInvalido = operadores.find(
      (operador) => !operador.podeIniciar,
    );

    if (operadorInvalido) {
      throw new Error(
        `${operadorInvalido.nome} não está atrelado a esta ordem.`,
      );
    }

    return delay(
      {
        success: true,

        message: 'Apontamento iniciado com sucesso.',

        ordemId,

        ordemCodigo,

        operadores: operadores.map((operador) => ({
          ...operador,
        })),

        iniciadoEm: getNowBrazilian(),
      },
      500,
    );
  },
};

export default apontamentoOperadorService;
