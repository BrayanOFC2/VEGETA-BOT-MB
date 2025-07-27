const handler = async (m, { conn, text, usedPrefix, command }) => {
  const emoji = '🛠️';
  const done = '✅';

  if (!text) {
    throw `${emoji} No se encontró ningún prefijo. Por favor, escribe un nuevo prefijo.\n> *Ejemplo:* ${usedPrefix + command} !`;
  }

  if (text.length > 3) {
    throw `${emoji} El prefijo no puede tener más de 3 caracteres.`;
  }

  const escapedPrefix = text.replace(/[|\\{}()[\]^$+*?.\-]/g, '\\$&');
  global.prefix = new RegExp('^[' + escapedPrefix + ']');
  global.opts.prefix = text;

  conn.fakeReply(
    m.chat,
    `${done} *Prefijo actualizado con éxito.*\n> *Nuevo prefijo:* ${text}`,
    '0@s.whatsapp.net',
    '✨ NUEVO PREFIJO ✨'
  );
};

handler.help = ['prefix <nuevo_prefijo>'];
handler.tags = ['owner'];
handler.command = ['prefix'];
handler.rowner = true;

export default handler;