# Prompt para Claude Code — Setup y deploy de Propuestas REMAKE

Copia y pega TODO esto como primer mensaje a Claude Code despues de abrir la carpeta `remake-propuestas/`:

---

Hola Claude Code. Necesito tu ayuda para montar y desplegar este proyecto. Es un sitio estatico simple que aloja propuestas HTML personalizadas para clientes de mi agencia REMAKE.

## Contexto del proyecto

- Soy Mateo, dueno de REMAKE (agencia de marketing digital, 12 anos, Colombia + Canada).
- Este sitio alojara una propuesta HTML por cliente, cada una en su propio subpath.
- Cliente actual con propuesta lista: **Dave Calderon** (`public/dave/index.html`).
- Clientes pendientes: **Manuel** y **Yelitza** (placeholders ya creados, hay que personalizar despues).
- La plantilla maestra esta en `templates/master.html` — es la fuente de verdad.

## Lo que necesito que hagas AHORA, en este orden

### 1. Verificar que el sitio funcione local

- Instala `serve` o usa `npx serve public -p 3000` para previsualizar
- Abre `http://localhost:3000` en una pestana
- Verifica que carguen:
  - `http://localhost:3000/` — landing privada (debe verse limpia)
  - `http://localhost:3000/dave` — propuesta completa para Dave
  - `http://localhost:3000/manuel` — placeholder
  - `http://localhost:3000/yelitza` — placeholder
- Confirma que las imagenes de Unsplash carguen en la propuesta de Dave

### 2. Desplegar en Vercel

- Revisa si tengo Vercel CLI instalado: `vercel --version`
- Si no, instalalo: `npm i -g vercel`
- Desde la raiz del proyecto, ejecuta `vercel --prod` (o `vercel` para preview primero)
- Cuando pregunte:
  - Set up and deploy? → **Yes**
  - Which scope? → mi cuenta personal
  - Link to existing project? → **No** (primera vez)
  - Project name? → **remake-propuestas**
  - In which directory is your code located? → **./** (raiz)
  - Want to modify settings? → **No**
- Anota el URL que te de Vercel (algo tipo `remake-propuestas-mateo.vercel.app`)

### 3. Validar que el deploy funcione

- Abre `https://[url-de-vercel]/dave` en un navegador de incognito
- Verifica que la propuesta cargue completa con imagenes y animaciones
- Manda el URL final por mensaje aqui para confirmar

### 4. Documentar el proceso

- Crea un archivo `DEPLOY_NOTES.md` con:
  - URL final del deploy
  - Como hacer nuevo deploy en el futuro (1 linea: `vercel --prod`)
  - Como agregar un cliente nuevo (resumen del README en 5 pasos)

## Reglas importantes

- **NO modifiques** `templates/master.html` — esa es la plantilla maestra
- **NO modifiques** `public/dave/index.html` — ya esta personalizada, no la toques
- Si las imagenes de Unsplash dan problema en preview, NO las cambies — funcionan en navegadores reales
- El nombre del proyecto en Vercel debe ser `remake-propuestas` (sin acentos)
- Si Vercel pregunta por un build command o output directory, usa: build vacio, output = `public`

## Cuando termines

Dime:
1. El URL publico del deploy
2. Si las 3 propuestas (dave, manuel, yelitza) cargan bien
3. Cualquier error o ajuste que hayas tenido que hacer

A partir de ahi, vamos a iterar: cuando quiera mandar una propuesta nueva, te paso la info del cliente y clonamos master.html → personalizamos → redeploy.

---

Listo. Ejecuta los 4 pasos arriba en orden y reporta cuando termines.
