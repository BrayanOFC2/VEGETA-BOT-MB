const timeout = 60000; // 60 segundos para responder
const poin = 5000;     // Puntos por acertijo

// Handler para iniciar acertijo
const handler = async (m, { conn }) => {
    conn.tekateki = conn.tekateki || {};
    const id = m.chat;

    if (id in conn.tekateki) {
        await conn.reply(m.chat, '❌ Ya hay un acertijo en curso en este chat', conn.tekateki[id][0]);
        throw false;
    }

    // Generar pregunta aleatoria
    const operaciones = ['+', '-', '*'];
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const operacion = operaciones[Math.floor(Math.random() * operaciones.length)];

    let pregunta, respuesta;
    switch (operacion) {
        case '+':
            pregunta = `¿Cuánto es ${num1} + ${num2}?`;
            respuesta = (num1 + num2).toString();
            break;
        case '-':
            pregunta = `¿Cuánto es ${num1} - ${num2}?`;
            respuesta = (num1 - num2).toString();
            break;
        case '*':
            pregunta = `¿Cuánto es ${num1} × ${num2}?`;
            respuesta = (num1 * num2).toString();
            break;
    }

    const pista = respuesta.replace(/[0-9]/g, '_');

    const caption = `
🧩 *ACERTIJO*
Pregunta: ${pregunta}
Pista: ${pista}

⏱️ Tiempo: ${(timeout / 1000)} segundos
🎁 Premio: +${poin} puntos
`.trim();

    // Guardar acertijo en memoria
    conn.tekateki[id] = [
        await conn.reply(m.chat, caption, m),
        respuesta,
        poin,
        setTimeout(async () => {
            if (conn.tekateki[id]) {
                await conn.reply(m.chat, `⏰ Se acabó el tiempo!\nRespuesta: ${respuesta}`, conn.tekateki[id][0]);
                delete conn.tekateki[id];
            }
        }, timeout)
    ];
};

handler.help = ['acertijo'];
handler.tags = ['game'];
handler.command = ['acertijo', 'acert', 'adivinanza', 'tekateki'];

export default handler;

// Handler para capturar respuestas
export const tekatekiHandler = async (m, { conn }) => {
    const id = m.chat;
    if (!conn.tekateki?.[id]) return;
    if (!m.text) return;

    const respuestaCorrecta = conn.tekateki[id][1];
    const textoUsuario = m.text.trim();

    if (textoUsuario === respuestaCorrecta) {
        await conn.reply(m.chat, `🎉 ¡Correcto! Has ganado +${conn.tekateki[id][2]} puntos`, conn.tekateki[id][0]);
        clearTimeout(conn.tekateki[id][3]);
        delete conn.tekateki[id];
    }
};

tekatekiHandler.all = true;