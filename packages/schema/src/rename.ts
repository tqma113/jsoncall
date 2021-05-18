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
    newModule.typeDefinitions = [...module.typeDefinitions]
    newModule.deriveDefinitions = [...module.deriveDefinitions]
    newModule.callDefinitions = [...module.callDefinitions]
    newModule.exportDefinition = module.exportDefinition
    newModule.linkDefinitions = [...module.linkDefinitions]

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

      module.linkDefinitions.forEach((linkDefination) => {
        if (linkDefination.from === prev) {
          linkDefination.from = current
        }
      })
    })
  }

  return schema
}
