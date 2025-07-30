const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, '🍬 Por favor, ingresa un término de búsqueda.', m, rcanal)
  await m.react(rwait)

  conn.reply(m.chat, '🍭 Buscando imagen, espere un momento...', m, {
    contextInfo: {
      externalAdReply: {
        mediaUrl: null,
        mediaType: 1,
        showAdAttribution: true,
        title: packname,
        body: dev,
        previewType: 0,
        thumbnail: icons,
        sourceUrl: channel
      }
    }
  })

  try {
    let res = await fetch(`https://api.akuari.my.id/search/image?query=${encodeURIComponent(text)}`)
    let json = await res.json()
    if (!json.result || json.result.length === 0) return m.reply('🧸 No se encontraron resultados.')

    const messages = json.result.slice(0, 4).map((img, i) => [
      `Imagen ${i + 1}`,
      dev,
      img,
      [[]], [[]], [[]], [[]]
    ])

    await conn.sendCarousel(m.chat, `🍬 Resultado de ${text}`, '⪛✰ Imagen - Búsqueda ✰⪜', null, messages, m)
  } catch (e) {
    console.error(e)
    m.reply('⚠️ Hubo un error al buscar la imagen.')
  }
}

handler.help = ['imagen']
handler.tags = ['buscador', 'tools', 'descargas']
handler.command = ['image', 'imagen']
handler.register = true

export default handler