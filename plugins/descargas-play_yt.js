// play.js — Handler .play y botones YouTube (Baileys MD)
// by ChatGPT — diseñado para VEGETA-BOT-MB
// Requiere: yt-search, ytdl-core, file-type

import yts from 'yt-search'
import ytdl from 'ytdl-core'
import FileType from 'file-type'
import { writeFile, unlink } from 'fs/promises'
import { createWriteStream } from 'fs'
import path from 'path'
import os from 'os'

// ====== Protección anti-duplicados (un solo Set global) ======
const processed = new Set()
const markOnce = (id, ttlMs = 15000) => {
  if (!id) return false
  if (processed.has(id)) return false
  processed.add(id)
  setTimeout(() => processed.delete(id), ttlMs).unref?.()
  return true
}

// ====== Utilidades ======
const human = (ms) => {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  if (h) return `${h}h ${m % 60}m`
  if (m) return `${m}m ${s % 60}s`
  return `${s}s`
}

const tmpPath = (name) => path.join(os.tmpdir(), `${Date.now()}-${Math.random().toString(36).slice(2)}-${name}`)

const parseButtonPayload = (m) => {
  // Soporta: buttonsResponseMessage, listResponseMessage, interactiveResponseMessage (algunos forks)
  const btnId =
    m?.message?.buttonsResponseMessage?.selectedButtonId ||
    m?.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
    m?.message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson ||
    null

  if (!btnId) return null
  // En algunos forks paramsJson es JSON. Intentamos parsear.
  let payload = btnId
  try {
    if (btnId.startsWith('{')) {
      const j = JSON.parse(btnId)
      payload = j.id || j.payload || btnId
    }
  } catch {}
  return String(payload)
}

const buildCaption = (v) => {
  const lines = [
    `*${v.title}*`,
    `Autor: ${v.author?.name || 'Desconocido'}`,
    `Duración: ${v.timestamp || '-'}`,
    `Vistas: ${v.views?.toLocaleString?.() || v.views || '-'}`,
    `Publicado: ${v.ago || '-'}`,
    '',
    `ID: ${v.videoId}`,
    `URL: ${v.url}`,
  ]
  return lines.join('\n')
}

// ====== Envío de UI (compatible con la mayoría de forks MD) ======
async function sendResultCard(conn, jid, v, quoted) {
  const text = buildCaption(v)
  // Usamos buttonsMessage (ampliamente soportado). Si tu fork usa native flow,
  // este fallback sigue funcionando en la mayoría.
  const buttons = [
    { buttonId: `yt:mp3:${v.videoId}`, buttonText: { displayText: '🎧 Descargar Audio' }, type: 1 },
    { buttonId: `yt:mp4:${v.videoId}`, buttonText: { displayText: '📹 Descargar Video' }, type: 1 },
    { buttonId: `yt:open:${v.videoId}`, buttonText: { displayText: '▶️ Ver en YouTube' }, type: 1 },
  ]
  await conn.sendMessage(jid, { text, footer: 'VEGETA-BOT-MB • YouTube', buttons, headerType: 1 }, { quoted })
}

async function sendResultsList(conn, jid, results, quoted) {
  // Lista con hasta 10 resultados para elegir otro video
  const rows = results.slice(0, 10).map((v, i) => ({
    title: `${i + 1}. ${v.title}`.slice(0, 32),
    rowId: `yt:pick:${v.videoId}`,
    description: `${v.author?.name || 'Desconocido'} • ${v.timestamp || '-'} • ${v.views?.toLocaleString?.() || v.views || '-'} vistas`,
  }))
  const sections = [{ title: 'Resultados de YouTube', rows }]
  await conn.sendMessage(jid, {
    text: 'Elige un resultado:',
    footer: 'VEGETA-BOT-MB • YouTube',
    title: '🔎 Resultados',
    buttonText: 'Abrir lista',
    sections,
  }, { quoted })
}

// ====== Descargas ======
async function downloadAudio(videoId, maxDurationSec = 60 * 60, maxSizeMB = 20) {
  const info = await ytdl.getInfo(videoId)
  const durSec = parseInt(info.videoDetails.lengthSeconds || '0', 10)
  if (maxDurationSec && durSec > maxDurationSec) {
    throw new Error(`El video dura ${human(durSec * 1000)} y excede el límite de ${human(maxDurationSec * 1000)}.`)
  }

  // Elegimos formato de audio
  const stream = ytdl(videoId, {
    quality: 'highestaudio',
    filter: 'audioonly',
    highWaterMark: 1 << 25, // 32MB buffer
  })

  const out = tmpPath(`${videoId}.mp3`)
  const file = createWriteStream(out)
  let bytes = 0
  stream.on('data', (chunk) => {
    bytes += chunk.length
    if (bytes > maxSizeMB * 1024 * 1024) {
      stream.destroy(new Error(`El archivo superó ${maxSizeMB} MB.`))
    }
  })

  await new Promise((resolve, reject) => {
    stream.pipe(file)
    stream.on('error', reject)
    file.on('finish', resolve)
    file.on('error', reject)
  })

  const type = await FileType.fromFile(out)
  const mimetype = type?.mime || 'audio/mpeg'
  return { path: out, mimetype, bytes }
}

async function downloadVideo(videoId, maxDurationSec = 60 * 60, maxSizeMB = 40) {
  const info = await ytdl.getInfo(videoId)
  const durSec = parseInt(info.videoDetails.lengthSeconds || '0', 10)
  if (maxDurationSec && durSec > maxDurationSec) {
    throw new Error(`El video dura ${human(durSec * 1000)} y excede el límite de ${human(maxDurationSec * 1000)}.`)
  }

  // 360p para mantener tamaño razonable
  const stream = ytdl(videoId, {
    quality: 18, // mp4 360p
    filter: (f) => f.container === 'mp4' && f.hasAudio && f.hasVideo,
    highWaterMark: 1 << 25,
  })

  const out = tmpPath(`${videoId}.mp4`)
  const file = createWriteStream(out)
  let bytes = 0
  stream.on('data', (chunk) => {
    bytes += chunk.length
    if (bytes > maxSizeMB * 1024 * 1024) {
      stream.destroy(new Error(`El archivo superó ${maxSizeMB} MB.`))
    }
  })

  await new Promise((resolve, reject) => {
    stream.pipe(file)
    stream.on('error', reject)
    file.on('finish', resolve)
    file.on('error', reject)
  })

  const type = await FileType.fromFile(out)
  const mimetype = type?.mime || 'video/mp4'
  return { path: out, mimetype, bytes }
}

// ====== Handler del comando .play ======
export const playHandler = async (m, { conn, text, usedPrefix, command }) => {
  const unique = `${m.key?.id || ''}:${m.key?.participant || m.sender || ''}:${command}:${text || ''}`
  if (!markOnce(unique)) return

  if (!text) {
    return conn.sendMessage(m.chat, { text: `Uso:\n${usedPrefix}${command} <canción o enlace>\n\nEjemplo: ${usedPrefix}${command} Mix Alan Walker` }, { quoted: m })
  }

  try {
    // Si es URL directa de YouTube, tomamos ese ID
    let picked
    if (ytdl.validateURL(text)) {
      const id = ytdl.getURLVideoID(text)
      const info = await ytdl.getInfo(id)
      picked = {
        title: info.videoDetails.title,
        author: { name: info.videoDetails.author?.name },
        timestamp: human(+info.videoDetails.lengthSeconds * 1000),
        views: Number(info.videoDetails.viewCount || 0),
        ago: info.videoDetails.uploadDate || '-',
        videoId: id,
        url: `https://youtu.be/${id}`,
      }
    } else {
      const s = await yts.search({ query: text, hl: 'es', gl: 'MX' })
      const vids = s.videos || []
      if (!vids.length) throw new Error('No encontré resultados.')
      picked = vids[0] // por defecto mostramos el primero
      // Enviamos lista para elegir otro si quiere
      sendResultsList(conn, m.chat, vids, m).catch(() => {})
    }

    // Enviamos tarjeta con botones para el resultado elegido
    await sendResultCard(conn, m.chat, picked, m)
  } catch (e) {
    await conn.sendMessage(m.chat, { text: `⚠️ Error en la búsqueda: ${e.message}` }, { quoted: m })
  }
}

// ====== Handler de botones / respuestas interactivas ======
export const buttonsHandler = async (m, { conn }) => {
  const payload = parseButtonPayload(m)
  if (!payload) return
  if (!/^yt:(mp3|mp4|open|pick):[A-Za-z0-9_-]{6,}$/.test(payload)) return

  // Anti-duplicado por botón (solo una vez)
  const unique = `btn:${m.key?.id || ''}:${payload}`
  if (!markOnce(unique)) return

  const [, action, videoId] = payload.split(':')
  try {
    if (action === 'open') {
      const url = `https://youtu.be/${videoId}`
      // Solo texto (no mezclamos audio/video aquí)
      return conn.sendMessage(m.chat, { text: `Aquí tienes:\n${url}` }, { quoted: m })
    }

    if (action === 'pick') {
      // El usuario eligió otro resultado desde la lista -> mostramos tarjeta de ese ID
      const info = await ytdl.getInfo(videoId)
      const v = {
        title: info.videoDetails.title,
        author: { name: info.videoDetails.author?.name },
        timestamp: human(+info.videoDetails.lengthSeconds * 1000),
        views: Number(info.videoDetails.viewCount || 0),
        ago: info.videoDetails.uploadDate || '-',
        videoId,
        url: `https://youtu.be/${videoId}`,
      }
      return sendResultCard(conn, m.chat, v, m)
    }

    // Enviar *solo* audio o *solo* video según el botón
    if (action === 'mp3') {
      await conn.sendMessage(m.chat, { text: '⏳ Descargando audio…' }, { quoted: m })
      const file = await downloadAudio(videoId)
      try {
        await conn.sendMessage(
          m.chat,
          { audio: { url: file.path }, mimetype: file.mimetype, ptt: false, fileName: `${videoId}.mp3` },
          { quoted: m }
        )
      } finally {
        await unlink(file.path).catch(() => {})
      }
      return
    }

    if (action === 'mp4') {
      await conn.sendMessage(m.chat, { text: '⏳ Descargando video…' }, { quoted: m })
      const file = await downloadVideo(videoId)
      try {
        await conn.sendMessage(
          m.chat,
          { video: { url: file.path }, mimetype: file.mimetype, fileName: `${videoId}.mp4`, caption: `https://youtu.be/${videoId}` },
          { quoted: m }
        )
      } finally {
        await unlink(file.path).catch(() => {})
      }
      return
    }
  } catch (e) {
    await conn.sendMessage(m.chat, { text: `⚠️ Error: ${e.message}` }, { quoted: m })
  }
}

// ====== Registro (ejemplo para tu loader de comandos) ======
// En tu router de mensajes principal, agrega:
// if (/^play$/i.test(command)) await playHandler(m, { conn, text, usedPrefix, command })
// // y para *todos* los mensajes entrantes (porque los botones llegan como mensajes):
// await buttonsHandler(m, { conn })

// ====== Notas importantes ======
// 1) Duplicados: usamos *solo un* Set (processed) y NUNCA volvemos a marcar por message.key.id en otra parte.
// 2) Solo un tipo de mensaje por acción: en botón mp3/mp4 no mandamos también texto extra (salvo el aviso “Descargando…”).
// 3) Límites: ajusta maxSizeMB y maxDurationSec si tu hosting permite más.
// 4) Si tu fork usa "nativeFlowMessage" y quieres modernizar UI, se puede actualizar sendResultCard para ese formato.
// 5) Si quieres *desactivar viewOnce* en medios, añade { viewOnce: false } donde corresponda en tu sendMessage.