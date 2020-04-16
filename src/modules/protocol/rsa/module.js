export default ({ forge, bigInt }) => {
  /**
   * Returns a random BigInteger between a specified range and step
   * @param args
   * @returns {BigInteger}
   */
  const randomBigInt = (...args) => bigInt.randBetween.apply(bigInt, args)

  /**
   * RSA implementation.
   *
   * @param {Object} options Options for implementation
   * @param {Function} options.Client Client impl
   * @param {Function} options.Server Server impl
   * @param {Object} options.constants RSA constants
   * @return {Object} RSA protocol impl
   */
  return ({
    Client,
    Server,
    constants: { KEY_SIZE, EXPONENT, RANDOM_FACTOR_MAX_INPUTS } // defaults
  }) => {
    /**
     * Client Initializer
     *
     * @param {Object} options Client Options
     * @param {Object} options.publicKey RSA public key
     *
     * @returns {Promise<Client>}
     * @constructor
     */
    const client = Client(({ publicKey }) => {
      const keys = {
        publicKey: null
      }

      // TODO: load/deserialize the publicKey
      keys.publicKey = publicKey

      /**
       * Generates random factors
       *
       * @param {Number} [maxInputs=RANDOM_FACTOR_MAX_INPUTS] Maximum set of data that the server is
       * using
       * @returns {Array<Object<rInv, rPrime>>}
       */
      const randomFactors = (maxInputs = RANDOM_FACTOR_MAX_INPUTS) => {
        return Array.from({
          length: maxInputs
        }).map(_ => {
          const n = BigInt(keys.publicKey.n)
          const e = BigInt(keys.publicKey.e)
          // TODO: ensure this is a CSPRNG
          const r = randomBigInt(0n, n)
          // r^-1 mod n
          const rInv = r.modInv(n)
          // r^e mod n
          const rPrime = r.modPow(e, n)
          return { rInv, rPrime }
        })
      }

      /**
       * Creates a blind batch to send to the server
       * @param {Array<BigInt>} Y The client's raw data
       * @param {Array<Object<rInv, rPrime>>} randomFactors Client's random factors
       * @returns {(BigInteger)[]}
       */
      const blind = (Y, randomFactors) => {
        const n = BigInt(keys.publicKey.n)
        return Y.map((y, i) => {
          const { rPrime } = randomFactors[i]
          // y * r' mod n
          return y.multiply(rPrime).mod(n)
        })
      }

      /**
       * Find the intersection between the client and the server's sets
       * @param {Array<BigInt>} Y The client's raw data
       * @param {Array<BigInt>} B The server's signed blind
       * @param {Array<Object<rInv, rPrime>>} randomFactors Client's random factors
       * @param {Object} dataStructure The data-structure in use
       * @returns {*}
       */
      const intersect = (Y, B, randomFactors, dataStructure) => {
        const n = BigInt(keys.publicKey.n)
        return B.reduce((acc, b, i) => {
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
        randomFactors,
        blind,
        intersect
      }
    })

    /**
     * Server Initializer
     *
     * @param {Object} options Server Options
     * @param {Number} options.keySize Key size in bits
     * @param {Number} options.exponent RSA exponent
     * @param {Object} [options.publicKey=null] RSA public key
     * @param {Object} [options.privateKey=null] RSA private key
     *
     * @returns {Promise<Server>}
     * @constructor
     */
    const server = Server(
      ({
        keySize = KEY_SIZE,
        exponent = EXPONENT,
        publicKey = null,
        privateKey = null
      }) => {
        // Holder for our keys
        const keys = {
          publicKey: null,
          privateKey: null
        }

        // Initialize the keys
        if (!privateKey && !publicKey) {
          const keyPair = forge.rsa.generateKeyPair.call(forge, {
            bits: keySize,
            e: exponent
          })
          keys.publicKey = keyPair.publicKey
          keys.privateKey = keyPair.privateKey
        } else if (privateKey && !publicKey) {
          // TODO
        } else if (privateKey && publicKey) {
          // TODO
        }

        /**
         * Sign an element
         * @param {BigInt} a An input element
         * @returns {BigInt}
         */
        const sign = a => {
          const d = BigInt(keys.privateKey.d)
          const n = BigInt(keys.privateKey.n)
          // a^d mod n
          return a.modPow(d, n)
        }

        return {
          sign,
          get keys() {
            return keys
          }
        }
      }
    )

    return {
      client,
      server
    }
  }
}
