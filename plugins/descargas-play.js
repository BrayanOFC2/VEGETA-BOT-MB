import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`✨ Ingresa un texto para buscar en YouTube.\n> *Ejemplo:* ${usedPrefix + command} Shakira`);

  try {
    const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${text}`;
    const searchResponse = await fetch(searchApi);
    const searchData = await searchResponse.json();

    if (!searchData?.data || searchData.data.length === 0) {
      return m.reply(`⚠️ No se encontraron resultados para "${text}".`);
    }

    const video = searchData.data[0]; // Primer resultado
    const videoDetails = `
🎵 *Título:* ${video.title}
📺 *Canal:* ${video.author.name}
⏱️ *Duración:* ${video.duration}
👀 *Vistas:* ${video.views}
📅 *Publicado:* ${video.publishedAt}
🌐 *Enlace:* ${video.url}
`.trim();

    const buttons = [
      { buttonId: `.descargaraudio ${video.url}`, buttonText: { displayText: '🎧 Descargar Audio' }, type: 1 },
      { buttonId: video.url, buttonText: { displayText: '🌐 Ver en YouTube' }, type: 1 }
    ];

    const buttonMessage = {
      image: { url: video.image },
      caption: videoDetails,
      footer: '¿Qué deseas hacer?',
      buttons: buttons,
      headerType: 4
    };

    await conn.sendMessage(m.chat, buttonMessage, { quoted: m });

  } catch (error) {
    console.error(error);
    m.reply(`❌ Error al procesar la solicitud:\n${error.message}`);
  }
};

handler.command = ['play', 'playaudio'];
handler.help = ['play <texto>', 'playaudio <texto>'];
handler.tags = ['media'];

export default handler;

import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
  const url = args[0];
  if (!url) return m.reply('⚠️ Proporciona el enlace del video.');

  try {
    const downloadApi = `https://api.vreden.my.id/api/ytmp3?url=${url}`;
    const res = await fetch(downloadApi);
    const json = await res.json();

    if (!json?.result?.download?.url) {
      return m.reply("❌ No se pudo obtener el audio.");
    }

    await conn.sendMessage(m.chat, {
      audio: { url: json.result.download.url },
      mimetype: 'audio/mpeg',
      fileName: `${json.result.title || 'audio'}.mp3`
    }, { quoted: m });

    await m.react("✅");
  } catch (error) {
    console.error(error);
    m.reply(`❌ Error al descargar audio:\n${error.message}`);
  }
};

handler.command = ['descargaraudio'];
handler.help = ['descargaraudio <url>'];
handler.tags = ['media'];

export default handler;