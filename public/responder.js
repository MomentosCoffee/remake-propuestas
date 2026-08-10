/* ===========================================================================
   REMAKE · Widget de respuesta reutilizable  (responder.js)
   ---------------------------------------------------------------------------
   Convierte cualquier botón en un mini-formulario confiable que envía la
   respuesta del cliente al equipo (→ /api/entrega → Make → 3 correos + registro).
   Reemplaza los mailto/wa.me poco confiables. Un solo archivo para todas las
   propuestas, briefs, scope y entregables.

   USO en cualquier página:
     1) <script src="/responder.js" defer></script>  (antes de </body>)
     2) En el botón: agrega  data-responder
        y (opcional)  data-cliente="Clínica AMI"  data-tipo="Propuesta"
                      data-titulo="¡Arranquemos!"  data-mensaje="Texto que va prellenado"
        Ej.:  <a href="#responder" data-responder data-cliente="AMI" data-tipo="Propuesta">Arrancar</a>

   Nada de dependencias. Estilos con prefijo .rmkr- (no chocan con la página).
   =========================================================================== */
(function () {
  if (window.__rmkResponder) return; window.__rmkResponder = true;

  var CSS = ''
    + '.rmkr-ov{position:fixed;inset:0;z-index:2147483000;display:none;align-items:center;justify-content:center;'
    + 'background:rgba(12,12,14,.55);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);padding:20px;'
    + 'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Inter,system-ui,sans-serif}'
    + '.rmkr-ov.on{display:flex}'
    + '.rmkr-card{background:#fff;color:#17171a;width:100%;max-width:440px;border-radius:18px;padding:26px 24px 22px;'
    + 'box-shadow:0 24px 70px rgba(0,0,0,.35);position:relative;animation:rmkr-in .28s cubic-bezier(.23,1,.32,1)}'
    + '@keyframes rmkr-in{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:none}}'
    + '.rmkr-x{position:absolute;top:12px;right:14px;border:0;background:transparent;font-size:22px;line-height:1;'
    + 'color:#9a9a9a;cursor:pointer;padding:4px}'
    + '.rmkr-x:hover{color:#333}'
    + '.rmkr-h{font-size:1.28rem;font-weight:700;letter-spacing:-.01em;margin:0 0 4px}'
    + '.rmkr-sub{font-size:.92rem;color:#66666c;margin:0 0 16px;line-height:1.4}'
    + '.rmkr-l{display:block;font-size:.8rem;font-weight:600;color:#3a3a40;margin:12px 0 5px}'
    + '.rmkr-card input,.rmkr-card textarea{width:100%;border:1px solid #dcdce0;border-radius:11px;padding:.7rem .85rem;'
    + 'font-family:inherit;font-size:1rem;color:#17171a;background:#fafafa;line-height:1.45;resize:vertical}'
    + '.rmkr-card input:focus,.rmkr-card textarea:focus{outline:none;border-color:#F64A00;background:#fff}'
    + '.rmkr-card textarea::placeholder,.rmkr-card input::placeholder{color:#a6a6ac}'
    + '.rmkr-send{margin-top:16px;width:100%;background:#F64A00;color:#fff;border:0;border-radius:99px;padding:.85rem 1.2rem;'
    + 'font-family:inherit;font-weight:700;font-size:1rem;cursor:pointer;transition:transform .15s,opacity .15s}'
    + '.rmkr-send:hover{transform:translateY(-2px)}'
    + '.rmkr-send:disabled{opacity:.6;cursor:default;transform:none}'
    + '.rmkr-msg{font-size:.9rem;margin-top:10px;min-height:1.1em}'
    + '.rmkr-msg.err{color:#c0392b}'
    + '.rmkr-alt{font-size:.82rem;color:#88888e;margin-top:12px;text-align:center}'
    + '.rmkr-alt a{color:#F64A00;text-decoration:none}'
    + '.rmkr-ok{text-align:center;padding:8px 0 4px}'
    + '.rmkr-ok svg{margin-bottom:8px}'
    + '.rmkr-ok h3{font-size:1.3rem;margin:0 0 6px}'
    + '.rmkr-ok p{color:#66666c;font-size:.95rem;margin:0;line-height:1.45}';

  function el(html) { var d = document.createElement('div'); d.innerHTML = html; return d.firstElementChild; }

  var style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);

  var ov = el('<div class="rmkr-ov" role="dialog" aria-modal="true"><div class="rmkr-card">'
    + '<button class="rmkr-x" aria-label="Cerrar">&times;</button>'
    + '<div class="rmkr-body"></div>'
    + '</div></div>');
  document.body.appendChild(ov);
  var body = ov.querySelector('.rmkr-body');
  var card = ov.querySelector('.rmkr-card');

  function close() { ov.classList.remove('on'); }
  ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
  ov.querySelector('.rmkr-x').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  function open(cfg) {
    var titulo = cfg.titulo || 'Responder a REMAKE';
    var sub = cfg.sub || 'Cuéntanos y lo recibimos al instante. Te respondemos muy pronto.';
    body.innerHTML = ''
      + '<h2 class="rmkr-h">' + esc(titulo) + '</h2>'
      + '<p class="rmkr-sub">' + esc(sub) + '</p>'
      + '<form class="rmkr-form">'
      + '<label class="rmkr-l" for="rmkr-nom">¿Con quién hablamos?</label>'
      + '<input id="rmkr-nom" type="text" placeholder="Tu nombre" autocomplete="name">'
      + '<label class="rmkr-l" for="rmkr-com">Tu mensaje</label>'
      + '<textarea id="rmkr-com" rows="4" placeholder="Escríbenos con confianza…"></textarea>'
      + '<button type="submit" class="rmkr-send">Enviar</button>'
      + '<div class="rmkr-msg" role="status" aria-live="polite"></div>'
      + '</form>';
    var com = body.querySelector('#rmkr-com');
    if (cfg.mensaje) com.value = cfg.mensaje;
    ov.classList.add('on');
    setTimeout(function () { (body.querySelector('#rmkr-nom')).focus(); }, 60);

    body.querySelector('.rmkr-form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var btn = body.querySelector('.rmkr-send'), msg = body.querySelector('.rmkr-msg');
      var nombre = (body.querySelector('#rmkr-nom').value || '').trim();
      var comentarios = (com.value || '').trim();
      if (!comentarios) { msg.className = 'rmkr-msg err'; msg.textContent = 'Escríbenos un mensaje, por favor.'; return; }
      btn.disabled = true; var old = btn.textContent; btn.textContent = 'Enviando…'; msg.className = 'rmkr-msg'; msg.textContent = '';
      fetch('/api/entrega', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente: cfg.cliente || 'Cliente', tipo: cfg.tipo || 'Respuesta', nombre: nombre, comentarios: comentarios })
      })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) {
        if (x.ok && x.d && x.d.ok) {
          body.innerHTML = '<div class="rmkr-ok">'
            + '<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#1f9d6a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" stroke="#c9efdd"></circle><path d="M8 12.5l2.5 2.5L16 9"></path></svg>'
            + '<h3>¡Recibido!' + (nombre ? (' Gracias, ' + esc(nombre.split(' ')[0]) + '.') : ' Gracias.') + '</h3>'
            + '<p>Ya nos llegó tu mensaje. Te escribimos muy pronto.</p></div>';
          setTimeout(close, 3200);
        } else { throw new Error('fail'); }
      })
      .catch(function () {
        btn.disabled = false; btn.textContent = old;
        msg.className = 'rmkr-msg err';
        msg.innerHTML = 'No se pudo enviar. Intenta de nuevo o escríbenos a <a href="mailto:mateo.corredor@helloremake.com">mateo.corredor@helloremake.com</a>.';
      });
    });
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function wire() {
    var nodes = document.querySelectorAll('[data-responder]');
    for (var i = 0; i < nodes.length; i++) {
      (function (n) {
        if (n.__rmkr) return; n.__rmkr = true;
        n.addEventListener('click', function (e) {
          e.preventDefault();
          open({
            cliente: n.getAttribute('data-cliente') || 'Cliente',
            tipo: n.getAttribute('data-tipo') || 'Respuesta',
            titulo: n.getAttribute('data-titulo') || '',
            sub: n.getAttribute('data-sub') || '',
            mensaje: n.getAttribute('data-mensaje') || ''
          });
        });
      })(nodes[i]);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();
  window.rmkResponderOpen = open; // por si se quiere abrir desde código
})();
