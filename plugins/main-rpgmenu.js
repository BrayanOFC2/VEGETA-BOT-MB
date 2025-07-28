let handler = async (m, { conn, usedPrefix }) => {
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
  conn.sendMessage(m.chat, {
    text: texto,
    contextInfo: {
      mentionedJid: [m.sender]
    }
  }, { quoted: m })
}

handler.command = ['rpgmenu']
handler.help = ['rpgmenu']
handler.tags = ['rpg']

export default handler