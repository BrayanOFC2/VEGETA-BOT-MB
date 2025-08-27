import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('✨ Ingresa un texto para buscar en YouTube.');

  try {
    // Buscar video con API de Delirius
    const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`;
    const searchResp = await fetch(searchApi);
    const searchData = await searchResp.json();

    if (!searchData?.data || searchData.data.length === 0)
      return m.reply(`⚠️ No se encontraron resultados para "${text}".`);

    const video = searchData.data[0];

    // Info del video
    const videoDetails = `
🎵 *Título:* ${video.title}
📺 *Canal:* ${video.author.name}
⏱️ *Duración:* ${video.duration}
👀 *Vistas:* ${video.views}
📅 *Publicado:* ${video.publishedAt}
🌐 *Enlace:* ${video.url}
    `;

    await conn.sendMessage(
      m.chat,
      { image: { url: video.image }, caption: videoDetails.trim() },
      { quoted: m }
    );

    // Descargar con API de Neoxr
    const apiUrl = `https://api.neoxr.eu/api/youtube?url=${encodeURIComponent(video.url)}&type=video&quality=480p&apikey=GataDios`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data?.data?.url) return m.reply('❌ No se pudo generar el enlace del video.');

    await conn.sendFile(m.chat, data.data.url, `${video.title}.mp4`, video.title, m);

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