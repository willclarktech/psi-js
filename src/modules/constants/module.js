export default () => {
  /*
   Store all application constants in this immutable object.
   */
  return Object.freeze({
    PROTOCOL: {
      RSA: {
        KEY_SIZE: 2048,
        EXPONENT: 0x10001,
        RANDOM_FACTOR_MAX_INPUTS: 1024
      }
    },
    DATA_STRUCTURE: {
      BLOOM_FILTER: {
        MAX_ELEMENTS: 1024,
        ERROR_RATE: 0.001
      }
    }
  })
}
