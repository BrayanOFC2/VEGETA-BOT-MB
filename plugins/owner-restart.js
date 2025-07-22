let handler = async (m, { conn, isROwner, text }) => {
  if (!process.send) throw '*『✦』Para reiniciar el bot usa:* node start.js\n*o* node index.js'
  if (!isROwner) throw 'Solo el owner puede usar este comando.'

  await conn.sendMessage(m.chat, { text: '🚀 Reiniciando bot...' }, { quoted: m })
  process.send('reset')
}

handler.help = ['restart']
handler.tags = ['owner']
handler.command = ['restart', 'reiniciar'] 
handler.rowner = true

export default handler