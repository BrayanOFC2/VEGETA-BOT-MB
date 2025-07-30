import { xpRange } from '../lib/levelling.js'

let tags = {
  'serbot': 'SUB BOTS',
  'main': 'ZENO INFO',
  'owner': 'DIOS CREADOR',
  'nable': 'MODO SAIYAJIN',
  'cmd': 'ESFERAS',
  'advanced': 'TÉCNICAS',
  'game': 'COMBATE',
  'rpg': 'RPG Z',
  'group': 'UNIVERSO',
  'downloader': 'CAPSULE CORP',
  'sticker': 'FUSIONES',
  'audio': 'GRITOS',
  'search': 'RADAR',
  'tools': 'ARTEFACTOS',
  'fun': 'HUMOR Z',
  'anime': 'DB-ANIME',
  'nsfw': 'MAJIN',
  'premium': 'GOD KI',
  'weather': 'CLIMA Z',
  'news': 'NOTICIAS',
  'finance': 'ZENI',
  'education': 'MENTE Z',
  'health': 'SENZU',
  'entertainment': 'ARENA',
  'sports': 'TORNEO',
  'travel': 'KAIKAI',
  'food': 'RAMEN Z',
  'shopping': 'TIENDA DE BULMA',
  'productivity': 'MAQUINARIA Z',
  'social': 'REDES Z',
  'security': 'BARRERA',
  'custom': 'AURA PERSONAL'
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let userId = m.mentionedJid?.[0] || m.sender
    let user = global.db.data.users[userId] || {}
    let name = await conn.getName(userId)
    let uptime = clockString(process.uptime() * 1000)
    let totalCommands = Object.keys(global.plugins).length
    let totalreg = Object.keys(global.db.data.users).length

    let help = Object.values(global.plugins)
      .filter(p => !p.disabled)
      .map(p => ({
        help: Array.isArray(p.help) ? p.help : [p.help],
        tags: Array.isArray(p.tags) ? p.tags : [p.tags],
        limit: p.limit,
        premium: p.premium
      }))

    let menuText = `
╭━━━『🐉 ${botname?.toUpperCase() || 'ZENO BOT'} | DRAGON MENU』━━━╮
┃ ⚡ Usuario Saiyajin: @${userId.split('@')[0]}
┃ 👑 Rango: ${(conn.user.jid == global.conn.user.jid ? 'DIOS BrayanOFC 🅥' : 'SUB-BOT KAIO 🅑')}
┃ 🌌 Universo: ${global.opts["self"] ? "Modo Privado 🔒" : "Modo Público 🌀"}
┃ 📊 Registro Z: ${totalreg}
┃ 🛠️ Comandos Totales: ${totalCommands}
┃ ⏱️ Tiempo Activo: ${uptime}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

💥 *⚔️ SECCIONES DEL TORNEO DEL PODER ⚔️* 💥
${Object.keys(tags).map(tag => {
  const commands = help.filter(cmd => cmd.tags.includes(tag))
  if (commands.length === 0) return ''
  return `
╭───〔 ${tags[tag]} ${getRandomEmoji()} 〕───╮
${commands.map(cmd => cmd.help.map(h => `┃ ☁️ ${_p}${h}${cmd.limit ? ' 🟡' : ''}${cmd.premium ? ' 🔒' : ''}`).join('\n')).join('\n')}
╰━━━━━━━━━━━━━━━━━━━━╯`.trim()
}).join('\n\n')}

🔥 *Canal Oficial:*  
https://whatsapp.com/channel/0029Vb9P9ZU0gcfNusD1jG3d  
🔥 *By BrayanOFC*
`.trim()

    // Reacción
    await m.react('🐉')

    // Enviar el video con canal oficial arriba
    await conn.sendMessage(m.chat, {
      video: { url: 'https://qu.ax/BYKaE.mp4' },
      gifPlayback: true,
      caption: '📺 Canal Oficial del Bot:\nhttps://whatsapp.com/channel/0029Vb9P9ZU0gcfNusD1jG3d',
      contextInfo: {
        externalAdReply: {
          title: 'Canal Oficial del Bot',
          body: 'Toca para unirte al canal',
          mediaUrl: 'https://whatsapp.com/channel/0029Vb9P9ZU0gcfNusD1jG3d',
          sourceUrl: 'https://whatsapp.com/channel/0029Vb9P9ZU0gcfNusD1jG3d',
          thumbnailUrl: 'https://i.imgur.com/2mK6dXh.jpeg',
          showAdAttribution: true
        },
        mentionedJid: [userId]
      }
    }, { quoted: m })

    // Espera y envía el menú completo por separado
    await new Promise(resolve => setTimeout(resolve, 600))
    await conn.sendMessage(m.chat, { text: menuText, mentions: [userId] }, { quoted: m })

  } catch (e) {
    conn.reply(m.chat, '✖️ Error en el menú Dragon Ball\n\n' + e, m)
    throw e
  }
}

handler.help = ['menu', 'menú', 'allmenu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'allmenu']
handler.register = true

export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function getRandomEmoji() {
  const emojis = ['🐉', '⚡', '🔥', '👑', '💥', '🌌']
  return emojis[Math.floor(Math.random() * emojis.length)]
}