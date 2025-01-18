import type { EventMap, GameEventKey } from '../components/game/index.t'

type EventCallback<K extends GameEventKey> = (data: EventMap[K]) => void

export class EventSystem {
  private events: Map<GameEventKey, Set<EventCallback<GameEventKey>>> =
    new Map()

  on<K extends GameEventKey>(event: K, callback: EventCallback<K>) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }
    // Need to cast here because TypeScript can't verify the type relationship
    // between the specific K and the general GameEventKey
    this.events.get(event)?.add(callback as EventCallback<GameEventKey>)
    return () => this.off(event, callback)
  }

  off<K extends GameEventKey>(event: K, callback: EventCallback<K>) {
    // Same cast needed here
    this.events.get(event)?.delete(callback as EventCallback<GameEventKey>)
  }

  emit<K extends GameEventKey>(event: K, data?: EventMap[K]) {
    this.events.get(event)?.forEach((callback) => {
      // Cast the callback to the specific type for this event
      ;(callback as EventCallback<K>)(data!)
    })
  }
}
