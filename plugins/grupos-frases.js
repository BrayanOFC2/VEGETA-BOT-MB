let handler = async (msg, sock) => {
    // Frases de Vegeta
    const frasesVegeta = [
        "¡Kakarottooo!",
        "¡Soy el príncipe de todos los Saiyajin!",
        "¡No me subestimes!",
        "¡Final Flash!",
        "¡Galick Gun!",
        "¡Maldito Kakarotto!",
        "¡Prepárate para ser derrotado!",
        "¡No necesito ayuda de nadie!",
        "¡Mi orgullo Saiyajin es invencible!",
        "¡Te aplastaré sin piedad!"
    ];

    // Elegir una frase aleatoria
    const frase = frasesVegeta[Math.floor(Math.random() * frasesVegeta.length)];

    // Obtener chat ID
    const chatId = msg.key.remoteJid;

    // Enviar frase
    await sock.sendMessage(chatId, { text: frase });
};

// Handler
handler.help = ['juegos'];
handler.tags = ['grupo'];
handler.command = ['prueba'];

module.exports = handler;