let handler = async (m, { conn, usedPrefix }) => {
  const text = `
🎯 *FREE FIRE PVP MENU*

📢 Bienvenido al menú de PvP Free Fire. Aquí puedes organizar tus 1v1, clanes, desafíos y más.

╭━━🔰 *PVP BÁSICO* 🔰━━
┃ 🥷 ${usedPrefix}retar @usuario
┃ 💢 ${usedPrefix}aceptar
┃ ❌ ${usedPrefix}rechazar
┃ 🎮 ${usedPrefix}vs @usuario
┃ 🔄 ${usedPrefix}reiniciarvs
╰━━━━━━━━━━━━━━━━━━

╭━━🏆 *REGISTRO & CLASIFICACIÓN* 🏆━━
┃ 📝 ${usedPrefix}registroff Nombre|ID
┃ 📊 ${usedPrefix}rankingff
┃ 🔝 ${usedPrefix}topff
┃ 🧾 ${usedPrefix}perfilff @usuario
╰━━━━━━━━━━━━━━━━━━━━━━

╭━━👥 *CLANES* 👥━━
┃ 🏰 ${usedPrefix}crearclan NombreClan
┃ ✨ ${usedPrefix}unirmeclan NombreClan
┃ 🛡️ ${usedPrefix}salirclan
┃ 🔥 ${usedPrefix}vsclan Clan1 vs Clan2
╰━━━━━━━━━━━━━━━━━━━

╭━━🧩 *OTROS COMANDOS* 🧩━━
┃ 📅 ${usedPrefix}torneo
┃ 🕹️ ${usedPrefix}sala
┃ 🧾 ${usedPrefix}reglaspvp
╰━━━━━━━━━━━━━━━━━━━━━━

👑 BrayanOFC | PvP Bot FF
`

  await m.react('🎮')
  await conn.sendMessage(m.chat, { text }, { quoted: m })
}

handler.help = ['pvp', 'menupvp']
handler.tags = ['pvp', 'freefire']
handler.command = /^(pvp|menupvp|menuff)$/i
export default handler