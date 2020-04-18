import { BloomFilter } from 'bloom-filters'
import { MAX_ELEMENTS, ERROR_RATE } from './constants'

export type BloomFilterDataStructure = {
  readonly create: (length: number, errorRate: number) => BloomFilter
  readonly from: (items: Iterable<Buffer>, errorRate: number) => BloomFilter
}

const bloomFilter: BloomFilterDataStructure = {
  create: (length = MAX_ELEMENTS, errorRate = ERROR_RATE) =>
    BloomFilter.create(length, errorRate),
  from: (items, errorRate = ERROR_RATE) => BloomFilter.from(items, errorRate)
}

export default bloomFilter
