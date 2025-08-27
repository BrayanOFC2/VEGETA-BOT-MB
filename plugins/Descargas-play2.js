import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`✨ Ingresa un texto para buscar en YouTube.`);

  try {
    // Buscar video
    const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${text}`;
    const searchData = await (await fetch(searchApi)).json();
    const video = searchData.data[0];

    await conn.sendMessage(m.chat, {
      image: { url: video.image },
      caption: `🎵 *${video.title}*`
    }, { quoted: m });

    // Obtener información del video
    const infoApi = `https://youtube-download-api.matheusishiyama.repl.co/info/?url=${video.url}`;
    const infoData = await (await fetch(infoApi)).json();

    if (!infoData.title || !infoData.thumbnail) {
      return m.reply("❌ No se pudo obtener la información del video.");
    }

    // Descargar video en MP4
    const mp4Api = `https://youtube-download-api.matheusishiyama.repl.co/mp4/?url=${video.url}`;
    const mp4Data = await (await fetch(mp4Api)).buffer();

    await conn.sendMessage(m.chat, {
      video: mp4Data,
      caption: `🎬 ${infoData.title}`,
      fileName: `${infoData.title}.mp4`
    }, { quoted: m });

    // Descargar audio en MP3
    const mp3Api = `https://youtube-download-api.matheusishiyama.repl.co/mp3/?url=${video.url}`;
    const mp3Data = await (await fetch(mp3Api)).buffer();

    await conn.sendMessage(m.chat, {
      audio: mp3Data,
      mimetype: 'audio/mpeg',
      fileName: `${infoData.title}.mp3`
    }, { quoted: m });

    await m.react("✅");

  } catch (err) {
    console.error(err);
    m.reply(`❌ Error al procesar la solicitud:\n${err.message}`);
  }
};

handler.command = ['play2'];
handler.help = ['play2 <texto>'];
handler.tags = ['media'];

export default handler;