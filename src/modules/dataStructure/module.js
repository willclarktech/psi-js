export default ({ provider, createBloomFilter, constants }) => {
  /*
   Common defaults for all adapters
   */
  const defaults = {}

  const bloomFilter = provider.create({
    ...defaults,
    constants: constants.BLOOM_FILTER
  })

  return {
    bloomFilter: createBloomFilter(bloomFilter)
  }
}
