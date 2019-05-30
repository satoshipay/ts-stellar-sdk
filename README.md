## TODO

- Account? Only a wrapper around an object with account address and sequence number
- (+) Hashing: just sha256 (taken from sha.js)
- Keypair: the secret entry is actually just a seed; \_secretKey is the seed + publicKey
  - (+) fromSecret: nice secret string
  - (?) master: use the sha256 of the network passphrase as seed
  - (+) fromPublicKey: from nice public key
  - (+) random: generate random seed
  - (+) rawPublicKey: return the raw public key
  - (+) signatureHint: last 4 bit of xdr encoding as account id
  - (+) publicKey: return nice public key
  - (+) secret: return nice secret key (seed)
  - (+) rawSecretKey: return raw secret seed
  - (+) canSign: true if has secret key
  - (+) sign: just use sign from Signing with \_secretKey
  - (+) verify: just use verify from Signing with \_publicKey
  - (-) signDecorated: create a DecoratedSignature xdr with signature and signatureHint
- (+) Network: just a wrapper around a passphrase
- TransactionBuilder
  - build increments sequence number of source
- Transaction
  - (+) sign
  - (+) getKeypairSignature
  - (+) addSignature
  - signHashX
  - (+) hash
  - (+) signatureBase
  - (?) toEnvelope

Assumptions

- browser
  - support `atob` and `btoa` for browsers
  - support `Buffer` for non-browsers
  - support `crypto.subtle.digest`
