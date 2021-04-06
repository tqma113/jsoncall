import fs from 'fs'
import path from 'path'

export type ModuleResolver = {
  resolve: (id: string, from: string) => string
  read: (id: string) => string
}

export const defaultModuleResolver: ModuleResolver = {
  resolve: (id, from) => {
    const fromDir = path.dirname(from)
    return path.resolve(fromDir, id)
  },
  read: (id) => {
    return fs.readFileSync(id, 'utf8')
  },
}
