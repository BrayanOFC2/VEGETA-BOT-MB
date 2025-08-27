import yts from "yt-search"

const handler = async (m, { conn, command, text }) => {
  if (!text) return m.reply("❌ Ingresa el nombre de la canción o link de YouTube")

  m.reply("🔎 Buscando...")

  // Buscar video
  const search = await yts(text)
  const video = search.videos[0]
  if (!video) return m.reply("⚠️ No encontré resultados")

  // Generar links a servicios externos (ytmp3 / ytmp4)
  let mp3 = `https://ytmp3.plus/${encodeURIComponent(video.url)}`
  let mp4 = `https://ytmp4.plus/${encodeURIComponent(video.url)}`

  // Mensaje con botones
  let caption = `🎶 *${video.title}*\n\n⏱️ Duración: ${video.timestamp}\n👀 Vistas: ${video.views}\n📅 Publicado: ${video.ago}`

          await conn.sendMessage(m.chat, {
            image: thumbnail,
            caption: messageText,
            footer: dev,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true
            },
            buttons: [
                {
                    buttonId: `${usedPrefix}ytmp3 ${video.url}`,
                    buttonText: { displayText: 'Audio' },
                    type: 1,
                },
                {
                    buttonId: `${usedPrefix}ytmp4 ${video.url}`,
                    buttonText: { displayText: 'Vídeo' },
                    type: 1,
                }
            ],
            headerType: 1,
            viewOnce: true
        }, { quoted: m });

handler.command = ["play", "play2"]
handler.tags = ["descargas"]

export default handler