import fetch from 'node-fetch';
import https from 'https';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`✨ Ingresa un texto para buscar en YouTube.`);

  try {
    const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${text}`;
    const searchData = await (await fetch(searchApi)).json();
    const video = searchData.data[0];

    await conn.sendMessage(m.chat, {
      image: { url: video.image },
      caption: `🎵 *${video.title}*`
    }, { quoted: m });

    // Video
    const videoApi = `https://api.yt-download.org/api/button/mp4/${video.url}`;
    const videoData = await (await fetch(videoApi, { agent: httpsAgent })).json();

    await conn.sendMessage(m.chat, {
      video: { url: videoData.url },
      caption: `🎬 ${video.title}`,
      fileName: `${video.title}.mp4`
    }, { quoted: m });

    // Audio
    const audioApi = `https://api.yt-download.org/api/button/mp3/${video.url}`;
    const audioData = await (await fetch(audioApi, { agent: httpsAgent })).json();

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