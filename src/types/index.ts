export interface Player {
  // id номер игрока
  id: number;
  // имя игрока
  name: string;
  // баланс игрока
  balance: number;
  // признак проигрыша
  lost?: boolean;
}

export interface Transaction {
  // от кого перевод
  fromId: number;
  // кому перевод
  toId: number;
  // сумма
  amount: number;
}

export interface TransactionFormProps {
  // массив игроков
  players: Player[];
  // функция перевода
  onTransact: ({ fromId, toId, amount }: Transaction) => void;
}

export interface AddPlayerFormProps {
  // добавление игрока
  onAdd: (player: Player) => void;
}
