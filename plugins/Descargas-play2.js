import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`✨ Ingresa un texto para buscar en YouTube.`);

  try {
    // Buscar video
    const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${text}`;
    const searchResp = await fetch(searchApi);
    const searchData = await searchResp.json();

    if (!searchData?.data || searchData.data.length === 0)
      return m.reply(`⚠️ No se encontraron resultados para "${text}".`);

    const video = searchData.data[0];

    // Enviar información del video
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

    // Obtener información del video
    const infoResp = await fetch(`https://youtube-download-api.matheusishiyama.repl.co/info/?url=${video.url}`);
    const infoData = await infoResp.json();

    if (!infoData.title) return m.reply("❌ No se pudo obtener la información del video.");

    // Descargar y enviar video MP4
    const mp4Resp = await fetch(`https://youtube-download-api.matheusishiyama.repl.co/mp4/?url=${video.url}`);
    const mp4Buffer = await mp4Resp.buffer();

    await conn.sendMessage(m.chat, {
      video: mp4Buffer,
      caption: `🎬 ${infoData.title}`,
      fileName: `${infoData.title}.mp4`
    }, { quoted: m });

    // Descargar y enviar audio MP3
    const mp3Resp = await fetch(`https://youtube-download-api.matheusishiyama.repl.co/mp3/?url=${video.url}`);
    const mp3Buffer = await mp3Resp.buffer();

    await conn.sendMessage(m.chat, {
      audio: mp3Buffer,
      mimetype: 'audio/mpeg',
      fileName: `${infoData.title}.mp3`
    }, { quoted: m });

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