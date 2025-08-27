import fetch from 'node-fetch';

const obtenerInfoVideo = async (url) => {
  const response = await fetch(`https://youtube-download-api.matheusishiyama.repl.co/info/?url=${url}`);
  return await response.json();
};

const descargarAudio = async (url) => {
  const response = await fetch(`https://youtube-download-api.matheusishiyama.repl.co/mp3/?url=${url}`);
  return await response.buffer();
};

const descargarVideo = async (url) => {
  const response = await fetch(`https://youtube-download-api.matheusishiyama.repl.co/mp4/?url=${url}`);
  return await response.buffer();
};

// Ejemplo de uso
const urlVideo = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

obtenerInfoVideo(urlVideo).then(info => {
  console.log('Título:', info.title);
  console.log('Miniatura:', info.thumbnail);
});

descargarAudio(urlVideo).then(audio => {
  // Guardar el archivo de audio
});

descargarVideo(urlVideo).then(video => {
  // Guardar el archivo de video
});