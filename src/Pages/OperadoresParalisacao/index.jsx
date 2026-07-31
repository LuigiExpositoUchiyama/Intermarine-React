import { useEffect, useMemo, useState } from 'react';

import {
  MdPauseCircle,
  MdSearch,
  MdRefresh,
  MdEngineering,
  MdAccessTime,
  MdWarning,
  MdInventory,
} from 'react-icons/md';

import PageLoading from '../../Components/PageLoading';

import { getOperatorsStop } from '../../Services/operadoresParalisacaoService';

import styles from './OperadoresParalisacao.module.css';

export default function OperadoresParalisacao() {
  const [loading, setLoading] = useState(true);

  const [operators, setOperators] = useState([]);

  const [search, setSearch] = useState('');

  const [reason, setReason] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    try {
      const data = await getOperatorsStop();

      setOperators(data);
    } catch (error) {
      console.error('Erro ao carregar paralisações', error);

      setOperators([]);
    }

    setLoading(false);
  }

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();

    return operators.filter((item) => {
      const matchSearch =
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.ra.includes(term) ||
        item.area.toLowerCase().includes(term);

      const matchReason = !reason || item.reason === reason;

      return matchSearch && matchReason;
    });
  }, [operators, search, reason]);

  const total = operators.length;

  const material = operators.filter(
    (item) => item.reason === 'Falta de material',
  ).length;

  const manutencao = operators.filter(
    (item) => item.reason === 'Manutenção',
  ).length;

  const maiorTempo = operators[0]?.time || '00:00';

  if (loading) {
    return <PageLoading message="Carregando paralisações..." />;
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className={styles.breadcrumb}>Produção / Operadores</span>

          <h1>Operadores em Paralisação</h1>

          <p>Acompanhe operadores atualmente parados na produção.</p>
        </div>

        <div className={styles.actions}>
          <div className={styles.search}>
            <MdSearch />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar operador..."
            />
          </div>

          <select value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="">Todos motivos</option>

            <option>Falta de material</option>

            <option>Manutenção</option>

            <option>Aguardando liberação</option>
          </select>

          <button onClick={loadData}>
            <MdRefresh />
            Atualizar
          </button>
        </div>
      </header>

      <section className={styles.metrics}>
        <div className={styles.metric}>
          <div>
            <MdPauseCircle />
          </div>

          <strong>{total}</strong>

          <span>Em Paralisação</span>
        </div>

        <div className={styles.metric}>
          <div>
            <MdAccessTime />
          </div>

          <strong>{maiorTempo}</strong>

          <span>Maior tempo parado</span>
        </div>

        <div className={styles.metric}>
          <div>
            <MdInventory />
          </div>

          <strong>{material}</strong>

          <span>Falta de material</span>
        </div>

        <div className={styles.metric}>
          <div>
            <MdWarning />
          </div>

          <strong>{manutencao}</strong>

          <span>Manutenção</span>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Operadores Parados</h2>

        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Operador</th>

                <th>Área</th>

                <th>OF</th>

                <th>Embarcação</th>

                <th>Motivo</th>

                <th>Tempo</th>

                <th>Início</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((operator) => (
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

                  <td>{operator.area}</td>

                  <td>{operator.of}</td>

                  <td>{operator.boat}</td>

                  <td>
                    <span className={styles.badge}>{operator.reason}</span>
                  </td>

                  <td>{operator.time}</td>

                  <td>{operator.start}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
