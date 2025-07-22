import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text, args }) => {
  // Si el comando es .descargarAudio, gestiona la descarga
  if (command === 'descargarAudio') {
    const url = args[0];
    if (!url || !url.includes('youtube')) return m.reply('⚠️ Enlace no válido. Usa el botón de descarga.');

    try {
      const apiUrl = `https://api.vreden.my.id/api/ytmp3?url=${url}`;
      const res = await fetch(apiUrl);
      const json = await res.json();

      if (!json?.result?.download?.url) return m.reply("❌ No se pudo obtener el audio.");

      await conn.sendMessage(m.chat, {
        audio: { url: json.result.download.url },
        mimetype: 'audio/mpeg',
        fileName: `${json.result.title}.mp3`
      }, { quoted: m });

      await m.react("✅");

    } catch (err) {
      console.error(err);
      return m.reply(`❌ Error al descargar audio:\n${err.message}`);
    }

    return;
  }

  // Si el comando es .play, realiza la búsqueda
  if (!text) return m.reply(`✨ Ingresa un texto para buscar en YouTube.\n> *Ejemplo:* ${usedPrefix + command} Shakira - Acróstico`);

  try {
    const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`;
    const searchRes = await fetch(searchApi);
    const searchData = await searchRes.json();

    if (!searchData?.data || searchData.data.length === 0) {
      return m.reply(`⚠️ No se encontraron resultados para "${text}".`);
    }

    const video = searchData.data[0]; // Primer resultado
    const caption = `
🎵 *Título:* ${video.title}
📺 *Canal:* ${video.author.name}
⏱️ *Duración:* ${video.duration}
👀 *Vistas:* ${video.views}
📅 *Publicado:* ${video.publishedAt}
🌐 *Enlace:* ${video.url}
`.trim();

    const buttons = [
      { buttonId: `${usedPrefix}descargarAudio ${video.url}`, buttonText: { displayText: '🎧 Descargar Audio' }, type: 1 },
      { buttonId: video.url, buttonText: { displayText: '🌐 Ver en YouTube' }, type: 1 }
    ];

    const buttonMessage = {
      image: { url: video.image },
      caption: caption,
      footer: '¿Qué deseas hacer?',
      buttons,
      headerType: 4
    };

    await conn.sendMessage(m.chat, buttonMessage, { quoted: m });

  } catch (error) {
    console.error(error);
    return m.reply(`❌ Error al procesar la solicitud:\n${error.message}`);
  }
};

handler.command = ['play', 'descargarAudio'];
handler.help = ['play <texto>'];
handler.tags = ['descargas'];

export default handler;