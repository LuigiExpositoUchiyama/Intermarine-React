import { useEffect, useMemo } from 'react';

import {
  MdBadge,
  MdBusiness,
  MdCalendarMonth,
  MdCheck,
  MdClose,
  MdEngineering,
  MdInfo,
  MdPeople,
  MdPerson,
  MdSchedule,
  MdSettings,
} from 'react-icons/md';

import styles from './ModalApontamentoSucesso.module.css';

function formatStartDate(iniciadoEm) {
  if (iniciadoEm?.data) {
    return iniciadoEm.data;
  }

  if (iniciadoEm?.dataHora) {
    const value = String(iniciadoEm.dataHora);
    return value.split(',')[0]?.trim() || value;
  }

  if (typeof iniciadoEm === 'string' && iniciadoEm.trim()) {
    return iniciadoEm.split(',')[0]?.trim() || iniciadoEm;
  }

  return new Date().toLocaleDateString('pt-BR');
}

function formatStartTime(iniciadoEm) {
  if (iniciadoEm?.hora) {
    return iniciadoEm.hora;
  }

  if (iniciadoEm?.dataHora) {
    const value = String(iniciadoEm.dataHora);
    const parts = value.split(',');

    if (parts.length > 1) {
      return parts.slice(1).join(',').trim();
    }
  }

  if (typeof iniciadoEm === 'string' && iniciadoEm.trim()) {
    const parts = iniciadoEm.split(',');

    if (parts.length > 1) {
      return parts.slice(1).join(',').trim();
    }
  }

  return new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ModalApontamentoSucesso({
  isOpen,
  ordem,
  fase,
  operador,
  iniciadoEm,
  onClose,
}) {
  const dataInicio = useMemo(() => formatStartDate(iniciadoEm), [iniciadoEm]);

  const horaInicio = useMemo(() => formatStartTime(iniciadoEm), [iniciadoEm]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
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

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pointing-success-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Fechar"
        >
          <MdClose />
        </button>

        <span className={styles.successIcon}>
          <MdCheck />
        </span>

        <h2 id="pointing-success-title">Apontamento iniciado com sucesso</h2>

        <p className={styles.subtitle}>
          O colaborador foi vinculado à Ordem de Fabricação e o apontamento foi
          iniciado.
        </p>

        <div className={styles.divider} />

        <div className={styles.infoGrid}>
          <article className={styles.infoItem}>
            <span className={styles.infoIcon}>
              <MdPerson />
            </span>
            <div>
              <span>Colaborador</span>
              <strong>{operador?.nome ?? '-'}</strong>
            </div>
          </article>

          <article className={styles.infoItem}>
            <span className={styles.infoIcon}>
              <MdBusiness />
            </span>
            <div>
              <span>Área</span>
              <strong>{fase?.name ?? operador?.area ?? '-'}</strong>
            </div>
          </article>

          <article className={styles.infoItem}>
            <span className={styles.infoIcon}>
              <MdBadge />
            </span>
            <div>
              <span>RA</span>
              <strong>{operador?.ra ?? '-'}</strong>
            </div>
          </article>

          <article className={styles.infoItem}>
            <span className={styles.infoIcon}>
              <MdPeople />
            </span>
            <div>
              <span>Líder responsável</span>
              <strong>
                {operador?.lider ?? operador?.leader ?? 'Não informado'}
              </strong>
            </div>
          </article>

          <article className={styles.infoItem}>
            <span className={styles.infoIcon}>
              <MdEngineering />
            </span>
            <div>
              <span>OF</span>
              <strong className={styles.orderCode}>{ordem?.code ?? '-'}</strong>
            </div>
          </article>

          <article className={styles.infoItem}>
            <span className={styles.infoIcon}>
              <MdCalendarMonth />
            </span>
            <div>
              <span>Data de início</span>
              <strong>{dataInicio}</strong>
            </div>
          </article>

          <article className={styles.infoItem}>
            <span className={styles.infoIcon}>
              <MdSettings />
            </span>
            <div>
              <span>Processo</span>
              <strong>{ordem?.process ?? 'Processo não informado'}</strong>
            </div>
          </article>

          <article className={styles.infoItem}>
            <span className={styles.infoIcon}>
              <MdSchedule />
            </span>
            <div>
              <span>Hora de início</span>
              <strong>{horaInicio}</strong>
            </div>
          </article>
        </div>

        <div className={styles.notice}>
          <MdInfo />
          <p>
            O colaborador encontra-se em produção e já está contabilizando tempo
            na Ordem de Fabricação.
          </p>
        </div>

        <footer className={styles.footer}>
          <button type="button" onClick={onClose}>
            Fechar
          </button>
        </footer>
      </section>
    </div>
  );
}
