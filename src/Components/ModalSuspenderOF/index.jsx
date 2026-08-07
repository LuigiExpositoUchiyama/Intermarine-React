import { useCallback, useEffect, useState } from 'react';

import { MdClose, MdPauseCircle, MdPerson } from 'react-icons/md';

import atrelarOperadorService from '../../Services/atrelarOperadorService';

import styles from './ModalSuspenderOF.module.css';

export default function ModalSuspenderOF({
  isOpen,
  ordem,
  fase,
  onClose,
  onConfirm,
}) {
  const [operadores, setOperadores] = useState([]);

  const loadOperadores = useCallback(async () => {
    try {
      const lista = await atrelarOperadorService.getOperadoresPorArea(
        fase?.name,
      );

      const vinculados = lista.filter(
        (operador) => operador.status === 'Ativo',
      );

      setOperadores(
        vinculados.map((operador) => ({
          ...operador,

          inicio: operador.inicio ?? '07:15',
        })),
      );
    } catch (error) {
      console.error('Erro ao buscar operadores', error);

      setOperadores([]);
    }
  }, [fase?.name]);

  useEffect(() => {
    if (!isOpen) {
      setOperadores([]);

      return;
    }

    loadOperadores();
  }, [isOpen, loadOperadores]);

  function handleConfirm() {
    onConfirm({
      ordem,

      fase,

      operadores,
    });
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <div className={styles.titleArea}>
            <div className={styles.icon}>
              <MdPauseCircle />
            </div>

            <div>
              <span>Ação da Ordem</span>

              <h2>Suspensão da Ordem de Fabricação</h2>
            </div>
          </div>

          <button type="button" onClick={onClose}>
            <MdClose />
          </button>
        </header>

        <section className={styles.content}>
          <div className={styles.orderCard}>
            <div>
              <span>OF</span>

              <strong>{ordem?.code ?? ordem?.codigo ?? '-'}</strong>
            </div>

            <div className={styles.divider} />

            <div>
              <span>Embarcação</span>

              <strong>{ordem?.embarcacao ?? '-'}</strong>
            </div>
          </div>

          <div className={styles.summaryBox}>
            <div>
              <span>Operadores</span>

              <strong>{operadores.length}</strong>
            </div>

            <div>
              <span>Atrelamento</span>

              <strong>Remover</strong>
            </div>

            <div>
              <span>Apontamentos</span>

              <strong>Encerrar</strong>
            </div>
          </div>

          <p className={styles.description}>
            Os operadores abaixo estão atualmente vinculados a esta Ordem de
            Fabricação. Ao suspender a OF, todos os vínculos serão removidos e
            os apontamentos ativos serão encerrados.
          </p>

          <div className={styles.operatorBox}>
            <div className={styles.tableHeader}>
              <span>RA</span>

              <span>Operador</span>

              <span>Início</span>
            </div>

            {operadores.length > 0 ? (
              operadores.map((operator) => (
                <div className={styles.operatorRow} key={operator.id}>
                  <span>{operator.ra}</span>

                  <strong>
                    <MdPerson />

                    {operator.nome}
                  </strong>

                  <span>{operator.inicio}</span>
                </div>
              ))
            ) : (
              <div className={styles.empty}>Nenhum operador vinculado</div>
            )}
          </div>

          <div className={styles.warning}>
            <MdPauseCircle />

            <span>
              Atenção: esta ação irá retirar os operadores da OF e finalizar os
              apontamentos ativos.
            </span>
          </div>
        </section>

        <footer className={styles.footer}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Cancelar
          </button>

          <button
            type="button"
            className={styles.confirm}
            onClick={handleConfirm}
          >
            <MdPauseCircle />
            Suspender OF
          </button>
        </footer>
      </div>
    </div>
  );
}
