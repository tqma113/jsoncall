// @ts-nocheck

// json=call

class Nest extends ObjectType {
  __typename = Literal('xxx')

  value = Number
  next = Nullable(Nest)

  __validate(input) {
    let result = super.validate(input)
    return result
  }

  __toJSON() {
    this.constuctor.name
  }
}

// farrow-schema
class Nest extends ObjectType {
  @descrioption('xxxx')
  @deprecated('xxx')
  value = Number
  next = Nullable(Nest)

  obj = Struct({
    obj1: Struct({
      value: Literal(1),
    }),
  })

  obj = {
    obj1: {
      value: {
        descrioption: 'xxx',
        [Type]: Number,
      },
    },
  }
}

Descriptor.impl(Nest, {
  value: 'xxxx',
})

Deprecated.impl()

let validateNest = Validator.get(Nest)

Validator.impl(Nest, {
  validate(input) {
    let result = validateNest?.(input)
    return result
  },
})
