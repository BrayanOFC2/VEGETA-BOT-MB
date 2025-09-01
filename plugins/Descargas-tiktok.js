import axios from 'axios';

let handler = async (m, { conn, command }) => {
    try {
        if (command !== 'descargas') return;
        let tag = 'descargas';
        let url = `https://www.tiktok.com/tag/${tag}`;
        let response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
            }
        });
        let html = response.data;
        let regex = /<script id="SIGI_STATE" type="application\/json">(.+?)<\/script>/;
        let jsonMatch = html.match(regex);
        if (!jsonMatch) return m.reply('No se pudieron obtener los videos.');
        let data = JSON.parse(jsonMatch[1]);
        let items = Object.values(data.ItemModule).slice(0, 5);
        let message = '🎬 Videos recientes de TikTok con el tag #descargas:\n\n';
        items.forEach((video, i) => {
            message += `${i + 1}. ${video.desc}\n👉 https://www.tiktok.com/@${video.author}/video/${video.id}\n\n`;
        });
        await conn.sendMessage(m.chat, { text: message }, { quoted: m });
    } catch (e) {
        console.log(e);
        m.reply('Ocurrió un error al buscar los videos.');
    }
};

handler.command = 'descargas';
export default handler;