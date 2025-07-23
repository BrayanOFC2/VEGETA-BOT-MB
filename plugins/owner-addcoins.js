//créditos github.com/BrayanOFC
const handler = async (m, { conn, text, isOwner }) => {
  if (!isOwner) return m.reply('🚫 Solo los owners pueden usar este comando.');

  let [userInput, cantidadInput] = text.split(' ');
  let cantidad = parseInt(cantidadInput || userInput);

  if (isNaN(cantidad) || cantidad <= 0) return m.reply('🐉 Ingresa una cantidad válida.');

  let user;
  if (text.includes('@')) {
    user = m.mentionedJid?.[0];
  } else if (cantidadInput) {
    user = userInput.includes('@') ? userInput.replace(/[@\s]/g, '') + '@s.whatsapp.net' : m.sender;
  } else {
    user = m.sender;
  }

  global.db.data.users[user] = global.db.data.users[user] || {};
  global.db.data.users[user].dragones = (global.db.data.users[user].dragones || 0) + cantidad;

  const total = global.db.data.users[user].dragones;
  const tag = '@' + user.split('@')[0];

  conn.sendMessage(m.chat, {
    text: `🐉 *Dragones añadidos:*\n\n» ${cantidad} dragones a ${tag}\n📦 Total acumulado: ${total}`,
    mentions: [user]
  }, { quoted: m });
};

handler.command = 'adddragon';
handler.owner = true;

export default handler;