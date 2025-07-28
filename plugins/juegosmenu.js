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
  conn.sendMessage(m.chat, {
    text: texto,
    contextInfo: {
      mentionedJid: [m.sender]
    }
  }, { quoted: m })
}

handler.command = ['juegosmenu']
handler.help = ['juegosmenu']
handler.tags = ['game']

export default handler