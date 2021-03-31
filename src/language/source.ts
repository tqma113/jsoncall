export type Source = {
  content: string,
  filepath: string
}

export const createSource = (content: string, filepath: string): Source => {
  return {
    content,
    filepath
  }
}
