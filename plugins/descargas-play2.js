// editado por ChatGPT
import fetch from "node-fetch";
import axios from "axios";

const formatAudio = ["mp3", "m4a", "webm", "acc", "flac", "opus", "ogg", "wav"];
const formatVideo = ["360", "480", "720", "1080"];

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format) && !formatVideo.includes(format)) throw new Error("⚠️ Formato no compatible.")
    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: { "User-Agent": "Mozilla/5.0" }
    }
    const response = await axios.request(config)
    if (!response.data?.success) throw new Error("⛔ No se pudo procesar el video.")
    const { id, title, info } = response.data
    const downloadUrl = await ddownr.cekProgress(id)
    return { id, title, image: info.image, downloadUrl }
  },

  cekProgress: async (id) => {
    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: { "User-Agent": "Mozilla/5.0" }
    }
    while (true) {
      const res = await axios.request(config)
      if (res.data?.success && res.data.progress === 1000) {
        return res.data.download_url
      }
      await new Promise(r => setTimeout(r, 5000))
    }
  }
}

const handler = async (m, { conn, text, command }) => {
  if (!text) return conn.reply(m.chat, "⚠️ Falta el enlace de YouTube", m)

  try {
    if (["ytmp3", "yta"].includes(command)) {
      const api = await ddownr.download(text, "mp3")
      await conn.sendMessage(m.chat, {
        audio: { url: api.downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${api.title}.mp3`,
      }, { quoted: m })
    }

    if (["ytmp4", "ytv"].includes(command)) {
      const api = await ddownr.download(text, "360") // default 360p
      await conn.sendMessage(m.chat, {
        video: { url: api.downloadUrl },
        mimetype: 'video/mp4',
        fileName: `${api.title}.mp4`,
        caption: "🎬 Aquí tienes tu video"
      }, { quoted: m })
    }
  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `❌ Error: ${e.message}`, m)
  }
}

handler.command = ["ytmp3", "yta", "ytmp4", "ytv"]
handler.tags = ["descargas"]

export default handler