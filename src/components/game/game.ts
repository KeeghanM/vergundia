import type { Canvas } from '../../lib/canvas'
import type { GameConfig } from './index.t'
import { Player } from './player'
import type { World } from './world'

export class Game {
  private canvas: Canvas
  private world: World
  private player: Player
  private cellsAcross: number
  private cellsDown: number
  private isActive: boolean
  private centerX: number
  private centerY: number

  constructor(config: GameConfig) {
    this.canvas = config.canvas
    this.world = config.world
    this.player = new Player()
    this.cellsAcross = Math.floor(config.width / this.canvas.fontSize)
    this.cellsDown = Math.floor(config.height / this.canvas.fontSize)
    this.isActive = false
    this.centerX = Math.round(config.width / 2)
    this.centerY = Math.round(config.height / 2)

    this.setupEventListeners()
  }

  private setupEventListeners() {
    document.addEventListener('keydown', this.handleKeyPress.bind(this))
    // Clean up on destroy
    this.destroy = () => {
      document.removeEventListener('keydown', this.handleKeyPress.bind(this))
    }
  }

  private handleKeyPress(e: KeyboardEvent) {
    if (!this.isActive) return

    switch (e.key) {
      case 'ArrowLeft':
        this.player.move(-1, 0)
        break
      case 'ArrowRight':
        this.player.move(1, 0)
        break
      case 'ArrowUp':
        this.player.move(0, -1)
        break
      case 'ArrowDown':
        this.player.move(0, 1)
        break
      default:
        return
    }

    this.draw()
  }

  start() {
    this.isActive = true
    this.draw()
  }

  pause() {
    this.isActive = false
  }

  resume() {
    this.isActive = true
  }

  destroy() {
    // Will be replaced by setupEventListeners
  }

  private screenToWorld(screenX: number, screenY: number) {
    const { x: playerX, y: playerY } = this.player.getPosition()
    const screenCenterX = Math.floor(this.cellsAcross / 2)
    const screenCenterY = Math.floor(this.cellsDown / 2)

    return {
      x: screenX - screenCenterX + playerX,
      y: screenY - screenCenterY + playerY,
    }
  }

  private worldToScreen(worldX: number, worldY: number) {
    const { x: playerX, y: playerY } = this.player.getPosition()
    const screenCenterX = Math.floor(this.cellsAcross / 2)
    const screenCenterY = Math.floor(this.cellsDown / 2)

    return {
      x: worldX - playerX + screenCenterX,
      y: worldY - playerY + screenCenterY,
    }
  }

  private draw() {
    const screenCenterX = Math.floor(this.cellsAcross / 2)
    const screenCenterY = Math.floor(this.cellsDown / 2)

    this.canvas.bg('black')

    // Draw world
    this.canvas.setFont(16, 'ui-monospace')
    for (let screenX = 0; screenX < this.cellsAcross; screenX++) {
      for (let screenY = 0; screenY < this.cellsDown; screenY++) {
        if (screenX === screenCenterX && screenY === screenCenterY) continue

        const { x: worldX, y: worldY } = this.screenToWorld(screenX, screenY)
        const { terrain } = this.world.getTerrain(worldX, worldY)

        this.canvas.setColor(terrain.color)
        this.canvas.text(
          terrain.label,
          screenX * this.canvas.fontSize,
          screenY * this.canvas.fontSize
        )
      }
    }

    // Draw player
    this.canvas.setFont(16, 'ui-monospace', 'bold')
    this.player.draw(
      this.canvas,
      screenCenterX * this.canvas.fontSize,
      screenCenterY * this.canvas.fontSize
    )

    // Draw UI
    const { x: playerX, y: playerY } = this.player.getPosition()
    this.drawUI(playerX, playerY)
  }

  private drawUI(playerX: number, playerY: number) {
    const playerTerrain = this.world.getTerrain(playerX, playerY)
    const uiText = `Biome: ${playerTerrain.biomeName}
    Terrain: ${playerTerrain.terrain.type}`
    const lines = uiText.split('\n').length

    this.canvas.setColor('white')
    this.canvas.rect(
      0,
      this.canvas.height - this.canvas.fontSize * lines,
      this.canvas.width,
      this.canvas.fontSize * lines
    )
    this.canvas.setColor('black')
    this.canvas.text(uiText, 0, this.canvas.height - this.canvas.fontSize)
  }
}
