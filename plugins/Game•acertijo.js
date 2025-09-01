const timeout = 60000; // 60 segundos
const poin = 5000;     // Puntos por acertijo

// Guardar acertijos activos por chat
const acertijosActivos = {};

// Handler para iniciar acertijo
const handler = async (m, { conn }) => {
    const id = m.chat;

    if (acertijosActivos[id]) {
        await conn.reply(m.chat, '❌ Ya hay un acertijo en curso en este chat');
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

    // Guardar acertijo activo con timer
    const timer = setTimeout(async () => {
        if (acertijosActivos[id]) {
            await conn.reply(m.chat, `⏰ Se acabó el tiempo!\nRespuesta: ${respuesta}`);
            delete acertijosActivos[id];
        }
    }, timeout);

    acertijosActivos[id] = { respuesta, poin, timer };

    await conn.reply(m.chat, caption, m);
};

handler.help = ['acertijo'];
handler.tags = ['game'];
handler.command = ['acertijo', 'acert', 'adivinanza'];

export default handler;

// Handler global para capturar respuestas
export const responderAcertijo = async (m, { conn }) => {
    const id = m.chat;
    if (!acertijosActivos[id]) return;
    if (!m.text) return;

    const textoUsuario = m.text.trim().toLowerCase();
    let { respuesta, poin, timer } = acertijosActivos[id];

    // Normalizar respuesta para ignorar acentos
    const respuestaNormalizada = respuesta.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const usuarioNormalizado = textoUsuario.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (usuarioNormalizado === respuestaNormalizada) {
        clearTimeout(timer);
        await conn.reply(m.chat, `🎉 ¡Correcto! Has ganado +${poin} puntos`);
        delete acertijosActivos[id];
    }
};

responderAcertijo.all = true;