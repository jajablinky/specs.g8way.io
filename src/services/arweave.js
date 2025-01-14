import Arweave from 'arweave'
import { prop } from 'ramda'

const arweave = import.meta.env.MODE === 'development' ?
  Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' }) :
  Arweave.init({})

export const gql = async (query, variables = {}) => arweave.api.post('graphql', { query, variables }).then(prop('data'))

export const get = async (tx) => arweave.api.get(tx).then(prop('data'))

export const post = async ({ data, tags }) => {
  try {
    const tx = await arweave.createTransaction({ data })
    tags.map(t => tx.addTag(t.name, t.value))
    const result = await window.arweaveWallet.dispatch(tx)
    console.log(result)
    //await arweave.transactions.sign(tx)
    //await arweave.transactions.post(tx)
    return Promise.resolve({ id: tx.id })
  } catch (e) {
    console.log(e.message)
    return Promise.reject(e)
  }
}
