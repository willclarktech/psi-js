import * as Filters from 'bloom-filters'
import { createModuleFactory } from '../../../factory'
import module from './module'

export default createModuleFactory({
  filters: Filters
})(module)
