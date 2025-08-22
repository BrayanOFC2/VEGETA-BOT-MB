let handler = async (m, { conn, usedPrefix }) => {
    return conn.reply(m.chat, 'Soy la funcion "globa.fake" y sigo viva rcanal murió.', m, fake);
};

handler.command = ['1'];

export default handler;