import fetch from 'node-fetch';
import yts from 'yt-search';

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('✨ Ingresa un texto para buscar en YouTube.');

  try {
    // Buscar video
    const search = await yts(text);
    const video = search.videos[0];
    if (!video) return m.reply(`⚠️ No se encontraron resultados para "${text}".`);

    // Enviar info del video
    const videoDetails = `
🎵 *Título:* ${video.title}
📺 *Canal:* ${video.author.name}
⏱️ *Duración:* ${video.timestamp}
👀 *Vistas:* ${video.views}
📅 *Publicado:* ${video.ago}
🌐 *Enlace:* ${video.url}
    `;

    await conn.sendMessage(m.chat, {
      image: { url: video.thumbnail },
      caption: videoDetails.trim()
    }, { quoted: m });

    // API de Y2mate para obtener enlace de video MP4
    const y2mateApi = `https://api.y2mate.com/youtube?url=${video.url}&format=mp4`;
    const response = await fetch(y2mateApi);
    const data = await response.json();

    if (!data || !data.links || !data.links.length) return m.reply('❌ No se pudo generar el enlace del video.');

    const mp4Link = data.links.find(link => link.quality === '480p')?.url || data.links[0].url;

    // Enviar video MP4
    await conn.sendFile(m.chat, mp4Link, `${video.title}.mp4`, video.title, m);

    await m.react('✅');

  } catch (error) {
    console.error(error);
    m.reply(`❌ Error al procesar la solicitud:\n${error.message}`);
  }
};

handler.command = ['play2'];
handler.help = ['play2 <texto>'];
handler.tags = ['media'];

export default handler;