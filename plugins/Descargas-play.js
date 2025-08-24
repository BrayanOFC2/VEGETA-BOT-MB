import fetch from 'node-fetch';
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

  if (!text) {
    return conn.reply(m.chat, `🧩 Uso: ${usedPrefix}${command} <enlace de YouTube>`, m);
  }

  if (!isValidYouTubeUrl(text)) {
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
    const { url, title } = await ytdl(text);
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
┃ 🔗 *URL:* ${text}
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
  try {
    if (!text || !text.trim()) {
      return conn.reply(
        m.chat,
        `✳️ Ingresa el nombre o enlace del video de YouTube.\n\n*Ejemplo:* .ytmp4doc Never Gonna Give You Up`,
        m
      );
    }

    const search = await yts(text);
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
  try {
    if (!text || !text.trim()) {
      return conn.reply(
        m.chat,
        `✳️ Ingresa el nombre o enlace del video de YouTube.\n\n*Ejemplo:* .${command} Never Gonna Give You Up`,
        m
      );
    }

    const search = await yts(text);
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
  try {
    if (!text || !text.trim()) {
      return conn.reply(
        m.chat,
        `✳️ Ingresa el nombre o enlace del video de YouTube.\n\n*Ejemplo:* .${command} Never Gonna Give You Up`,
        m
      );
    }

    const search = await yts(text);
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
};
