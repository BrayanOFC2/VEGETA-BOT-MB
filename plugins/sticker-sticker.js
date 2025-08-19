import { sticker} from '../lib/sticker.js'
import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import { webp2png} from '../lib/webp2mp4.js'

let handler = async (m, { conn, args, usedPrefix, command}) => {
  let stiker = false
  try {
    let q = m.quoted? m.quoted: m
    let mime = q.mimetype || q.mediaType || ''

    if (/webp|image|video/.test(mime)) {
      if (/video/.test(mime) && q.seconds> 15) {
        return m.reply('👑 ¡El video no puede durar más de 15 segundos!')
}

      let img = await q.download?.()
      if (!img) return conn.reply(m.chat, '🐉 Por favor, responde con una imagen o video para hacer un sticker.', m)

      let out
      try {
        stiker = await sticker(img, false, global.packsticker, global.packsticker2)
} catch (e) {
        console.error(e)
} finally {
        if (!stiker) {
          if (/webp/.test(mime)) out = await webp2png(img)
          else if (/image/.test(mime)) out = await uploadImage(img)
          else if (/video/.test(mime)) out = await uploadFile(img)
          if (typeof out!== 'string') out = await uploadImage(img)
          stiker = await sticker(false, out, global.packsticker, global.author)
}
}
} else if (args[0]) {
      if (isUrl(args[0])) {
        stiker = await sticker(false, args[0], global.packsticker, global.author)
} else {
        return m.reply('☁️ El URL es incorrecto...')
}
}
} catch (e) {
    console.error(e)
    if (!stiker) stiker = e
} finally {
    if (stiker) {
      await conn.sendFile(
        m.chat,
        stiker,
        'sticker.webp',
        '',
        m,
        null,
        true,
        {
          contextInfo: {
            forwardingScore: 200,
            isForwarded: false,
            externalAdReply: {
              showAdAttribution: false,
              title: global.packname,
              body: global.dev,
              mediaType: 2,
              sourceUrl: global.redes,
              thumbnail: global.icons
}
}
}
)
} else {
      return conn.reply(m.chat, '🐉 Por favor, responde con una imagen o video para hacer un sticker.', m)
}
}
}

handler.help = ['stiker <imagen>', 'sticker <url>']
handler.tags = ['sticker']
handler.group = true
handler.register = true
handler.command = ['s', 'sticker', 'stiker']

export default handler

const isUrl = (text) => {
  return /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(text)