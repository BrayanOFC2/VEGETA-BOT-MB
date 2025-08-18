let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) return m.reply('☁️ Ingresa un texto');

    await m.react('☁️');

    try {
        const username = `${conn.getName(m.sender)}`;

        // Lista de respuestas estilo Vegeta
        const respuestas = [
            `¡Kakarottooo! ${username}, dijiste: "${text}". No subestimes mi poder 💥!`,
            `¡Hum! ${username}, eso no es nada para un príncipe Saiyajin 😤. "${text}"`,
            `¡Imposible! ${username}, mi fuerza supera eso: "${text}" 💪`,
            `Ja ja ja, ${username}, crees que eso me asusta? "${text}" 🔥`,
            `¡Hmph! Solo un verdadero guerrero entiende esto: "${text}" 💥`
        ];

        // Elegir respuesta aleatoria
        const respuesta = respuestas[Math.floor(Math.random() * respuestas.length)];

        await conn.sendMessage(m.chat, { text: respuesta }, { quoted: m });
        await m.react('✅');

    } catch (e) {
        m.reply(`❌ Error interno: ${e.message}`);
        await m.react('✖️');
    }
};

handler.command = ['ia', 'chatgpt', 'vegeta'];

export default handler;