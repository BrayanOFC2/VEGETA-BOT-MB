//adaptado por BrayanOFC para VEGETA-BOT-MB 
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
import './config.js'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile, readdirSync, statSync, unlinkSync, existsSync, mkdirSync, readFileSync } from 'fs'
import { createRequire } from 'module'
import { fileURLToPath, pathToFileURL } from 'url'
import { platform } from 'process'
import * as ws from 'ws'
import yargs from 'yargs'
import { spawn } from 'child_process'
import lodash from 'lodash'
import { JadiBot } from './plugins/jadibot-serbot.js'
import chalk from 'chalk'
import syntaxerror from 'syntax-error'
import { tmpdir } from 'os'
import { format } from 'util'
import boxen from 'boxen'
import pino from 'pino'
import path, { join } from 'path'
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

import readline from 'readline'
import NodeCache from 'node-cache'

const { CONNECTING } = ws
const { chain } = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

// Variables faltantes que se usan en tu código
const sessions = 'sessions'
const jadi = 'JadiBots'
const nameqr = 'VEGETA-BOT-MB'

// Mensajes iniciales
console.log(chalk.bold.redBright(`
╔═══════════════════════════════════════╗
║   ⚡ VEGETA-BOT-MB ACTIVADO ⚡         ║
║  ʕ•ᴥ•ʔ ¡Prepárate para la batalla!    ║
╚═══════════════════════════════════════╝
`))
console.log(chalk.bold.magentaBright('╔═══════════════════════════════════════╗'))
console.log(chalk.bold.cyanBright('║       Desarrollado por BrayanOFC 👑   ║'))
console.log(chalk.bold.magentaBright('╚═══════════════════════════════════════╝\n'))

protoType()
serialize()

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
}
global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true))
}
global.__require = function require(dir = import.meta.url) {
  return createRequire(dir)
}

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({...query, ...(apikeyqueryname ? {[apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]} : {})})) : '');

global.timestamp = {start: new Date}

const __dirname = global.__dirname(import.meta.url)

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[#/!.]')

global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile('./src/database/database.json'))
global.DATABASE = global.db 

global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) {
    return new Promise((resolve) => setInterval(async function() {
      if (!global.db.READ) {
        clearInterval(this)
        resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
      }
    }, 1000))
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

const {state, saveState, saveCreds} = await useMultiFileAuthState(global.sessions)
const msgRetryCounterCache = new NodeCache()
const {version} = await fetchLatestBaileysVersion();
let phoneNumber = global.botNumber

const methodCodeQR = process.argv.includes("qr")
const methodCode = !!phoneNumber || process.argv.includes("code")
const MethodMobile = process.argv.includes("mobile")
const colores = chalk.bgMagenta.white
const opcionQR = chalk.bold.green
const opcionTexto = chalk.bold.cyan
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver))

let opcion
if (methodCodeQR) opcion = '1'

if (!methodCodeQR && !methodCode && !existsSync(`./${sessions}/creds.json`)) {
  do {
    opcion = await question(colores('✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏\n Seleccione una opción Saiyajin☁️:\n') + opcionQR('1. Con código QR\n') + opcionTexto('2. Con código de texto de 8 dígitos\n--> '))
    if (!/^[1-2]$/.test(opcion)) {
      console.log(chalk.bold.redBright(`✰ཽ No se permiten numeros que no sean 1 o 2, tampoco letras o símbolos especiales Saiyajin☁️.`))
    }
  } while (opcion !== '1' && opcion !== '2' || existsSync(`./${sessions}/creds.json`))
} 

console.info = () => {} 
console.debug = () => {} 

const connectionOptions = {
  logger: pino({ level: 'silent' }),
  printQRInTerminal: opcion == '1' || methodCodeQR ? true : false,
  mobile: MethodMobile, 
  browser: opcion == '1' || methodCodeQR ? [`${nameqr}`, 'Edge', '20.0.04'] : ['Ubuntu', 'Edge', '110.0.1587.56'],
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
  },
  markOnlineOnConnect: true, 
  generateHighQualityLinkPreview: true, 
  getMessage: async (clave) => {
    let jid = jidNormalizedUser(clave.remoteJid)
    let msg = await store.loadMessage(jid, clave.id)
    return msg?.message || ""
  },
  msgRetryCounterCache,
  msgRetryCounterMap: MessageRetryMap,
  defaultQueryTimeoutMs: undefined,
  version: [2, 3000, 1023223821],
}

global.conn = makeWASocket(connectionOptions)

// --- AUTENTICACIÓN CON CÓDIGO DE TEXTO ---
if (!existsSync(`./${sessions}/creds.json`) && (opcion === '2' || methodCode)) {
  if (!conn.authState.creds.registered) {
    let addNumber
    if (!!phoneNumber) {
      addNumber = phoneNumber.replace(/[^0-9]/g, '')
    } else {
      do {
        phoneNumber = await question(chalk.bgBlack(chalk.bold.greenBright(`✦ Por favor, Ingrese tu número de WhatsApp Saiyajin☁️🔥.\n${chalk.bold.yellowBright(`✏  Ejemplo: 57321×××××××\n✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏`)}\n${chalk.bold.magentaBright('---> ')}`)))
        phoneNumber = phoneNumber.replace(/\D/g,'')
        if (!phoneNumber.startsWith('+')) phoneNumber = `+${phoneNumber}`
      } while (!await isValidPhoneNumber(phoneNumber))
      rl.close()
      addNumber = phoneNumber.replace(/\D/g, '')
      setTimeout(async () => {
        let codeBot = await conn.requestPairingCode(addNumber)
        codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot
        console.log(chalk.bold.white(chalk.bgMagenta(`☁️ CÓDIGO DE VINCULACIÓN SAIYAJIN 👑 `)), chalk.bold.white(codeBot))
      }, 3000)
    }
  }
}

// --- FUNCIONES DE VALIDACIÓN DE NÚMERO ---
async function isValidPhoneNumber(number) {
  try {
    number = number.replace(/\s+/g, '')
    if (number.startsWith('+521')) number = number.replace('+521', '+52');
    else if (number.startsWith('+52') && number[4] === '1') number = number.replace('+52 1', '+52');
    const parsedNumber = phoneUtil.parseAndKeepRawInput(number)
    return phoneUtil.isValidNumber(parsedNumber)
  } catch (error) {
    return false
  }
}