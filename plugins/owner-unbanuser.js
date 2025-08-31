const handler = async (m, { conn }) => {
    let user;
    const db = global.db.data.users;

    // Obtener JID del usuario a desbanear
    if (m.quoted) {
        user = m.quoted.sender;
    } else if (m.mentionedJid && m.mentionedJid.length) {
        user = m.mentionedJid[0];
    } else {
        await conn.reply(m.chat, `*${emojis} Etiqueta o responde al usuario que deseas desbanear.*`, m, rcanal);
        return;
    }

    if (db[user]) {
        db[user].banned = false;
        db[user].banReason = '';
        db[user].bannedBy = null;

        const nametag = await conn.getName(user);
        await conn.reply(m.chat, `*${done} El usuario* *${nametag}* *ha sido desbaneado.*`, m, {
            mentions: [user]
        });

    } else {
        await conn.reply(m.chat, `*⚠️ El usuario no está registrado.*`, m);
    }
};

handler.help = ['unbanuser'];
handler.command = ['unbanuser'];
handler.tags = ['owner'];
handler.rowner = true;

export default handler;