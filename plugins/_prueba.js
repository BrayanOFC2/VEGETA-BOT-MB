const handler = async (m, { conn }) => {
const rcanal = {
  contextInfo: {
    externalAdReply: {
      title: botname,
      body: dev,
      thumbnailUrl: icono
    }
  }
}

conn.reply(m.chat, `prueba`, m, rcanal)
};

handler.command = ['1']

export default handler