import { xpRange } from '../lib/levelling.js'
import ws from 'ws';

let tags = {
  'serbot': 'SUB BOTS',
  'main': 'INFO',
  'owner': 'OWNER',
  'nable': 'ON / OFF',
  'cmd': 'DATABASE',
  'advanced': 'ADVANCED',
  'game': 'GAME',
  'rpg': 'RPG',
  'group': 'GROUPS',
  'downloader': 'DOWNLOAD',
  'sticker': 'STICKER',
  'audio': 'AUDIOS',
  'search': 'SEARCH',
  'tools': 'TOOLS',
  'fun': 'FUN',
  'anime': 'ANIME',
  'nsfw': 'NSFW',
  'premium': 'PREMIUM',
  'weather': 'WEATHER',
  'news': 'NEWS',
  'finance': 'FINANCE',
  'education': 'EDUCATION',
  'health': 'HEALTH',
  'entertainment': 'ENTERTAINMENT',
  'sports': 'SPORTS',
  'travel': 'TRAVEL',
  'food': 'FOOD',
  'shopping': 'SHOPPING',
  'productivity': 'PRODUCTIVITY',
  'social': 'SOCIAL',
  'security': 'SECURITY',
  'custom': 'CUSTOM'
};
let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
        let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    let mode = global.opts["self"] ? "Privado" : "Público";
    let totalCommands = Object.keys(global.plugins).length;
    let totalreg = Object.keys(global.db.data.users).length;
    let uptime = clockString(process.uptime() * 1000);
const users = [...new Set([
  ...(global.conns || []).filter(conn => 
    conn.user && conn.ws?.socket?.readyState !== ws.CLOSED
  )
])];

    if (!global.db.data.users[userId]) {
      global.db.data.users[userId] = { exp: 0, level: 1 };
    }

    //let name = await conn.getName(userId);
    let { exp, level } = global.db.data.users[userId];
    let { min, xp, max } = xpRange(level, global.multiplier);
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => ({
      help: Array.isArray(plugin.help) ? plugin.help : (plugin.help ? [plugin.help] : []),
      tags: Array.isArray(plugin.tags) ? plugin.tags : (plugin.tags ? [plugin.tags] : []),
      limit: plugin.limit,
      premium: plugin.premium,
    }));

    let menuText = `
╭━━━『👾 ${botname} 👾』━━━╮
┃ 🧑‍💻 𝗨𝘀𝘂𝗮𝗿𝗶𝗼 : @${userId.split('@')[0]}
┃ 🚀 𝗧𝗶𝗽𝗼     : ${(conn.user.jid == global.conn.user.jid ? '𝙋𝙍𝙄𝙉𝘾𝙄𝙋𝘼𝙇 🅥' : '𝙎𝙐𝘽-𝘽𝙊𝙏 🅑')}
┃ 🌐 𝗠𝗼𝗱𝗼     : ${mode}
┃ 🌍 𝗨𝘀𝘂𝗮𝗿𝗶𝗼𝘀 : ${totalreg}
┃ ⏳ 𝗨𝗽𝘁𝗶𝗺𝗲  : ${uptime}
┃ 💾 𝗖𝗼𝗺𝗮𝗻𝗱𝗼𝘀: ${totalCommands}
┃ 🤖 𝗦𝘂𝗯𝗕𝗼𝘁𝘀  : ${users.length}
╰━━━━━━━━━━━━━━━━━━━━━━━━━╯

🎮 *C A T E G O R Í A S  -  G A M E R* 🎮
${Object.keys(tags).map(tag => {
  const commandsForTag = help.filter(menu => menu.tags.includes(tag));
  if (commandsForTag.length === 0) return '';

  return `
╭───〔 🎯 ${tags[tag]} ${getRandomEmoji()} 〕───╮
${commandsForTag.map(menu => menu.help.map(help =>
  `┃ 🕹️ ${_p}${help}${menu.limit ? ' 🟡' : ''}${menu.premium ? ' 🔒' : ''}`
).join('\n')).join('\n')}
╰━━━━━━━━━━━━━━━━━━━━╯`;
}).filter(text => text !== '').join('\n')}

🔥 *𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗯𝘆 BrayanOFC - ${botname}* 🔥
'.trim();

    const vid = ['https://files.catbox.moe/13nqyi.mp4', 'https://files.catbox.moe/13nqyi.mp4']; 

let selectedImage = imageUrls[Math.floor(Math.random() * imageUrls.length)];

    await m.react('👑');

   /* await conn.sendMessage(m.chat, { 
      text: menuText.trim(),
      contextInfo: {
          mentionedJid: [m.sender],
          isForwarded: true,
          forwardingScore: 999,
          externalAdReply: {
              title: textbot,
              body: dev,
              thumbnailUrl: imageUrls,
              sourceUrl: redes,
              mediaType: 1,
              showAdAttribution: true,
              renderLargerThumbnail: true,
          },
      },
  }, { quoted: m })*/

        await conn.sendMessage(m.chat, {
  image: { url: selectedImage },
  caption: menuText,
contextInfo: {
            mentionedJid: [userId] }
}, { quoted: m });
      } catch (e) {
    conn.reply(m.chat, `✖️ Lo sentimos, el menú tiene un error. ${e} `, m);
    throw e;
  }
};

handler.help = ['menu', 'allmenu'];
handler.tags = ['main'];
handler.command = ['menu', 'allmenu', 'menú'];
handler.register = true;

export default handler;

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}

function getRandomEmoji() {
  const emojis = ['👑', '🔥', '🌟', '⚡'];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

function getLevelProgress(exp, min, max, length = 10) {
  if (exp < min) exp = min;
  if (exp > max) exp = max;
  let progress = Math.floor(((exp - min) / (max - min)) * length);
  progress = Math.max(0, Math.min(progress, length)); 
  let bar = '█'.repeat(progress) + '░'.repeat(length - progress);
  return `[${bar}]`;
}