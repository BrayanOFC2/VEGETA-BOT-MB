const handler = async (m, { conn }) => {
    
    const rcanal = {
        contextInfo: {
            externalAdReply: {
                title: botname,
                body: dev,
                thumbnailUrl: icono
            }
        }
    };

    await conn.reply(m.chat, "Prueba", m, rcanal);
};

handler.command = ['1'];

export default handler;