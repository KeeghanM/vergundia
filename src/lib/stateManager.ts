import type { GameState, Subscriber } from '../components/game/index.t'

export class StateManager {
  private state: GameState
  private subscribers: Set<Subscriber> = new Set()

  constructor(initialState: GameState) {
    this.state = initialState
  }

  getState(): Readonly<GameState> {
    return Object.freeze({ ...this.state })
  }

  subscribe(callback: Subscriber) {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  private notify() {
    this.subscribers.forEach((subscriber) => subscriber(this.getState()))
  }

  dispatch<K extends keyof GameState>(
    section: K,
    update: Partial<GameState[K]>
  ) {
    this.state = {
      ...this.state,
      [section]: {
        ...this.state[section],
        ...update,
      },
    }
    this.notify()
  }

  // Helper methods for common state updates
  updatePlayerPosition(x: number, y: number) {
    this.dispatch('player', {
      position: { x, y },
    })
  }

  updatePlayerStats(stats: Partial<GameState['player']>) {
    this.dispatch('player', stats)
  }

  updateWorldState(update: Partial<GameState['world']>) {
    this.dispatch('world', update)
  }

  togglePause() {
    this.dispatch('ui', {
      isPaused: !this.state.ui.isPaused,
    })
  }
}
