import bigInt, { BigInteger } from 'big-integer'
import forge from 'node-forge'

import { EXPONENT, KEY_SIZE } from './constants'

type PublicKey = forge.pki.rsa.PublicKey
type PrivateKey = forge.pki.rsa.PrivateKey
type KeyPair = forge.pki.rsa.KeyPair

export type RsaServerOptions = {
  readonly keySize: number
  readonly exponent: number
  readonly publicKey?: PublicKey
  readonly privateKey?: PrivateKey
}

export type RsaServer = {
  readonly sign: (message: BigInteger) => BigInteger
  readonly keys: KeyPair
}

export type RsaServerInitializer = (options: RsaServerOptions) => RsaServer

const getKeys = (
  keySize: number,
  exponent: number,
  privateKey?: PrivateKey,
  publicKey?: PublicKey
): KeyPair => {
  if (!privateKey) {
    return forge.pki.rsa.generateKeyPair.call(forge, {
      bits: keySize,
      e: exponent
    })
  }
  if (!publicKey) {
    return {
      publicKey: forge.pki.rsa.setPublicKey(privateKey.n, privateKey.e),
      privateKey
    }
  }
  return {
    publicKey,
    privateKey
  }
}

const server: RsaServerInitializer = ({
  keySize = KEY_SIZE,
  exponent = EXPONENT,
  privateKey,
  publicKey
}) => {
  const keys = getKeys(keySize, exponent, privateKey, publicKey)

  const sign = (a: BigInteger): BigInteger => {
    const d = bigInt(keys.privateKey.d.toString())
    const n = bigInt(keys.privateKey.n.toString())
    // a^d mod n
    return a.modPow(d, n)
  }

  return {
    keys,
    sign
  }
}

export default server
