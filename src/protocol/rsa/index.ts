import client, { RsaClientInitializer } from './client'
import server, { RsaServerInitializer } from './server'

export type RsaProtocol = {
  readonly client: RsaClientInitializer
  readonly server: RsaServerInitializer
}

const rsa: RsaProtocol = {
  client,
  server
}

export default rsa
