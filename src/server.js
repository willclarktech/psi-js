const { newBf, sign, params } = require('./utils')

const Server = () => {
  /**
   * Initialize a BloomFilter
   * @param privateKey
   * @param X
   * @returns {BloomFilter}
   */
  const setupBf = (privateKey, X) => {
    const data = X.map(x => sign(privateKey, x).toString())
    // Mimicking python: ScalableBloomFilter.SMALL_SET_GROWTH
    // Except we instantiate based on the number of elements in the array
    // for uniformity
    return newBf(data, params.BLOOM_FILTER.ERROR_RATE)
  }

  /**
   * Signs an input array
   * @param privateKey
   * @param A
   * @returns {Array<BigInteger>}
   */
  const signBatch = (privateKey, A) => A.map(a => sign(privateKey, a))

  return {
    setupBf,
    signBatch
  }
}

module.exports = Server