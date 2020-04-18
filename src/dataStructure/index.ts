import bloomFilter, { BloomFilterDataStructure } from './bloomFilter'

export type DataStructure = {
  readonly bloomFilter: BloomFilterDataStructure
}

const dataStructure: DataStructure = {
  bloomFilter
}

export default dataStructure
