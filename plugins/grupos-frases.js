const fs = require('fs');
const path = require('path');

const usuariosPath = path.join(__dirname, '../database/usuarios.json');
let usuarios = {};
if (fs.existsSync(usuariosPath)) usuarios = JSON.parse(fs.readFileSync(usuariosPath));

function guardarUsuarios() {
    fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
}

module.exports = {
    name: 'Vegeta',
    tags: ['juegos'],
    command: ['prueba'],

    async run({ msg, sock }) {
        const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || '').toLowerCase();

        if (!text.startsWith('prueba')) return;

        const subcomando = text.slice(7).trim();
        const userId = msg.key.participant || msg.key.remoteJid;

        if (!usuarios[userId]) usuarios[userId] = { power: Math.floor(Math.random() * 1000 + 500) };

        const vegetaFrases = ["¡Kakarottooo!","¡Soy el príncipe de todos los Saiyajin!","¡No me subestimes!","¡Final Flash!","¡Galick Gun!"];

        switch(subcomando) {
            case '!powerlevel':
                await sock.sendMessage(msg.key.remoteJid, { text: `💪 Tu nivel de poder es: ${usuarios[userId].power}` });
                break;
            case '!attack':
                const ataques = ["Kamehameha 🌊","Final Flash ⚡","Big Bang Attack 💥","Masenko 🔥","Special Beam Cannon 💫"];
                const ataque = ataques[Math.floor(Math.random() * ataques.length)];
                const daño = Math.floor(Math.random() * 500 + 100);
                usuarios[userId].power -= daño;
                if (usuarios[userId].power < 0) usuarios[userId].power = 0;
                const fraseVegeta = vegetaFrases[Math.floor(Math.random() * vegetaFrases.length)];
                await sock.sendMessage(msg.key.remoteJid, { text: `¡Has usado ${ataque}!\nVegeta contraataca y te quita ${daño} de poder 😤\n${fraseVegeta}\n💪 Tu poder actual: ${usuarios[userId].power}` });
                break;
            case '!train':
                const ganancia = Math.floor(Math.random() * 300 + 100);
                usuarios[userId].power += ganancia;
                await sock.sendMessage(msg.key.remoteJid, { text: `🏋️‍♂️ Has entrenado y ganado ${ganancia} de poder\n💪 Tu poder actual: ${usuarios[userId].power}` });
                break;
            default:
                await sock.sendMessage(msg.key.remoteJid, { text: `❌ Comando desconocido.\nUsa:\nVegeta !powerlevel\nVegeta !attack\nVegeta !train` });
        }

        guardarUsuarios();
    }
}