import { readdir, unlink, existsSync } from 'fs'
import path from 'path'

const handler = async (m, { conn, usedPrefix }) => {
  const sessionFolder = './sessions'
  

  if (global.conn.user.jid !== conn.user.jid) {
    return conn.reply(m.chat, `${emoji} Utiliza este comando directamente en el número principal del Bot.`, m, fake)
  }

  await m.react(rwait)

  try {
    if (!existsSync(sessionFolder)) {
      return await conn.reply(m.chat, `${emoji2} La carpeta de sesiones no existe.`, m, fake)
    }

    const files = await readdir(sessionFolder)
    let filesDeleted = 0

    for (const file of files) {
      if (file !== 'creds.json') {
        await unlink(path.join(sessionFolder, file))
        filesDeleted++
      }
    }

    if (filesDeleted === 0) {
      await conn.reply(m.chat, `${emoji2} No se encontraron archivos para eliminar.`, m, fake)
    } else {
      await m.react(done)
      await conn.reply(m.chat, `${emoji} Se eliminaron ${filesDeleted} archivos de sesión (excepto creds.json).`, m, fake)
      await conn.reply(m.chat, `${emoji} *¡Hola! ¿logras verme?*`, m, fake)
    }
  } catch (err) {
    console.error('Error al eliminar archivos de sesión:', err)
    await conn.reply(m.chat, `${msm} Ocurrió un fallo inesperado.`, m, fake)
  }
}

handler.help = ['dsowner']
handler.tags = ['owner']
handler.command = ['delai', 'dsowner', 'clearallsession']
handler.rowner = true

export default handler