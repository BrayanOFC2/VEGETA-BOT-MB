let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('☁️ Ingresa un texto');
    await m.react('☁️');

    const username = conn.getName(m.sender);

    // Palabras clave simples y plantillas de respuesta
    const keywords = {
        "explosión": [
            `💥 ${username}, las explosiones son poderosas, ¡como mi Final Flash! Siempre analiza la energía antes de usarla.`,
            `😤 Atención ${username}, si hablas de explosiones, recuerda que la fuerza depende del control del ki.`
        ],
        "entrenamiento": [
            `💪 ${username}, el entrenamiento es clave para volverte más fuerte. Nunca te rindas, incluso si fallas.`,
            `¡Kakarottooo! ${username}, entrenar duro es lo único que separa a un guerrero de un principiante.`
        ],
        "planeta": [
            `🌍 ${username}, los planetas pueden ser destruidos con suficiente poder, pero hay que ser cuidadoso.`,
            `Hmph! ${username}, sobre planetas: cada uno tiene su propia gravedad y resistencia. Considera eso al pelear.`
        ],
        "teoría": [
            `📚 ${username}, las teorías siempre necesitan evidencia. Analiza cada detalle antes de aceptarla.`,
            `😤 ${username}, una teoría sin práctica es inútil. ¡Actúa y observa los resultados!`
        ]
    };

    // Buscar palabras clave en el texto
    let found = [];
    for (let key in keywords) {
        if (text.toLowerCase().includes(key)) found.push(key);
    }

    let replyText;

    if (found.length > 0) {
        // Elegir una palabra clave aleatoria encontrada
        const key = found[Math.floor(Math.random() * found.length)];
        const options = keywords[key];
        replyText = options[Math.floor(Math.random() * options.length)];
    } else {
        // Respuesta genérica si no se encuentra palabra clave
        const genericas = [
            `😤 ¡Kakarottooo! ${username}, escuché tu pregunta: "${text}". Analiza bien y nunca subestimes tu poder 💥.`,
            `Hmph! ${username}, sobre "${text}", necesitas paciencia y determinación para entenderlo.`,
            `💥 ${username}, eso es complicado, pero con enfoque y entrenamiento lograrás comprenderlo.`,
            `Ja ja ja, ${username}, dices: "${text}", pero solo un verdadero guerrero puede entenderlo completamente.`
        ];
        replyText = genericas[Math.floor(Math.random() * genericas.length)];
    }

    await conn.sendMessage(m.chat, { text: replyText }, { quoted: m });
    await m.react('✅');
};

handler.command = ['ia', 'chatgpt', 'vegeta', 'ask'];

export default handler;