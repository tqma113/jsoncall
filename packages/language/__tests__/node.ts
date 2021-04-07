import fs from 'fs'
import path from 'path'
import type { ModuleResolver } from '../src'

export const nodeModuleResolver: ModuleResolver = {
  resolve: (id, from) => {
    const fromDir = path.dirname(from)
    return path.resolve(fromDir, id)
  },
  read: (id) => {
    return fs.readFileSync(id, 'utf8')
  },
}
