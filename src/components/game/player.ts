import type { Canvas } from '../../lib/canvas'

export class Player {
  public x: number
  public y: number
  private color: string
  private symbol: string

  constructor(
    config: { x?: number; y?: number; color?: string; symbol?: string } = {}
  ) {
    this.x = config.x ?? 0
    this.y = config.y ?? 0
    this.color = config.color ?? 'red'
    this.symbol = config.symbol ?? '@'
  }

  move(dx: number, dy: number) {
    this.x += dx
    this.y += dy
  }

  draw(canvas: Canvas, centerX: number, centerY: number) {
    canvas.setColor(this.color)
    canvas.text(this.symbol, centerX, centerY)
  }

  getPosition() {
    return { x: this.x, y: this.y }
  }
}
