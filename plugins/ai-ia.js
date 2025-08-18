import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) return m.reply('☁️ Ingresa un texto');

    await m.react('☁️');

    try {
        const username = `${conn.getName(m.sender)}`;

        // Llamada a la API de Pinterest
        const res = await axios.get(`https://anime-xi-wheat.vercel.app/api/pinterest?q=${encodeURIComponent(text)}`);
        const results = res.data.result;

        if (!results || results.length === 0) {
            return m.reply(`⚠️ ${username}, no encontré nada relacionado con "${text}"`);
        }

        // Elegir una imagen aleatoria
        const imageUrl = results[Math.floor(Math.random() * results.length)];

        const caption = `¡Kakarottooo! ${username}, encontré esto relacionado con tu búsqueda: "${text}" 💥`;

        await conn.sendMessage(m.chat, { image: { url: imageUrl }, caption }, { quoted: m });
        await m.react('✅');

    } catch (e) {
        m.reply(`❌ Error interno: ${e.message}`);
        await m.react('✖️');
    }
};

handler.command = ['ia', 'chatgpt', 'vegeta', 'pinterest'];

export default handler;