<script setup>
  import { ref, watch, onMounted, computed } from 'vue'
  import Web3 from 'web3'
  import abi from '../assets/abi/abi.json'

  const props = defineProps(['digest'])
  const web3 = ref(new Web3(import.meta.env.VITE_WEB3_PROVIDER))
  const contractAddress = ref(import.meta.env.VITE_SMART_CONTRACT_ADDRESS)
  const walletConnected = ref(false)
  const providerConnected = ref(false)

  const timestamp = ref(null)
  const claimed = ref(false)
  const transferred = ref(false)

  const latestEvent = ref(null)

  const digestClaimedByAccount = ref(false)
  const digestClaimChecked = ref(false)

  const revealDigest = ref(false)
  const digestOnBlockchain = ref(false)
  const searchForDigestCompleted = ref(false)

  const eip1193Available = computed(() => {
    return window.ethereum ? true : false
  })

  function checkWalletConnection() {
    return new Promise((resolve, reject) => {
      web3.value.eth.getAccounts().then(accounts => {
        if (accounts.length != 0) {
          walletConnected.value = true
        }
        return web3.value.eth.getBlockNumber()
      }).then(blockNumber => {
        if (blockNumber > 0) {
          providerConnected.value = true
        }
        resolve([walletConnected.value, providerConnected.value])
      }).catch(e => reject(e))
    })
  }

  function connectWallet() {
    if (window.ethereum) {
      window.ethereum.request({method: 'eth_requestAccounts'}).then(accounts => {
        if (accounts.length != 0) {
          web3.value.setProvider(window.ethereum)
          walletConnected.value = true
          providerConnected.value = true
        }
      })
    }
  }

  function checkDigest(ethereumAddress = null) {
    if (!walletConnected.value && !providerConnected.value) {
      return
    }
    let ethereumAccount = false
    let contract = new web3.value.eth.Contract(abi, contractAddress.value)
    let sha256_checksum_bytes = web3.value.utils.hexToBytes(props.digest.string)
    web3.value.eth.getAccounts().then(accounts => {
      if (accounts.length != 1 && walletConnected.value) {
        return new Promise((resolve, reject) => {
          reject('Exactly one account must be connected!')
        })
      }
      if (ethereumAddress != null) {
        return contract.methods.retrieve_address(sha256_checksum_bytes, ethereumAddress).call()
      } else {
        ethereumAccount = true
        return contract.methods.retrieve(sha256_checksum_bytes).call({from: accounts[0]})
      }
    }).then(receipt => {
      if (ethereumAccount) {
        digestClaimedByAccount.value = true
        digestClaimChecked.value = true
      }

      timestamp.value = new Date(Number(receipt.timestamp)*1000)
      claimed.value = receipt.claimed
      transferred.value = receipt.transferred
    }).catch(e => {
      if (e.hasOwnProperty('name')) {
        if (e.name == 'ResponseError') {
          if (ethereumAccount) {
            digestClaimedByAccount.value = false
            digestClaimChecked.value = true
          }
          console.log("Could not retrieve response! Perhaps you don't have a claim on this checksum?")
        }
      }
    })

  }

  function storeDigest() {
    if (!walletConnected.value && !providerConnected.value) {
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
    if (!walletConnected.value && !providerConnected.value) {
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
        if (events[i].blockNumber < blockNumber && events[i].returnValues.claim) {
          // TODO: Make sure this is the correct approach.
          // Perhaps we should list all events for this digest on the
          // site.
          blockNumber = events[i].blockNumber
          latestIndex = i;
        }
      }
      if (eventsLength != 0) {
        latestEvent.value = events[latestIndex]
        digestOnBlockchain.value = true
        searchForDigestCompleted.value = true

        // Get more detailed information about this event
        console.log(latestEvent.value.returnValues)
        checkDigest(latestEvent.value.returnValues.claimant)
      } else {
        digestOnBlockchain.value = false
        searchForDigestCompleted.value = true
      }
    }).catch(e => {
      searchForDigestCompleted.value = false;
    });
  }

  onMounted(() => {
    checkWalletConnection()
  })

  watch(() => props.digest, (digest) => {
    if (digest.string) {
      digestOnBlockchain.value = false
      searchForDigestCompleted.value = false
      digestClaimedByAccount.value = false
      digestClaimChecked.value = false
      revealDigest.value = false

      checkWalletConnection().then(s => {
        searchDigestEvents()
      })
    }
  })
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div v-if="digest.string && !walletConnected && !providerConnected" class="flex justify-center items-center">
      <font-awesome-icon class="animate-spin" size="xl" icon="fa-solid fa-spinner" />
    </div>
    <div v-else class="flex flex-col justify-center items-center w-full">
      <div v-if="digestOnBlockchain && searchForDigestCompleted" class="flex flex-row justify-center items-center w-full h-32 bg-gradient-to-r from-green-300 via-green-500 to-green-300 my-4">
        <font-awesome-icon class="text-white" icon="fa-solid fa-circle-check" size="6x" />
      </div>
      <div v-if="!digestOnBlockchain && searchForDigestCompleted" class="flex flex-row justify-center items-center w-full h-32 bg-gradient-to-r from-red-300 via-red-500 to-red-300 my-4">
        <font-awesome-icon class="text-white" icon="fa-solid fa-circle-xmark" size="6x" />
      </div>
      <div v-if="!searchForDigestCompleted" class="flex flex-row justify-center items-center w-full h-32 bg-gradient-to-r from-slate-300 via-slate-500 to-slate-300 my-4">
        <font-awesome-icon class="text-white" icon="fa-solid fa-circle-xmark" size="6x" />
      </div>
      <div class="flex flex-col lg:flex-row justify-center items-center">
        <div v-if="digest.string" @click="revealDigest = !revealDigest" :class="{ 'bg-green-400 hover:bg-green-500': digestOnBlockchain && searchForDigestCompleted, 'bg-red-400 hover:bg-red-500': !digestOnBlockchain && searchForDigestCompleted, 'bg-slate-300 hover:bg-slate-400': !searchForDigestCompleted }" class="flex justify-center items-center rounded-md cursor-pointer py-1 px-2 my-1 mr-1 text-lg">
          <font-awesome-icon v-if="digestOnBlockchain" class="mr-1" icon="fa-solid fa-circle-check" />
          <font-awesome-icon v-else class="mr-1" icon="fa-solid fa-circle-xmark" />
          <span v-if="!revealDigest && digestOnBlockchain">Digest claimed (click to reveal)</span>
          <span v-if="!revealDigest && !digestOnBlockchain">Digest not found (click to reveal)</span>
          <span v-if="revealDigest" class="overflow-x-auto max-w-48 md:max-w-fit">{{ digest.string }}</span>
        </div>

        <div v-if="timestamp" class="flex justify-center items-center rounded-md py-1 px-2 my-1 ml-1 bg-gray-300 text-lg">
          <font-awesome-icon class="mr-1" icon="fa-solid fa-clock" />
          <span>{{ timestamp.toLocaleString() }}</span>
        </div>
      </div>

      <div v-if="latestEvent" :class="{ 'bg-green-400': digestClaimedByAccount, 'bg-gray-300': !digestClaimedByAccount }" class="flex justify-center items-center rounded-md py-1 px-2 my-1 text-lg">
        <font-awesome-icon class="mr-1" icon="fa-solid fa-user" />
        <span class="overflow-x-auto max-w-48 md:max-w-fit">{{ latestEvent.returnValues.claimant }}</span>
      </div>

      <!-- Ethereum EIP-1193 injected provider connection -->
      <div v-if="!walletConnected && digest.string" class="flex flex-row items-center justify-center">
        <button v-if="eip1193Available" class="inline-flex items-center my-1 border rounded-md py-1 px-2 hover:bg-gray-200 text-lg" @click="connectWallet">
          <font-awesome-icon class="mr-1" icon="fa-brands fa-ethereum" />
          <span>Connect Ethereum wallet</span>
        </button>
        <div v-else class="inline-flex items-center my-1 border rounded-md py-1 px-2 bg-red-100 border-red-500 text-lg">
          <font-awesome-icon class="mr-1" icon="fa-brands fa-ethereum" />
          <span>EIP-1193 (injected provider) unavailable</span>
        </div>
      </div>


      <div v-if="walletConnected && digest.string" class="flex flex-row items-center justify-center">
        <button v-if="digestOnBlockchain && !digestClaimChecked" class="inline-flex items-center my-1 border rounded-md py-1 px-2 hover:bg-gray-200 text-lg" @click="checkDigest(null)">
          <span>Verify your claim</span>
        </button>

        <button v-if="!digestOnBlockchain" class="inline-flex items-center my-1 border rounded-md py-1 px-2 hover:bg-gray-200 text-lg" @click="storeDigest">
          <span>Store digest</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
