// Backend de la ENTREGA de AMI (y reutilizable para otras entregas).
// El cliente responde desde la presentación (elige estilo + comentarios) y esto avisa al equipo por correo.
// Reusa el webhook de Make que YA manda correos (mismo patrón que api/lead.js y api/pqrs.js de remake-web) —
// infra de producción probada, no un servicio nuevo. Un solo lugar para cambiarlo: ENTREGA_HOOK.
// Si mañana se quiere un canal dedicado (Make propio) para las entregas, solo se cambia esta constante.
const ENTREGA_HOOK = 'https://hook.us2.make.com/wh919mb2fqvrhkdk95h1oxan9u8rdax5';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });

  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch { b = {}; } }
  b = b || {};

  // Saneo + topes defensivos (evita payloads abusivos).
  const cliente   = String(b.cliente   || 'Cliente').slice(0, 80);
  const tipo      = String(b.tipo      || 'Respuesta').trim().slice(0, 40); // Propuesta · Brief · Scope · Entrega · Respuesta…
  const nombre    = String(b.nombre    || '').trim().slice(0, 100);
  const estilo    = String(b.estilo    || '').trim().slice(0, 60);
  const comentarios = String(b.comentarios || '').trim().slice(0, 4000);

  // Debe traer al menos algo útil.
  if (!estilo && !comentarios) {
    return res.status(400).json({ error: 'Cuéntennos algo (su elección o un comentario), por favor.' });
  }

  const fecha = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota', hour12: false });
  const mensaje = [
    nombre ? ('Responde: ' + nombre) : '',
    estilo ? ('Elección: ' + estilo) : '',
    comentarios ? ('Comentarios:\n' + comentarios) : ''
  ].filter(Boolean).join('\n\n');

  // Mismo shape que consume el escenario de Make (fecha, canal, asistente, mensaje, respuesta, tema, contacto).
  // 🔴 'asistente' DEBE contener "REMAKE" para caer en la ruta correcta del escenario de Make (la que va a los 3 correos).
  const payload = JSON.stringify({
    fecha,
    canal: tipo + ' · ' + cliente,
    asistente: 'REMAKE · ' + tipo,
    mensaje,
    respuesta: '',
    tema: '📋 ' + tipo + ' — ' + cliente,
    contacto: nombre || cliente
  });

  const ctrl = new AbortController();
  const t = setTimeout(function () { ctrl.abort(); }, 8000);
  try {
    const r = await fetch(ENTREGA_HOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      signal: ctrl.signal
    });
    if (!r.ok) throw new Error('hook ' + r.status);
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: 'No se pudo enviar en este momento.' });
  } finally {
    clearTimeout(t);
  }
}
