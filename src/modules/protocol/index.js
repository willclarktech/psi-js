import { default as Constants } from '../constants'
import { default as Provider } from './provider'
import { default as RSA } from './rsa'
import { createModuleFactory } from '../../factory'
import module from './module'

export default createModuleFactory({
  provider: Provider,
  createRSA: RSA,
  constants: Constants.PROTOCOL
})(module)
