# Vergundia

A classic browser-based horror roguelike game built with TypeScript and Astro.

## Overview

Vergundia is a text-based roguelike adventure set in a horror-themed world. The game features procedurally generated terrain, a complex biome system, and challenging monster encounters.

## Features

- Procedurally generated world with diverse biomes and terrain types
- Turn-based gameplay
- Energy and health management system
- Monster encounters with various abilities and attributes
- Item collection and progression
- Condition system (status effects)

## Controls

- **Arrow Keys**: Move your character
- **R**: Rest and recover
- **I**: Open inventory
- **S**: Search the area
- **H** or **Esc**: Help menu

## Development

The game is built using:

- TypeScript for game logic
- Astro framework for UI components
- HTML Canvas for rendering

## Project Structure

- `/entity`: Player, monster, and entity classes
- `/dataFiles`: Game data like abilities, conditions, monsters, and items
- `/lib`: Core utilities (canvas, event system, state management)
- `/terrainSystem`: World generation and biome management

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Build for production with `npm run build`
