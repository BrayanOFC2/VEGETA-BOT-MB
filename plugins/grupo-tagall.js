 const { proto } = require('@adiwajshing/baileys');

// ... (tu código existente de Baileys) ...

async function mentionAll(groupId) {
  // ... (función mentionAll como en el ejemplo anterior) ...
}

async function handleCommand(message, command) {
  const { from, type, body } = message;  // Assuming your message object has these properties

  if (type === 'chat' || type === 'group') { // Only handle commands from chats or groups.
    if (command === 'tag') {
      if (type === 'group') {
        await mentionAll(from);
      } else { //Si se usa en un chat privado.
        await this.sendMessage(from, { text: 'Este comando solo funciona en grupos.' });
      }
    }
    // ... (Otras funciones para manejar otros comandos) ...
  }
}

// ... (resto de tu código de Baileys, incluyendo la parte donde recibes y procesas los mensajes) ...

// Ejemplo de cómo usar handleCommand (adaptar a tu implementación):

this.ev.on('messages.upsert', async m => {
    try {
        const message = m.messages[0];
        const command = message.body.toLowerCase().split(' ')[0].substring(1); // Ejemplo: !tag

        if (message.body.startsWith('!') ) {
            await handleCommand(message, command);
        }
    } catch (error) {
        console.error("Error handling message:", error);
    }
});

handler.help = ['todos *<mensaje opcional>*'];
handler.tags = ['group'];
handler.command = ['todos', 'invocar', 'tagall']
handler.admin = true;
handler.group = true;

export default handler;