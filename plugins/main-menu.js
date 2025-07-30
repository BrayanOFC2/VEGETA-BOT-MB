// creado y editado por BrayanOFC
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
    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    let mode = global.opts["self"] ? "Modo Privado 🔒" : "Modo Público 🌀"
    let totalCommands = Object.keys(global.plugins).length
    let totalreg = Object.keys(global.db.data.users).length
    let uptime = clockString(process.uptime() * 1000)

    const users = [...new Set(
      (global.conns || []).filter(conn =>
        conn.user && conn.ws?.socket?.readyState !== ws.CLOSED
      )
    )]

    if (!user) {
      global.db.data.users[userId] = { exp: 0, level: 1 }
      user = global.db.data.users[userId]
    }

    let { exp, level } = user
    let { min, xp, max } = xpRange(level, global.multiplier)
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => ({
      help: Array.isArray(plugin.help) ? plugin.help : (plugin.help ?