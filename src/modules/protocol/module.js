export default ({ provider, createRSA, constants }) => {
  /*
   Common defaults for all adapters
   */
  const defaults = {
    publicKeyName: 'PublicKey',
    privateKeyName: 'PrivateKey'
  }

  const rsa = provider.create({
    ...defaults,
    prefix: 'rsa',
    constants: constants.RSA
  })

  return {
    rsa: createRSA(rsa)
  }
}
