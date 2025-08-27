/*import fetch from 'node-fetch';
import yts from 'yt-search';
import axios from 'axios';

const MAX_FILE_SIZE = 280 * 1024 * 1024;
const VIDEO_THRESHOLD = 70 * 1024 * 1024;
const HEAVY_FILE_THRESHOLD = 100 * 1024 * 1024;
const REQUEST_LIMIT = 3;
const REQUEST_WINDOW_MS = 10000;
const COOLDOWN_MS = 120000;

const requestTimestamps = [];
let isCooldown = false;
let isProcessingHeavy = false;

const isValidYouTubeUrl = url => /^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(url);

function formatSize(bytes) {
  if (!bytes || isNaN(bytes)) return 'Desconocido';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  bytes = Number(bytes);
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)} ${units[i]}`;
}

async function getSize(url) {
  try {
    const res = await axios.head(url, { timeout: 10000 });
    const size = parseInt(res.headers['content-length'], 10);
    if (!size) throw new Error('Tamaño no disponible');
    return size;
  } catch {
    throw new Error('No se pudo obtener el tamaño del archivo');
  }
}

async function ytdl(url) {
  const headers = {
    accept: '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'sec-ch-ua': '"Chromium";v="132", "Not A(Brand";v="8"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    referer: 'https://id.ytmp3.mobi/',
    'referrer-policy': 'strict-origin-when-cross-origin'
  };

  const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?/]+)/)?.[1];
  if (!videoId) throw new Error('ID de video no encontrado');

  try {
    const init = await (await fetch(`https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=${Date.now()}`, { headers })).json();
    const convert = await (await fetch(`${init.convertURL}&v=${videoId}&f=mp4&_=${Date.now()}`, { headers })).json();

    let info;
    for (let i = 0; i < 3; i++) {
      const res = await fetch(convert.progressURL, { headers });
      info = await res.json();
      if (info.progress === 3) break;
      await new Promise(res => setTimeout(res, 1000));
    }

    if (!info || !convert.downloadURL) throw new Error('No se pudo obtener la URL de descarga');
    return { url: convert.downloadURL, title: info.title || 'Video sin título' };
  } catch (e) {
    throw new Error(`Error en la descarga: ${e.message}`);
  }
}

function checkRequestLimit() {
  const now = Date.now();
  requestTimestamps.push(now);
  while (requestTimestamps.length > 0 && now - requestTimestamps[0] > REQUEST_WINDOW_MS) {
    requestTimestamps.shift();
  }
  if (requestTimestamps.length >= REQUEST_LIMIT) {
    isCooldown = true;
    setTimeout(() => {
      isCooldown = false;
      requestTimestamps.length = 0;
    }, COOLDOWN_MS);
    return false;
  }
  return true;
}

const playHandler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    throw `❗ Por favor ingresa un texto para buscar.\nEjemplo: ${usedPrefix + command} Nombre del video`;
  }

  const search = await yts(text);
  const videoInfo = search.all?.[0];

  if (!videoInfo) {
    throw '❗ No se encontraron resultados para tu búsqueda. Intenta con otro título.';
  }

  const body = `\`\`\`El mejor bot de WhatsApp ⚔️
  
Elige una de las opciones para descargar:
🎧 *Audio* o 📽️ *Video*
  `;

  await conn.sendMessage(
    m.chat,
    {
      image: { url: videoInfo.thumbnail },
      caption: body,
      footer: `VEGETA-BOT-MB︎| 🐉`,
      buttons: [
        { buttonId: `.ytmp31 ${videoInfo.url}`, buttonText: { displayText: '🎧 Audio' } },
        { buttonId: `.ytmp42 ${videoInfo.url}`, buttonText: { displayText: '📽️ Video' } },
        { buttonId: `.ytmp3doc1 ${videoInfo.url}`, buttonText: { displayText: '💿 audio doc' } },
        { buttonId: `.ytmp4doc2 ${videoInfo.url}`, buttonText: { displayText: '🎥 vídeo doc' } },
      ],
      viewOnce: true,
      headerType: 4,
    },
    { quoted: m }
  );
  m.react('✅');
};
playHandler.command = ['play', 'playvid', 'play2'];
playHandler.tags = ['downloader'];
playHandler.group = true;
playHandler.limit = 6;

const ytmp4Handler = async (m, { conn, text, usedPrefix, command }) => {
  const react = emoji => m.react(emoji);
  let videoUrl = text;
  if (m.text && m.text.startsWith('.' + command[1])) {
    videoUrl = m.text.slice(command[1].length + 2).trim();
  } else if (!videoUrl) {
    return conn.reply(m.chat, `🧩 Uso: ${usedPrefix}${command} <enlace de YouTube>`, m);
  }

  if (!isValidYouTubeUrl(videoUrl)) {
    await react('🔴');
    return m.reply('🚫 Enlace de YouTube inválido');
  }

  if (isCooldown || !checkRequestLimit()) {
    await react('🔴');
    return conn.reply(m.chat, '⏳ Muchas solicitudes. Espera 2 minutos.', m);
  }

  if (isProcessingHeavy) {
    await react('🔴');
    return conn.reply(m.chat, '⚠️ Ya estoy procesando un archivo pesado. Espera un momento.', m);
  }

  await react('⏳');

  try {
    const { url, title } = await ytdl(videoUrl);
    const size = await getSize(url);
    if (!size) throw new Error('No se pudo determinar el tamaño del video');

    if (size > MAX_FILE_SIZE) {
      await react('🔴');
      throw new Error('📦 El archivo supera el límite de 280 MB');
    }

    const isHeavy = size > HEAVY_FILE_THRESHOLD;
    if (isHeavy) {
      isProcessingHeavy = true;
      await conn.reply(m.chat, '💾 Espera, estoy descargando un archivo grande...', m);
    }

    const caption = `
╭╌╌〔 *🕶️ DESCARGAS Vegeta - MP4* 〕╌╌╮
┃ 🧿 *Título:* ${title}
┃ 📦 *Tamaño:* ${formatSize(size)}
┃ 🔗 *URL:* ${videoUrl}
╰╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╯`.trim();

    const buffer = await fetch(url).then(res => res.buffer());
    await conn.sendFile(
      m.chat,
      buffer,
      `${title}.mp4`,
      caption,
      m,
      null,
      {
        mimetype: 'video/mp4',
        asDocument: size >= VIDEO_THRESHOLD,
        filename: `${title}.mp4`
      }
    );

    await react('✅');
    isProcessingHeavy = false;
  } catch (e) {
    await react('❌');
    isProcessingHeavy = false;
    return m.reply(`🧨 *ERROR:* ${e.message}`);
  }
};
ytmp4Handler.help = ['ytmp4 <url>'];
ytmp4Handler.tags = ['descargas'];
ytmp4Handler.command = ['ytmp4', 'ytmp42'];
ytmp4Handler.black = true;

const ytmp4docHandler = async (m, { conn, text }) => {
  let videoUrl = text;
  if (m.text) {
    const parts = m.text.split(' ');
    if (parts.length > 1 && parts[0].startsWith('.')) {
      videoUrl = parts[1];
    }
  }

  try {
    if (!videoUrl || !videoUrl.trim()) {
      return conn.reply(
        m.chat,
        `✳️ Ingresa el nombre o enlace del video de YouTube.\n\n*Ejemplo:* .ytmp4doc Never Gonna Give You Up`,
        m
      );
    }

    const search = await yts(videoUrl);
    if (!search.all || search.all.length === 0) {
      return conn.reply(m.chat, '❌ No se encontraron resultados para tu búsqueda.', m);
    }

    const videoInfo = search.all[0];
    const { title, url } = videoInfo;

    const api = `https://myapiadonix.vercel.app/api/ytmp4?url=${encodeURIComponent(url)}`;
    const res = await fetch(api);
    if (!res.ok) throw new Error(`Error al obtener respuesta de la API (status ${res.status})`);

    const json = await res.json();
    if (!json.data || !json.data.download) throw new Error("La API no devolvió un enlace válido");

    const videoRes = await fetch(json.data.download);
    if (!videoRes.ok) throw new Error(`Error al descargar el video (status ${videoRes.status})`);

    const buffer = Buffer.from(await videoRes.arrayBuffer());
    const sizeMB = buffer.length / (1024 * 1024);
    const fileName = `${title.replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/ +/g, '_')}.mp4`;

    if (sizeMB > 300) {
      return conn.reply(
        m.chat,
        `⚠️ El video pesa *${sizeMB.toFixed(2)} MB*, supera el límite de 300 MB.\nDescárgalo aquí:\n${json.data.download}`,
        m
      );
    }

    await conn.sendMessage(
      m.chat,
      {
        document: buffer,
        mimetype: 'video/mp4',
        fileName,
      },
      { quoted: m }
    );
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, `❌ Ocurrió un error al procesar tu solicitud:\n\n${error.message}`, m);
  }
};
ytmp4docHandler.command = ytmp4docHandler.help = ['ytmp4doc', 'ytmp4doc2'];
ytmp4docHandler.tags = ['descargas'];

const ytmp3Handler = async (m, { conn, text, command }) => {
  let videoUrl = text;
  if (m.text) {
    const parts = m.text.split(' ');
    if (parts.length > 1 && parts[0].startsWith('.')) {
      videoUrl = parts[1];
    }
  }

  try {
    if (!videoUrl || !videoUrl.trim()) {
      return conn.reply(
        m.chat,
        `✳️ Ingresa el nombre o enlace del video de YouTube.\n\n*Ejemplo:* .${command} Never Gonna Give You Up`,
        m
      );
    }

    const search = await yts(videoUrl);
    if (!search.all || search.all.length === 0) {
      return conn.reply(m.chat, '❌ No se encontraron resultados para tu búsqueda.', m);
    }

    const videoInfo = search.all[0];
    const { title, url } = videoInfo;

    const api = `https://myapiadonix.vercel.app/api/ytmp3?url=${encodeURIComponent(url)}`;
    const res = await fetch(api);
    if (!res.ok) throw new Error(`Error al obtener respuesta de la API (status ${res.status})`);

    const json = await res.json();
    if (!json.data || !json.data.download) throw new Error("La API no devolvió un enlace válido");

    const audioRes = await fetch(json.data.download);
    if (!audioRes.ok) throw new Error(`Error al descargar el audio (status ${audioRes.status})`);

    const buffer = Buffer.from(await audioRes.arrayBuffer());
    const sizeMB = buffer.length / (1024 * 1024);
    const fileName = `${title.replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/ +/g, '_')}.mp3`;

    if (sizeMB > 64) {
      return conn.reply(m.chat, `⚠️ El audio pesa *${sizeMB.toFixed(2)} MB*, supera el límite (64 MB).\nDescárgalo aquí:\n${json.data.download}`, m);
    }

    await conn.sendMessage(
      m.chat,
      {
        document: buffer,
        mimetype: 'audio/mpeg',
        fileName: fileName,
      },
      { quoted: m }
    );
  } catch (error) {
    console.error(error);
    return conn.reply(
      m.chat,
      `❌ Ocurrió un error al procesar tu solicitud:\n\n${error.message}`,
      m
    );
  }
};
ytmp3Handler.command = ytmp3Handler.help = ['ytmp3', 'ytmp31'];
ytmp3Handler.tags = ['descargas'];

const ytmp3docHandler = async (m, { conn, text, command }) => {
  let videoUrl = text;
  if (m.text) {
    const parts = m.text.split(' ');
    if (parts.length > 1 && parts[0].startsWith('.')) {
      videoUrl = parts[1];
    }
  }

  try {
    if (!videoUrl || !videoUrl.trim()) {
      return conn.reply(
        m.chat,
        `✳️ Ingresa el nombre o enlace del video de YouTube.\n\n*Ejemplo:* .${command} Never Gonna Give You Up`,
        m
      );
    }

    const search = await yts(videoUrl);
    if (!search.all || search.all.length === 0) {
      return conn.reply(m.chat, '❌ No se encontraron resultados para tu búsqueda.', m);
    }

    const videoInfo = search.all[0];
    const { title, url } = videoInfo;

    const api = `https://myapiadonix.vercel.app/api/ytmp3?url=${encodeURIComponent(url)}`;
    const res = await fetch(api);
    if (!res.ok) throw new Error(`Error al obtener respuesta de la API (status ${res.status})`);

    const json = await res.json();
    if (!json.data || !json.data.download) throw new Error("La API no devolvió un enlace válido");

    const audioRes = await fetch(json.data.download);
    if (!audioRes.ok) throw new Error(`Error al descargar el audio (status ${audioRes.status})`);

    const buffer = Buffer.from(await audioRes.arrayBuffer());
    const sizeMB = buffer.length / (1024 * 1024);
    const fileName = `${title.replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/ +/g, '_')}.mp3`;

    if (sizeMB > 64) {
      return conn.reply(m.chat, `⚠️ El audio pesa *${sizeMB.toFixed(2)} MB*, supera el límite (64 MB).\nDescárgalo aquí:\n${json.data.download}`, m);
    }

    await conn.sendMessage(
      m.chat,
      {
        document: buffer,
        mimetype: 'audio/mpeg',
        fileName: fileName,
      },
      { quoted: m }
    );
  } catch (error) {
    console.error(error);
    return conn.reply(
      m.chat,
      `❌ Ocurrió un error al procesar tu solicitud:\n\n${error.message}`,
      m
    );
  }
};
ytmp3docHandler.command = ['ytmp3doc', 'ytmp3doc1'];
ytmp3docHandler.tags = ['descargas'];


export {
  playHandler,
  ytmp4Handler,
  ytmp4docHandler,
  ytmp3Handler,
  ytmp3docHandler,  
};*/



//import { youtubedl, youtubedlv2 } from '@bochilteam/scraper'
import fetch from 'node-fetch';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import axios from 'axios'; 
import { savetube } from '../lib/yt-savetube.js'
import { ogmp3 } from '../lib/youtubedl.js'; 
const LimitAud = 725 * 1024 * 1024; // 725MB
const LimitVid = 425 * 1024 * 1024; // 425MB
const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;
const userCaptions = new Map();
const userRequests = {};

const handler = async (m, { conn, command, args, text, usedPrefix }) => {
  if (!text) return m.reply(`*🤔Que está buscando? 🤔*\n*Ingrese el nombre de la canción*\n\n*Ejemplo:*\n${usedPrefix + command} emilia 420`);
const tipoDescarga = command === 'play' || command === 'musica' ? 'audio' : command === 'play2' ? 'video' : command === 'play3' ? 'audio (documento)' : command === 'play4' ? 'video (documento)' : '';
if (userRequests[m.sender]) return await conn.reply(m.chat, `⏳ Hey @${m.sender.split('@')[0]} espera pendejo, ya estás descargando algo 🙄\nEspera a que termine tu solicitud actual antes de hacer otra...`, userCaptions.get(m.sender) || m);
userRequests[m.sender] = true;
try {
let videoIdToFind = text.match(youtubeRegexID) || null;
const yt_play = await search(args.join(' ')); 
let ytplay2 = await yts(videoIdToFind === null ? text : 'https://youtu.be/' + videoIdToFind[1]);
if (videoIdToFind) {
const videoId = videoIdToFind[1];
ytplay2 = ytplay2.all.find(item => item.videoId === videoId) || ytplay2.videos.find(item => item.videoId === videoId)}
ytplay2 = ytplay2.all?.[0] || ytplay2.videos?.[0] || ytplay2;
const PlayText = await conn.sendMessage(m.chat, { text: `${yt_play[0].title}
*⇄ㅤ     ◁   ㅤ  ❚❚ㅤ     ▷ㅤ     ↻*

*⏰ Duración:* ${secondString(yt_play[0].duration.seconds)}
*👉🏻Aguarde un momento en lo que envío su ${tipoDescarga}*`,  
contextInfo:{  
forwardedNewsletterMessageInfo: { 
newsletterJid: '120363394965381607@newsletter', 
serverMessageId: '', 
newsletterName: 'VEGETA-BOT-MB🐉' },
forwardingScore: 9999999,  
isForwarded: true,   
mentionedJid: null,  
externalAdReply: {  
showAdAttribution: false,  
renderLargerThumbnail: false,  
title: yt_play[0].title,   
body: "Vegeta",
containsAutoReply: true,  
mediaType: 1,   
thumbnailUrl: yt_play[0].thumbnail, 
sourceUrl: "skyultraplus.com"
}}}, { quoted: m })
userCaptions.set(m.sender, PlayText);

const [input, qualityInput = command === 'play' || command === 'musica' || command === 'play3' ? '320' : '720'] = text.split(' ');
const audioQualities = ['64', '96', '128', '192', '256', '320'];
const videoQualities = ['240', '360', '480', '720', '1080'];
const isAudioCommand = command === 'play' || command === 'musica' || command === 'play3';
const selectedQuality = (isAudioCommand ? audioQualities : videoQualities).includes(qualityInput) ? qualityInput : (isAudioCommand ? '320' : '720');
const isAudio = command.toLowerCase().includes('mp3') || command.toLowerCase().includes('audio')
const format = isAudio ? 'mp3' : '720' 

const audioApis = [
{ url: () => savetube.download(yt_play[0].url, format), extract: (data) => ({ data: data.result.download, isDirect: false }) },
{ url: () => ogmp3.download(yt_play[0].url, selectedQuality, 'audio'), extract: (data) => ({ data: data.result.download, isDirect: false }) },
{ url: () => fetch(`https://api.dorratz.com/v3/ytdl?url=${yt_play[0].url}`).then(res => res.json()), extract: (data) => { 
const mp3 = data.medias.find(media => media.quality === "160kbps" && media.extension === "mp3");
return { data: mp3.url, isDirect: false }}},
{ url: () => fetch(`https://api.neoxr.eu/api/youtube?url=${yt_play[0].url}&type=audio&quality=128kbps&apikey=GataDios`).then(res => res.json()), extract: (data) => ({ data: data.data.url, isDirect: false }) },
{ url: () => fetch(`https://api.fgmods.xyz/api/downloader/ytmp4?url=${yt_play[0].url}&apikey=elrebelde21`).then(res => res.json()), extract: (data) => ({ data: data.result.dl_url, isDirect: false }) },
{ url: () => fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${yt_play[0].url}`).then(res => res.json()), extract: (data) => ({ data: data.dl, isDirect: false }) },
{ url: () => fetch(`${info.apis}/download/ytmp3?url=${yt_play[0].url}`).then(res => res.json()), extract: (data) => ({ data: data.status ? data.data.download.url : null, isDirect: false }) },
{ url: () => fetch(`https://api.zenkey.my.id/api/download/ytmp3?apikey=zenkey&url=${yt_play[0].url}`).then(res => res.json()), extract: (data) => ({ data: data.result.download.url, isDirect: false }) },
{ url: () => fetch(`https://exonity.tech/api/dl/playmp3?query=${yt_play[0].title}`).then(res => res.json()), extract: (data) => ({ data: data.result.download, isDirect: false }) 
}];

const videoApis = [
{ url: () => savetube.download(yt_play[0].url, '720'), extract: (data) => ({ data: data.result.download, isDirect: false }) },
{ url: () => ogmp3.download(yt_play[0].url, selectedQuality, 'video'), extract: (data) => ({ data: data.result.download, isDirect: false }) },
{ url: () => fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${yt_play[0].url}`).then(res => res.json()), extract: (data) => ({ data: data.dl, isDirect: false }) },
{ url: () => fetch(`https://api.neoxr.eu/api/youtube?url=${yt_play[0].url}&type=video&quality=720p&apikey=GataDios`).then(res => res.json()), extract: (data) => ({ data: data.data.url, isDirect: false }) },
{ url: () => fetch(`https://api.fgmods.xyz/api/downloader/ytmp4?url=${yt_play[0].url}&apikey=elrebelde21`).then(res => res.json()), extract: (data) => ({ data: data.result.dl_url, isDirect: false }) },
{ url: () => fetch(`${info.apis}/download/ytmp4?url=${encodeURIComponent(yt_play[0].url)}`).then(res => res.json()), extract: (data) => ({ data: data.status ? data.data.download.url : null, isDirect: false }) },
{ url: () => fetch(`https://exonity.tech/api/dl/playmp4?query=${encodeURIComponent(yt_play[0].title)}`).then(res => res.json()), extract: (data) => ({ data: data.result.download, isDirect: false })
}];

const download = async (apis) => {
let mediaData = null;
let isDirect = false;
for (const api of apis) {
try {
const data = await api.url();
const { data: extractedData, isDirect: direct } = api.extract(data);
if (extractedData) {
const size = await getFileSize(extractedData);
if (size >= 1024) {
mediaData = extractedData;
isDirect = direct;
break;
}}} catch (e) {
console.log(`Error con API: ${e}`);
continue;
}}
return { mediaData, isDirect };
};

if (command === 'play' || command === 'musica') {
const { mediaData, isDirect } = await download(audioApis);
if (mediaData) {
const fileSize = await getFileSize(mediaData);
if (fileSize > LimitAud) {
await conn.sendMessage(m.chat, { document: isDirect ? mediaData : { url: mediaData }, mimetype: 'audio/mpeg', fileName: `${yt_play[0].title}.mp3`, contextInfo: {} }, { quoted: m });
} else {
await conn.sendMessage(m.chat, { audio: isDirect ? mediaData : { url: mediaData }, mimetype: 'audio/mpeg', contextInfo: {} }, { quoted: m });
}} else {
//await m.react('❌');
}}

if (command === 'play2' || command === 'video') {
const { mediaData, isDirect } = await download(videoApis);
if (mediaData) {
const fileSize = await getFileSize(mediaData);
const messageOptions = { fileName: `${yt_play[0].title}.mp4`, caption: `🐉 Aquí está tu video \n🔥 Título: ${yt_play[0].title}`, mimetype: 'video/mp4' };
if (fileSize > LimitVid) {
await conn.sendMessage(m.chat, { document: isDirect ? mediaData : { url: mediaData }, ...messageOptions }, { quoted: m });
} else {
await conn.sendMessage(m.chat, { video: isDirect ? mediaData : { url: mediaData }, thumbnail: yt_play[0].thumbnail, ...messageOptions }, { quoted: m });
}} else {
//await m.react('❌');
}}

if (command === 'play3' || command === 'playdoc') {
const { mediaData, isDirect } = await download(audioApis);
if (mediaData) {
await conn.sendMessage(m.chat, { document: isDirect ? mediaData : { url: mediaData }, mimetype: 'audio/mpeg', fileName: `${yt_play[0].title}.mp3`, contextInfo: {} }, { quoted: m });
} else {
await m.react('❌');
}}

if (command === 'play4' || command === 'playdoc2') {
const { mediaData, isDirect } = await download(videoApis);
if (mediaData) {
await conn.sendMessage(m.chat, { document: isDirect ? mediaData : { url: mediaData }, fileName: `${yt_play[0].title}.mp4`, caption: `☁️Título: ${yt_play[0].title}`, thumbnail: yt_play[0].thumbnail, mimetype: 'video/mp4'}, { quoted: m })
} else {
//await m.react('❌');
}}
} catch (error) {
console.error(error);
m.react("❌️")
} finally {
delete userRequests[m.sender]; 
}}
handler.help = ['play', 'play2', 'play3', 'play4', 'playdoc'];
handler.tags = ['downloader'];
handler.command = ['play', 'play2', 'play3', 'play4', 'audio', 'video', 'playdoc', 'playdoc2', 'musica'];
handler.register = true;
export default handler;

async function search(query, options = {}) {
const search = await yts.search({query, hl: 'es', gl: 'ES', ...options});
return search.videos;
}

function MilesNumber(number) {
const exp = /(\d)(?=(\d{3})+(?!\d))/g;
const rep = '$1.';
const arr = number.toString().split('.');
arr[0] = arr[0].replace(exp, rep);
return arr[1] ? arr.join('.') : arr[0];
}

function secondString(seconds) {
seconds = Number(seconds);
const d = Math.floor(seconds / (3600 * 24));
const h = Math.floor((seconds % (3600 * 24)) / 3600);
const m = Math.floor((seconds % 3600) / 60);
const s = Math.floor(seconds % 60);
const dDisplay = d > 0 ? d + (d == 1 ? ' día, ' : ' días, ') : '';
const hDisplay = h > 0 ? h + (h == 1 ? ' hora, ' : ' horas, ') : '';
const mDisplay = m > 0 ? m + (m == 1 ? ' minuto, ' : ' minutos, ') : '';
const sDisplay = s > 0 ? s + (s == 1 ? ' segundo' : ' segundos') : '';
return dDisplay + hDisplay + mDisplay + sDisplay;
  }

const getBuffer = async (url) => {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
  } catch (error) {
    console.error("Error al obtener el buffer", error);
    throw new Error("Error al obtener el buffer");
  }
}

async function getFileSize(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return parseInt(response.headers.get('content-length') || 0);
  } catch {
    return 0; // Si falla, asumimos 0
  }
}