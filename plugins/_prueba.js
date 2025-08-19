const handler = async (m, { conn }) => {
    
    const rcanal = {
  contextInfo: {
    externalAdReply: {
      showAdAttribution: true, 
      title: botname,
      body: dev,
      mediaType: 2,         
      thumbnailUrl: global.icono,
      sourceUrl: redes
    }
  }
}

    await conn.reply(m.chat, "Prueba", m, rcanal);
};

handler.command = ['m'];

export default handler;