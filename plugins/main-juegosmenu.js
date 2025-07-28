import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix }) => {
  try {
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

    const videoUrl = 'https://qu.ax/BYKaE.mp4'
    const response = await fetch(videoUrl)
    const buffer = await response.buffer()

    await conn.sendMessage(m.chat, {
      video: buffer,
      caption: texto,
      gifPlayback: false,
      contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: m })
  } catch (e) {
    await conn.sendMessage(m.chat, { text: 'Error al enviar el menú de juegos.' }, { quoted: m })
    console.error(e)
  }
}

handler.command = ['menujuegos']
handler.help = ['menujuegos']
handler.tags = ['game']

export default handler