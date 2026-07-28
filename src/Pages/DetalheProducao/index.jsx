import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  MdApps,
  MdCalendarMonth,
  MdCheckCircle,
  MdClose,
  MdDirectionsBoat,
  MdEventRepeat,
  MdExpandMore,
  MdGroup,
  MdGroups,
  MdHourglassTop,
  MdHub,
  MdMoreVert,
  MdOpenInNew,
  MdPauseCircle,
  MdPersonAdd,
  MdPersonRemove,
  MdPersonSearch,
  MdPlayArrow,
  MdPlayCircle,
  MdPlayCircleOutline,
  MdRadioButtonUnchecked,
  MdSearch,
  MdStopCircle,
} from 'react-icons/md';

import PageLoading from '../../Components/PageLoading';

import gestaoProducaoService from '../../Services/gestaoProducaoService';
import detalheProducaoService from '../../Services/detalheProducaoService';

import styles from './DetalheProducao.module.css';

const boatPhaseTemplates = [
  { number: 1, name: 'Laminação', color: 'navy' },
  { number: 2, name: 'Pré-Montagem', color: 'orange' },
  { number: 3, name: 'Pintura', color: 'blue' },
  { number: 4, name: 'Montagem Final E1', color: 'green' },
  { number: 5, name: 'Montagem Final E2', color: 'cyan' },
  { number: 6, name: 'Montagem Final E3', color: 'blue' },
  { number: 7, name: 'Piscina', color: 'cyan' },
  { number: 8, name: 'Qualidade', color: 'blue' },
];

const miniFactoryPhaseTemplates = [
  { number: 1, name: 'Elétrica', color: 'navy' },
  { number: 2, name: 'Tapeçaria', color: 'orange' },
  { number: 3, name: 'Marcenaria', color: 'blue' },
  { number: 4, name: 'Serralheria', color: 'green' },
  { number: 5, name: 'Laminação', color: 'cyan' },
  { number: 6, name: 'Pré Montagem', color: 'blue' },
  { number: 7, name: 'MF Elétrica', color: 'green' },
  { number: 8, name: 'Montagem Final', color: 'navy' },
];

const statusLabels = {
  'em-andamento': 'Em andamento',
  concluida: 'Concluída',
  'nao-iniciada': 'Não iniciada',
  atrasada: 'Atrasada',
};

const summaryIconMap = {
  hub: MdHub,
  play_circle: MdPlayCircle,
  radio_button_unchecked: MdRadioButtonUnchecked,
  calendar_month: MdCalendarMonth,
  event_repeat: MdEventRepeat,
  groups: MdGroups,
  group: MdGroup,
  person_search: MdPersonSearch,
  pause_circle: MdPauseCircle,
};

function parsePeople(value = '') {
  const [activeValue, totalValue] = String(value).split('/');

  const active = Number(activeValue?.trim() ?? 0);
  const total = Number(totalValue?.trim() ?? 0);

  return {
    active: Number.isNaN(active) ? 0 : active,
    total: Number.isNaN(total) ? 0 : total,
  };
}

function getDelayDays(delayValue = '') {
  const parsedValue = Number(String(delayValue).replace(/[^\d-]/g, ''));

  return Number.isNaN(parsedValue) ? 0 : parsedValue;
}

function convertBrazilianDateToTime(dateValue = '') {
  const [day, month, year] = String(dateValue).split('/').map(Number);

  if (!day || !month || !year) {
    return 0;
  }

  return new Date(year, month - 1, day).getTime();
}

function createEmptyPhase(template) {
  return {
    id: template.number,
    number: template.number,
    name: template.name,
    cc: '-',
    status: 'nao-iniciada',
    progress: 0,
    color: template.color,
    plannedStart: '-',
    plannedEnd: '-',
    replannedStart: '-',
    replannedEnd: '-',
    expectedEnd: '-',
    executedStart: '-',
    delay: '0 dias',
    people: '0 / 0',
    ofs: [],
    orps: [],
    ors: [],
  };
}

function completeMissingPhases(phases, templates) {
  return templates.map((template) => {
    const existingPhase = phases.find(
      (phase) => phase.number === template.number,
    );

    if (!existingPhase) {
      return createEmptyPhase(template);
    }

    return {
      ...existingPhase,
      number: template.number,
      name: template.name,
      color: template.color,
    };
  });
}

function getTotalOrders(phase) {
  return phase.ofs.length + phase.orps.length + phase.ors.length;
}

function phaseHasInformation(phase) {
  return (
    phase.cc !== '-' ||
    phase.plannedStart !== '-' ||
    phase.plannedEnd !== '-' ||
    phase.replannedStart !== '-' ||
    phase.replannedEnd !== '-' ||
    phase.expectedEnd !== '-' ||
    phase.executedStart !== '-' ||
    getTotalOrders(phase) > 0
  );
}

function getOrderSummary(orders) {
  return {
    total: orders.length,
    andamento: orders.filter((order) => order.status === 'em-andamento').length,
    concluidas: orders.filter((order) => order.status === 'concluida').length,
    iniciar: orders.filter((order) => order.status === 'nao-iniciada').length,
  };
}

function canOpenOrder(order) {
  return (
    order.status === 'concluida' ||
    order.status === 'em-andamento' ||
    order.status === 'atrasada'
  );
}

function getOrderRoute(order) {
  return `/ordem-detalhe/${order.type.toLowerCase()}/${order.id}`;
}

function findOrderById(phases, id) {
  for (const phase of phases) {
    const order = [...phase.ofs, ...phase.orps, ...phase.ors].find(
      (item) => item.id === id,
    );

    if (order) {
      return order;
    }
  }

  return undefined;
}

function buildSummaryCards(phases, boat) {
  const totalPhases = phases.length;

  const activePhases = phases.filter(
    (phase) => phase.status === 'em-andamento',
  ).length;

  const notStartedPhases = phases.filter(
    (phase) => phase.status === 'nao-iniciada',
  ).length;

  const delayedPhases = phases.filter(
    (phase) => phase.status === 'atrasada' || getDelayDays(phase.delay) > 0,
  ).length;

  const totalPeople = phases.reduce((sum, phase) => {
    return sum + parsePeople(phase.people).total;
  }, 0);

  const activePeople = phases.reduce((sum, phase) => {
    return sum + parsePeople(phase.people).active;
  }, 0);

  const waitingOperators = phases.reduce((total, phase) => {
    const waiting = phase.ofs.reduce((sum, of) => {
      if (of.status !== 'nao-iniciada') {
        return sum;
      }

      return sum + parsePeople(of.people).total;
    }, 0);

    return total + waiting;
  }, 0);

  const averageProgress =
    totalPhases > 0
      ? Math.round(
          phases.reduce((sum, phase) => sum + phase.progress, 0) / totalPhases,
        )
      : 0;

  const risk =
    delayedPhases > 0 ? 'ALTO' : activePhases > 2 ? 'MÉDIO' : 'BAIXO';

  const replannedDates = phases
    .filter(
      (phase) =>
        getDelayDays(phase.delay) > 0 &&
        phase.replannedEnd &&
        phase.replannedEnd !== '-',
    )
    .map((phase) => phase.replannedEnd)
    .sort(
      (dateA, dateB) =>
        convertBrazilianDateToTime(dateB) - convertBrazilianDateToTime(dateA),
    );

  const replannedDelivery = replannedDates[0] ?? '-';

  const hasReplannedDelivery = replannedDelivery !== '-';

  return [
    {
      id: 1,
      title: 'Progresso geral',
      value: `${averageProgress}%`,
      description: 'Média de avanço das fases',
      icon: 'hub',
      variant: 'blue',
    },
    {
      id: 2,
      title: 'Fases ativas',
      value: String(activePhases),
      description: 'Fases em execução',
      icon: 'play_circle',
      variant: 'success',
    },
    {
      id: 3,
      title: 'Não iniciadas',
      value: String(notStartedPhases),
      description: 'Fases ainda não iniciadas',
      icon: 'radio_button_unchecked',
      variant: 'warning',
    },
    {
      id: 4,
      title: 'Entrega planejada',
      value: boat?.endDate ?? '-',
      description: 'Data de conclusão prevista',
      icon: 'calendar_month',
      variant: 'blue',
    },
    {
      id: 5,
      title: 'Entrega replanejada',
      value: replannedDelivery,
      description: hasReplannedDelivery
        ? 'Última data replanejada'
        : 'Nenhum replanejamento',
      icon: 'event_repeat',
      variant: hasReplannedDelivery ? 'warning' : 'blue',
    },
    {
      id: 6,
      title: 'Risco de atraso',
      value: risk,
      description: 'Requer atenção da gestão',
      icon: 'groups',
      variant:
        risk === 'ALTO' ? 'danger' : risk === 'MÉDIO' ? 'warning' : 'blue',
    },
    {
      id: 7,
      title: 'Pessoas ativas',
      value: `${activePeople} / ${totalPeople}`,
      description: 'Pessoas em atividade',
      icon: 'group',
      variant: 'blue',
    },
    {
      id: 8,
      title: 'Aguardando início',
      value: String(waitingOperators),
      description: 'Operadores vinculados às OFs sem apontamento',
      icon: 'person_search',
      variant: 'warning',
    },
    {
      id: 9,
      title: 'Paralisação',
      value: String(delayedPhases),
      description: 'Fases com atraso',
      icon: 'pause_circle',
      variant: delayedPhases > 0 ? 'danger' : 'blue',
    },
  ];
}

function getVariantClass(variant) {
  const map = {
    success: styles.success,
    danger: styles.danger,
    warning: styles.warning,
    blue: styles.blue,
  };

  return map[variant] ?? '';
}

function getPhaseColorClass(color) {
  const map = {
    navy: styles.navy,
    orange: styles.orange,
    blue: styles.blue,
    green: styles.green,
    cyan: styles.cyan,
  };

  return map[color] ?? '';
}

function getStatusClass(status) {
  const map = {
    'em-andamento': styles.emAndamento,
    concluida: styles.concluida,
    'nao-iniciada': styles.naoIniciada,
    atrasada: styles.atrasada,
  };

  return map[status] ?? '';
}

function OrderSection({ title, emptyMessage, orders, onOpenActions }) {
  if (!orders.length) {
    return (
      <div className={[styles.orderSection, styles.empty].join(' ')}>
        <h3>{title}</h3>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.orderSection}>
      <h3>{title}</h3>

      <div className={styles.tableWrap}>
        <table>
          <colgroup>
            <col className={styles.colCode} />
            <col className={styles.colProcess} />
            <col className={styles.colPlanning} />
            <col className={styles.colExecution} />
            <col className={styles.colTime} />
            <col className={styles.colOperator} />
            <col className={styles.colPeople} />
            <col className={styles.colStatus} />
            <col className={styles.colActions} />
          </colgroup>

          <thead>
            <tr>
              <th>{orders[0]?.type ?? 'Ordem'}</th>
              <th>Processo</th>
              <th>Planejamento</th>
              <th>Execução</th>
              <th>Tempo</th>
              <th>Operador</th>
              <th>Pessoas</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  {canOpenOrder(order) ? (
                    <Link
                      className={styles.orderCodeLink}
                      to={getOrderRoute(order)}
                      aria-label={`Abrir detalhes da ordem ${order.code}`}
                      title="Ver detalhes"
                    >
                      <span>{order.code}</span>
                      <MdOpenInNew />
                    </Link>
                  ) : (
                    <span className={styles.orderCodeStatic}>{order.code}</span>
                  )}
                </td>

                <td className={styles.processCell}>{order.process}</td>

                <td>
                  <div className={styles.compactInfo}>
                    <div className={styles.compactRow}>
                      <span className={styles.label}>Início:</span>
                      <span className={styles.value}>{order.plannedStart}</span>
                    </div>

                    <div className={styles.compactRow}>
                      <span className={styles.label}>Replan.:</span>
                      <span className={styles.value}>
                        {order.replannedStart}
                      </span>
                    </div>

                    <div className={styles.compactRow}>
                      <span className={styles.label}>Fim:</span>
                      <span className={styles.value}>{order.plannedEnd}</span>
                    </div>
                  </div>
                </td>

                <td>
                  <div className={styles.compactInfo}>
                    <div className={styles.compactRow}>
                      <span className={styles.label}>Início:</span>
                      <span className={styles.value}>
                        {order.executedStart}
                      </span>
                    </div>

                    <div className={styles.compactRow}>
                      <span className={styles.label}>Fim:</span>
                      <span className={styles.value}>{order.executedEnd}</span>
                    </div>
                  </div>
                </td>

                <td>
                  <div className={styles.compactInfo}>
                    <div className={styles.compactRow}>
                      <span className={styles.label}>Planejado:</span>
                      <span className={styles.value}>{order.plannedTime}</span>
                    </div>

                    <div className={styles.compactRow}>
                      <span className={styles.label}>Executado:</span>
                      <span className={styles.value}>{order.executedTime}</span>
                    </div>
                  </div>
                </td>

                <td>
                  <span
                    className={styles.operatorName}
                    title={`RA: ${order.ra}`}
                  >
                    {order.operator}
                  </span>
                </td>

                <td>{order.people}</td>

                <td>
                  <span
                    className={[styles.statusPill, getStatusClass(order.status)]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {statusLabels[order.status] ?? order.status}
                  </span>
                </td>

                <td className={styles.actionsCell}>
                  <button
                    className={[styles.actionBtn, styles.actionIconBtn].join(
                      ' ',
                    )}
                    type="button"
                    aria-label={`Abrir ações da ordem ${order.id}`}
                    title="Ações"
                    onClick={(event) => onOpenActions(order, event)}
                  >
                    <MdMoreVert />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DetalheProducao() {
  const navigate = useNavigate();
  const { tipo, id } = useParams();

  const [loading, setLoading] = useState(true);
  const [boat, setBoat] = useState(null);
  const [phases, setPhases] = useState([]);
  const [openedPhaseIds, setOpenedPhaseIds] = useState(() => new Set());

  const [replannedHistory, setReplannedHistory] = useState([]);
  const [showReplannedModal, setShowReplannedModal] = useState(false);
  const [historySearch, setHistorySearch] = useState('');

  const [activeActionOrder, setActiveActionOrder] = useState(null);
  const [actionMenuPosition, setActionMenuPosition] = useState({
    top: 0,
    left: 0,
  });

  const actionButtonRef = useRef(null);

  const viewType = tipo === 'mini-fabrica' ? 'mini-fabrica' : 'embarcacao';

  const boatId = useMemo(() => {
    const routeId = Number(id);

    return Number.isFinite(routeId) && routeId > 0 ? routeId : 1;
  }, [id]);

  const phaseTemplates =
    viewType === 'mini-fabrica'
      ? miniFactoryPhaseTemplates
      : boatPhaseTemplates;

  const loadBoatDetails = useCallback(async () => {
    setLoading(true);

    try {
      const [boatData, phaseData] = await Promise.all([
        viewType === 'mini-fabrica'
          ? gestaoProducaoService.getMiniFactoryById(boatId)
          : gestaoProducaoService.getBoatById(boatId),

        detalheProducaoService.getDetailByBoatId(
          boatId,
          viewType === 'mini-fabrica' ? 'mini-fabricas' : 'embarcacao',
        ),
      ]);

      const completedPhases = completeMissingPhases(
        phaseData ?? [],
        phaseTemplates,
      );

      setBoat(boatData ?? null);
      setPhases(completedPhases);

      const firstPhaseWithInformation =
        completedPhases.find(phaseHasInformation);

      const firstPhase = firstPhaseWithInformation ?? completedPhases[0];

      setOpenedPhaseIds(firstPhase ? new Set([firstPhase.id]) : new Set());
    } catch (error) {
      console.error('Erro ao carregar os detalhes da produção:', error);

      const emptyPhases = completeMissingPhases([], phaseTemplates);

      setBoat(null);
      setPhases(emptyPhases);

      setOpenedPhaseIds(
        emptyPhases.length ? new Set([emptyPhases[0].id]) : new Set(),
      );
    } finally {
      setLoading(false);
    }
  }, [boatId, phaseTemplates, viewType]);

  useEffect(() => {
    loadBoatDetails();
  }, [loadBoatDetails]);

  useEffect(() => {
    function updateActionMenuPosition() {
      if (!activeActionOrder || !actionButtonRef.current) {
        return;
      }

      const rect = actionButtonRef.current.getBoundingClientRect();
      const menuWidth = 220;
      const viewportPadding = 12;

      const left = Math.min(
        Math.max(rect.right - menuWidth, viewportPadding),
        window.innerWidth - menuWidth - viewportPadding,
      );

      setActionMenuPosition({
        top: rect.bottom + 6,
        left,
      });
    }

    function handleDocumentClick(event) {
      if (actionButtonRef.current?.contains(event.target)) {
        return;
      }

      setActiveActionOrder(null);
    }

    updateActionMenuPosition();

    document.addEventListener('click', handleDocumentClick);
    window.addEventListener('scroll', updateActionMenuPosition, true);
    window.addEventListener('resize', updateActionMenuPosition);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      window.removeEventListener('scroll', updateActionMenuPosition, true);
      window.removeEventListener('resize', updateActionMenuPosition);
    };
  }, [activeActionOrder]);

  const summaryCards = useMemo(
    () => buildSummaryCards(phases, boat),
    [phases, boat],
  );

  const filteredReplannedHistory = useMemo(() => {
    const value = historySearch.trim().toLowerCase();

    if (!value) {
      return replannedHistory;
    }

    return replannedHistory.filter(
      (item) =>
        item.ofResponsible.toLowerCase().includes(value) ||
        item.reason.toLowerCase().includes(value) ||
        item.replannedDate.includes(value),
    );
  }, [historySearch, replannedHistory]);

  function togglePhase(phaseId) {
    setOpenedPhaseIds((current) => {
      const next = new Set(current);

      if (next.has(phaseId)) {
        next.delete(phaseId);
      } else {
        next.add(phaseId);
      }

      return next;
    });
  }

  async function openReplannedHistory() {
    if (!boat?.id) {
      return;
    }

    try {
      const history = await detalheProducaoService.getReplannedHistory(boat.id);

      setReplannedHistory(history ?? []);
    } catch (error) {
      console.error('Erro ao carregar histórico de replanejamentos:', error);

      setReplannedHistory([]);
    } finally {
      setShowReplannedModal(true);
    }
  }

  function closeReplannedHistory() {
    setShowReplannedModal(false);
    setHistorySearch('');
  }

  function openWaitingOperators() {
    navigate('/operadores-aguardando-inicio');
  }

  function openActionMenu(order, event) {
    event.stopPropagation();

    const button = event.currentTarget;
    actionButtonRef.current = button;

    const currentOrder = findOrderById(phases, order.id);

    if (activeActionOrder?.id === order.id) {
      setActiveActionOrder(null);
      return;
    }

    const rect = button.getBoundingClientRect();
    const menuWidth = 220;
    const viewportPadding = 12;

    const left = Math.min(
      Math.max(rect.right - menuWidth, viewportPadding),
      window.innerWidth - menuWidth - viewportPadding,
    );

    setActionMenuPosition({
      top: rect.bottom + 6,
      left,
    });

    setActiveActionOrder(currentOrder ?? order);
  }

  function executeOrderAction(actionName) {
    if (!activeActionOrder) {
      return;
    }

    console.log(actionName, activeActionOrder);

    setActiveActionOrder(null);
  }

  function openOperatorStop() {
    if (!activeActionOrder) {
      return;
    }

    navigate(
      `/paralisacao-operador/${activeActionOrder.type.toLowerCase()}/${activeActionOrder.id}`,
    );

    setActiveActionOrder(null);
  }

  function handleSummaryClick(card) {
    if (card.title === 'Entrega replanejada') {
      openReplannedHistory();
      return;
    }

    if (card.title === 'Aguardando início') {
      openWaitingOperators();
    }
  }

  if (loading) {
    return (
      <div className={styles.boatDetailPage}>
        <PageLoading
          message="Carregando detalhes da produção..."
          minHeight="calc(100vh - 48px)"
        />
      </div>
    );
  }

  return (
    <div className={styles.boatDetailPage}>
      <header className={styles.detailHeader}>
        <div>
          <span className={styles.breadcrumb}>Painel principal / Produção</span>

          <h1>
            {viewType === 'mini-fabrica'
              ? 'Fases da mini fábrica '
              : 'Fases da embarcação '}
            {boat?.name ?? 'Embarcação não encontrada'}
          </h1>

          {boat && (
            <p>
              {boat.code}
              {' • '}
              Início {boat.startDate}
              {' • '}
              Fim {boat.endDate}
            </p>
          )}
        </div>

        <div className={styles.detailActions}>
          <div className={styles.detailSearch}>
            <MdSearch />

            <input type="text" placeholder="Buscar OF, ORP ou OR..." />
          </div>

          <button
            type="button"
            className={viewType === 'embarcacao' ? styles.activeBtn : ''}
            onClick={() => navigate(`/detalhe-producao/embarcacao/${boatId}`)}
          >
            <MdDirectionsBoat />
            Fases da Embarcação
          </button>

          <button
            type="button"
            className={viewType === 'mini-fabrica' ? styles.activeBtn : ''}
            onClick={() => navigate(`/detalhe-producao/mini-fabrica/${boatId}`)}
          >
            <MdApps />
            Mini fábricas
          </button>
        </div>
      </header>

      <section className={styles.summaryGrid}>
        {summaryCards.map((card) => {
          const SummaryIcon = summaryIconMap[card.icon] ?? MdHub;

          const clickable =
            card.title === 'Entrega replanejada' ||
            card.title === 'Aguardando início';

          return (
            <article
              key={card.id}
              className={[
                styles.summaryCard,
                getVariantClass(card.variant),
                clickable ? styles.clickable : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => clickable && handleSummaryClick(card)}
            >
              <div>
                <span>{card.title}</span>

                <strong>{card.value}</strong>

                <small>{card.description}</small>
              </div>

              <SummaryIcon />
            </article>
          );
        })}
      </section>

      <section className={styles.phasesList}>
        {phases.map((phase) => {
          const isOpen = openedPhaseIds.has(phase.id);

          const ofSummary = getOrderSummary(phase.ofs);

          const orpSummary = getOrderSummary(phase.orps);

          const orSummary = getOrderSummary(phase.ors);

          return (
            <article
              key={phase.id}
              className={[
                styles.phaseCard,
                getPhaseColorClass(phase.color),
                isOpen ? styles.open : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div
                className={styles.phaseHeader}
                onClick={() => togglePhase(phase.id)}
              >
                <div className={styles.phaseName}>
                  <small>FASE {phase.number}</small>

                  <h2>{phase.name}</h2>
                </div>

                <span className={styles.phaseCc}>CC: {phase.cc}</span>

                {[
                  ['OFs', ofSummary],
                  ['ORPs', orpSummary],
                  ['ORs', orSummary],
                ].map(([label, summary]) => (
                  <div
                    className={[styles.phaseOrders, styles.orderSummary].join(
                      ' ',
                    )}
                    key={label}
                  >
                    <strong>{label}</strong>

                    <small>
                      {summary.total}{' '}
                      {summary.total === 1 ? 'registro' : 'registros'}
                    </small>

                    <div className={styles.orderStatus}>
                      <span className={styles.running} title="Em andamento">
                        <MdHourglassTop />
                        {summary.andamento}
                      </span>

                      <span className={styles.done} title="Concluídas">
                        <MdCheckCircle />
                        {summary.concluidas}
                      </span>

                      <span className={styles.waiting} title="A iniciar">
                        <MdPlayCircleOutline />
                        {summary.iniciar}
                      </span>
                    </div>
                  </div>
                ))}

                <div className={styles.phaseStatus}>
                  <strong>{statusLabels[phase.status] ?? phase.status}</strong>

                  <span className={styles.phaseProgress}>
                    {phase.progress}%
                  </span>

                  <button
                    className={[styles.phaseToggle, isOpen ? styles.open : '']
                      .filter(Boolean)
                      .join(' ')}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      togglePhase(phase.id);
                    }}
                    aria-label={
                      isOpen
                        ? `Fechar fase ${phase.name}`
                        : `Abrir fase ${phase.name}`
                    }
                  >
                    <MdExpandMore />
                  </button>
                </div>
              </div>

              <div
                className={[styles.phaseBody, isOpen ? styles.open : '']
                  .filter(Boolean)
                  .join(' ')}
                aria-hidden={!isOpen}
              >
                <div className={styles.phaseBodyContent}>
                  <div className={styles.phaseInfo}>
                    <div>
                      <span>Início planejado</span>
                      <strong>{phase.plannedStart}</strong>
                    </div>

                    <div>
                      <span>Fim planejado</span>
                      <strong>{phase.plannedEnd}</strong>
                    </div>

                    <div>
                      <span>Início replanejado</span>
                      <strong>{phase.replannedStart}</strong>
                    </div>

                    <div>
                      <span>Fim replanejado</span>
                      <strong
                        className={
                          phase.replannedEnd !== '-' ? styles.warningText : ''
                        }
                      >
                        {phase.replannedEnd}
                      </strong>
                    </div>

                    <div>
                      <span>Fim previsto</span>
                      <strong>{phase.expectedEnd}</strong>
                    </div>

                    <div>
                      <span>Início executado</span>
                      <strong>{phase.executedStart}</strong>
                    </div>

                    <div>
                      <span>Atraso previsto</span>
                      <strong
                        className={
                          phase.delay !== '0 dias' ? styles.dangerText : ''
                        }
                      >
                        {phase.delay}
                      </strong>
                    </div>

                    <div>
                      <span>Pessoas atuando</span>
                      <strong>{phase.people}</strong>
                    </div>
                  </div>

                  <OrderSection
                    title="OF - Ordens de Fabricação"
                    emptyMessage="Nenhuma OF cadastrada nesta fase."
                    orders={phase.ofs}
                    onOpenActions={openActionMenu}
                  />

                  <OrderSection
                    title="ORP - Ordens de Reprocesso"
                    emptyMessage="Nenhuma ORP cadastrada nesta fase."
                    orders={phase.orps}
                    onOpenActions={openActionMenu}
                  />

                  <OrderSection
                    title="OR - Ordens de Retrabalho"
                    emptyMessage="Nenhuma OR cadastrada nesta fase."
                    orders={phase.ors}
                    onOpenActions={openActionMenu}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <small className={styles.footerNote}>
        * CRP (Condições Requeridas para o Processo)
      </small>

      {activeActionOrder && (
        <div
          className={styles.actionOverlayMenu}
          style={{
            top: actionMenuPosition.top,
            left: actionMenuPosition.left,
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => executeOrderAction('Atrelar operador')}
          >
            <MdPersonAdd />
            Atrelar operador
          </button>

          <button type="button" onClick={openOperatorStop}>
            <MdPauseCircle />
            Adicionar paralisação
          </button>

          <button
            type="button"
            onClick={() => executeOrderAction('Retirar paralisação')}
          >
            <MdPlayCircle />
            Retirar paralisação
          </button>

          <button
            type="button"
            onClick={() => executeOrderAction('Iniciar apontamento')}
          >
            <MdPlayArrow />
            Iniciar apontamento
          </button>

          <button
            type="button"
            onClick={() => executeOrderAction('Retirar apontamento')}
          >
            <MdStopCircle />
            Retirar apontamento
          </button>

          <button
            type="button"
            onClick={() => executeOrderAction('Desatrelar operador')}
          >
            <MdPersonRemove />
            Desatrelar operador
          </button>
        </div>
      )}

      {showReplannedModal && (
        <div
          className={styles.replannedModalOverlay}
          onClick={closeReplannedHistory}
        >
          <div
            className={styles.replannedModal}
            onClick={(event) => event.stopPropagation()}
          >
            <header className={styles.modalHeader}>
              <div>
                <span>Consulta</span>

                <h2>Histórico de Entregas Replanejadas</h2>
              </div>

              <button
                type="button"
                className={styles.modalClose}
                onClick={closeReplannedHistory}
              >
                <MdClose />
              </button>
            </header>

            <div className={styles.modalSearch}>
              <MdSearch />

              <input
                type="text"
                placeholder="Pesquisar por OF, data ou motivo."
                value={historySearch}
                onChange={(event) => setHistorySearch(event.target.value)}
              />
            </div>

            {!filteredReplannedHistory.length ? (
              <div className={styles.emptyHistory}>
                Nenhum replanejamento encontrado.
              </div>
            ) : (
              <div className={styles.modalTableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>Data do Replanejamento</th>
                      <th>Entrega Anterior</th>
                      <th>Nova Entrega</th>
                      <th>Motivo</th>
                      <th>OF Responsável</th>
                      <th>Fase</th>
                      <th>Usuário</th>
                      <th>Data/Hora da alteração</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredReplannedHistory.map((item) => (
                      <tr key={item.id}>
                        <td>{item.replannedDate}</td>

                        <td>{item.previousDelivery}</td>

                        <td>
                          <strong>{item.newDelivery}</strong>
                        </td>

                        <td>{item.reason}</td>

                        <td>{item.ofResponsible}</td>

                        <td>{item.phase}</td>

                        <td>{item.user}</td>

                        <td>{item.changedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
