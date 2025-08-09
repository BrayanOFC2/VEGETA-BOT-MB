//adaptado por BrayanOFC para VEGETA-BOT-MB 
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'

import './config.js'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import yargs from 'yargs'
import lodash from 'lodash'
import chalk from 'chalk'
import pino from 'pino'
import { Boom } from '@hapi/boom'
import { makeWASocket, protoType, serialize } from './lib/simple.js'
import { Low, JSONFile } from 'lowdb'
import { mongoDB, mongoDBV2 } from './lib/mongoDB.js'
import store from './lib/store.js'
import pkg from 'google-libphonenumber'
import readline from 'readline'
import NodeCache from 'node-cache'
import { useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser, DisconnectReason, MessageRetryMap } from '@whiskeysockets/baileys'

const { PhoneNumberUtil } = pkg
const phoneUtil = PhoneNumberUtil.getInstance()

protoType()
serialize()

global.customPrefix = ['🔥', '⚡', '✨', '\\.']
function escapeEmojiForRegex(emoji) {
  return emoji.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}
const regexPrefix = global.customPrefix.map(escapeEmojiForRegex).join('|')
global.prefix = new RegExp(`^(${regexPrefix})`)

console.log(chalk.bold.blueBright(`
╔═══════════════════════════════════════╗
║   ⚡ VEGETA-BOT-MB ACTIVADO ⚡         ║
║  ʕ•ᴥ•ʔ ¡Prepárate para la batalla!    ║
║   🌟 El poder de un Saiyajin despierta 🌟  ║
╚═══════════════════════════════════════╝
`))

console.log(chalk.bold.yellowBright('╔═══════════════════════════════════════╗'))
console.log(chalk.bold.greenBright('║       Desarrollado por BrayanOFC 👑   ║'))
console.log(chalk.bold.yellowBright('╚═══════════════════════════════════════╝\n'))

const __dirname = path.dirname(fileURLToPath(import.meta.url))

global.opts = new Object(
  yargs(process.argv.slice(2))
    .exitProcess(false)
    .parse(),
)

global.db = new Low(
  /https?:\/\//.test(opts['db'] || '')
    ? new mongoDB(opts['db'])
    : new JSONFile(path.join(__dirname, 'database/database.json')),
)
global.DATABASE = global.db

async function loadDatabase() {
  if (global.db.READ) {
    return new Promise((resolve) =>
      setInterval(async function () {
        if (!global.db.READ) {
          clearInterval(this)
          resolve(global.db.data == null ? loadDatabase() : global.db.data)
        }
      }, 1000),
    )
  }
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read().catch(console.error)
  global.db.READ = null
  global.db.data = global.db.data || { users: {}, chats: {}, stats: {}, msgs: {}, sticker: {}, settings: {} }
  global.db.chain = lodash.chain(global.db.data)
}
await loadDatabase()

const { state, saveCreds } = await useMultiFileAuthState('./sessions')

const msgRetryCounterCache = new NodeCache()
const msgRetryCounterMap = (MessageRetryMap) => {}

const { version } = await fetchLatestBaileysVersion()

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise(resolve => rl.question(text, resolve))

let opcion

if (process.argv.includes('qr')) opcion = '1'
else if (process.argv.includes('code')) opcion = '2'
else {
  do {
    opcion = await question(
      chalk.bgMagenta.white('✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏\n⚔️ Escoge tu camino, guerrero Saiyajin:\n') +
      chalk.green('1. 📸 Escanear código QR para conectar\n') +
      chalk.cyan('2. 🔑 Ingresar código de texto de 8 dígitos\n--> ')
    )
    if (!['1', '2'].includes(opcion.trim())) {
      console.log(chalk.redBright('✰ཽ Solo puedes elegir la opción 1 o 2, ¡no te rindas! 💪'))
    }
  } while (!['1', '2'].includes(opcion.trim()))
}

const connectionOptions = {
  logger: pino({ level: 'silent' }),
  printQRInTerminal: opcion === '1',
  browser: opcion === '1' ? ['VEGETA-BOT-MB', 'Edge', '20.0.04'] : ['Ubuntu', 'Edge', '110.0.1587.56'],
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }).child({ level: 'fatal' }))
  },
  markOnlineOnConnect: true,
  generateHighQualityLinkPreview: true,
  getMessage: async (key) => {
    const jid = jidNormalizedUser(key.remoteJid)
    const msg = await store.loadMessage(jid, key.id)
    return msg?.message || ''
  },
  msgRetryCounterCache,
  msgRetryCounterMap,
  version,
}

global.conn = makeWASocket(connectionOptions)

async function isValidPhoneNumber(number) {
  try {
    number = number.trim()
    if (!number.startsWith('+')) number = '+' + number
    if (number.startsWith('+521')) number = number.replace('+521', '+52')
    else if (number.startsWith('+52') && number[4] === '1') number = number.replace('+52 1', '+52')
    const parsed = phoneUtil.parseAndKeepRawInput(number)
    return phoneUtil.isValidNumber(parsed)
  } catch {
    return false
  }
}

if (opcion === '2') {
  let number
  do {
    number = await question(chalk.green('✦ Ingresa tu número de WhatsApp Saiyajin para comenzar la pelea (sin +):\n--> '))
    number = number.replace(/\D/g, '')
  } while (!(await isValidPhoneNumber(number)))
  
  try {
    await conn.requestPairingCode(number)
    console.log(chalk.bgMagenta.white('✧ Código de emparejamiento enviado ✧'))
  } catch (e) {
    console.error(chalk.redBright('❌ Error enviando código de emparejamiento:', e.message || e))
    process.exit(1)
  }

  const code8 = await question(chalk.green('✦ Ingresa el código de texto de 8 dígitos:\n--> '))

  try {
    await conn.acceptPairing(number, code8.trim())
    console.log(chalk.green('✔️ Código aceptado, conectado correctamente!'))
  } catch (e) {
    console.error(chalk.redBright('❌ Error al aceptar el código de texto:', e.message || e))
    process.exit(1)
  }
  rl.close()
}

conn.ev.on('connection.update', async (update) => {
  const { connection, lastDisconnect, qr } = update

  if (qr && opcion === '1') {
    console.log(chalk.magenta('\n❐ 📸 ¡Escanea el código QR rápido, guerrero! Expira en 45 segundos.\n'))
  }

  if (connection === 'open') {
    console.log(chalk.green('\n⌬ ⚡ VEGETA-BOT-MB ⚡ ¡Conectado y listo para la batalla! ↻\n'))
  }

  if (connection === 'close') {
    const reason = new Boom(lastDisconnect?.error)?.output?.statusCode
    switch (reason) {
      case DisconnectReason.badSession:
        console.log(chalk.redBright(`\n⚠️ Sesión inválida, elimina la carpeta sessions y vuelve a escanear el QR.`))
        break
      case DisconnectReason.connectionClosed:
        console.log(chalk.cyan(`\n⚠️ Conexión cerrada, reintentando conectar...`))
        await reloadHandler(true)
        break
      case DisconnectReason.connectionLost:
        console.log(chalk.blue(`\n⚠️ Conexión perdida, intentando reconectar...`))
        await reloadHandler(true)
        break
      case DisconnectReason.connectionReplaced:
        console.log(chalk.magentaBright(`\n⚠️ Sesión reemplazada, cierra la sesión actual primero.`))
        break
      case DisconnectReason.loggedOut:
        console.log(chalk.red(`\n⚠️ Sesión cerrada, elimina la carpeta sessions y escanea el QR para volver.`))
        await reloadHandler(true)
        break
      case DisconnectReason.restartRequired:
        console.log(chalk.yellow(`\n♻️ Reconectando al campo de batalla...`))
        await reloadHandler(true)
        break
      case DisconnectReason.timedOut:
        console.log(chalk.yellowBright(`\n⏳ Tiempo agotado, reconectando...`))
        await reloadHandler(true)
        break
      default:
        console.log(chalk.red(`\n❌ Razón desconocida de desconexión: ${reason || 'No encontrado'}`))
    }
  }
})

process.on('uncaughtException', console.error)

let handler = await import('./handler.js')
let isInit = true

global.reloadHandler = async function (restartConn) {
  try {
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
    if (Object.keys(Handler || {}).length) handler = Handler
  } catch (e) {
    console.error(e)
  }
  if (restartConn) {
    try { global.conn.ws.close() } catch {}
    conn.ev.removeAllListeners()
    global.conn = makeWASocket(connectionOptions)
    isInit = true
  }
  if (!isInit) {
    conn.ev.off('messages.upsert', conn.handler)
    conn.ev.off('connection.update', conn.connectionUpdate)
    conn.ev.off('creds.update', conn.credsUpdate)
  }
  conn.handler = handler.handler.bind(global.conn)
  conn.connectionUpdate = global.conn.ev.on.bind(global.conn.ev, 'connection.update')
  conn.credsUpdate = saveCreds.bind(global.conn, true)

  conn.ev.on('messages.upsert', conn.handler)
  conn.ev.on('connection.update', conn.connectionUpdate)
  conn.ev.on('creds.update', conn.credsUpdate)
  isInit = false
  return true
}

if (!opts['test']) {
  if (global.db)
    setInterval(async () => {
      if (global.db.data) await global.db.write()
    }, 30000)
}