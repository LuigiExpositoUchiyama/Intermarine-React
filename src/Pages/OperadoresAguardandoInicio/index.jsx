import { useCallback, useEffect, useMemo, useState } from 'react';

import { useParams } from 'react-router-dom';

import { MdSearch, MdRefresh, MdPersonSearch } from 'react-icons/md';

import PageLoading from '../../Components/PageLoading';

import { getWaitingOperatorsByBoat } from '../../Services/operadoresAguardandoInicioService';

import styles from './OperadoresAguardandoInicio.module.css';

export default function OperadoresAguardandoInicio() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [operators, setOperators] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const loadOperators = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getWaitingOperatorsByBoat(id);

      setOperators(data);
    } catch (error) {
      console.error('Erro ao carregar operadores aguardando início', error);

      setOperators([]);
    }

    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadOperators();
  }, [loadOperators]);

  const filteredOperators = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return operators.filter((operator) => {
      return (
        !term ||
        operator.name?.toLowerCase().includes(term) ||
        operator.ra?.includes(term) ||
        operator.area?.toLowerCase().includes(term)
      );
    });
  }, [operators, searchTerm]);

  if (loading) {
    return <PageLoading message="Carregando operadores aguardando início..." />;
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className={styles.breadcrumb}>Produção / Operadores</span>

          <h1>Operadores Aguardando Início</h1>

          <p>Operadores vinculados às OFs sem apontamento desta embarcação.</p>
        </div>

        <div className={styles.actions}>
          <div className={styles.search}>
            <MdSearch />

            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar operador..."
            />
          </div>

          <button type="button" onClick={loadOperators}>
            <MdRefresh />
            Atualizar
          </button>
        </div>
      </header>

      <section className={styles.infoCard}>
        <div className={styles.iconBox}>
          <MdPersonSearch />
        </div>

        <div>
          <strong>{filteredOperators.length}</strong>

          <span>Operadores aguardando início</span>
        </div>
      </section>

      <section className={styles.card}>
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

                <th>Tempo aguardando</th>
              </tr>
            </thead>

            <tbody>
              {filteredOperators.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    Nenhum operador aguardando início encontrado.
                  </td>
                </tr>
              ) : (
                filteredOperators.map((operator) => (
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
                      <span className={styles.badge}>Aguardando</span>
                    </td>

                    <td>{operator.area || '-'}</td>

                    <td>{operator.leader || '-'}</td>

                    <td>{operator.of || '-'}</td>

                    <td>{operator.boat || '-'}</td>

                    <td>{operator.phase || '-'}</td>

                    <td>{operator.time || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
