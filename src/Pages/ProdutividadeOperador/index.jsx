import { useCallback, useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  MdAnalytics,
  MdDownload,
  MdFilterAltOff,
  MdGroups,
  MdInfoOutline,
  MdMoreHoriz,
  MdPersonOff,
  MdPersonOutline,
  MdSchedule,
  MdSearch,
  MdTimer,
  MdTrendingDown,
  MdTrendingUp,
} from 'react-icons/md';

import produtividadeOperadorService from '../../Services/produtividadeOperadorService';

import PageLoading from '../../Components/PageLoading';
import NotificationDropdown from '../../Components/NotificationDropdown';

import styles from './ProdutividadeOperador.module.css';

const phases = [
  'Laminação',
  'Pré Montagem',
  'Pintura',
  'Montagem Final',
  'Piscina',
  'Qualidade',
];

const statuses = [
  {
    value: 'ativo',
    label: 'Ativo',
  },
  {
    value: 'inativo',
    label: 'Inativo',
  },
];

function getStatusLabel(status) {
  const statusMap = {
    ativo: 'Ativo',
    inativo: 'Inativo',
  };

  return statusMap[status] ?? status;
}

function getEfficiencyType(efficiency) {
  if (efficiency >= 85) {
    return 'excellent';
  }

  if (efficiency >= 70) {
    return 'attention';
  }

  return 'critical';
}

function getEfficiencyWidth(value) {
  const normalizedValue = Math.min(Math.max(value, 0), 100);

  return `${normalizedValue}%`;
}

function getGapType(gap) {
  if (!gap || gap === '-' || gap === '—') {
    return 'neutral';
  }

  const cleanGap = gap.replace('h', '').trim();

  const parts = cleanGap.split(':');

  if (parts.length !== 2) {
    return 'neutral';
  }

  const hours = Number(parts[0]);

  const minutes = Number(parts[1]);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return 'neutral';
  }

  const totalMinutes = hours * 60 + minutes;

  if (totalMinutes <= 5) {
    return 'excellent';
  }

  if (totalMinutes <= 15) {
    return 'attention';
  }

  return 'critical';
}

export default function ProdutividadeOperador() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');

  const [selectedPhase, setSelectedPhase] = useState('');

  const [selectedStatus, setSelectedStatus] = useState('');

  const [metrics, setMetrics] = useState([]);

  const [operators, setOperators] = useState([]);

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const [metricsData, operatorsData] = await Promise.all([
        produtividadeOperadorService.getMetrics(),
        produtividadeOperadorService.getOperators(),
      ]);

      setMetrics(metricsData);

      setOperators(operatorsData);
    } catch (error) {
      console.error('Erro ao carregar produtividade:', error);

      setMetrics([]);
      setOperators([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredOperators = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return operators.filter((operator) => {
      const name = operator.name?.toLowerCase() ?? '';

      const ra = operator.ra?.toLowerCase() ?? '';

      const of = operator.of?.toLowerCase() ?? '';

      const boat = operator.boat?.toLowerCase() ?? '';

      const phase = operator.phase?.toLowerCase() ?? '';

      const delayDate = operator.delayDate?.toLowerCase() ?? '';

      const startTime = operator.startTime?.toLowerCase() ?? '';

      const matchesSearch =
        !term ||
        name.includes(term) ||
        ra.includes(term) ||
        of.includes(term) ||
        boat.includes(term) ||
        phase.includes(term) ||
        delayDate.includes(term) ||
        startTime.includes(term);

      const matchesPhase =
        !selectedPhase ||
        (operator.status === 'ativo' && operator.phase === selectedPhase);

      const matchesStatus =
        !selectedStatus || operator.status === selectedStatus;

      return matchesSearch && matchesPhase && matchesStatus;
    });
  }, [operators, searchTerm, selectedPhase, selectedStatus]);

  const activeOperators = useMemo(
    () => filteredOperators.filter((operator) => operator.status === 'ativo'),
    [filteredOperators],
  );

  const inactiveOperators = useMemo(
    () => filteredOperators.filter((operator) => operator.status === 'inativo'),
    [filteredOperators],
  );

  function openOperator(operator) {
    if (!operator?.id) {
      console.error('Operador sem ID', operator);

      return;
    }

    navigate(`/operador-detalhe/${operator.id}`);
  }

  function openEfficiencyDashboard() {
    navigate('/dashboard-operadores');
  }

  function clearFilters() {
    setSearchTerm('');
    setSelectedPhase('');
    setSelectedStatus('');
  }

  function getMetricIcon(icon) {
    const map = {
      groups: MdGroups,

      person_off: MdPersonOff,

      schedule: MdSchedule,

      timer: MdTimer,

      trending_up: MdTrendingUp,

      trending_down: MdTrendingDown,
    };

    return map[icon] ?? MdGroups;
  }

  function getMetricVariantClass(variant) {
    const map = {
      success: styles.success,

      warning: styles.warning,

      danger: styles.danger,
    };

    return map[variant] ?? '';
  }

  function getGapClass(gap) {
    const type = getGapType(gap);

    const map = {
      excellent: styles.excellent,

      attention: styles.attention,

      critical: styles.critical,

      neutral: styles.neutral,
    };

    return map[type] ?? styles.neutral;
  }

  function getEfficiencyClass(efficiency) {
    const type = getEfficiencyType(efficiency);

    const map = {
      excellent: styles.excellent,

      attention: styles.attention,

      critical: styles.critical,
    };

    return map[type] ?? styles.critical;
  }

  if (loading) {
    return (
      <div className={styles.productivityPage}>
        <PageLoading
          message="Carregando produtividade dos operadores..."
          minHeight="calc(100vh - 48px)"
        />
      </div>
    );
  }

  return (
    <div className={styles.productivityPage}>
      {/* HEADER */}

      <header className={styles.productivityHeader}>
        <div>
          <span className={styles.eyebrow}>Produção</span>

          <h1>Produtividade do Operador</h1>

          <p>
            Acompanhe em tempo real a produtividade e desempenho dos
            colaboradores por fase de produção.
          </p>
        </div>

        <div className={styles.headerActions}>
          <NotificationDropdown />

          <button
            type="button"
            className={styles.dashboardBtn}
            onClick={openEfficiencyDashboard}
          >
            <MdAnalytics />
            Dashboard: Operadores mais eficientes
          </button>

          <button type="button" className={styles.refreshBtn}>
            <MdDownload />
            Exportar
          </button>
        </div>
      </header>

      {/* FILTROS */}

      <section className={styles.filtersCard}>
        <div className={styles.filtersTitle}>Filtros de Produção</div>

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
            <label>Status</label>

            <select
              className={styles.filterControl}
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
            >
              <option value="">Todos</option>

              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterItem}>
            <label>Ações</label>

            <button
              className={styles.clearBtn}
              type="button"
              onClick={clearFilters}
            >
              <MdFilterAltOff />
              Limpar filtros
            </button>
          </div>
        </div>
      </section>

      {/* MÉTRICAS */}

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

      {/* OPERADORES ATIVOS */}

      <section className={styles.productivityTableCard}>
        <div className={styles.tableHeader}>
          <div>
            <h2>Produtividade dos Operadores</h2>

            <p>Operadores com apontamentos ativos.</p>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.productivityTable}>
            <thead>
              <tr>
                <th>Operador</th>

                <th>Status</th>

                <th>OF / Embarcação</th>

                <th>Fase de Produção</th>

                <th>OR</th>

                <th>ORP</th>

                <th>Tempo Planejado</th>

                <th>Tempo Executado</th>

                <th className={styles.infoColumn}>
                  <div className={styles.columnTitle}>
                    Atrelado pelo Líder
                    <MdInfoOutline className={styles.infoIcon} />
                  </div>
                </th>

                <th className={styles.infoColumn}>
                  <div className={styles.columnTitle}>
                    Início do Apontamento
                    <MdInfoOutline className={styles.infoIcon} />
                  </div>
                </th>

                <th className={styles.gapColumn}>
                  <div className={styles.columnTitle}>
                    Gap (Atrelamento × Início do Apontamento - TOTEM)
                    <MdInfoOutline className={styles.infoIcon} />
                  </div>
                </th>

                <th>Eficiência</th>

                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {activeOperators.map((operator) => (
                <tr key={operator.id}>
                  <td>
                    <div className={styles.operatorInfo}>
                      <div className={styles.operatorAvatar}>
                        {operator.initials}
                      </div>

                      <div className={styles.operatorData}>
                        <button
                          type="button"
                          className={styles.operatorLink}
                          onClick={() => openOperator(operator)}
                        >
                          <strong>{operator.name}</strong>
                        </button>

                        <span>RA: {operator.ra}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span
                      className={[styles.statusBadge, styles.active].join(' ')}
                    >
                      {getStatusLabel(operator.status)}
                    </span>
                  </td>

                  <td>
                    <div className={styles.timeValue}>
                      <strong>{operator.of || '-'}</strong>

                      {operator.boat && operator.boat !== '-' && (
                        <small>Embarcação: {operator.boat}</small>
                      )}
                    </div>
                  </td>

                  <td>
                    {operator.phase && operator.phase !== '-' ? (
                      <span className={styles.phaseBadge}>
                        {operator.phase}
                      </span>
                    ) : (
                      <span className={styles.inactiveEmptyValue}>—</span>
                    )}
                  </td>

                  <td>{operator.or || '-'}</td>

                  <td>{operator.orp || '-'}</td>

                  <td>
                    <div className={styles.timeValue}>
                      <strong>
                        {operator.plannedTime && operator.plannedTime !== '-'
                          ? operator.plannedTime
                          : '-'}
                      </strong>

                      {operator.plannedTime && operator.plannedTime !== '-' && (
                        <small>h</small>
                      )}
                    </div>
                  </td>

                  <td>
                    <div className={styles.timeValue}>
                      <strong>
                        {operator.executedTime && operator.executedTime !== '-'
                          ? operator.executedTime
                          : '-'}
                      </strong>

                      {operator.executedTime &&
                        operator.executedTime !== '-' && <small>h</small>}
                    </div>
                  </td>

                  <td>
                    <div className={styles.leaderLinkInfo}>
                      <strong>{operator.delayDate || '-'}</strong>

                      {operator.delayDate && operator.delayDate !== '-' && (
                        <span>
                          <MdPersonOutline />
                          Líder responsável
                        </span>
                      )}
                    </div>
                  </td>

                  <td>
                    <div className={styles.totemStartInfo}>
                      <strong>{operator.startTime || '-'}</strong>

                      {operator.startTime && operator.startTime !== '-' && (
                        <span>(TOTEM)</span>
                      )}
                    </div>
                  </td>

                  <td>
                    <div
                      className={[styles.newGapValue, getGapClass(operator.gap)]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <strong>{operator.gap || '-'}</strong>

                      {operator.gap && operator.gap !== '-' && <small>h</small>}
                    </div>
                  </td>

                  <td>
                    <div className={styles.efficiency}>
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
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => openOperator(operator)}
                    >
                      <MdMoreHoriz />
                    </button>
                  </td>
                </tr>
              ))}

              {activeOperators.length === 0 && (
                <tr>
                  <td colSpan={13} className={styles.emptyTable}>
                    Nenhum operador ativo encontrado com os filtros
                    selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* OPERADORES INATIVOS */}

      <section
        className={[
          styles.productivityTableCard,
          styles.inactiveTableCard,
        ].join(' ')}
      >
        <div
          className={[styles.tableHeader, styles.inactiveTableHeader].join(' ')}
        >
          <div>
            <h2>Operadores Inativos</h2>

            <p>Operadores sem apontamento ativo no momento.</p>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.productivityTable}>
            <thead>
              <tr>
                <th>Operador</th>
                <th>Status</th>
                <th>OF / Embarcação</th>
                <th>Fase de Produção</th>
                <th>OR</th>
                <th>ORP</th>
                <th>Tempo Planejado</th>
                <th>Tempo Executado</th>
                <th>Atrelado pelo Líder</th>
                <th>Início do Apontamento</th>
                <th>Gap (Atrelamento × Início do Apontamento)</th>
                <th>Eficiência</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {inactiveOperators.map((operator) => (
                <tr key={operator.id} className={styles.inactiveOperatorRow}>
                  <td>
                    <div className={styles.operatorInfo}>
                      <div
                        className={[
                          styles.operatorAvatar,
                          styles.inactiveAvatar,
                        ].join(' ')}
                      >
                        {operator.initials}
                      </div>

                      <div className={styles.operatorData}>
                        <button
                          type="button"
                          className={styles.operatorLink}
                          onClick={() => openOperator(operator)}
                        >
                          <strong>{operator.name}</strong>
                        </button>

                        <span>RA: {operator.ra}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span
                      className={[styles.statusBadge, styles.inactive].join(
                        ' ',
                      )}
                    >
                      {getStatusLabel(operator.status)}
                    </span>
                  </td>

                  {Array.from({
                    length: 10,
                  }).map((_, index) => (
                    <td key={index}>
                      <span className={styles.inactiveEmptyValue}>—</span>
                    </td>
                  ))}

                  <td>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => openOperator(operator)}
                    >
                      <MdMoreHoriz />
                    </button>
                  </td>
                </tr>
              ))}

              {inactiveOperators.length === 0 && (
                <tr>
                  <td colSpan={13} className={styles.emptyTable}>
                    Nenhum operador inativo encontrado com os filtros
                    selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* LEGENDA */}

      <section className={styles.legendContainer}>
        <div className={styles.legendItem}>
          <span className={[styles.legendDot, styles.excellent].join(' ')} />

          <strong>Excelente (até 5 min)</strong>
        </div>

        <div className={styles.legendItem}>
          <span className={[styles.legendDot, styles.attention].join(' ')} />

          <strong>Atenção (6 a 15 min)</strong>
        </div>

        <div className={styles.legendItem}>
          <span className={[styles.legendDot, styles.critical].join(' ')} />

          <strong>Crítico (acima de 15 min)</strong>
        </div>
      </section>
    </div>
  );
}
