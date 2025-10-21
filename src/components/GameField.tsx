import React, { useState } from 'react';

import { Button, message } from 'antd';

import { Player } from '../types';

interface GameFieldProps {
  players: Player[];
  // Обновление игроков
  onUpdatePlayers: (updatedPlayers: Player[]) => void;
  // Установка активного игрока
  onSetActivePlayerIndex: (activePlayerIndex: number) => void;
  // Обработчик ушедшего игрока
  onEliminate?: (player: Player) => void;
}

/**
 * Компонент для отображения игрового поля
 * @param {GameFieldProps} props - объект с функцией для обновления игроков и активного игрока
 * @returns {React.ReactElement} - отрендеренный компонент
 */
const GameField: React.FC<GameFieldProps> = ({ players, onUpdatePlayers, onSetActivePlayerIndex, onEliminate }) => {
  // Индекс активного игрока
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);

  if (players.length === 0) return null;

  // Генерация числа от 10000 до 15 млн
  const rollDice = () => (Math.random() * 15_000_000 + 10000) | 0;

  const nextIndex = (prevIndex: number) => (prevIndex + 1) % players.length;

  const simulateTurn = () => {
    const updatedPlayers = [...players];
    // Получаем текущего игрока
    const currentPlayer = updatedPlayers[activePlayerIndex];

    const change = rollDice();
    // Определяем знак изменения (+/-)
    let delta = Math.random() > 0.5 ? change : -change;

    // расчет лимита на основе количества игроков
    const totalBalance = updatedPlayers.reduce((sum, p) => sum + p.balance, 0);

    // расчет банка
    const cap = 15_000_000 * updatedPlayers.length;

    // результирующий баланс не превышает лимит
    if (delta > 0 && totalBalance + delta > cap) {
      delta = cap - totalBalance;
    }

    // проверка на достаточность средств у игрока для следующего хода
    const proposedBalance = currentPlayer?.balance + delta;
    if (proposedBalance <= -5_000_000) {
      if (typeof onEliminate === 'function') onEliminate(currentPlayer);
      else message.info(currentPlayer.name + ' выбыл из игры');
      return;
    }

    // Изменяем баланс игрока
    if (currentPlayer) currentPlayer.balance = proposedBalance;

    // Отправляем новые значения игроков
    onUpdatePlayers(updatedPlayers);

    // Переходим к следующему
    const next = nextIndex(activePlayerIndex);
    setActivePlayerIndex(next);
    // Устанавливаем активного игрока
    onSetActivePlayerIndex(next);
  };

  return (
    <div className="game-field">
      <h2>Сделай ход:</h2>
      <Button size="large" onClick={simulateTurn}>
        Бросай кубик!
      </Button>
    </div>
  );
};

export default GameField;
