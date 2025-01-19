export class ServiceContainer {
  private services: Map<string, unknown> = new Map()

  register(name: string, service: unknown) {
    this.services.set(name, service)
  }

  get<T>(name: string): T {
    if (!this.services.has(name)) {
      throw new Error(`Service ${name} not found`)
    }
    return this.services.get(name) as T
  }
}
