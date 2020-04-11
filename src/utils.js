const forge = require('node-forge')
const bigInt = require('big-integer')
const { BloomFilter } = require('bloom-filters')

/**
 * App Parameters
 */
const params = Object.freeze({
  RSA: {
    MODULUS: 2048,
    EXPONENT: 0x10001
  },
  BLOOM_FILTER: {
    ERROR_RATE: 0.001
  },
  CLIENT: {
    MAX_INPUTS: 1024
  }

})

/**
 * BloomFilter Parameters =
 */

/**
 * Returns a random BigInteger between a specified range and step
 * @param args
 * @returns {bigInt.BigInteger}
 */
const randomBigInt = (...args) => bigInt.randBetween.apply(bigInt, args)

/**
 * Return an array between a specified range and step
 * @param start
 * @param stop
 * @param step
 * @returns {[]|*[]}
 */
const range = (start, stop, step) => {
  if (typeof stop == 'undefined') {
    // one param defined
    stop = start
    start = 0
  }

  if (typeof step == 'undefined') {
    step = 1
  }

  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
    return []
  }

  const result = []
  for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
    result.push(i)
  }

  return result
}

/**
 * Find the multiplicative inverse
 * @param key
 * @param a
 * @returns {BigInteger}
 */
const inverse = (key, a) => {
  const n = BigInt(key.n)
  //  a x ≡ 1 (mod m)
  return a.modInv(n)
}

/**
 * Encrypt a plain
 * @param key
 * @param pt
 * @returns {BigInteger}
 */
const encrypt = (key, pt) => {
  const e = BigInt(key.e)
  const n = BigInt(key.n)
  //  pt ** e mod n
  return pt.modPow(e, n)
}

/**
 * Decrypt a cipher
 * @param key
 * @param ct
 * @returns {BigInteger}
 */
const decrypt = (key, ct) => {
  const d = BigInt(key.d)
  const n = BigInt(key.n)
  //  ct ** d mod n
  return ct.modPow(d, n)
}

/**
 * Alias for Decryption
 * @param key
 * @param pt
 * @returns {*}
 */
const sign = (key, pt) => decrypt(key, pt)

/**
 * Create a BloomFilter
 * @param items Items to store in the filter
 * @param errorRate Error rate limit percentage
 * @returns {BloomFilter}
 */
const newBf = (items, errorRate) => BloomFilter.from.call(BloomFilter, items, errorRate)

/**
 * Save a BloomFilter to JSON
 * @param bf
 * @returns {Object}
 */
const saveBf = bf => bf.saveAsJSON.call(bf)

/**
 * Load a BloomFilter from a JSON object
 * @param json
 * @returns {BloomFilter}
 */
const loadBf = json => BloomFilter.fromJSON.call(BloomFilter, json)

/**
 * Generate an RSA key pair
 * @param bits
 * @param e
 * @returns {privateKey, publicKey}
 */
const generateRSAKeyPair = (bits, e) => forge.rsa.generateKeyPair.call(forge, { bits, e })

module.exports = {
  params,
  randomBigInt,
  range,
  inverse,
  encrypt,
  decrypt,
  sign,
  newBf,
  saveBf,
  loadBf,
  generateRSAKeyPair
}
