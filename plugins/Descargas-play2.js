import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
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

    // Obtener enlace de descarga del video en formato MP4
    const videoApi = `https://api.neoxr.eu/api/youtube?url=${video.url}&type=video&quality=480p&apikey=GataDios`;
    const response = await fetch(videoApi);
    const json = await response.json();

    if (!json.data?.url) return m.reply("❌ No se pudo generar el enlace del video.");

    // Descargar y enviar el video MP4
    await conn.sendFile(m.chat, json.data.url, `${json.data.title}.mp4`, json.data.title, m);

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