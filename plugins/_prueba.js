let handler = async (m, { conn }) => {

const res = await fetch('https://files.catbox.moe/u5ohu2.png');
const thumb2 = Buffer.from(await res.arrayBuffer());

const fkontak = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        orderMessage: {
            itemCount: 1,
            status: 1,
            surface: 1,
            message: `${botname}`,
            orderTitle: "Mejor Bot",
            thumbnail: thumb2
        }
    }
}

    await conn.reply(m.chat, `Yo no juego con los códigos.`, fkontak);
};

handler.command = /^1$/i;
export default handler;