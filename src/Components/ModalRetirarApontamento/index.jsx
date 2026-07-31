import { useEffect, useState } from 'react';

import { MdClose, MdStopCircle, MdWarning } from 'react-icons/md';

import styles from './ModalRetirarApontamento.module.css';

export default function ModalRetirarApontamento({
  isOpen,
  ordem,
  operador,
  operadores = [],
  onClose,
  onConfirm,
}) {
  const [motivo, setMotivo] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setMotivo('');

      return;
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  function confirm() {
    if (!motivo.trim()) {
      return;
    }

    onConfirm?.({
      ordem,

      operadores: operadores.length ? operadores : operador ? [operador] : [],

      motivo,
    });
  }

  const listaOperadores = operadores.length
    ? operadores
    : operador
      ? [operador]
      : [];

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <section
        className={styles.modal}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={onClose} type="button">
          <MdClose />
        </button>

        <div className={styles.icon}>
          <MdStopCircle />
        </div>

        <span className={styles.eyebrow}>Retirada de apontamento</span>

        <h2>Retirar apontamento da OF?</h2>

        <p>
          O apontamento atual será encerrado e os operadores ficarão disponíveis
          novamente.
        </p>

        <div className={styles.orderInfo}>
          <span>Ordem de fabricação</span>

          <strong>{ordem?.code ?? '-'}</strong>

          <small>{ordem?.process ?? 'Processo não informado'}</small>
        </div>

        <div className={styles.operatorInfo}>
          <span>Operadores atuais</span>

          {listaOperadores.length ? (
            listaOperadores.map((item, index) => (
              <strong key={index}>
                {item.nome ?? item.name ?? '-'}

                {item.ra && ` - RA ${item.ra}`}
              </strong>
            ))
          ) : (
            <strong>-</strong>
          )}
        </div>

        <label>
          <span>Motivo da retirada *</span>

          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Informe o motivo..."
          />
        </label>

        <div className={styles.warning}>
          <MdWarning />

          <p>Após confirmar, o apontamento será removido desta ordem.</p>
        </div>

        <footer>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Cancelar
          </button>

          <button
            type="button"
            className={styles.confirm}
            disabled={!motivo.trim()}
            onClick={confirm}
          >
            <MdStopCircle />
            Retirar apontamento
          </button>
        </footer>
      </section>
    </div>
  );
}
