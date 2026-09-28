/* Joue le TÉLÉPHONE contre le relais du Salon, pour tester l'écran sans
   téléphone (spec partage-telecommande § 6).
   Usage : node outils/telephone-simule.mjs <salle> [commande…]
     commandes : un chapitre (demos), situation:former, inconnu:<id>,
                 attendre:<ms>, silence (arrête BONJOUR), fin
   Exemple : node outils/telephone-simule.mjs ab12cd34 demos situation:former inconnu:logiciel attendre:2000 fin */
const RELAIS = process.env.RELAIS || 'wss://stand-demonstrateur.osc-fr1.scalingo.io/ws-remote';
const [salle, ...commandes] = process.argv.slice(2);
if (!/^[a-z0-9]{8}$/.test(salle || '')) { console.error('salle invalide : 8 caractères [a-z0-9]'); process.exit(1); }
const t0 = Date.now();
const log = (...a) => console.log(((Date.now() - t0) / 1000).toFixed(2) + ' s', ...a);
const ws = new WebSocket(RELAIS);
let bonjour = 0;
const envoyer = (m) => { ws.send(JSON.stringify(m)); log('›', JSON.stringify(m)); };
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
async function jouer() {
  for (const c of commandes) {
    if (c === 'fin') { clearInterval(bonjour); ws.close(); return; }
    if (c === 'silence') { clearInterval(bonjour); log('silence : plus de BONJOUR'); continue; }
    if (c.startsWith('attendre:')) { await pause(Number(c.slice(9))); continue; }
    const navItemId = c.startsWith('inconnu:') ? c.slice(8) : c;
    envoyer({ type: 'REMOTE_CMD', cmd: { type: 'OPEN_MODAL', navItemId } });
    await pause(800);
  }
}
ws.onopen = () => envoyer({ type: 'REGISTER', role: 'remote', salle });
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  log('‹', JSON.stringify(m));
  if (m.type === 'REGISTER_OK') envoyer({ type: 'AUTH', pin: '123456' });
  if (m.type === 'AUTH_OK') {
    envoyer({ type: 'REMOTE_CMD', cmd: { type: 'BONJOUR' } });
    bonjour = setInterval(() => envoyer({ type: 'REMOTE_CMD', cmd: { type: 'BONJOUR' } }), 20000);
    jouer();
  }
};
ws.onclose = () => { log('fermé'); process.exit(0); };
