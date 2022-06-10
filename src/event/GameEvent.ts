class GameEvent {
  name: string;
  clientTime: number;
  keys: any = {};

  constructor(name: string, clientTime: number) {
    this.name = name;
    this.clientTime = clientTime;
  }
}

export default GameEvent;