let handler = async (m, { conn, usedPrefix }) => {
  let texto = `
🎮 *MENÚ DE JUEGOS Z — VEGETA BOT MB* 🎮

Aquí tienes los comandos para divertirte como un verdadero Saiyajin:

➤ ${usedPrefix}ppt (piedra/papel/tijera)
➤ ${usedPrefix}math (fácil | medio | difícil)
➤ ${usedPrefix}tictactoe @tag
➤ ${usedPrefix}adivinanza
➤ ${usedPrefix}dado
➤ ${usedPrefix}casino
➤ ${usedPrefix}love @tag
➤ ${usedPrefix}slot
➤ ${usedPrefix}pregunta

✨ ¡Prepárate para el Torneo del Humor y las Batallas!
`

  const imageUrl = 'https://i.imgur.com/ZXBtVw7.jpg'

  await conn.sendMessage(m.chat, {
    image: { url: imageUrl },
    caption: texto,
    contextInfo: {
      mentionedJid: [m.sender]
    }
  }, { quoted: m })
}

handler.command = ['menujuegos']
handler.help = ['menujuegos']
handler.tags = ['game']

export default handler