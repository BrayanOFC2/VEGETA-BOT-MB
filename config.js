import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

//BETA: Si quiere evitar escribir el número que será bot en la consola, agregué desde aquí entonces:
//Sólo aplica para opción 2 (ser bot con código de texto de 8 digitos)
global.botNumberCode = '' //Ejemplo: +573218138672
global.confirmCode = ''

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.owner = [
  ['5216641784469', '⋆𝑪𝒓𝒆𝒂𝒅𝒐𝒓 ღ𝐁𝐫𝐚𝐲𝐚𝐧𝐎𝐅𝐂❦', true],
  ['90263687053350'],
 // ['']
  ['584146277368', '𝓔𝓶𝓶𝓪 𝓥𝓲𝓸𝓵𝓮𝓽𝓼 𝓥𝓮𝓻𝓼𝓲ó𝓷', true],
  ['5491166401905', 'legend', true],
  ['5216641784469', 'ʙʀᴀʏᴀɴ ᴏғᴄ', true],
  ['5216671548329', 'Legna', true], 
  ['50432955554', 'Papi Deylin', true], 
  ['5212431268546', 'Tesis', true],  
  ['155968113483985@lid'],
  ['155968113483985'],
  ['50557865603', 'Niño piña', true], 
  ['5218211111111', 'Papi chulo', true],
  ['5216632130871', 'antrua', true],
  ['5217721103732', 'Daniel', true],
];

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.mods = ['5216641804242', '584120515006', '5216633900512', '573004828388', '573154062343']
global.suittag = ['584120346669']
global.prems = []
global.numcreador = '+52 664 178 4469'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.libreria = 'Baileys'
global.baileys = 'V 6.7.9' 
global.languaje = 'Español'
global.vs = '2.1.5'
global.vsJB = '5.0'
global.nameqr = '𝚅𝙴𝙶𝙴𝚃𝙰 - 𝙱𝙾𝚃 - 𝙼𝙱'
global.namebot = '✿◟𝚅𝚎𝚐𝚎𝚝𝚊-𝙱𝚘𝚝-𝙼𝙱◞✿'
global.sessions = 'Sessions'
global.jadi = 'JadiBots' 
global.VegetaJadibts = true

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.packsticker =`°.⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸.°\n✦ Bσƚ:\n✦ Pɾσριҽƚαɾισ:\n✦ Fҽƈԋα ԃҽ Cɾҽαƈιóɳ:\n✦ Hσɾα ԃҽ Cɾҽαƈιóɳ:\n♾━━━━━━━━`
global.packsticker2 = `━━━━━━━━♾\n⪛·:*¨♱𝚅𝙴𝙶𝙴𝚃𝙰-𝙱𝙾𝚃-𝙼𝙱♱ ¨*:·⪜\n⋆ ༺Ƹ (ꐦ ◣‸◢) 𝙼𝙰𝚁𝚃𝙸𝙽𝙴𝚉\n⇝ ${moment.tz('america/Los_angeles').format('DD/MM/YY')}\n⇝ ${moment.tz('America/Los_angeles').format('HH:mm:ss')} \n°.⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸.°\n\nѕτιϲκєя ϐγ: 𝚅𝙴𝙶𝙴𝚃𝙰-𝙱𝙾𝚃-𝙼𝙱`

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.packname = `⪛✰¨♱𝚅𝙴𝙶𝙴𝚃𝙰-𝙱𝙾𝚃-𝙼𝙱`
global.botname = '*♱𝚅𝙴𝙶𝙴𝚃𝙰-𝙱𝙾𝚃-𝙼𝙱♱*'
global.wm = 'ৎ୭࠭͢𓆪͟͞ 𝚅𝙴𝙶𝙴𝚃𝙰-𝙱𝙾𝚃-𝙼𝙱'
global.author = 'Made By ➳𝐁𝐫𝐚𝐲𝐚𝐧𝐎𝐅𝐂❦'
global.dev = '© ⍴᥆ᥕᥱrᥱძ ᑲᥡ  ➳𝐁𝐫𝐚𝐲𝐚𝐧𝐎𝐅𝐂ღ'
global.textbot = ' ➳𝐁𝐫𝐚𝐲𝐚𝐧𝐎𝐅𝐂❦ • P·:*¨♱𝚅𝙴𝙶𝙴𝚃𝙰-𝙱𝙾𝚃-𝙼𝙱♱ ¨*:·'

global.moneda = 'dragones'
global.welcom1 = 'Edita Con #setwelcome'
global.welcom2 = 'Edita Con #setbye'
global.banner = 'https://files.catbox.moe/j0z1kz.jpg'
global.catalogo = 'https://files.catbox.moe/j0z1kz.jpg'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.imagen1 = fs.readFileSync('./src/menus/Menu2.jpg');
global.imagen2 = fs.readFileSync('./src/anime.jpg');
global.imagen3 = fs.readFileSync('./src/menus/Menu3.jpg');
global.imagen4 = fs.readFileSync('./src/menus/Menu.jpg');

global.photoSity = [imagen1, imagen2, imagen3, imagen4]

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.gp4 = 'https://chat.whatsapp.com/DWVnDWaepEQCn7uzOPxmHq'
global.gp1 = 'https://chat.whatsapp.com/DWVnDWaepEQCn7uzOPxmHq' 
global.gp2 = 'https://chat.whatsapp.com/FdBottjrmTvIzD1XTc8vyH'
global.comunidad1 = 'https://chat.whatsapp.com/DiahfK9brw0Azwsk4R9tku'
global.channel = 'https://whatsapp.com/channel/0029VagYdbFEwEk5htUejk0t'
global.channel2 = 'https://whatsapp.com/channel/0029VagYdbFEwEk5htUejk0t'
global.md = 'https://whatsapp.com/channel/0029VagYdbFEwEk5htUejk0t'
global.correo = 'https://whatsapp.com/channel/0029VagYdbFEwEk5htUejk0t'
global.cn ='https://chat.whatsapp.com/FdBottjrmTvIzD1XTc8vyH';

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.estilo = { key: {  fromMe: false, participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "5219992095479-1625305606@g.us" } : {}) }, message: { orderMessage: { itemCount : -999999, status: 1, surface : 1, message: '❀ ᥎ᥱgᥱ𝗍ᥲ-sᥙ⍴ᥱr-ᑲ᥆𝗍 ☄︎︎', orderTitle: 'Bang', thumbnail: catalogo, sellerJid: '0@s.whatsapp.net'}}}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.ch = {
ch1: '120363394965381607@newsletter',
ch2: '120363394965381607@newsletter',
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment   


//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.multiplier = 69
global.maxwarn = '3'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
