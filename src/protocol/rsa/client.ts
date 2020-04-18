import bigInt, { BigInteger, randBetween } from 'big-integer'
import forge from 'node-forge'

import { RANDOM_FACTOR_MAX_INPUTS } from './constants'

export type PublicKey = forge.pki.rsa.PublicKey

export type RsaClientOptions = {
  readonly publicKey: PublicKey
}

type RandomFactors = {
  readonly rInv: BigInteger
  readonly rPrime: BigInteger
}

type DataStructure = {
  readonly has: (element: string) => boolean
}

export type RsaClient = {
  readonly getRandomFactors: (maxInputs: number) => readonly RandomFactors[]
  readonly blind: (
    Y: readonly BigInteger[],
    randomFactors: readonly RandomFactors[]
  ) => readonly BigInteger[]
  readonly intersect: (
    Y: readonly BigInteger[],
    B: readonly BigInteger[],
    randomFactors: readonly RandomFactors[],
    dataStructure: DataStructure
  ) => readonly BigInteger[]
}

export type RsaClientInitializer = (options: RsaClientOptions) => RsaClient

const client: RsaClientInitializer = ({ publicKey }) => {
  const keys = {
    publicKey
  }

  const getRandomFactors = (
    maxInputs = RANDOM_FACTOR_MAX_INPUTS
  ): readonly RandomFactors[] => {
    return Array.from({
      length: maxInputs
    }).map(() => {
      const n = BigInt(keys.publicKey.n)
      const e = BigInt(keys.publicKey.e)
      // TODO: ensure this is a CSPRNG
      const r = randBetween(0, n)
      // r^-1 mod n
      const rInv = r.modInv(n)
      // r^e mod n
      const rPrime = r.modPow(e, n)
      return { rInv, rPrime }
    })
  }

  const blind = (
    Y: readonly BigInteger[],
    randomFactors: readonly RandomFactors[]
  ): readonly BigInteger[] => {
    const n = bigInt(keys.publicKey.n.toString())
    return Y.map(
      (y: BigInteger, i: number): BigInteger => {
        const { rPrime } = randomFactors[i]
        // y * r' mod n
        return y.multiply(rPrime).mod(n)
      }
    )
  }

  const intersect = (
    Y: readonly BigInteger[],
    B: readonly BigInteger[],
    randomFactors: readonly RandomFactors[],
    dataStructure: DataStructure
  ): readonly BigInteger[] => {
    const n = BigInt(keys.publicKey.n)
    return B.reduce((acc: BigInteger[], b, i) => {
      const { rInv } = randomFactors[i]
      // b * rInv mod n
      const toCheck = b.multiply(rInv).mod(n).toString()
      if (dataStructure.has(toCheck)) {
        acc.push(Y[i])
      }
      return acc
    }, [])
  }

  return {
    getRandomFactors,
    blind,
    intersect
  }
}

export default client
