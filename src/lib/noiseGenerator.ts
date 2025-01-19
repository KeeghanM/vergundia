import { createNoise2D } from 'simplex-noise'
import alea from 'alea'

type NoiseConfig = {
  seed?: string
  scale: number
  influence?: number
}

export class NoiseGenerator {
  noise: ReturnType<typeof createNoise2D>
  scale: number
  influence: number

  constructor(config: NoiseConfig) {
    this.noise = createNoise2D(alea(config.seed ?? Math.random()))
    this.scale = config.scale
    this.influence = config.influence ?? 1
  }

  getValue(x: number, y: number): number {
    return this.noise(x * this.scale, y * this.scale) * this.influence
  }
}
