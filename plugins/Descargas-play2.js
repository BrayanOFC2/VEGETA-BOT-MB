import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`✨ Ingresa un texto para buscar en YouTube.\n> *Ejemplo:* ${usedPrefix + command} Shakira`);

  try {
    // Buscar video
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

    // Descargar video usando VeVioz API
    const videoApi = `https://api.vevioz.com/@api/button/videos/${video.url}`;
    const videoResp = await fetch(videoApi);
    const videoData = await videoResp.json();

    if (videoData?.mp4?.length) {
      await conn.sendMessage(m.chat, {
        video: { url: videoData.mp4[0].url },
        caption: `🎬 Aquí tienes tu video: ${video.title}`,
        fileName: `${video.title}.mp4`
      }, { quoted: m });
    }

    // Descargar audio usando VeVioz API
    const audioApi = `https://api.vevioz.com/@api/button/audio/${video.url}`;
    const audioResp = await fetch(audioApi);
    const audioData = await audioResp.json();

    if (audioData?.mp3?.length) {
      await conn.sendMessage(m.chat, {
        audio: { url: audioData.mp3[0].url },
        mimetype: 'audio/mpeg',
        fileName: `${video.title}.mp3`
      }, { quoted: m });
    }

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