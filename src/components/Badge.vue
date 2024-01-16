<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { bytesToBase64DataUrl } from '@/utils/file.js'
  import badgeFlat from '@/assets/badges/badge-flat.svg'
  import badgeFlatSquare from '@/assets/badges/badge-flat-square.svg'
  import badgeForTheBadge from '@/assets/badges/badge-for-the-badge.svg'

  const route = useRoute()
  const router = useRouter()
  const badgeIndex = ref(2)
  const badgeMarkdown = ref(null)
  const baseUrl = window.location.origin

  const badgeSelection = computed(() => {
    switch (badgeIndex.value) {
      case 0:
        return badgeFlat
      case 1:
        return badgeFlatSquare
      case 2:
        return badgeForTheBadge
      default:
        return
    }
  })

  function prevBadge() {
    if (badgeIndex.value <= 0) {
      badgeIndex.value = 2
      updateBadgeHook()
      return
    }
    badgeIndex.value--
    updateBadgeHook()
  }

  function nextBadge() {
    if (badgeIndex.value >= 2) {
      badgeIndex.value = 0
      updateBadgeHook()
      return
    }
    badgeIndex.value++
    updateBadgeHook()
  }

  function updateBadgeHook() {
    createMarkdown(badgeSelection.value, route.query.url)
  }

  function createMarkdown(badge_url, url = route.query.url) {
    getBadgeAsBlob(badge_url).then(blob => {
      let resolved_url = router.resolve({
        name: 'dAppView',
        query: {
          url: url,
        },
      })
      badgeMarkdown.value = '[![Badge](' + blob + ')](' + baseUrl+resolved_url.href + ')'
    })
  }

  function getBadgeAsBlob(badge_url) {
    return new Promise((resolve, reject) => {
      fetch(badge_url).then(res => {
        let contentType = res.headers.get('Content-Type')
        res.arrayBuffer().then(buf => {
          bytesToBase64DataUrl(buf, contentType).then(base64 => {
            resolve(base64)
          })
        }).catch(e => {
          reject(e)
        })
      }).catch(e => {
        reject(e)
      })
    })
  }

  function copy(text) {
    window.navigator.clipboard.writeText(text)
  }

  onMounted(() => {
    updateBadgeHook()
  })
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <p>Select a badge</p>
    <img class="my-1" :src="badgeSelection"/>
    <div class="flex flex-row items-center justify-center my-1">
      <button class="inline-flex items-center mr-1 border rounded-md py-1 px-2 hover:bg-gray-200" @click="prevBadge">
        <font-awesome-icon class="mr-1" icon="fa-solid fa-chevron-left" />
        Previous
      </button>
      <button class="inline-flex items-center m-1 border rounded-md py-1 px-2 hover:bg-gray-200" @click="copy(badgeMarkdown)">
        <font-awesome-icon class="mr-1" icon="fa-solid fa-clipboard" />
        Copy
      </button>
      <button class="inline-flex items-center ml-1 border rounded-md py-1 px-2 hover:bg-gray-200" @click="nextBadge">
        Next
        <font-awesome-icon class="ml-1" icon="fa-solid fa-chevron-right" />
      </button>
    </div>
    <!-- <p class="w-[35rem] h-32 bg-gray-200 rounded-md my-1 p-2 overflow-scroll break-words">{{ badgeMarkdown }}</p> -->
  </div>
</template>

<style scoped></style>
