import { useEffect, useState } from 'react';

import {
  MdRefresh,
  MdFilterList,
  MdGroups,
  MdAssignment,
  MdPersonSearch,
  MdPersonAdd,
  MdSmartToy,
  MdPlayArrow,
  MdClose,
  MdSwapHoriz,
  MdInfo,
  MdLink,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
} from 'react-icons/md';

import sugestaoAtrelamentoService from '../../Services/sugestaoAtrelamentoService';

import styles from './SugestaoAtrelamento.module.css';

function StatusBadge({ status }) {
  const statusClass =
    status === 'Em andamento'
      ? styles.emandamento
      : status === 'Pausada'
        ? styles.pausada
        : styles.paralisada;

  return <span className={`${styles.status} ${statusClass}`}>{status}</span>;
}

export default function SugestaoAtrelamento() {
  const [sugestoes, setSugestoes] = useState([]);

  const [indicadores, setIndicadores] = useState({
    totalOperadores: 0,
    sugestoesEncontradas: 0,
    ofsPendentes: 0,
    operadoresDisponiveis: 0,
    operadoresAtrelados: 0,
  });

  const [filtros, setFiltros] = useState({
    area: 'Laminação',
    embarcacao: 'Todas',
    of: '',
    operador: '',
    data: '',
  });

  const [loading, setLoading] = useState(true);

  // SELEÇÃO EM MASSA

  const [selecionados, setSelecionados] = useState([]);

  const [modalMassa, setModalMassa] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const [sugestoesData, indicadoresData] = await Promise.all([
      sugestaoAtrelamentoService.getSugestoes(),

      sugestaoAtrelamentoService.getIndicadores(),
    ]);

    setSugestoes(sugestoesData);

    setIndicadores(indicadoresData);

    setSelecionados([]);

    setLoading(false);
  }

  async function filterData() {
    const data =
      await sugestaoAtrelamentoService.getSugestoesFiltradas(filtros);

    setSugestoes(data);

    setSelecionados([]);
  }

  function toggleSelecionado(id) {
    setSelecionados((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }

      return [...prev, id];
    });
  }

  function selecionarTodos() {
    if (selecionados.length === sugestoes.length) {
      setSelecionados([]);
    } else {
      setSelecionados(sugestoes.map((item) => item.id));
    }
  }

  async function handleAtrelar(id) {
    await sugestaoAtrelamentoService.atrelarOperador(id);
  }

  async function handleIniciar(id) {
    await sugestaoAtrelamentoService.iniciarApontamento(id);
  }

  async function handleIgnorar(id) {
    await sugestaoAtrelamentoService.ignorarSugestao(id);
  }

  async function handleAtrelarMassa() {
    await sugestaoAtrelamentoService.atrelarEmMassa(selecionados);

    setSelecionados([]);

    setModalMassa(null);
  }

  async function handleIniciarMassa() {
    await sugestaoAtrelamentoService.iniciarEmMassa(selecionados);

    setSelecionados([]);

    setModalMassa(null);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <span>Sugestão de Atrelamento</span>

          <h1>Sugestões baseadas no último apontamento do dia anterior</h1>
        </div>
      </header>

      <section className={styles.filters}>
        <div>
          <label>Área</label>

          <select
            value={filtros.area}
            onChange={(e) =>
              setFiltros({
                ...filtros,
                area: e.target.value,
              })
            }
          >
            <option>Laminação</option>

            <option>Elétrica</option>

            <option>Montagem</option>

            <option>Pintura</option>
          </select>
        </div>

        <div>
          <label>Embarcação</label>

          <select
            value={filtros.embarcacao}
            onChange={(e) =>
              setFiltros({
                ...filtros,
                embarcacao: e.target.value,
              })
            }
          >
            <option>Todas</option>

            <option>INT-405</option>

            <option>INT-402</option>
          </select>
        </div>

        <div>
          <label>Número da OF</label>

          <select
            value={filtros.of}
            onChange={(e) =>
              setFiltros({
                ...filtros,
                of: e.target.value,
              })
            }
          >
            <option value="">Selecione</option>

            {sugestoes.map((item) => (
              <option key={item.id} value={item.of}>
                {item.of}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Operador</label>

          <select
            value={filtros.operador}
            onChange={(e) =>
              setFiltros({
                ...filtros,
                operador: e.target.value,
              })
            }
          >
            <option value="">Selecione</option>

            {sugestoes.map((item) => (
              <option key={item.id} value={item.operador}>
                {item.operador}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Data do último apontamento</label>

          <input
            type="date"
            value={filtros.data}
            onChange={(e) =>
              setFiltros({
                ...filtros,
                data: e.target.value,
              })
            }
          />
        </div>

        <button onClick={filterData}>
          <MdFilterList />
          Filtrar
        </button>

        <button onClick={loadData}>
          <MdRefresh />
          Atualizar
        </button>

        <button className={styles.massSelectButton} onClick={selecionarTodos}>
          {selecionados.length === sugestoes.length && sugestoes.length > 0 ? (
            <MdCheckBox />
          ) : (
            <MdCheckBoxOutlineBlank />
          )}
          Selecionar em Massa
        </button>
      </section>

      {selecionados.length > 0 && (
        <section className={styles.massActions}>
          <div>
            <strong>{selecionados.length}</strong>
            operadores selecionados
          </div>

          <button
            className={styles.primary}
            onClick={() => setModalMassa('atrelar')}
          >
            <MdLink />
            Atrelar Selecionados
          </button>

          <button onClick={() => setModalMassa('apontamento')}>
            <MdPlayArrow />
            Iniciar Apontamento
          </button>

          <button onClick={() => setSelecionados([])}>
            <MdClose />
            Limpar Seleção
          </button>
        </section>
      )}

      <section className={styles.cards}>
        <article>
          <MdGroups />

          <span>Total de Operadores</span>

          <strong>{indicadores.totalOperadores}</strong>
        </article>

        <article>
          <MdPersonSearch />

          <span>Sugestões Encontradas</span>

          <strong>{indicadores.sugestoesEncontradas}</strong>
        </article>

        <article>
          <MdAssignment />

          <span>OFs Pendentes</span>

          <strong>{indicadores.ofsPendentes}</strong>
        </article>

        <article>
          <MdGroups />

          <span>Operadores Disponíveis</span>

          <strong>{indicadores.operadoresDisponiveis}</strong>
        </article>

        <article>
          <MdPersonAdd />

          <span>Operadores Já Atrelados</span>

          <strong>{indicadores.operadoresAtrelados}</strong>
        </article>
      </section>

      <section className={styles.tableBox}>
        {loading ? (
          <p>Carregando sugestões...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      selecionados.length === sugestoes.length &&
                      sugestoes.length > 0
                    }
                    onChange={selecionarTodos}
                  />
                </th>

                <th>Operador</th>

                <th>Embarcação / OF</th>

                <th>Descrição da OF</th>

                <th>Último Trabalho</th>

                <th>Tempo Trabalhado</th>

                <th>Status da OF</th>

                <th>Sugestão do Sistema</th>

                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {sugestoes.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selecionados.includes(item.id)}
                      onChange={() => toggleSelecionado(item.id)}
                    />
                  </td>

                  <td>
                    <div className={styles.operatorInfo}>
                      <div className={styles.operatorAvatar}>
                        {item.operador.charAt(0)}
                      </div>

                      <div>
                        <strong>{item.operador}</strong>

                        <small>RA: {item.ra}</small>

                        <small>{item.cargo}</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <strong>{item.embarcacao}</strong>

                    <small>{item.of}</small>
                  </td>

                  <td>{item.descricao}</td>

                  <td>
                    <strong>{item.ultimoApontamento.data}</strong>

                    <small>Início: {item.ultimoApontamento.inicio}</small>

                    <small>Fim: {item.ultimoApontamento.fim}</small>
                  </td>

                  <td>{item.tempo}</td>

                  <td>
                    <StatusBadge status={item.status} />
                  </td>

                  <td>
                    <div className={styles.suggestion}>
                      <MdSmartToy />

                      <p>
                        {item.sugestao.descricao}

                        <br />

                        <small>{item.sugestao.prioridade}</small>
                      </p>
                    </div>
                  </td>

                  <td className={styles.actions}>
                    <button
                      className={styles.primary}
                      onClick={() => handleAtrelar(item.id)}
                    >
                      <MdLink />
                      Atrelar Operador
                    </button>

                    <button onClick={() => handleIniciar(item.id)}>
                      <MdPlayArrow />
                      Iniciar Apontamento
                    </button>

                    <button onClick={() => handleIgnorar(item.id)}>
                      <MdClose />
                      Ignorar Sugestão
                    </button>

                    <button>
                      <MdSwapHoriz />
                      Atrelar em Outra OF
                    </button>

                    <button>
                      <MdInfo />
                      Detalhes da OF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {modalMassa && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>
              {modalMassa === 'atrelar'
                ? 'Atrelar Operadores'
                : 'Iniciar Apontamento'}
            </h2>

            <p>
              Você selecionou
              <strong> {selecionados.length} </strong>
              operadores.
            </p>

            <div className={styles.modalActions}>
              <button onClick={() => setModalMassa(null)}>Cancelar</button>

              <button
                className={styles.primary}
                onClick={
                  modalMassa === 'atrelar'
                    ? handleAtrelarMassa
                    : handleIniciarMassa
                }
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
