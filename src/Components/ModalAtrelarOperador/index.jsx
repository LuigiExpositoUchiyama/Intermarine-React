import { useEffect, useMemo, useState } from 'react';

import { MdCheck, MdClose, MdFactory, MdLink, MdSearch } from 'react-icons/md';

import atrelarOperadorService from '../../Services/atrelarOperadorService';

import styles from './ModalAtrelarOperador.module.css';

export default function ModalAtrelarOperador({
  isOpen,
  ordem,
  fase,
  embarcacao,
  onClose,
  onConfirm,
}) {
  const [operadores, setOperadores] = useState([]);
  const [selectedOperatorIds, setSelectedOperatorIds] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    let mounted = true;

    async function loadOperators() {
      setLoading(true);
      setError('');
      setSelectedOperatorIds([]);
      setSearch('');

      try {
        const data = await atrelarOperadorService.getOperadoresPorArea(
          fase?.name,
        );

        if (mounted) {
          setOperadores(data ?? []);
        }
      } catch (loadError) {
        console.error('Erro ao carregar colaboradores:', loadError);

        if (mounted) {
          setOperadores([]);
          setError('Não foi possível carregar os colaboradores desta área.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadOperators();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      mounted = false;
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [fase?.name, isOpen, onClose]);

  const filteredOperators = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return operadores;
    }

    return operadores.filter((operador) =>
      [
        operador.nome,
        operador.ra,
        operador.centroCusto,
        operador.area,
        operador.status,
        operador.ofAtual,
      ].some((field) => String(field).toLowerCase().includes(value)),
    );
  }, [operadores, search]);

  const selectedOperators = useMemo(
    () =>
      operadores.filter((operador) =>
        selectedOperatorIds.includes(operador.id),
      ),
    [operadores, selectedOperatorIds],
  );

  const availableOperators = useMemo(
    () =>
      filteredOperators.filter((operador) => operador.status === 'Disponível'),
    [filteredOperators],
  );

  const unavailableOperators = useMemo(
    () =>
      filteredOperators.filter((operador) => operador.status !== 'Disponível'),
    [filteredOperators],
  );

  function selectOperator(operator) {
    if (operator.status !== 'Disponível' || confirming) {
      return;
    }

    setSelectedOperatorIds((current) => {
      if (current.includes(operator.id)) {
        return current.filter((id) => id !== operator.id);
      }

      return [...current, operator.id];
    });

    setError('');
  }

  function renderOperatorRow(operador, disabled = false) {
    const isSelected = selectedOperatorIds.includes(operador.id);

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
            {operador.status}
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

  async function confirmAttach() {
    if (!selectedOperators.length || !ordem) {
      setError(
        'Selecione pelo menos um colaborador disponível para continuar.',
      );
      return;
    }

    setConfirming(true);
    setError('');

    try {
      const result = await atrelarOperadorService.atrelarOperador({
        ordemId: ordem.id,
        ordemCodigo: ordem.code,
        operadoresIds: selectedOperatorIds,
      });

      onConfirm?.({
        ordem,
        fase,
        operadores: selectedOperators,
      });
    } catch (confirmError) {
      console.error('Erro ao atrelar colaborador:', confirmError);
      setError(
        confirmError.message || 'Não foi possível concluir o atrelamento.',
      );
    } finally {
      setConfirming(false);
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="attach-operator-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div className={styles.headerIcon}>
            <MdLink />
          </div>

          <div className={styles.headerText}>
            <span>Processo de atrelamento</span>
            <h2 id="attach-operator-title">
              Atrelar Colaborador à Ordem de Fabricação
            </h2>
            <p>
              Esta ação vinculará um colaborador à ordem selecionada. Após o
              atrelamento, o operador poderá iniciar a execução da atividade
              quando estiver pronto para iniciar os trabalhos.
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
              <span>{ordem?.type ?? 'OF'} em execução</span>
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
                <span>Lista de colaboradores</span>
                <strong>Área: {fase?.name ?? 'Não informada'}</strong>
              </div>

              <small>Total: {operadores.length} colaboradores</small>
            </div>

            <div className={styles.searchBox}>
              <MdSearch />
              <input
                type="text"
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
                        Carregando colaboradores...
                      </td>
                    </tr>
                  ) : availableOperators.length ? (
                    availableOperators.map((operador) =>
                      renderOperatorRow(operador),
                    )
                  ) : (
                    <tr>
                      <td colSpan="6" className={styles.emptyCell}>
                        Nenhum colaborador encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <section className={styles.disabledList}>
              <div className={styles.disabledHeader}>
                Operadores já atrelados / indisponíveis
              </div>

              <div className={styles.tableWrap}>
                <table>
                  <tbody>
                    {unavailableOperators.map((operador) =>
                      renderOperatorRow(operador, true),
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </section>

          <div className={styles.confirmationInfo}>
            <span className={styles.confirmationIcon}>
              <MdCheck />
            </span>

            <div>
              <strong>
                {selectedOperators.length
                  ? `${selectedOperators.length} colaboradores serão atrelados à ${ordem?.code}.`
                  : `Ao confirmar, os colaboradores serão atrelados à ${ordem?.code ?? 'ordem selecionada'}.`}
              </strong>
              <p>
                O operador poderá visualizar esta ordem em seu painel individual
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
            onClick={confirmAttach}
            disabled={!selectedOperators.length || confirming}
          >
            {confirming ? 'Confirmando...' : 'Confirmar Atrelamento'}
          </button>
        </footer>
      </section>
    </div>
  );
}
