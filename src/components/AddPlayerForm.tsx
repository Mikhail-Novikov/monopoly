import React, { useState } from 'react';

import { Card, Input, Button, Space, Col } from 'antd';
import { UserAddOutlined, PlayCircleOutlined } from '@ant-design/icons';

import { AddPlayerFormProps } from '../types';

/**
 * Форма для добавления игрока
 *
 * @param {AddPlayerFormProps} пропсы формы
 * @returns {React.ReactElement} - компонент формы
 */
const AddPlayerForm: React.FC<AddPlayerFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const ts = Date.now();
  const suffix = ts.toString(36).slice(-4);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim() !== '') {
      const newPlayer = {
        id: ts,
        name: name.trim() + ' ' + `(id:${suffix})`,
        balance: 15_000_000,
      };
      onAdd(newPlayer);
      setName('');
    }
  };

  const handleAutoAdd = () => {
    const newPlayer = {
      id: ts,
      name: `Игрок (id:${suffix}) `,
      balance: 15_000_000,
    };
    onAdd(newPlayer);
  };

  return (
    <Col xs={24} lg={12}>
      <Card
        title={
          <>
            <UserAddOutlined /> Управление игроками
          </>
        }
        className="control-card"
      >
        <Space direction="vertical" className='width-100'>
          <form className="add-player-section">
            <Space.Compact className='width-100'>
              <Input
                placeholder="Имя игрока"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onPressEnter={handleSubmit}
              />
              <Button type="primary" onClick={handleSubmit}>
                Добавить игрока
              </Button>
            </Space.Compact>
          </form>
          <Button type="dashed" block onClick={handleAutoAdd} icon={<PlayCircleOutlined />}>
            Автоматически добавить игрока
          </Button>
        </Space>
      </Card>
    </Col>
  );
};

export default AddPlayerForm;
