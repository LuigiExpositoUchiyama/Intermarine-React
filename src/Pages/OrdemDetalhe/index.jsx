import { useCallback, useEffect, useMemo, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import {
  MdAdd,
  MdArrowBack,
  MdBuildCircle,
  MdCheckCircle,
  MdClose,
  MdError,
  MdEventBusy,
  MdExpandMore,
  MdFilterAlt,
  MdHistory,
  MdInfo,
  MdPauseCircle,
  MdPlayCircle,
  MdSchedule,
  MdSearchOff,
  MdStopCircle,
  MdTrendingUp,
  MdWarning,
} from 'react-icons/md';

import PageLoading from '../../Components/PageLoading';

import ordemDetalheService from '../../Services/ordemDetalheService.jsx';

import styles from './OrdemDetalhe.module.css';

const timelineIconMap = {
  check_circle: MdCheckCircle,
  play_circle: MdPlayCircle,
  pause_circle: MdPauseCircle,
  stop_circle: MdStopCircle,
  schedule: MdSchedule,
  warning: MdWarning,
  error: MdError,
  info: MdInfo,
};

const productionStatusLabels = {
  'em-producao': 'Em produção',
  concluida: 'Concluída',
  atrasada: 'Atrasada',
};

const orderTypeLabels = {
  OF: 'Ordem de Fabricação',
  ORP: 'Ordem de Reprocesso',
  OR: 'Ordem de Retrabalho',
};

const reworkStatusLabels = {
  concluida: 'Concluída',
  'em-andamento': 'Em andamento',
  pendente: 'Pendente',
};

function formatDateToKey(date) {
  const day = String(date.getDate()).padStart(2, '0');

  const month = String(date.getMonth() + 1).padStart(2, '0');

  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

function getTimelineIcon(icon) {
  return timelineIconMap[icon] ?? MdInfo;
}

function getTimelineVariantClass(variant) {
  const map = {
    success: styles.success,
    warning: styles.warning,
    danger: styles.danger,
    info: styles.info,
  };

  return map[variant] ?? '';
}

function getProductionStatusClass(status) {
  const map = {
    'em-producao': styles.emProducao,
    concluida: styles.concluida,
    atrasada: styles.atrasada,
  };

  return map[status] ?? '';
}

function getStopStatusClass(status) {
  const map = {
    resolvida: styles.resolvida,
    aberta: styles.aberta,
  };

  return map[status] ?? '';
}

function getReworkStatusClass(status) {
  const map = {
    concluida: styles.concluida,
    'em-andamento': styles.emAndamento,
    pendente: styles.pendente,
  };

  return map[status] ?? '';
}

export default function OrdemDetalhe() {
  const navigate = useNavigate();

  const { tipo, id } = useParams();

  const [loading, setLoading] = useState(true);

  const [order, setOrder] = useState(null);

  const [timelineModalOpen, setTimelineModalOpen] = useState(false);

  const timelinePreviewLimit = 5;

  const type = String(tipo ?? '').toLowerCase();

  const orderId = Number(id);

  const loadOrder = useCallback(async () => {
    if (!type || !Number.isFinite(orderId) || orderId <= 0) {
      setOrder(null);
      setLoading(false);

      return;
    }

    setLoading(true);

    try {
      const data = await ordemDetalheService.getOrderById(type, orderId);

      setOrder(data ?? null);
    } catch (error) {
      console.error('Erro ao carregar a ordem:', error);

      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [type, orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape' && timelineModalOpen) {
        setTimelineModalOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [timelineModalOpen]);

  useEffect(() => {
    document.body.style.overflow = timelineModalOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [timelineModalOpen]);

  const currentDayTimeline = useMemo(() => {
    if (!order) {
      return [];
    }

    const today = formatDateToKey(new Date());

    const todayEvents = order.timeline.filter((item) => item.date === today);

    if (todayEvents.length > 0) {
      return todayEvents;
    }

    return order.timeline.slice(-timelinePreviewLimit);
  }, [order]);

  function openTimelineModal() {
    if (!order?.timeline?.length) {
      return;
    }

    setTimelineModalOpen(true);
  }

  function closeTimelineModal() {
    setTimelineModalOpen(false);
  }

  function goBack() {
    if (timelineModalOpen) {
      closeTimelineModal();
    }

    if (window.history.length > 1) {
      navigate(-1);

      return;
    }

    navigate('/');
  }

  function getOrderTypeLabel() {
    if (!order) {
      return 'Ordem';
    }

    return orderTypeLabels[order.type] ?? 'Ordem';
  }

  function getDeadlineStatusLabel() {
    return order?.deadlineStatus === 'atrasado' ? 'Atrasado' : 'No prazo';
  }

  function isEfficiencyAboveGoal() {
    if (!order) {
      return false;
    }

    return order.operatorEfficiency >= order.efficiencyGoal;
  }

  function getTotalWorkedTime() {
    return order?.totalProductionTime ?? '-';
  }

  if (loading) {
    return (
      <div className={styles.orderDetailPage}>
        <PageLoading
          message="Carregando detalhes da ordem..."
          minHeight="calc(100vh - 48px)"
        />
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.orderDetailPage}>
        <section className={styles.notFoundCard}>
          <MdSearchOff />

          <h1>Ordem não encontrada</h1>

          <p>
            Não foi possível localizar uma ordem com o tipo e identificador
            informados.
          </p>

          <button type="button" onClick={goBack}>
            <MdArrowBack />
            Voltar
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.orderDetailPage}>
      {/* HEADER */}

      <header className={styles.pageHeader}>
        <div>
          <span className={styles.breadcrumb}>
            Ordens de produção / {getOrderTypeLabel()}
          </span>

          <div className={styles.titleRow}>
            <button
              type="button"
              className={styles.backButton}
              aria-label="Voltar"
              onClick={goBack}
            >
              <MdArrowBack />
            </button>

            <div>
              <h1>Detalhes da {getOrderTypeLabel()}</h1>

              <p>Acompanhamento completo da execução da ordem</p>
            </div>
          </div>
        </div>

        <button type="button" className={styles.moreActionsButton}>
          Mais ações
          <MdExpandMore />
        </button>
      </header>

      {/* RESUMO */}

      <section className={styles.mainSummaryCard}>
        <div className={styles.orderIdentification}>
          <div className={styles.identificationItem}>
            <span>Número da {order.type}</span>

            <strong>{order.code}</strong>
          </div>

          <div className={styles.identificationItem}>
            <span>Embarcação</span>

            <strong>{order.boatCode}</strong>

            <small>{order.boatName}</small>
          </div>

          <div className={styles.identificationItem}>
            <span>Setor</span>

            <strong>{order.sector}</strong>
          </div>

          <div className={styles.identificationItem}>
            <span>Responsável</span>

            <strong>{order.responsible}</strong>
          </div>
        </div>

        <div className={styles.summaryContent}>
          <div className={styles.summaryMetrics}>
            <div className={styles.summaryMetric}>
              <span>Status da {order.type}</span>

              <strong
                className={[
                  styles.statusBadge,
                  getProductionStatusClass(order.productionStatus),
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <i />

                {productionStatusLabels[order.productionStatus] ??
                  order.productionStatus}
              </strong>
            </div>

            <div className={styles.summaryMetric}>
              <span>Status do prazo</span>

              <strong
                className={[
                  styles.statusBadge,
                  styles.deadline,
                  order.deadlineStatus === 'atrasado' ? styles.delayed : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <i />

                {getDeadlineStatusLabel()}
              </strong>
            </div>

            <div className={styles.summaryMetric}>
              <span>Tempo planejado</span>

              <strong>{order.plannedTime}</strong>
            </div>

            <div className={styles.summaryMetric}>
              <span>Tempo atual</span>

              <strong>{order.currentTime}</strong>
            </div>

            <div
              className={[
                styles.summaryMetric,
                styles.delayMetric,
                order.deadlineStatus === 'atrasado' ? styles.hasDelay : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span>Atraso</span>

              <strong>{order.delayTime}</strong>

              <small>{order.delayPercentage}</small>
            </div>
          </div>

          {/* PROGRESSO */}

          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span>% concluído</span>

              <strong>{order.progress}% concluído</strong>
            </div>

            <div className={styles.progressBar}>
              <div
                style={{
                  width: `${order.progress}%`,
                }}
              />
            </div>
          </div>

          {/* EFICIÊNCIA */}

          <div className={styles.efficiencyCard}>
            <div>
              <span>Eficiência do operador</span>

              <strong>
                <MdTrendingUp />
                {order.operatorEfficiency}%
              </strong>
            </div>

            <div className={styles.efficiencyGoal}>
              <span>Meta: {order.efficiencyGoal}%</span>

              <strong
                className={!isEfficiencyAboveGoal() ? styles.belowGoal : ''}
              >
                {isEfficiencyAboveGoal() ? 'Acima da meta' : 'Abaixo da meta'}
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE + OPERADORES */}

      <section className={styles.dashboardGrid}>
        <article
          className={[styles.contentCard, styles.timelineCard].join(' ')}
        >
          <div className={styles.timelineCardHeader}>
            <div>
              <h2>Linha do tempo da {order.type}</h2>

              <span className={styles.timelineDayLabel}>
                Eventos do dia atual
              </span>
            </div>

            <span className={styles.timelineCount}>
              {currentDayTimeline.length}{' '}
              {currentDayTimeline.length === 1 ? 'evento' : 'eventos'}
            </span>
          </div>

          {currentDayTimeline.length > 0 ? (
            <div className={styles.timeline}>
              {currentDayTimeline.map((item) => {
                const TimelineIcon = getTimelineIcon(item.icon);

                return (
                  <div key={item.id} className={styles.timelineItem}>
                    <time>{item.time}</time>

                    <div
                      className={[
                        styles.timelineMarker,
                        getTimelineVariantClass(item.variant),
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <TimelineIcon />
                    </div>

                    <div className={styles.timelineContent}>
                      <strong>{item.title}</strong>

                      {item.description && <span>{item.description}</span>}
                    </div>

                    {item.duration && <small>{item.duration}</small>}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.timelineEmpty}>
              <MdEventBusy />

              <strong>Nenhum evento hoje</strong>

              <span>Não existem eventos registrados para hoje.</span>
            </div>
          )}

          {order.timeline.length > 0 && (
            <button
              type="button"
              className={styles.viewFullTimelineButton}
              onClick={openTimelineModal}
            >
              <MdHistory />

              <span className={styles.viewTimelineText}>
                Ver linha do tempo completa
              </span>

              <span className={styles.timelineTotalBadge}>
                {order.timeline.length}
              </span>
            </button>
          )}
        </article>

        {/* OPERADORES */}

        <article
          className={[styles.contentCard, styles.operatorsCard].join(' ')}
        >
          <h2>Operadores em tempo real</h2>

          <span className={styles.sectionSubtitle}>Ativos agora</span>

          <div className={styles.activeOperators}>
            {order.activeOperators.map((operator) => (
              <div key={operator.id} className={styles.activeOperator}>
                <div className={styles.operatorAvatar}>
                  {getInitials(operator.name)}
                </div>

                <div className={styles.operatorData}>
                  <strong>{operator.name}</strong>

                  <span>{operator.role}</span>

                  <small className={!operator.active ? styles.inactive : ''}>
                    {operator.active ? 'Ativo' : 'Inativo'}
                  </small>
                </div>

                <i
                  className={[
                    styles.onlineIndicator,
                    !operator.active ? styles.inactive : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                />

                <div className={styles.continuousTime}>
                  <span>Tempo contínuo</span>

                  <strong>{operator.continuousTime}</strong>
                </div>
              </div>
            ))}
          </div>

          <h3>Resumo por operador nesta {order.type}</h3>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Operador</th>

                  <th>RA</th>

                  <th>Horas trabalhadas</th>

                  <th>Pausas</th>

                  <th>Paralisações</th>
                </tr>
              </thead>

              <tbody>
                {order.operatorSummary.map((operator) => (
                  <tr key={operator.id}>
                    <td>{operator.name}</td>

                    <td>{operator.ra}</td>

                    <td>{operator.workedTime}</td>

                    <td>{operator.pauseTime}</td>

                    <td>{operator.stopTime}</td>
                  </tr>
                ))}

                <tr className={styles.totalRow}>
                  <td>Total</td>

                  <td>-</td>

                  <td>{getTotalWorkedTime()}</td>

                  <td>{order.totalPauseTime}</td>

                  <td>{order.totalStopTime}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </section>

      {/* PARALISAÇÕES */}

      <section className={[styles.contentCard, styles.historyCard].join(' ')}>
        <div className={styles.historyMain}>
          <h2>Histórico de paralisações</h2>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Início</th>
                  <th>Fim</th>
                  <th>RA</th>
                  <th>Nome</th>
                  <th>Motivo da paralisação</th>
                  <th>Duração</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {order.stops.map((stop) => (
                  <tr key={stop.id}>
                    <td>{stop.start}</td>

                    <td>{stop.end}</td>

                    <td>{stop.operatorRa}</td>

                    <td>{stop.operatorName}</td>

                    <td>{stop.reason}</td>

                    <td>{stop.duration}</td>

                    <td>
                      <span
                        className={[
                          styles.stopStatus,
                          getStopStatusClass(stop.status),
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {stop.status === 'resolvida' ? 'Resolvida' : 'Aberta'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className={styles.wasteIndicators}>
          <h3>Indicadores de desperdício</h3>

          <div>
            <span>Tempo total de produção</span>

            <strong>{order.totalProductionTime}</strong>
          </div>

          <div>
            <span>Tempo total de paralisações</span>

            <strong>{order.totalStopTime}</strong>
          </div>

          <div>
            <span>Tempo total de pausas</span>

            <strong>{order.totalPauseTime}</strong>
          </div>

          <div>
            <span>Tempo efetivamente produzido</span>

            <strong>{order.effectiveProductionTime}</strong>
          </div>
        </aside>
      </section>

      {/* RETRABALHO */}

      <section className={[styles.contentCard, styles.reworkCard].join(' ')}>
        <div className={styles.reworkHeader}>
          <h2>Retrabalho e rastreabilidade</h2>

          <button type="button">
            <MdFilterAlt />
            Filtros
          </button>
        </div>

        <div className={styles.reworkContent}>
          <aside className={styles.inspectionRule}>
            <strong>Regra de inspeção</strong>

            <p>
              O retrabalho só pode ser gerado após a finalização desta ordem.
            </p>

            <button
              type="button"
              disabled={order.productionStatus !== 'concluida'}
            >
              <MdAdd />
              Gerar Ordem de Retrabalho
            </button>
          </aside>

          <div className={styles.relatedReworks}>
            <h3>Histórico de ordens de retrabalho relacionadas</h3>

            {order.relatedReworks.length > 0 ? (
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>Nº OR</th>

                      <th>Data da operação</th>

                      <th>Motivo</th>

                      <th>Tempo de retrabalho</th>

                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {order.relatedReworks.map((rework) => (
                      <tr key={rework.id}>
                        <td>{rework.code}</td>

                        <td>{rework.operationDate}</td>

                        <td>{rework.reason}</td>

                        <td>{rework.duration}</td>

                        <td>
                          <span
                            className={[
                              styles.reworkStatus,
                              getReworkStatusClass(rework.status),
                            ]
                              .filter(Boolean)
                              .join(' ')}
                          >
                            {reworkStatusLabels[rework.status] ?? rework.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={[styles.emptyState, styles.small].join(' ')}>
                <MdBuildCircle />

                <strong>Nenhuma ordem relacionada</strong>

                <span>Não existem retrabalhos vinculados a esta ordem.</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <button
        type="button"
        className={styles.bottomBackButton}
        onClick={goBack}
      >
        <MdArrowBack />
        Voltar
      </button>

      {/* MODAL TIMELINE */}

      {timelineModalOpen && (
        <div
          className={styles.timelineModalBackdrop}
          onClick={closeTimelineModal}
        >
          <section
            className={styles.timelineModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="timelineModalTitle"
            onClick={(event) => event.stopPropagation()}
          >
            <header className={styles.timelineModalHeader}>
              <div>
                <span className={styles.timelineModalEyebrow}>
                  Histórico completo
                </span>

                <h2 id="timelineModalTitle">Linha do tempo da {order.type}</h2>

                <p>
                  {order.code} • {order.boatCode}
                </p>
              </div>

              <button
                type="button"
                className={styles.timelineModalClose}
                aria-label="Fechar"
                onClick={closeTimelineModal}
              >
                <MdClose />
              </button>
            </header>

            <div className={styles.timelineModalBody}>
              <div className={[styles.timeline, styles.timelineFull].join(' ')}>
                {order.timeline.map((item) => {
                  const TimelineIcon = getTimelineIcon(item.icon);

                  return (
                    <div key={item.id} className={styles.timelineItem}>
                      <div className={styles.timelineDateTime}>
                        <span>{item.date}</span>

                        <time>{item.time}</time>
                      </div>

                      <div
                        className={[
                          styles.timelineMarker,
                          getTimelineVariantClass(item.variant),
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        <TimelineIcon />
                      </div>

                      <div className={styles.timelineContent}>
                        <strong>{item.title}</strong>

                        {item.description && <span>{item.description}</span>}
                      </div>

                      {item.duration && <small>{item.duration}</small>}
                    </div>
                  );
                })}
              </div>
            </div>

            <footer className={styles.timelineModalFooter}>
              <span>{order.timeline.length} registros encontrados</span>

              <button type="button" onClick={closeTimelineModal}>
                Fechar
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}
