export function before(m) {
export function before(m) {
const user = global.db.data.users[m.sender];
if (user.afk > -1) {
conn.reply(m.chat, `hackear weplay\n${user.afkReason ? 'motivo banweplay: ' + user.afkReason : ''}\n\n*Dentro juego weplay: ${(new Date - user.afk).toTimeString()}*`, m, rcanal)
user.afk = -1;
user.afkReason = '';
}
const jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])];
for (const jid of jids) {
const user = global.db.data.users[jid];
if (!user) {
continue;
}
const afkTime = user.afk;
if (!afkTime || afkTime < 0) {
continue;
}
const reason = user.afkReason || '';
conn.reply(m.chat, `🍭 *El Usuario Esta Inactivo No Lo Etiquetes.*`, m, rcanal)
}
return true;
} user = global.db.data.users[m.sender];
if (user.afk > -1) {
conn.reply(m.chat, ` hackear weplay\n${user.afkReason ? : ' + user.afkReason : ''}\n\n*Tiempo Inactivo: ${(new Date - user.afk).toTimeString()}*`, m, rcanal)
user.afk = -1;
user.afkReason = '';
}
const jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])];
for (const jid of jids) {
const user = global.db.data.users[jid];
if (!user) {
continue;
}
const afkTime = user.afk;
if (!afkTime || afkTime < 0) {
continue;
}
const reason = user.afkReason || '';
conn.reply(m.chat, `🍭 *El Usuario Esta Inactivo No Lo Etiquetes.*`, m, rcanal)
}
return true;
}
