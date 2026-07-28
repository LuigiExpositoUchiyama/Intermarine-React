import { useCallback, useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { MdArrowBack, MdFilterAltOff, MdOpenInNew } from 'react-icons/md';

import operadorDetalheService from '../../Services/operadorDetalheService';

import PageLoading from '../../Components/PageLoading';

import styles from './OperadorDetalhe.module.css';

function getEfficiencyType(value) {
  if (value >= 85) {
    return 'excellent';
  }

  if (value >= 70) {
    return 'attention';
  }

  return 'critical';
}

export default function OperadorDetalhe() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [operator, setOperator] = useState(null);

  const loadOperator = useCallback(async () => {
    setLoading(true);

    try {
      const operatorId = Number(id);

      const data = await operadorDetalheService.getOperatorById(operatorId);

      setOperator(data ?? null);
    } catch (error) {
      console.error('Erro ao carregar operador', error);

      setOperator(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadOperator();
  }, [loadOperator]);

  function goBack() {
    navigate('/produtividade-operador');
  }

  function getEfficiencyClass(value) {
    const type = getEfficiencyType(value);

    const map = {
      excellent: styles.excellent,

      attention: styles.attention,

      critical: styles.critical,
    };

    return map[type] ?? '';
  }

  function getIndicatorClass(variant) {
    const map = {
      success: styles.success,

      warning: styles.warning,

      danger: styles.danger,
    };

    return map[variant] ?? '';
  }

  function getHeatClass(value) {
    if (value >= 90) {
      return styles.high;
    }

    if (value >= 70) {
      return styles.medium;
    }

    return styles.low;
  }

  if (loading) {
    return (
      <div className={styles.operatorDetailPage}>
        <PageLoading
          message="Carregando detalhes do operador..."
          minHeight="calc(100vh - 40px)"
        />
      </div>
    );
  }

  if (!operator) {
    return (
      <div className={styles.operatorDetailPage}>
        <div className={styles.operatorNotFound}>
          <h2>Operador não encontrado</h2>

          <p>Não foi possível localizar o operador informado.</p>

          <button type="button" onClick={goBack}>
            <MdArrowBack />
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.operatorDetailPage}>
      <header className={styles.operatorDetailHeader}>
        <div>
          <button className={styles.backBtn} type="button" onClick={goBack}>
            <MdArrowBack />
            Voltar
          </button>

          <span className={styles.eyebrow}>Produção</span>

          <h1>Top Operadores por Área</h1>

          <p>
            Ranking dos melhores operadores por eficiência média da área de
            produção.
          </p>
        </div>

        <div className={styles.headerUpdate}>
          Atualizado em: {operator.lastUpdate}
        </div>
      </header>

      <div className={styles.operatorDashboardLayout}>
        {/* =========================
            ESQUERDA
        ========================= */}

        <section className={styles.operatorLeft}>
          {/* FILTROS */}

          <section className={styles.operatorFilterCard}>
            <div className={styles.filterItem}>
              <label>Período</label>

              <div className={styles.filterControl}>
                15/07/2025 - 15/07/2025
              </div>
            </div>

            <div className={styles.filterItem}>
              <label>Área</label>

              <div className={styles.filterControl}>Todas</div>
            </div>

            <div className={styles.filterItem}>
              <label>Embarcação</label>

              <div className={styles.filterControl}>Todas</div>
            </div>

            <div className={styles.filterItem}>
              <label>Turno</label>

              <div className={styles.filterControl}>Todos</div>
            </div>

            <button className={styles.clearBtn} type="button">
              <MdFilterAltOff />
              Limpar filtros
            </button>
          </section>

          {/* RESUMO */}

          <section className={styles.operatorSummaryGrid}>
            <div className={styles.summaryCard}>
              <span>Melhor Operador da Fábrica</span>

              <strong>{operator.name}</strong>

              <b>{operator.efficiency}%</b>
            </div>

            <div className={styles.summaryCard}>
              <span>Eficiência Média dos Top 5</span>

              <strong>89,4%</strong>

              <b>Meta: 85%</b>
            </div>

            <div className={styles.summaryCard}>
              <span>Menor Gap Médio</span>

              <strong>00:06</strong>

              <b>{operator.name}</b>
            </div>

            <div className={styles.summaryCard}>
              <span>OFs Concluídas</span>

              <strong>312</strong>

              <b>28,7% do total</b>
            </div>

            <div className={styles.summaryCard}>
              <span>Meta de Eficiência</span>

              <strong>85%</strong>

              <b>Global</b>
            </div>

            <div className={styles.summaryCard}>
              <span>Operadores Acima da Meta</span>

              <strong>18</strong>

              <b>63,8% dos ativos</b>
            </div>
          </section>

          {/* ÁREAS */}

          <section className={styles.areaDashboardGrid}>
            {operator.areas.map((area) => (
              <div className={styles.areaCard} key={area.name}>
                <div className={styles.areaHeader}>
                  <div>
                    <h2>{area.name}</h2>
                  </div>

                  <button type="button">Ver detalhes</button>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Operador</th>

                      <th>Eficiência</th>

                      <th>OFs</th>

                      <th>Gap</th>
                    </tr>
                  </thead>

                  <tbody>
                    {area.operators.map((item) => (
                      <tr key={item.name}>
                        <td>
                          <strong>{item.name}</strong>
                        </td>

                        <td>
                          <strong
                            className={getEfficiencyClass(item.efficiency)}
                          >
                            {item.efficiency}%
                          </strong>
                        </td>

                        <td>{item.ofs}</td>

                        <td>{item.gap}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className={styles.areaFooter}>
                  <div>
                    <span>Média da Área</span>

                    <strong>{area.efficiency}%</strong>
                  </div>

                  <div>
                    <span>Operadores</span>

                    <strong>{area.summary.operators}</strong>
                  </div>

                  <div>
                    <span>Horas Produzidas</span>

                    <strong>{area.summary.hours}</strong>
                  </div>

                  <div>
                    <span>OFs Concluídas</span>

                    <strong>{area.summary.completed}</strong>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </section>

        {/* =========================
            DIREITA
        ========================= */}

        <aside className={styles.operatorRight}>
          {/* PERFIL */}

          <section
            className={[
              styles.operatorSectionCard,
              styles.operatorProfileSide,
            ].join(' ')}
          >
            <div className={styles.sideProfileHeader}>
              <div className={styles.profileAvatar}>
                {operator.image ? (
                  <img src={operator.image} alt={operator.name} />
                ) : (
                  <span>{operator.name.substring(0, 2).toUpperCase()}</span>
                )}
              </div>

              <div>
                <h2>{operator.name}</h2>

                <span>RA: {operator.ra}</span>

                <span>Área: {operator.area}</span>

                <span>Líder: {operator.leader}</span>

                <span>{operator.companyTime}</span>
              </div>
            </div>

            <div className={styles.sideEfficiency}>
              <strong>{operator.efficiency}%</strong>

              <span>Eficiência Média</span>

              <div className={styles.efficiencyBar}>
                <span
                  className={getEfficiencyClass(operator.efficiency)}
                  style={{
                    width: `${operator.efficiency}%`,
                  }}
                />
              </div>
            </div>
          </section>

          {/* INDICADORES */}

          <section className={styles.operatorSectionCard}>
            <div className={styles.sectionHeader}>
              <h2>Indicadores Gerais</h2>
            </div>

            <div className={styles.indicatorGrid}>
              {operator.indicators.map((item) => (
                <div className={styles.indicatorCard} key={item.label}>
                  <span>{item.label}</span>

                  <strong className={getIndicatorClass(item.variant)}>
                    {item.value}
                  </strong>
                </div>
              ))}
            </div>
          </section>

          {/* DISTRIBUIÇÃO */}

          <section className={styles.operatorSectionCard}>
            <div className={styles.sectionHeader}>
              <h2>Distribuição das OFs por Área</h2>
            </div>

            {operator.areas.map((area) => (
              <div className={styles.areaDistribution} key={area.name}>
                <div className={styles.distributionHeader}>
                  <span>{area.name}</span>

                  <strong>{area.efficiency}%</strong>
                </div>

                <div className={styles.distributionBar}>
                  <span
                    style={{
                      width: `${area.efficiency}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </section>

          {/* HEATMAP + RESUMO */}

          <section className={styles.operatorPerformanceGrid}>
            <div className={styles.operatorSectionCard}>
              <div className={styles.sectionHeader}>
                <h2>Heatmap de Produtividade por Horário</h2>
              </div>

              <div className={styles.heatmapContainer}>
                {operator.heatmap.map((item) => (
                  <div className={styles.heatmapRow} key={item.day}>
                    <span className={styles.heatmapDay}>{item.day}</span>

                    <div className={styles.heatmapValues}>
                      {item.values.map((value, index) => (
                        <span
                          key={`${item.day}-${index}`}
                          className={[styles.heatCell, getHeatClass(value)]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.operatorSectionCard}>
              <div className={styles.sectionHeader}>
                <h2>Resumo Operacional</h2>
              </div>

              <div className={styles.operationGrid}>
                <div className={styles.operationItem}>
                  <span>Tempo Médio OF</span>

                  <strong>{operator.averageTime}</strong>
                </div>

                <div className={styles.operationItem}>
                  <span>OFs Concluídas</span>

                  <strong>{operator.completedOF}</strong>
                </div>

                <div className={styles.operationItem}>
                  <span>OFs Em Andamento</span>

                  <strong>{operator.runningOF}</strong>
                </div>

                <div className={styles.operationItem}>
                  <span>Gap Médio</span>

                  <strong>{operator.gap}</strong>
                </div>

                <div className={styles.operationItem}>
                  <span>Retrabalhos</span>

                  <strong>{operator.reworks}</strong>
                </div>

                <div className={styles.operationItem}>
                  <span>Paralisações</span>

                  <strong>{operator.stops}</strong>
                </div>

                <div className={styles.operationItem}>
                  <span>Tempo Parado</span>

                  <strong>{operator.stoppedTime}</strong>
                </div>

                <div className={styles.operationItem}>
                  <span>Ocupação</span>

                  <strong>{operator.occupation}</strong>
                </div>
              </div>
            </div>
          </section>

          {/* HISTÓRICO */}

          <section className={styles.operatorHistoryCard}>
            <div className={styles.sectionHeader}>
              <h2>Histórico de Produção</h2>
            </div>

            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>OF</th>
                    <th>Embarcação</th>
                    <th>Fase</th>
                    <th>Planejado</th>
                    <th>Executado</th>
                    <th>Eficiência</th>
                    <th>Gap</th>
                  </tr>
                </thead>

                <tbody>
                  {operator.history.map((item) => (
                    <tr key={`${item.date}-${item.of}`}>
                      <td>{item.date}</td>

                      <td>{item.of}</td>

                      <td>{item.boat}</td>

                      <td>
                        <span className={styles.phaseBadge}>{item.phase}</span>
                      </td>

                      <td>{item.planned}</td>

                      <td>{item.executed}</td>

                      <td>
                        <strong className={getEfficiencyClass(item.efficiency)}>
                          {item.efficiency}%
                        </strong>
                      </td>

                      <td>{item.gap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* RANKING */}

          <section className={styles.operatorSectionCard}>
            <div className={styles.sectionHeader}>
              <h2>Ranking do Operador</h2>
            </div>

            <div className={styles.rankingList}>
              {operator.ranking.map((item) => (
                <div className={styles.rankingItem} key={item.label}>
                  <span>{item.label}</span>

                  <strong>{item.position}</strong>
                </div>
              ))}
            </div>

            <button className={styles.reportBtn} type="button">
              Ver relatório completo do operador
              <MdOpenInNew />
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}
