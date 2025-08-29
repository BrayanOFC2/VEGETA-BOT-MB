const fs = require('fs');
const path = require('path');

// Ruta del archivo de usuarios
const usuariosPath = path.join(__dirname, '../src/database/usuarios.json');

// Cargar usuarios
let usuarios = {};
if (fs.existsSync(usuariosPath)) {
    usuarios = JSON.parse(fs.readFileSync(usuariosPath));
}

// Función para guardar usuarios
function guardarUsuarios() {
    fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
}

module.exports = {
    name: 'Vegeta',
    alias: [],
    desc: 'Mini-RPG de Dragon Ball',
    tags: ['juegos'],         // Tag del comando
    command: ['vegeta','prueba'],      // Comando principal

    async run({ msg, sock, args }) {

        const userId = msg.key.participant || msg.key.remoteJid;

        // Inicializar usuario si no existe
        if (!usuarios[userId]) {
            usuarios[userId] = { power: Math.floor(Math.random() * 1000 + 500) };
        }

        const vegetaFrases = [
            "¡Kakarottooo!",
            "¡Soy el príncipe de todos los Saiyajin!",
            "¡No me subestimes!",
            "¡Final Flash!",
            "¡Galick Gun!"
        ];

        const subcomando = args[0] ? args[0].toLowerCase() : null;

        switch(subcomando) {

            case '!powerlevel':
                await sock.sendMessage(msg.key.remoteJid, { text: `💪 Tu nivel de poder es: ${usuarios[userId].power}` });
                break;

            case '!attack':
                const ataques = [
                    "Kamehameha 🌊",
                    "Final Flash ⚡",
                    "Big Bang Attack 💥",
                    "Masenko 🔥",
                    "Special Beam Cannon 💫"
                ];
                const ataque = ataques[Math.floor(Math.random() * ataques.length)];
                const daño = Math.floor(Math.random() * 500 + 100);
                usuarios[userId].power -= daño;
                if (usuarios[userId].power < 0) usuarios[userId].power = 0;
                const fraseVegeta = vegetaFrases[Math.floor(Math.random() * vegetaFrases.length)];

                await sock.sendMessage(msg.key.remoteJid, { 
                    text: `¡Has usado ${ataque}!\nVegeta contraataca y te quita ${daño} de poder 😤\n${fraseVegeta}\n💪 Tu poder actual: ${usuarios[userId].power}` 
                });
                break;

            case '!train':
                const ganancia = Math.floor(Math.random() * 300 + 100);
                usuarios[userId].power += ganancia;
                await sock.sendMessage(msg.key.remoteJid, { 
                    text: `🏋️‍♂️ Has entrenado y ganado ${ganancia} de poder\n💪 Tu poder actual: ${usuarios[userId].power}` 
                });
                break;

            default:
                await sock.sendMessage(msg.key.remoteJid, { 
                    text: `❌ Comando desconocido dentro del tag juegos.\nUsa:\nVegeta !powerlevel\nVegeta !attack\nVegeta !train` 
                });
        }

        // Guardar cambios
        guardarUsuarios();
    }
}