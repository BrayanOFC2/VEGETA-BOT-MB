import axios from 'axios';

let handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, "📎 *Ingresa el nombre o término que deseas buscar en Pinterest.*", m);

  let query = text + " hd";
  await m.react("🔄");
  conn.reply(m.chat, `🧷 *.pin Fotos De ${text.toUpperCase()}*`, m);

  try {
    const { data } = await axios.get(`https://duckduckgo.com/i.js?q=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    let images = data.results?.slice(0, 15).map(item => item.image);

    if (!images || images.length === 0) throw "No se encontraron imágenes";

    let media = images.map(url => ({
      image: { url },
      caption: `📸 Foto relacionada con: *${text.toUpperCase()}*`,
    }));

    for (let i = 0; i < media.length; i += 4) {
      let batch = media.slice(i, i + 4);
      await conn.sendMedia(m.chat, batch, { quoted: m });
    }

    let finalMessage = `📁 *Resultados de:* Fotos De *${text.toUpperCase()}*\n🧮 *Cantidad de resultados:* ${images.length}\n👤 *Creador:* © powered by *Deylin*`;

    await conn.sendMessage(m.chat, { text: finalMessage }, { quoted: m });
    await m.react("✅");
  } catch (error) {
    console.log(error);
    return conn.reply(m.chat, "⚠️ *Error al buscar imágenes. Intenta de nuevo más tarde.*", m);
  }
};

handler.help = ["pinterest"];
handler.tags = ["descargas"];
handler.command = ['pinterest', 'pin'];

export default handler;