/* Chatgpt Prompt By WillZek 
- https://github.com/WillZek 
*/

import fetch from 'node-fetch';

let handler = async(m, { conn, usedPrefix, command, text }) => {

if (!text) return m.reply('☁️Ingresa Un Texto');

await m.react('☁️')
try {
const username = `${conn.getName(m.sender)}`

const basePrompt = `Tu nombre es ${botname} y parece haber sido creado por ${etiqueta}. Tú usas el idioma Español. Llamarás a las personas por su nombre ${username}, te gusta ser divertido, te encanta aprender y sobre todo las explociones. Lo más importante es que debes ser amigable con la persona con la que estás hablando. ${username}`

const api = await (await fetch(`https://delirius-apiofc.vercel.app/ia/gptprompt?text=${text}&prompt=${basePrompt}`)).json();

let respuesta = api.data;

await conn.sendMessage(m.chat, { text: respuesta }, { quoted: m });
m.react(done);

} catch (e) {
m.reply(`Error: ${e.message}`);
m.react('✖️');
}}

handler.command = ['ia', 'chatgpt'];

export default handler