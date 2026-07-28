import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  MdCalendarMonth,
  MdCheckCircle,
  MdDirectionsBoat,
  MdError,
  MdEventRepeat,
  MdExpandMore,
  MdFilterAlt,
  MdFilterAltOff,
  MdInfo,
  MdRefresh,
  MdSchedule,
  MdSearch,
  MdSearchOff,
  MdWarning,
} from 'react-icons/md';

import dashboardProducaoService from '../../Services/dashboardProducaoService';

import PageLoading from '../../Components/PageLoading';

import styles from './DashboardProducao.module.css';

const phaseColumns = [
  {
    key: 'lamination',
    label: 'Laminação',
  },
  {
    key: 'preAssembly',
    label: 'Pré-Montagem',
  },
  {
    key: 'painting',
    label: 'Pintura',
  },
  {
    key: 'miniFactory',
    label: 'Montagem Final E1',
  },
  {
    key: 'finalAssemblyE2',
    label: 'Montagem Final E2',
  },
  {
    key: 'finalAssemblyE3',
    label: 'Montagem Final E3',
  },
  {
    key: 'pool',
    label: 'Piscina',
  },
  {
    key: 'quality',
    label: 'Qualidade',
  },
];

const statusOptions = [
  {
    value: 'todos',
    label: 'Todos os status',
  },
  {
    value: 'no-prazo',
    label: 'Dentro do prazo',
  },
  {
    value: 'atencao',
    label: 'Atenção',
  },
  {
    value: 'atrasada',
    label: 'Atrasada',
  },
  {
    value: 'nao-iniciada',
    label: 'Não iniciada',
  },
];

function hasDate(value) {
  return Boolean(value && value.trim() && value !== '-');
}

function countBoatReplanning(boat) {
  return phaseColumns.reduce((total, phaseColumn) => {
    const phase = boat[phaseColumn.key];

    if (!phase) {
      return total;
    }

    const changedStart = hasDate(phase.replannedStart);

    const changedEnd = hasDate(phase.replannedEnd);

    return total + (changedStart || changedEnd ? 1 : 0);
  }, 0);
}

function calculateAverageDelay(boatList) {
  const delayedBoats = boatList.filter((boat) => boat.delayDays > 0);

  if (!delayedBoats.length) {
    return 0;
  }

  const totalDelay = delayedBoats.reduce(
    (total, boat) => total + boat.delayDays,
    0,
  );

  return totalDelay / delayedBoats.length;
}

function convertBrazilianDateToTime(dateValue) {
  const parts = dateValue.split('/').map(Number);

  const day = parts[0];

  const month = parts[1];

  const year = parts[2];

  if (!day || !month || !year) {
    return 0;
  }

  return new Date(year, month - 1, day).getTime();
}

function getLatestPlannedDelivery(boatList) {
  const validDates = boatList
    .map((boat) => boat.plannedDelivery)
    .filter((date) => hasDate(date))
    .sort(
      (dateA, dateB) =>
        convertBrazilianDateToTime(dateB) - convertBrazilianDateToTime(dateA),
    );

  return validDates[0] ?? '-';
}

function getPercentage(value, total) {
  if (!total) {
    return '0% do total';
  }

  const percentage = Math.round((value / total) * 100);

  return `${percentage}% do total`;
}

function normalizeText(value) {
  if (!value) {
    return '';
  }

  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function getFormattedLastUpdate() {
  const now = new Date();

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(now);
}

export default function DashboardProducao() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');

  const [selectedStatus, setSelectedStatus] = useState('todos');

  const [lastUpdate, setLastUpdate] = useState('');

  const [boats, setBoats] = useState([]);

  const loadPlanning = useCallback(async () => {
    setLoading(true);

    try {
      const data = await dashboardProducaoService.getPlanning();

      setBoats(Array.isArray(data) ? data : []);

      setLastUpdate(getFormattedLastUpdate());
    } catch (error) {
      console.error('Erro ao carregar planejamento das embarcações:', error);

      setBoats([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlanning();
  }, [loadPlanning]);

  const filteredBoats = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm);

    return boats.filter((boat) => {
      const normalizedCode = normalizeText(boat.code);

      const normalizedName = normalizeText(boat.name);

      const matchesSearch =
        !normalizedSearch ||
        normalizedCode.includes(normalizedSearch) ||
        normalizedName.includes(normalizedSearch);

      const matchesStatus =
        selectedStatus === 'todos' || boat.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [boats, searchTerm, selectedStatus]);

  const metrics = useMemo(() => {
    const totalBoats = boats.length;

    const withinDeadline = boats.filter(
      (boat) => boat.status === 'no-prazo',
    ).length;

    const delayed = boats.filter((boat) => boat.status === 'atrasada').length;

    const attention = boats.filter((boat) => boat.status === 'atencao').length;

    const replanCount = boats.reduce(
      (total, boat) => total + countBoatReplanning(boat),
      0,
    );

    const averageDelay = calculateAverageDelay(boats);

    const plannedDelivery = getLatestPlannedDelivery(boats);

    return [
      {
        id: 1,
        label: 'Embarcações totais',
        value: String(totalBoats),
        description: 'Total no planejamento',
        icon: 'directions_boat',
        variant: 'blue',
      },
      {
        id: 2,
        label: 'Dentro do prazo',
        value: String(withinDeadline),
        description: getPercentage(withinDeadline, totalBoats),
        icon: 'check_circle',
        variant: 'success',
      },
      {
        id: 3,
        label: 'Em atraso',
        value: String(delayed),
        description: getPercentage(delayed, totalBoats),
        icon: 'error',
        variant: 'danger',
      },
      {
        id: 4,
        label: 'Atenção',
        value: String(attention),
        description: getPercentage(attention, totalBoats),
        icon: 'warning',
        variant: 'warning',
      },
      {
        id: 5,
        label: 'Replanejamentos',
        value: String(replanCount),
        description: 'Alterações identificadas',
        icon: 'event_repeat',
        variant: 'blue',
      },
      {
        id: 6,
        label: 'Atraso médio',
        value: `${averageDelay.toFixed(1)} dias`,
        description: 'Média geral de atraso',
        icon: 'schedule',
        variant: averageDelay > 0 ? 'danger' : 'success',
      },
      {
        id: 7,
        label: 'Entrega planejada',
        value: plannedDelivery,
        description: 'Última entrega prevista',
        icon: 'calendar_month',
        variant: 'blue',
      },
    ];
  }, [boats]);

  function clearFilters() {
    setSearchTerm('');
    setSelectedStatus('todos');
  }

  function openBoat(boatId) {
    if (!boatId) {
      return;
    }

    navigate(`/detalhe-producao/embarcacao/${boatId}`);
  }

  function getStatusLabel(status) {
    const statusLabels = {
      'no-prazo': 'Dentro do prazo',
      atencao: 'Atenção',
      atrasada: 'Atrasada',
      'nao-iniciada': 'Não iniciada',
    };

    return statusLabels[status] ?? status;
  }

  function getStatusIcon(status) {
    const icons = {
      'no-prazo': MdCheckCircle,
      atencao: MdWarning,
      atrasada: MdError,
      'nao-iniciada': MdSchedule,
    };

    return icons[status] ?? MdSchedule;
  }

  function getMetricIcon(icon) {
    const iconMap = {
      directions_boat: MdDirectionsBoat,
      check_circle: MdCheckCircle,
      error: MdError,
      warning: MdWarning,
      event_repeat: MdEventRepeat,
      schedule: MdSchedule,
      calendar_month: MdCalendarMonth,
    };

    return iconMap[icon] ?? MdDirectionsBoat;
  }

  function getStatusClass(status) {
    const map = {
      'no-prazo': styles.noPrazo,
      atencao: styles.atencao,
      atrasada: styles.atrasada,
      'nao-iniciada': styles.naoIniciada,
    };

    return map[status] ?? '';
  }

  function getMetricVariantClass(variant) {
    const map = {
      blue: styles.blue,
      success: styles.success,
      warning: styles.warning,
      danger: styles.danger,
    };

    return map[variant] ?? '';
  }

  if (loading) {
    return (
      <div className={styles.planningPage}>
        <PageLoading
          message="Carregando dashboard de produção..."
          minHeight="calc(100vh - 48px)"
        />
      </div>
    );
  }

  return (
    <div className={styles.planningPage}>
      <header className={styles.planningHeader}>
        <div className={styles.planningTitle}>
          <span className={styles.eyebrow}>Planejamento geral</span>

          <h1>Dashboard de Produção</h1>

          <p>Visão geral de todas as embarcações e fases de fabricação</p>
        </div>

        <div className={styles.planningHeaderActions}>
          <div className={styles.lastUpdate}>
            <span>Última atualização</span>

            <strong>{lastUpdate}</strong>
          </div>

          <button
            className={styles.filterHeaderBtn}
            type="button"
            onClick={clearFilters}
          >
            <MdFilterAltOff />
            Limpar filtros
          </button>

          <button
            className={styles.refreshBtn}
            type="button"
            onClick={loadPlanning}
          >
            <MdRefresh />
            Atualizar
          </button>
        </div>
      </header>

      <section className={styles.planningMetrics}>
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
              <div className={styles.metricContent}>
                <span className={styles.metricLabel}>{metric.label}</span>

                <strong className={styles.metricValue}>{metric.value}</strong>

                <small className={styles.metricDescription}>
                  {metric.description}
                </small>
              </div>

              <div className={styles.metricIcon}>
                <MetricIcon />
              </div>
            </article>
          );
        })}
      </section>

      <section className={styles.planningFilters}>
        <div className={[styles.filterField, styles.searchField].join(' ')}>
          <MdSearch />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por código ou nome da embarcação..."
          />
        </div>

        <div className={[styles.filterField, styles.selectField].join(' ')}>
          <MdFilterAlt />

          <select
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <MdExpandMore className={styles.selectArrow} />
        </div>

        <div className={styles.filterResult}>
          <MdDirectionsBoat />

          <span>
            {filteredBoats.length}{' '}
            {filteredBoats.length === 1
              ? 'embarcação encontrada'
              : 'embarcações encontradas'}
          </span>
        </div>
      </section>

      <section className={styles.planningTableCard}>
        <div className={styles.planningTableHeader}>
          <div>
            <span>Planejamento de produção</span>

            <h2>Embarcações e fases de fabricação</h2>
          </div>

          <div className={styles.tableLegend}>
            <span className={[styles.legendItem, styles.noPrazo].join(' ')}>
              <i />
              Dentro do prazo
            </span>

            <span className={[styles.legendItem, styles.atencao].join(' ')}>
              <i />
              Atenção
            </span>

            <span className={[styles.legendItem, styles.atrasada].join(' ')}>
              <i />
              Atrasada
            </span>

            <span className={[styles.legendItem, styles.naoIniciada].join(' ')}>
              <i />
              Não iniciada
            </span>
          </div>
        </div>

        {filteredBoats.length > 0 ? (
          <div className={styles.planningTableWrap}>
            <table className={styles.planningTable}>
              <thead>
                <tr className={styles.mainHeaderRow}>
                  <th
                    className={[styles.stickyColumn, styles.boatColumn].join(
                      ' ',
                    )}
                    rowSpan={3}
                  >
                    <span>Embarcação</span>

                    <small>Código / Nome</small>
                  </th>

                  <th
                    className={[styles.stickyColumn, styles.statusColumn].join(
                      ' ',
                    )}
                    rowSpan={3}
                  >
                    Status
                  </th>

                  <th
                    className={[
                      styles.stickyColumn,
                      styles.deliveryColumn,
                    ].join(' ')}
                    rowSpan={3}
                  >
                    Entrega planejada
                  </th>

                  <th
                    className={styles.phasesTitle}
                    colSpan={phaseColumns.length * 6}
                  >
                    Fases de fabricação
                  </th>
                </tr>

                <tr className={styles.phaseHeaderRow}>
                  {phaseColumns.map((phaseColumn) => (
                    <th
                      key={phaseColumn.key}
                      className={styles.phaseGroup}
                      colSpan={6}
                    >
                      {phaseColumn.label}
                    </th>
                  ))}
                </tr>

                <tr className={styles.datesHeaderRow}>
                  {phaseColumns.map((phaseColumn) => (
                    <Fragment key={phaseColumn.key}>
                      <th>
                        <span>Início</span>
                        <small>Planejado</small>
                      </th>

                      <th>
                        <span>Fim</span>
                        <small>Planejado</small>
                      </th>

                      <th>
                        <span>Início</span>
                        <small>Executado</small>
                      </th>

                      <th>
                        <span>Fim</span>
                        <small>Executado</small>
                      </th>

                      <th>
                        <span>Início</span>
                        <small>Replanejado</small>
                      </th>

                      <th>
                        <span>Fim</span>
                        <small>Replanejado</small>
                      </th>
                    </Fragment>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredBoats.map((boat) => (
                  <tr
                    key={boat.id}
                    onClick={() => openBoat(boat.id)}
                    style={{
                      cursor: 'pointer',
                    }}
                  >
                    <td
                      className={[
                        styles.stickyColumn,
                        styles.boatColumn,
                        styles.boatCell,
                      ].join(' ')}
                    >
                      <button
                        className={styles.boatLink}
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();

                          openBoat(boat.id);
                        }}
                      >
                        <strong>{boat.code}</strong>

                        <span>{boat.name}</span>
                      </button>
                    </td>

                    <td
                      className={[
                        styles.stickyColumn,
                        styles.statusColumn,
                      ].join(' ')}
                    >
                      {(() => {
                        const StatusIcon = getStatusIcon(boat.status);

                        return (
                          <span
                            className={[
                              styles.boatStatus,
                              getStatusClass(boat.status),
                            ]
                              .filter(Boolean)
                              .join(' ')}
                          >
                            <StatusIcon />

                            {getStatusLabel(boat.status)}
                          </span>
                        );
                      })()}
                    </td>

                    <td
                      className={[
                        styles.stickyColumn,
                        styles.deliveryColumn,
                      ].join(' ')}
                    >
                      <strong className={styles.deliveryDate}>
                        {boat.plannedDelivery}
                      </strong>
                    </td>

                    {phaseColumns.map((phaseColumn) => {
                      const phase = boat[phaseColumn.key];

                      if (!phase) {
                        return (
                          <Fragment key={phaseColumn.key}>
                            {Array.from({
                              length: 6,
                            }).map((_, index) => (
                              <td key={index} className={styles.phaseDateCell}>
                                <span
                                  className={[
                                    styles.dateValue,
                                    styles.emptyDate,
                                  ].join(' ')}
                                >
                                  -
                                </span>
                              </td>
                            ))}
                          </Fragment>
                        );
                      }

                      const StatusIcon = getStatusIcon(phase.status);

                      return (
                        <Fragment key={phaseColumn.key}>
                          <td className={styles.phaseDateCell}>
                            <span
                              className={[
                                styles.dateValue,
                                !hasDate(phase.plannedStart)
                                  ? styles.emptyDate
                                  : '',
                              ]
                                .filter(Boolean)
                                .join(' ')}
                            >
                              {phase.plannedStart}
                            </span>
                          </td>

                          <td className={styles.phaseDateCell}>
                            <span
                              className={[
                                styles.dateValue,
                                !hasDate(phase.plannedEnd)
                                  ? styles.emptyDate
                                  : '',
                              ]
                                .filter(Boolean)
                                .join(' ')}
                            >
                              {phase.plannedEnd}
                            </span>
                          </td>

                          <td className={styles.phaseDateCell}>
                            <span
                              className={[
                                styles.dateStatusValue,
                                getStatusClass(phase.status),
                                !hasDate(phase.executedStart)
                                  ? styles.emptyDate
                                  : '',
                              ]
                                .filter(Boolean)
                                .join(' ')}
                            >
                              {phase.executedStart}

                              {hasDate(phase.executedStart) && <StatusIcon />}
                            </span>
                          </td>

                          <td className={styles.phaseDateCell}>
                            <span
                              className={[
                                styles.dateStatusValue,
                                getStatusClass(phase.status),
                                !hasDate(phase.executedEnd)
                                  ? styles.emptyDate
                                  : '',
                              ]
                                .filter(Boolean)
                                .join(' ')}
                            >
                              {phase.executedEnd}

                              {hasDate(phase.executedEnd) && <StatusIcon />}
                            </span>
                          </td>

                          <td className={styles.phaseDateCell}>
                            <span
                              className={[
                                styles.dateValue,
                                styles.replannedDate,
                                !hasDate(phase.replannedStart)
                                  ? styles.emptyDate
                                  : '',
                              ]
                                .filter(Boolean)
                                .join(' ')}
                            >
                              {phase.replannedStart}
                            </span>
                          </td>

                          <td
                            className={[
                              styles.phaseDateCell,
                              styles.phaseEndCell,
                            ].join(' ')}
                          >
                            <span
                              className={[
                                styles.dateValue,
                                styles.replannedDate,
                                !hasDate(phase.replannedEnd)
                                  ? styles.emptyDate
                                  : '',
                              ]
                                .filter(Boolean)
                                .join(' ')}
                            >
                              {phase.replannedEnd}
                            </span>
                          </td>
                        </Fragment>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.planningEmpty}>
            <div className={styles.emptyIcon}>
              <MdSearchOff />
            </div>

            <h3>Nenhuma embarcação encontrada</h3>

            <p>Tente alterar o texto da busca ou selecionar outro status.</p>

            <button type="button" onClick={clearFilters}>
              <MdFilterAltOff />
              Limpar filtros
            </button>
          </div>
        )}
      </section>

      <div className={styles.planningFooterNote}>
        <MdInfo />

        <span>
          As datas executadas impactam automaticamente o planejamento das
          próximas fases.
        </span>
      </div>
    </div>
  );
}
