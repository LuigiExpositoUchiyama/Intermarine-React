import { useEffect, useState } from 'react';

import {
  MdPauseCircle,
  MdClose,
  MdCheck,
  MdSchedule,
  MdPlayCircle,
  MdHistory,
  MdAssignment,
} from 'react-icons/md';

import PageLoading from '../../Components/PageLoading';
import { getOperatorStop } from '../../Services/paralisacaoOperadorService';

import styles from './ParalisacaoOperador.module.css';

const pendingOrders = [
  {
    id: 1,
    code: 'OF-1245',
    boat: 'Intermarine 60',
    area: 'Laminação',
    description: 'Fabricação do Casco',
    phase: 'Laminação',
  },
  {
    id: 2,
    code: 'OF-1260',
    boat: 'Intermarine 60',
    area: 'Montagem Final',
    description: 'Montagem Estrutural',
    phase: 'Montagem Final',
  },
];

export default function ParalisacaoOperador() {
  const [loading, setLoading] = useState(true);
  const [operatorStop, setOperatorStop] = useState(null);

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const [selectedBoat, setSelectedBoat] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    try {
      const data = await getOperatorStop();
      setOperatorStop(data);
    } catch (error) {
      console.error('Erro ao carregar paralisação', error);
    }

    setLoading(false);
  }

  function openRemoveModal() {
    setShowRemoveModal(true);
  }

  function closeRemoveModal() {
    setShowRemoveModal(false);
  }

  function attachLastOrder() {
    console.log('Reatrelar última OF');
  }

  function attachNewOrder() {
    setShowRemoveModal(false);
    setShowOrderModal(true);
  }

  function confirmNewOrder() {
    console.log('Nova OF selecionada:', selectedOrder);
    setShowOrderModal(false);
  }

  function paralyzeOperator() {
    console.log('Paralisar operador');
  }

  function getHistoryIcon(status) {
    if (status === 'success') return <MdCheck />;
    if (status === 'danger') return <MdPauseCircle />;
    return <MdSchedule />;
  }

  if (loading) {
    return <PageLoading message="Carregando paralisação do operador..." />;
  }

  if (!operatorStop) return null;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className={styles.breadcrumb}>Produção / Paralisação</span>
          <h1>Paralisação de Operadores</h1>
          <p>Gerencie paralisações, histórico e retorno dos colaboradores.</p>
        </div>

        <button className={styles.primaryBtn} onClick={paralyzeOperator}>
          <MdPauseCircle />
          Paralisar Operador
        </button>
      </header>

      <section className={styles.operatorCard}>
        <div className={styles.operatorInfo}>
          <div className={styles.avatar}>
            {operatorStop.operator.name.charAt(0)}
          </div>

          <div>
            <span>Operador</span>
            <h2>{operatorStop.operator.name}</h2>
            <p>RA: {operatorStop.operator.ra}</p>
          </div>
        </div>

        <Info title="Área" value={operatorStop.operator.area} />
        <Info title="Líder" value={operatorStop.operator.leader} />
        <Info title="Status" value="PARALISADO" danger />

        <Info
          title="Tempo parado"
          value={operatorStop.stoppedTime}
          extra={`Desde ${operatorStop.stoppedSince}`}
        />
      </section>

      <section className={styles.grid}>
        <div className={styles.main}>
          <Card title="Dados da Paralisação">
            <div className={styles.details}>
              <Info title="Início" value={operatorStop.stopData.startDate} />
              <Info title="Motivo" value={operatorStop.stopData.reason} />
              <Info
                title="Responsável"
                value={operatorStop.stopData.responsible}
              />
              <Info
                title="Observação"
                value={operatorStop.stopData.observation}
              />
            </div>
          </Card>

          <Card title="Fluxo da Paralisação">
            <div className={styles.flow}>
              {operatorStop.flow.map((step) => (
                <div
                  key={step.title}
                  className={`${styles.flowStep} ${step.completed ? styles.completed : ''}`}
                >
                  <div className={styles.circle}>
                    {step.completed ? <MdCheck /> : <MdSchedule />}
                  </div>

                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Histórico da Paralisação">
            <div className={styles.timeline}>
              {operatorStop.history.map((item) => (
                <div key={item.title} className={styles.timelineItem}>
                  <div className={styles.timelineIcon}>
                    {getHistoryIcon(item.status)}
                  </div>

                  <div>
                    <small>{item.date || 'Aguardando'}</small>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <aside className={styles.side}>
          <Card title="OF Anterior">
            <strong className={styles.order}>
              {operatorStop.previousOrder.code}
            </strong>

            <p>{operatorStop.previousOrder.description}</p>
            <span>Fase: {operatorStop.previousOrder.phase}</span>
            <span>CC: {operatorStop.previousOrder.cc}</span>
            <span>Embarcação: {operatorStop.previousOrder.boat}</span>
          </Card>

          <Card title="Ações">
            <button className={styles.dangerBtn} onClick={openRemoveModal}>
              <MdPlayCircle />
              Retirar Paralisação
            </button>

            <button className={styles.secondaryBtn} onClick={attachLastOrder}>
              <MdHistory />
              Última OF
            </button>
          </Card>
        </aside>
      </section>

      {showRemoveModal && (
        <div className={styles.overlay} onClick={closeRemoveModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <header>
              <h2>Retirar Paralisação</h2>

              <button onClick={closeRemoveModal}>
                <MdClose />
              </button>
            </header>

            <button className={styles.option} onClick={attachLastOrder}>
              <MdHistory />
              <div>
                <strong>Reatrelar última OF</strong>
                <span>Retornar para {operatorStop.previousOrder.code}</span>
              </div>
            </button>

            <button className={styles.option} onClick={attachNewOrder}>
              <MdAssignment />
              <div>
                <strong>Selecionar nova OF</strong>
                <span>Escolher uma nova ordem de produção</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {showOrderModal && (
        <div className={styles.overlay}>
          <div className={styles.orderModal}>
            <header>
              <h2>Selecionar nova OF</h2>

              <button onClick={() => setShowOrderModal(false)}>
                <MdClose />
              </button>
            </header>

            <label>Embarcação</label>

            <select
              value={selectedBoat}
              onChange={(e) => setSelectedBoat(e.target.value)}
            >
              <option value="">Selecionar embarcação</option>
              <option>Intermarine 60</option>
              <option>Intermarine 70</option>
            </select>

            <label>Área</label>

            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              <option value="">Selecionar área</option>
              <option>Laminação</option>
              <option>Montagem Final</option>
            </select>

            <h3>OFs Pendentes</h3>

            <div className={styles.orders}>
              {pendingOrders
                .filter(
                  (item) =>
                    (!selectedBoat || item.boat === selectedBoat) &&
                    (!selectedArea || item.area === selectedArea),
                )
                .map((order) => (
                  <button
                    key={order.id}
                    className={
                      selectedOrder?.id === order.id ? styles.selectedOrder : ''
                    }
                    onClick={() => setSelectedOrder(order)}
                  >
                    <strong>{order.code}</strong>
                    <span>{order.description}</span>
                    <small>{order.phase}</small>
                  </button>
                ))}
            </div>

            <button
              className={styles.confirmBtn}
              disabled={!selectedOrder}
              onClick={confirmNewOrder}
            >
              Confirmar OF
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function Info({ title, value, extra, danger }) {
  return (
    <div className={styles.info}>
      <span>{title}</span>
      <strong className={danger ? styles.red : ''}>{value}</strong>
      {extra && <small>{extra}</small>}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <section className={styles.card}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
