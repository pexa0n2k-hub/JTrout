(()=> {
const $=id=>document.getElementById(id);
const KEY='jtroute_pwa_v02';
let mode='inicio', imageFile=null, previewUrl=null;
let data={postals:['56617','56618','56619','56613','56615'],history:[],profile:''};
try{data={...data,...JSON.parse(localStorage.getItem(KEY)||'{}')};}catch(e){}
function persist(){localStorage.setItem(KEY,JSON.stringify(data));}
function dateText(){return new Intl.DateTimeFormat('es-MX',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}).format(new Date());}
function msg(){
 const total=Number($('packages').value)||0,done=Number($('delivered')?.value)||0;
 return ['📦 J&T EXPRESS','━━━━━━━━━━━━━━',mode==='inicio'?'🚚 INICIO DE RUTA':'🏁 FIN DE RUTA','📅 Fecha: '+dateText(),'👤 Repartidor: '+($('name').value.trim()||'Sin especificar'),'📍 Zona: VALLE DE CHALCO','📮 C.P.: '+($('postal').value||'Sin especificar'),'📦 Servicio: '+$('service').value,'📋 Paquetes asignados: '+total,...(mode==='fin'?['✅ Entregados: '+done,'📦 Pendientes: '+Math.max(0,total-done)]:[]),'━━━━━━━━━━━━━━'].join('\\n');
}
function update(){ $('today').textContent=dateText();$('message').textContent=msg(); }
function renderPostals(){
 $('postal').innerHTML=data.postals.map(p=>'<option value="'+p+'">'+p+'</option>').join('');
 $('postalList').innerHTML=data.postals.map(p=>'<div class="postal-row"><span>CP '+p+'</span><button type="button" data-remove="'+p+'">Eliminar</button></div>').join('')||'<p class="muted">No hay códigos guardados.</p>';
}
function renderHistory(){
 const list=$('historyList');list.innerHTML='';
 if(!data.history.length){list.className='muted';list.textContent='Sin reportes todavía.';return;}
 list.className='';
 data.history.slice().reverse().forEach(item=>{const el=document.createElement('div');el.className='history-item';const b=document.createElement('strong');b.textContent=item.type+' · '+item.date;const s=document.createElement('span');s.textContent=item.name+' · '+item.service+' · CP '+item.cp+' · '+item.packages+' paquetes';el.append(b,s);list.append(el);});
}
function setMode(next){mode=next;document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));$('deliveredWrap').hidden=mode!=='fin';update();}
function save(){data.profile=$('name').value.trim();data.history.push({type:mode==='inicio'?'INICIO DE RUTA':'FIN DE RUTA',date:dateText(),name:data.profile||'Sin nombre',service:$('service').value,cp:$('postal').value,packages:Number($('packages').value)||0});persist();renderHistory();$('status').textContent='Reporte guardado en el historial.';}
document.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
['name','service','packages','postal','delivered'].forEach(id=>$(id)?.addEventListener('input',update));
if(data.profile)$('name').value=data.profile;
$('screenshot').addEventListener('change',e=>{
 imageFile=e.target.files[0]||null;
 $('uploadLabel').textContent=imageFile?imageFile.name:'Seleccionar captura';
 if(previewUrl)URL.revokeObjectURL(previewUrl);
 if(imageFile){previewUrl=URL.createObjectURL(imageFile);$('preview').src=previewUrl;$('preview').hidden=false;}else $('preview').hidden=true;
});
$('settingsBtn').addEventListener('click',()=>$('settings').showModal());
$('managePostal').addEventListener('click',()=>$('settings').showModal());
$('addPostal').addEventListener('click',()=>{
 const cp=$('newPostal').value.trim();
 if(!/^\\d{5}$/.test(cp)){alert('Ingresa un código postal de 5 dígitos.');return;}
 if(!data.postals.includes(cp))data.postals.push(cp);
 $('newPostal').value='';persist();renderPostals();update();
});
$('postalList').addEventListener('click',e=>{const cp=e.target.dataset.remove;if(cp){data.postals=data.postals.filter(x=>x!==cp);persist();renderPostals();update();}});
$('copyBtn').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(msg());$('status').textContent='Texto copiado.';}catch(e){$('status').textContent='No se pudo copiar automáticamente.';}});
$('saveBtn').addEventListener('click',save);
$('clearHistory').addEventListener('click',()=>{if(confirm('¿Vaciar todo el historial?')){data.history=[];persist();renderHistory();}});
$('reportForm').addEventListener('submit',async e=>{
 e.preventDefault();const text=msg();
 try{
  if(imageFile&&navigator.canShare&&navigator.canShare({files:[imageFile]})){await navigator.share({files:[imageFile],text,title:'J&T Route'});$('status').textContent='Menú para compartir abierto.';}
  else if(imageFile){await navigator.clipboard.writeText(text);$('status').textContent='Texto copiado. Adjunta la captura manualmente en WhatsApp.';}
  else{await navigator.clipboard.writeText(text);$('status').textContent='Texto copiado. Selecciona una captura para compartir imagen + texto.';}
 }catch(err){if(err.name!=='AbortError')$('status').textContent='No se pudo compartir. Puedes copiar el texto.';}
});
renderPostals();renderHistory();setMode('inicio');
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
})();