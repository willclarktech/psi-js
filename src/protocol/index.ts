import rsa, { RsaProtocol } from './rsa'

export type Protocol = {
  readonly rsa: RsaProtocol
}

const protocol: Protocol = {
  rsa
}

export default protocol
