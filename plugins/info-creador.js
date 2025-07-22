import PhoneNumber from 'awesome-phonenumber';

async function handler(m, { conn }) {
  m.react('👑');

  const numCreador = '5216641784469';
  const name = 'BʀᴀʏᴀɴOFC👻';
  const about = 'estoy disponible para responder a tus preguntas';
  const empresa = 'BrayanOFC - Servicios Tecnológicos';
  const link = 'https://wa.me/' + numCreador;

  await conn.sendMessage(m.chat, {
    image: { url: 'https://qu.ax/gSWtg.jpg' },
    caption: `👑 *${name}*\n👻 - CEO & Fundador de *${empresa}*\n\n📲 ${link}`,
  }, { quoted: m });

  const vcard = `
BEGIN:VCARD
VERSION:3.0
N:;BrayanOFC;;;
FN:BrayanOFC
ORG:${empresa};
TITLE:CEO & Fundador
TEL;waid=${numCreador}:${new PhoneNumber('+' + numCreador).getNumber('international')}
EMAIL:correo@empresa.com
URL:https://www.tuempresa.com
NOTE:${about}
ADR:;;Dirección de tu empresa;;;;
X-ABADR:ES
X-WA-BIZ-NAME:BrayanOFC
X-WA-BIZ-DESCRIPTION:${about}
END:VCARD
`.trim();

  await conn.sendMessage(
    m.chat,
    {
      contacts: {
        displayName: 'BrayanOFC',
        contacts: [{ vcard }]
      }
    },
    { quoted: m }
  );
}

handler.help = ['owner'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;