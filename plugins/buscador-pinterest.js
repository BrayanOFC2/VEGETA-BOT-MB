async function sendAlbumMessage(jid, medias, options = {}) {
  if (typeof jid !== "string") throw new TypeError(`jid must be string, received: ${jid}`);

  for (const media of medias) {
    if (!media.type || (media.type !== "image" && media.type !== "video")) 
      throw new TypeError(`media.type must be "image" or "video", received: ${media.type}`);
    if (!media.data || (!media.data.url && !Buffer.isBuffer(media.data))) 
      throw new TypeError(`media.data must be object with url or buffer, received: ${media.data}`);
  }
  if (medias.length < 2) throw new RangeError("Minimum 2 media");

  const caption = options.text || options.caption || "";
  const delay = !isNaN(options.delay) ? options.delay : 500;
  delete options.text;
  delete options.caption;
  delete options.delay;

  // Crear el álbum base
  const album = baileys.generateWAMessageFromContent(
    jid,
    {
      messageContextInfo: {},
      albumMessage: {
        expectedImageCount: medias.filter(m => m.type === "image").length,
        expectedVideoCount: medias.filter(m => m.type === "video").length,
        ...(options.quoted ? { contextInfo: options.quoted } : {})
      }
    },
    {}
  );

  await conn.relayMessage(album.key.remoteJid, album.message, { 
    messageId: album.key.id,
    forwardedNewsletterMessageInfo: options.forwardedNewsletterMessageInfo || undefined
  });

  for (let i = 0; i < medias.length; i++) {
    const { type, data } = medias[i];
    const img = await baileys.generateWAMessage(
      album.key.remoteJid,
      { [type]: data, ...(i === 0 ? { caption } : {}) },
      { upload: conn.waUploadToServer }
    );

    img.message.messageContextInfo = {
      messageAssociation: { associationType: 1, parentMessageKey: album.key },
      ...(options.quoted || {}),
    };

    await conn.relayMessage(img.key.remoteJid, img.message, { 
      messageId: img.key.id,
      forwardedNewsletterMessageInfo: options.forwardedNewsletterMessageInfo || undefined
    });

    await baileys.delay(delay);
  }

  return album;
}