import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('✨ Ingresa un texto para buscar en YouTube.');

  try {
    // Buscar video usando la API de Delirius
    const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`;
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
    await conn.sendMessage(m.chat, { image: { url: video.image }, caption: videoDetails.trim() }, { quoted: m });

    // ---------------- Video MP4 con API de Sylphy ----------------
    const apiUrl = `https://api.sylphy.xyz/download/ytmp4?url=${video.url}&apikey=Sylphiette's`;
    const apiResp = await fetch(apiUrl);
    const apiData = await apiResp.json();

    if (!apiData?.result?.url) return m.reply('❌ No se pudo generar el enlace del video.');

    await conn.sendFile(m.chat, apiData.result.url, `${video.title}.mp4`, video.title, m);

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