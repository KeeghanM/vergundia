import { Canvas } from '../../lib/canvas'
import { Player } from './player'
import { World } from './world'
import type { GameConfig } from './index.t'
import { Window } from '../../lib/window'

export class Game {
  public world: World
  public player: Player
  public canvas: Canvas

  private cellsAcross: number
  private cellsDown: number
  private isActive: boolean

  constructor(config: GameConfig) {
    this.canvas = new Canvas(config.canvasSelector, config.width, config.height)
    this.world = new World()
    this.player = new Player()
    this.cellsAcross = Math.floor(config.width / this.canvas.fontSize)
    this.cellsDown = Math.floor(config.height / this.canvas.fontSize)
    this.isActive = false

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
        if (!this.player.canMove(-1, 0, this.world)) return
        this.player.move(-1, 0)
        this.encounter()
        break
      case 'ArrowRight':
        if (!this.player.canMove(1, 0, this.world)) return
        this.player.move(1, 0)
        this.encounter()
        break
      case 'ArrowUp':
        if (!this.player.canMove(0, -1, this.world)) return
        this.player.move(0, -1)
        this.encounter()
        break
      case 'ArrowDown':
        if (!this.player.canMove(0, 1, this.world)) return
        this.player.move(0, 1)
        this.encounter()
        break
      case 'r':
        if (
          document.querySelectorAll('.ui_window[data-title="Rest now?"]')
            .length > 0
        )
          return

        new Window(
          'Rest now?',
          ['Blah blah', 'rest yes or no?'],
          [
            {
              label: 'Yes',
              color: 'green',
              function: () => {
                this.player.rest()
              },
            },
            { label: 'No', color: 'grey', function: null },
          ],
          this
        )
        break
      case 'i':
        this.player.inventory()
        break
      case 's':
        this.player.search()
        break
      default:
        return
    }

    this.draw()
  }

  private encounter() {
    const currentLocation = this.world.getTerrain(this.player.x, this.player.y)
    if (Math.random() > currentLocation.terrain.difficulty / 10) return

    this.pause()
    new Window(
      'Encounter!',
      ["You've stumbled upon a random encounter!"],
      [{ label: 'Close', color: 'grey', function: null }],
      this
    )
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

  draw() {
    const screenCenterX = Math.floor(this.cellsAcross / 2)
    const screenCenterY = Math.floor(this.cellsDown / 2)

    this.canvas.bg('black')

    // Draw world
    this.canvas.setFont(16, 'ui-monospace')
    for (let screenX = 0; screenX < this.cellsAcross; screenX++) {
      for (let screenY = 0; screenY < this.cellsDown; screenY++) {
        const { x: worldX, y: worldY } = this.screenToWorld(screenX, screenY)
        const { terrain, biomeName } = this.world.getTerrain(worldX, worldY)

        if (screenX === screenCenterX && screenY === screenCenterY) {
          // Cache players current terrain
          this.player.currentTerrain = terrain
          this.player.currentBiome = biomeName

          continue // Skip player position for rendering
        }

        this.canvas.setColor(terrain.color)
        this.canvas.text(
          terrain.label,
          screenX * this.canvas.fontSize,
          screenY * this.canvas.fontSize
        )
      }
    }

    // Draw player
    this.player.draw(
      this.canvas,
      screenCenterX * this.canvas.fontSize,
      screenCenterY * this.canvas.fontSize
    )

    // Draw UI
    const uiText = `Biome: ${this.player.currentBiome}
    Terrain: ${this.player.currentTerrain?.type}
    Energy: ${this.player.energy}/${this.player.maxEnergy}
    Health: ${this.player.health}/${this.player.maxHealth}`

    this.canvas.setColor('white')
    this.canvas.rect(
      0,
      this.canvas.height - this.canvas.fontSize * 2,
      this.canvas.width,
      this.canvas.fontSize * 2
    )
    this.canvas.setColor('black')
    this.canvas.text(uiText, 0, this.canvas.height - this.canvas.fontSize)
  }
}
