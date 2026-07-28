import { useCallback, useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  MdArrowBack,
  MdDownload,
  MdEmojiEvents,
  MdFilterAltOff,
  MdGroups,
  MdMilitaryTech,
  MdPersonSearch,
  MdSchedule,
  MdSearch,
  MdTaskAlt,
  MdTrendingDown,
  MdTrendingFlat,
  MdTrendingUp,
  MdVisibility,
  MdWarningAmber,
  MdWorkspacePremium,
} from 'react-icons/md';

import PageLoading from '../../Components/PageLoading';
import NotificationDropdown from '../../Components/NotificationDropdown';

import styles from './DashboardOperadores.module.css';

const phases = [
  'Laminação',
  'Pré Montagem',
  'Pintura',
  'Montagem Final',
  'Piscina',
  'Qualidade',
];

const periods = [
  {
    value: 'hoje',
    label: 'Hoje',
  },
  {
    value: '7dias',
    label: 'Últimos 7 dias',
  },
  {
    value: '30dias',
    label: 'Últimos 30 dias',
  },
  {
    value: 'mes',
    label: 'Este mês',
  },
];

const metricsMock = [
  {
    id: 1,
    icon: 'trending_up',
    value: '86,4%',
    label: 'Eficiência Média',
    description: 'Média geral dos operadores',
    variant: 'success',
  },
  {
    id: 2,
    icon: 'emoji_events',
    value: '96,8%',
    label: 'Melhor Eficiência',
    description: 'Maior índice registrado',
    variant: 'success',
  },
  {
    id: 3,
    icon: 'groups',
    value: '28',
    label: 'Operadores Ativos',
    description: 'Com apontamento ativo',
    variant: 'default',
  },
  {
    id: 4,
    icon: 'schedule',
    value: '121:45',
    label: 'Horas Executadas',
    description: 'Tempo total executado',
    variant: 'default',
  },
  {
    id: 5,
    icon: 'task_alt',
    value: '184',
    label: 'OFs Concluídas',
    description: 'Ordens finalizadas',
    variant: 'success',
  },
  {
    id: 6,
    icon: 'warning_amber',
    value: '4',
    label: 'Em Atenção',
    description: 'Operadores abaixo da meta',
    variant: 'warning',
  },
];

const operatorsMock = [
  {
    id: 1,
    name: 'João Santos',
    ra: '12345',
    initials: 'JS',
    phase: 'Montagem Final',
    efficiency: 96.8,
    trend: 4.2,
    completedOF: 18,
    plannedHours: '42:00h',
    executedHours: '39:10h',
    gap: '+02:50h',
  },
  {
    id: 2,
    name: 'Rafael Pereira',
    ra: '12894',
    initials: 'RP',
    phase: 'Laminação',
    efficiency: 94.6,
    trend: 2.8,
    completedOF: 16,
    plannedHours: '38:30h',
    executedHours: '36:20h',
    gap: '+02:10h',
  },
  {
    id: 3,
    name: 'Fernando Lima',
    ra: '12631',
    initials: 'FL',
    phase: 'Pré Montagem',
    efficiency: 91.4,
    trend: 1.7,
    completedOF: 14,
    plannedHours: '36:00h',
    executedHours: '33:40h',
    gap: '+02:20h',
  },
  {
    id: 4,
    name: 'Carlos Eduardo',
    ra: '12487',
    initials: 'CE',
    phase: 'Pintura',
    efficiency: 88.9,
    trend: 0.9,
    completedOF: 13,
    plannedHours: '34:30h',
    executedHours: '32:10h',
    gap: '+02:20h',
  },
  {
    id: 5,
    name: 'Lucas Martins',
    ra: '12913',
    initials: 'LM',
    phase: 'Piscina',
    efficiency: 85.7,
    trend: 1.2,
    completedOF: 12,
    plannedHours: '32:00h',
    executedHours: '30:15h',
    gap: '+01:45h',
  },
  {
    id: 6,
    name: 'Marcos Oliveira',
    ra: '12155',
    initials: 'MO',
    phase: 'Qualidade',
    efficiency: 82.6,
    trend: -1.1,
    completedOF: 11,
    plannedHours: '30:00h',
    executedHours: '31:30h',
    gap: '-01:30h',
  },
  {
    id: 7,
    name: 'Pedro Henrique',
    ra: '12744',
    initials: 'PH',
    phase: 'Laminação',
    efficiency: 78.4,
    trend: -2.4,
    completedOF: 9,
    plannedHours: '28:30h',
    executedHours: '31:10h',
    gap: '-02:40h',
  },
  {
    id: 8,
    name: 'André Souza',
    ra: '12091',
    initials: 'AS',
    phase: 'Pintura',
    efficiency: 72.9,
    trend: -3.1,
    completedOF: 8,
    plannedHours: '27:00h',
    executedHours: '30:45h',
    gap: '-03:45h',
  },
];

const phasePerformanceMock = [
  {
    id: 1,
    name: 'Laminação',
    efficiency: 88.7,
    operators: 6,
    executedHours: 142,
  },
  {
    id: 2,
    name: 'Pré Montagem',
    efficiency: 91.4,
    operators: 5,
    executedHours: 126,
  },
  {
    id: 3,
    name: 'Pintura',
    efficiency: 80.9,
    operators: 4,
    executedHours: 110,
  },
  {
    id: 4,
    name: 'Montagem Final',
    efficiency: 94.3,
    operators: 5,
    executedHours: 154,
  },
  {
    id: 5,
    name: 'Piscina',
    efficiency: 85.7,
    operators: 3,
    executedHours: 88,
  },
  {
    id: 6,
    name: 'Qualidade',
    efficiency: 82.6,
    operators: 5,
    executedHours: 118,
  },
];

function getEfficiencyType(efficiency) {
  if (efficiency >= 85) {
    return 'excellent';
  }

  if (efficiency >= 70) {
    return 'attention';
  }

  return 'critical';
}

function getEfficiencyLabel(efficiency) {
  if (efficiency >= 85) {
    return 'Alta';
  }

  if (efficiency >= 70) {
    return 'Atenção';
  }

  return 'Baixa';
}

function getEfficiencyWidth(efficiency) {
  const safeValue = Math.min(Math.max(efficiency, 0), 100);

  return `${safeValue}%`;
}

function isPositiveGap(gap) {
  return gap.trim().startsWith('+');
}

function getMetricIcon(icon) {
  const map = {
    trending_up: MdTrendingUp,
    emoji_events: MdEmojiEvents,
    groups: MdGroups,
    schedule: MdSchedule,
    task_alt: MdTaskAlt,
    warning_amber: MdWarningAmber,
  };

  return map[icon] ?? MdTrendingUp;
}

export default function DashboardOperadores() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('30dias');

  const [metrics, setMetrics] = useState([]);
  const [operators, setOperators] = useState([]);
  const [phasePerformance, setPhasePerformance] = useState([]);

  const loadDashboard = useCallback(async () => {
    setLoading(true);

    try {
      await new Promise((resolve) => {
        setTimeout(resolve, 400);
      });

      setMetrics(metricsMock);
      setOperators(operatorsMock);
      setPhasePerformance(phasePerformanceMock);
    } catch (error) {
      console.error('Erro ao carregar dashboard de eficiência:', error);

      setMetrics([]);
      setOperators([]);
      setPhasePerformance([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const filteredOperators = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return operators
      .filter((operator) => {
        const matchesSearch =
          !term ||
          operator.name.toLowerCase().includes(term) ||
          operator.ra.toLowerCase().includes(term) ||
          operator.phase.toLowerCase().includes(term);

        const matchesPhase = !selectedPhase || operator.phase === selectedPhase;

        return matchesSearch && matchesPhase;
      })
      .sort((a, b) => b.efficiency - a.efficiency);
  }, [operators, searchTerm, selectedPhase]);

  const rankedOperators = useMemo(
    () => filteredOperators.slice(0, 5),
    [filteredOperators],
  );

  const bestOperator =
    filteredOperators.length > 0 ? filteredOperators[0] : null;

  function clearFilters() {
    setSearchTerm('');
    setSelectedPhase('');
    setSelectedPeriod('30dias');
  }

  function goBack() {
    navigate('/produtividade-operador');
  }

  function openOperator(operator) {
    if (!operator?.id) {
      return;
    }

    navigate(`/operador-detalhe/${operator.id}`);
  }

  function getEfficiencyClass(efficiency) {
    const type = getEfficiencyType(efficiency);

    const map = {
      excellent: styles.excellent,
      attention: styles.attention,
      critical: styles.critical,
    };

    return map[type] ?? '';
  }

  function getMetricVariantClass(variant) {
    const map = {
      success: styles.success,
      warning: styles.warning,
      danger: styles.danger,
    };

    return map[variant] ?? '';
  }

  if (loading) {
    return (
      <div className={styles.efficiencyDashboardPage}>
        <PageLoading
          message="Carregando dashboard de eficiência..."
          minHeight="calc(100vh - 48px)"
        />
      </div>
    );
  }

  return (
    <div className={styles.efficiencyDashboardPage}>
      <header className={styles.dashboardHeader}>
        <div>
          <button type="button" className={styles.backBtn} onClick={goBack}>
            <MdArrowBack />
            Voltar
          </button>

          <span className={styles.eyebrow}>Produção</span>

          <h1>Operadores Mais </h1>

          <p>
            Acompanhe o desempenho, eficiência e produtividade dos operadores em
            produção.
          </p>
        </div>

        <div className={styles.headerActions}>
          <NotificationDropdown />

          <button type="button" className={styles.exportBtn}>
            <MdDownload />
            Exportar
          </button>
        </div>
      </header>

      <section className={styles.filtersCard}>
        <div className={styles.filtersTitle}>Filtros do Dashboard</div>

        <div className={styles.filtersGrid}>
          <div className={styles.filterItem}>
            <label>Fase de Produção</label>

            <select
              className={styles.filterControl}
              value={selectedPhase}
              onChange={(event) => setSelectedPhase(event.target.value)}
            >
              <option value="">Todas</option>

              {phases.map((phase) => (
                <option key={phase} value={phase}>
                  {phase}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterItem}>
            <label>Operador</label>

            <div className={styles.searchBox}>
              <MdSearch />

              <input
                type="text"
                placeholder="Buscar operador..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          <div className={styles.filterItem}>
            <label>Período</label>

            <select
              className={styles.filterControl}
              value={selectedPeriod}
              onChange={(event) => setSelectedPeriod(event.target.value)}
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterItem}>
            <label>Ações</label>

            <button
              type="button"
              className={styles.clearBtn}
              onClick={clearFilters}
            >
              <MdFilterAltOff />
              Limpar filtros
            </button>
          </div>
        </div>
      </section>

      <section className={styles.metricsGrid}>
        {metrics.map((metric) => {
          const MetricIcon = getMetricIcon(metric.icon);

          return (
            <article
              key={metric.id}
              className={[
                styles.metricCard,
                getMetricVariantClass(metric.variant),
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className={styles.metricIcon}>
                <MetricIcon />
              </div>

              <div className={styles.metricContent}>
                <strong>{metric.value}</strong>

                <span>{metric.label}</span>

                <small>{metric.description}</small>
              </div>
            </article>
          );
        })}
      </section>

      <section className={styles.dashboardGrid}>
        <article className={`${styles.dashboardCard} ${styles.rankingCard}`}>
          <div className={styles.cardHeader}>
            <div>
              <span className={styles.cardEyebrow}>Ranking</span>

              <h2>Operadores Mais </h2>

              <p>Ranking baseado no índice de eficiência atual.</p>
            </div>

            <div className={styles.rankingIcon}>
              <MdEmojiEvents />
            </div>
          </div>

          <div className={styles.rankingList}>
            {rankedOperators.map((operator, index) => {
              const placeClass =
                index === 0
                  ? styles.firstPlace
                  : index === 1
                    ? styles.secondPlace
                    : index === 2
                      ? styles.thirdPlace
                      : '';

              return (
                <div
                  key={operator.id}
                  className={[styles.rankingItem, placeClass]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <div className={styles.rankingPosition}>
                    {index <= 2 ? (
                      <MdWorkspacePremium />
                    ) : (
                      <span>{index + 1}º</span>
                    )}
                  </div>

                  <div className={styles.rankingOperator}>
                    <div className={styles.operatorAvatar}>
                      {operator.initials}
                    </div>

                    <div className={styles.operatorInfo}>
                      <strong>{operator.name}</strong>

                      <span>RA: {operator.ra}</span>

                      <small>{operator.phase}</small>
                    </div>
                  </div>

                  <div className={styles.rankingEfficiency}>
                    <strong>{operator.efficiency}%</strong>

                    <div className={styles.efficiencyBar}>
                      <span
                        className={[
                          styles.efficiencyFill,
                          getEfficiencyClass(operator.efficiency),
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        style={{
                          width: getEfficiencyWidth(operator.efficiency),
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className={[
                      styles.trend,
                      operator.trend > 0
                        ? styles.positive
                        : operator.trend < 0
                          ? styles.negative
                          : styles.neutral,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {operator.trend > 0 ? (
                      <MdTrendingUp />
                    ) : operator.trend < 0 ? (
                      <MdTrendingDown />
                    ) : (
                      <MdTrendingFlat />
                    )}

                    <span>
                      {operator.trend > 0 ? '+' : ''}
                      {operator.trend}%
                    </span>
                  </div>
                </div>
              );
            })}

            {rankedOperators.length === 0 && (
              <div className={styles.emptyState}>
                <MdPersonSearch />

                <strong>Nenhum operador encontrado</strong>

                <span>Ajuste os filtros para visualizar os resultados.</span>
              </div>
            )}
          </div>
        </article>

        {bestOperator && (
          <article
            className={`${styles.dashboardCard} ${styles.bestOperatorCard}`}
          >
            <div className={styles.bestBadge}>
              <MdMilitaryTech />
              Melhor desempenho
            </div>

            <div className={styles.bestOperatorHeader}>
              <div className={styles.bestAvatar}>{bestOperator.initials}</div>

              <div>
                <span>Operador destaque</span>

                <h2>{bestOperator.name}</h2>

                <p>RA: {bestOperator.ra}</p>
              </div>
            </div>

            <div className={styles.bestEfficiency}>
              <span>Eficiência</span>

              <strong>{bestOperator.efficiency}%</strong>

              <div className={`${styles.efficiencyBar} ${styles.large}`}>
                <span
                  className={[
                    styles.efficiencyFill,
                    getEfficiencyClass(bestOperator.efficiency),
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{
                    width: getEfficiencyWidth(bestOperator.efficiency),
                  }}
                />
              </div>
            </div>

            <div className={styles.bestDetails}>
              <div>
                <span>Fase</span>
                <strong>{bestOperator.phase}</strong>
              </div>

              <div>
                <span>OFs concluídas</span>
                <strong>{bestOperator.completedOF}</strong>
              </div>

              <div>
                <span>Horas executadas</span>
                <strong>{bestOperator.executedHours}</strong>
              </div>

              <div>
                <span>Gap</span>
                <strong>{bestOperator.gap}</strong>
              </div>
            </div>
          </article>
        )}
      </section>

      <section className={styles.phasePerformanceCard}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.cardEyebrow}>Produção</span>

            <h2>Eficiência por Fase de Produção</h2>

            <p>Comparativo da eficiência média entre as fases produtivas.</p>
          </div>
        </div>

        <div className={styles.phasePerformanceGrid}>
          {phasePerformance.map((phase) => (
            <article key={phase.id} className={styles.phasePerformanceItem}>
              <div className={styles.phaseTop}>
                <div>
                  <span>{phase.name}</span>

                  <strong>{phase.efficiency}%</strong>
                </div>

                <div
                  className={[
                    styles.phaseStatus,
                    getEfficiencyClass(phase.efficiency),
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {getEfficiencyLabel(phase.efficiency)}
                </div>
              </div>

              <div className={styles.phaseBar}>
                <span
                  className={getEfficiencyClass(phase.efficiency)}
                  style={{
                    width: getEfficiencyWidth(phase.efficiency),
                  }}
                />
              </div>

              <div className={styles.phaseFooter}>
                <span>{phase.operators} operadores</span>

                <span>{phase.executedHours}h executadas</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.operatorsTableCard}>
        <div className={styles.tableHeader}>
          <div>
            <span className={styles.cardEyebrow}>Detalhamento</span>

            <h2>Desempenho dos Operadores</h2>

            <p>Informações detalhadas de produtividade e eficiência.</p>
          </div>

          <span className={styles.tableCount}>
            {filteredOperators.length}{' '}
            {filteredOperators.length === 1 ? 'operador' : 'operadores'}
          </span>
        </div>

        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>Posição</th>
                <th>Operador</th>
                <th>Fase</th>
                <th>OFs Concluídas</th>
                <th>Tempo Planejado</th>
                <th>Tempo Executado</th>
                <th>Gap</th>
                <th>Eficiência</th>
                <th>Tendência</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {filteredOperators.map((operator, index) => (
                <tr key={operator.id}>
                  <td>
                    <div
                      className={[
                        styles.tablePosition,
                        index < 3 ? styles.topThree : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {index + 1}º
                    </div>
                  </td>

                  <td>
                    <div className={styles.tableOperator}>
                      <div className={styles.operatorAvatar}>
                        {operator.initials}
                      </div>

                      <div>
                        <button
                          type="button"
                          className={styles.operatorLink}
                          onClick={() => openOperator(operator)}
                        >
                          {operator.name}
                        </button>

                        <span>RA: {operator.ra}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className={styles.phaseBadge}>{operator.phase}</span>
                  </td>

                  <td>
                    <strong className={styles.tableValue}>
                      {operator.completedOF}
                    </strong>
                  </td>

                  <td>
                    <strong className={styles.tableValue}>
                      {operator.plannedHours}
                    </strong>
                  </td>

                  <td>
                    <strong className={styles.tableValue}>
                      {operator.executedHours}
                    </strong>
                  </td>

                  <td>
                    <span
                      className={[
                        styles.gapValue,
                        isPositiveGap(operator.gap)
                          ? styles.positive
                          : styles.negative,
                      ].join(' ')}
                    >
                      {operator.gap}
                    </span>
                  </td>

                  <td>
                    <div className={styles.tableEfficiency}>
                      <strong>{operator.efficiency}%</strong>

                      <div className={styles.efficiencyBar}>
                        <span
                          className={[
                            styles.efficiencyFill,
                            getEfficiencyClass(operator.efficiency),
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          style={{
                            width: getEfficiencyWidth(operator.efficiency),
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  <td>
                    <div
                      className={[
                        styles.trend,
                        operator.trend > 0
                          ? styles.positive
                          : operator.trend < 0
                            ? styles.negative
                            : styles.neutral,
                      ].join(' ')}
                    >
                      {operator.trend > 0 ? (
                        <MdTrendingUp />
                      ) : operator.trend < 0 ? (
                        <MdTrendingDown />
                      ) : (
                        <MdTrendingFlat />
                      )}

                      <span>
                        {operator.trend > 0 ? '+' : ''}
                        {operator.trend}%
                      </span>
                    </div>
                  </td>

                  <td>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => openOperator(operator)}
                    >
                      <MdVisibility />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredOperators.length === 0 && (
                <tr>
                  <td colSpan={10} className={styles.emptyTable}>
                    Nenhum operador encontrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.legendContainer}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.excellent}`} />

          <strong>Alta eficiência</strong>

          <small>85% ou mais</small>
        </div>

        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.attention}`} />

          <strong>Atenção</strong>

          <small>Entre 70% e 84%</small>
        </div>

        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.critical}`} />

          <strong>Baixa eficiência</strong>

          <small>Abaixo de 70%</small>
        </div>
      </section>
    </div>
  );
}
