import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) return m.reply('☁️ Ingresa un texto');

    await m.react('☁️');

    try {
        const username = `${conn.getName(m.sender)}`;

        // Genera respuesta de Luminai
        const response = await axios.post('https://Luminai.my.id', {
            prompt: `Eres VEGETA-BOT, un asistente que responde cualquier tipo de pregunta de manera explicativa, divertida y directa al estilo Vegeta de Dragon Ball Z. Llama a la persona por su nombre: ${username}.  
            Explica detalladamente y, si es posible, da ejemplos, pasos o analogías relacionadas con: "${text}"`,
            temperature: 0.9,
            max_tokens: 600
        });

        let replyText = response.data?.response || '⚠️ No pude generar una respuesta esta vez.';

        // Formateo dramático al estilo Vegeta
        replyText = `😤 ¡Kakarottooo! ${username}, presta atención:\n${replyText} 💥`;

        await conn.sendMessage(m.chat, { text: replyText }, { quoted: m });
        await m.react('✅');

    } catch (e) {
        m.reply(`❌ Error interno: ${e.message}`);
        await m.react('✖️');
    }
};

handler.command = ['ia', 'chatgpt', 'vegeta', 'ask'];

export default handler;