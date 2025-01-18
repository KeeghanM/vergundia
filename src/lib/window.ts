import type { ServiceContainer } from './serviceContainer'
import { EventSystem } from './eventSystem'
import { Canvas } from './canvas'
import {
  GameEvents,
  type Button,
  type WindowData,
} from '../components/game/index.t'

export class Window {
  public x = 0
  public y = 0

  private element: HTMLDivElement
  private dragging = false
  private startX = 0
  private startY = 0
  private startMouseX = 0
  private startMouseY = 0
  private container: ServiceContainer

  constructor(windowData: WindowData, container: ServiceContainer) {
    this.container = container
    const canvas = this.container.get<Canvas>('canvas')

    this.element = this.createElement(windowData.title)
    this.setupText(windowData.title, windowData.content)
    this.setupButtons(windowData.buttons)
    this.setupDragHandler()

    canvas.container!.append(this.element)

    // Center the window
    this.setPosition(
      canvas.width / 2 - this.element.clientWidth / 2,
      canvas.height / 2 - this.element.clientHeight / 2
    )
  }

  private createElement(title: string) {
    const canvas = this.container.get<Canvas>('canvas')
    const elem = document.createElement('div')
    elem.style.minWidth = `${300}px`
    elem.style.minHeight = `${200}px`
    elem.style.maxWidth = `${canvas.width * 0.8}px`
    elem.style.maxHeight = `${canvas.height * 0.8}px`
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

  private setupButtons(buttons: Button[]) {
    const events = this.container.get<EventSystem>('events')
    const btnContainerElem = document.createElement('div')

    buttons.forEach((button) => {
      const btnElem = document.createElement('button')
      btnElem.innerText = button.label
      btnElem.addEventListener('click', () => {
        if (button.function) button.function()

        // Emit window close event
        events.emit(GameEvents.WINDOW_CLOSE)
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
