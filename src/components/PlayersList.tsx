import React from 'react';

import { Player } from '../types';

import { Card, Table, Tag } from 'antd';

import { TrophyOutlined } from '@ant-design/icons';

/**
 * Компонент для отображения списка игроков
 * @param {Player[]} players - массив игроков
 * @param {number} activePlayerIndex - индекс активного игрока
 * @returns {React.ReactElement} - отрендеренный компонент
 */
const PlayersList: React.FC<{ players: Player[]; activePlayerIndex: number }> = ({ players, activePlayerIndex }) => {
  const columns = [
    {
      title: 'Имя игрока',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, _record: Player, index: number) => (
        <>{index === activePlayerIndex ? <Tag color={'green'}>{text}: Сделай ход!</Tag> : text}</>
      ),
    },
    {
      title: 'Баланс (млн)',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance: number) => (
        <Tag color={balance > 15000000 ? 'green' : balance > 10000000 ? 'orange' : 'red'}>
          {(balance / 1000000).toFixed(0)} млн ({(balance / 1000).toLocaleString()} тыс.)
        </Tag>
      ),
    },
  ];

  if (players.length === 0) return null;

  return (
    <Card
      title={
        <>
          <TrophyOutlined /> Список игроков
        </>
      }
      className="players-table-card"
    >
      <Table columns={columns} dataSource={players} rowKey="id" pagination={false} size="middle" />
    </Card>
  );
};

export default PlayersList;
