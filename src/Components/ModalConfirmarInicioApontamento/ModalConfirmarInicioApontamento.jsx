import { useEffect } from 'react';
import { MdClose, MdPlayArrow, MdTaskAlt } from 'react-icons/md';
import styles from './ModalConfirmarInicioApontamento.module.css';

export default function ModalConfirmarInicioApontamento({
  isOpen,
  ordem,
  operador,
  onNo,
  onYes,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;
    function handleKeyDown(event) {
      if (event.key === 'Escape') onNo();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNo]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onMouseDown={onNo}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onNo}
          aria-label="Fechar"
        >
          <MdClose />
        </button>
        <span className={styles.icon}>
          <MdTaskAlt />
        </span>
        <span className={styles.eyebrow}>Atrelamento concluído</span>
        <h2>Iniciar o apontamento na OF?</h2>
        <p>
          <strong>{operador?.nome}</strong> foi atrelado à{' '}
          <strong>{ordem?.code}</strong>. Deseja iniciar o apontamento agora?
        </p>
        <div className={styles.orderInfo}>
          <span>Ordem de fabricação</span>
          <strong>{ordem?.code ?? '-'}</strong>
          <small>{ordem?.process ?? 'Processo não informado'}</small>
        </div>
        <footer>
          <button type="button" className={styles.noButton} onClick={onNo}>
            Não, iniciar depois
          </button>
          <button type="button" className={styles.yesButton} onClick={onYes}>
            <MdPlayArrow />
            Sim, iniciar agora
          </button>
        </footer>
      </section>
    </div>
  );
}
