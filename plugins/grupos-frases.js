const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const P = require('pino');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const { version } = await fetchLatestBaileysVersion();
    
    const sock = makeWASocket({
        version,
        logger: P({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state
    });

    sock.ev.on('creds.update', saveCreds);

    // Frases de Vegeta
    const vegetaFrases = [
        "¡Kakarottooo!",
        "¡Soy el príncipe de todos los Saiyajin!",
        "¡No me subestimes!",
        "¡Final Flash!",
        "¡Galick Gun!"
    ];

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        const msg = messages[0];
        if (!msg.message || !msg.key.fromMe) { 
            const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
            if (text && text.toLowerCase() === 'vegeta') {
                const frase = vegetaFrases[Math.floor(Math.random() * vegetaFrases.length)];
                await sock.sendMessage(msg.key.remoteJid, { text: frase });
            }
        }
    });
}

startBot();