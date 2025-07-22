import fetch from 'node-fetch';

let handler = async (m, { conn, args, command }) => {
  if (!args[0]) {
    return m.reply(`╭─⬣「 *⚠️ USO INCORRECTO* 」\n│✦ Usa: *.imgg <texto>*\n│✦ Ej: *.imgg dragón oscuro*\n╰––––––––––––––✦`);
  }

  const prompt = args.join(' ');
  const userTag = '@' + m.sender.split('@')[0]; // Menciona al usuario

  // Mensaje mientras genera
  await conn.sendMessage(m.chat, {
    text: `╭─⬣「 *🖼️ GENERANDO IMAGEN* 」\n│✦ Solicitado por: ${userTag}\n│✦ Prompt: *"${prompt}"*\n│✦ Espérame un momento...\n╰––––––––––––––✦`,
    mentions: [m.sender],
  }, { quoted: m });

  try {
    // API: Usa una confiable. Aquí DALL·E por lolhuman
    const res = await fetch(`https://api.lolhuman.xyz/api/dalle2?apikey=Tu_API_KEY&text=${encodeURIComponent(prompt)}`);
    const json = await res.json();

    // Verificación
    if (!json || !json.result || !json.result.includes('http')) throw 'Imagen no válida';

    // Envío de imagen generada
    await conn.sendMessage(m.chat, {
      image: { url: json.result },
      caption: `╭─⬣「 *✅ IMAGEN CREADA* 」\n│✦ Prompt: *${prompt}*\n│✦ Generado para: ${userTag}\n╰––––––––––––––✦`,
      mentions: [m.sender],
    }, { quoted: m });

  } catch (e) {
    console.error('[ERROR IMG]', e);
    await conn.sendMessage(m.chat, {
      text: `╭─⬣「 *❌ ERROR AL GENERAR* 」\n│✦ Ocurrió un problema generando la imagen\n│✦ Intenta con otra palabra o más simple\n╰––––––––––––––✦`,
      mentions: [m.sender],
    }, { quoted: m });
  }
};

handler.command = ['imgg', 'img'];
handler.help = ['imgg <texto>'];
handler.tags = ['ai', 'media'];

export default handler;