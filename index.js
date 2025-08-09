//adaptado por BrayanOFC para VEGETA-BOT-MB 
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'

import './config.js'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import { createRequire } from 'module'
import { fileURLToPath, pathToFileURL } from 'url'
import { platform } from 'process'
import * as ws from 'ws'
import fs, {
  readdirSync,
  statSync,
  unlinkSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  watch
} from 'fs'
import yargs from 'yargs'
import { spawn } from 'child_process'
import lodash from 'lodash'
import { vegetaJadiBot } from './plugins/jadibot-serbot.js'
import chalk from 'chalk'
import syntaxerror from 'syntax-error'
import { tmpdir } from 'os'
import { format } from 'util'
import boxen from 'boxen'
import P from 'pino'
import pino from 'pino'
import Pino from 'pino'
import path, { join, dirname } from 'path'
import { Boom } from '@hapi/boom'
import { makeWASocket, protoType, serialize } from './lib/simple.js'
import { Low, JSONFile } from 'lowdb'
import { mongoDB, mongoDBV2 } from './lib/mongoDB.js'
import store from './lib/store.js'

const { proto } = (await import('@whiskeysockets/baileys')).default
import pkg from 'google-libphonenumber'
const { PhoneNumberUtil } = pkg
const phoneUtil = PhoneNumberUtil.getInstance()
const {
  DisconnectReason,
  useMultiFileAuthState,
  MessageRetryMap,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  jidNormalizedUser
} = await import('@whiskeysockets/baileys')

import readline, { createInterface } from 'readline'
import NodeCache from 'node-cache'

const { CONNECTING } = ws
const { chain } = lodash

const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

global.customPrefix = ['🔥', '⚡', '✨']

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

const __dirname = global.__dirname(import.meta.url)

global.opts = new Object(
  yargs(process.argv.slice(2))
    .exitProcess(false)
    .parse(),
)

global.db = new Low(
  /https?:\/\//.test(opts['db'] || '')
    ? new cloudDBAdapter(opts['db'])
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
      }, 1 * 1000),
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
loadDatabase()

const { state, saveState, saveCreds } = await useMultiFileAuthState(global.sessions)

const msgRetryCounterMap = (MessageRetryMap) => {}
const msgRetryCounterCache = new NodeCache()

const { version } = await fetchLatestBaileysVersion()
let phoneNumber = global.botNumber

const methodCodeQR = process.argv.includes('qr')
const methodCode = !!phoneNumber || process.argv.includes('code')
const MethodMobile = process.argv.includes('mobile')

const colores = chalk.bgMagenta.white
const opcionQR = chalk.bold.green
const opcionTexto = chalk.bold.cyan

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver))

let opcion
if (methodCodeQR) opcion = '1'
if (!methodCodeQR && !methodCode && !fs.existsSync(`./${sessions}/creds.json`)) {
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
  } while ((opcion !== '1' && opcion !== '2') || fs.existsSync(`./${sessions}/creds.json`))
}

// Variables para guardar código de emparejamiento ingresado
let pairingCodeIngresado = null
let pairingCodeSolicitado = false

console.info = () => {}
console.debug = () => {}

const connectionOptions = {
  logger: pino({ level: 'silent' }),
  printQRInTerminal:
    opcion == '1' ? true : methodCodeQR ? true : false,
  mobile: MethodMobile,
  browser:
    opcion == '1'
      ? [`${nameqr}`, 'Edge', '20.0.04']
      : methodCodeQR
      ? [`${nameqr}`, 'Edge', '20.0.04']
      : ['Ubuntu', 'Edge', '110.0.1587.56'],
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(
      state.keys,
      Pino({ level: 'fatal' }).child({ level: 'fatal' }),
    ),
  },
  markOnlineOnConnect: true,
  generateHighQualityLinkPreview: true,
  getMessage: async (clave) => {
    let jid = jidNormalizedUser(clave.remoteJid)
    let msg = await store.loadMessage(jid, clave.id)
    return msg?.message || ''
  },
  msgRetryCounterCache,
  msgRetryCounterMap,
  defaultQueryTimeoutMs: undefined,
  version: [2, 3000, 1023223821],
}

global.conn = makeWASocket(connectionOptions)

async function solicitarNumeroYCodigo() {
  let addNumber
  do {
    phoneNumber = await question(
      chalk.bgBlack(
        chalk.bold.greenBright(
          `✦ Ingresa tu número de WhatsApp Saiyajin para comenzar la pelea.\n${chalk.bold
            .yellowBright(`✏  Ejemplo: 57321×××××××`)}\n${chalk.bold.magentaBright(
            '---> ',
          )}`,
        ),
      ),
    )
    phoneNumber = phoneNumber.replace(/\D/g, '')
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = `+${phoneNumber}`
    }
  } while (!(await isValidPhoneNumber(phoneNumber)))
  addNumber = phoneNumber.replace(/\D/g, '')

  // Solicitar el código de emparejamiento (lo envía WhatsApp)
  let codeBot = await conn.requestPairingCode(addNumber)
  codeBot = codeBot?.match(/.{1,4}/g)?.join('-') || codeBot
  console.log(
    chalk.bold.white(
      chalk.bgMagenta(`✧ CÓDIGO DE VINCULACIÓN SAIYAJIN ✧`),
    ),
    chalk.bold.white(chalk.white(codeBot)),
  )
}

// Si eligió modo texto, pedir número y solicitar código
if (!fs.existsSync(`./${sessions}/creds.json`) && (opcion === '2' || methodCode)) {
  if (!conn.authState.creds.registered) {
    await solicitarNumeroYCodigo()
  }
}

// Manejar actualización de conexión y pedir el código cuando corresponda
conn.ev.on('connection.update', async (update) => {
  const { connection, lastDisconnect, qr } = update

  if (qr) {
    // Mostrar QR para modo QR
    if (opcion === '1' || methodCodeQR) {
      console.log(
        chalk.bold.magenta(
          `\n❐ 📸 ¡Escanea el código QR rápido, guerrero! Expira en 45 segundos.`,
        ),
      )
    }
  }

  if (connection === 'connecting' && opcion === '2' && !pairingCodeSolicitado) {
    // Pedir código de 8 dígitos que llegó por WhatsApp (modo texto)
    pairingCodeSolicitado = true
    pairingCodeIngresado = await question(
      chalk.bgBlack(
        chalk.bold.greenBright(`✎ Ingresa el código de 8 dígitos que recibiste por WhatsApp:\n--> `),
      ),
    )
    try {
      await conn.acceptPairing(pairingCodeIngresado.replace(/-/g, ''))
      console.log(chalk.greenBright('✅ Código aceptado, conectado con éxito.'))
    } catch (e) {
      console.log(chalk.redBright('❌ Código inválido o error al conectar:'), e)
      process.exit(1)
    }
  }

  if (connection == 'open') {
    console.log(
      chalk.bold.greenBright('\n⌬ ⚡ VEGETA-BOT-MB ⚡ ¡Conectado y listo para la batalla! ↻'),
    )
  }

  if (connection === 'close') {
    const reason = new Boom(lastDisconnect?.error)?.output?.statusCode
    switch (reason) {
      case DisconnectReason.badSession:
        console.log(
          chalk.bold.redBright(
            `\n⚠️ Sesión inválida, elimina la carpeta ${global.sessions} y vuelve a escanear el QR.`,
          ),
        )
        break
      case DisconnectReason.connectionClosed:
        console.log(
          chalk.bold.cyan(
            `\n⚠️ Conexión cerrada, reintentando conectar...`,
          ),
        )
        await global.reloadHandler(true).catch(console.error)
        break
      case DisconnectReason.connectionLost:
        console.log(
          chalk.bold.blue(
            `\n⚠️ Conexión perdida, intentado reconectar... ¡No te rindas! 💪`,
          ),
        )
        await global.reloadHandler(true).catch(console.error)
        break
      case DisconnectReason.connectionReplaced:
        console.log(
          chalk.bold.magentaBright(
            `\n⚠️ Sesión reemplazada, cierra la sesión actual primero.`,
          ),
        )
        break
      case DisconnectReason.loggedOut:
        console.log(
          chalk.bold.red(
            `\n⚠️ Sesión cerrada, elimina la carpeta ${global.sessions} y escanea el QR para volver.`,
          ),
        )
        await global.reloadHandler(true).catch(console.error)
        break
      case DisconnectReason.restartRequired:
        console.log(
          chalk.bold.yellow(
            `\n♻️ Reconectando al campo de batalla...`,
          ),
        )
        await global.reloadHandler(true).catch(console.error)
        break
      case DisconnectReason.timedOut:
        console.log(
          chalk.bold.yellowBright(`\n⏳ Tiempo agotado, reconectando...`),
        )
        await global.reloadHandler(true).catch(console.error)
        break
      default:
        console.log(
          chalk.bold.red(
            `\n❌ Razón desconocida de desconexión: ${reason || 'No encontrado'}`,
          ),
        )
    }
  }
})

process.on('uncaughtException', console.error)

let isInit = true
let handler = await import('./handler.js')
global.reloadHandler = async function (restatConn) {
  try {
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
    if (Object.keys(Handler || {}).length) handler = Handler
  } catch (e) {
    console.error(e)
  }
  if (restatConn) {
    const oldChats = global.conn.chats
    try {
      global.conn.ws.close()
    } catch {}
    conn.ev.removeAllListeners()
    global.conn = makeWASocket(connectionOptions, { chats: oldChats })
    isInit = true
  }
  if (!isInit) {
    conn.ev.off('messages.upsert', conn.handler)
    conn.ev.off('connection.update', conn.connectionUpdate)
    conn.ev.off('creds.update', conn.credsUpdate)
  }

  conn.handler = handler.handler.bind(global.conn)
  conn.connectionUpdate = connectionUpdate.bind(global.conn)
  conn.credsUpdate = saveCreds.bind(global.conn, true)

  conn.ev.on('messages.upsert', conn.handler)
  conn.ev.on('connection.update', conn.connectionUpdate)
  conn.ev.on('creds.update', conn.credsUpdate)
  isInit = false
  return true
}

async function connectionUpdate(update) {
  // Puedes dejar esta función para otras cosas o eliminar si no la usas
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
  } catch (error) {
    return false
  }
}