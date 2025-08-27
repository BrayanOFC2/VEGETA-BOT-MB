/*import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`🐉 Ingresa un texto para buscar en YouTube.\n> *Ejemplo:* ${usedPrefix + command} Shakira`);

  try {
    const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${text}`;
    const searchResponse = await fetch(searchApi);
    const searchData = await searchResponse.json();

    if (!searchData?.data || searchData.data.length === 0) {
      return m.reply(`⚠️ No se encontraron resultados para "${text}".`);
    }

    const video = searchData.data[0]; // Tomar el primer resultado
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

    const downloadApi = `https://api.vreden.my.id/api/ytmp3?url=${video.url}`;
    const downloadResponse = await fetch(downloadApi);
    const downloadData = await downloadResponse.json();

    if (!downloadData?.result?.download?.url) {
      return m.reply("☁️ No se pudo obtener el audio del video.");
    }
    await conn.sendMessage(m.chat, {
      audio: { url: downloadData.result.download.url },
      mimetype: 'audio/mpeg',
      fileName: `${video.title}.mp3`
    }, { quoted: m });

    await m.react("✅");
  } catch (error) {
    console.error(error);
    m.reply(`❌ Error al procesar la solicitud:\n${error.message}`);
  }
};

handler.command = ['play', 'playaudio'];
handler.help = ['play <texto>', 'playaudio <texto>'];
handler.tags = ['media'];

export default handler;*/


import yts from 'yt-search';
import fetch from 'node-fetch';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn, args, usedPrefix }) => {
    if (!args[0]) return conn.reply(m.chat, `🐉 Ingresa un texto para buscar en YouTube.\n> *Ejemplo:* ${usedPrefix + command} Shakira`, m);

    await m.react('🕓');
    try {
        let searchResults = await searchVideos(args.join(" "));

        if (!searchResults.length) throw new Error('No se encontraron resultados.');

        let video = searchResults[0];
        let thumbnail = await (await fetch(video.miniatura)).buffer();

        let messageText = `*Youtube - Download*\n\n`;
        messageText += `${video.titulo}\n\n`;
        messageText += `*⌛ Duración:* ${video.duracion || 'No disponible'}\n`;
        messageText += `*👤 Autor:* ${video.canal || 'Desconocido'}\n`;
        messageText += `*📆 Publicado:* ${convertTimeToSpanish(video.publicado)}\n`;
        messageText += `*🖇️ Url:* ${video.url}\n`;

        await conn.sendMessage(m.chat, {
            image: thumbnail,
            caption: messageText,
            footer: `𝖯𑄜𝗐𝖾𝗋𝖾𝖽 𝖻𝗒 𝖲𝗁⍺𝖽ᦅ𝗐′𝗌 𝖢𝗅𝗎𝖻`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true
            },
            buttons: [
                {
                    buttonId: `${usedPrefix}tetas`,
                    buttonText: { displayText: 'Audio' },
                    type: 1,
                },
                {
                    buttonId: `${usedPrefix}ytmp4 ${video.url}`,
                    buttonText: { displayText: 'Vídeo' },
                    type: 1,
                }
            ],
            headerType: 1,
            viewOnce: true
        }, { quoted: m });

        await m.react('✅');
    } catch (e) {
        console.error(e);
        await m.react('✖️');
        conn.reply(m.chat, '*`Error al buscar el video.`*', m);
    }
};

handler.help = ['play'];
handler.tags = ['descargas'];
handler.command = ['play'];
export default handler;

async function searchVideos(query) {
    try {
        const res = await yts(query);
        return res.videos.slice(0, 10).map(video => ({
            titulo: video.title,
            url: video.url,
            miniatura: video.thumbnail,
            canal: video.author.name,
            publicado: video.timestamp || 'No disponible',
            vistas: video.views || 'No disponible',
            duracion: video.duration.timestamp || 'No disponible'
        }));
    } catch (error) {
        console.error('Error en yt-search:', error.message);
        return [];
    }
}

function convertTimeToSpanish(timeText) {
    return timeText
        .replace(/year/, 'año').replace(/years/, 'años')
        .replace(/month/, 'mes').replace(/months/, 'meses')
        .replace(/day/, 'día').replace(/days/, 'días')
        .replace(/hour/, 'hora').replace(/hours/, 'horas')
        .replace(/minute/, 'minuto').replace(/minutes/, 'minutos');
}