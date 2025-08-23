import fetch from 'node-fetch'
import yts from 'yt-search'
import axios from 'axios'

const MAX_AUDIO_SIZE = 64 * 1024 * 1024 // 64 MB
const MAX_VIDEO_SIZE = 64 * 1024 * 1024 // 64 MB para reproducible

// 🎯 Validador de enlaces YouTube
const isValidYouTubeUrl = url =>
  /^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(url)

// 📏 Formatear tamaño
function formatSize(bytes) {
  if (!bytes || isNaN(bytes)) return 'Desconocido'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let i = 0
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024
    i++
  }
  return `${bytes.toFixed(2)} ${units[i]}`
}

// ======================
// 🎧 HANDLER YTMP3
// ======================
const ytmp3Handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) return conn.reply(m.chat, `✳️ Uso: ${usedPrefix}${command} <nombre o enlace>`, m)
    
    // Buscar video si no es URL
    let url = text
    if (!isValidYouTubeUrl(text)) {
      const search = await yts(text)
      if (!search.all || search.all.length === 0) return conn.reply(m.chat, '❌ No se encontraron resultados.', m)
      url = search.all[0].url
    }

    const api = `https://myapiadonix.vercel.app/api/ytmp3?url=${encodeURIComponent(url)}`
    const res = await fetch(api)
    if (!res.ok) throw new Error(`Error en API: ${res.status}`)
    const json = await res.json()
    if (!json.data || !json.data.download) throw new Error('No se obtuvo enlace de audio')

    const audioRes = await fetch(json.data.download)
    if (!audioRes.ok) throw new Error(`Error al descargar audio: ${audioRes.status}`)
    const buffer = Buffer.from(await audioRes.arrayBuffer())
    const sizeMB = buffer.length / (1024 * 1024)

    if (sizeMB > MAX_AUDIO_SIZE) {
      return conn.reply(m.chat, `⚠️ Audio demasiado grande (${sizeMB.toFixed(2)} MB). Descárgalo aquí:\n${json.data.download}`, m)
    }

    await conn.sendMessage(m.chat, {
      audio: buffer,
      mimetype: 'audio/mpeg',
      ptt: false
    }, { quoted: m })

    m.react('✅')
  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `❌ Error: ${e.message}`, m)
  }
}

ytmp3Handler.command = ['ytmp3']
ytmp3Handler.tags = ['downloader']

// ======================
// 📽️ HANDLER YTMP4
// ======================
const ytmp4Handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) return conn.reply(m.chat, `✳️ Uso: ${usedPrefix}${command} <enlace de YouTube>`, m)
    if (!isValidYouTubeUrl(text)) return conn.reply(m.chat, '❌ Enlace inválido', m)

    // Descargar info y URL
    const { url, title } = await (async () => {
      const videoId = text.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?/]+)/)?.[1]
      if (!videoId) throw new Error('No se pudo obtener ID de video')
      const res = await fetch(`https://myapiadonix.vercel.app/api/ytmp4?url=${encodeURIComponent(text)}`)
      if (!res.ok) throw new Error('Error en API de video')
      const json = await res.json()
      if (!json.data || !json.data.download) throw new Error('No se obtuvo enlace de video')
      return { url: json.data.download, title: json.data.title || 'Video' }
    })()

    const size = await (async () => {
      try {
        const head = await axios.head(url)
        return parseInt(head.headers['content-length'], 10) || 0
      } catch { return 0 }
    })()

    const isLarge = size > MAX_VIDEO_SIZE
    if (isLarge) {
      return conn.reply(m.chat, `⚠️ Video demasiado grande (${formatSize(size)}). Descárgalo aquí:\n${url}`, m)
    }

    const buffer = await fetch(url).then(r => r.buffer())
    await conn.sendMessage(m.chat, {
      video: buffer,
      mimetype: 'video/mp4',
      caption: `🎬 ${title}`
    }, { quoted: m })

    m.react('✅')
  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `❌ Error: ${e.message}`, m)
  }
}

ytmp4Handler.command = ['ytmp4']
ytmp4Handler.tags = ['downloader']

export { ytmp3Handler, ytmp4Handler }