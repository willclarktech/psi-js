export default () => {
  /**
   * Creates a data-structure adapter for a specified implementation
   *
   * @param {Object} options Options for implementation
   * @return {Object} Data-structure provider
   */
  const create = options => {
    /*
     * Each adapter needs to define at LEAST the following functions
     */
    const Create = impl => (...args) => impl.apply(impl, args)
    const From = impl => (...args) => impl.apply(impl, args)

    return {
      Create,
      From,
      constants: options.constants
    }
  }

  return {
    create
  }
}
