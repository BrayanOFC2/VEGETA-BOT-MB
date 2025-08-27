import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('✨ Ingresa un texto para buscar en YouTube.');

  try {
    // 1) Buscar video con Delirius (igual que antes)
    const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`;
    const searchResp = await fetch(searchApi);
    const searchData = await searchResp.json();

    if (!searchData?.data || searchData.data.length === 0)
      return m.reply(`⚠️ No se encontraron resultados para "${text}".`);

    const video = searchData.data[0];

    // Enviar info del video
    const videoDetails = `
🎵 *Título:* ${video.title}
📺 *Canal:* ${video.author.name}
⏱️ *Duración:* ${video.duration}
👀 *Vistas:* ${video.views}
📅 *Publicado:* ${video.publishedAt}
🌐 *Enlace:* ${video.url}
    `;
    await conn.sendMessage(m.chat, { image: { url: video.image }, caption: videoDetails.trim() }, { quoted: m });

    // 2) Llamada a Neoxr
    const apiUrl = `https://api.neoxr.eu/api/youtube?url=${encodeURIComponent(video.url)}&type=video&quality=480p&apikey=GataDios`;
    const response = await fetch(apiUrl, { method: 'GET' });

    // 3) Si la respuesta no es OK, captura texto y muestra
    if (!response.ok) {
      const txt = await response.text();
      console.error('Neoxr HTTP Error:', response.status, txt.slice(0,1000));
      return m.reply(`❌ Neoxr respondió con status ${response.status}. Revisa logs.`);
    }

    // 4) Intentar parsear JSON (si no es JSON, mostramos texto)
    const raw = await response.text();
    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.error('Neoxr returned non-JSON:', raw.slice(0,2000));
      return m.reply('❌ La API de Neoxr respondió con texto que no es JSON. Revisa la consola.');
    }

    // Log acotado para debugging (ver en consola)
    console.log('Neoxr response (trunc):', JSON.stringify(data).slice(0,2000));

    // 5) Si la API devuelve una señal de error, devolver el message
    if (data?.status === false || data?.success === false) {
      const msg = data?.message || data?.error || JSON.stringify(data).slice(0,500);
      return m.reply(`❌ Neoxr API error: ${msg}`);
    }

    // 6) Buscar recursivamente la primera URL (http/https) dentro del objeto
    const findUrl = (obj) => {
      if (!obj) return null;
      if (typeof obj === 'string') {
        if (obj.startsWith('http')) return obj;
        return null;
      }
      if (Array.isArray(obj)) {
        for (const v of obj) {
          const u = findUrl(v);
          if (u) return u;
        }
      } else if (typeof obj === 'object') {
        for (const k of Object.keys(obj)) {
          const u = findUrl(obj[k]);
          if (u) return u;
        }
      }
      return null;
    };

    const downloadUrl = findUrl(data);

    if (!downloadUrl) {
      // Muestra una porción del JSON para que veas exactamente qué devuelve la API
      const snippet = JSON.stringify(data).slice(0,1000);
      console.error('No download url found. API returned:', snippet);
      return m.reply(`❌ Neoxr no devolvió un enlace de descarga.\nRespuesta (truncada):\n${snippet}`);
    }

    // 7) Enviar archivo usando la URL encontrada
    try {
      await conn.sendFile(m.chat, downloadUrl, `${video.title}.mp4`, video.title, m);
      await m.react('✅');
    } catch (sendErr) {
      console.error('Error enviando archivo a WhatsApp:', sendErr);
      return m.reply('❌ Error al enviar el archivo. Revisa logs (puede que la URL no sea descargable directamente).');
    }

  } catch (error) {
    console.error('Handler error:', error);
    m.reply(`❌ Error al procesar la solicitud:\n${error.message}`);
  }
};

handler.command = ['play2'];
handler.help = ['play2 <texto>'];
handler.tags = ['media'];

export default handler;