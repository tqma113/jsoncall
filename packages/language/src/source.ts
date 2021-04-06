export type Source = {
  content: string
  moduleId: string
}

export const createSource = (content: string, moduleId: string): Source => {
  return {
    content,
    moduleId,
  }
}
