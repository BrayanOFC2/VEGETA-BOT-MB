//creado y editado por BrayanOFC 
import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix }) => {
  try {
    let texto = `
⚔️ *MENÚ RPG Z — VEGETA BOT MB* ⚔️

Sumérgete en el mundo Saiyajin y desarrolla tu poder al máximo:

➤ ${usedPrefix}perfil
➤ ${usedPrefix}mision
➤ ${usedPrefix}cazar
➤ ${usedPrefix}trabajar
➤ ${usedPrefix}aventura
➤ ${usedPrefix}banco
➤ ${usedPrefix}comprar [objeto]
➤ ${usedPrefix}curar
➤ ${usedPrefix}inventario
➤ ${usedPrefix}transferir [cantidad] @tag
➤ ${usedPrefix}top
➤ ${usedPrefix}nivel

👊 ¡Despierta tu *KI* y evoluciona como un verdadero guerrero Z!
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
    await conn.sendMessage(m.chat, { text: 'Error al enviar el menú RPG.' }, { quoted: m })
    console.error(e)
  }
}

handler.command = ['menurpg']
handler.help = ['menurpg']
handler.tags = ['rpg']

export default handler