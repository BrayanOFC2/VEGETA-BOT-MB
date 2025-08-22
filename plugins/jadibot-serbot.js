const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion} = (await import("@whiskeysockets/baileys"));
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import util from 'util' 
import * as ws from 'ws'
const { child, spawn, exec } = await import('child_process')
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'
let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
let drm1 = ""
let drm2 = ""
let rtx = `╭───────────────✎  
│  ツ 𝚅𝙴𝙶𝙴𝚃𝙰 𝙱𝙾𝚃 𝙼𝙱 ➳  
╰───────────────✎  
> ★ 𝗖𝗼𝗻𝗲𝘅𝗶ó𝗻 𝗦𝘂𝗯-𝗕𝗼𝘁 (𝗠𝗼𝗱𝗼 𝗤𝗥) ✈  

⟿ 𝐄𝐬𝐜𝐚𝐧𝐞𝐚 𝐞𝐬𝐭𝐞 𝐂𝐨́𝐝𝗶𝗴𝗼 𝐐𝐑 𝐜𝐨𝐧 𝐨𝐭𝐫𝐨 𝐜𝐞𝐥𝐮𝐥𝐚𝐫  
𝐨 𝐝𝐞𝐬𝐝𝐞 𝐥𝐚 𝐏𝐂 𝐩𝐚𝐫𝐚 𝐜𝐨𝐧𝐯𝐞𝐫𝐭𝐢𝐫𝐭𝐞 𝐞𝐧 𝐮𝐧 *𝗦𝘂𝗯-𝗕𝗼𝘁 𝗧𝗲𝗺𝗽𝗼𝗿𝗮𝗹*.  

➥ ❶ 𓂃 Toca los tres puntos en la esquina superior derecha.  
➥ ❷ 𓂃 Ve a *"Dispositivos vinculados"*.  
➥ ❸ 𓂃 Escanea este QR y conéctate al bot.  

⚠ 𝐄𝐬𝐭𝐞 𝐜𝐨́𝐝𝗶𝗴𝗼 𝐐𝐑 𝐞𝐱𝐩𝗶𝗿𝐚 𝐞𝐧 ❺❹ 𝐬𝐞𝗴𝐮𝗻𝗱𝗼𝐬. 𝐍𝐨 𝐩𝐢𝐞𝐫𝐝𝐚𝐬 𝐭𝐢𝐞𝐦𝐩𝐨.  
`;

let rtx2 = `╭───────────────⍰  
│  ✭ 𝚅𝙴𝙶𝙴𝚃𝙰 𝙱𝙾𝚃 𝙼𝙱 ✰  
╰───────────────⍰ 
> ✰ 𝗖𝗼𝗻𝗲𝘅𝗶ó𝗻 𝗦𝘂𝗯-𝗕𝗼𝘁 (𝗠𝗼𝗱𝗼 𝗖𝗼́𝗱𝗶𝗴𝗼) 

⟿ 𝐔𝐬𝐚 𝐞𝐬𝐭𝐞 𝐜𝐨́𝐝𝗶𝗴𝗼 𝐩𝐚𝐫𝐚 𝐜𝐨𝐧𝐯𝐞𝐫𝐭𝐢𝐫𝐭𝐞 𝐞𝐧 𝐮𝐧 *𝗦𝘂𝗯-𝗕𝗼𝘁 𝗧𝗲𝗺𝗽𝗼𝗿𝗮𝗹*.  

➥ ❶ 𓂃 Toca los tres puntos en la esquina superior derecha.  
➥ ❷ 𓂃 Ve a *"Dispositivos vinculados"*.  
➥ ❸ 𓂃 Selecciona *Vincular con el número de teléfono*.  
➥ ❹ 𓂃 Ingresa el código y conéctate al bot.  

⚠ 𝐒𝐢 𝐲𝐚 𝐞𝐬𝐭á𝐬 𝐜𝐨𝐧𝐞𝐜𝐭𝐚𝐝𝐨 𝐚 𝐨𝐭𝐫𝐚 𝐬𝐞𝐬𝐢ó𝐧, 𝐬𝐞 𝐫𝐞𝐜𝐨𝐦𝐢𝐞𝐧𝐝𝐚  
𝐪𝐮𝐞 𝐭𝐞 𝐝𝐞𝐬𝐜𝐨𝐧𝐞𝐜𝐭𝐞𝐬. 𝐄𝐬𝐭𝐚𝐫 𝐞𝐧 𝐝𝐨𝐬 𝐩𝐮𝐞𝐝𝐞 𝐜𝐚𝐮𝐬𝐚𝐫 𝐞𝐫𝐫𝐨𝐫𝐞𝐬  
𝐲 𝐮𝐧 𝐩𝐨𝐬𝐢𝐛𝐥𝐞 𝐛𝐚𝐧𝐞𝐨 𝐝𝐞 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽.  
`;

let imagenUrl = 'https://files.catbox.moe/ef2d5u.jpg';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const JBOptions = {}
if (global.conns instanceof Array) console.log()
else global.conns = []
let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
if (!globalThis.db.data.settings[conn.user.jid].jadibotmd) return m.reply(`♡ Comando desactivado temporalmente.`)
let time = global.db.data.users[m.sender].Subs + 120000
const subBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])]
const subBotsCount = subBots.length
if (subBotsCount === 20) {
return m.reply(`${emoji2} No se han encontrado espacios para *Sub-Bots* disponibles.`)
}
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let id = `${who.split`@`[0]}`
let pathJadiBot = path.join(`./${jadi}/`, id)
if (!fs.existsSync(pathJadiBot)){
fs.mkdirSync(pathJadiBot, { recursive: true })
}
JBOptions.pathJadiBot = pathJadiBot
JBOptions.m = m
JBOptions.conn = conn
JBOptions.args = args
JBOptions.usedPrefix = usedPrefix
JBOptions.command = command
JBOptions.fromCommand = true
JadiBot(JBOptions)
global.db.data.users[m.sender].Subs = new Date * 1
} 
handler.help = ['qr', 'code']
handler.tags = ['serbot']
handler.command = ['qr', 'code']
export default handler 

export async function JadiBot(options) {
let { pathJadiBot, m, conn, args, usedPrefix, command } = options
if (command === 'code') {
command = 'qr'; 
args.unshift('code')}
const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false
let txtCode, codeBot, txtQR
if (mcode) {
args[0] = args[0].replace(/^--code$|^code$/, "").trim()
if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "").trim()
if (args[0] == "") args[0] = undefined
}
const pathCreds = path.join(pathJadiBot, "creds.json")
if (!fs.existsSync(pathJadiBot)){
fs.mkdirSync(pathJadiBot, { recursive: true })}
try {
args[0] && args[0] != undefined ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : ""
} catch {
conn.reply(m.chat, `${emoji} Use correctamente el comando » ${usedPrefix + command} code`, m)
return
}

const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
const drmer = Buffer.from(drm1 + drm2, `base64`)

let { version, isLatest } = await fetchLatestBaileysVersion()
const msgRetry = (MessageRetryMap) => { }
const msgRetryCache = new NodeCache()
const { state, saveState, saveCreds } = await useMultiFileAuthState(pathJadiBot)

const connectionOptions = {
logger: pino({ level: "fatal" }),
printQRInTerminal: false,
auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
msgRetry,
msgRetryCache,
browser: mcode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['Bot(Sub Bot)', 'Chrome','2.0.0'],
version: version,
generateHighQualityLinkPreview: true
};

let sock = makeWASocket(connectionOptions)
sock.isInit = false
let isInit = true

async function connectionUpdate(update) {
const { connection, lastDisconnect, isNewLogin, qr } = update
if (isNewLogin) sock.isInit = false
if (qr && !mcode) {
if (m?.chat) {
txtQR = await conn.sendMessage(m.chat, {
    image: await qrcode.toBuffer(qr, { scale: 8 }),
    caption: rtx.trim(),
}, { quoted: m })
} else {
return 
}
if (txtQR && txtQR.key) {
setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key })}, 30000)
}
return
} 
if (qr && mcode) {
  let secret = await sock.requestPairingCode((m.sender.split`@`[0]))
secret = secret.match(/.{1,4}/g)?.join("-")
txtCode = await conn.sendMessage(m.chat, {
    image: { url: imagenUrl },
    caption: rtx2,
    quoted: m,
});
codeBot = await conn.reply(m.chat, `${secret}`, m);
console.log(secret)
}
if (txtCode && txtCode.key) {
setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key })}, 30000)
}
if (codeBot && codeBot.key) {
setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key })}, 30000)
}
const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
if (connection === 'close') {
if (reason !== DisconnectReason.loggedOut && reason !== 401 && reason !== 403) {
console.log(chalk.bold.yellow(`\n⚠️ Subbot ${path.basename(pathJadiBot)} desconectado, intentando reconectar...`))
await creloadHandler(true).catch(console.error)
} else {
console.log(chalk.bold.red(`\n❌ Subbot ${path.basename(pathJadiBot)} cerró sesión permanentemente, necesita nuevo QR o código.`))
}}
if (global.db.data == null) loadDatabase()
if (connection == `open`) {
if (!global.db.data?.users) loadDatabase()
let userName, userJid 
userName = sock.authState.creds.me.name || 'Anónimo'
userJid = sock.authState.creds.me.jid || `${path.basename(pathJadiBot)}@s.whatsapp.net`
console.log(chalk.bold.cyanBright(`\n❒⸺⸺⸺⸺【• SUB-BOT •】⸺⸺⸺⸺❒\n│\n│ 🟢 ${userName} (+${path.basename(pathJadiBot)}) conectado exitosamente.\n│\n❒⸺⸺⸺【• CONECTADO •】⸺⸺⸺❒`))
sock.isInit = true
global.conns.push(sock)
await joinChannels(sock)
m?.chat ? await conn.sendMessage(m.chat, {text: args[0] ? `@${m.sender.split('@')[0]}, ya estás conectado, leyendo mensajes entrantes...` : ` Bienvenido @${m.sender.split('@')[0]}, a la familia de ${botname} disfruta del bot.\n\n\n> ${dev}`, mentions: [m.sender]}, { quoted: m }) : ''
}}
setInterval(async () => {
if (!sock.user) {
try { sock.ws.close() } catch (e) { }
sock.ev.removeAllListeners()
let i = global.conns.indexOf(sock)                
if (i < 0) return
delete global.conns[i]
global.conns.splice(i, 1)
}}, 60000)

let handler = await import('../handler.js')
let creloadHandler = async function (restatConn) {
try {
const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
if (Object.keys(Handler || {}).length) handler = Handler
} catch (e) {
console.error('⚠️ Nuevo error: ', e)
}
if (restatConn) {
const oldChats = sock.chats
try { sock.ws.close() } catch { }
sock.ev.removeAllListeners()
sock = makeWASocket(connectionOptions, { chats: oldChats })
isInit = true
}
if (!isInit) {
sock.ev.off("messages.upsert", sock.handler)
sock.ev.off("connection.update", sock.connectionUpdate)
sock.ev.off('creds.update', sock.credsUpdate)
}
sock.handler = handler.handler.bind(sock)
sock.connectionUpdate = connectionUpdate.bind(sock)
sock.credsUpdate = saveCreds.bind(sock, true)
sock.ev.on("messages.upsert", sock.handler)
sock.ev.on("connection.update", sock.connectionUpdate)
sock.ev.on("creds.update", sock.credsUpdate)
isInit = false
return true
}
creloadHandler(false)
})
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));}
function msToTime(duration) {
var milliseconds = parseInt((duration % 1000) / 100),
seconds = Math.floor((duration / 1000) % 60),
minutes = Math.floor((duration / (1000 * 60)) % 60),
hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
hours = (hours < 10) ? '0' + hours : hours
minutes = (minutes < 10) ? '0' + minutes : minutes
seconds = (seconds < 10) ? '0' + seconds : seconds
return minutes + ' m y ' + seconds + ' s '
}

async function joinChannels(conn) {
for (const channelId of Object.values(global.ch)) {
await conn.newsletterFollow(channelId).catch(() => {})
}}