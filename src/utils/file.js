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
