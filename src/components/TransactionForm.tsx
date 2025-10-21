import React, { useState } from 'react';

import { Player } from '../types';

import { Card, Typography, Select, Row, Col, Button, InputNumber } from 'antd';
import { SwapOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

interface TransactionFormProps {
  players: Player[];
  onTransact: (fromId: number, toId: number, amount: number, name?: Player[]) => void;
}
const TransactionForm: React.FC<TransactionFormProps> = ({ players, onTransact }) => {
  const [fromId, setFromId] = useState(null);
  const [toId, setToId] = useState(null);
  const [amount, setAmount] = useState<number>(1000);

  if (players.length <= 1) return null;

  const options = players.map((player: Player) => (
    <Option key={player.id} value={player.id}>
      {player.name}
    </Option>
  ));

  const transferMoney = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (fromId && toId && amount > 0) {
      // Переводим в валюту (тысячи → миллионы)
      onTransact(fromId, toId, amount * 1000, players);
    }
  };

  return (
    <Card
      title={
        <>
          <SwapOutlined /> Перевод средств
        </>
      }
      className="transfer-card"
    >
      <form onSubmit={transferMoney}>
        <Row gutter={16} align="middle">
          <Col xs={24} sm={6}>
            <Text>От кого:</Text>
            <Select
              style={{ width: '100%' }}
              placeholder="Выберите игрока"
              value={fromId}
              onChange={(value) => setFromId(value)}
            >
              {options}
            </Select>
          </Col>

          <Col xs={24} sm={6}>
            <Text>Кому:</Text>
            <Select
              style={{ width: '100%' }}
              placeholder="Выберите игрока"
              value={toId}
              onChange={(value) => setToId(value)}
            >
              {options}
            </Select>
          </Col>

          <Col xs={24} sm={6}>
            <Text>Сумма (тыс):</Text>
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              value={amount}
              onChange={(value: number) => setAmount(value)}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Col>

          <Col xs={24} sm={6}>
            <Button type="primary" htmlType="submit" block style={{ marginTop: 22 }}>
              Перевести средства
            </Button>
          </Col>
        </Row>
      </form>
    </Card>
  );
};

export default TransactionForm;
