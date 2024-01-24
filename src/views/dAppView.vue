<script setup>
import { ref, reactive, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { sha256_digest } from '@/utils/file.js'
import DragAndDrop from '@/components/DragAndDrop.vue'
import EthereumPublishDigest from '@/components/EthereumPublishDigest.vue'
import Badge from '@/components/Badge.vue'
import Alert from '@/components/Alert.vue'

const route = useRoute();
const router = useRouter();

const enableAbout = ref(import.meta.env.VITE_ENABLE_ABOUT == 'true')

const urlInput = ref('')
const urlLoadError = ref(false)

const embedBadge = ref(false)
let state = reactive({
  file: null,
  urlPresent: false,
  digest: {},
});

function processFileUpload(files) {
  if (files.length != 1) {
    return
  }
  state.file = files[0];
  sha256_digest(state.file).then(digest => state.digest = digest)
}

function urlRouteLocation(url) {
  return {
    name: 'dAppView',
    query: {
      url: url,
    },
  }
}

function loadFromUrl(url) {
  if (url == route.query.url) {
    getFile(url)
  } else {
    router.push(urlRouteLocation(url))
  }
}

function getFile(url) {
    fetch(url).then(response => {
      response.arrayBuffer().then(value => {
        let contentType = response.headers.get('Content-Type')
        let file = new File([value], '', { type: contentType })
        sha256_digest(file).then(digest => state.digest = digest)
        state.file = file
        urlLoadError.value = false
      })
    }).catch(e => {
      urlLoadError.value = true
    })
}

watch(() => route.params.digest, digest => {
  console.log(digest)
}, { immediate: true })

watch(() => route.query.url, url => {
  if (url) {
    state.urlPresent = true
    urlInput.value = url
    getFile(url)
  } else {
    state.urlPresent = false
  }
}, { immediate: true })
</script>

<template>
  <main>
    <div class="flex flex-col justify-center items-center mt-6">
      <div v-if="!state.file" class="flex flex-col justify-center items-center mb-4">
        <div class="flex flex-col md:flex-row justify-center items-center w-full">
          <input v-model="urlInput" placeholder="Use an URL (https://raw.githubusercontent.com/...)" class="block h-10 px-3 py-2 w-full md:w-auto md:grow bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500" />
          <button v-if="urlInput.length > 0" @click="loadFromUrl(urlInput)" class="inline-flex items-center md:grow-0 border rounded-md h-10 md:ml-1 mt-1 md:mt-0 py-1 px-2 hover:bg-gray-200 shadow-sm">
            <span>Load file</span>
          </button>
        </div>
        <Alert v-if="urlLoadError" message="File load failed - check CORS policy!" class="mt-3"/>
        <span>or</span>
        <DragAndDrop @file-upload="processFileUpload" class="mt-2" />
      </div>
      <EthereumPublishDigest v-if="state.file" :digest="state.digest" />
      <Badge v-if="embedBadge"/>
      <div class="flex flex-row justify-center items-center mt-2">
        <button class="inline-flex items-center mx-1 border rounded-md py-1 px-2 hover:bg-gray-200 text-lg" v-if="state.file" @click="state.file = null">
          <font-awesome-icon class="mr-1" icon="fa-solid fa-chevron-left" />
          <span>Use another file</span>
        </button>
        <button v-if="state.urlPresent && state.file" class="inline-flex items-center mx-1 border rounded-md py-1 px-2 hover:bg-gray-200 text-lg" @click="embedBadge = !embedBadge">
          <span v-if="!embedBadge">Embed a badge</span>
          <span v-else>Hide</span>
        </button>
      </div>
      <RouterLink v-if="enableAbout && !state.file" to="/about" class="inline-flex items-center mx-2 border rounded-md py-1 px-2 hover:bg-gray-200 text-lg leading-tight md:leading-normal">
        <font-awesome-icon class="mr-2" icon="fa-solid fa-circle-info" />
        <span>Learn more about decentralized timestamping</span>
      </RouterLink>
    </div>
  </main>
</template>
