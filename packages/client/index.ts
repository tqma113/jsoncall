export type Reader = () => Promise<string>
export type CallSender = (input: any) => Promise<any>

export type ClientOptions = {
  read: Reader
  sendCall: CallSender
  genDir: string
}

export const createClient = (options: ClientOptions) => {}

export type SyncReader = () => string
export type SyncCallSender = (input: any) => any

export type SyncClientOptions = {
  read: SyncReader
  sendCall: SyncCallSender
  genDir: string
}

export const createSyncClient = (options: SyncClientOptions) => {}
