import fetch from 'node-fetch';

let handler = async (m, { conn, args, command }) => {
  if (!args[0]) {
    return m.reply(`╭─⬣「 *⚠️ USO INCORRECTO* 」\n│✦ Usa: *.imgg <texto>*\n│✦ Ej: *.imgg dragón azul*\n╰––––––––––––––✦`);
  }

  let prompt = args.join(' ');
  await m.reply(`╭─⬣「 *🎨 GENERANDO IMAGEN* 」\n│✦ Texto: *"${prompt}"*\n│✦ Espérame un momento...\n╰––––––––––––––✦`);

  try {
    const res = await fetch(`https://api.lolhuman.xyz/api/dalle2?apikey=Tu_API_KEY&text=${encodeURIComponent(prompt)}`);
    const json = await res.json();

    if (!json || !json.result) throw '❌ No se pudo generar la imagen';

    await conn.sendMessage(m.chat, {
      image: { url: json.result },
      caption: `╭─⬣「 *✅ IMAGEN GENERADA* 」\n│✦ Prompt: *${prompt}*\n│✦ Solicitud completada con éxito\n╰––––––––––––––✦`
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply(`╭─⬣「 *❌ ERROR* 」\n│✦ No pude generar la imagen.\n│✦ Intenta de nuevo más tarde.\n╰––––––––––––––✦`);
  }
};

handler.command = ['imgg', 'img'];
handler.help = ['imgg <texto>'];
handler.tags = ['ai', 'media'];

export default handler;