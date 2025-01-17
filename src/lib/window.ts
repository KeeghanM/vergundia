import type { Game } from '../components/game/game'
import type { Button } from '../components/game/index.t'

export class Window {
  public x = 0
  public y = 0

  private element: HTMLDivElement
  private dragging = false
  private startX = 0
  private startY = 0
  private startMouseX = 0
  private startMouseY = 0

  constructor(title: string, content: string[], buttons: Button[], game: Game) {
    this.element = this.createElement(title, game)

    this.setupText(title, content)
    this.setupButtons(buttons, game)
    this.setupDragHandler()
    game.canvas.container!.append(this.element)

    this.setPosition(
      game.canvas.width / 2 - this.element.clientWidth / 2,
      game.canvas.height / 2 - this.element.clientHeight / 2
    )
  }
  private createElement(title: string, game: Game) {
    const elem = document.createElement('div')
    elem.style.minWidth = `${300}px`
    elem.style.minHeight = `${200}px`
    elem.style.maxWidth = `${game.canvas.width * 0.8}px`
    elem.style.maxHeight = `${game.canvas.height * 0.8}px`
    elem.setAttribute('data-title', title)

    return elem
  }

  private setupText(title: string, content: string[]) {
    this.element.classList.add('ui_window')

    const titleElem = document.createElement('h2')
    titleElem.innerText = title
    this.element.appendChild(titleElem)

    const textElem = document.createElement('p')
    textElem.innerHTML = content.join('<br />')
    this.element.appendChild(textElem)
  }

  private setupButtons(buttons: Button[], game: Game) {
    const btnContainerElem = document.createElement('div')
    buttons.map((b) => {
      const btnElem = document.createElement('button')
      btnElem.innerText = b.label
      btnElem.addEventListener('click', () => {
        if (b.function) b.function()

        game.resume()
        game.draw()
        this.element.remove()
      })
      btnContainerElem.append(btnElem)
    })
    this.element.appendChild(btnContainerElem)
  }

  private setPosition(x: number, y: number) {
    this.x = x
    this.y = y
    this.element.style.left = `${x}px`
    this.element.style.top = `${y}px`
  }

  private setupDragHandler() {
    this.element.addEventListener('mousedown', (e) => {
      this.dragging = true
      this.startX = this.x
      this.startY = this.y
      this.startMouseX = e.screenX
      this.startMouseY = e.screenY
    })

    this.element.addEventListener('mouseup', () => {
      this.dragging = false
    })

    this.element.addEventListener('mousemove', (e) => {
      if (!this.dragging) return

      const dx = e.screenX - this.startMouseX
      const dy = e.screenY - this.startMouseY

      this.setPosition(this.startX + dx, this.startY + dy)
    })
  }
}
