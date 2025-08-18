let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) return m.reply('☁️ Ingresa un texto');

    await m.react('☁️');

    try {
        const username = `${conn.getName(m.sender)}`;

        const respuesta = `¡Kakarottooo! Soy VEGETA-BOT, príncipe de todos los Saiyajin. 😤\n${username}, escuché lo que dijiste: "${text}". Prepárate, porque mi poder está aumentando y las explosiones están por llegar 💥💪!`;

        await conn.sendMessage(m.chat, { text: respuesta }, { quoted: m });
        await m.react('✅');

    } catch (e) {
        m.reply(`❌ Error interno: ${e.message}`);
        await m.react('✖️');
    }
};

handler.command = ['ia', 'chatgpt', 'vegeta'];

export default handler;