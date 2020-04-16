export default ({ filters: { BloomFilter } }) => {
  /**
   * Bloom-Filter implementation.
   *
   * @param {Object} options Options for implementation
   * @param {String} options.publicKeyName Public key name
   * @param {String} options.privateKeyName Private key name
   * @param {Function} options.Create Create impl
   * @param {Function} options.From From impl
   * @param {Object} options.constants Bloom filter defaults
   * @return {Object} Bloom-Filter implementation
   */
  return ({ Create, From, constants: { MAX_ELEMENTS, ERROR_RATE } }) => {
    /**
     * Creates a new bloom filer supporting a specified length and error rate
     */
    const create = Create((length = MAX_ELEMENTS, errorRate = ERROR_RATE) => {
      return BloomFilter.create.call(BloomFilter, length, errorRate)
    })

    /**
     * Creates a new bloom filter from an array of elements and error rate
     */
    const from = From((items, errorRate = ERROR_RATE) => {
      return BloomFilter.from.call(BloomFilter, items, errorRate)
    })

    return { create, from }
  }
}
