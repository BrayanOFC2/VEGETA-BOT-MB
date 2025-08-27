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

    const convertApi = `https://api.sylphy.xyz/api/convert?url=${video.url}&format=mp4`;
    const convertData = await (await fetch(convertApi)).json();

    if (!convertData.url) return m.reply("❌ No se pudo obtener el video.");

    await conn.sendMessage(m.chat, {
      video: { url: convertData.url },
      caption: `🎬 ${video.title}`,
      fileName: `${video.title}.mp4`
    }, { quoted: m });

    // Convertir video a MP3
    const convertAudioApi = `https://api.sylphy.xyz/api/convert?url=${video.url}&format=mp3`;
    const audioData = await (await fetch(convertAudioApi)).json();

    if (!audioData.url) return m.reply("❌ No se pudo obtener el audio.");

    await conn.sendMessage(m.chat, {
      audio: { url: audioData.url },
      mimetype: 'audio/mpeg',
      fileName: `${video.title}.mp3`
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