import dataStructure, { DataStructure } from './dataStructure'
import protocol, { Protocol } from './protocol'

export type Psi = {
  readonly dataStructure: DataStructure
  readonly protocol: Protocol
}

const psi: Psi = {
  dataStructure,
  protocol
}

export default psi
