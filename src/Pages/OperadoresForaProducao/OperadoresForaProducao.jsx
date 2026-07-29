import { useMemo, useState } from 'react';

import {
  MdGroups,
  MdAccessTime,
  MdBlock,
  MdSearch,
  MdRefresh,
} from 'react-icons/md';

import styles from './OperadoresForaProducao.module.css';

const mock = [
  {
    id: 1,
    initials: 'JS',
    name: 'João Silva',
    ra: '12456',
    area: 'Elétrica',
    leader: 'Carlos Oliveira',
    status: 'Aguardando início',
    of: 'OF-00145-07',
    boat: 'Intermarine 60',
    phase: 'Elétrica',
    time: '03:09h',
    reason: '',
  },

  {
    id: 2,
    initials: 'PA',
    name: 'Pedro Alves',
    ra: '56421',
    area: 'Pré-Montagem',
    leader: 'Lucas Ferreira',
    status: 'Disponível sem atrelamento',
    of: '-',
    boat: '-',
    phase: '-',
    time: '11:24h',
    reason: '',
  },

  {
    id: 3,
    initials: 'AS',
    name: 'Ana Souza',
    ra: '77881',
    area: 'Laminação',
    leader: 'Ricardo Souza',
    status: 'Indisponível',
    of: '-',
    boat: '-',
    phase: '-',
    time: '-',
    reason: 'Férias',
  },
];

export default function OperadoresForaProducao() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOperators = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return mock.filter(
      (item) =>
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.ra.includes(term) ||
        item.area.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  const semAtrelamento = filteredOperators.filter(
    (item) => item.status === 'Disponível sem atrelamento',
  );

  const aguardando = filteredOperators.filter(
    (item) => item.status === 'Aguardando início',
  );

  const indisponiveis = filteredOperators.filter(
    (item) => item.status === 'Indisponível',
  );

  function renderTable(list) {
    return (
      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Operador</th>

              <th>Status</th>

              <th>Área</th>

              <th>Líder</th>

              <th>OF</th>

              <th>Embarcação</th>

              <th>Motivo</th>

              <th>Tempo</th>
            </tr>
          </thead>

          <tbody>
            {list.map((operator) => (
              <tr key={operator.id}>
                <td>
                  <div className={styles.operator}>
                    <div className={styles.avatar}>{operator.initials}</div>

                    <div>
                      <strong>{operator.name}</strong>

                      <small>RA {operator.ra}</small>
                    </div>
                  </div>
                </td>

                <td>
                  <span className={styles.badge}>{operator.status}</span>
                </td>

                <td>{operator.area}</td>

                <td>{operator.leader}</td>

                <td>{operator.of}</td>

                <td>{operator.boat}</td>

                <td>{operator.reason || '-'}</td>

                <td>{operator.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className={styles.breadcrumb}>Produção / Operadores</span>

          <h1>Fora de Produção</h1>

          <p>
            Acompanhe operadores disponíveis, aguardando início e indisponíveis.
          </p>
        </div>

        <div className={styles.actions}>
          <div className={styles.search}>
            <MdSearch />

            <input
              placeholder="Buscar operador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button>
            <MdRefresh />
            Atualizar
          </button>
        </div>
      </header>

      <section className={styles.metrics}>
        <article className={styles.metric}>
          <div>
            <MdGroups />
          </div>

          <strong>{filteredOperators.length}</strong>

          <span>Fora de Produção</span>
        </article>

        <article className={styles.metric}>
          <div>
            <MdAccessTime />
          </div>

          <strong>{aguardando.length}</strong>

          <span>Aguardando Início</span>
        </article>

        <article className={styles.metric}>
          <div>
            <MdBlock />
          </div>

          <strong>{indisponiveis.length}</strong>

          <span>Indisponíveis</span>
        </article>
      </section>

      <section className={styles.section}>
        <h2>Disponível sem atrelamento</h2>

        {renderTable(semAtrelamento)}
      </section>

      <section className={styles.section}>
        <h2>Aguardando início com atrelamento</h2>

        {renderTable(aguardando)}
      </section>

      <section className={styles.section}>
        <h2>Indisponível por motivo</h2>

        {renderTable(indisponiveis)}
      </section>
    </main>
  );
}
