import { default as Constants } from '../constants'
import { default as Provider } from './provider'
import { default as BloomFilter } from './bloomFilter'
import { createModuleFactory } from '../../factory'
import module from './module'

export default createModuleFactory({
  provider: Provider,
  createBloomFilter: BloomFilter,
  constants: Constants.DATA_STRUCTURE
})(module)
