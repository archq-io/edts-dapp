export function sha256_digest(file) {
  return new Promise((resolve, reject) => {
    file.arrayBuffer().then(value => {
      return crypto.subtle.digest('SHA-256', value)
    }).then(sha256 => {
      let d = Array.from(new Uint8Array(sha256)).map(b => b.toString(16).padStart(2, "0")).join("")
      resolve({digest: sha256, string: d})
    }).catch(e => {
      reject(e)
    })
  })
}

export function file_encode(file) {
  return new Promise((resolve, reject) => {
    file.arrayBuffer().then(value => {
      let binString = String.fromCodePoint(...new Uint8Array(value))
      let base64 = btoa(binString)
      resolve(encodeURIComponent(base64))
    })
  })
}

export function file_decode(base64, name = 'unknown_file', type = 'application/octet-stream') {
  return new Promise((resolve, reject) => {
    let binString = atob(decodeURIComponent(base64));
    let array = Uint8Array.from(binString, (m) => m.codePointAt(0));
    resolve(new File([array], name, {type: type}))
  })
}

export function bytesToBase64DataUrl(bytes, type = 'application/octet-stream') {
  return new Promise((resolve, reject) => {
    const reader = Object.assign(new FileReader(), {
      onload: () => resolve(reader.result),
      onerror: () => reject(reader.error),
    })
    reader.readAsDataURL(new File([bytes], "", { type }))
  })
}

export function dataUrlToBytes(dataUrl) {
  return new Promise((resolve, reject) => {
    fetch(dataUrl).then(res => {
      resolve(new Uint8Array(res.arrayBuffer()))
    }).catch(e => {
      reject(e)
    })
  })
}
