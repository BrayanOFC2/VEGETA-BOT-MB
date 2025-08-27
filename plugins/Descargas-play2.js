import fetch from 'node-fetch'
import yts from 'yt-search'
import ytdl from 'ytdl-core'
import axios from 'axios' 
import { savetube } from '../lib/yt-savetube.js' 
import { ogmp3 } from '../lib/youtubedl.js'; 
import { amdl, ytdown } from '../lib/scraper.js';  

const userRequests = {}; 

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply('*✨ Ingresa el enlace o nombre de la canción/video de YouTube para descargar*');

  if (userRequests[m.sender]) {
    return m.reply('⏳ *Espera...* Ya hay una solicitud en proceso. Por favor, espera a que termine antes de hacer otra.');
  }
  userRequests[m.sender] = true;

  const sendType = command.includes('doc') ? 'document' : command.includes('mp3') ? 'audio' : 'video';
  let youtubeLink = args[0].includes('you') ? args[0] : null;

  try {
    const yt_play = await search(args.join(' '));

    // -------------------- Mensajes de espera --------------------
    if (command.toLowerCase().includes('mp3')) {
      m.reply([
        '*⌛ Espere un momento... Estoy descargando tu audio 🍹*',
        '⌛ PROCESANDO...\n*Intentando descargar su audio, espere 🏃‍♂️💨*',
        'Calma 😎\nRecuerda colocar bien el nombre de la canción o link de YouTube\n> Si el comando *play no funciona utiliza *ytmp3*'
      ].getRandom());
    } else {
      m.reply([
        '*⌛ Espere un momento... Estoy descargando tu video 🍹*',
        '⌛ PROCESANDO...\n*Intentando descargar su video, espere 🏃‍♂️💨*',
        'Calma ✋🥸🤚\nEstoy descargando tu video 🔄\n> Aguarde un momento, por favor'
      ].getRandom());
    }

    // -------------------- Determinar link --------------------
    if (!youtubeLink) {
      if (Array.isArray(global.videoList) && global.videoList.length > 0) {
        const matchingItem = global.videoList.find(item => item.from === m.sender);
        if (matchingItem) {
          youtubeLink = matchingItem.urls[0]; // tomar el primero si no especifican
        }
      }
    }

    // -------------------- Intentos de descarga --------------------
    try {
      // 1) Zenkey
      const apiUrl = `https://api.zenkey.my.id/api/download/${sendType === 'audio' ? 'ytmp3' : 'ytmp4'}?apikey=zenkey&url=${encodeURIComponent(youtubeLink)}`;
      const res = await fetch(apiUrl);
      const textRes = await res.text();

      let data;
      try { data = JSON.parse(textRes); } catch {
        console.error('Zenkey returned HTML/invalid JSON:', textRes.slice(0, 1000));
        data = null;
      }

      if (data?.result?.url || data?.result?.download?.url) {
        const downloadUrl = data.result.url || data.result.download.url;
        await conn.sendMessage(
          m.chat,
          {
            [sendType]: { url: downloadUrl },
            fileName: `${yt_play[0]?.title || 'video'}.${sendType === 'audio' ? 'mp3' : 'mp4'}`,
            mimetype: sendType === 'audio' ? 'audio/mpeg' : 'video/mp4',
            caption: sendType === 'audio' ? `🔰 Aquí está tu audio\n🔥 Título: ${yt_play[0]?.title}` : `🔰 Aquí está tu video\n🔥 Título: ${yt_play[0]?.title}`
          },
          { quoted: m }
        );
        await m.react('✅');
        return;
      }
    } catch (e) { console.error('Zenkey failed:', e.message); }

    // 2) Fallback con savetube
    try {
      const result = await savetube.download(youtubeLink, sendType === 'audio' ? 'mp3' : '720');
      const data = result.result;
      await conn.sendMessage(
        m.chat,
        {
          [sendType]: { url: data.download },
          fileName: `${data.title}.${sendType === 'audio' ? 'mp3' : 'mp4'}`,
          mimetype: sendType === 'audio' ? 'audio/mpeg' : 'video/mp4',
          caption: sendType === 'audio' ? `🔰 Aquí está tu audio\n🔥 Título: ${data.title}` : `🔰 Aquí está tu video\n🔥 Título: ${data.title}`
        },
        { quoted: m }
      );
      await m.react('✅');
      return;
    } catch (e) { console.error('Savetube failed:', e.message); }

    // 3) Último fallback: ytdl-core + yts
    try {
      if (!youtubeLink) youtubeLink = yt_play[0].url;
      if (sendType === 'audio') {
        const info = await ytdl.getInfo(youtubeLink);
        const format = ytdl.chooseFormat(info.formats, { filter: 'audioonly' });
        await conn.sendMessage(
          m.chat,
          {
            [sendType]: { url: format.url },
            fileName: `${info.videoDetails.title}.mp3`,
            mimetype: 'audio/mpeg',
            caption: `🔰 Aquí está tu audio\n🔥 Título: ${info.videoDetails.title}`
          },
          { quoted: m }
        );
      } else {
        const info = await ytdl.getInfo(youtubeLink);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'audioandvideo' });
        await conn.sendMessage(
          m.chat,
          {
            [sendType]: { url: format.url },
            fileName: `${info.videoDetails.title}.mp4`,
            mimetype: 'video/mp4',
            caption: `🔰 Aquí está tu video\n🔥 Título: ${info.videoDetails.title}`
          },
          { quoted: m }
        );
      }
      await m.react('✅');
      return;
    } catch (e) { console.error('ytdl-core fallback failed:', e.message); }

    return m.reply('❌ No se pudo descargar el audio/video. Todas las APIs fallaron.');

  } catch (error) {
    console.error(error);
    m.react('❌️');
  } finally {
    delete userRequests[m.sender];
  }
};

handler.help = ['ytmp4', 'ytmp3'];
handler.tags = ['downloader'];
handler.command = /^(ytmp3|ytmp4|fgmp4|fgmp3|dlmp3|ytmp4doc|ytmp3doc)$/i;
export default handler;

// -------------------- Funciones auxiliares --------------------
async function search(query, options = {}) {
  const search = await yts.search({ query, hl: 'es', gl: 'ES', ...options });
  return search.videos;
}