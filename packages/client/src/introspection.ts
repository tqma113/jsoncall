import { Schema, check } from 'jc-schema'
import { name as getName, validate, convert, ConvertError } from 'jc-builder'
import { IntrospectionCalling, IntrospectionCallingOutputType } from 'jc-server'
import { Serialize, Deserialize, SerializationError } from 'jc-serialization'
import { SendError } from './error'
import type { Sender } from './sender'

export const introspection = async (
  send: Sender,
  serialize: Serialize<object>,
  deserialize: Deserialize<object>
): Promise<Schema> => {
  const callingInput = serialize(IntrospectionCalling())

  try {
    const output = await send(callingInput)
    try {
      const outputObject = deserialize(output)
      const validateResult = validate(
        IntrospectionCallingOutputType,
        outputObject
      )
      if (validateResult === true) {
        try {
          const output = convert(IntrospectionCallingOutputType, outputObject)
          const schema = output.output as Schema
          const checkResult = check(schema)
          if (checkResult === null) {
            return schema
          } else {
            throw checkResult
          }
        } catch (err) {
          throw new ConvertError(err instanceof Error ? err.message : JSON.stringify(err), getName(IntrospectionCallingOutputType))
        }
      } else {
        throw validateResult
      }
    } catch (err) {
      throw new SerializationError(err instanceof Error ? err : new Error(JSON.stringify(err)), output)
    }
  } catch (err) {
    throw new SendError(err instanceof Error ? err.message : JSON.stringify(err))
  }
}
