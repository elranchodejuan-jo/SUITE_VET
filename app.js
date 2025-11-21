/* =========================================================
   CATTLE · app.js (HTML + JSON + JS chiquito)
   ========================================================= */
console.clear();
console.log("✅ app.js cargado");

/* Helpers */
const norm = x => (x ?? "").toString().trim();
const fold = x => norm(x).normalize("NFD").replace(/\p{Diacritic}/gu,"").replace(/\s+/g," ").toLowerCase();

/* Canonizadores */
function canonSistema(s){
  const t = fold(s);
  if (t.startsWith("digestivo")) return "Digestivo";
  if (t.startsWith("respiratorio/cardiaco")) return "Respiratorio/Cardíaco";
  if (t.startsWith("cardiaco/circulatorio")) return "Cardíaco/Circulatorio";
  if (t.startsWith("nervioso/neuroendocrino")) return "Nervioso/Neuroendocrino";
  if (t === "renal") return "Renal";
  if (t.startsWith("renal/metabolico")) return "Renal/Metabólico";
  if (t.startsWith("reproductivo")) return "Reproductivo";
  if (t.startsWith("endocrino/metabolico")) return "Endocrino/Metabólico";
  if (t.startsWith("inmunologico")) return "Inmunológico";
  if (t.startsWith("oseo/piel")) return "Óseo/Piel";
  return s || "";
}
function grupoClave(gRaw=""){
  let g = fold((gRaw||"").split("–")[0]);
  if (g.includes("cardiolog")) g = "cardio";
  else if (g.includes("a.i.n.e") || g==="aine" || g.includes("aines")) g = "aine";
  else if (g.includes("neurolog")) g = "neuro";
  else if (g.includes("anestes")) g = "anestesico";
  else if (g.includes("antimicrob")) g = "antimicrobiano";
  else if (g.includes("antiparasit")) g = "antiparasitario";
  else if (g.includes("gastric")) g = "gastrico";
  else if (g.includes("hormon")) g = "hormona";
  else g = "otros";
  return g;
}

/* Estado */
let HORMONAS=[], FARMACOS=[], datosCargados=false;

/* Carga JSON (misma carpeta del sitio) */
async function cargarDatos(){
  if (datosCargados) return;
  try{
    const [hRes, fRes] = await Promise.all([
      fetch("./data/hormonas.json"),
      fetch("./data/farmacos.json")
    ]);
    if(!hRes.ok) throw new Error("No se encontró data/hormonas.json");
    if(!fRes.ok) throw new Error("No se encontró data/farmacos.json");

    const [hRaw, fRaw] = await Promise.all([hRes.json(), fRes.json()]);

    HORMONAS = (Array.isArray(hRaw)?hRaw:[])
      .filter(h => !("grupo" in h || "grupoClave" in h || "nombreComercial" in h))
      .map(h => ({
        ...h,
        sistema: canonSistema(h.sistema),
        especies: Array.isArray(h.especies) ? h.especies.map(e=>fold(e)) : ["multiespecie"]
      }));

    FARMACOS = (Array.isArray(fRaw)?fRaw:[]).map(f => ({
      ...f,
      grupoClave: f.grupoClave ?? grupoClave(f.grupo || ""),
      especies: Array.isArray(f.especies) ? f.especies.map(e=>fold(e)) : []
    }));

    datosCargados = true;
    poblarSelectFarmacos();
  }catch(err){
    console.error("❌ Error cargando JSON:", err);
    alert("No se pudieron cargar los datos (JSON). Revisa la consola y que /data exista.");
  }
}

/* DOM refs */
const filtroSistema = document.getElementById("filtro-sistema");
const filtroEspecie = document.getElementById("filtro-especie");
const buscador      = document.getElementById("buscador");

const filtroGrupoFarmaco   = document.getElementById("filtro-grupo-farmaco");
const filtroEspecieFarmaco = document.getElementById("filtro-especie-farmaco");
const buscadorFarmaco      = document.getElementById("buscador-farmaco");

const contHormonas = document.getElementById("contenedor-hormonas");
const contFarmacos = document.getElementById("contenedor-farmacos");

const filtrosHormonasSec = document.getElementById("filtros-hormonas");
const filtrosFarmacosSec = document.getElementById("filtros-farmacos");

const btnMenu  = document.getElementById("btn-menu");
const sideMenu = document.getElementById("side-menu");

const homeGrid = document.getElementById("home-grid");

const calcPanel      = document.getElementById("calc-farmaco");
const selFarmacoCalc = document.getElementById("calc-farmaco-select");
const selEspecieCalc = document.getElementById("calc-especie");
const selViaCalc     = document.getElementById("calc-via");
const inputPesoCalc  = document.getElementById("calc-peso");
const btnCalcular    = document.getElementById("btn-calcular");
const resultadoCalc  = document.getElementById("calc-resultado");

const show = el => el && el.classList.remove("oculto");
const hide = el => el && el.classList.add("oculto");

/* Navegación */
async function cambiarModulo(mod){
  if(mod==="home"){
    show(homeGrid);
    hide(filtrosHormonasSec); hide(contHormonas);
    hide(filtrosFarmacosSec); hide(contFarmacos); hide(calcPanel);
    return;
  }
  hide(homeGrid);
  await cargarDatos(); // ← carga JSON la primera vez

  if(mod==="hormonas"){
    show(filtrosHormonasSec); show(contHormonas);
    hide(filtrosFarmacosSec); hide(contFarmacos); hide(calcPanel);
    renderHormonas(HORMONAS, true);
  }else if(mod==="farmacos"){
    hide(filtrosHormonasSec); hide(contHormonas);
    show(filtrosFarmacosSec); show(contFarmacos); show(calcPanel);
    renderFarmacos(FARMACOS);
  }
}

/* Home cards */
document.querySelectorAll(".glass-card").forEach(card=>{
  const mod = card.dataset.mod;
  if(!mod) return;
  card.addEventListener("click", () => cambiarModulo(mod));
  card.addEventListener("keydown",(e)=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); card.click(); }});
});

/* Hormonas */
function renderHormonas(lista,filtrosAplicados){
  contHormonas.innerHTML="";
  if(!filtrosAplicados){
    contHormonas.innerHTML=`<p class="mensaje-inicial" style="color:#a8b3cf">Usa los filtros o busca para ver hormonas.</p>`;
    return;
  }
  if(!lista.length){ contHormonas.innerHTML=`<p>No se encontraron hormonas.</p>`; return; }
  lista.forEach(h=>{
    const card=document.createElement("article");
    card.className="tarjeta-hormona";
    card.innerHTML=`
      <h2>${h.nombre}</h2>
      <div class="sigla">Sigla: <strong>${h.sigla||"-"}</strong></div>
      <span class="badge-sistema">${h.sistema||"-"}</span>
      <p><strong>Origen:</strong><br>${(h.origen||"").replace(/\\n/g,"<br>")}</p>
      <p><strong>Función principal:</strong> ${h.funcion||"—"}</p>
      <p><strong>Patología (↓/↑):</strong><br>${(h.patologia||"").replace(/\\n/g,"<br>")}</p>
      <p><strong>Funciones secundarias:</strong> ${h.secundarias||"—"}</p>
      <p><strong>Variaciones por especie:</strong> ${h.variaciones||"—"}</p>
      <p><strong>Afecciones farmacológicas:</strong> ${h.farmaco||"—"}</p>`;
    contHormonas.appendChild(card);
  });
}
function aplicarFiltrosHormonas(){
  const sistemaSel = canonSistema(filtroSistema.value);
  const especieSel = fold(filtroEspecie.value);
  const texto      = fold(buscador.value||"");

  const filtrosAplicados = sistemaSel!=="todos" || especieSel!=="todas" || texto!=="";

  const filtradas = HORMONAS.filter(h=>{
    const okS = (sistemaSel==="todos") || (canonSistema(h.sistema)===sistemaSel);
    const okE = (especieSel==="todas") || (h.especies||[]).includes(especieSel);
    const okT = !texto || [h.nombre,h.sigla,h.sistema,h.funcion,h.patologia,h.variaciones,h.farmaco,h.origen]
      .filter(Boolean).some(v=>fold(v).includes(texto));
    return okS && okE && okT;
  });
  renderHormonas(filtradas,filtrosAplicados);
}
filtroSistema.addEventListener("change",aplicarFiltrosHormonas);
filtroEspecie.addEventListener("change",aplicarFiltrosHormonas);
buscador.addEventListener("input",aplicarFiltrosHormonas);

/* Fármacos */
const coloresFarmacos={antimicrobiano:"#4cc9f0",antiparasitario:"#80ed99",aine:"#f4a261",anestesico:"#9d4edd",
  hormona:"#ffb703",cardio:"#ef476f",neuro:"#6d597a",gastrico:"#219ebc",otros:"#adb5bd"};

function renderFarmacos(lista=[]){
  const base = lista.length?lista:FARMACOS;
  contFarmacos.innerHTML="";
  if(!base.length){ contFarmacos.innerHTML=`<p>No se encontraron fármacos.</p>`; return; }
  base.forEach(f=>{
    const index = FARMACOS.indexOf(f);
    const card=document.createElement("article");
    card.className="card card-farmaco"; card.dataset.index=index;

    const color = coloresFarmacos[f.grupoClave] || "#888";
    const vias  = Array.isArray(f.vias) ? f.vias.join(", ") : (f.via || "—");
    const especies = Array.isArray(f.especies) && f.especies.length
      ? f.especies.map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(", ")
      : "—";

    card.innerHTML=`
      <h3>${f.nombre}</h3>
      <p class="farmaco-comercial"><span>Nombre comercial:</span> ${f.nombreComercial||"—"}</p>
      <div class="chip-farmaco" style="background:${color}">${f.grupo || "—"}</div>
      <p><strong>Vías:</strong> ${vias}</p>
      <p><strong>Especies:</strong> ${especies}</p>
      <p><strong>Indicaciones:</strong> ${f.indicaciones||"—"}</p>
      <p><strong>Contraindicaciones:</strong> ${f.contraindicaciones||"—"}</p>
      <p><strong>Dosis general:</strong> ${f.dosis||"—"}</p>
      <p><strong>Período de retiro:</strong> ${f.retiro||"—"}</p>
      <p><strong>Notas:</strong> ${f.notas||"—"}</p>
      <div class="card-acciones"><button class="btn-primario btn-desde-card">Usar en calculadora</button></div>`;
    contFarmacos.appendChild(card);
  });
}
function aplicarFiltrosFarmacos(){
  const grupoSel   = fold(filtroGrupoFarmaco.value);
  const especieSel = fold(filtroEspecieFarmaco.value);
  const texto      = fold(buscadorFarmaco.value||"");

  const filtradas = FARMACOS.filter(f=>{
    const okG = (grupoSel==="todos") || (fold(f.grupoClave)===grupoSel);
    const okE = (especieSel==="todas") || (f.especies||[]).includes(especieSel);
    const okT = !texto || [f.nombre,f.nombreComercial,f.grupo,f.indicaciones,f.contraindicaciones,f.notas]
      .filter(Boolean).some(v=>fold(v).includes(texto));
    return okG && okE && okT;
  });
  renderFarmacos(filtradas);
}
filtroGrupoFarmaco.addEventListener("change",aplicarFiltrosFarmacos);
filtroEspecieFarmaco.addEventListener("change",aplicarFiltrosFarmacos);
buscadorFarmaco.addEventListener("input",aplicarFiltrosFarmacos);

/* Card → calculadora */
contFarmacos.addEventListener("click",(ev)=>{
  const btn = ev.target.closest(".btn-desde-card"); if(!btn) return;
  const card = btn.closest(".card-farmaco"); if(!card) return;
  const idx = card.dataset.index;
  const f = FARMACOS[parseInt(idx,10)]; if(!f) return;

  selFarmacoCalc.value = String(idx);
  selFarmacoCalc.dispatchEvent(new Event("change"));
  if (f.dosisEspecies){
    const especiesCalc = Object.keys(f.dosisEspecies);
    if(especiesCalc.length===1){
      selEspecieCalc.value = especiesCalc[0];
      selEspecieCalc.dispatchEvent(new Event("change"));
    }
  }
  cambiarModulo("farmacos");
  calcPanel.scrollIntoView({behavior:"smooth"});
});

/* Calculadora */
function poblarSelectFarmacos(){
  selFarmacoCalc.innerHTML='<option value="">Selecciona un fármaco…</option>';
  FARMACOS.forEach((f,idx)=>{
    const opt=document.createElement("option"); opt.value=String(idx); opt.textContent=f.nombre;
    selFarmacoCalc.appendChild(opt);
  });
}
selFarmacoCalc.addEventListener("change",()=>{
  selEspecieCalc.innerHTML='<option value="">Elige especie…</option>';
  selViaCalc.innerHTML    ='<option value="">Primero especie…</option>';
  resultadoCalc.innerHTML ='<p>Selecciona especie, vía y peso para calcular.</p>';
  const idx=selFarmacoCalc.value; if(!idx) return;
  const f=FARMACOS[parseInt(idx,10)]; if(!f?.dosisEspecies) return;
  Object.keys(f.dosisEspecies).forEach(esp=>{
    const opt=document.createElement("option");
    opt.value=esp; opt.textContent=esp.charAt(0).toUpperCase()+esp.slice(1);
    selEspecieCalc.appendChild(opt);
  });
});
selEspecieCalc.addEventListener("change",()=>{
  selViaCalc.innerHTML='<option value="">Elige vía…</option>';
  resultadoCalc.innerHTML='<p>Selecciona vía y peso para calcular.</p>';
  const idx=selFarmacoCalc.value; const especie=selEspecieCalc.value; if(!idx||!especie) return;
  const info=FARMACOS[parseInt(idx,10)]?.dosisEspecies?.[especie]; if(!info) return;
  (info.vias||[]).forEach(v=>{ const opt=document.createElement("option"); opt.value=v; opt.textContent=v; selViaCalc.appendChild(opt); });
});
btnCalcular.addEventListener("click",()=>{
  const idx=selFarmacoCalc.value, especie=selEspecieCalc.value, via=selViaCalc.value;
  const peso=parseFloat(inputPesoCalc.value);
  if(!idx||!especie||!via||isNaN(peso)||peso<=0){ resultadoCalc.innerHTML='<p>Completa todo y usa un peso válido.</p>'; return; }
  const f=FARMACOS[parseInt(idx,10)]; const info=f?.dosisEspecies?.[especie];
  if(!info){ resultadoCalc.innerHTML='<p>No hay datos de dosis para esa especie.</p>'; return; }
  const mgKg=info.mgKg, conc=info.concMgMl??null, dosis=peso*mgKg, vol=conc?(dosis/conc):null;
  let html=`
    <p><strong>Fármaco:</strong> ${f.nombre}</p>
    <p><strong>Especie:</strong> ${especie}</p>
    <p><strong>Vía:</strong> ${via}</p>
    <p><strong>Dosis:</strong> ${mgKg} mg/kg</p>
    <p><strong>Peso:</strong> ${peso.toFixed(2)} kg</p>
    <p><strong>Total:</strong> ${dosis.toFixed(2)} mg</p>`;
  if(vol!==null) html+=`<p><strong>Concentración:</strong> ${conc} mg/ml → <strong>Volumen:</strong> ${vol.toFixed(2)} ml</p>`;
  html+=`<p><strong>Frecuencia (estudio):</strong> ${info.frecuencia||"—"}</p>
         <p><strong>Días (estudio):</strong> ${info.dias||"—"}</p>
         <p style="margin-top:.4rem;font-size:.78rem;color:#f97316;">⚠ Herramienta de estudio: valida siempre con vademécum y norma local.</p>`;
  resultadoCalc.innerHTML=html;
});

/* Estado inicial */
cambiarModulo("home");
