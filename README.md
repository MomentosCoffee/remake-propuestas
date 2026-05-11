# REMAKE — Propuestas Personalizadas

Sistema simple para alojar propuestas HTML personalizadas por cliente y compartirlas con un link unico.

## Estructura

```
remake-propuestas/
├── README.md                    Este archivo
├── CLAUDE_CODE_PROMPT.md        Prompt para pasarle a Claude Code
├── package.json                 Config minima
├── vercel.json                  Config de deploy
├── templates/
│   └── master.html              Plantilla maestra (Dave v2 — fuente de verdad)
└── public/
    ├── index.html               Landing privada (sin info)
    ├── dave/index.html          Propuesta para Dave Calderon
    ├── manuel/index.html        Propuesta para Dr. Manuel
    └── yelitza/index.html       Propuesta para Yelitza
```

Cada cliente recibe un link tipo:
- `propuestas-remake.vercel.app/dave`
- `propuestas-remake.vercel.app/manuel`
- `propuestas-remake.vercel.app/yelitza`

## Como agregar un nuevo cliente (proceso de 10 minutos)

1. **Crear carpeta** dentro de `public/`:
   ```
   public/nombre-cliente/
   ```

2. **Copiar master.html**:
   ```bash
   cp templates/master.html public/nombre-cliente/index.html
   ```

3. **Personalizar** estos campos en el HTML (busca y reemplaza):
   - `Dave Calderon` → nombre del nuevo cliente
   - `dave-calderon.vercel.app` → URL de su pagina
   - Industria (legal → odontologia / estetica / etc)
   - Montos especificos (USD vs COP)
   - Imagenes (URLs de Unsplash o subir propias)
   - Mensajes en slide 1, 3, 9, 10 (personalizacion narrativa)

4. **Probar localmente**:
   ```bash
   npm run dev
   ```
   Abrir `http://localhost:3000/nombre-cliente`

5. **Deploy** (automatico al hacer push si esta conectado a GitHub, o `vercel --prod`).

## Que es la plantilla maestra

`templates/master.html` es la version Dave v2 que ya tiene:

- 10 slides editorial estilo Nikolas Type + Victor Furuya
- Tipografia Instrument Serif + sans grotesque
- Paleta cream + naranja acento
- Cursor custom (desktop)
- Animaciones mask-reveal + fade
- Mobile responsive
- Etiquetas "Sistema IA de REMAKE"
- Cronograma de precios con mes 1-2 / 3-4 / 5+
- Comparacion con agencias del mercado
- Slide de respaldo con marca REMAKE formal
- CTA con email mateo.corredor@helloremake.com

**NUNCA editar `templates/master.html` directamente** salvo para cambios estructurales que apliquen a TODOS los clientes futuros. Para cada cliente, clonar y modificar en `public/{cliente}/`.

## Deploy en Vercel (primera vez)

### Opcion A — Drag & Drop (mas rapido, 2 minutos)

1. Ir a [vercel.com/new](https://vercel.com/new)
2. Arrastrar la carpeta `remake-propuestas` completa
3. Vercel detecta que es estatico y publica
4. Te da una URL tipo `remake-propuestas-mateo.vercel.app`

### Opcion B — Con GitHub (recomendado para iterar)

1. Crear repo en GitHub: `remake-propuestas`
2. Push de esta carpeta
3. Conectar repo a Vercel
4. Cada push hace deploy automatico

### Configurar dominio bonito (opcional)

Si quieres `propuestas.helloremake.com`:
1. Vercel → Settings → Domains
2. Agregar `propuestas.helloremake.com`
3. Apuntar el DNS desde tu proveedor de dominio

## Preview local

```bash
npm run dev
```

Abre `http://localhost:3000`. Cada cliente esta en su subpath.

## Reglas importantes

1. **Cero info sensible en el landing** (`public/index.html`). Es publico — solo dice "REMAKE" sin listar clientes.
2. **Cada propuesta es un link directo** que solo conoce el cliente al que se lo mandas.
3. **No indexar en Google** — todos los HTML llevan `<meta name="robots" content="noindex, nofollow">`.
4. **El email del CTA siempre** es `mateo.corredor@helloremake.com` con asunto pre-llenado por cliente.

## Personalizacion por cliente — Checklist

Cuando clones master.html para un cliente nuevo, revisa que personalizaste:

- [ ] `<title>` con su nombre
- [ ] Slide 1: nombre, industria, frase emocional de apertura
- [ ] Slide 2: cuatro pasos adaptados a su negocio (no siempre legal/USA)
- [ ] Slide 3: contexto del "ejemplo de pagina" que vio
- [ ] Slide 4: division de trabajo adaptada (que cierra el cliente final?)
- [ ] Slide 5: numeros de leads esperados para su industria
- [ ] Slide 6: dos opciones de precio (USD para USA, COP para Colombia)
- [ ] Slide 7: cronograma de precios con su moneda
- [ ] Slide 8: regalo comparado con agencias en su pais
- [ ] Slide 9: respaldo con marca REMAKE (mantener igual)
- [ ] Slide 10: link a SU pagina + email con asunto especifico

## Notas

- Las imagenes vienen de Unsplash con URLs publicas — funcionan siempre
- Si una imagen falla, hay fallback al gradiente calido
- Los links externos abren en pestana nueva (`target="_blank"`)
- El email es `mailto:` con subject pre-llenado por cliente
