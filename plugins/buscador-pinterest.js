import axios from 'axios'

const pins = async (judul) => {
  try {
    const res = await axios.get(`https://anime-xi-wheat.vercel.app/api/pinterest?q=${encodeURIComponent(judul)}`)
    if (Array.isArray(res.data.images)) {
      return res.data.images.map(url => ({
        image_large_url: url,
        image_medium_url: url,
        image_small_url: url
      }))
    }
    return []
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

let handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, `⚠️ Ingresa un texto. Ejemplo: .pinterest Naruto`, m)

  try {
    const res2 = await fetch('https://files.catbox.moe/875ido.png')
    const thumb2 = Buffer.from(await res2.arrayBuffer())

    const fkontak = {
      key: {
        participants: "0@s.whatsapp.net",
        remoteJid: "status@broadcast",
        fromMe: false,
        id: "Halo"
      },
      message: {
        locationMessage: {
          name: '𝗕𝗨𝗦𝗤𝗨𝗘𝗗𝗔 𝗗𝗘 ✦ 𝗣𝗶𝗻𝘁𝗲𝗿𝗲𝘀𝘁',
          jpegThumbnail: thumb2
        }
      },
      participant: "0@s.whatsapp.net"
    }

    m.react('🕒')
    const results = await pins(text)
    if (!results || results.length === 0) return conn.reply(m.chat, `No se encontraron resultados para "${text}".`, m)

    const maxImages = Math.min(results.length, 10) // máx 10 para no saturar
    for (let i = 0; i < maxImages; i++) {
      let url = results[i].image_large_url || results[i].image_medium_url || results[i].image_small_url

      await conn.sendMessage(m.chat, {
        image: { url },
        caption: i === 0 
          ? `𝗥𝗲𝘀𝘂𝗹𝘁𝗮𝗱𝗼𝘀 𝗱𝗲: ${text}\n𝗖𝗮𝗻𝘁𝗶𝗱𝗮𝗱 𝗱𝗲 𝗿𝗲𝘀𝘂𝗹𝘁𝗮𝗱𝗼𝘀: ${maxImages}` 
          : null,
        contextInfo: {
                  forwardedNewsletterMessageInfo: {
          newsletterJid: '120363394965381607@newsletter',
          newsletterName: '𝚅𝙴𝙶𝙴𝚃𝙰-𝙱𝙾𝚃-𝙼𝙱*:·',
          serverMessageId: 100
        }
      }
    }, { quoted: m })
      await new Promise(resolve => setTimeout(resolve, 800)) // delay entre fotos
    }

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch (error) {
    console.error(error)
    conn.reply(m.chat, '❌ Error al obtener imágenes de Pinterest.', m)
  }
}

handler.help = ['pinterest']
handler.command = ['pinterest', 'pin']
handler.tags = ['buscador']

export default handler