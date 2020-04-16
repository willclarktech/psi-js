const bigInt = require('big-integer')
const psi = require('./src').default // CommonJS

// Demonstration of RSA - PSI protocol

//////////////////
// BASE PHASE
// 1. The client and server agree on RSA key parameters
// 2. Server generates / loads an existing the key pair
// 3. Server shares the public key to the client(s)
// 4. The client generates random factors to use later
//////////////////

console.time('Generating keys')
// Create the server instance
const server = psi.protocol.rsa.server({
  // keySize: 2048,
  // exponent: 0x10001,
  // Optionally, provide serialized key(s) / key parameters
  // so we don't have to generate them again.
  privateKey: null,
  publicKey: null
})
console.timeEnd('Generating keys')

// Transport the publicKey to the client. Can also save the keys.
const { publicKey, privateKey } = server.keys

// Create the client instance
const client = psi.protocol.rsa.client({ publicKey })

// The client generates RF based on a maximum number of inputs the server
// supports
console.time('Generating random factors')
const randomFactors = client.randomFactors()
console.timeEnd('Generating random factors')

//////////////////
// SETUP PHASE
// 1. The server signs its data with the generated private key
// 2. Server creates or loads an existing data-structure (Bloom Filter)
// 3. Server allows public access to the data-structure (Bloom Filter)
//////////////////

// X is the server's data
const X = range(0, 2 ** 10).map(x => bigInt(x))
// Server signs its data to be assigned to the data-structure. Needs to be a
// string for the bloom filter key
console.time('Server signing data')
const signedData = X.map(x => server.sign(x).toString())
console.timeEnd('Server signing data')

// create a new bloom filter with specified length, iteratively add elements
// const bloomFilter = psi.dataStructure.bloomFilter.create(signedData.length, 0.001) // create with capacity of 1024, errorRate 0.1%
// signedData.forEach(x => bloomFilter.add(x))
// Or create one from existing data set and error rate

console.time('Creating bloom filter')
const bloomFilter = psi.dataStructure.bloomFilter.from(signedData)
console.timeEnd('Creating bloom filter')

//////////////////
// ONLINE PHASE
// 1. Create a blind from the client's data using random factors and the public key
// 2. Send the blind to the server to be signed
// 3. Server sends the signed blind (B) back to the client along with the dataStructure (bloomFilter)
// 4. Client finds the intersection using his data (Y),
//    the signed blind (B), the client's randomFactors, the server's dataStructure (bloomFilter),
//    and the public key.
//////////////////
// Y is the client's data
const Y = range(0, 2 ** 10, 5).map(x => bigInt(x))

// Client creates a blind (A) to be sent to the server
console.time('Creating blind')
const A = client.blind(Y, randomFactors)
console.timeEnd('Creating blind')
// Server signs the blind (A) and returns the signature(s) to the client (B)
console.time('Signing blind')
const B = A.map(a => server.sign(a))
console.timeEnd('Signing blind')

// Client then finds the intersection (X_Y) of A and B
console.time('Calculating intersection')
const X_Y = client.intersect(Y, B, randomFactors, bloomFilter)
console.timeEnd('Calculating intersection')
console.log(`[${X.slice(0, 10).join(', ')} ...] - Original X`)
console.log(`[${Y.slice(0, 10).join(', ')} ...] - Original Y`)
console.log(`[${X_Y.slice(0, 10).join(', ')} ...] - Intersection`)

/**
 * Return an array between a specified range and step
 * @param start
 * @param stop
 * @param step
 * @returns {Array<Number>}
 */
function range(start, stop, step) {
  if (typeof stop == 'undefined') {
    // one param defined
    stop = start
    start = 0
  }

  if (typeof step == 'undefined') {
    step = 1
  }

  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
    return []
  }

  const result = []
  for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
    result.push(i)
  }

  return result
}
