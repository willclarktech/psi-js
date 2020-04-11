const { inverse, encrypt, randomBigInt, params } = require('./utils')

const Client = () => {
  /**
   * Generate random factors
   * @name Client#generateRandomFactors
   * @param publicKey RSA public  key
   * @returns {Array<[BigInteger, BigInteger]>} [multiplicative inverse,
   * encrypted]
   */
  const generateRandomFactors = publicKey =>
    Array.from({ length: params.CLIENT.MAX_INPUTS }).map(_ => {
      const n = BigInt(publicKey.n)
      const r = randomBigInt(0n, n)
      const rInv = inverse(publicKey, r)
      const rEncrypted = encrypt(publicKey, r)
      return [rInv, rEncrypted]
    })

  /**
   * Perform blind batching
   * @name Client#blindBatch
   * @param Y
   * @param randomFactors
   * @returns {Array<BigInteger>}
   */
  const blindBatch = (Y, randomFactors) =>
    randomFactors.map((rf, i) => {
      const rEncrypted = rf[1]
      return Y[i].multiply(rEncrypted)
    })

  /**
   * Find the intersection
   * @name Client#intersect
   * @param Y
   * @param B
   * @param randomFactors
   * @param bf
   * @param publicKey
   * @returns {Array<BigInteger>}
   */
  const intersect = (Y, B, randomFactors, bf, publicKey) => {
    const n = BigInt(publicKey.n)
    return randomFactors.reduce((acc, rf, i) => {
      const rInv = rf[0]
      const toCheck = B[i].multiply(rInv).mod(n).toString()
      if (bf.has(toCheck)) {
        acc.push(Y[i])
      }
      return acc
    }, [])
  }

  return {
    generateRandomFactors,
    blindBatch,
    intersect
  }
}

module.exports = Client
