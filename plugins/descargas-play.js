import yts from 'yt-search';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) {
      return conn.reply(
        m.chat,
        `⚠️ *Debes escribir algo para buscar en YouTube.*\n\n🎯 *Ejemplo:* ${usedPrefix + command} Enemy Imagine Dragons`,
        m
      );
    }

    const search = await yts(text);
    const videos = search.videos.slice(0, 3);

    if (!videos.length) {
      return conn.reply(
        m.chat,
        `❌ *No encontré resultados.*\n\n🔁 Intenta con otro título.`,
        m
      );
    }

    for (let i = 0; i < videos.length; i++) {
      const v = videos[i];
      const messageText = `╭━━━ 🎬 *YOUTUBE VEGETA* 🎬 ━━━╮
┃
┃ 🔢 *Resultado:* ${i + 1}
┃ ✨ *Título:* ${v.title}
┃ 🧑‍🎤 *Canal:* ${v.author.name}
┃ ⏳ *Duración:* ${v.timestamp}
┃ 📅 *Publicado:* ${v.ago}
┃ 👁️ *Vistas:* ${v.views.toLocaleString()}
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯
⚡ *Selecciona el formato para descargar:*`;

      await conn.sendMessage(m.chat, {
        image: { url: v.thumbnail },
        caption: messageText,
        buttons: [
          { buttonId: `${usedPrefix}ytmp3 ${v.url}`, buttonText: { displayText: '🎧 Descargar AUDIO' }, type: 1 },
          { buttonId: `${usedPrefix}ytmp4 ${v.url}`, buttonText: { displayText: '📽 Descargar VIDEO' }, type: 1 },
        ],
        headerType: 4
      }, { quoted: m });
    }

    m.react('🚀');
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, '❌ Ocurrió un error al procesar tu búsqueda. Intenta nuevamente.', m);
  }
};

handler.command = ['play', 'playvid', 'play2'];
handler.tags = ['downloader'];
handler.limit = 6;
handler.group = false;

export default handler;