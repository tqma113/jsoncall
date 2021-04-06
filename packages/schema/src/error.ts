export class SchemaError extends Error {
  kind = 'Error' as const

  constructor(message: string, moduleId: string) {
    super(message)

    this.name = 'SchemaError'
    this.message = `${message} at: ${moduleId}`
  }
}
