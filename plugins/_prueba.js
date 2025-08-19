const handler = async (m, { conn }) => {
const res = await fetch("https://i.postimg.cc/d3Q1g80b/IMG-20250803-WA0147.jpg");
const thumb = Buffer.from(await res.arrayBuffer());

const rcanal = {
  contextInfo: {
    externalAdReply: {
      title: botname,
      body: dev,
      mediaType: 2,
      jpegThumbnail: thumb
    }
  }
}

conn.reply(m.chat, `prueba`, m, rcanal)
};

handler.command = ['1']

export default handler