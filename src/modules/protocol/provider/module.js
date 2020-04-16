export default () => {
  /**
   * Creates a Protocol adapter for a specified implementation
   *
   * @param {Object} options Options for implementation
   * @return {Object} Protocol provider
   */
  const create = options => {
    /*
     * Each adapter needs to implement at LEAST the following methods
     */
    const Client = impl => (...args) => impl.apply(impl, args)
    const Server = impl => (...args) => impl.apply(impl, args)

    return {
      Client,
      Server,
      constants: options.constants
    }
  }

  return {
    create
  }
}
