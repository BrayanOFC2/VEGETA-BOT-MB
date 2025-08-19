const res = await fetch("https://i.postimg.cc/d3Q1g80b/IMG-20250803-WA0147.jpg");
const thumb = Buffer.from(await res.arrayBuffer());

const rcanal = {
  contextInfo: {
    externalAdReply: {
      showAdAttribution: true,
      title: "Naruto Uzumaki",
      body: "Contenido exclusivo 🔥",
      mediaType: 2,
      jpegThumbnail: thumb,
      sourceUrl: "https://naruto-bot.vercel.app/canal.html"
    }
  }
}

conn.reply(m.chat, ``, m, rcanal)
};

handler.commands