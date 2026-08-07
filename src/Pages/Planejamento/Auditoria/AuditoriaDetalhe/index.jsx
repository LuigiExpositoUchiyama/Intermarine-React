import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  MdAdd,
  MdAssignment,
  MdCheck,
  MdClose,
  MdDeleteOutline,
  MdDirectionsBoat,
  MdEdit,
  MdExpandLess,
  MdExpandMore,
  MdFactCheck,
  MdFilterAlt,
  MdLayers,
  MdMoreVert,
  MdPersonOutline,
  MdSave,
  MdSearch,
  MdVisibility,
} from 'react-icons/md';

import auditoriaDetalheService from '../../../../Services/auditoriaDetalheService';
import PageLoading from '../../../../Components/PageLoading';

import styles from './AuditoriaDetalhe.module.css';

function StatusBadge({ status }) {
  const statusClassMap = {
    'EM ANDAMENTO': styles.statusProgress,
    CONCLUÍDA: styles.statusDone,
    RASCUNHO: styles.statusDraft,
    'EM REPARO': styles.statusRepair,
    'AGUARDANDO APROVAÇÃO': styles.statusWaiting,
    APROVADO: styles.statusApproved,
  };

  return (
    <span className={`${styles.statusBadge} ${statusClassMap[status] || ''}`}>
      {status}
    </span>
  );
}

function Severity({ level }) {
  const classMap = {
    Alta: styles.severityHigh,
    Média: styles.severityMedium,
    Baixa: styles.severityLow,
  };

  return (
    <span className={`${styles.severity} ${classMap[level] || ''}`}>
      <i />
      {level}
    </span>
  );
}

export default function AuditoriaDetalhe() {
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    embarcacao: '',
    matricula: '',
    fase: '',
    estagio: '',
    ambiente: '',
  });

  const [options, setOptions] = useState({
    embarcacoes: [],
    matriculas: [],
    fases: [],
    estagios: [],
    ambientes: [],
  });

  const [audits, setAudits] = useState([]);

  const [expandedAuditId, setExpandedAuditId] = useState(1);

  const [activeTab, setActiveTab] = useState('apontamentos');

  const loadPage = useCallback(async () => {
    setLoading(true);

    try {
      const [filtersData, auditsData] = await Promise.all([
        auditoriaDetalheService.getFilterOptions(),
        auditoriaDetalheService.getAudits(),
      ]);

      setOptions(filtersData);

      setAudits(auditsData);

      setFilters({
        embarcacao: filtersData.embarcacoes[0]?.value || '',
        matricula: filtersData.matriculas[0]?.value || '',
        fase: filtersData.fases[0]?.value || '',
        estagio: filtersData.estagios[0]?.value || '',
        ambiente: filtersData.ambientes[0]?.value || '',
      });

      if (auditsData.length) {
        setExpandedAuditId(auditsData[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar auditoria:', error);

      setAudits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  function changeFilter(field, value) {
    setFilters((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function toggleAudit(id) {
    setExpandedAuditId((current) => {
      return current === id ? null : id;
    });
  }

  async function handleDeletePoint(auditId, pointId) {
    try {
      await auditoriaDetalheService.deletePoint(auditId, pointId);

      setAudits((current) =>
        current.map((audit) => {
          if (audit.id !== auditId) {
            return audit;
          }

          return {
            ...audit,

            points: audit.points.filter((point) => point.id !== pointId),
          };
        }),
      );
    } catch (error) {
      console.error('Erro ao excluir apontamento:', error);
    }
  }

  async function handleNewAudit() {
    try {
      const newAudit = await auditoriaDetalheService.createAudit();

      setAudits((current) => [...current, newAudit]);

      setExpandedAuditId(newAudit.id);

      setActiveTab('apontamentos');
    } catch (error) {
      console.error('Erro ao criar auditoria:', error);
    }
  }

  async function handleNewPoint(auditId) {
    try {
      const newPoint = await auditoriaDetalheService.createPoint(auditId);

      setAudits((current) =>
        current.map((audit) => {
          if (audit.id !== auditId) {
            return audit;
          }

          return {
            ...audit,

            points: [...audit.points, newPoint],
          };
        }),
      );
    } catch (error) {
      console.error('Erro ao criar apontamento:', error);
    }
  }

  async function handleSave() {
    try {
      await auditoriaDetalheService.saveAudits(audits);
    } catch (error) {
      console.error('Erro ao salvar auditoria:', error);
    }
  }

  async function handleFinish() {
    if (!expandedAuditId) {
      return;
    }

    try {
      await auditoriaDetalheService.finishAudit(expandedAuditId);

      setAudits((current) =>
        current.map((audit) => {
          if (audit.id !== expandedAuditId) {
            return audit;
          }

          return {
            ...audit,
            status: 'CONCLUÍDA',
          };
        }),
      );
    } catch (error) {
      console.error('Erro ao finalizar auditoria:', error);
    }
  }

  function handleFilter() {
    console.log('Filtros aplicados:', filters);
  }

  const currentAudit = useMemo(() => {
    return audits.find((audit) => audit.id === expandedAuditId);
  }, [audits, expandedAuditId]);

  if (loading) {
    return (
      <div className={styles.page}>
        <PageLoading
          message="Carregando auditoria..."
          minHeight="calc(100vh - 40px)"
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.pageTitleArea}>
          <div className={styles.pageTitleIcon}>
            <MdFactCheck />
          </div>

          <div>
            <div className={styles.titleRow}>
              <h1>Auditoria de Embarcação #001</h1>

              <StatusBadge status="EM ANDAMENTO" />
            </div>

            <p>
              Registre e acompanhe os apontamentos de qualidade da embarcação
            </p>
          </div>
        </div>
      </header>

      <section className={styles.filtersCard}>
        <div className={styles.sectionHeading}>
          <MdFilterAlt />

          <strong>Filtros</strong>
        </div>

        <div className={styles.filtersGrid}>
          <label>
            <span>Código da Embarcação</span>

            <select
              value={filters.embarcacao}
              onChange={(event) =>
                changeFilter('embarcacao', event.target.value)
              }
            >
              {options.embarcacoes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Matrícula</span>

            <select
              value={filters.matricula}
              onChange={(event) =>
                changeFilter('matricula', event.target.value)
              }
            >
              {options.matriculas.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Fase</span>

            <select
              value={filters.fase}
              onChange={(event) => changeFilter('fase', event.target.value)}
            >
              {options.fases.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Estágio</span>

            <select
              value={filters.estagio}
              onChange={(event) => changeFilter('estagio', event.target.value)}
            >
              {options.estagios.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Ambiente</span>

            <select
              value={filters.ambiente}
              onChange={(event) => changeFilter('ambiente', event.target.value)}
            >
              {options.ambientes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className={styles.filterButton}
            onClick={handleFilter}
          >
            <MdSearch />
            Filtrar
          </button>
        </div>
      </section>

      <section className={styles.auditSection}>
        <div className={styles.auditSectionHeader}>
          <h2>Auditoria de Embarcação</h2>

          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleNewAudit}
          >
            <MdAdd />
            Nova Auditoria
          </button>
        </div>

        <div className={styles.auditList}>
          {audits.map((audit) => {
            const isExpanded = expandedAuditId === audit.id;

            return (
              <article key={audit.id} className={styles.auditCard}>
                <button
                  type="button"
                  className={styles.auditCardHeader}
                  onClick={() => toggleAudit(audit.id)}
                >
                  <div className={styles.auditCardTitle}>
                    <strong>{audit.title}</strong>

                    <StatusBadge status={audit.status} />
                  </div>

                  <div className={styles.auditHeaderActions}>
                    <MdSave />

                    <MdMoreVert />

                    {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
                  </div>
                </button>

                {isExpanded && (
                  <div className={styles.auditContent}>
                    <div className={styles.auditMeta}>
                      <div>
                        <MdAssignment />

                        <span>Data de Criação</span>

                        <strong>{audit.createdAt}</strong>
                      </div>

                      <div>
                        <MdPersonOutline />

                        <span>Auditor Responsável</span>

                        <strong>{audit.auditor}</strong>
                      </div>

                      <div>
                        <MdDirectionsBoat />

                        <span>Embarcação</span>

                        <strong>{audit.boat}</strong>
                      </div>

                      <div>
                        <MdLayers />

                        <span>Fase</span>

                        <strong>{audit.phase}</strong>
                      </div>
                    </div>

                    <div className={styles.tabsBar}>
                      <div className={styles.tabs}>
                        <button
                          type="button"
                          className={
                            activeTab === 'apontamentos' ? styles.activeTab : ''
                          }
                          onClick={() => setActiveTab('apontamentos')}
                        >
                          Apontamentos da Embarcação ({audit.points.length})
                        </button>

                        <button
                          type="button"
                          className={
                            activeTab === 'resumo' ? styles.activeTab : ''
                          }
                          onClick={() => setActiveTab('resumo')}
                        >
                          Resumo da Auditoria
                        </button>
                      </div>

                      <button
                        type="button"
                        className={styles.primaryButton}
                        onClick={() => handleNewPoint(audit.id)}
                      >
                        <MdAdd />
                        Novo Apontamento
                      </button>
                    </div>

                    {activeTab === 'apontamentos' ? (
                      <div className={styles.tableWrap}>
                        <table>
                          <thead>
                            <tr>
                              <th>Nº Apontamento</th>

                              <th>Categoria do Item</th>

                              <th>Defeito</th>

                              <th>Gravidade</th>

                              <th>Setor Responsável</th>

                              <th>Status</th>

                              <th>Ações</th>
                            </tr>
                          </thead>

                          <tbody>
                            {audit.points.map((point) => (
                              <tr key={point.id}>
                                <td>{point.code}</td>

                                <td>{point.category}</td>

                                <td>{point.defect}</td>

                                <td>
                                  <Severity level={point.severity} />
                                </td>

                                <td>{point.responsibleSector}</td>

                                <td>
                                  <StatusBadge status={point.status} />
                                </td>

                                <td>
                                  <div className={styles.rowActions}>
                                    <button type="button" title="Visualizar">
                                      <MdVisibility />
                                    </button>

                                    <button type="button" title="Editar">
                                      <MdEdit />
                                    </button>

                                    <button
                                      type="button"
                                      title="Excluir"
                                      className={styles.deleteButton}
                                      onClick={() =>
                                        handleDeletePoint(audit.id, point.id)
                                      }
                                    >
                                      <MdDeleteOutline />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className={styles.summaryTab}>
                        <div>
                          <span>Total de apontamentos</span>

                          <strong>{audit.points.length}</strong>
                        </div>

                        <div>
                          <span>Responsável</span>

                          <strong>{audit.auditor}</strong>
                        </div>

                        <div>
                          <span>Fase</span>

                          <strong>{audit.phase}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <footer className={styles.footerActions}>
        <button type="button" className={styles.cancelButton}>
          <MdClose />
          Cancelar
        </button>

        <button
          type="button"
          className={styles.saveButton}
          onClick={handleSave}
        >
          <MdSave />
          Salvar Auditoria
        </button>

        <button
          type="button"
          className={styles.finishButton}
          onClick={handleFinish}
          disabled={!currentAudit}
        >
          <MdCheck />
          Finalizar Auditoria
        </button>
      </footer>
    </div>
  );
}
