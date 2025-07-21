import { readdirSync, unlinkSync, existsSync, promises as fs, rmSync } from 'fs'
import path from 'path'

var handler = async (m, { conn, usedPrefix }) => {

if (global.conn.user.jid !== conn.user.jid) {
return conn.reply(m.chat, `${emoji} Utiliza este comando directamente en el número principal del Bot.`, m, rcanal);
}
await conn.reply(m.chat, `${emoji2} Iniciando proceso de eliminación de  los archivos de sesión, excepto el archivo creds.json...`, m, rcanal);
m.react(rwait)

let sessionPath = `./${sessions}/`

try {

if (!existsSync(sessionPath)) {
return await conn.reply(m.chat, `${emoji} ʟᴀ ᴄᴀʀᴘᴇᴛᴀ ᴇsᴛᴀ ᴠᴀᴄɪᴀ✔️.`, m, rcanal);
}
let files = await fs.readdir(sessionPath)
let filesDeleted = 0
for (const file of files) {
if (file !== 'creds.json') {
await fs.unlink(path.join(sessionPath, file))
filesDeleted++;
}
}
if (filesDeleted === 0) {
await conn.reply(m.chat, `${emoji2} La carpeta esta vacía.`, m, rcanal);
} else {
m.react(done)
await conn.reply(m.chat, `${emoji} Se eliminaron ${filesDeleted} ᴀʀᴄʜɪᴠᴏs ᴅᴇ sᴇsɪᴏɴ, ᴇxᴄᴇᴘᴛᴏ ᴇʟ ᴀʀᴄʜɪᴠᴏ creds.json.`, m, rcanal);
conn.reply(m.chat, `${emoji} *¡Hola! ¿logras verme?*`, m, rcanal);

}
} catch (err) {
console.error('ᴇʀʀᴏʀ ᴀʟ ʟᴇᴇʀ ʟᴀ ᴄᴀʀᴘᴇᴛᴀ ᴏ ʟᴏs ᴀʀᴄʜɪᴠᴏs ᴅᴇ sᴇsɪᴏɴ❌:', err);
await conn.reply(m.chat, `${msm} Ocurrió un fallo.`, m, rcanal);
}

}
handler.help = ['dsowner']
handler.tags = ['owner']
handler.command = ['delai', 'dsowner', 'clearallsession']
handler.rowner = true;

export default handler