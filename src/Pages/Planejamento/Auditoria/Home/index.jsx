import { useCallback, useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  MdAssignment,
  MdDirectionsBoat,
  MdFactCheck,
  MdInfoOutline,
  MdRefresh,
} from 'react-icons/md';

import auditoriaService from '../../../../Services/auditoriaService';
import PageLoading from '../../../../Components/PageLoading';

import styles from './Home.module.css';

const statusConfig = [
  {
    key: 'novo',
    label: 'Novo',
    className: 'novo',
  },
  {
    key: 'emReparo',
    label: 'Em reparo',
    className: 'emReparo',
  },
  {
    key: 'aguardandoValidacao',
    label: 'Aguardando validação',
    className: 'aguardandoValidacao',
  },
  {
    key: 'concluido',
    label: 'Concluído',
    className: 'concluido',
  },
  {
    key: 'cancelado',
    label: 'Cancelado',
    className: 'cancelado',
  },
  {
    key: 'reprovado',
    label: 'Reprovado',
    className: 'reprovado',
  },
];

export default function Home() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [boats, setBoats] = useState([]);
  const [phases, setPhases] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [summary, setSummary] = useState(null);

  const [selectedPhase, setSelectedPhase] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);

    try {
      const [boatsData, phasesData, periodsData, summaryData] =
        await Promise.all([
          auditoriaService.getBoats(),
          auditoriaService.getPhases(),
          auditoriaService.getPeriods(),
          auditoriaService.getSummary(),
        ]);

      setBoats(boatsData);
      setPhases(phasesData);
      setPeriods(periodsData);
      setSummary(summaryData);

      setSelectedPeriod((current) => {
        return current || periodsData[0]?.value || '';
      });
    } catch (error) {
      console.error('Erro ao carregar dashboard de auditoria:', error);

      setBoats([]);
      setPhases([]);
      setPeriods([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const filteredBoats = useMemo(() => {
    if (!selectedPhase) {
      return boats;
    }

    return boats.filter((boat) => {
      return boat.phaseKey === selectedPhase;
    });
  }, [boats, selectedPhase]);

  function openAuditoria(boat) {
    navigate(`/auditoria/${boat.id}`);
  }

  if (loading) {
    return (
      <div className={styles.homePage}>
        <PageLoading
          message="Carregando auditorias..."
          minHeight="calc(100vh - 40px)"
        />
      </div>
    );
  }

  return (
    <div className={styles.homePage}>
      <header className={styles.homeHeader}>
        <div className={styles.titleArea}>
          <div className={styles.titleIcon}>
            <MdFactCheck />
          </div>

          <div className={styles.titleText}>
            <h1>Dashboard Auditoria de Qualidade</h1>

            <p>Visão geral das auditorias e apontamentos por embarcação</p>
          </div>
        </div>

        <div className={styles.headerActions}>
          <label className={styles.filterBox}>
            <span>Fase atual</span>

            <select
              value={selectedPhase}
              onChange={(event) => setSelectedPhase(event.target.value)}
            >
              <option value="">Todas</option>

              {phases.map((phase) => (
                <option key={phase.key} value={phase.key}>
                  {phase.label}
                </option>
              ))}
            </select>
          </label>

          <label className={`${styles.filterBox} ${styles.periodFilter}`}>
            <span>Período</span>

            <select
              value={selectedPeriod}
              onChange={(event) => setSelectedPeriod(event.target.value)}
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className={styles.refreshButton}
            onClick={loadDashboard}
          >
            <MdRefresh />

            <span>Atualizar</span>
          </button>
        </div>
      </header>

      <section className={styles.boatsGrid}>
        {filteredBoats.map((boat) => (
          <article
            key={boat.id}
            className={styles.boatCard}
            onClick={() => openAuditoria(boat)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                openAuditoria(boat);
              }
            }}
          >
            <div className={styles.boatHeader}>
              <div className={styles.boatIcon}>
                <MdDirectionsBoat />
              </div>

              <div className={styles.boatTitle}>
                <strong>{boat.code}</strong>

                <span>{boat.name}</span>
              </div>
            </div>

            <div className={styles.phaseArea}>
              <span>Fase atual</span>

              <strong
                className={`${styles.phaseBadge} ${styles[boat.phaseClass]}`}
              >
                {boat.phase}
              </strong>
            </div>

            <div className={styles.divider} />

            <div className={styles.auditArea}>
              <MdAssignment />

              <div>
                <span>Auditorias criadas</span>

                <strong>{boat.auditsCreated}</strong>
              </div>
            </div>

            <div className={styles.statusArea}>
              <span className={styles.statusTitle}>
                Apontamentos por status
              </span>

              <div className={styles.statusGrid}>
                {statusConfig.map((status) => (
                  <div
                    key={status.key}
                    className={`${styles.statusCard} ${
                      styles[status.className]
                    }`}
                  >
                    <span>{status.label}</span>

                    <strong>{boat.status[status.key]}</strong>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      {!filteredBoats.length && (
        <div className={styles.emptyState}>
          <MdInfoOutline />

          <strong>
            Nenhuma embarcação encontrada para a fase selecionada.
          </strong>
        </div>
      )}

      {summary && (
        <section className={styles.summary}>
          <div className={styles.summaryTitle}>
            <MdInfoOutline />

            <strong>Resumo Geral</strong>
          </div>

          <div className={styles.summaryItem}>
            <span>Auditorias criadas</span>

            <strong>{summary.auditoriasCriadas}</strong>
          </div>

          <div className={styles.summaryItem}>
            <span>Apontamentos - Novo</span>

            <strong>{summary.novo}</strong>
          </div>

          <div className={`${styles.summaryItem} ${styles.summaryRepair}`}>
            <span>Apontamentos - Em reparo</span>

            <strong>{summary.emReparo}</strong>
          </div>

          <div className={`${styles.summaryItem} ${styles.summaryWaiting}`}>
            <span>Aguardando validação</span>

            <strong>{summary.aguardandoValidacao}</strong>
          </div>

          <div className={`${styles.summaryItem} ${styles.summaryDone}`}>
            <span>Concluídos</span>

            <strong>{summary.concluidos}</strong>
          </div>

          <div className={`${styles.summaryItem} ${styles.summaryCanceled}`}>
            <span>Cancelados</span>

            <strong>{summary.cancelados}</strong>
          </div>

          <div className={`${styles.summaryItem} ${styles.summaryRejected}`}>
            <span>Reprovados</span>

            <strong>{summary.reprovados}</strong>
          </div>
        </section>
      )}
    </div>
  );
}
