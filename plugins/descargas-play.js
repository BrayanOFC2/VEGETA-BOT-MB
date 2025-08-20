import yts from 'yt-search'
import fetch from 'node-fetch'

const handler = async (m, { conn, args, usedPrefix }) => {
    if (!args[0]) return conn.reply(m.chat, `⚠️ Ingresa un título de YouTube.\n\nEjemplo:\n${usedPrefix}play Alan Walker`, m)

    try {
        const search = await yts(args.join(" "))
        if (!search.videos.length) return conn.reply(m.chat, '☁️ No se encontró nada...', m)

        const video = search.videos[0]
        const thumb = await (await fetch(video.thumbnail)).buffer()

        const caption = `
🎶 *YouTube Downloader*
─────────────────────
🎵 *Título:* ${video.title}
⏱️ *Duración:* ${video.timestamp}
👤 *Canal:* ${video.author.name}
👁️ *Vistas:* ${video.views.toLocaleString()}
📅 *Publicado:* ${video.ago}
🔗 *Enlace:* ${video.url}
        `.trim()

        await conn.sendMessage(m.chat, {
            image: thumb,
            caption,
            footer: 'VEGETA-BOT-MB',
            buttons: [
                { buttonId: `${usedPrefix}ytmp3 ${video.url}`, buttonText: { displayText: '🎧 Audio' }, type: 1 },
                { buttonId: `${usedPrefix}ytmp4 ${video.url}`, buttonText: { displayText: '📹 Video' }, type: 1 }
            ],
            headerType: 4
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        conn.reply(m.chat, '✖️ Error en la búsqueda.', m)
    }
}

handler.help = ['play', 'play2']
handler.tags = ['downloader']
handler.command = ['play', 'play2']

export default handler