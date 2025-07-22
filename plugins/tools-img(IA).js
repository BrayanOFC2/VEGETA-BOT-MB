import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return m.reply(`╭─⬣「 *⚠️ USO INCORRECTO* 」\n│✦ Usa: *.imgg <texto>*\n│✦ Ej: *.imgg perro ninja*\n╰––––––––––––––✦`);
  }

  const prompt = args.join(' ');
  const userTag = '@' + m.sender.split('@')[0];

  // Mensaje de espera
  await conn.sendMessage(m.chat, {
    text: `╭─⬣「 *🎨 GENERANDO IMAGEN* 」\n│✦ Prompt: *${prompt}*\n│✦ Solicitado por: ${userTag}\n│✦ Espera un momento...\n╰––––––––––––––✦`,
    mentions: [m.sender],
  }, { quoted: m });

  try {
    
    const res = await fetch(`https://lexica.art/api/v1/search?q=${encodeURIComponent(prompt)}`);
    const json = await res.json();

    if (!json || !json.images || json.images.length === 0) throw '❌ No se encontró ninguna imagen';

    const imageUrl = json.images[0].srcSmall;

    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: `╭─⬣「 *✅ IMAGEN GENERADA* 」\n│✦ Prompt: *${prompt}*\n│✦ Por: ${userTag}\n╰––––––––––––––✦`,
      mentions: [m.sender],
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, {
      text: `╭─⬣「 *❌ ERROR* 」\n│✦ No pude generar la imagen\n│✦ Intenta con otra palabra o más simple\n╰––––––––––––––✦`,
      mentions: [m.sender],
    }, { quoted: m });
  }
};

handler.command = ['imgg', 'img'];
handler.help = ['imgg <texto>'];
handler.tags = ['ai', 'media'];

export default handler;