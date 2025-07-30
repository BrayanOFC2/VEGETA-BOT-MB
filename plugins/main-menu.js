await conn.sendMessage(m.chat, {
  video: { url: 'https://qu.ax/BYKaE.mp4' },
  gifPlayback: true,
  caption: '*Menú cargando...*',
  contextInfo: {
    externalAdReply: {
      title: 'Canal Oficial BrayanOFC',
      body: 'Únete para novedades y más',
      mediaUrl: 'https://t.me/BrayanOFC_Channel',
      sourceUrl: 'https://t.me/BrayanOFC_Channel',
      thumbnailUrl: 'https://telegra.ph/file/3b22c24c5e7ef18bc6e68.jpg',
      showAdAttribution: true
    }
  }
}, { quoted: m })

await conn.sendMessage(m.chat, { text: menuText, mentions: [userId] }, { quoted: m })