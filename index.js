require('dotenv').config()
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const utf8 = require('utf8')
const unzipper = require('unzipper')
var parseHeader = require('parse-http-header')

const {
  BASE_URL,
  SESSION,
  SECURE_SESSION,
  MUSIC_DIR,
  PLEX_URL,
  PLEX_TOKEN,
  PLEX_LIBRARY_ID
} = process.env

const account = axios.create({
  baseURL: BASE_URL,
  headers: {
    Cookie: `session=${SESSION}; secureSession=${SECURE_SESSION}`
  },
  withCredentials: true
})

const cacheFile = path.resolve((MUSIC_DIR || 'downloads'), '7d-dl.cache.json')

let cache

try {
  cache = fs.readFileSync(cacheFile)
  cache = JSON.parse(cache)
} catch (e) {
  cache = { downloaded: [] }
  fs.writeFileSync(cacheFile, JSON.stringify(cache))
}

if (!fs.existsSync('./downloads')) {
  fs.mkdirSync('./downloads')
}

const download = id => account.get(`/download/release/${id}`, {
  responseType: 'stream'
}).then(response => {
  let { filename } = parseHeader(response.headers['content-disposition'])
  filename = filename.replace(/\"/g, '')
  filename = utf8.decode(filename)
  console.log(`Downloading "${filename}"`)

  const file = path.resolve(__dirname, 'downloads', `${filename}.part`)
  response.data.pipe(fs.createWriteStream(file))
  response.data.on('end', () => {
    const zipFile = file.replace('.zip.part', '.zip')
    fs.renameSync(file, zipFile)
    console.log('Download complete!')
    markComplete(id)
    copy(zipFile)
  })
})

const markComplete = id => {
  cache.downloaded.push(id)
  fs.writeFileSync('cache.json', JSON.stringify(cache))
}

const copy = file => {
  const musicPath = MUSIC_DIR || path.resolve(__dirname, 'downloads')
  console.log(`Extracting ${file} to ${musicPath}`)
  const extract = fs.createReadStream(file)
    .pipe(unzipper.Extract({ path: musicPath }))

  extract.on('close', () => {
    console.log('Done extracting, deleting ZIP')
    fs.unlinkSync(file)
    plexScan()
  })
}

const plexScan = () => {
  if (PLEX_URL) {
    const plexUpdate = `${PLEX_URL}/library/sections/${PLEX_LIBRARY_ID}/refresh?X-Plex-Token=${PLEX_TOKEN}`
    console.log({ plexUpdate })
    axios.get(plexUpdate).then(() => {
      console.log('Triggered Plex scan')
    }).catch(err => {
      console.log('Error triggering Plex library refresh. Is your X-Plex-Token valid?')
    })
  }
}

account.get('/yourmusic', {
  Accept: 'application/json, text/javascript, */*; q=0.01',
  'X-Requested-With': 'XMLHttpRequest'
}).then(response => {
  const releases = response.data.ownedReleaseIds
  releases.forEach(release => {
    if (cache.downloaded.includes(release)) {
      // console.log(`Already downloaded ${release}`)
      return
    }
    download(release).catch(err => {
      console.log('Error trying to download track', err)
    })
  })
}).catch(err => {
  console.log('Error tring to access account', err)
})
