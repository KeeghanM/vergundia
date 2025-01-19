import { Entity } from './entity'
import type { Monster as MonsterDefinition } from '../dataFiles/monsters'
import type { ServiceContainer } from '../../../lib/serviceContainer'
import type { Player } from './player'
import { ABILITIES } from '../dataFiles/abilities'

export class Monster extends Entity {
  private definition: MonsterDefinition
  private id: string
  private level: number

  constructor(
    container: ServiceContainer,
    definition: MonsterDefinition,
    level: number,
    id: string
  ) {
    super(container, {
      damageMultiplier: 1,
      energy: {
        current: definition.baseHealth * 10,
        max: definition.baseHealth * 10,
      },
      health: {
        current: definition.baseHealth * level,
        max: definition.baseHealth * level,
      },
      healthRegen: 1,
      invisible: false,
    })

    this.definition = definition
    this.level = level
    this.id = id

    // Add monster abilities
    definition.abilities.forEach((abilityId) => {
      this.addAbility(abilityId)
    })
  }

  getId(): string {
    return this.id
  }

  getLevel(): number {
    return this.level
  }

  getDefinition(): Readonly<MonsterDefinition> {
    return this.definition
  }

  // AI decision making for monster turns
  takeTurn(player: Player) {
    // Simple AI: Use random available ability that's not on cooldown
    const availableAbilities = Array.from(this.abilities)
      .filter((abilityId) => !this.isOnCooldown(abilityId))
      .filter((abilityId) => {
        const ability = ABILITIES[abilityId]
        return this.stats.energy.current >= ability.energyCost
      })

    if (availableAbilities.length > 0) {
      const abilityId =
        availableAbilities[
          Math.floor(Math.random() * availableAbilities.length)
        ]
      this.useAbility(abilityId, player)
    }
  }
}
