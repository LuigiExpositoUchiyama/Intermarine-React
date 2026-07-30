import { useEffect, useMemo, useState } from 'react';
import {
  MdCheck,
  MdClose,
  MdFactory,
  MdPlayArrow,
  MdSearch,
} from 'react-icons/md';
import apontamentoOperadorService from '../../Services/apontamentoOperadorService';
import styles from './ModalIniciarApontamento.module.css';

export default function ModalIniciarApontamento({
  isOpen,
  ordem,
  fase,
  embarcacao,
  operadorPreSelecionado,
  onClose,
  onConfirm,
}) {
  const [operadores, setOperadores] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return undefined;
    let mounted = true;
    async function load() {
      setLoading(true);
      setError('');
      setSearch('');
      try {
        const data =
          await apontamentoOperadorService.getOperadoresParaApontamento(
            fase?.name,
            ordem,
          );
        if (!mounted) return;
        setOperadores(data ?? []);
        const preferred = (data ?? []).find(
          (item) =>
            (operadorPreSelecionado?.id &&
              item.id === operadorPreSelecionado.id) ||
            (operadorPreSelecionado?.ra &&
              String(item.ra) === String(operadorPreSelecionado.ra)) ||
            item.podeIniciar,
        );
        setSelectedId(preferred?.id ?? null);
      } catch (loadError) {
        console.error(
          'Erro ao carregar operadores para apontamento:',
          loadError,
        );
        if (mounted) {
          setOperadores([]);
          setError('Não foi possível carregar os operadores desta área.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      mounted = false;
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [
    fase?.name,
    isOpen,
    onClose,
    operadorPreSelecionado?.id,
    operadorPreSelecionado?.ra,
    ordem,
  ]);

  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return operadores;
    return operadores.filter((item) =>
      [
        item.nome,
        item.ra,
        item.centroCusto,
        item.area,
        item.status,
        item.ofAtual,
      ].some((field) => String(field).toLowerCase().includes(value)),
    );
  }, [operadores, search]);

  const selected = useMemo(
    () => operadores.find((item) => item.id === selectedId) ?? null,
    [operadores, selectedId],
  );

  function selectOperator(operador) {
    if (!operador.podeIniciar || confirming) return;
    setSelectedId(operador.id);
    setError('');
  }

  async function confirmStart() {
    if (!selected || !ordem) {
      setError('Selecione um operador atrelado a esta OF.');
      return;
    }
    setConfirming(true);
    setError('');
    try {
      const result = await apontamentoOperadorService.iniciarApontamento({
        ordemId: ordem.id,
        ordemCodigo: ordem.code,
        operador: selected,
      });
      onConfirm?.({
        ordem,
        fase,
        operador: result.operador,
        iniciadoEm: result.iniciadoEm,
      });
    } catch (confirmError) {
      console.error('Erro ao iniciar apontamento:', confirmError);
      setError(
        confirmError.message || 'Não foi possível iniciar o apontamento.',
      );
    } finally {
      setConfirming(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="start-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div className={styles.headerIcon}>
            <MdPlayArrow />
          </div>
          <div className={styles.headerText}>
            <span>Processo de apontamento</span>
            <h2 id="start-title">Iniciar apontamento na Ordem de Fabricação</h2>
            <p>
              Selecione o operador atrelado à ordem. O líder também pode iniciar
              o apontamento em nome do operador.
            </p>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fechar modal"
          >
            <MdClose />
          </button>
        </header>
        <div className={styles.content}>
          <article className={styles.orderCard}>
            <div className={styles.orderIcon}>
              <MdFactory />
            </div>
            <div>
              <span>{ordem?.type ?? 'OF'} selecionada</span>
              <strong>{ordem?.code ?? '-'}</strong>
              <p>
                {ordem?.process ?? 'Processo não informado'} · Fase{' '}
                {fase?.number ?? '-'} - {fase?.name ?? '-'}
                {embarcacao?.name ? ` (${embarcacao.name})` : ''}
              </p>
            </div>
          </article>
          <section className={styles.listCard}>
            <div className={styles.listHeader}>
              <div>
                <span>Lista de operadores</span>
                <strong>Área: {fase?.name ?? 'Não informada'}</strong>
              </div>
              <small>Total: {operadores.length} operadores</small>
            </div>
            <div className={styles.searchBox}>
              <MdSearch />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nome, RA, centro de custo ou OF..."
              />
            </div>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>Nome completo</th>
                    <th>RA</th>
                    <th>Centro de custo</th>
                    <th>Área</th>
                    <th>Status</th>
                    <th>OF atual</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className={styles.emptyCell}>
                        Carregando operadores...
                      </td>
                    </tr>
                  ) : filtered.length ? (
                    filtered.map((operador) => {
                      const isSelected = selectedId === operador.id;
                      return (
                        <tr
                          key={operador.id}
                          className={[
                            operador.podeIniciar
                              ? styles.selectableRow
                              : styles.blockedRow,
                            isSelected ? styles.selectedRow : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          onClick={() => selectOperator(operador)}
                        >
                          <td>
                            <div className={styles.nameCell}>
                              <span className={styles.radio}>
                                {isSelected && <MdCheck />}
                              </span>
                              <strong>{operador.nome}</strong>
                            </div>
                          </td>
                          <td>{operador.ra}</td>
                          <td>{operador.centroCusto}</td>
                          <td>{operador.area}</td>
                          <td>
                            <span
                              className={[
                                styles.status,
                                operador.podeIniciar
                                  ? styles.availableStatus
                                  : styles.activeStatus,
                              ].join(' ')}
                            >
                              {operador.podeIniciar
                                ? 'Pronto'
                                : operador.status}
                            </span>
                          </td>
                          <td>
                            {operador.ofAtual !== '-' ? (
                              <span className={styles.currentOrder}>
                                {operador.ofAtual}
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className={styles.emptyCell}>
                        Nenhum operador encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
          <div className={styles.confirmationInfo}>
            <span className={styles.confirmationIcon}>
              <MdCheck />
            </span>
            <div>
              <strong>
                {selected
                  ? `O apontamento será iniciado para ${selected.nome}.`
                  : 'Selecione o operador que iniciará o apontamento.'}
              </strong>
              <p>
                O início executado e o status da ordem serão atualizados
                imediatamente.
              </p>
            </div>
          </div>
          {error && <div className={styles.errorMessage}>{error}</div>}
        </div>
        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
            disabled={confirming}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.confirmButton}
            onClick={confirmStart}
            disabled={!selected || confirming}
          >
            {confirming ? 'Iniciando...' : 'Iniciar Apontamento'}
          </button>
        </footer>
      </section>
    </div>
  );
}
