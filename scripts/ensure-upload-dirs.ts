import { mkdir } from 'fs/promises'
import { join } from 'path'

async function ensureDirectories() {
  const dirs = [
    join(process.cwd(), 'public', 'team'),
    join(process.cwd(), 'public', 'products'),
  ]

  for (const dir of dirs) {
    try {
      await mkdir(dir, { recursive: true })
      console.log(`Created directory: ${dir}`)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
        console.error(`Error creating directory ${dir}:`, error)
      }
    }
  }
}

ensureDirectories() 