/* Chatgpt Prompt By WillZek 
- https://github.com/WillZek 
*/

import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) return m.reply('☁️ Ingresa un texto');

    await m.react('☁️');

    try {
        const username = `${conn.getName(m.sender)}`;

        const basePrompt = `Tu nombre es VEGETA-BOT parece haber sido creado por BrayanOFC. Tú usas el idioma Español. Llamarás a las personas por su nombre ${username}, te gusta ser divertido, te encanta aprender y sobre todo las explosiones. Lo más importante es que debes ser amigable con la persona con la que estás hablando. ${username}`;

        const res = await fetch(`https://delirius-apiofc.vercel.app/ia/gptprompt?text=${encodeURIComponent(text)}&prompt=${encodeURIComponent(basePrompt)}`);
        const textRes = await res.text();

        let api;
        try {
            api = JSON.parse(textRes);
        } catch {
            return m.reply(`⚠️ Error: la API no devolvió JSON válido.\n\nRespuesta recibida:\n${textRes}`);
        }

        const respuesta = api.data || '⚠️ La API no devolvió una respuesta válida.';
        await conn.sendMessage(m.chat, { text: respuesta }, { quoted: m });
        await m.react('✅');

    } catch (e) {
        m.reply(`❌ Error interno: ${e.message}`);
        await m.react('✖️');
    }
};

handler.command = ['ia', 'chatgpt'];

export default handler;