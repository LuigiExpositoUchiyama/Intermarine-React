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
  const [selectedIds, setSelectedIds] = useState([]);
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
        setSelectedIds(preferred?.id ? [preferred.id] : []);
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
    () => operadores.filter((item) => selectedIds.includes(item.id)),
    [operadores, selectedIds],
  );

  const availableOperators = useMemo(
    () => filtered.filter((item) => item.podeIniciar),
    [filtered],
  );

  const blockedOperators = useMemo(
    () => filtered.filter((item) => !item.podeIniciar),
    [filtered],
  );

  function renderOperatorRow(operador, disabled = false) {
    const isSelected = selectedIds.includes(operador.id);

    return (
      <tr
        key={operador.id}
        className={[
          disabled ? styles.blockedRow : styles.selectableRow,
          isSelected ? styles.selectedRow : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => !disabled && selectOperator(operador)}
      >
        <td>
          <div className={styles.nameCell}>
            <span className={styles.radio}>{isSelected && <MdCheck />}</span>
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
              disabled ? styles.activeStatus : styles.availableStatus,
            ].join(' ')}
          >
            {disabled ? operador.status : 'Pronto'}
          </span>
        </td>

        <td>
          {operador.ofAtual !== '-' ? (
            <span className={styles.currentOrder}>{operador.ofAtual}</span>
          ) : (
            '-'
          )}
        </td>
      </tr>
    );
  }

  function selectOperator(operador) {
    if (!operador.podeIniciar || confirming) return;
    setSelectedIds((current) =>
      current.includes(operador.id)
        ? current.filter((id) => id !== operador.id)
        : [...current, operador.id],
    );

    setError('');
  }

  async function confirmStart() {
    if (!selected.length || !ordem) {
      setError('Selecione pelo menos um operador atrelado a esta OF.');
      return;
    }
    setConfirming(true);
    setError('');
    try {
      const result = await apontamentoOperadorService.iniciarApontamento({
        ordemId: ordem.id,
        ordemCodigo: ordem.code,
        operadores: selected,
      });
      onConfirm?.({
        ordem,
        fase,
        operadores: result.operadores,
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
                  ) : availableOperators.length ? (
                    availableOperators.map((operador) =>
                      renderOperatorRow(operador),
                    )
                  ) : (
                    <tr>
                      <td colSpan="6" className={styles.emptyCell}>
                        Nenhum operador disponível.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.disabledList}>
            <div className={styles.disabledHeader}>
              Operadores não disponíveis
            </div>

            <div className={styles.tableWrap}>
              <table>
                <tbody>
                  {blockedOperators.map((operador) =>
                    renderOperatorRow(operador, true),
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
                  ? `O apontamento será iniciado para ${selected.map((item) => item.nome).join(', ')}.`
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
            disabled={!selected.length || confirming}
          >
            {confirming ? 'Iniciando...' : 'Iniciar Apontamento'}
          </button>
        </footer>
      </section>
    </div>
  );
}
