import { xpRange } from '../lib/levelling.js'
import ws from 'ws'

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
    let mode = global.opts["self"] ? "Modo Privado 🔒" : "Modo Público 🌀"
    let totalCommands = Object.keys(global.plugins).length
    let totalreg = Object.keys(global.db.data.users).length
    let uptime = clockString(process.uptime() * 1000)

    let help = Object.values(global.plugins).filter(p => !p.disabled).map(p => ({
      help: Array.isArray(p.help) ? p.help : (p.help ? [p.help] : []),
      tags: Array.isArray(p.tags) ? p.tags : (p.tags ? [p.tags] : []),
      limit: p.limit,
      premium: p.premium,
    }))

    let menuText = `
╭━━━『🐉 ${botname.toUpperCase()} | DRAGON MENU』━━━╮
┃ ⚡ Usuario Saiyajin: @${userId.split('@')[0]}
┃ 👑 Rango          : ${(conn.user.jid == global.conn.user.jid ? 'DIOS BrayanOFC 🅥' : 'SUB-BOT KAIO 🅑')}
┃ 🌌 Universo       : ${mode}
┃ 📊 Registro Z     : ${totalreg}
┃ ⏱️ Tiempo Activo  : ${uptime}
┃ 🛠️ Comandos Totales: ${totalCommands}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

💥 *⚔️ SECCIONES DEL TORNEO DEL PODER ⚔️* 💥
${Object.keys(tags).map(tag => {
  const cmds = help.filter(menu => menu.tags.includes(tag))
  if (cmds.length === 0) return ''
  return `
╭─〔 ${tags[tag]} ${getRandomEmoji()} 〕
${cmds.map(menu => menu.help.map(cmd =>
  `┃ ☁️ ${_p}${cmd}${menu.limit ? ' 🟡' : ''}${menu.premium ? ' 🔒' : ''}`
).join('\n')).join('\n')}
╰───────────────╯`
}).filter(Boolean).join('\n')}

🔥 *By BrayanOFC* 🔥
`.trim()

    await m.react('🐉')

    // Enviar video con canal
    await conn.sendMessage(m.chat, {
      video: { url: 'https://qu.ax/BYKaE.mp4' },
      gifPlayback: true,
      caption: '📺 Canal Oficial del Bot:\nhttps://whatsapp.com/channel/0029Vb9P9ZU0gcfNusD1jG3d',
      contextInfo: {
        externalAdReply: {
          title: 'Canal Oficial del Bot',
          body: 'Unete al canal oficial para actualizaciones',
          mediaUrl: 'https://whatsapp.com/channel/0029Vb9P9ZU0gcfNusD1jG3d',
          sourceUrl: 'https://whatsapp.com/channel/0029Vb9P9ZU0gcfNusD1jG3d',
          thumbnailUrl: 'https://i.imgur.com/2mK6dXh.jpeg',
          showAdAttribution: true
        },
        mentionedJid: [userId]
      }
    }, { quoted: m })

    // Enviar texto del menú
    await new Promise(res => setTimeout(res, 1000))
    await conn.sendMessage(m.chat, {
      text: menuText,
      mentions: [userId]
    }, { quoted: m })

  } catch (e) {
    conn.reply(m.chat, `✖️ Falló el menú.\n${e}`, m)
    throw e
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'allmenu', 'menú']
handler.register = true
export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function getRandomEmoji() {
  let emojis = ['🐉', '⚡', '🔥', '👑', '💥', '🌌']
  return emojis[Math.floor(Math.random() * emojis.length)]
}