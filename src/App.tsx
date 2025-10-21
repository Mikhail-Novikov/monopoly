import React, { useEffect, useState } from 'react';

import { Layout, Typography, message, Row, Col, Card, Space, Button, Modal } from 'antd';
import { TrophyOutlined, ReloadOutlined, PlayCircleOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title } = Typography;

import AddPlayerForm from './components/AddPlayerForm';
import PlayersList from './components/PlayersList';
import TransactionsHistory from './components/TransactionsHistory';
import TransactionForm from './components/TransactionForm';
import StatGame from './components/StatGame';
import GameField from './components/GameField';

import { Player } from './types';

import './assets/normalize.css';
import './assets/app.css';
import './assets/main.css';

const initialPlayers: Player[] = [];

function App() {
  const [players, setPlayers] = useState(() => {
    const savedPlayers = JSON.parse(localStorage.getItem('monopolyPlayers'));
    if (Array.isArray(savedPlayers) && savedPlayers.length > 0) {
      return savedPlayers;
    }
    // Начинаем с чистого листа
    return initialPlayers;
  });

  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [suppressLocalStorage, setSuppressLocalStorage] = useState(false);
  const [continueModalVisible, setContinueModalVisible] = useState(false);
  const [savedPlayers, setSavedPlayers] = useState(null);

  useEffect(() => {
    if (!suppressLocalStorage) {
      localStorage.setItem('monopolyPlayers', JSON.stringify(players));
    }
  }, [players, suppressLocalStorage]);

  // При перезагрузке попросите продолжить сохраненную игру
  useEffect(() => {
    try {
      const raw = localStorage.getItem('monopolyPlayers');
      const parsed = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed) && parsed.length > 0) {
        setSavedPlayers(parsed);
        setContinueModalVisible(true);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // возвращаемся к исходному состоянию игроков, очищаем историю событий
  const resetGame = () => {
    setSuppressLocalStorage(true);
    setPlayers(initialPlayers);
    setEvents([]);
    setTimeout(() => setSuppressLocalStorage(false), 0);
  };

  const continueSavedGame = () => {
    if (Array.isArray(savedPlayers) && savedPlayers.length > 0) {
      setPlayers(savedPlayers);
      setContinueModalVisible(false);
      setSavedPlayers(null);
    } else {
      startNewGame();
    }
  };

  const startNewGame = () => {
    localStorage.removeItem('monopolyPlayers');
    setPlayers(initialPlayers);
    setEvents([]);
    setContinueModalVisible(false);
    setSavedPlayers(null);
  };

  const richestPlayer = players.sort((a, b) => b.balance - a.balance)[0];
  const totalBalance = players.reduce((total, player) => total + player.balance, 0);

  return (
    <Layout className="monopoly-layout">
      <Modal
        title="Продолжить ранее сохранённую игру?"
        open={continueModalVisible}
        onOk={continueSavedGame}
        onCancel={startNewGame}
        okText="Продолжить"
        cancelText="Начать заново"
      >
        <p>Найдено сохранение игры. Выберите продолжить или начать заново.</p>
      </Modal>

      <Header className="monopoly-header">
        <div className="header-content">
          <Title level={2} className="game-title">
            <TrophyOutlined /> Монополия
          </Title>
        </div>
      </Header>

      <Content className="monopoly-content">
        <div className="game-container">
          <Row gutter={[24, 24]}>
            <AddPlayerForm
              onAdd={(newPlayer) => {
                // добавляем игрока
                setPlayers([...players, newPlayer]);
                // фиксируем событие
                setEvents([...events, { type: 'ADD_PLAYER', data: newPlayer }]);
              }}
            />
            <StatGame players={players} richestPlayer={richestPlayer} totalBalance={totalBalance} />
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <PlayersList players={players} activePlayerIndex={activePlayerIndex} />
            </Col>
            <Col xs={24} lg={8}>
              <Card title={<><PlayCircleOutlined />{' '}<>Управление игрой</></>} className="game-control-card">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <GameField
                    players={players}
                    onUpdatePlayers={setPlayers}
                    onSetActivePlayerIndex={setActivePlayerIndex}
                    onEliminate={({ id: playerId, name }) => {
                      const updatedPlayers = players.filter((p) => p.id !== playerId);
                      setPlayers(updatedPlayers);
                      setEvents([...events, { type: 'ELIMINATED', data: name }]);
                    }}
                  />
                </Space>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button type="primary" danger block icon={<ReloadOutlined />} onClick={resetGame}>
                    Сброс игры
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>

          <TransactionsHistory events={events} players={players} />

          <TransactionForm
            players={players}
            onTransact={(fromId, toId, amount) => {
              if (!fromId || !toId || amount <= 0) {
                message.error('Заполните все поля для перевода!');
                return;
              }

              if (fromId === toId) {
                message.error('Нельзя переводить самому себе!');
                return;
              }

              const fromPlayer = players.find((p) => p.id === fromId);

              if (fromPlayer.balance < amount) {
                message.error('Недостаточно средств для перевода!');
                return;
              }

              const updatedPlayers = [...players];
              const fromIndex = updatedPlayers.findIndex((p) => p.id === fromId);
              const toIndex = updatedPlayers.findIndex((p) => p.id === toId);

              if (updatedPlayers[fromIndex]?.balance - amount >= -5_000_000) {
                updatedPlayers[fromIndex].balance -= amount;
                updatedPlayers[toIndex].balance += amount;

                const eliminated = updatedPlayers.filter((p) => p.balance <= -5_000_000);
                const nextPlayers = updatedPlayers.filter((p) => p.balance > -5_000_000);

                // обновляем игроков
                setPlayers(nextPlayers);

                // событие перевода
                let newEvents = [...events, { type: 'TRANSACTION', data: { fromId, toId, amount } }];

                if (eliminated.length > 0) {
                  const elimEvents = eliminated.map((p) => ({
                    type: 'ELIMINATED',
                    data: { id: p.id, name: p.name },
                  }));
                  newEvents = newEvents.concat(elimEvents);
                }
                setEvents(newEvents);
              } else {
                alert('Недостаточно средств!');
              }
            }}
          />
        </div>
      </Content>
    </Layout>
  );
}

export default App;
