<script setup>
  import { ref, watch, onMounted } from 'vue'
  import Web3 from 'web3'
  import abi from '../assets/abi/abi.json'

  const props = defineProps(['digest'])
  const web3 = ref(new Web3(window.ethereum))
  const contractAddress = ref('0x587fC481145182Bd1EDDa5DfAcAb7E28BaD333aA')
  const walletConnected = ref(false)

  const timestamp = ref(null)
  const claimed = ref(false)
  const transferred = ref(false)

  const latestEvent = ref(null)

  const errorDigestNotInAccount = ref(false)

  function checkWalletConnection() {
    web3.value.eth.getAccounts().then(accounts => {
      if (accounts.length != 0) {
        console.log("hello")
        walletConnected.value = true
      }
    })
  }

  function connectWallet() {
    if (window.ethereum) {
      window.ethereum.request({method: 'eth_requestAccounts'}).then(accounts => {
        if (accounts.length != 0) {
          walletConnected.value = true
        }
      })
    }
  }

  function checkDigest() {
    if (!walletConnected.value) {
      return
    }
    let contract = new web3.value.eth.Contract(abi, contractAddress.value)
    let sha256_checksum_bytes = web3.value.utils.hexToBytes(props.digest.string)
    web3.value.eth.getAccounts().then(accounts => {
      if (accounts.length != 1) {
        return new Promise((resolve, reject) => {
          reject('Exactly one account must be connected!')
        })
      }
      return contract.methods.retrieve(sha256_checksum_bytes).call({from: accounts[0]})
    }).then(receipt => {
      timestamp.value = new Date(Number(receipt.timestamp)*1000)
      claimed.value = receipt.claimed
      transferred.value = receipt.transferred
    }).catch(e => {
      if (e.hasOwnProperty('name')) {
        if (e.name == 'ResponseError') {
          errorDigestNotInAccount.value = true
        }
      }
    })

  }

  function storeDigest() {
    if (!walletConnected.value) {
      return
    }
    let contract = new web3.value.eth.Contract(abi, contractAddress.value)
    let sha256_checksum_bytes = web3.value.utils.hexToBytes(props.digest.string)
    web3.value.eth.getAccounts().then(accounts => {
      if (accounts.length != 1) {
        return new Promise((resolve, reject) => {
          reject('Exactly one account must be connected!')
        })
      }
      return contract.methods.store(sha256_checksum_bytes).send({from: accounts[0]})
    }).then(receipt => {
      console.log(receipt)
    })

  }


  function searchDigestEvents() {
    if (!walletConnected.value) {
      return
    }
    let contract = new web3.value.eth.Contract(abi, contractAddress.value)
    let sha256_checksum_bytes = web3.value.utils.hexToBytes(props.digest.string)
    contract.getPastEvents('Claim', {
      filter: {sha256_checksum: web3.value.utils.bytesToHex(sha256_checksum_bytes)},
      fromBlock: 0,
      toBlock: 'latest'
    }).then(events => {
      let eventsLength = events.length;
      let blockNumber = 0;
      let latestIndex = 0;
      for (let i = 0; i < eventsLength; i++) {
        if (events[i].blockNumber > blockNumber) {
          // TODO: This is a rough estimate. Also check the transaction index!
          blockNumber = events[i].blockNumber
          latestIndex = i;
        }
      }
      latestEvent.value = events[latestIndex]
    });
  }

  onMounted(() => {
    checkWalletConnection()
  })

  watch(() => props.digest, (digest) => {
    if (digest.string) {
      errorDigestNotInAccount.value = false
      checkDigest()
      searchDigestEvents()
      console.log(latestEvent.value)
    }
  })
</script>

<template>
  <div>
    <span v-if="digest.string">File digest: {{ digest.string }}</span><br>
    <button v-if="!walletConnected && digest.string" @click="connectWallet">Connect wallet</button><br>
    <button v-if="walletConnected && digest.string" @click="checkDigest">Send transaction</button><br>
    <button v-if="walletConnected && digest.string" @click="storeDigest">Store digest</button><br>
    <span v-if="timestamp">Timestamp of file: {{ timestamp.toDateString() }}</span><br>
    <span v-if="latestEvent">Claimed by: {{ latestEvent.returnValues.claimant }}</span><br>
    <span v-if="errorDigestNotInAccount">Digest not found in Ethereum account!</span>
  </div>
</template>

<style scoped></style>
