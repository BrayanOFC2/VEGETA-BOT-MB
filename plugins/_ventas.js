import fetch from 'node-fetch'

let suscripciones = global.suscripciones || (global.suscripciones = {})

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0] || !args[1]) {
    return m.reply(`✘ Uso incorrecto.\n\n📌 Ejemplo: *${usedPrefix + command} https://chat.whatsapp.com/ABCDEFGHIJK 3*`)
  }

  let enlace = args[0].trim()
  let dias = parseInt(args[1])

  if (!enlace.startsWith('https://chat.whatsapp.com/')) {
    return m.reply('✘ Enlace no válido.')
  }

  if (isNaN(dias) || dias < 1 || dias > 30) {
    return m.reply('✘ Ingresa un número de días entre 1 y 30.')
  }

  let codigoGrupo = enlace.split('https://chat.whatsapp.com/')[1]?.trim()
  if (!codigoGrupo) {
    return m.reply('✘ Código de grupo no válido.')
  }

  try {
    let groupId = await conn.groupAcceptInvite(codigoGrupo)
    let groupMetadata = await conn.groupMetadata(groupId)
    let groupName = groupMetadata.subject

    m.reply(`✅ Unido al grupo *${groupName}*\n📆 Saldrá en *${dias}* ${dias === 1 ? 'día' : 'días'}.*`)

    if (suscripciones[groupId]) clearTimeout(suscripciones[groupId])
    suscripciones[groupId] = setTimeout(async () => {
      try {
        await conn.sendMessage(groupId, { text: '⏳ Tiempo terminado. El bot saldrá del grupo.' })
        await conn.groupLeave(groupId)
        delete suscripciones[groupId]
      } catch (err) {
        console.log(`Error al salir del grupo: ${err.message}`)
      }
    }, dias * 86400000)

  } catch (e) {
    console.error(e)
    m.reply(`✘ Error al unirse al grupo:\n${e?.message || 'No se pudo unir. Verifica el enlace.'}`)
  }
}

handler.help = ['suscripción <enlace> <días>']
handler.tags = ['bot']
handler.command = ['comprado', 'joinfor']

export default handler