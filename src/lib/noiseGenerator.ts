import { createNoise2D } from 'simplex-noise'

type NoiseConfig = {
  scale: number
  influence?: number
}

export class NoiseGenerator {
  noise: ReturnType<typeof createNoise2D>
  scale: number
  influence: number

  constructor(config: NoiseConfig) {
    this.noise = createNoise2D()
    this.scale = config.scale
    this.influence = config.influence ?? 1
  }

  getValue(x: number, y: number): number {
    return this.noise(x * this.scale, y * this.scale) * this.influence
  }
}
