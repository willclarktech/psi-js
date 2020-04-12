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
      // r^-1 mod n
      const rInv = inverse(publicKey, r)
      // r^e mod n
      const rPrime = encrypt(publicKey, r)
      return [rInv, rPrime]
    })

  /**
   * Perform blind batching
   * @name Client#blindBatch
   * @param Y
   * @param randomFactors
   * @param publicKey
   * @returns {Array<BigInteger>}
   */
  const blindBatch = (Y, randomFactors, publicKey) => {
    const n = BigInt(publicKey.n)
    return Y.map((y, i) => {
      const rPrime = randomFactors[i][1]
      // y * r' mod n
      return y.multiply(rPrime).mod(n)
    })
  }

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
    return B.reduce((acc, b, i) => {
      const rInv = randomFactors[i][0]
      // b * rInv mod n
      const toCheck = b.multiply(rInv).mod(n).toString()
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
