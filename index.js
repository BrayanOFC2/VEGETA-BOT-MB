//adaptado por BrayanOFC para VEGETA-BOT-MB 
console.log('Iniciando 🚀🚀🚀')
import cfonts from 'cfonts'
import chalk from 'chalk'
import * as baileys from "@whiskeysockets/baileys"
import fs from "fs"
import path from "path"
import readlineSync from "readline-sync"
import pino from "pino"
import NodeCache from 'node-cache'
import { startSubBot } from "./lib/subbot.js"
import "./config.js"
import { handler, callUpdate, participantsUpdate, groupsUpdate } from "./handler.js"
import { loadPlugins } from './lib/plugins.js'

cfonts.say('VEGETA-BOT-MB', {
  font: 'chrome',
  align: 'center',
  gradient: ['red', 'magenta'],
  transition: false
})

cfonts.say('by: BrayanOFC', {
  font: 'console',
  align: 'center',
  gradient: ['red', 'magenta'],
  transition: false
})

await loadPlugins()
const BOT_SESSION_FOLDER = "./BotSession"
const BOT_CREDS_PATH = path.join(BOT_SESSION_FOLDER, "creds.json")
if (!fs.existsSync(BOT_SESSION_FOLDER)) fs.mkdirSync(BOT_SESSION_FOLDER)
if (!globalThis.conns || !(globalThis.conns instanceof Array)) globalThis.conns = []
let reconectandoAhora = 0
let usarCodigo = false
let numero = ""
const reconectando = new Set()

main()

async function main() {
  const hayCredencialesPrincipal = fs.existsSync(BOT_CREDS_PATH)
  const subbotsFolder = "./jadibot"
  const haySubbotsActivos = fs.existsSync(subbotsFolder) && fs.readdirSync(subbotsFolder).some(folder => fs.existsSync(path.join(subbotsFolder, folder, "creds.json")))

  if (!hayCredencialesPrincipal && !haySubbotsActivos) {
    const opcion = readlineSync.question(`${chalk.yellowBright('¿Cómo deseas conectarte?\n')}1. Código QR\n2. Código de 8 dígitos\n${chalk.magentaBright('---> ')}`)
    usarCodigo = opcion === "2"
    if (usarCodigo) {
      console.log(chalk.yellow("Ingresa tu número (ej: +521234567890): "))
      numero = readlineSync.question("").replace(/[^0-9]/g, '')
      if (numero.startsWith('52') && !numero.startsWith('521')) numero = '521' + numero.slice(2)
    }
  }

  await cargarSubbots()

  if (hayCredencialesPrincipal || !haySubbotsActivos) {
    try {
      await startBot()
    } catch (err) {
      console.error(chalk.red("❌ Error al iniciar bot principal:"), err)
    }
  } else {
    console.log(chalk.yellow("⚠️ Subbots activos detectados. Bot principal desactivado automáticamente."))
  }
}

async function cargarSubbots() {
  const folder = "./jadibot"
  if (!fs.existsSync(folder)) return
  const subbotIds = fs.readdirSync(folder)
  for (const userId of subbotIds) {
    const sessionPath = path.join(folder, userId)
    const credsPath = path.join(sessionPath, "creds.json")
    if (!fs.existsSync(credsPath)) continue
    if (globalThis.conns?.some(conn => conn.userId === userId)) continue
    if (reconectando.has(userId)) continue
    try {
      reconectando.add(userId)
      await startSubBot(null, null, "Auto reconexión", false, userId, null)
    } catch (e) {
      console.log(chalk.red(`❌ Falló la carga de ${userId}:`, e.message))
    } finally {
      reconectando.delete(userId)
    }
    await new Promise(res => setTimeout(res, 2500))
  }
  setTimeout(cargarSubbots, 60 * 1000)
}

async function startBot() {
  const { state, saveCreds } = await baileys.useMultiFileAuthState(BOT_SESSION_FOLDER)
  const msgRetryCounterCache = new NodeCache({ stdTTL: 0, checkperiod: 0 })
  const userDevicesCache = new NodeCache({ stdTTL: 0, checkperiod: 0 })
  const groupCache = new NodeCache({ stdTTL: 300, checkperiod: 60 })
  const { version } = await baileys.fetchLatestBaileysVersion()

  console.info = () => { }
  const sock = baileys.makeWASocket({
    printQRInTerminal: !usarCodigo && !fs.existsSync(BOT_CREDS_PATH),
    logger: pino({ level: 'silent' }),
    browser: ['Windows', 'Chrome'],
    auth: {
      creds: state.creds,
      keys: baileys.makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
    },
    markOnlineOnConnect: false,
    generateHighQualityLinkPreview: true,
    syncFullHistory: false,
    getMessage: async (key) => {
      try {
        let jid = jidNormalizedUser(key.remoteJid)
        let msg = await store.loadMessage(jid, key.id)
        return msg?.message || ""
      } catch {
        return ""
      }
    },
    msgRetryCounterCache,
    userDevicesCache,
    defaultQueryTimeoutMs: 30_000,
    keepAliveIntervalMs: 55000,
    maxIdleTimeMs: 60000,
    cachedGroupMetadata: async (jid) => groupCache.get(jid),
    version
  })

  globalThis.conn = sock
  setupGroupEvents(sock)
  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
    const code = lastDisconnect?.error?.output?.statusCode || 0
    if (connection === "open") {
      console.log(chalk.bold.greenBright('\n▣─────────────────────────────\n│ CONECTADO CORRECTAMENTE ✅\n▣─────────────────────────────'))
    }
    if (connection === "close") {
      if ([401, 440, 428, 405].includes(code)) {
        console.log(chalk.red(`❌ Sesión inválida (${code}). Borra "BotSession" y vuelve a conectar.`))
      }
      console.log(chalk.yellow("♻️ Conexión cerrada. Reintentando en 3s..."))
      setTimeout(() => startBot(), 3000)
    }
  })

  process.on('uncaughtException', console.error)

  if (usarCodigo && !state.creds.registered) {
    setTimeout(async () => {
      try {
        const code = await sock.requestPairingCode(numero)
        console.log(chalk.yellow('Código de emparejamiento:'), chalk.greenBright(code))
      } catch { }
    }, 2000)
  }

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return
    for (const msg of messages) {
      if (!msg.message) continue
      const tiempoInicio = Math.floor(sock.uptime / 1000)
      if (msg.messageTimestamp && (msg.messageTimestamp < tiempoInicio || (Date.now() / 1000 - msg.messageTimestamp) > 60)) continue
      if (msg.key.id.startsWith('NJX-') || msg.key.id.startsWith('Lyru-') || msg.key.id.startsWith('FizzxyTheGreat-')) return
      try {
        await handler(sock, msg)
      } catch (err) {
        console.error(err)
      }
    }
  })

  sock.ev.on("call", async (calls) => {
    try {
      for (const call of calls) {
        await callUpdate(sock, call)
      }
    } catch (err) {
      console.error(chalk.red("❌ Error procesando llamada:"), err)
    }
  })

  setInterval(() => {
    const tmp = './tmp'
    try {
      if (!fs.existsSync(tmp)) return
      const files = fs.readdirSync(tmp)
      files.forEach(file => {
        if (file.endsWith('.file')) return
        const filePath = path.join(tmp, file)
        const stats = fs.statSync(filePath)
        const age = Date.now() - new Date(stats.mtime).getTime()
        if (age > 3 * 60 * 1000) fs.unlinkSync(filePath)
      })
      console.log(chalk.gray(`♻️ Archivos temporales eliminados.`))
    } catch (err) {
      console.error('Error limpiando TMP:', err)
    }
  }, 30 * 1000)

  setInterval(() => {
    console.log('♻️ Reiniciando bot automáticamente...')
    process.exit(0)
  }, 10800000)

  setInterval(() => {
    const now = Date.now()
    const carpetas = ['./jadibot', './BotSession']
    for (const basePath of carpetas) {
      if (!fs.existsSync(basePath)) continue
      const subfolders = fs.readdirSync(basePath)
      for (const folder of subfolders) {
        const sessionPath = path.join(basePath, folder)
        if (!fs.statSync(sessionPath).isDirectory()) continue
        const isActive = globalThis.conns?.some(c => c.userId === folder || c.user?.id?.includes(folder))
        const files = fs.readdirSync(sessionPath)
        for (const file of files) {
          const fullPath = path.join(sessionPath, file)
          if (!fs.existsSync(fullPath)) continue
          if (file === 'creds.json') continue
          try {
            const stats = fs.statSync(fullPath)
            const ageMs = now - stats.mtimeMs
            if ((file.startsWith('pre-key') && ageMs > 86400000 && !isActive) || (ageMs > 1800000 && !isActive)) {
              fs.unlinkSync(fullPath)
            }
          } catch (err) {
            console.error(chalk.red(`[⚠] Error al limpiar ${file}:`), err)
          }
        }
      }
    }
    console.log(chalk.bold.cyanBright(`\n♻️ Sesiones y archivos basura eliminados.`))
  }, 600000)
}

function setupGroupEvents(sock) {
  sock.ev.on("group-participants.update", async (update) => {
    try {
      await participantsUpdate(sock, update)
    } catch (err) {
      console.error(chalk.red("❌ Error en participantes:"), err)
    }
  })

  sock.ev.on("groups.update", async (updates) => {
    try {
      for (const update of updates) {
        await groupsUpdate(sock, update)
      }
    } catch (err) {
      console.error(chalk.red("❌ Error en grupos:"), err)
    }
  })
}