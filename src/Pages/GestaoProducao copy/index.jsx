import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  MdAssignment,
  MdCancel,
  MdCheck,
  MdCheckCircle,
  MdConstruction,
  MdDirectionsBoat,
  MdEngineering,
  MdGroups,
  MdPauseCircle,
  MdPersonOff,
  MdPlayCircle,
  MdRefresh,
  MdSearch,
  MdSync,
  MdTaskAlt,
  MdWarning,
  MdDashboard,
} from 'react-icons/md';

import homeService from '../../Services/gestaoProducaoService';

import NotificationDropdown from '../../Components/NotificationDropdown';
import PageLoading from '../../Components/PageLoading';

import styles from './GestaoProducao.module.css';

export default function GestaoProducao() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('');

  const [selectedDashboard, setSelectedDashboard] = useState('embarcacoes');

  const [metrics, setMetrics] = useState([]);
  const [phases, setPhases] = useState([]);
  const [miniPhases, setMiniPhases] = useState([]);

  const [boats, setBoats] = useState([]);
  const [miniFactories, setMiniFactories] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);

    try {
      const [
        metricsData,
        phasesData,
        boatsData,
        miniFactoriesData,
        miniPhasesData,
      ] = await Promise.all([
        homeService.getMetrics(),
        homeService.getPhases(),
        homeService.getBoats(),
        homeService.getMiniFactories(),
        homeService.getMiniPhases(),
      ]);

      setMetrics(metricsData);
      setPhases(phasesData);
      setBoats(boatsData);
      setMiniFactories(miniFactoriesData);
      setMiniPhases(miniPhasesData);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);

      setMetrics([]);
      setPhases([]);
      setBoats([]);
      setMiniFactories([]);
      setMiniPhases([]);
    } finally {
      setLoading(false);
    }
  }

  function changeDashboard(type) {
    setSelectedDashboard(type);
    setSelectedPhase('');
    setSearchTerm('');
  }

  const activePhases =
    selectedDashboard === 'embarcacoes' ? phases : miniPhases;

  const filteredItems = useMemo(() => {
    const list = selectedDashboard === 'embarcacoes' ? boats : miniFactories;

    const term = searchTerm.trim().toLowerCase();

    return list.filter((item) => {
      const matchesSearch =
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.code.toLowerCase().includes(term);

      const phase = activePhases[item.currentPhaseIndex]?.label;

      const matchesPhase = !selectedPhase || phase === selectedPhase;

      return matchesSearch && matchesPhase;
    });
  }, [
    selectedDashboard,
    boats,
    miniFactories,
    searchTerm,
    selectedPhase,
    activePhases,
  ]);

  function openMetric(metric) {
    const label = metric.label.toLowerCase();

    // OPERADORES STATUS

    if (
      label.includes('pessoas') ||
      label.includes('fora') ||
      label.includes('paralisação')
    ) {
      navigate('/operadores-status');

      return;
    }

    let filter = '';

    if (label.includes('execução')) {
      filter = 'execucao';
    }

    if (label.includes('iniciar')) {
      filter = 'iniciar';
    }

    if (label.includes('finalizadas')) {
      filter = 'finalizadas';
    }

    if (!filter) {
      return;
    }

    navigate(`/dashboard-producao?filtro=${filter}`);
  }

  function openBoat(boat) {
    const type =
      selectedDashboard === 'mini-fabricas' ? 'mini-fabrica' : 'embarcacao';

    const id = selectedDashboard === 'mini-fabricas' ? boat.boatId : boat.id;

    navigate(`/detalhe-producao/${type}/${id}`);
  }

  function getStatusLabel(status) {
    const statusMap = {
      'no-prazo': 'NO PRAZO',
      atencao: 'ATENÇÃO',
      atrasada: 'ATRASADA',
    };

    return statusMap[status] ?? status;
  }

  function getStatusIcon(status) {
    const iconMap = {
      'no-prazo': MdCheckCircle,
      atencao: MdWarning,
      atrasada: MdCancel,
    };

    return iconMap[status] ?? MdCheckCircle;
  }

  function getMetricIcon(icon) {
    const iconMap = {
      directions_boat: MdDirectionsBoat,

      assignment: MdAssignment,

      engineering: MdEngineering,

      play_circle: MdPlayCircle,

      groups: MdGroups,

      person_off: MdPersonOff,

      pause_circle: MdPauseCircle,

      task_alt: MdTaskAlt,

      check_circle: MdCheckCircle,

      warning: MdWarning,

      cancel: MdCancel,
    };

    return iconMap[icon] ?? MdDashboard;
  }

  function getOccupationDasharray(item) {
    const radius = 34;

    const circumference = 2 * Math.PI * radius;

    const progress = (item.occupation / 100) * circumference;

    return `${progress} ${circumference}`;
  }

  function getPhaseClass(item, index) {
    if (index > item.currentPhaseIndex) {
      return styles.phasePending;
    }

    if (item.status === 'atrasada') {
      return styles.phaseDanger;
    }

    if (item.status === 'atencao') {
      return styles.phaseWarning;
    }

    if (index === item.currentPhaseIndex) {
      return styles.phaseCurrent;
    }

    return styles.phaseDone;
  }

  function getCardClass(status) {
    if (status === 'no-prazo') {
      return styles.cardOk;
    }

    if (status === 'atencao') {
      return styles.cardWarning;
    }

    if (status === 'atrasada') {
      return styles.cardDanger;
    }

    return '';
  }

  function isMetricClickable(metric) {
    return metric.label !== 'Embarcações' && metric.label !== 'OFs Totais';
  }

  if (loading) {
    return (
      <div className={styles.gestaoPage}>
        <PageLoading
          message="Carregando dashboard..."
          minHeight="calc(100vh - 40px)"
        />
      </div>
    );
  }

  return (
    <div className={styles.gestaoPage}>
      <header className={styles.homeHeader}>
        <div>
          <span className={styles.eyebrow}>Dashboard</span>

          <h1>
            {selectedDashboard === 'embarcacoes'
              ? 'Gestão de Produção de Embarcações'
              : 'Controle de Produção de Mini Fábricas'}
          </h1>

          <nav className={styles.tabs}>
            <button
              type="button"
              className={
                selectedDashboard === 'embarcacoes' ? styles.active : ''
              }
              onClick={() => changeDashboard('embarcacoes')}
            >
              Embarcações
            </button>

            <button
              type="button"
              className={
                selectedDashboard === 'mini-fabricas' ? styles.active : ''
              }
              onClick={() => changeDashboard('mini-fabricas')}
            >
              Mini Fábricas
            </button>
          </nav>
        </div>

        <div className={styles.headerActions}>
          <select
            className={styles.phaseFilter}
            value={selectedPhase}
            onChange={(event) => setSelectedPhase(event.target.value)}
          >
            <option value="">Todas as fases</option>

            {activePhases.map((phase) => (
              <option key={phase.id} value={phase.label}>
                {phase.label}
              </option>
            ))}
          </select>

          <div className={styles.searchBox}>
            <MdSearch />

            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <NotificationDropdown />

          <button
            type="button"
            className={styles.refreshBtn}
            onClick={loadDashboard}
          >
            <MdRefresh />
            Atualizar
          </button>
        </div>
      </header>

      <section className={styles.metricsGrid}>
        {metrics.map((metric) => {
          const MetricIcon = getMetricIcon(metric.icon);

          const clickable = isMetricClickable(metric);

          return (
            <article
              key={metric.id}
              className={[
                styles.metricCard,

                metric.variant === 'success' ? styles.success : '',

                metric.variant === 'danger' ? styles.danger : '',

                metric.variant === 'warning' ? styles.warning : '',

                clickable ? styles.clickable : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => {
                if (clickable) {
                  openMetric(metric);
                }
              }}
            >
              <div className={styles.metricIcon}>
                <MetricIcon />
              </div>

              <div>
                <strong>{metric.value}</strong>

                <span>{metric.label}</span>

                <small>{metric.description}</small>
              </div>
            </article>
          );
        })}
      </section>

      <section className={styles.boatsGrid}>
        {filteredItems.map((boat) => {
          const StatusIcon = getStatusIcon(boat.status);

          return (
            <article
              key={boat.id}
              className={[styles.boatCard, getCardClass(boat.status)]
                .filter(Boolean)
                .join(' ')}
              onClick={() => openBoat(boat)}
            >
              <div className={styles.boatCardHeader}>
                <div className={styles.boatImageBox}>
                  <div className={styles.boatNumber}>{boat.number}</div>

                  <img src={boat.image} alt={boat.name} />
                </div>

                <div className={styles.boatTitleArea}>
                  <strong>{boat.code}</strong>

                  <span>{boat.name}</span>
                </div>

                <div className={styles.boatStatus}>
                  <StatusIcon />

                  <span>{getStatusLabel(boat.status)}</span>
                </div>
              </div>

              <div className={styles.boatProgressArea}>
                <div className={styles.occupationBox}>
                  <span>Eficiência</span>

                  <div className={styles.occupationCircle}>
                    <svg viewBox="0 0 80 80">
                      <circle
                        className={styles.occupationBg}
                        cx="40"
                        cy="40"
                        r="34"
                      />

                      <circle
                        className={styles.occupationProgress}
                        cx="40"
                        cy="40"
                        r="34"
                        strokeDasharray={getOccupationDasharray(boat)}
                      />
                    </svg>

                    <strong>{boat.occupation}%</strong>
                  </div>
                </div>

                <div className={styles.mainProgressBox}>
                  <span>Avanço da Produção</span>

                  <strong>{boat.progress}%</strong>

                  <div className={styles.mainProgressBar}>
                    <div
                      style={{
                        width: `${boat.progress}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.boatStats}>
                <div>
                  <span>OFs Totais</span>

                  <strong>{boat.totalOfs}</strong>
                </div>

                <div>
                  <span>A Iniciar</span>

                  <strong>{boat.notStarted}</strong>
                </div>

                <div>
                  <span>Em Andamento</span>

                  <strong>{boat.inProgress}</strong>
                </div>

                <div>
                  <span>Concluídas</span>

                  <strong>{boat.completed}</strong>
                </div>
              </div>

              <div className={styles.boatPhases}>
                <span className={styles.sectionTitle}>Fases da Produção</span>

                <div
                  className={styles.phaseTimeline}
                  style={{
                    '--phase-count': activePhases.length,
                  }}
                >
                  {activePhases.map((phase, index) => (
                    <div className={styles.phaseItem} key={phase.id}>
                      <div
                        className={[styles.phaseDot, getPhaseClass(boat, index)]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {index < boat.currentPhaseIndex && <MdCheck />}
                      </div>

                      <small>{phase.label}</small>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.boatFooter}>
                <div className={styles.footerInfo}>
                  <MdConstruction />

                  <div className={styles.footerText}>
                    <span>OR</span>

                    <strong>{boat.or}</strong>
                  </div>
                </div>

                <div className={styles.footerInfo}>
                  <MdSync className={styles.orangeIcon} />

                  <div className={styles.footerText}>
                    <span>ORP</span>

                    <strong>{boat.orp}</strong>
                  </div>
                </div>

                <div className={styles.footerDate}>
                  <span>Início Previsto</span>

                  <strong>{boat.startDate}</strong>
                </div>

                <div className={styles.footerDate}>
                  <span>Fim Previsto</span>

                  <strong>{boat.endDate}</strong>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className={styles.dashboardLegend}>
        <div className={`${styles.legendItem} ${styles.success}`}>
          <MdCheckCircle />

          <div>
            <strong>NO PRAZO</strong>

            <span>Produção dentro do prazo</span>
          </div>
        </div>

        <div className={`${styles.legendItem} ${styles.danger}`}>
          <MdCancel />

          <div>
            <strong>ATRASADA</strong>

            <span>Produção fora do prazo</span>
          </div>
        </div>

        <div className={`${styles.legendItem} ${styles.warning}`}>
          <MdWarning />

          <div>
            <strong>ATENÇÃO</strong>

            <span>Produção com risco de atraso</span>
          </div>
        </div>
      </section>
    </div>
  );
}
