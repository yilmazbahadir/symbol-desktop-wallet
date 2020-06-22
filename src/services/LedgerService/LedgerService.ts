import { SignedTransaction, CosignatureSignedTransaction } from 'symbol-sdk'
// @ts-ignore

export class LedgerService {
  async getAccount(currentPath: any) {
    const param = {
      currentPath: currentPath,
    }
    console.log('<<<<currentPath>>>>', currentPath)
    const host = 'http://localhost:6789'
    try {
      const result = await fetch(host + '/ledger/account/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(param),
      })
      const data = await result.json()
      const { publicKey, path } = data
      console.log('<<<<<<data>>>>>>', data)
      return { publicKey, path }
    } catch {
      console.log('Please ensure that your device is opening with ledger-bolos-app!')
    }
  }

  async signTransaction(path: string, transferTransaction: any, networkGenerationHash: string, signer: string) {
    const transferTransactionSerialize = transferTransaction.serialize()
    const param = {
      path: path,
      transferTransactionSerialize: transferTransactionSerialize,
      networkGenerationHash: networkGenerationHash,
      signer: signer,
    }

    const host = 'http://localhost:6789'
    const result = await fetch(host + '/ledger/sign/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(param),
    })

    const data = await result.json()
    const signedTransaction = new SignedTransaction(
      data.payload,
      data.transactionHash,
      data.signer,
      transferTransaction.type,
      transferTransaction.networkType,
    )
    return signedTransaction
  }

  async signCosignatureTransaction(
    path: string,
    transferTransaction: any,
    networkGenerationHash: string,
    signer: string,
  ) {
    const transferTransactionSerialize = transferTransaction.serialize()
    const transactionHash = transferTransaction.transactionInfo.hash
    const param = {
      path: path,
      transferTransactionSerialize: transferTransactionSerialize,
      transactionHash: transactionHash,
      networkGenerationHash: networkGenerationHash,
      signer: signer,
    }

    const host = 'http://localhost:6789'
    const result = await fetch(host + '/ledger/signCosignature/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(param),
    })

    const data = await result.json()
    const signedTransaction = new CosignatureSignedTransaction(transactionHash, data.signature, data.signer)

    return signedTransaction
  }
}
