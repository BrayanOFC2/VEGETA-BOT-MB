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

    const video = searchData.data[0];
    const videoDetails = `
🎵 *Título:* ${video.title}
📺 *Canal:* ${video.author.name}
⏱️ *Duración:* ${video.duration}
👀 *Vistas:* ${video.views}
📅 *Publicado:* ${video.publishedAt}
🌐 *Enlace:* ${video.url}
`;

    await conn.sendMessage(m.chat, {
      image: { url: video.image },
      caption: videoDetails.trim()
    }, { quoted: m });

    try {
      const downloadVideoApi = `https://api.vevioz.com/@api/button/videos/${video.url}`;
      const downloadVideoResponse = await fetch(downloadVideoApi);
      const downloadVideoData = await downloadVideoResponse.json();

      if (downloadVideoData?.mp4?.length) {
        await conn.sendMessage(m.chat, {
          video: { url: downloadVideoData.mp4[0].url },
          caption: `🎬 Aquí tienes tu video: ${video.title}`,
          fileName: `${video.title}.mp4`
        }, { quoted: m });
      }
    } catch {}

    try {
      const downloadAudioApi = `https://api.vevioz.com/@api/button/audio/${video.url}`;
      const downloadAudioResponse = await fetch(downloadAudioApi);
      const downloadAudioData = await downloadAudioResponse.json();

      if (downloadAudioData?.mp3?.length) {
        await conn.sendMessage(m.chat, {
          audio: { url: downloadAudioData.mp3[0].url },
          mimetype: 'audio/mpeg',
          fileName: `${video.title}.mp3`
        }, { quoted: m });
      }
    } catch {}

    await m.react("✅");
  } catch (error) {
    console.error(error);
    m.reply(`❌ Error al procesar la solicitud:\n${error.message}`);
  }
};

handler.command = ['play2'];
handler.help = ['play2 <texto>'];
handler.tags = ['media'];

export default handler;