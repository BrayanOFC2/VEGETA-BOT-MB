/*import axios from 'axios';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { tmpdir } from 'os';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchSticker = async (text, attempt = 1) => {
    try {
        const response = await axios.get(`https://kepolu-brat.hf.space/brat`, {
            params: { q: text },
            responseType: 'arraybuffer',
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 429 && attempt <= 3) {
            const retryAfter = error.response.headers['retry-after'] || 5;
            await delay(retryAfter * 1000);
            return fetchSticker(text, attempt + 1);
        }
        throw error;
    }
};

const handler = async (m, { text, conn }) => {
    if (!text) {
        return conn.sendMessage(m.chat, {
            text: '✍️ Escribe un texto para crear tu sticker animado. Ejemplo:\n*.brat Hola mundo*',
        }, { quoted: m });
    }

    try {
        const buffer = await fetchSticker(text);
        const outputFilePath = path.join(tmpdir(), `sticker-${Date.now()}.webp`);
        
        try {
            await sharp(buffer)
                .resize(512, 512, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 0 }
                })
                .webp({ quality: 80 })
                .toFile(outputFilePath);
        } catch (sharpError) {
            return conn.sendMessage(m.chat, {
                text: '⚙️ Ocurrió un error al procesar la imagen con *sharp*. Verifica que esté instalado correctamente.',
            }, { quoted: m });
        }

        await conn.sendMessage(m.chat, {
            sticker: { url: outputFilePath },
        }, { quoted: m });

        fs.unlinkSync(outputFilePath);

    } catch (error) {
        console.error('Error en /brat:', error);
        return conn.sendMessage(m.chat, {
            text: `❌ No se pudo generar el sticker. Intenta nuevamente en unos segundos.`,
        }, { quoted: m });
    }
};

handler.command = ['brat'];
handler.tags = ['sticker'];
handler.help = ['brat *<texto>*'];

export default handler;*/