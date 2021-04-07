import { Schema, createSchema, createSchemaModule } from './schema'

export type ExistChecker = (id: string) => boolean
export type Namer = (prev: string, isExist: ExistChecker) => string

export const rename = (prev: Schema, getName: Namer): Schema => {
  const moduleIdMap: Map<string, string> = new Map()

  const isExist: ExistChecker = (name) => {
    return Array.from(moduleIdMap.values()).includes(name)
  }

  const schema = createSchema(prev.entry)

  prev.modules.forEach((module) => {
    moduleIdMap.set(module.id, getName(module.id, isExist))

    // clone module
    const newModule = createSchemaModule(module.id)
    newModule.typeDefinations = [...module.typeDefinations]
    newModule.deriveDefinations = [...module.deriveDefinations]
    newModule.callDefinations = [...module.callDefinations]
    newModule.exportDefination = module.exportDefination
    newModule.linkDefinations = [...module.linkDefinations]

    schema.modules.push(newModule)
  })

  for (let [prev, current] of moduleIdMap.entries()) {
    if (schema.entry === prev) {
      schema.entry = current
    }

    schema.modules.forEach((module) => {
      if (module.id === prev) {
        module.id = current
      }

      module.linkDefinations.forEach((linkDefination) => {
        if (linkDefination.from === prev) {
          linkDefination.from = current
        }
      })
    })
  }

  return schema
}
