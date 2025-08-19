import fetch from "node-fetch";

const handler = async (m, { conn }) => {
  
  const res = await fetch('https://files.catbox.moe/u5ohu2.png');
  const img = Buffer.from(await res.arrayBuffer());

  
  const fkontak = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
      productMessage: {
        product: {
          productImage: { jpegThumbnail: img },
          title: botname,
          description: "Venta Bot",
          currencyCode: "USD",
          priceAmount1000: 5000, 
          retailerId: "BOT"
        },
        businessOwnerJid: "0@s.whatsapp.net"
      }
    }
  };

  
  await conn.sendMessage(m.chat, "Hola", { quoted: fkontak });
};

handler.command = ['1'];

export default handler;