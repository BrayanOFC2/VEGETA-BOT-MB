import yts from 'yt-search'
import fetch from 'node-fetch'

const handler = async (m, { conn, args, usedPrefix }) => {
    if (!args[0]) {
        return conn.sendMessage(m.chat, { text: `⚠️ Ingresa un título de YouTube.\n\nEjemplo:\n${usedPrefix}play Alan Walker` }, { quoted: m })
    }

    try {
        await m.react('👑')

        const results = await searchVideos(args.join(" "))
        if (!results.length) throw new Error('No se encontraron resultados.')

        const video = results[0]
        const thumbnail = await (await fetch(video.miniatura)).buffer()

        const caption = `
*📥 Descarga - YouTube*

📌 *Título:* ${video.titulo}
⏱️ *Duración:* ${video.duracion}
👤 *Autor:* ${video.canal}
🌐 *Url:* ${video.url}
        `.trim()

        await conn.sendMessage(m.chat, {
            image: thumbnail,
            caption,
            footer: 'VEGETA-BOT-MB',
            buttons: [
                {
                    buttonId: `${usedPrefix}ytmp3 ${video.url}`,
                    buttonText: { displayText: '🎧 Audio' },
                    type: 1,
                },
                {
                    buttonId: `${usedPrefix}ytmp4 ${video.url}`,
                    buttonText: { displayText: '📹 Video' },
                    type: 1,
                }
            ],
            headerType: 4
        }, { quoted: m })

        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('✖️')
        await conn.sendMessage(m.chat, { text: '✖️ Error al buscar el video.' }, { quoted: m })
    }
}

handler.help = ['play']
handler.tags = ['dl']
handler.command = ['play', 'play2']
export default handler

async function searchVideos(query) {
    try {
        const res = await yts(query)
        return res.videos.slice(0, 10).map(video => ({
            titulo: video.title,
            url: video.url,
            miniatura: video.thumbnail,
            canal: video.author.name,
            publicado: video.timestamp || 'No disponible',
            vistas: video.views || 'No disponible',
            duracion: video.duration.timestamp || 'No disponible'
        }))
    } catch (error) {
        console.error('Error en yt-search:', error.message)
        return []
    }
}