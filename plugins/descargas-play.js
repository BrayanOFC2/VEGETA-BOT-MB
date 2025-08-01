import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`✨ Ingresa un texto para buscar en YouTube.\n\n📌 *Ejemplo:* ${usedPrefix + command} Shakira`);

  try {
    const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`;
    const searchResponse = await fetch(searchApi);
    const searchData = await searchResponse.json();

    if (!searchData?.data || searchData.data.length === 0) {
      return m.reply(`⚠️ No se encontraron resultados para *"${text}"*.`);
    }

    const video = searchData.data[0];
    const videoInfo = `
🎵 *Título:* ${video.title}
📺 *Canal:* ${video.author.name}
⏱️ *Duración:* ${video.duration}
👀 *Vistas:* ${video.views}
📅 *Publicado:* ${video.publishedAt}
🌐 *Enlace:* ${video.url}
`.trim();

    const template = {
      image: { url: video.image },
      caption: videoInfo,
      footer: 'Selecciona una opción:',
      templateButtons: [
        { index: 1, urlButton: { displayText: '🌐 Ver en YouTube', url: video.url } },
        { index: 2, callButton: { displayText: '📞 Contactar Creador', phoneNumber: '5210000000000' } },
        { index: 3, quickReplyButton: { displayText: '🎵 Descargar Audio', id: `${usedPrefix}ytmp3 ${video.url}` } },
        { index: 4, quickReplyButton: { displayText: '🎬 Descargar Video', id: `${usedPrefix}ytmp4 ${video.url}` } },
      ]
    };

    await conn.sendMessage(m.chat, template, { quoted: m });
    await m.react("✅");
  } catch (error) {
    console.error(error);
    m.reply(`❌ Error al procesar la solicitud:\n${error.message}`);
  }
};

handler.command = ['play', 'playaudio'];
handler.help = ['play <texto>', 'playaudio <texto>'];
handler.tags = ['media'];

export default handler;