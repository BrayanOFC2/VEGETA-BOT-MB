let handler = async (m, { conn, usedPrefix }) => {
    return conn.reply(m.chat, '?', m);
};

handler.command = ['1'];

export default handler;