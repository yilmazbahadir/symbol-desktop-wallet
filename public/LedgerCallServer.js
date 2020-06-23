// var JSAlert = require('js-alert');
const express = require('express');
const cors = require('cors');
const app = express();
const TransportNodeHid = require('@ledgerhq/hw-transport-node-hid');
const SymbolLedger = require("./ledger.model");
const TransactionType = require('symbol-sdk')
const Port = 6789;

// Enable preflight requests for all routes
app.use(cors());

app.use(
    express.json({
        // We need the raw body to verify webhook signatures.
        verify: function (req, res, buf) {
            if (req.originalUrl.startsWith("/webhook")) {
                req.rawBody = buf.toString();
            }
        }
    })
);

// app.use(cors(corsOptions));

async function account(req, res) {
  const { currentPath } = req.body;
  const transport = await TransportNodeHid["default"].open('');
  const symbolLedger = new SymbolLedger.SymbolLedger(transport, 'XYM');
  const accountResult = await symbolLedger.getAccount(currentPath);
  const { address, publicKey, path } = accountResult;
  transport.close();
  res.send({ address, publicKey, path });
}

async function sign(req, res) {
  const { path, transferTransactionSerialize, networkGenerationHash, signer } = req.body;
  const transport = await TransportNodeHid["default"].create();
  const symbolLedger = new SymbolLedger.SymbolLedger(transport, 'XYM');
  const signedTransaction = await symbolLedger.signTransaction(path, transferTransactionSerialize, networkGenerationHash, signer)

  const {payload, transactionHash} = signedTransaction
  transport.close();
  res.send({payload,transactionHash,signer});
}

async function signCosignatureTransaction(req, res) {
  const { path, transferTransactionSerialize,transactionHash, networkGenerationHash, signer } = req.body;
  const transport = await TransportNodeHid["default"].create();
  const symbolLedger = new SymbolLedger.SymbolLedger(transport, 'XYM');
  const signedTransaction = await symbolLedger.signCosignatureTransaction(path, transferTransactionSerialize, transactionHash, networkGenerationHash, signer);
  const {signature} = signedTransaction
  transport.close();
  res.send({signature,signer});

}

app.post('/ledger/account',async(req,res)=>{
  account(req,res);
})
app.post('/ledger/sign',async(req,res)=>{
  sign(req,res);
})
app.post('/ledger/signCosignature',async(req,res)=>{
  signCosignatureTransaction(req,res);
})

app.listen(Port, () => console.log(`Node server listening on port ${Port}!`));
