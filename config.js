import { watchFile, unwatchFile } from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cheerio from 'cheerio';
import fetch from 'node-fetch';
import axios from 'axios';
import moment from 'moment-timezone';

export const owners = [
  { number: '5216641784469', name: '⋆𝑪𝒓𝒆𝒂𝒅𝒐𝒓 ღ𝐁𝐫𝐚𝐲𝐚𝐧𝐎𝐅𝐂❦', isCreator: true },
  { number: '584146277368', name: '𝓔𝓶𝓶𝓪 𝓥𝓲𝓸𝓵𝓮𝓽𝓼 𝓥𝓮𝓻𝓼𝓲ó𝓷', isCreator: true },
  { number: '5491166401905', name: 'legend', isCreator: true },
  { number: '5216671548329', name: 'Legna', isCreator: true },
  { number: '50432955554', name: 'Deylin', isCreator: true },
  { number: '5212431268546', name: 'Tesis', isCreator: true },
  { number: '155968113483985', name: 'Unknown', isCreator: true },
  { number: '50557865603', name: 'Niño piña', isCreator: true },
  { number: '5218211111111', name: 'Papi chulo', isCreator: true },
  { number: '5217721103732', name: 'Daniel', isCreator: true }
];

export const mods = ['5216641804242', '584120515006', '5216633900512', '573004828388', '573154062343'];
export const suittag = ['584120346669'];
export const prems = [];
export const numCreador = '5216641784469';
export const botNumberCode = '';
export const confirmCode = '';
export const sesi = 'Sessions';
export const jadi = 'JadiBots';
export const Jadibts = true;

export function isOwner(sender) {
  const cleanNumber = sender.split('@')[0];
  return owners.some(o => o.number === cleanNumber);
}

export const botConfig = {
  namebot: '✿◟𝚅𝚎𝚐𝚎𝚝𝚊-𝙱𝚘𝚝-𝙼𝙱◞✿',
  author: 'Made By ➳𝐁𝐫𝐚𝐲𝐚𝐧𝐎𝐅𝐂❦',
  banner: 'https://files.catbox.moe/j0z1kz.jpg',
  catalogo: 'https://files.catbox.moe/j0z1kz.jpg',
  moneda: 'dragones',
  welcome1: 'Edita Con #setwelcome',
  welcome2: 'Edita Con #setbye',
  vs: '2.1.5',
  vsJB: '5.0',
  libreria: 'Baileys',
  baileys: 'V 6.7.9',
  languaje: 'Español',
  nameqr: '𝚅𝙴𝙶𝙴𝚃𝙰 - 𝙱𝙾𝚃 - 𝙼𝙱'
};

export const packsticker = `°.⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸.°\n✦ Bσƚ:\n✦ Pɾσριҽƚαɾισ:\n✦ Fҽƈԋα ԃҽ Cɾҽαƈιóɳ:\n✦ Hσɾα ԃҽ Cɾҽαƈιóɳ:\n♾━━━━━━━━`;
export const packsticker2 = `━━━━━━━━♾\n⪛·:*¨♱𝚅𝙴𝙶𝙴𝚃𝙰-𝙱𝙾𝚃-𝙼𝙱♱ ¨*:·⪜\n⋆ ༺Ƹ (ꐦ ◣‸◢) 𝙼𝙰𝚁𝚃𝙸𝙽𝙴𝚉\n⇝ ${moment.tz('america/Los_angeles').format('DD/MM/YY')}\n⇝ ${moment.tz('America/Los_angeles').format('HH:mm:ss')}\n°.⎯⃘̶⎯̸.°\n\nѕτιϲκєя ϐγ: 𝚅𝙴𝙶𝙴𝚃𝙰-𝙱𝙾𝚃-𝙼𝙱`;

export const packname = `⪛✰¨♱𝚅𝙴𝙶𝙴𝚃𝙰-𝙱𝙾𝚃-𝙼𝙱`;
export const botname = '*♱𝚅𝙴𝙶𝙴𝚃𝙰-𝙱𝙾𝚃-𝙼𝙱♱*';
export const wm = 'ৎ୭࠭͢𓆪͟͞ 𝚅𝙴𝙶𝙴𝚃𝙰-𝙱𝙾𝚃-𝙼𝙱';
export const author = 'Made By ➳𝐁𝐫𝐚𝐲𝐚𝐧𝐎𝐅𝐂❦';
export const dev = '© ⍴᥆ᥕᥱrᥱძ ᑲᥡ  ➳𝐁𝐫𝐚𝐲𝐚𝐧𝐎𝐅𝐂ღ';
export const textbot = ' ➳𝐁𝐫𝐚𝐲𝐚𝐧𝐎𝐅𝐂❦ • P·:*¨♱𝚅𝙴𝙶𝙴𝚃𝙰-𝙱𝙾𝚃-𝙼𝙱♱ ¨*:·';

export const imagen1 = fs.readFileSync('./src/menus/Menu2.jpg');
export const imagen2 = fs.readFileSync('./src/anime.jpg');
export const imagen3 = fs.readFileSync('./src/menus/Menu3.jpg');
export const imagen4 = fs.readFileSync('./src/menus/Menu.jpg');
export const photoSity = [imagen1, imagen2, imagen3, imagen4];

export const gp1 = 'https://chat.whatsapp.com/DWVnDWaepEQCn7uzOPxmHq';
export const gp2 = 'https://chat.whatsapp.com/FdBottjrmTvIzD1XTc8vyH';
export const gp4 = 'https://chat.whatsapp.com/DWVnDWaepEQCn7uzOPxmHq';
export const comunidad1 = 'https://chat.whatsapp.com/DiahfK9brw0Azwsk4R9tku';
export const channel = 'https://whatsapp.com/channel/0029VagYdbFEwEk5htUejk0t';
export const channel2 = 'https://whatsapp.com/channel/0029VagYdbFEwEk5htUejk0t';
export const md = 'https://whatsapp.com/channel/0029VagYdbFEwEk5htUejk0t';
export const correo = 'https://whatsapp.com/channel/0029VagYdbFEwEk5htUejk0t';
export const cn = 'https://chat.whatsapp.com/FdBottjrmTvIzD1XTc8vyH';

export const estilo = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    ...(false ? { remoteJid: "5219992095479-1625305606@g.us" } : {})
  },
  message: {
    orderMessage: {
      itemCount: -999999,
      status: 1,
      surface: 1,
      message: '❀ ᥎ᥱgᥱ𝗍ᥲ-sᥙ⍴ᥱr-ᑲ᥆𝗍 ☄︎︎',
      orderTitle: 'Bang',
      thumbnail: botConfig.catalogo,
      sellerJid: '0@s.whatsapp.net'
    }
  }
};

export const ch = {
  ch1: '120363394965381607@newsletter',
  ch2: '120363394965381607@newsletter'
};

export const multplier = 69;
export const maxwarn = 3;
export const cheerioLib = cheerio;
export const fetchLib = fetch;
export const axiosLib = axios;
export const momentLib = moment;

let file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.redBright("Update 'config.js'"));
  import(`${file}?update=${Date.now()}`);
});