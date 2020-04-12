const bigInt = require('big-integer')
const Client = require('./src/client')
const Server = require('./src/server')
const { range, params, generateRSAKeyPair } = require('./src/utils')

// Begin the test with two Arrays of BigInts that we will find the intersection
const X = range(0, 2 ** 10).map(x => bigInt(x))
const Y = range(0, 2 ** 10, 5).map(x => bigInt(x))

// Construct the Client and Server instances
const client = Client()
const server = Server()

//////////////////
// OFFLINE SETUP
//////////////////

// Generate RSA Keys
console.time('Generating keys')
const { privateKey, publicKey } = generateRSAKeyPair(
  params.RSA.MODULUS,
  params.RSA.EXPONENT
)
console.timeEnd('Generating keys')

console.time('Generating random factors')
const randomFactors = client.generateRandomFactors(publicKey)
console.timeEnd('Generating random factors')
console.time('Creating bloom filter')
const bf = server.setupBf(privateKey, X)
console.timeEnd('Creating bloom filter')

//////////////////
// ONLINE
//////////////////

// Client creates a blind to be sent to the server
console.time('Blind batching')
const A = client.blindBatch(Y, randomFactors)
console.timeEnd('Blind batching')

// Server signs the blind and returns the signature(s) to the client
console.time('Signing batch')
const B = server.signBatch(privateKey, A)
console.timeEnd('Signing batch')

// Client then finds the intersection
console.time('Finding intersection')
const X_Y = client.intersect(Y, B, randomFactors, bf, publicKey)
console.timeEnd('Finding intersection')

console.log(`[${X.slice(0, 10).join(', ')} ...] - Original X`)
console.log(`[${Y.slice(0, 10).join(', ')} ...] - Original Y`)
console.log(`[${X_Y.slice(0, 10).join(', ')} ...] - Intersection`)
