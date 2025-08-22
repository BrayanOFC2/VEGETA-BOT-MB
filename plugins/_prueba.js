let handler = async (m, { conn, usedPrefix }) => {
    return conn.reply(m.chat, 'Soy la funcion "globa.rcanal" y sigo viva fake murió.', m, rcanal);
};

handler.command = ['1'];

export default handler;