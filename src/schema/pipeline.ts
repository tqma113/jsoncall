export type Produce<I = any, O = any> = (input: I) => O
export type ProduceO<O> = <I>(input: I) => O
export type Output<P extends Produce> = P extends ProduceO<infer O> ? O : never
export type Pipe<I> = <P extends Produce, O = Output<P>>(
  produce: P
) => Pipeline<I, O>
export type Run<I, O> = (input: I) => O
export type Pipeline<I, O> = {
  pipe: Pipe<I>
  produce: Produce<I, O>
}

export const createPurePipeline = <I, O>(
  produce: Produce<I, O>
): Pipeline<I, O> => {
  return {
    pipe: (nextProduce) => {
      return createPurePipeline((input: I) => nextProduce(produce(input)))
    },
    produce,
  }
}

export type ProduceE<I = any, O = any, E = never> = (input: I) => O | E
export type PipelineE<I, O, E> = {
  pipe: Pipe<I>
  produce: ProduceE<I, O, E>
}
export type Validate<E> = (input: any) => input is E

const alwaysTrue: Validate<any> = (input: any): input is Error =>
  false as boolean

export const createPipeline = <I, O, E>(
  produce: ProduceE<I, O, E>,
  isE: Validate<E> = alwaysTrue
): PipelineE<I, O, E> => {
  return {
    pipe: (nextProduce) => {
      return createPipeline((input: I) => {
        const output = produce(input)
        if (isE(output)) return output
        return nextProduce(output)
      })
    },
    produce,
  }
}
