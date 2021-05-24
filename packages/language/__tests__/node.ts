import fs from 'fs'

export const read = (id: string) => {
  return fs.readFileSync(id, 'utf8')
}
