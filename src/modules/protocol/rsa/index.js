import BigInteger from 'big-integer'
import forge from 'node-forge'
import { createModuleFactory } from '../../../factory'
import module from './module'

export default createModuleFactory({
  forge: forge,
  bigInt: BigInteger
})(module)
