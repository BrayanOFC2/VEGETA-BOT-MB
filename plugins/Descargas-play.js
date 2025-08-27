import yts from "yt-search";

const handler = async (m, { conn, command, text }) => {
  if (!text) return m.reply("❌ Ingresa el nombre de la canción o link de YouTube");

  m.reply("🔎 Buscando...");

  try {
    // Buscar video
    const search = await yts(text);
    const video = search.videos[0];
    if (!video) return m.reply("⚠️ No encontré resultados");

    // Enlaces de descarga directos (puedes reemplazar con tu backend real)
    const mp3Link = `https://api.akuari.my.id/ytmp3?url=${encodeURIComponent(video.url)}`;
    const mp4Link = `https://api.akuari.my.id/ytmp4?url=${encodeURIComponent(video.url)}`;

    // Enviar audio
    await conn.sendMessage(m.chat, {
      audio: { url: mp3Link },
      mimetype: "audio/mpeg",
      fileName: `${video.title}.mp3`,
      caption: `🎧 Audio de *${video.title}*`
    }, { quoted: m });

    // Enviar video
    await conn.sendMessage(m.chat, {
      video: { url: mp4Link },
      mimetype: "video/mp4",
      fileName: `${video.title}.mp4`,
      caption: `🎬 Video de *${video.title}*`
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    m.reply("❌ Ocurrió un error al procesar el video");
  }
};

handler.command = ["play", "play2"];
handler.tags = ["descargas"];

export default handler;