import React from 'react';

import { Card, Typography, Timeline } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';
import { Player } from '../types';
const { Text } = Typography;

interface Transaction {
  type: string;
  players: Player[];
  data: {
    fromId?: number;
    toId?: number;
    name?: string;
    balance?: number;
    amount?: number;
    id?: number;
  };
}

/**
 * История операций.
 * @param {Transaction[]} events - массив событий
 * @param {Player[]} players - массив игроков
 * @component TransactionsHistory
 */
const TransactionsHistory: React.FC<{ events: Transaction[]; players: Player[] }> = ({ events, players }) => {
  if (!events || events.length === 0) return null;

  return (
    <Card
      title={
        <>
          <HistoryOutlined /> История операций
        </>
      }
      className="history-card"
    >
      <Timeline
        items={events.slice(0, 10).map((entry) => {
          // добавление игрока
          const isAdd = entry.type === 'ADD_PLAYER';
          // признак действия - игрок выбыл
          const isEliminated = entry.type === 'ELIMINATED';
          // название игрока
          const resolveName = (id: number) => {
            const p = players.find((player) => player.id === id);
            return p?.name ?? `Игрок ${id}`;
          };
          const fromName = resolveName(entry.data.fromId);

          const toName = players.find((p) => p.id === entry.data.toId)?.name ?? `Игрок ${entry.data.toId ?? ''}`;
          const elimName = `${entry.data ?? ''}`;

          return {
            color: isAdd ? 'green' : isEliminated ? 'red' : 'blue',
            children: (
              <div>
                {isEliminated ? (
                  <Text>{elimName} выбыл из игры</Text>
                ) : isAdd ? (
                  <Text>
                    Добавлен: {entry.data.name}, баланс: {(entry.data.balance ?? 0) / 1_000_000} млн руб.
                  </Text>
                ) : (
                  <>
                    <Text>{fromName}</Text>
                    <Text> перевел игроку </Text>
                    <Text>{toName}</Text>
                    <Text> сумму: {(entry.data.amount ?? 0) / 1_000_000} млн руб.</Text>
                  </>
                )}
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {new Date().toLocaleString()}
                </Text>
              </div>
            ),
          };
        })}
      />
    </Card>
  );
};

export default TransactionsHistory;
