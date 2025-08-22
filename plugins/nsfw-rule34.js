
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix }) => {
  const emoji = '🔞'
  const emoji2 = '❌'

  if (m.isGroup && db?.data?.chats[m.chat] && !db.data.chats[m.chat].nsfw) {
    return m.reply(`${emoji} El contenido *NSFW* está desactivado en este grupo.\n> Un administrador puede activarlo con » *${usedPrefix}nsfw on*`)
  }

  if (!args[0]) {
    return conn.reply(m.chat, `${emoji} Por favor, ingresa un tag para realizar la búsqueda.\n\nEjemplo: *${usedPrefix}r34 anime*`, m)
  }

  const tag = args[0]
  const url = `https://rule34.xxx/index.php?page=post&s=list&tags=${encodeURIComponent(tag)}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (!data || data.length === 0) {
      return conn.reply(m.chat, `${emoji2} No hubo resultados para *${tag}*`, m)
    }

    const randomIndex = Math.floor(Math.random() * data.length)
    const randomImage = data[randomIndex]
    const imageUrl = randomImage.file_url

    await conn.sendMessage(
      m.chat,
      { image: { url: imageUrl }, caption: `${emoji} Resultados para » *${tag}*`, mentions: [m.sender] },
      { quoted: m }
    )
  } catch (error) {
    console.error(error)
    await m.reply(`${emoji2} Ocurrió un error al buscar.`)
  }
}

handler.help = ['r34 <tag>', 'rule34 <tag>']
handler.command = ['r34', 'rule34']
handler.tags = ['nsfw']

export default handler