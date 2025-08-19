let handler = async (m, { conn }) => {

const res = await fetch('https://files.catbox.moe/u5ohu2.png'); 
const thumb3 = Buffer.from(await res.arrayBuffer());

let userJid = m.sender; 

let fkontak = {
    key: {
        fromMe: false,
        remoteJid: m.chat,
        id: "Fake",
        participant: userJid 
    },
    message: {
        imageMessage: {
            mimetype: 'image/jpeg',
            caption: botname ,
            jpegThumbnail: thumb3
        }
    }
};

    await conn.reply(m.chat, `Yo no juego con los códigos.`, fkontak);
};

handler.command = /^1$/i;
export default handler;