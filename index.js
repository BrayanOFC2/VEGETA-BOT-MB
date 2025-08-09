// adaptado por BrayanOFC para VEGETA-BOT-MB con sesión caducidad y conexión estable
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

import './config.js'
import { watchFile, unwatchFile } from 'fs'
import { createRequire } from 'module'
import { fileURLToPath, pathToFileURL } from 'url'
import { platform } from 'process'
import * as ws from 'ws'
import fs, { existsSync, mkdirSync } from 'fs'
import yargs from 'yargs'
import lodash from 'lodash'
import chalk from 'chalk'
import { format } from 'util'
import Pino from 'pino'
import path, { dirname } from 'path'
import { Boom } from '@hapi/boom'
import { makeWASocket, protoType, serialize } from './lib/simple.js'
import { Low, JSONFile } from 'lowdb'
import store from './lib/store.js'

const { proto } = (await import('@whiskeysockets/baileys')).default
import pkg from 'google-libphonenumber'
const { PhoneNumberUtil } = pkg
const phoneUtil = PhoneNumberUtil.getInstance()
const {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  jidNormalizedUser
} = await import('@whiskeysockets/baileys')

import readline from 'readline'
import NodeCache from 'node-cache'

const { chain } = lodash

const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

// Definir carpeta de sesiones
global.sessions = 'sessions'
if (!existsSync(global.sessions)) mkdirSync(global.sessions, { recursive: true })

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

protoType()
serialize()

// Funciones globales para paths y require
global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
};
global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true))
};
global.__require = function require(dir = import.meta.url) {
  return createRequire(dir)
}

global.API = (name, path = '/', query = {}, apikeyqueryname) =>
  (name in global.APIs ? global.APIs[name] : name) +
  path +
  (query || apikeyqueryname
    ? '?' +
      new URLSearchParams(
        Object.entries({
          ...query,
          ...(apikeyqueryname
            ? {
                [apikeyqueryname]:
                  global.APIKeys[
                    name in global.APIs ? global.APIs[name] : name
                  ],
              }
            : {}),
        }),
      )
    : '')

global.timestamp = { start: new Date() }

global.opts = new Object(
  yargs(process.argv.slice(2))
    .exitProcess(false)
    .parse(),
)

global.db = new Low(
  /https?:\/\//.test(global.opts['db'] || '')
    ? new cloudDBAdapter(global.opts['db'])
    : new JSONFile('./src/database/database.json'),
)
global.DATABASE = global.db

global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) {
    return new Promise((resolve) =>
      setInterval(async function () {
        if (!global.db.READ) {
          clearInterval(this)
          resolve(global.db.data == null ? global.loadDatabase() : global.db.data)
        }
      }, 1000),
    )
  }
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read().catch(console.error)
  global.db.READ = null
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(global.db.data || {}),
  }
  global.db.chain = chain(global.db.data)
}
await loadDatabase()

const { state, saveCreds } = await useMultiFileAuthState(global.sessions)

const msgRetryCounterCache = new NodeCache()

const { version } = await fetchLatestBaileysVersion()

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (texto) => new Promise((resolve) => rl.question(texto, resolve))

let opcion
const methodCodeQR = process.argv.includes('qr')
const methodCode = process.argv.includes('code')
const MethodMobile = process.argv.includes('mobile')

const colores = chalk.bgMagenta.white
const opcionQR = chalk.bold.green
const opcionTexto = chalk.bold.cyan

if (methodCodeQR) opcion = '1'

if (!methodCodeQR && !methodCode && !fs.existsSync(`./${global.sessions}/creds.json`)) {
  do {
    opcion = await question(
      colores('✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏\n⚔️ Escoge tu camino, guerrero Saiyajin:\n') +
        opcionQR('1. 📸 Escanear código QR para conectar\n') +
        opcionTexto('2. 🔑 Ingresar código de texto de 8 dígitos\n--> '),
    )
    if (!/^[1-2]$/.test(opcion)) {
      console.log(
        chalk.bold.redBright(
          `✰ཽ Solo puedes elegir la opción 1 o 2, ¡no te rindas! 💪`,
        ),
      )
    }
  } while ((opcion !== '1' && opcion !== '2') || fs.existsSync(`./${global.sessions}/creds.json`))
}

console.info = () => {}
console.debug = () => {}

const connectionOptions = {
  logger: Pino({ level: 'silent' }),
  printQRInTerminal:
    opcion == '1' ? true : methodCodeQR ? true : false,
  mobile: MethodMobile,
  browser:
    opcion == '1'
      ? ['Vegeta-Bot-MB', 'Edge', '20.0.04']
      : methodCodeQR
      ? ['Vegeta-Bot-MB', 'Edge', '20.0.04']
      : ['Ubuntu', 'Edge', '110.0.1587.56'],
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: 'fatal' }).child({ level: 'fatal' })),
  },
  markOnlineOnConnect: true,
  generateHighQualityLinkPreview: true,
  getMessage: async (clave) => {
    let jid = jidNormalizedUser(clave.remoteJid)
    let msg = await store.loadMessage(jid, clave.id)
    return msg?.message || ''
  },
  msgRetryCounterCache,
  defaultQueryTimeoutMs: undefined,
  version: version,
}

global.conn = makeWASocket(connectionOptions)

// Caducidad de sesión: 30 días
const SESSION_EXPIRY = 30 * 24 * 60 * 60 * 1000
function checkSessionExpiry() {
  try {
    const stats = fs.statSync(global.sessions)
    const lastModified = new Date(stats.mtime).getTime()
    const now = Date.now()
    if (now - lastModified > SESSION_EXPIRY) {
      console.log(chalk.bold.redBright('⚠️ Sesión caducada. Eliminando credenciales...'))
      fs.rmSync(global.sessions, { recursive: true, force: true })
      process.exit(0)
    }
  } catch {
    // No pasa nada si no existe la carpeta
  }
}

conn.ev.on('connection.update', async (update) => {
  const { connection, lastDisconnect, qr, isNewLogin } = update
  global.stopped = connection

  if (isNewLogin) conn.isInit = true

  if (qr) {
    console.log(chalk.bold.magenta(`\n❐ 📸 ¡Escanea el código QR rápido! Expira en 45 segundos.\n`))
  }
  if (connection === 'open') {
    console.log(chalk.bold.greenBright('\n⌬ ⚡ VEGETA-BOT-MB ⚡ ¡Conectado y listo para la batalla! ↻'))
    checkSessionExpiry()
  }
  if (connection === 'close') {
    const reason = new Boom(lastDisconnect?.error)?.output?.statusCode
    switch (reason) {
      case DisconnectReason.badSession:
        console.log(chalk.bold.redBright(`\n⚠️ Sesión inválida, elimina la carpeta ${global.sessions} y vuelve a escanear el QR.`))
        break
      case DisconnectReason.connectionClosed:
      case DisconnectReason.connectionLost:
        console.log(chalk.bold.yellowBright(`\n⚠️ Conexión perdida, reconectando...`))
        await global.reloadHandler(true).catch(console.error)
        break
      case DisconnectReason.connectionReplaced:
        console.log(chalk.bold.magentaBright(`\n⚠️ Sesión reemplazada, cierra la sesión actual primero.`))
        break
      case DisconnectReason.loggedOut:
        console.log(chalk.bold.red(`\n⚠️ Sesión cerrada, elimina la carpeta ${global.sessions} y escanea el QR para volver.`))
        process.exit(0)
        break
      case DisconnectReason.restartRequired:
        console.log(chalk.bold.yellow(`\n♻️ Reconectando al campo de batalla...`))
        await global.reloadHandler(true).catch(console.error)
        break
      case DisconnectReason.timedOut:
        console.log(chalk.bold.yellowBright(`\n⏳ Tiempo agotado, reconectando...`))
        await global.reloadHandler(true).catch(console.error)
        break
      default:
        console.log(chalk.bold.red(`\n❌ Razón desconocida de desconexión: ${reason || 'No encontrado'}`))
    }
  }
})

process.on('uncaughtException', console.error)

let isInit = true
let handler = await import('./handler.js')

global.reloadHandler = async function (restartConn = false) {
  try {
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
    if (Object.keys(Handler || {}).length) handler = Handler
  } catch (e) {
    console.error(e)
  }
  if (restartConn) {
    const oldChats = global.conn.chats
    try {
      global.conn.ws.close()
    } catch {}
    global.conn.ev.removeAllListeners()
    global.conn = makeWASocket(connectionOptions, { chats: oldChats })
    isInit = true
  }
  if (!isInit) {
    global.conn.ev.off('messages.upsert', global.conn.handler)
    global.conn.ev.off('connection.update', global.conn.connectionUpdate)
    global.conn.ev.off('creds.update', global.conn.credsUpdate)
  }

  global.conn.handler = handler.handler.bind(global.conn)
  global.conn.connectionUpdate = connectionUpdate.bind(global.conn)
  global.conn.credsUpdate = saveCreds.bind(global.conn, true)

  global.conn.ev.on('messages.upsert', global.conn.handler)
  global.conn.ev.on('connection.update', global.conn.connectionUpdate)
  global.conn.ev.on('creds.update', global.conn.credsUpdate)
  isInit = false
  return true
}

async function isValidPhoneNumber(number) {
  try {
    number = number.replace(/\s+/g, '')
    if (number.startsWith('+521')) {
      number = number.replace('+521', '+52')
    } else if (number.startsWith('+52') && number[4] === '1') {
      number = number.replace('+52 1', '+52')
    }
    const parsedNumber = phoneUtil.parseAndKeepRawInput(number)
    return phoneUtil.isValidNumber(parsedNumber)
  } catch {
    return false
  }
}