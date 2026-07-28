import { useEffect, useMemo, useState } from 'react';

import {
  MdGroups,
  MdEngineering,
  MdAccessTime,
  MdBlock,
  MdSearch,
  MdRefresh,
} from 'react-icons/md';

import PageLoading from '../../Components/PageLoading';

import { getOperatorsStatus } from '../../Services/operadoresStatusService';

import styles from './OperadoresStatus.module.css';

export default function OperadoresStatus() {
  const [loading, setLoading] = useState(true);

  const [operators, setOperators] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    loadOperators();
  }, []);

  async function loadOperators() {
    setLoading(true);

    try {
      const data = await getOperatorsStatus();

      setOperators(data);
    } catch (error) {
      console.error('Erro ao carregar operadores', error);

      setOperators([]);
    }

    setLoading(false);
  }

  const filteredOperators = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return operators.filter((operator) => {
      const matchesSearch =
        !term ||
        operator.name.toLowerCase().includes(term) ||
        operator.ra.includes(term) ||
        operator.area.toLowerCase().includes(term);

      const matchesStatus =
        !selectedStatus || operator.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [operators, searchTerm, selectedStatus]);

  const activeOperators = filteredOperators.filter(
    (item) => item.status === 'Trabalhando',
  );

  const waitingOperators = filteredOperators.filter(
    (item) => item.status === 'Aguardando',
  );

  const unavailableOperators = filteredOperators.filter((item) =>
    ['Férias', 'Afastado', 'Suspenso'].includes(item.status),
  );

  const metrics = [
    {
      icon: <MdGroups />,
      value: operators.length,
      label: 'Total Operadores',
    },

    {
      icon: <MdEngineering />,
      value: activeOperators.length,
      label: 'Trabalhando',
    },

    {
      icon: <MdAccessTime />,
      value: waitingOperators.length,
      label: 'Aguardando',
    },

    {
      icon: <MdBlock />,
      value: unavailableOperators.length,
      label: 'Indisponíveis',
    },
  ];

  function clearFilters() {
    setSearchTerm('');

    setSelectedStatus('');
  }

  function getStatusClass(status) {
    if (status === 'Trabalhando') {
      return styles.success;
    }

    if (status === 'Aguardando') {
      return styles.warning;
    }

    if (['Férias', 'Afastado', 'Suspenso'].includes(status)) {
      return styles.danger;
    }

    return '';
  }

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

              <th>Fase</th>

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
                  <span
                    className={`${styles.badge} ${getStatusClass(operator.status)}`}
                  >
                    {operator.status}
                  </span>
                </td>

                <td>{operator.area}</td>

                <td>{operator.leader}</td>

                <td>{operator.of || '-'}</td>

                <td>{operator.boat || '-'}</td>

                <td>{operator.phase || '-'}</td>

                <td>{operator.time || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (loading) {
    return <PageLoading message="Carregando status dos operadores..." />;
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className={styles.breadcrumb}>Produção / Operadores</span>

          <h1>Status dos Operadores</h1>

          <p>Acompanhe em tempo real a situação dos operadores da produção.</p>
        </div>

        <div className={styles.actions}>
          <div className={styles.search}>
            <MdSearch />

            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar operador..."
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Todos os status</option>

            <option value="Trabalhando">Trabalhando</option>

            <option value="Aguardando">Aguardando</option>

            <option value="Férias">Férias</option>

            <option value="Afastado">Afastado</option>

            <option value="Suspenso">Suspenso</option>
          </select>

          <button onClick={clearFilters}>Limpar</button>

          <button onClick={loadOperators}>
            <MdRefresh />
            Atualizar
          </button>
        </div>
      </header>

      <section className={styles.metrics}>
        {metrics.map((item, index) => (
          <article key={index} className={styles.metric}>
            <div>{item.icon}</div>

            <strong>{item.value}</strong>

            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <section className={styles.section}>
        <h2>Operadores em Atividade</h2>

        {renderTable(activeOperators)}
      </section>

      <section className={styles.section}>
        <h2>Aguardando Início</h2>

        {renderTable(waitingOperators)}
      </section>

      <section className={styles.section}>
        <h2>Indisponíveis</h2>

        {renderTable(unavailableOperators)}
      </section>
    </main>
  );
}
