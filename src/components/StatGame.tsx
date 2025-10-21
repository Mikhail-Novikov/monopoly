import React from 'react';

import { Card, Typography, Tag, Row, Col, Statistic } from 'antd';
import { UserAddOutlined, DollarOutlined, BankOutlined } from '@ant-design/icons';

const { Text } = Typography;

import { Player } from '../types';

interface StatGameProps {
  // игроки
  players: Player[];
  // лидер
  richestPlayer: Player | null;
  // общий капитал
  totalBalance: number;
}

const StatGame: React.FC<StatGameProps> = ({ players, richestPlayer, totalBalance }) => {
  return (
    <Col xs={24} lg={12}>
      <Card
        title={
          <>
            <DollarOutlined /> Статистика игры
          </>
        }
        className="stats-card"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Statistic title="Всего игроков" value={players?.length} prefix={<UserAddOutlined />} />
          </Col>
          <Col span={12}>
            <Statistic title="Общий капитал" value={totalBalance / 1000000} suffix="млн" prefix={<BankOutlined />} />
          </Col>
        </Row>
        {richestPlayer && (
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">Лидер: </Text>
            <Tag color="gold">{richestPlayer.name}</Tag>
          </div>
        )}
      </Card>
    </Col>
  );
};

export default StatGame;
