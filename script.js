const $=(s,root=document)=>root.querySelector(s);const $$=(s,root=document)=>[...root.querySelectorAll(s)];

/* ===== FIX GLOBAL: avatar real para preview da loja ===== */
window.__dlinkyGetBestAvatar = window.__dlinkyGetBestAvatar || function(){
  try{
    const read=(k)=>{try{return JSON.parse(localStorage.getItem(k)||'{}')}catch(e){return {}}};
    const u=read('dlinkyUser');
    let v = u.avatar || u.photoURL || u.foto || u.icon || '';
    if(!v && typeof user==='object' && user) v = user.avatar || user.photoURL || user.foto || user.icon || '';
    if(!v){
      const keys=[
        'dlinky_avatar_clean_'+(u.email||u.slug||'local'),
        'dlinkyAvatarPreserve_'+(u.email||u.slug||'local')
      ];
      for(const k of keys){ const x=localStorage.getItem(k); if(x){v=x;break;} }
    }
    if(!v){
      const els=['#dashAvatar','#sideAvatar','#profileAvatar','#frameBuyAvatar','#adjustAvatar'];
      for(const s of els){
        const el=document.querySelector(s); if(!el) continue;
        if(el.tagName==='IMG' && el.src){v=el.src;break;}
        const bg=(el.style&&el.style.backgroundImage)||getComputedStyle(el).backgroundImage||'';
        const m=bg.match(/url\(["']?(.*?)["']?\)/); if(m&&m[1]&&m[1]!=='none'){v=m[1];break;}
      }
    }
    return String(v||'').trim();
  }catch(e){return ''}
};

/* ===== FIX LINK DIRETO: /slug abre perfil sem piscar página inicial ===== */
(function(){
  try{
    const path=(location.pathname||'/').replace(/^\/+/,'').split('/')[0];
    const reserved=['','index.html','login','register','dashboard','assets','premium','community'];
    if(path && !reserved.includes(path.toLowerCase())){
      window.__dlinkyDirectProfileSlug=decodeURIComponent(path).toLowerCase();
      const hideLanding=()=>{
        document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
        const profile=document.getElementById('profile');
        if(profile) profile.classList.add('active');
      };
      if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',hideLanding,{once:true});
      else hideLanding();
    }
  }catch(e){}
})();

const icons={Instagram:'fa-brands fa-instagram',TikTok:'fa-brands fa-tiktok',Discord:'fa-brands fa-discord',YouTube:'fa-brands fa-youtube',Spotify:'fa-brands fa-spotify',WhatsApp:'fa-brands fa-whatsapp',Twitch:'fa-brands fa-twitch',Steam:'fa-brands fa-steam',Github:'fa-brands fa-github',Roblox:'fa-solid fa-square',Telegram:'fa-brands fa-telegram',X:'fa-brands fa-x-twitter'};
const presetUrls={
  bg1:'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1600&q=80',
  bg2:'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=1600&q=80',
  bg3:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
  banner1:'https://i.pinimg.com/originals/e6/67/64/e66764a7ae6b33bd2bab3ef8a19ca3b5.gif',
  banner2:'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
  avatar1:'https://i.pinimg.com/originals/a8/0f/18/a80f1877da2c94a0ad5f28958dd95eb.gif'
};
const defaultUser={name:'linkroubadao',slug:'linkroubadao',email:'',bio:'o mundo esta perdido. Eu serei a salvaçao',avatar:presetUrls.avatar1,banner:presetUrls.banner1,bg:presetUrls.bg1,video:'',frame:'',music:'',welcome:'Clique aqui',color:'#a855f7',particles:true,particleType:'snow',verified:true,hideViews:false,template:'default',decoration:'purple-ring',views:0,links:[{name:'Instagram',url:'https://instagram.com/'},{name:'TikTok',url:'https://tiktok.com/'},{name:'Discord',url:'https://discord.com/'},{name:'YouTube',url:'https://youtube.com/'}],socials:[{name:'Instagram',url:'https://instagram.com/',on:true},{name:'Spotify',url:'https://spotify.com/',on:true},{name:'TikTok',url:'https://tiktok.com/',on:true},{name:'Discord',url:'https://discord.com/',on:false},{name:'YouTube',url:'https://youtube.com/',on:false}],history:['Conta criada no Dlinky','Tema roxo aplicado','Sistema de decorações ativado']};
let user=loadUser();let assetMode='backgrounds';
function loadUser(){try{return {...defaultUser,...JSON.parse(localStorage.getItem('dlinkyUser')||'{}')}}catch{return {...defaultUser}}}
function saveUser(){localStorage.setItem('dlinkyUser',JSON.stringify(user));renderDash();toast('Salvo com sucesso!')}
function addHistory(t){user.history=[`${new Date().toLocaleString('pt-BR')} — ${t}`,...(user.history||[])].slice(0,20);localStorage.setItem('dlinkyUser',JSON.stringify(user))}
function toast(t){const el=$('#toast');el.textContent=t;el.className='show';setTimeout(()=>el.className='',2200)}
function route(){const __pathSlug=window.__dlinkyDirectProfileSlug||'';const h=location.hash||(__pathSlug?'#/'+__pathSlug:'#/');$$('.page').forEach(p=>p.classList.remove('active'));if((h==='#/'||h==='#')&&!__pathSlug){ $('#landing').classList.add('active')}else if(h==='#/register'){ $('#auth').classList.add('active');$('#registerForm').style.display='block';$('#loginForm').style.display='none'}else if(h==='#/login'){ $('#auth').classList.add('active');$('#registerForm').style.display='none';$('#loginForm').style.display='block'}else if(h==='#/dashboard'){ $('#dashboard').classList.add('active');renderDash()}else if(h==='#/profile'||h==='#/'+user.slug||(__pathSlug&&h==='#/'+__pathSlug)){ if(__pathSlug){user.slug=__pathSlug;} $('#profile').classList.add('active');renderProfile()}else if(h==='#/assets'){simple('Linky Assets','No painel existe uma área com backgrounds, banners, decorações e músicas prontas para aplicar no perfil.')}else if(h==='#/premium'){simple('Premium Dlinky','Aqui você poderá vender decorações, backgrounds, músicas, selo verificado, esconder views e remover marca.')}else{simple('Comunidade Dlinky','Página de comunidade em construção.')}}
function simple(t,p){$('#simple').classList.add('active');$('#simpleTitle').textContent=t;$('#simpleText').textContent=p}
window.addEventListener('hashchange',route);route();
document.addEventListener('click',e=>{const g=e.target.closest('[data-goto]');if(g){location.hash='#/'+g.dataset.goto}const tab=e.target.closest('[data-tab]');if(tab){openTab(tab.dataset.tab)}const ac=e.target.closest('[data-action]');if(ac){if(ac.dataset.action==='openSide')$('.sidebar').classList.add('open');if(ac.dataset.action==='closeSide')$('.sidebar').classList.remove('open');if(ac.dataset.action==='toggleTheme')document.body.classList.toggle('light')}});
$('#registerForm').onsubmit=e=>{e.preventDefault();if($('#regPass').value!==$('#regPass2').value)return toast('As senhas não conferem');user={...defaultUser,name:$('#regName').value.trim(),slug:cleanSlug($('#regSlug').value),email:$('#regEmail').value.trim()};addHistory('Conta registrada');saveUser();location.hash='#/dashboard'};
$('#loginForm').onsubmit=e=>{e.preventDefault();toast('Login efetuado');location.hash='#/dashboard'};
function cleanSlug(v){return(v||'usuario').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9_-]/g,'').slice(0,30)||'usuario'}

function setInputValue(id,value){
  const el=document.querySelector(id);
  if(!el)return;
  if(document.activeElement===el)return;
  el.value=value||'';
}
function openTab(id){$$('.dash-tab').forEach(x=>x.classList.remove('active'));$('#tab-'+id)?.classList.add('active');$$('.side-link').forEach(x=>x.classList.toggle('active',x.dataset.tab===id));$('.sidebar').classList.remove('open');if(id==='links')renderLinksEditor();if(id==='socials')renderSocialEditor();if(id==='assets')renderAssets()}
function renderDash(){document.documentElement.style.setProperty('--neon',user.color||'#a855f7');$('#sideName').textContent=user.name;$('#sideUrl').textContent='dlinky/'+user.slug;$('#dashName').textContent=user.name;$('#dashSlug').textContent='@'+user.slug;$('#viewsCount').textContent=user.views||0;setBg($('#dashAvatar'),user.avatar);setBg($('#sideAvatar'),user.avatar);setInputValue('#cfgName',user.name);setInputValue('#cfgSlug',user.slug);setInputValue('#cfgBio',user.bio);setInputValue('#cfgMusic',user.music);setInputValue('#cfgWelcome',user.welcome||'Clique aqui');setInputValue('#cfgAvatar',user.avatar);setInputValue('#cfgBanner',user.banner);setInputValue('#cfgBg',user.bg);setInputValue('#cfgVideo',user.video);setInputValue('#cfgFrame',user.frame);if(document.activeElement!==$('#cfgColor'))$('#cfgColor').value=user.color||'#a855f7';$('#cfgParticleType').value=user.particleType||'snow';$('#cfgTemplate').value=user.template||'default';$('#cfgDecoration').value=user.decoration||'none';$('#cfgVerified').checked=!!user.verified;$('#cfgHideViews').checked=!!user.hideViews;$('#historyList').innerHTML=(user.history||[]).map(x=>`<li>${x}</li>`).join('')||'<li>Nenhum histórico ainda.</li>'}
function setBg(el,url){
  if(!el)return;
  url=String(url||'').trim();
  if(el.tagName==='IMG'){
    if(url){el.src=url;el.style.display='block';}
    else{el.removeAttribute('src');el.style.display='none';}
  }else{
    el.style.backgroundImage=url?`url("${url}")`:'';
  }
}
$('#viewProfile').onclick=$('#viewProfile2').onclick=()=>{user.views=(user.views||0)+1;localStorage.setItem('dlinkyUser',JSON.stringify(user));location.hash='#/profile'};$('#logoutBtn').onclick=()=>location.hash='#/';
$('#saveAccount').onclick=()=>{user.name=$('#cfgName').value.trim()||user.name;user.slug=cleanSlug($('#cfgSlug').value);user.bio=$('#cfgBio').value;user.music=$('#cfgMusic').value.trim();user.welcome=$('#cfgWelcome').value.trim()||'Clique aqui';addHistory('Configurações da conta alteradas');saveUser()};
$('#saveImages').onclick=()=>{
  const novoAvatar=$('#cfgAvatar').value.trim();
  const novoBanner=$('#cfgBanner').value.trim();
  const novoBg=$('#cfgBg').value.trim();
  const novoVideo=$('#cfgVideo').value.trim();
  const novaFrame=$('#cfgFrame').value.trim();

  if(novoAvatar) user.avatar=novoAvatar;
  if(novoBanner) user.banner=novoBanner;
  if(novoBg) user.bg=novoBg;
  user.video=novoVideo;
  if(novaFrame) user.frame=novaFrame;

  if(user.avatar) localStorage.setItem('dlinkyAvatarPreserve_'+(user.email||user.slug||'local'),user.avatar);

  addHistory('Imagens/fundos alterados');
  saveUser();
};
$('#saveTheme').onclick=()=>{user.color=$('#cfgColor').value;user.particleType=$('#cfgParticleType').value;user.particles=user.particleType!=='none';user.template=$('#cfgTemplate').value;user.decoration=$('#cfgDecoration').value;user.verified=$('#cfgVerified').checked;user.hideViews=$('#cfgHideViews').checked;applyTemplate(user.template);addHistory('Tema/efeitos alterados');saveUser()};
function applyTemplate(t){if(t==='mah'){user.bg='';user.video='https://cdn.coverr.co/videos/coverr-blue-smoke-2763/1080p.mp4';user.banner='';user.decoration='none';user.particleType='snow'}if(t==='anime'){user.banner=presetUrls.banner1;user.bg='';user.video='';user.decoration='red-ring';user.particleType='snow'}if(t==='minimal'){user.bg='';user.video='';user.decoration='orbit-frame';user.particleType='stars'}if(t==='cyber'){user.bg=presetUrls.bg2;user.video='';user.decoration='flame-frame';user.particleType='embers'}}
function renderLinksEditor(){const box=$('#linksEditor');box.innerHTML='';(user.links||[]).forEach((l,i)=>{box.insertAdjacentHTML('beforeend',`<div class="link-row"><input value="${escapeHtml(l.name)}" data-link-name="${i}" placeholder="Nome"><input value="${escapeHtml(l.url)}" data-link-url="${i}" placeholder="https://"><button class="delete" data-del-link="${i}">×</button></div>`)});}
$('#addLink').onclick=()=>{user.links.push({name:'Novo link',url:'https://'});renderLinksEditor()};$('#linksEditor').onclick=e=>{if(e.target.dataset.delLink!==undefined){user.links.splice(+e.target.dataset.delLink,1);renderLinksEditor()}};$('#saveLinks').onclick=()=>{user.links=$$('.link-row').map(r=>({name:$('[data-link-name]',r).value,url:$('[data-link-url]',r).value})).filter(x=>x.name&&x.url);addHistory('Links alterados');saveUser()};
function renderSocialEditor(){const box=$('#socialEditor');box.innerHTML='';const list=user.socials?.length?user.socials:Object.keys(icons).slice(0,6).map(n=>({name:n,url:'https://',on:false}));user.socials=list;list.forEach((s,i)=>box.insertAdjacentHTML('beforeend',`<div class="social-row"><select data-social-name="${i}">${Object.keys(icons).map(n=>`<option ${n===s.name?'selected':''}>${n}</option>`).join('')}</select><input data-social-url="${i}" value="${escapeHtml(s.url)}" placeholder="https://"><label class="check"><input type="checkbox" data-social-on="${i}" ${s.on?'checked':''}> Ativo</label><button class="delete" data-del-social="${i}">×</button></div>`))}
$('#addSocial').onclick=()=>{user.socials=user.socials||[];user.socials.push({name:'Instagram',url:'https://instagram.com/',on:true});renderSocialEditor()};
$('#socialEditor').onclick=e=>{if(e.target.dataset.delSocial!==undefined){user.socials.splice(+e.target.dataset.delSocial,1);renderSocialEditor()}};$('#saveSocials').onclick=()=>{user.socials=$$('.social-row').map(r=>({name:$('[data-social-name]',r).value,url:$('[data-social-url]',r).value,on:$('[data-social-on]',r).checked}));addHistory('Ícones sociais alterados');saveUser()};
const assets={backgrounds:[['Nebula Roxa',presetUrls.bg2,false],['Noite Azul',presetUrls.bg1,false],['Floresta Dark',presetUrls.bg3,true],['Vídeo fumaça azul','https://cdn.coverr.co/videos/coverr-blue-smoke-2763/1080p.mp4',true]],banners:[['Anime banner',presetUrls.banner1,false],['Estrelas banner',presetUrls.banner2,false],['Dark minimal',presetUrls.bg2,true]],decorations:[['Anel roxo','purple-ring',false],['Anel vermelho','red-ring',false],['Brilhos','sparkle-frame',false],['Chama roxa','flame-frame',true],['Órbita premium','orbit-frame',true]],music:[['Cole seu .mp3','',false],['Música premium 1','',true],['Música premium 2','',true]]};
function renderAssets(){const grid=$('#assetGrid');grid.innerHTML='';assets[assetMode].forEach((a,idx)=>{let prev=a[1].startsWith('http')?`style="background-image:url('${a[1]}')"`:'';grid.insertAdjacentHTML('beforeend',`<div class="asset-card"><div class="asset-preview" ${prev}>${!prev?'<span style="display:grid;place-items:center;height:100%;font-size:36px">✦</span>':''}</div><div class="asset-body"><b>${a[0]}</b>${a[2]?'<span class="premium-tag">PREMIUM</span>':'<small>Grátis</small>'}<button class="btn primary small" data-use-asset="${idx}">Usar</button></div></div>`)})}
document.addEventListener('click',e=>{if(e.target.dataset.assetTab){assetMode=e.target.dataset.assetTab;$$('.asset-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.assetTab===assetMode));renderAssets()}if(e.target.dataset.useAsset!==undefined){const a=assets[assetMode][+e.target.dataset.useAsset];if(assetMode==='backgrounds'){if(a[1].endsWith('.mp4')||a[1].endsWith('.webm'))user.video=a[1];else user.bg=a[1]}if(assetMode==='banners')user.banner=a[1];if(assetMode==='decorations')user.decoration=a[1];if(assetMode==='music')user.music=a[1];addHistory('Asset aplicado: '+a[0]);saveUser()}});
function renderProfile(){document.documentElement.style.setProperty('--neon',user.color||'#a855f7');$('#welcomeText').textContent=user.welcome||'Clique aqui';
const __entryKey='dlinky_entry_ok_'+(user.slug||user.email||'local');
if(sessionStorage.getItem(__entryKey)==='1'){
  $('#entryOverlay').classList.add('hidden');
}else{
  $('#entryOverlay').classList.remove('hidden');
}
$('#profileName').textContent=user.name;$('#profileSlug2').textContent='@'+user.slug;$('#profileBio').textContent=user.bio||'';$('#verifiedBadge').style.display=user.verified?'inline':'none';$('#profileViews').style.display=user.hideViews?'none':'inline-block';$('#profileViews').textContent=`👁 ${user.views||0} views`;const __avatarClean=user.avatar||localStorage.getItem('dlinky_avatar_clean_'+(user.email||user.slug||'local'))||'';
if(__avatarClean){user.avatar=__avatarClean;localStorage.setItem('dlinky_avatar_clean_'+(user.email||user.slug||'local'),__avatarClean);}
setBg($('#profileAvatar'),__avatarClean);setBg($('#profileBanner'),user.banner);setBg($('#profileBg'),user.bg);const vid=$('#profileVideo');vid.classList.remove('show');vid.removeAttribute('src');if(user.video){vid.src=user.video;vid.load();vid.classList.add('show');vid.play().catch(()=>{})}$('#profileFrame').src=user.frame||'';$('#profileFrame').style.display=user.frame?'block':'none';const deco=$('#avatarDecoration');deco.className='avatar-decoration '+(user.decoration||'none');$('#profileLinks').innerHTML=(user.links||[]).map(l=>`<a target="_blank" href="${safeUrl(l.url)}">${escapeHtml(l.name)}</a>`).join('');$('#profileSocials').innerHTML=(user.socials||[]).filter(s=>s.on).map(s=>`<a class="social-icon brand-${String(s.name||'link').toLowerCase().replace(/[^a-z0-9]/g,'')}" target="_blank" title="${s.name}" href="${safeUrl(s.url)}"><i class="${icons[s.name]||'fa-solid fa-link'}"></i></a>`).join('');const audio=$('#profileAudio'); if(audio){ const ms=user.music||''; if(audio.getAttribute('src')!==ms){ audio.src=ms; audio.load(); } } createProfileParticles(user.particleType||'snow')}
$('#entryOverlay').onclick=()=>{
  const __entryKey='dlinky_entry_ok_'+(user.slug||user.email||'local');
  sessionStorage.setItem(__entryKey,'1');
  $('#entryOverlay').classList.add('hidden');
  const audio=$('#profileAudio');
  if(user.music){audio.play().catch(()=>toast('Clique no botão de som para tocar a música'))}
};$('#soundBtn').onclick=()=>{const a=$('#profileAudio');if(!user.music)return toast('Nenhuma música configurada');if(a.paused)a.play();else a.pause()};
function createProfileParticles(type){const layer=$('#profileParticleLayer');layer.innerHTML='';if(type==='none'||!user.particles)return;const char={snow:'✽',stars:'✦',hearts:'❤',embers:'•',bubbles:''}[type]||'✽';const cls={snow:'snow',stars:'star',hearts:'heart',embers:'ember',bubbles:'bubble'}[type];for(let i=0;i<14;i++){const s=document.createElement('span');s.className='fx '+cls;s.textContent=char;s.style.left=Math.random()*100+'%';s.style.animationDuration=(6+Math.random()*9)+'s';s.style.animationDelay=(-Math.random()*12)+'s';s.style.fontSize=(type==='bubbles'?8:12+Math.random()*16)+'px';if(type==='bubbles'){s.style.width=s.style.height=(8+Math.random()*18)+'px'}layer.appendChild(s)}}
function escapeHtml(s=''){return String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}function safeUrl(u=''){return u.startsWith('http')?u:'#'}
// dashboard background particles
const canvas=$('#particlesCanvas'),ctx=canvas.getContext('2d');let dots=[];function size(){canvas.width=innerWidth;canvas.height=innerHeight;dots=Array.from({length:24},()=>({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*2+1,v:Math.random()*0.5+0.15}))}addEventListener('resize',size);size();function anim(){if(document.hidden || location.hash.includes('/profile')){requestAnimationFrame(anim);return;}ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle='rgba(168,85,247,.75)';dots.forEach(d=>{d.y+=d.v;if(d.y>canvas.height)d.y=-5;ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,Math.PI*2);ctx.fill()});requestAnimationFrame(anim)}anim();
renderDash();

/* ===== Dlinky add-on: páginas extras do Zyo sem alterar o visual base ===== */
(function(){
  const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const tags=['☮ Paz','💻 Programador','🎤 Artista','🎨 Designer','✍️ Escritor','💸 Investidor','🎵 Músico','📷 Fotógrafo','🏕️ Ar Livre','🎮 Gamer','😇 Anjo(a)','😈 Perigoso(a)','⚽ Futebol','🔥 Tímido(a)','🥶 Frio','🇧🇷 Brasil','🔫 Valorant','🎯 Fortnite','🧠 League Of Legends','🕹️ Roblox','⚡ Cyberpunk'];
  const shopData={
    coins:[['345 Linkwuans','R$ 30,00',345],['650 Linkwuans','R$ 50,00',650],['1450 Linkwuans','R$ 100,00',1450],['3300 Linkwuans','R$ 200,00',3300]],
    frames:[],

    badges: [],
    effects:[['Neon no Nome','180 Linkwuans','neonName'],['Nome Brilhante','220 Linkwuans','shineName'],['Nome Colorido','240 Linkwuans','rainbowName'],['Ocultar Views','150 Linkwuans','hideViews']],
    other:[['Cursor Custom','120 Linkwuans','cursor'],['Tema Cyber','300 Linkwuans','cyber']]
  };
  let shopMode='coins';
  function ensure(){
    user.coins=user.coins||0; user.inventory=user.inventory||[]; user.purchases=user.purchases||[]; user.embeds=user.embeds||[]; user.tags=user.tags||[];
    user.opacity=user.opacity||100; user.blur=user.blur||0; user.layout=user.layout||'card'; user.center=user.center||'no'; user.cursor=user.cursor||'';
    user.cardColor=user.cardColor||'#06030b'; user.textColor=user.textColor||'#ffffff'; user.bioColor=user.bioColor||'#eeeeee'; user.bgFx=user.bgFx||'none';
  }
  function persist(msg){ ensure(); localStorage.setItem('dlinkyUser',JSON.stringify(user)); if(msg) addHistory(msg); if(typeof renderDash==='function') renderDash(); toast('Salvo com sucesso!'); }
  const originalOpenTab=window.openTab || openTab;
  window.openTab=openTab=function(id){
    qa('.dash-tab').forEach(x=>x.classList.remove('active')); q('#tab-'+id)?.classList.add('active'); qa('.side-link').forEach(x=>x.classList.toggle('active',x.dataset.tab===id)); q('.sidebar')?.classList.remove('open');
    ensure();
    if(id==='links')renderLinksEditor(); if(id==='socials')renderSocialEditor(); if(id==='assets')renderAssets(); if(id==='store')renderShop(); if(id==='colors')renderTags(); if(id==='embeds')renderEmbeds(); if(id==='inventory')renderInventory(); if(id==='history')renderPremiumHistory(); fillExtraForms();
  }
  const oldRenderDash=window.renderDash || renderDash;
  window.renderDash=renderDash=function(){ ensure(); oldRenderDash();
    const put=(id,val)=>{const el=q('#'+id); if(el) el.textContent=val};
    put('coinCount',user.coins); put('walletCoins',user.coins); put('invCoins',user.coins); put('invItemsCount',user.inventory.length); put('invCountMini',user.inventory.length);
    fillExtraForms(); renderInventory(); renderPremiumHistory();
  }
  function fillExtraForms(){ ensure();
    [['layoutType',user.layout],['layoutCenter',user.center],['layoutWelcome',user.welcome],['layoutOpacity',user.opacity],['layoutBlur',user.blur],['uploadAvatar',user.avatar],['uploadBg',user.video||user.bg],['uploadCursor',user.cursor],['uploadMusic',user.music],['customName',user.name],['customBio',user.bio],['customBgFx',user.bgFx],['colorProfile',user.color],['colorCard',user.cardColor],['colorText',user.textColor],['colorBio',user.bioColor]].forEach(([id,val])=>{let el=q('#'+id); if(el) el.value=val||''});
    [['fxNeonName','neonName'],['fxShineName','shineName'],['fxRainbowName','rainbowName'],['fxPerspective','perspective']].forEach(([id,k])=>{let el=q('#'+id); if(el) el.checked=!!user[k]});
  }

  function frameSvgData(kind){
    const svg={
      'butterfly-frame':`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220"><defs><filter id="g"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="r"><stop offset="60%" stop-color="transparent"/><stop offset="100%" stop-color="#ff225c"/></radialGradient></defs><circle cx="110" cy="110" r="70" fill="none" stroke="#ff2b63" stroke-width="9" filter="url(#g)"/><path d="M38 83C4 40 70 22 92 88C66 96 54 100 38 83Z" fill="#ff4c78" filter="url(#g)"/><path d="M182 83c34-43-32-61-54 5c26 8 38 12 54-5Z" fill="#ff4c78" filter="url(#g)"/><circle cx="110" cy="110" r="54" fill="url(#r)" opacity=".35"/></svg>`,
      'fox-frame':`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220"><defs><filter id="g"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="110" cy="116" r="62" fill="none" stroke="#f8fafc" stroke-width="10" filter="url(#g)"/><path d="M64 65 86 20 103 73" fill="#fff" filter="url(#g)"/><path d="M156 65 134 20 117 73" fill="#fff" filter="url(#g)"/><circle cx="110" cy="116" r="78" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="20"/></svg>`,
      'mirror-frame':`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220"><defs><linearGradient id="m" x1="0" x2="1"><stop stop-color="#60a5fa"/><stop offset=".45" stop-color="#fff"/><stop offset=".75" stop-color="#fb923c"/><stop offset="1" stop-color="#60a5fa"/><animateTransform attributeName="gradientTransform" type="rotate" from="0 .5 .5" to="360 .5 .5" dur="5s" repeatCount="indefinite"/></linearGradient><filter id="g"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="110" cy="110" r="70" fill="none" stroke="url(#m)" stroke-width="8" filter="url(#g)"/><circle cx="110" cy="110" r="86" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="3"/></svg>`,
      'flower-frame':`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220"><defs><filter id="g"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="110" cy="110" r="68" fill="none" stroke="#ff9bd4" stroke-width="8" filter="url(#g)"/><g fill="#ff8acb" filter="url(#g)"><text x="34" y="118" font-size="30">✿</text><text x="158" y="80" font-size="25">✿</text><text x="148" y="153" font-size="27">✿</text><text x="61" y="56" font-size="22">✿</text></g></svg>`,
      'marine-frame':`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220"><defs><filter id="g"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="110" cy="110" r="71" fill="none" stroke="#8cf3ff" stroke-width="7" filter="url(#g)"/><circle cx="110" cy="110" r="88" fill="none" stroke="#67e8f9" stroke-width="4" stroke-dasharray="9 8"><animateTransform attributeName="transform" type="rotate" from="0 110 110" to="360 110 110" dur="8s" repeatCount="indefinite"/></circle></svg>`,
      'autumn-frame':`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220"><defs><filter id="g"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="110" cy="112" r="70" fill="none" stroke="#f59e0b" stroke-width="8" filter="url(#g)"/><text x="44" y="45" font-size="28">🍂</text><text x="100" y="31" font-size="30">🍁</text><text x="151" y="47" font-size="28">🍂</text></svg>`,
      'spider-frame':`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220"><defs><filter id="g"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g stroke="#e5e7eb" fill="none" opacity=".9" filter="url(#g)"><circle cx="110" cy="112" r="78"/><circle cx="110" cy="112" r="58"/><path d="M110 34v156M32 112h156M55 57l110 110M165 57 55 167"/></g><text x="91" y="48" font-size="34">🕷</text></svg>`,
      'constellation-frame':`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220"><defs><filter id="g"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="110" cy="110" r="70" fill="none" stroke="#93c5fd" stroke-width="8" filter="url(#g)"/><g fill="#dbeafe" filter="url(#g)"><text x="39" y="78" font-size="22">✦</text><text x="160" y="70" font-size="20">✧</text><text x="49" y="165" font-size="20">✧</text><text x="153" y="160" font-size="22">✦</text></g></svg>`,
      'yinyang-frame':`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220"><defs><filter id="g"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="110" cy="110" r="70" fill="none" stroke="#fff" stroke-width="6" opacity=".8" filter="url(#g)"/><path d="M142 46C92 50 68 86 74 126c8 54 80 58 87 7-32 8-52-16-42-41 8-20 27-31 23-46Z" fill="#111"/><text x="153" y="61" font-size="34">☯</text></svg>`,
      'hearts-frame':`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220"><defs><filter id="g"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="110" cy="114" r="70" fill="none" stroke="#fff" stroke-width="7" filter="url(#g)"/><g fill="#fb5ca8" filter="url(#g)"><text x="54" y="51" font-size="22">♥</text><text x="103" y="37" font-size="24">♥</text><text x="151" y="52" font-size="22">♥</text></g></svg>`,
      'vortex-frame':`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220"><defs><filter id="g"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="110" cy="110" r="70" fill="none" stroke="#22d3ee" stroke-width="10" filter="url(#g)"/><circle cx="110" cy="110" r="86" fill="none" stroke="#67e8f9" stroke-width="5" stroke-dasharray="14 7"><animateTransform attributeName="transform" type="rotate" from="0 110 110" to="360 110 110" dur="3s" repeatCount="indefinite"/></circle></svg>`,
      'snow-frame':`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220"><defs><filter id="g"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="110" cy="110" r="72" fill="none" stroke="#dbeafe" stroke-width="8" filter="url(#g)"/><g fill="#e0f2fe" filter="url(#g)"><text x="36" y="100" font-size="23">❄</text><text x="158" y="90" font-size="23">❄</text><text x="82" y="41" font-size="20">❄</text><text x="132" y="174" font-size="20">❄</text></g></svg>`,
      'bonsai-frame':`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220"><defs><filter id="g"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="110" cy="112" r="68" fill="none" stroke="#f472b6" stroke-width="7" filter="url(#g)"/><path d="M47 145c32-9 31-54 65-67 27-10 51 2 66-30-8 49-28 79-76 87-19 3-39 6-55 10Z" fill="none" stroke="#ff4fa7" stroke-width="8" filter="url(#g)"/><text x="31" y="153" font-size="33">🌸</text></svg>`,
      'batarang-frame':`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220"><defs><filter id="g"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="110" cy="116" r="68" fill="none" stroke="#facc15" stroke-width="4" filter="url(#g)"/><path d="M55 83c24 6 35-19 55-41 20 22 31 47 55 41-23 15-40 15-55 1-15 14-32 14-55-1Z" fill="#111" stroke="#facc15" stroke-width="2" filter="url(#g)"/></svg>`,
      'king-frame':`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220"><defs><filter id="g"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="110" cy="120" r="68" fill="none" stroke="#facc15" stroke-width="7" filter="url(#g)"/><path d="M62 60l27 22 21-39 21 39 27-22-10 51H72Z" fill="#facc15" filter="url(#g)"/></svg>`
    }[kind]||`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220"><circle cx="110" cy="110" r="72" fill="none" stroke="#a855f7" stroke-width="8"/></svg>`;
    return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
  }
  function customFrames(){try{return JSON.parse(localStorage.getItem('dlinkyCustomFrames')||'[]')}catch{return []}}
  function framePriceNumber(price){
    const n=String(price||'20').match(/\d+/); return n?Number(n[0]):20;
  }
  function frameDurationPrice(base,duration){ return Number(base)||0; }
  function renderShop(){
    const grid=q('#shopGrid'); if(!grid)return;
    if(shopMode==='frames'){
      const custom=customFrames().map((f,idx)=>[
        f.name||'Moldura personalizada',
        f.price||'20 Linkwuans',
        'custom-'+idx,
        f.desc||'Moldura enviada pelo admin',
        'Disponível',
        f.url||''
      ]).filter(x=>x[5]);
      const all=[...custom];
      grid.classList.add('frames-shop-grid');
      if(!all.length){
        grid.innerHTML=`<div class="panel empty-frames-help"><h2>Nenhuma moldura cadastrada</h2><p>Entre no Admin, adicione suas molduras em <b>assets/molduras/</b> e elas aparecerão aqui. As molduras padrão foram removidas para você usar somente as suas.</p></div>`;
        window.__dlinkyVisibleFrames=[];
        return;
      }
      grid.innerHTML=all.map((x,i)=>{
        const img=x[5];
        const base=framePriceNumber(x[1]);
        const av=escapeHtml(user.avatar||'');
        return `<div class="frame-shop-card premium-frame custom-only-frame" data-frame-card="${i}" data-base-price="${base}">
          <div class="frame-shop-preview real-frame-preview"><div class="frame-avatar-demo zyo-person-demo" style="background-image:url('${av}')!important"></div><img class="frame-img big" src="${img}" alt="${escapeHtml(x[0])}"></div>
          <div class="frame-info clean-info"><b>${x[0]}<span class="frame-url-chip">custom</span></b><small>${x[3]}</small></div>
          <div class="frame-stock available"><span></span><b>Disponível</b></div>
          <div class="frame-price">Preço do item: <b data-price-label="${i}">${base} Linkwuans</b></div>
          <select class="frame-duration" data-frame-duration="${i}"><option>3 dias</option><option>7 dias</option><option>15 dias</option><option>Permanente</option></select>
          <small class="frame-note">ⓘ Valor muda conforme a duração escolhida.</small>
          <div class="frame-actions"><button class="btn primary small" data-confirm-frame="${i}">▣ Comprar</button><button class="btn dark small" type="button" data-gift-frame="${i}">🎁 Presentear</button></div>
        </div>`}).join('');
      window.__dlinkyVisibleFrames=all;
      return;
    }
    grid.classList.remove('frames-shop-grid');
    grid.innerHTML=shopData[shopMode].map((x,i)=>`<div class="asset-card"><div class="asset-preview shop-preview">${shopMode==='coins'?'◈':'✦'}</div><div class="asset-body"><b>${x[0]}</b><small>${x[1]}</small><button class="btn primary small" data-buy-shop="${i}">Comprar</button></div></div>`).join('');
  }

  function renderTags(){ const g=q('#tagGrid'); if(!g)return; g.innerHTML=tags.map(t=>`<button class="tag-btn ${user.tags.includes(t)?'on':''}" data-tagpick="${t}">${t}</button>`).join(''); }
  function renderEmbeds(){ const list=q('#embedList'); if(!list)return; list.innerHTML=user.embeds.length?user.embeds.map((u,i)=>`<p class="embed-item"><a href="${safeUrl(u)}" target="_blank">${escapeHtml(u)}</a><button class="delete" data-del-embed="${i}">×</button></p>`).join(''):'Não há embeds no momento.'; }
  function renderInventory(){ const g=q('#inventoryGrid'); if(!g)return; if(window.__dlinkyReceiveGifts) window.__dlinkyReceiveGifts(); const av=escapeHtml(user.avatar||''); g.innerHTML=user.inventory.length?user.inventory.map((it,i)=>{ const isFrame=it.url||String(it.type||'').includes('frame'); return `<div class="asset-card inv-item-card"><div class="asset-preview shop-preview inv-preview">${isFrame?`<span class="inv-avatar-preview zyo-person-demo" style="background-image:url('${av}')!important"></span><img class="inv-frame-preview" src="${escapeHtml(it.url||'')}" alt="${escapeHtml(it.name||'moldura')}">`:'✦'}</div><div class="asset-body"><b>${escapeHtml(it.name||'Item')}</b><small>${escapeHtml(it.duration||it.type||'item')}</small><button class="btn primary small" data-use-inv="${i}">Usar</button></div></div>`}).join(''):'<p>Você ainda não possui itens no inventário.</p>'; }
  function renderPremiumHistory(){ const tb=q('#premiumHistoryRows'); if(!tb)return; tb.innerHTML=user.purchases.length?user.purchases.map(p=>`<tr><td>${p.id}</td><td>${p.method}</td><td><span class="status ok">${p.status}</span></td><td>${p.value}</td><td>${p.date}</td></tr>`).join(''):'<tr><td colspan="5">Nenhuma compra encontrada.</td></tr>'; }
  document.addEventListener('click',e=>{
    if(e.target.dataset.shopTab){shopMode=e.target.dataset.shopTab; qa('.shop-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.shopTab===shopMode)); renderShop();}
    if(e.target.dataset.buyShop!==undefined){ensure(); const item=shopData[shopMode][+e.target.dataset.buyShop]; if(shopMode==='coins'){ e.preventDefault(); e.stopPropagation(); if(window.dlinkyOpenPixRecharge) window.dlinkyOpenPixRecharge(Number(item[2]||0)); return; } else {user.inventory.push({type:shopMode,name:item[0],value:item[2]}); if(['neonName','shineName','rainbowName','hideViews'].includes(item[2])) user[item[2]]=true; if(['purple-ring','red-ring','orbit-frame','flame-frame','butterfly-frame','fox-frame','mirror-frame','flower-frame','marine-frame','autumn-frame','spider-frame','constellation-frame','yinyang-frame','hearts-frame','vortex-frame','snow-frame','bonsai-frame','batarang-frame','king-frame'].includes(item[2])) user.decoration=item[2]; if(item[2]==='verified') user.verified=true;} persist('Loja atualizada'); renderShop();}
    if(e.target.dataset.tagpick){ensure(); const t=e.target.dataset.tagpick; user.tags=user.tags.includes(t)?user.tags.filter(x=>x!==t):[...user.tags,t].slice(0,8); persist('Tags alteradas'); renderTags();}
    if(e.target.dataset.delEmbed!==undefined){user.embeds.splice(+e.target.dataset.delEmbed,1); persist('Embed removido'); renderEmbeds();}
    if(e.target.dataset.useInv!==undefined){const it=user.inventory[+e.target.dataset.useInv]; if(!it)return; if(it.url){user.frame=it.url; user.decoration='none';} if(['purple-ring','red-ring','orbit-frame','flame-frame','butterfly-frame','fox-frame','mirror-frame','flower-frame','marine-frame','autumn-frame','spider-frame','constellation-frame','yinyang-frame','hearts-frame','vortex-frame','snow-frame','bonsai-frame','batarang-frame','king-frame'].includes(it.value))user.decoration=it.value; if(['neonName','shineName','rainbowName','hideViews'].includes(it.value))user[it.value]=true; if(it.value==='verified')user.verified=true; persist('Item do inventário aplicado'); renderInventory();}
  });
  q('#customCoinsBtn')?.addEventListener('click',()=>{ensure(); user.coins+=100; user.purchases.unshift({id:Date.now(),method:'Mistic Pay PIX',status:'Aprovado',value:'Personalizado',date:new Date().toLocaleDateString('pt-BR')}); persist('Recarga personalizada');});
  q('#voucherBtn')?.addEventListener('click',()=>{ensure(); const v=q('#voucherCode').value.trim().toUpperCase(); if(v==='DLINKY100'||v==='LINKWUANS100'){user.coins+=100; persist('Voucher aplicado');}else toast('Voucher inválido');});
  q('#saveLayout')?.addEventListener('click',()=>{ensure(); user.layout=q('#layoutType').value; user.center=q('#layoutCenter').value; user.welcome=q('#layoutWelcome').value||'Clique aqui'; user.opacity=+q('#layoutOpacity').value||100; user.blur=+q('#layoutBlur').value||0; persist('Layout alterado');});
  q('#saveUploads')?.addEventListener('click',()=>{ensure(); user.avatar=q('#uploadAvatar').value.trim()||user.avatar; const bg=q('#uploadBg').value.trim(); if(/\.(mp4|webm)(\?|$)/i.test(bg)){user.video=bg; user.bg='';} else if(bg){user.bg=bg; user.video='';} user.cursor=q('#uploadCursor').value.trim(); user.music=q('#uploadMusic').value.trim(); persist('Ativos atualizados');});
  q('#saveCustom')?.addEventListener('click',()=>{ensure(); user.name=q('#customName').value.trim()||user.name; user.bio=q('#customBio').value; user.bgFx=q('#customBgFx').value; user.neonName=q('#fxNeonName').checked; user.shineName=q('#fxShineName').checked; user.rainbowName=q('#fxRainbowName').checked; user.perspective=q('#fxPerspective').checked; persist('Customização alterada');});
  q('#saveColors')?.addEventListener('click',()=>{ensure(); user.color=q('#colorProfile').value; user.cardColor=q('#colorCard').value; user.textColor=q('#colorText').value; user.bioColor=q('#colorBio').value; persist('Cores alteradas');});
  q('#addEmbed')?.addEventListener('click',()=>{ensure(); const u=q('#embedUrl').value.trim(); if(!u)return toast('Cole uma URL'); user.embeds.push(u); q('#embedUrl').value=''; persist('Embed adicionado'); renderEmbeds();});
  const oldRenderProfile=window.renderProfile || renderProfile;
  window.renderProfile=renderProfile=function(){ ensure(); oldRenderProfile();
    document.documentElement.style.setProperty('--profileCardColor',user.cardColor||'#06030b'); document.documentElement.style.setProperty('--profileTextColor',user.textColor||'#fff'); document.documentElement.style.setProperty('--profileBioColor',user.bioColor||'#eee'); document.documentElement.style.setProperty('--cardOpacity',(user.opacity||100)/100); document.documentElement.style.setProperty('--profileBlur',(user.blur||0)+'px');
    q('#profileCard')?.classList.toggle('centered',user.center==='yes'); q('#profileCard')?.classList.toggle('layout-banner',user.layout==='banner'); q('#profileCard')?.classList.toggle('perspective',!!user.perspective); q('#profileName')?.classList.toggle('neon-title',!!user.neonName); q('#profileName')?.classList.toggle('shine-title',!!user.shineName); q('#profileName')?.classList.toggle('rainbow-title',!!user.rainbowName);
    const tagBox=q('#profileTags'); if(tagBox) tagBox.innerHTML=(user.tags||[]).map(t=>`<span>${escapeHtml(t)}</span>`).join('');
    const emb=q('#profileEmbeds'); if(emb) emb.innerHTML=(user.embeds||[]).map(u=>{let id=(u.split('v=')[1]||'').split('&')[0]; return u.includes('youtube')&&id?`<iframe src="https://www.youtube.com/embed/${id}" allowfullscreen></iframe>`:`<a href="${safeUrl(u)}" target="_blank">${escapeHtml(u)}</a>`}).join('');
    q('#profileBio').style.color=user.bioColor||'#eee';
    if(user.cursor) document.body.style.cursor=`url(${user.cursor}), auto`;
  }
  renderDash();
})();


/* ===== correções limpas: persistência, áudio, sidebar, PIX ===== */
(function(){
  const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
  function saveSilent(){localStorage.setItem('dlinkyUser',JSON.stringify(user));}
  const oldToast = window.toast || toast;
  window.toast = toast = function(t){ if(location.hash==='#/profile'||location.hash==='#/'+user.slug) return; oldToast(t); };
  function stopProfileMedia(){const a=q('#profileAudio'); if(a){a.pause(); a.currentTime=0;} const v=q('#profileVideo'); if(v){v.pause();}}
  const oldRoute = window.route || route;
  window.route = route = function(){
    const h=location.hash||'#/';
    if(!(h==='#/profile'||h==='#/'+user.slug)) stopProfileMedia();
    oldRoute();
    document.body.classList.toggle('is-profile', h==='#/profile'||h==='#/'+user.slug);
  };
  window.addEventListener('hashchange', route);
  q('#backToDash')?.addEventListener('click', stopProfileMedia);
  document.addEventListener('click', e=>{
    const title=e.target.closest('.side-title');
    if(title){ title.closest('.side-group')?.classList.toggle('open'); }
    const act=e.target.closest('[data-action]');
    if(act && act.dataset.action==='collapseSide'){
      q('#sidebar')?.classList.toggle('collapsed');
      act.textContent=q('#sidebar')?.classList.contains('collapsed')?'›':'‹';
    }
  });
  // salvar tema sem template sobrescrever escolhas de partícula/decoração sem querer
  q('#saveTheme')?.addEventListener('click', function(ev){
    ev.stopImmediatePropagation();
    const previousTemplate=user.template;
    user.color=q('#cfgColor').value;
    user.particleType=q('#cfgParticleType').value;
    user.particles=user.particleType!=='none';
    user.template=q('#cfgTemplate').value;
    user.decoration=q('#cfgDecoration').value;
    user.verified=q('#cfgVerified').checked;
    user.hideViews=q('#cfgHideViews').checked;
    // Só aplica visual do template quando a pessoa muda o template; depois mantém escolhas manuais.
    if(user.template!==previousTemplate && typeof applyTemplate==='function') applyTemplate(user.template);
    user.particleType=q('#cfgParticleType').value;
    user.decoration=q('#cfgDecoration').value;
    addHistory('Tema/efeitos alterados');
    saveUser();
  }, true);
  // PIX realista no front: gera QR visual/copia e cola para compra; integração real fica pelo backend com Mistic Pay
  function openPix(itemName, valueText){
    const modal=q('#paymentModal'); if(!modal) return;
    q('#payDesc').textContent=`Compra: ${itemName} • ${valueText}`;
    const pix=(user.payPix||user.pay?.pix||'configure-sua-chave-pix');
    q('#pixCode').value=`DLINKY|MISTICPAY|ITEM:${itemName}|VALOR:${valueText}|PIX:${pix}`;
    const qr=q('#pixQr'); qr.innerHTML='';
    for(let i=0;i<81;i++){let el=document.createElement(((i*7+i%4)%3===0)?'span':'i');qr.appendChild(el)}
    modal.classList.add('show');
  }
  q('#closePayment')?.addEventListener('click',()=>q('#paymentModal').classList.remove('show'));
  q('#copyPix')?.addEventListener('click',()=>{q('#pixCode').select();document.execCommand('copy');oldToast('Código PIX copiado');});
  q('#savePay')?.addEventListener('click',()=>{user.payName=q('#payName').value;user.payPix=q('#payPix').value;user.payEndpoint=q('#payEndpoint').value;user.payToken=q('#payToken').value;saveUser();});
  // Intercepta compras para abrir QR, sem textos de simulação para cliente.
  document.addEventListener('click', function(e){
    if(e.target.dataset.buyShop!==undefined){
      e.stopImmediatePropagation();
      const mode=(typeof shopMode!=='undefined'?shopMode:'coins');
      const data=(typeof shopData!=='undefined'?shopData:null);
      if(!data || !data[mode]) return;
      const item=data[mode][+e.target.dataset.buyShop];
      openPix(item[0], item[1]);
    }
  }, true);
})();


/* ===== Admin privado + molduras por URL/GIF ===== */
(function(){
  const ADMIN_EMAIL='jailtonsilas48@gmail.com';
  const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
  function isAdmin(){return (user.email||'').toLowerCase().trim()===ADMIN_EMAIL}
  function frames(){try{return JSON.parse(localStorage.getItem('dlinkyCustomFrames')||'[]')}catch{return []}}
  function saveFrames(v){localStorage.setItem('dlinkyCustomFrames',JSON.stringify(v))}
  function gifts(){try{return JSON.parse(localStorage.getItem('dlinkyAdminGifts')||'[]')}catch{return []}}
  function saveGifts(v){localStorage.setItem('dlinkyAdminGifts',JSON.stringify(v))}
  function showAdmin(){qa('.admin-only').forEach(el=>{el.classList.toggle('show',isAdmin()); el.style.display=isAdmin()?'flex':'none'});}
  function openPixAdmin(itemName,valueText){const modal=q('#paymentModal'); if(!modal)return; q('#payDesc').textContent=`Compra: ${itemName} • ${valueText}`; const pix=(user.payPix||user.pay?.pix||'configure-sua-chave-pix'); q('#pixCode').value=`DLINKY|MISTICPAY|ITEM:${itemName}|VALOR:${valueText}|PIX:${pix}`; const qr=q('#pixQr'); qr.innerHTML=''; for(let i=0;i<81;i++){let el=document.createElement(((i*7+i%4)%3===0)?'span':'i');qr.appendChild(el)} modal.classList.add('show');}
  const oldRenderDash2=window.renderDash||renderDash;
  window.renderDash=renderDash=function(){oldRenderDash2();showAdmin();receiveGifts();renderAdminList();}
  const oldOpenTab2=window.openTab||openTab;
  window.openTab=openTab=function(id){
    if(id==='admin' && !isAdmin()){toast('Admin disponível somente para o dono.');return;}
    oldOpenTab2(id);showAdmin(); if(id==='admin')renderAdminList();
  }
  function renderAdminList(){const box=q('#adminFramesList'); if(!box)return; const arr=frames(); box.innerHTML=arr.length?arr.map((f,i)=>`<div class="admin-item"><img src="${f.url}" alt=""><div><b>${f.name}</b><br><small>${f.price} • ${f.desc||''}</small></div><button class="delete" data-admin-del-frame="${i}">×</button></div>`).join(''):'<p>Nenhuma moldura custom adicionada ainda.</p>'}
  function receiveGifts(){
    if(!user.email)return; let arr=gifts(); let mine=arr.filter(g=>(g.email||'').toLowerCase().trim()===(user.email||'').toLowerCase().trim()&&!g.received);
    if(!mine.length)return; user.inventory=user.inventory||[]; mine.forEach(g=>{user.inventory=user.inventory||[]; user.inventory.push({type:'frames',name:g.name||'Presente',value:'custom-gift',url:g.url,duration:'Presente',price:'0 Linkwuans',gift:true,date:Date.now()}); if(g.url) user.frame=g.url; g.received=true;});
    saveGifts(arr); localStorage.setItem('dlinkyUser',JSON.stringify(user));
  }
  document.addEventListener('click',function(e){
    if(e.target && e.target.id==='adminAddFrame'){
      const arr=frames();
      const base=q('#adminFramePrice').value||'20 Linkwuans';
      const onlyNum=v=>{const m=String(v||'').match(/\d+/);return m?Number(m[0]):null};
      const b=onlyNum(base)||20;
      arr.unshift({name:q('#adminFrameName').value||'Moldura personalizada',desc:q('#adminFrameDesc').value||'Moldura custom',price:base,url:q('#adminFrameUrl').value.trim(),prices:{'3 dias':onlyNum(q('#adminPrice3').value)||b,'7 dias':onlyNum(q('#adminPrice7').value)||b*2,'15 dias':onlyNum(q('#adminPrice15').value)||b*3,'Permanente':onlyNum(q('#adminPricePerm').value)||b*2}});
      saveFrames(arr.filter(x=>x.url)); renderAdminList(); toast('Moldura adicionada na loja');
    }
    if(e.target?.dataset?.adminDelFrame!==undefined){const arr=frames();arr.splice(+e.target.dataset.adminDelFrame,1);saveFrames(arr);renderAdminList();toast('Moldura removida')}
    if(e.target && e.target.id==='adminApplyUser'){
      const email=q('#adminUserEmail').value.trim().toLowerCase(); const coins=Number(q('#adminCoins').value||0); const amount=Number(q('#adminPremiumAmount').value||0); const unit=q('#adminPremiumUnit').value;
      const grants=JSON.parse(localStorage.getItem('dlinkyAdminGrants')||'[]'); grants.unshift({email,coins,amount,unit,date:new Date().toISOString()}); localStorage.setItem('dlinkyAdminGrants',JSON.stringify(grants));
      if(email===(user.email||'').toLowerCase()){user.coins=(user.coins||0)+coins; if(amount>0){let ms={hours:3600000,days:86400000,months:2592000000,years:31536000000}[unit]*amount; user.premiumUntil=Date.now()+ms;} localStorage.setItem('dlinkyUser',JSON.stringify(user)); renderDash();}
      toast('Benefício salvo para o usuário');
    }
    if(e.target && e.target.id==='adminSendGift'){
      const target=q('#giftEmail').value.trim().toLowerCase();
      const framesArr=frames(); const idx=Number(q('#giftItemSelect')?.value||0); const f=framesArr[idx];
      if(!target || !f){toast('Escolha o destinatário e o item da loja.'); return;}
      const arr=gifts(); arr.unshift({email:target,slug:target.replace(/^@/,''),name:f.name||'Presente Dlinky',url:f.url||'',duration:'Presente',message:q('#giftMsg')?.value||'',received:false,date:new Date().toISOString()}); saveGifts(arr); toast('Presente enviado');
    }
    /* buyFrame antigo removido: agora usa modal de confirmação com Linkwuans */
  });
  // quando uma moldura custom for aplicada pelo inventário/presente, ela aparece sobre a foto do perfil
  const oldProfile=window.renderProfile||renderProfile;
  window.renderProfile=renderProfile=function(){oldProfile(); const deco=q('#avatarDecoration'); const img=q('#profileFrame'); if(user.frame){img.src=user.frame; deco.classList.add('has-img-frame')}else{deco.classList.remove('has-img-frame')}};
  showAdmin();
})();


/* ===== Compra de molduras com Linkwuans + modal estilo Zyo ===== */
(function(){
  const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
  function getCustomFrames(){try{return JSON.parse(localStorage.getItem('dlinkyCustomFrames')||'[]')}catch{return []}}
  function parsePrice(v){const m=String(v||'20').match(/\d+/); return m?Number(m[0]):20;}
  function durationPrice(base,d){ return Number(base)||0; }
  function updateWallet(){ const ids=['walletCoins','coinCount','invCoins']; ids.forEach(id=>{const el=q('#'+id); if(el) el.textContent=user.coins||0;}); }
  document.addEventListener('change',e=>{
    const sel=e.target.closest('[data-frame-duration]'); if(!sel) return;
    const idx=+sel.dataset.frameDuration;
    const card=sel.closest('[data-frame-card]');
    const base=Number(card?.dataset?.basePrice||20);
    const price=durationPrice(base,sel.value);
    const lab=q(`[data-price-label="${idx}"]`); if(lab) lab.textContent=price+' Linkwuans';
  });
  function openFrameConfirm(idx){
    const item=(window.__dlinkyVisibleFrames||[])[idx]; if(!item) return;
    const card=q(`[data-frame-card="${idx}"]`);
    const duration=q(`[data-frame-duration="${idx}"]`)?.value||'3 dias';
    const base=Number(card?.dataset?.basePrice||parsePrice(item[1]));
    const price=durationPrice(base,duration);
    const modal=q('#frameBuyModal'); if(!modal) return;
    q('#frameBuyName').textContent=item[0];
    q('#frameBuyDuration').textContent=duration;
    q('#frameBuyPrice').textContent=price+' Linkwuans';
    q('#frameBuyType').textContent=duration==='Permanente'?'Permanente':'Normal';
    q('#frameBuyUser').textContent=user.name||'Usuário';
    q('#frameBuyImg').src=item[5]||'';
    q('#frameBuyAvatar').style.backgroundImage=user.avatar?`url("${user.avatar}")`:'';
    modal.dataset.idx=idx; modal.dataset.duration=duration; modal.dataset.price=price; modal.classList.add('show');
  }
  function buySelectedFrame(){
    const modal=q('#frameBuyModal'); const idx=+modal.dataset.idx; const item=(window.__dlinkyVisibleFrames||[])[idx]; if(!item) return;
    const price=Number(modal.dataset.price||0); const duration=modal.dataset.duration||'3 dias';
    user.coins=user.coins||0; user.inventory=user.inventory||[]; user.purchases=user.purchases||[];
    if(user.coins < price){
      modal.classList.remove('show');
      if(typeof toast==='function') toast('Saldo insuficiente em Linkwuans.');
      return;
    }
    user.coins-=price;
    user.inventory.unshift({type:'frames',name:item[0],value:'custom-frame',url:item[5],duration,price:price+' Linkwuans',date:Date.now()});
    user.frame=item[5];
    user.purchases.unshift({id:Date.now(),method:'Linkwuans',status:'Aprovado',value:price+' Linkwuans',date:new Date().toLocaleDateString('pt-BR')});
    localStorage.setItem('dlinkyUser',JSON.stringify(user));
    modal.classList.remove('show'); updateWallet();
    if(typeof renderDash==='function') renderDash();
    if(typeof toast==='function') toast('Moldura comprada e aplicada!');
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-confirm-frame]');
    if(b){ e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); openFrameConfirm(+b.dataset.confirmFrame); return; }
    if(e.target.closest('#closeFrameBuy')) q('#frameBuyModal')?.classList.remove('show');
    if(e.target.closest('#cancelFrameBuy')) q('#frameBuyModal')?.classList.remove('show');
    if(e.target.closest('#confirmFrameBuy')) buySelectedFrame();
  });
})();


/* ===== Ajustes finais: preview real no inventário + presentes por email ===== */
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  function save(){localStorage.setItem('dlinkyUser',JSON.stringify(user));}
  window.__dlinkyReceiveGifts=function(){
    try{
      if(!user || !user.email) return;
      const email=(user.email||'').toLowerCase().trim();
      const gifts=JSON.parse(localStorage.getItem('dlinkyAdminGifts')||'[]');
      let changed=false;
      user.inventory=user.inventory||[];
      gifts.forEach(g=>{
        if(!g.received && (g.email||'').toLowerCase().trim()===email){
          user.inventory.unshift({type:'frames',name:g.name||'Presente Dlinky',value:'custom-gift',url:g.url||'',duration:'Presente',price:'0 Linkwuans',gift:true,date:Date.now()});
          if(g.url){user.frame=g.url; user.decoration='none';}
          g.received=true; changed=true;
        }
      });
      if(changed){localStorage.setItem('dlinkyAdminGifts',JSON.stringify(gifts)); save();}
    }catch(e){}
  };
  const rd=window.renderDash||renderDash;
  window.renderDash=renderDash=function(){ window.__dlinkyReceiveGifts(); rd(); };
  const rp=window.renderProfile||renderProfile;
  window.renderProfile=renderProfile=function(){ rp(); const img=q('#profileFrame'); const deco=q('#avatarDecoration'); if(user.frame && img){ img.src=user.frame; img.style.display='block'; deco?.classList.add('has-img-frame'); } };
})();

/* ===== Ajuste pedido: loja molduras + inventário sem duplicar + presente estilo Zyo + upload real ===== */
(function(){
  const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  const getFrames=()=>{try{return JSON.parse(localStorage.getItem('dlinkyCustomFrames')||'[]')}catch{return []}};
  const setFrames=v=>localStorage.setItem('dlinkyCustomFrames',JSON.stringify(v));
  const getGifts=()=>{try{return JSON.parse(localStorage.getItem('dlinkyAdminGifts')||'[]')}catch{return []}};
  const setGifts=v=>localStorage.setItem('dlinkyAdminGifts',JSON.stringify(v));
  const num=v=>{const m=String(v||'').match(/\d+/);return m?Number(m[0]):20};
  function priceFor(frame,dur){
    const base=num(frame.price);
    if(frame.prices && frame.prices[dur]!=null) return Number(frame.prices[dur]);
    if(dur==='Permanente') return base*2;
    if(dur==='15 dias') return base*3;
    if(dur==='7 dias') return base*2;
    return base;
  }
  function normalizeInventory(){
    user.inventory=user.inventory||[];
    const seen=new Set();
    user.inventory=user.inventory.filter(it=>{
      const key=[it.url||it.value||'',it.name||'',it.duration||''].join('|');
      if(seen.has(key)) return false; seen.add(key); return true;
    });
  }
  function userTargetMatches(g){
    const email=(user.email||'').toLowerCase().trim();
    const slug=(user.slug||'').toLowerCase().trim();
    const ge=(g.email||'').toLowerCase().trim().replace(/^@/,'');
    const gs=(g.slug||'').toLowerCase().trim().replace(/^@/,'');
    return (!!email && (ge===email || gs===email)) || (!!slug && (ge===slug || gs===slug));
  }
  window.__dlinkyReceiveGifts=function(){
    try{
      const arr=getGifts(); let changed=false; user.inventory=user.inventory||[];
      arr.forEach(g=>{
        if(!g.received && userTargetMatches(g)){
          user.inventory.unshift({type:'frames',name:g.name||'Presente Dlinky',value:'custom-gift',url:g.url||'',duration:g.duration||'Presente',price:'0 Linkwuans',gift:true,message:g.message||'',date:Date.now()});
          g.received=true; changed=true;
        }
      });
      normalizeInventory();
      if(changed){ setGifts(arr); localStorage.setItem('dlinkyUser',JSON.stringify(user)); }
    }catch(e){}
  };
  window.renderInventory=function(){
    const g=q('#inventoryGrid'); if(!g)return; window.__dlinkyReceiveGifts(); normalizeInventory();
    const av=esc(user.avatar||'');
    const items=user.inventory||[];
    q('#invItemsCount')&&(q('#invItemsCount').textContent=items.length);
    q('#invCoins')&&(q('#invCoins').textContent=user.coins||0);
    g.innerHTML=items.length?items.map((it,i)=>{
      const isFrame=it.url||String(it.type||'').includes('frame');
      return `<div class="asset-card inv-item-card"><div class="asset-preview shop-preview inv-preview">${isFrame?`<span class="inv-avatar-preview zyo-person-demo" style="background-image:url('${av}')!important"></span><img class="inv-frame-preview" src="${esc(it.url||'')}" alt="${esc(it.name||'moldura')}">`:'✦'}</div><div class="asset-body"><b>${esc(it.name||'Item')}</b><small>${esc(it.gift?'Presente':(it.duration||it.type||'item'))}</small>${it.message?`<small>“${esc(it.message)}”</small>`:''}<button class="btn primary small" data-use-inv="${i}">Usar</button></div></div>`
    }).join(''):'<p>Você ainda não possui itens no inventário.</p>';
    localStorage.setItem('dlinkyUser',JSON.stringify(user));
  };
  function refreshGiftSelect(){
    const sel=q('#giftItemSelect'); if(!sel)return;
    const fs=getFrames(); sel.innerHTML='<option value="">Selecione uma moldura da loja</option>'+fs.map((f,i)=>`<option value="${i}">${esc(f.name||'Moldura')} — ${esc(f.price||'20 Linkwuans')}</option>`).join('');
  }
  const oldRenderAdminList=window.renderAdminList;
  window.renderAdminList=function(){ if(oldRenderAdminList) oldRenderAdminList(); refreshGiftSelect(); };
  window.renderShop=function(){
    const grid=q('#shopGrid'); if(!grid)return;
    if(typeof shopMode==='undefined') window.shopMode='frames';
    if(shopMode==='frames'){
      const fs=getFrames();
      grid.classList.add('frames-shop-grid');
      if(!fs.length){grid.innerHTML='<div class="panel empty-frames-help"><h2>Nenhuma moldura cadastrada</h2><p>Adicione suas molduras pelo Admin usando o caminho do arquivo em assets/molduras/.</p></div>'; window.__dlinkyVisibleFrames=[]; return;}
      window.__dlinkyVisibleFrames=fs.map((f,i)=>[f.name||'Moldura personalizada',f.price||'20 Linkwuans','custom-'+i,f.desc||'Moldura custom','Disponível',f.url||'',f.prices||null]);
      grid.innerHTML=fs.map((f,i)=>{
        const av=esc(user.avatar||''); const p3=priceFor(f,'3 dias');
        return `<div class="frame-shop-card premium-frame custom-only-frame" data-frame-card="${i}" data-base-price="${num(f.price)}">
          <div class="frame-shop-preview real-frame-preview"><div class="frame-avatar-demo zyo-person-demo" style="background-image:url('${av}')!important"></div><img class="frame-img big" src="${esc(f.url||'')}" alt="${esc(f.name||'Moldura')}"></div>
          <div class="frame-info clean-info"><b>${esc(f.name||'Moldura personalizada')}<span class="frame-url-chip">custom</span></b><small>${esc(f.desc||'Moldura custom')}</small></div>
          <div class="frame-stock available"><span></span><b>Disponível</b></div>
          <div class="frame-price">Preço do item: <b data-price-label="${i}">${p3} Linkwuans</b></div>
          <select class="frame-duration" data-frame-duration="${i}"><option>3 dias</option><option>7 dias</option><option>15 dias</option><option>Permanente</option></select>
          <small class="frame-note">ⓘ Valor muda conforme a duração escolhida.</small>
          <div class="frame-actions"><button class="btn primary small" data-confirm-frame="${i}">▣ Comprar</button><button class="btn dark small" data-gift-frame="${i}">🎁 Presentear</button></div>
        </div>`;
      }).join('');
      return;
    }
    grid.classList.remove('frames-shop-grid');
    if(typeof shopData!=='undefined' && shopData[shopMode]) grid.innerHTML=shopData[shopMode].map((x,i)=>`<div class="asset-card"><div class="asset-preview shop-preview">${shopMode==='coins'?'◈':'✦'}</div><div class="asset-body"><b>${x[0]}</b><small>${x[1]}</small><button class="btn primary small" data-buy-shop="${i}">Comprar</button></div></div>`).join('');
  };
  function updateDurationLabel(sel){
    const idx=Number(sel.dataset.frameDuration); const f=getFrames()[idx]; if(!f)return;
    const lab=q(`[data-price-label="${idx}"]`); if(lab) lab.textContent=priceFor(f,sel.value)+' Linkwuans';
  }
  function openGift(idx){
    const f=getFrames()[idx]; if(!f)return; const dur=q(`[data-frame-duration="${idx}"]`)?.value||'3 dias'; const p=priceFor(f,dur);
    const m=q('#giftFrameModal'); if(!m)return; m.dataset.idx=idx; m.dataset.duration=dur; m.dataset.price=p;
    q('#giftFrameName').textContent=f.name||'Moldura'; q('#giftFrameDuration').textContent=dur; q('#giftFrameType').textContent=dur==='Permanente'?'Permanente':'Normal'; q('#giftFramePrice').textContent=p+' Linkwuans';
    q('#giftFrameTarget').value=''; q('#giftFrameMsg').value=''; q('#giftCount').textContent='0/100'; m.classList.add('show');
  }
  function sendGiftFromModal(){
    const m=q('#giftFrameModal'); const idx=Number(m.dataset.idx); const f=getFrames()[idx]; if(!f)return;
    const target=q('#giftFrameTarget').value.trim().toLowerCase(); if(!target){toast('Digite o slug ou email do destinatário.');return;}
    const own=[(user.email||'').toLowerCase(), '@'+(user.slug||'').toLowerCase(), (user.slug||'').toLowerCase()]; if(own.includes(target)){toast('Não dá para presentear você mesmo.');return;}
    const price=Number(m.dataset.price||0); user.coins=user.coins||0; if(user.coins<price){toast('Saldo insuficiente em Linkwuans.');return;}
    user.coins-=price;
    const arr=getGifts(); arr.unshift({email:target.replace(/^@/,''),slug:target.replace(/^@/,''),name:f.name||'Moldura',url:f.url||'',duration:m.dataset.duration||'3 dias',message:q('#giftFrameMsg').value||'',received:false,date:new Date().toISOString()}); setGifts(arr);
    localStorage.setItem('dlinkyUser',JSON.stringify(user)); m.classList.remove('show'); if(renderDash)renderDash(); toast('Presente enviado!');
  }
  // abrir arquivos locais nos Ativos e transformar em data URL para prévia funcionando
  function setupDrop(inputId, kind){
    const input=q('#'+inputId); if(!input)return; const drop=input.parentElement?.querySelector('.drop'); if(!drop)return;
    let file=document.createElement('input'); file.type='file'; file.style.display='none';
    if(kind==='avatar') file.accept='image/png,image/jpeg,image/gif,image/webp';
    if(kind==='bg') file.accept='image/png,image/jpeg,image/gif,image/webp,video/mp4,video/webm';
    if(kind==='cursor') file.accept='image/png,.cur';
    if(kind==='music') file.accept='audio/mpeg,audio/ogg,audio/wav';
    drop.appendChild(file);
    const read=f=>{ if(!f)return; const r=new FileReader(); r.onload=()=>{input.value=r.result; drop.classList.add('loaded'); drop.textContent='✓ Arquivo carregado';}; r.readAsDataURL(f); };
    drop.onclick=()=>file.click(); file.onchange=()=>read(file.files[0]);
    drop.ondragover=e=>{e.preventDefault();drop.classList.add('hover')}; drop.ondragleave=()=>drop.classList.remove('hover'); drop.ondrop=e=>{e.preventDefault();drop.classList.remove('hover');read(e.dataTransfer.files[0])};
  }
  setupDrop('uploadAvatar','avatar');setupDrop('uploadBg','bg');setupDrop('uploadCursor','cursor');setupDrop('uploadMusic','music');
  // eventos finais em captura para sobrescrever os antigos só no necessário
  document.addEventListener('change',e=>{const sel=e.target.closest('[data-frame-duration]'); if(sel){updateDurationLabel(sel);}});
  document.addEventListener('click',e=>{
    const gift=e.target.closest('[data-gift-frame]'); if(gift){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openGift(Number(gift.dataset.giftFrame));return;}
    if(e.target.closest('#closeGiftFrame')||e.target.closest('#cancelGiftFrame')) q('#giftFrameModal')?.classList.remove('show');
    if(e.target.closest('#verifyGiftTarget')){e.preventDefault();toast(q('#giftFrameTarget').value?'Destinatário preenchido.':'Digite um slug ou email.');}
    if(e.target.closest('#confirmGiftFrame')){e.preventDefault();sendGiftFromModal();}
  });
  q('#giftFrameMsg')?.addEventListener('input',()=>{q('#giftCount').textContent=(q('#giftFrameMsg').value.length||0)+'/100'});
  const originalOpenTab=window.openTab;
  window.openTab=function(id){ if(originalOpenTab) originalOpenTab(id); if(id==='inventory')renderInventory(); if(id==='shop')renderShop(); if(id==='admin')refreshGiftSelect(); };
  const originalRenderDash=window.renderDash;
  window.renderDash=function(){ if(originalRenderDash) originalRenderDash(); normalizeInventory(); refreshGiftSelect(); };
})();


/* =========================================================
   PATCH FINAL: somente ajustes pedidos, sem mexer no visual base
   - link público estilo dlinky/slug via #/slug
   - visitante não vê "Voltar ao painel"
   - moldura alinhada com avatar no perfil público
   - landing: contador animado, perfis destaque/carrossel e cards de recursos
   - admin: escolher destaques da landing
========================================================= */
(function(){
  const q=s=>document.querySelector(s), qa=s=>Array.from(document.querySelectorAll(s));
  const esc=s=>String(s??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));
  function getUser(){try{return JSON.parse(localStorage.getItem('dlinkyUser')||'{}')}catch(e){return {}}}
  function saveUser(u){try{localStorage.setItem('dlinkyUser',JSON.stringify(u)); if(window.user) Object.assign(window.user,u);}catch(e){}}
  function defaultFeatured(){
    const u=getUser();
    return [
      {name:u.name||'linkroubadao',slug:u.slug||'linkroubadao',avatar:u.avatar||''},
      {name:'mah',slug:'maryanarodz',avatar:'https://i.pinimg.com/736x/0e/88/16/0e8816a19a2c79b344baf04f093bd1fd.jpg'},
      {name:'ferreiraf0v',slug:'ferreiraf0v',avatar:''},
      {name:'RussaO',slug:'russao',avatar:''},
      {name:'yoshino',slug:'yoshino',avatar:''}
    ];
  }
  function getFeatured(){
    try{const arr=JSON.parse(localStorage.getItem('dlinkyFeaturedUsers')||'null'); if(Array.isArray(arr)&&arr.length)return arr;}catch(e){}
    return defaultFeatured();
  }
  function setFeatured(arr){localStorage.setItem('dlinkyFeaturedUsers',JSON.stringify(arr));}
  function normalizeAvatar(v){return v?`style="background-image:url('${esc(v)}')"`:''}
  function renderLandingExtras(){
    const landing=q('#landing'); if(!landing)return;
    // Contadores animados mantendo o layout original
    const stats=qa('#landing .stats strong');
    const targets=[10000,13110,46870];
    const labels=['10.00k','13.11k','46.87k'];
    stats.forEach((el,i)=>{
      let start=0, target=targets[i]||0, t0=performance.now();
      function tick(now){
        const p=Math.min(1,(now-t0)/1200); const val=start+(target-start)*(1-Math.pow(1-p,3));
        el.textContent=p>=1?labels[i]:((val/1000).toFixed(2)+'k');
        if(p<1)requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
    const marquee=q('#landing .user-marquee');
    if(marquee){
      const arr=getFeatured();
      marquee.classList.add('featured-carousel');
      marquee.innerHTML='<div class="featured-track">'+arr.concat(arr).map(p=>`<a class="featured-user" href="#/${esc(p.slug||'perfil')}"><span class="featured-avatar" ${normalizeAvatar(p.avatar)}></span><b>${esc(p.name||'Usuário')}</b><small>/${esc(p.slug||'perfil')}</small></a>`).join('')+'</div>';
    }
    // seção antiga quebrada removida para manter layout limpo estilo Zyo
  }
  function isProfileHash(){const h=location.hash||'#/'; const u=getUser(); return h==='#/profile'||(u.slug&&h==='#/'+u.slug)||(/^#\/[a-z0-9_.-]+$/i.test(h)&&!['#/register','#/login','#/dashboard','#/assets','#/premium','#/community'].includes(h));}
  const oldRoute=window.route||route;
  window.route=route=function(){
    const h=location.hash||'#/';
    if(isProfileHash()){
      qa('.page').forEach(p=>p.classList.remove('active'));
      q('#profile')?.classList.add('active');
      if(typeof renderProfile==='function') renderProfile();
      const back=q('#backToDash'); if(back) back.style.display=(h==='#/profile')?'block':'none';
      document.body.classList.toggle('public-profile',h!=='#/profile');
      return;
    }
    if(oldRoute) oldRoute();
    document.body.classList.remove('public-profile');
    if(h==='#/'||h==='#') setTimeout(renderLandingExtras,0);
  };
  window.addEventListener('hashchange',window.route);
  document.addEventListener('DOMContentLoaded',()=>setTimeout(renderLandingExtras,0));
  setTimeout(renderLandingExtras,0);

  // Corrige alinhamento da moldura no perfil sem mudar outras áreas
  const oldRenderProfile=window.renderProfile||renderProfile;
  window.renderProfile=renderProfile=function(){
    if(oldRenderProfile) oldRenderProfile();
    const u=getUser();
    const frame=q('#profileFrame');
    if(frame && (u.frame||frame.getAttribute('src'))){
      frame.src=u.frame||frame.getAttribute('src');
      frame.style.display='block';
      q('#avatarDecoration')?.classList.add('frame-perfect-fit');
    }
    const back=q('#backToDash'); if(back) back.style.display=((location.hash||'')==='#/profile')?'block':'none';
  };

  // Admin para escolher perfis em destaque na home, sem alterar o restante
  function ensureFeaturedAdmin(){
    const admin=q('#tab-admin'); if(!admin || q('#adminFeaturedBox'))return;
    const box=document.createElement('div'); box.className='panel form-panel'; box.id='adminFeaturedBox';
    box.innerHTML=`<h2>Destaques da página inicial</h2><p>Coloque um por linha no formato: nome | slug | url-da-foto</p><textarea id="adminFeaturedText" placeholder="mah | maryanarodz | https://site.com/foto.png"></textarea><button class="btn primary" id="saveFeaturedUsers">Salvar destaques</button>`;
    admin.appendChild(box);
    const text=q('#adminFeaturedText');
    text.value=getFeatured().map(x=>`${x.name||''} | ${x.slug||''} | ${x.avatar||''}`).join('\n');
    q('#saveFeaturedUsers').onclick=()=>{
      const arr=text.value.split(/\n+/).map(line=>{const [name,slug,avatar]=line.split('|').map(s=>(s||'').trim()); return name&&slug?{name,slug:slug.replace(/^@|^\//,''),avatar}:null}).filter(Boolean);
      setFeatured(arr.length?arr:defaultFeatured()); renderLandingExtras(); if(typeof toast==='function')toast('Destaques salvos!');
    };
  }
  const oldOpenTab=window.openTab;
  window.openTab=function(id){ if(oldOpenTab)oldOpenTab(id); if(id==='admin')setTimeout(ensureFeaturedAdmin,0); };
  const oldRenderDash=window.renderDash;
  window.renderDash=function(){ if(oldRenderDash)oldRenderDash(); setTimeout(ensureFeaturedAdmin,0); };
})();


/* === PATCH SEGURO: só ícones sociais + moldura alinhada === */
(function(){
  const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const platformIcons={Instagram:'fa-brands fa-instagram',TikTok:'fa-brands fa-tiktok',Discord:'fa-brands fa-discord',YouTube:'fa-brands fa-youtube',Spotify:'fa-brands fa-spotify',WhatsApp:'fa-brands fa-whatsapp',Twitch:'fa-brands fa-twitch',Steam:'fa-brands fa-steam',Github:'fa-brands fa-github',Roblox:'fa-solid fa-square',Telegram:'fa-brands fa-telegram',X:'fa-brands fa-x-twitter'};
  function save(){try{localStorage.setItem('dlinkyUser',JSON.stringify(user));}catch(e){}}
  window.renderSocialEditor=function(){
    const box=q('#socialEditor'); if(!box)return;
    user.socials=user.socials&&user.socials.length?user.socials:[{name:'Instagram',url:'https://instagram.com/',on:true},{name:'TikTok',url:'https://tiktok.com/',on:true},{name:'Discord',url:'https://discord.com/',on:true}];
    box.innerHTML=user.socials.map((s,i)=>`<div class="social-row"><select data-social-name="${i}">${Object.keys(platformIcons).map(n=>`<option ${n===s.name?'selected':''}>${n}</option>`).join('')}</select><input data-social-url="${i}" value="${String(s.url||'').replace(/"/g,'&quot;')}" placeholder="https://"><label class="check"><input type="checkbox" data-social-on="${i}" ${s.on?'checked':''}> Ativo</label><button class="delete" data-del-social="${i}">×</button></div>`).join('');
  };
  const add=q('#addSocial'); if(add){add.onclick=()=>{user.socials=user.socials||[];user.socials.push({name:'Instagram',url:'https://instagram.com/',on:true});window.renderSocialEditor();};}
  const editor=q('#socialEditor'); if(editor){editor.onclick=e=>{if(e.target.dataset.delSocial!==undefined){user.socials.splice(+e.target.dataset.delSocial,1);window.renderSocialEditor();save();}};}
  const saveBtn=q('#saveSocials'); if(saveBtn){saveBtn.onclick=()=>{user.socials=qa('.social-row').map(r=>({name:q('[data-social-name]',r).value,url:q('[data-social-url]',r).value,on:q('[data-social-on]',r).checked}));addHistory&&addHistory('Ícones sociais alterados');saveUser?saveUser():save();};}
  const oldRP=window.renderProfile;
  window.renderProfile=function(){
    if(oldRP)oldRP();
    const deco=q('#avatarDecoration'), av=q('#profileAvatar'), frame=q('#profileFrame');
    if(deco){deco.classList.toggle('has-img-frame',!!(user&&user.frame));deco.classList.add('frame-final-fit');}
    if(frame){frame.style.display=user&&user.frame?'block':'none'; if(user&&user.frame) frame.src=user.frame;}
    const socials=q('#profileSocials');
    if(socials){
      socials.innerHTML=(user.socials||[]).filter(s=>s.on).map(s=>`<a class="social-icon brand-${String(s.name||'link').toLowerCase().replace(/[^a-z0-9]/g,'')}" target="_blank" title="${s.name}" href="${safeUrl(s.url)}"><i class="${platformIcons[s.name]||'fa-solid fa-link'}"></i></a>`).join('');
    }
  };
  // melhora preview da compra sem alterar fluxo
  document.addEventListener('click',()=>setTimeout(()=>{
    const av=q('#frameBuyAvatar'), img=q('#frameBuyImg');
    if(av&&user&&user.avatar) av.style.backgroundImage=`url("${user.avatar}")`;
    if(img&&user&&img.src) img.style.display='block';
  },40),true);
})();

/* PATCH FINAL SOMENTE: força a moldura centralizada no avatar depois de renderizar */
(function(){
  const old=window.renderProfile;
  window.renderProfile=function(){
    if(old) old();
    setTimeout(()=>{
      const deco=document.getElementById('avatarDecoration');
      const frame=document.getElementById('profileFrame');
      const av=document.getElementById('profileAvatar');
      if(deco){deco.classList.add('frame-final-fit','has-img-frame');}
      if(av){Object.assign(av.style,{position:'absolute',left:'50%',top:'50%',width:'82px',height:'82px',margin:'0',transform:'translate(-50%,-50%)',zIndex:'2'});}
      if(frame){
        frame.style.cssText += ';position:absolute!important;left:50%!important;top:50%!important;right:auto!important;bottom:auto!important;width:118px!important;height:118px!important;margin:0!important;padding:0!important;transform:translate(-50%,-50%)!important;object-fit:contain!important;object-position:center!important;z-index:5!important;pointer-events:none!important;';
      }
    },0);
  };
})();


/* =========================================================
   DLINKY — CORREÇÃO SOMENTE MOLDURAS (PARTE 1)
   Foco: ajuste salvo no inventário aparecer IGUAL no perfil.
   - Sem duplicar inventário
   - activeFrameId salvo ao clicar Usar
   - Ao salvar ajuste, também ativa a moldura editada
   - frameAdjustments[frameId] = {x,y,scale,rotate}
   ========================================================= */
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const norm=v=>String(v||'').trim().replace(/^url\(["']?|["']?\)$/g,'').replace(/\\/g,'/').split('?')[0].toLowerCase();
  const emptyAdj=()=>({x:0,y:0,scale:1,rotate:0});
  let editingFrameId='';
  let dragging=false,startX=0,startY=0,oldX=0,oldY=0;

  function persist(){ try{ localStorage.setItem('dlinkyUser',JSON.stringify(user)); }catch(e){} }
  function cleanAdj(a){ return {x:Number(a?.x)||0,y:Number(a?.y)||0,scale:Number(a?.scale)||1,rotate:Number(a?.rotate)||0}; }
  function isFrame(it){ return !!(it && (it.url || String(it.type||'').toLowerCase().includes('frame') || String(it.name||'').toLowerCase().includes('moldura'))); }
  function makeFrameId(it){
    if(!it) return '';
    if(it.id) return String(it.id);
    const base=(norm(it.url)||String(it.name||'moldura')).replace(/[^a-z0-9_-]+/g,'-').replace(/^-+|-+$/g,'');
    return 'frame_'+(base||Date.now()).slice(-70);
  }

  function ensureFrameState(){
    user.inventory=Array.isArray(user.inventory)?user.inventory:[];
    user.frameAdjustments=user.frameAdjustments||{};
    user.frameAdjust=user.frameAdjust||{};

    const seen=new Set();
    user.inventory=user.inventory.filter(it=>{
      if(!it) return false;
      if(isFrame(it)){
        it.id=makeFrameId(it);
        const key='frame|'+(norm(it.url)||it.id);
        if(seen.has(key)) return false;
        seen.add(key);

        // migra ajustes antigos por URL para o ID único
        const old=user.frameAdjustments[it.id] || user.frameAdjustments[it.url] || user.frameAdjustments[norm(it.url)] || user.frameAdjust[it.url] || user.frameAdjust[norm(it.url)];
        if(old) user.frameAdjustments[it.id]=cleanAdj(old);
        return true;
      }
      const key='item|'+String(it.id||it.name||'').toLowerCase()+'|'+String(it.type||'').toLowerCase();
      if(seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if(user.frame){
      const active=user.inventory.find(it=>isFrame(it) && norm(it.url)===norm(user.frame));
      if(active && !user.activeFrameId) user.activeFrameId=active.id;
    }
    q('#invItemsCount') && (q('#invItemsCount').textContent=user.inventory.length);
    q('#invCountMini') && (q('#invCountMini').textContent=user.inventory.length);
    persist();
  }

  function getFrame(frameId){
    ensureFrameState();
    return user.inventory.find(it=>isFrame(it) && it.id===frameId)
      || user.inventory.find(it=>isFrame(it) && norm(it.url)===norm(user.frame));
  }
  function getAdj(frameId){
    const it=getFrame(frameId);
    return cleanAdj(user.frameAdjustments?.[frameId] || user.frameAdjustments?.[it?.id] || emptyAdj());
  }
  function setFrameTransform(el,adj){
    if(!el) return;
    adj=cleanAdj(adj);
    el.style.setProperty('--frame-x',adj.x+'px');
    el.style.setProperty('--frame-y',adj.y+'px');
    el.style.setProperty('--frame-scale',adj.scale);
    el.style.setProperty('--frame-rotate',adj.rotate+'deg');
    el.classList.add('dlinky-saved-frame');
  }
  function readControls(){
    return cleanAdj({
      x:q('#adjustX')?.value,
      y:q('#adjustY')?.value,
      scale:Number(q('#adjustScale')?.value||100)/100,
      rotate:q('#adjustRotate')?.value
    });
  }
  function fillControls(adj){
    adj=cleanAdj(adj);
    if(q('#adjustX')) q('#adjustX').value=adj.x;
    if(q('#adjustY')) q('#adjustY').value=adj.y;
    if(q('#adjustScale')) q('#adjustScale').value=Math.round(adj.scale*100);
    if(q('#adjustRotate')) q('#adjustRotate').value=adj.rotate;
  }
  function updateModalPreview(){
    const av=q('#adjustAvatar');
    if(av) av.style.backgroundImage=user.avatar?`url("${user.avatar}")`:'';
    setFrameTransform(q('#adjustFrame'),readControls());
  }

  function renderInventoryCard(it){
    const frame=isFrame(it);
    if(frame) it.id=makeFrameId(it);
    const active=frame && user.activeFrameId===it.id;
    const adj=frame?getAdj(it.id):emptyAdj();
    const style=`--frame-x:${adj.x}px;--frame-y:${adj.y}px;--frame-scale:${adj.scale};--frame-rotate:${adj.rotate}deg;`;
    return `<div class="asset-card inv-item-card">
      <div class="asset-preview shop-preview inv-preview">
        ${frame?`<span class="inv-avatar-preview zyo-person-demo" style="background-image:url('${esc(user.avatar||'')}')!important"></span><img class="inv-frame-preview dlinky-saved-frame" style="${style}" src="${esc(it.url||'')}" alt="${esc(it.name||'moldura')}">`:'✦'}
      </div>
      <div class="asset-body">
        <b>${esc(it.name||'Item')}</b>
        <small>${esc(it.duration||it.type||'item')}</small>
        <div class="inv-actions-row">
          ${frame?`<button class="btn primary small" data-dlinky-use-frame="${esc(it.id)}">${active?'Usando':'Usar'}</button><button class="btn adjust-frame-btn small" data-dlinky-adjust-frame="${esc(it.id)}">Ajustar</button>`:`<button class="btn primary small">Usar</button>`}
        </div>
      </div>
    </div>`;
  }

  window.renderInventory=renderInventory=function(){
    ensureFrameState();
    const grid=q('#inventoryGrid');
    if(!grid) return;
    grid.innerHTML=user.inventory.length?user.inventory.map(renderInventoryCard).join(''):'<p>Você ainda não possui itens no inventário.</p>';
  };

  window.useFrame=function(frameId){
    const it=getFrame(frameId);
    if(!it || !it.url) return;
    user.activeFrameId=it.id;
    user.frame=it.url;
    user.decoration='none';
    persist();
    renderInventory();
    applyFrameToPublicProfile();
    if(typeof toast==='function') toast('Moldura aplicada!');
  };

  window.openFrameAdjustModal=function(frameId){
    const it=getFrame(frameId);
    if(!it || !it.url) return;
    editingFrameId=it.id;
    const modal=q('#frameAdjustModal');
    const frame=q('#adjustFrame');
    if(!modal || !frame) return;
    frame.src=it.url;
    fillControls(getAdj(it.id));
    updateModalPreview();
    modal.classList.add('show');
  };

  window.saveFrameAdjustment=function(){
    if(!editingFrameId) return;
    const it=getFrame(editingFrameId);
    if(!it || !it.url) return;
    const adj=readControls();
    user.frameAdjustments=user.frameAdjustments||{};
    user.frameAdjustments[it.id]=adj;
    // compatibilidade com códigos antigos que procuravam por URL
    user.frameAdjust=user.frameAdjust||{};
    user.frameAdjust[it.url]=adj;
    user.frameAdjust[norm(it.url)]=adj;

    // IMPORTANTE: salvar ajuste também deixa ESSA moldura como ativa,
    // então ao clicar em Ver Perfil aparece exatamente a que acabou de ajustar.
    user.activeFrameId=it.id;
    user.frame=it.url;
    user.decoration='none';

    persist();
    q('#frameAdjustModal')?.classList.remove('show');
    renderInventory();
    applyFrameToPublicProfile();
    if(typeof toast==='function') toast('Ajuste salvo e aplicado!');
  };

  function applyFrameToPublicProfile(){
    ensureFrameState();
    const it=getFrame(user.activeFrameId);
    const img=q('#profileFrame');
    const wrap=q('#avatarDecoration');
    const av=q('#profileAvatar');
    if(!img || !wrap || !it || !it.url) return;
    user.frame=it.url;
    img.src=it.url;
    img.style.display='block';
    wrap.classList.add('has-img-frame','frame-final-fit','dlinky-profile-frame-lock');
    if(av) av.classList.add('dlinky-profile-avatar-lock');
    setFrameTransform(img,getAdj(it.id));
  }

  const oldProfile=window.renderProfile||renderProfile;
  window.renderProfile=renderProfile=function(){
    if(oldProfile) oldProfile();
    // alguns trechos antigos mexem no avatar após renderizar; aplica de novo.
    setTimeout(applyFrameToPublicProfile,0);
    setTimeout(applyFrameToPublicProfile,120);
    setTimeout(applyFrameToPublicProfile,350);
  };

  document.addEventListener('click',function(e){
    const use=e.target.closest?.('[data-dlinky-use-frame]');
    if(use){ e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); window.useFrame(use.dataset.dlinkyUseFrame); return; }
    const adj=e.target.closest?.('[data-dlinky-adjust-frame]');
    if(adj){ e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); window.openFrameAdjustModal(adj.dataset.dlinkyAdjustFrame); return; }
    if(e.target.closest?.('#saveFrameAdjust')){ e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); window.saveFrameAdjustment(); return; }
    if(e.target.closest?.('#resetFrameAdjust')){ e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); fillControls(emptyAdj()); updateModalPreview(); return; }
    if(e.target.closest?.('#closeFrameAdjust')){ e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); q('#frameAdjustModal')?.classList.remove('show'); return; }
  });

  document.addEventListener('input',function(e){
    if(['adjustX','adjustY','adjustScale','adjustRotate'].includes(e.target?.id)) updateModalPreview();
  });
  document.addEventListener('pointerdown',function(e){
    const box=e.target.closest?.('#adjustPreview');
    if(!box || !q('#frameAdjustModal')?.classList.contains('show')) return;
    dragging=true; startX=e.clientX; startY=e.clientY; oldX=Number(q('#adjustX')?.value||0); oldY=Number(q('#adjustY')?.value||0);
    box.setPointerCapture?.(e.pointerId);
  });
  document.addEventListener('pointermove',function(e){
    if(!dragging) return;
    if(q('#adjustX')) q('#adjustX').value=Math.max(-120,Math.min(120,oldX+e.clientX-startX));
    if(q('#adjustY')) q('#adjustY').value=Math.max(-120,Math.min(120,oldY+e.clientY-startY));
    updateModalPreview();
  });
  document.addEventListener('pointerup',()=>dragging=false,true);

  setTimeout(()=>{ ensureFrameState(); renderInventory(); applyFrameToPublicProfile(); },250);
})();

/* =========================================================
   DLINKY — FIX FINAL V3 SOMENTE MOLDURAS
   Garante que o mesmo x/y/scale/rotate salvo seja aplicado
   no modal, inventário e perfil público usando o MESMO tamanho base.
   ========================================================= */
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const norm=v=>String(v||'').trim().replace(/^url\(["']?|["']?\)$/g,'').replace(/\\/g,'/').split('?')[0].toLowerCase();
  const clean=a=>({x:Number(a&&a.x)||0,y:Number(a&&a.y)||0,scale:Number(a&&a.scale)||1,rotate:Number(a&&a.rotate)||0});
  const isFrame=it=>!!(it&&(it.url||String(it.type||'').toLowerCase().includes('frame')||String(it.name||'').toLowerCase().includes('moldura')));
  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function makeId(it){
    if(!it)return'';
    if(it.id)return String(it.id);
    const base=(norm(it.url)||String(it.name||'moldura')).replace(/[^a-z0-9_-]+/g,'-').replace(/^-+|-+$/g,'');
    return 'frame_'+(base||'item').slice(-70);
  }
  function save(){try{localStorage.setItem('dlinkyUser',JSON.stringify(user));}catch(e){}}
  function ensure(){
    user.inventory=Array.isArray(user.inventory)?user.inventory:[];
    user.frameAdjustments=user.frameAdjustments||{};
    user.frameAdjust=user.frameAdjust||{};
    const seen=new Set();
    user.inventory=user.inventory.filter(it=>{
      if(!it)return false;
      if(isFrame(it)){
        it.id=makeId(it);
        const key='frame|'+(norm(it.url)||it.id);
        if(seen.has(key))return false;
        seen.add(key);
        const old=user.frameAdjustments[it.id]||user.frameAdjustments[it.url]||user.frameAdjustments[norm(it.url)]||user.frameAdjust[it.url]||user.frameAdjust[norm(it.url)];
        if(old)user.frameAdjustments[it.id]=clean(old);
        return true;
      }
      const key='item|'+String(it.id||it.name||'').toLowerCase();
      if(seen.has(key))return false;
      seen.add(key);return true;
    });
    if(user.frame){
      const active=user.inventory.find(it=>isFrame(it)&&norm(it.url)===norm(user.frame));
      if(active)user.activeFrameId=active.id;
    }
    save();
  }
  function frameById(id){ensure();return user.inventory.find(it=>isFrame(it)&&it.id===id)||user.inventory.find(it=>isFrame(it)&&norm(it.url)===norm(user.frame));}
  function activeFrame(){return frameById(user.activeFrameId);}
  function adjFor(id){const it=frameById(id);return clean(user.frameAdjustments&&user.frameAdjustments[(it&&it.id)||id]);}
  function setVars(el,a){if(!el)return;a=clean(a);el.style.setProperty('--frame-x',a.x+'px');el.style.setProperty('--frame-y',a.y+'px');el.style.setProperty('--frame-scale',a.scale);el.style.setProperty('--frame-rotate',a.rotate+'deg');el.classList.add('dlinky-saved-frame');}
  function readControls(){return clean({x:q('#adjustX')&&q('#adjustX').value,y:q('#adjustY')&&q('#adjustY').value,scale:(Number(q('#adjustScale')&&q('#adjustScale').value||100)/100),rotate:q('#adjustRotate')&&q('#adjustRotate').value});}
  function fillControls(a){a=clean(a);if(q('#adjustX'))q('#adjustX').value=a.x;if(q('#adjustY'))q('#adjustY').value=a.y;if(q('#adjustScale'))q('#adjustScale').value=Math.round(a.scale*100);if(q('#adjustRotate'))q('#adjustRotate').value=a.rotate;}
  function updatePreview(){const av=q('#adjustAvatar');if(av)av.style.backgroundImage=user.avatar?`url("${user.avatar}")`:'';setVars(q('#adjustFrame'),readControls());}
  function applyProfile(){
    ensure();
    const it=activeFrame();
    const deco=q('#avatarDecoration'), av=q('#profileAvatar'), img=q('#profileFrame');
    if(!deco||!img)return;
    deco.classList.add('dlinky-frame-v3','has-img-frame','frame-final-fit');
    const __avClean=user.avatar||localStorage.getItem('dlinky_avatar_clean_'+(user.email||user.slug||'local'))||localStorage.getItem('dlinky_avatar_real_'+(user.email||user.slug||'local'))||'';
    if(av&&__avClean){
      if(av.tagName==='IMG'){
        av.src=__avClean;
        av.removeAttribute('srcset');
        av.style.objectFit='cover';
      }else{
        av.style.backgroundImage=`url("${__avClean}")`;
      }
      av.style.display='block';
      av.style.opacity='1';
      av.style.visibility='visible';
    }
    if(it&&it.url){
      user.frame=it.url; user.activeFrameId=it.id; user.decoration='none';
      img.src=it.url; img.style.display='block'; setVars(img,adjFor(it.id)); save();
    }else{img.style.display='none';}
  }
  function renderCard(it){
    const frame=isFrame(it); if(frame)it.id=makeId(it); const active=frame&&user.activeFrameId===it.id; const a=frame?adjFor(it.id):clean();
    const style=`--frame-x:${a.x}px;--frame-y:${a.y}px;--frame-scale:${a.scale};--frame-rotate:${a.rotate}deg;`;
    return `<div class="asset-card inv-item-card"><div class="asset-preview shop-preview inv-preview">${frame?`<span class="inv-avatar-preview zyo-person-demo" style="background-image:url('${esc(user.avatar||'')}')!important"></span><img class="inv-frame-preview dlinky-saved-frame" style="${style}" src="${esc(it.url||'')}" alt="${esc(it.name||'moldura')}">`:'✦'}</div><div class="asset-body"><b>${esc(it.name||'Item')}</b><small>${esc(it.duration||it.type||'item')}</small>${frame?`<div class="inv-actions-row"><button class="btn primary small" data-v3-use-frame="${esc(it.id)}">${active?'Usando':'Usar'}</button><button class="btn adjust-frame-btn small" data-v3-adjust-frame="${esc(it.id)}">Ajustar</button></div>`:''}</div></div>`;
  }
  window.renderInventory=function(){ensure();const g=q('#inventoryGrid');if(!g)return;g.innerHTML=user.inventory.length?user.inventory.map(renderCard).join(''):'<p>Você ainda não possui itens no inventário.</p>';};
  window.useFrame=function(id){const it=frameById(id);if(!it||!it.url)return;user.activeFrameId=it.id;user.frame=it.url;user.decoration='none';save();window.renderInventory();applyProfile();if(typeof toast==='function')toast('Moldura aplicada!');};
  window.openFrameAdjustModal=function(id){const it=frameById(id);if(!it||!it.url)return;window.__dlinkyEditingFrameId=it.id;const m=q('#frameAdjustModal'),img=q('#adjustFrame');if(!m||!img)return;img.src=it.url;fillControls(adjFor(it.id));updatePreview();m.classList.add('show');};
  window.saveFrameAdjustment=function(){const it=frameById(window.__dlinkyEditingFrameId);if(!it||!it.url)return;const a=readControls();user.frameAdjustments=user.frameAdjustments||{};user.frameAdjustments[it.id]=a;user.frameAdjust=user.frameAdjust||{};user.frameAdjust[it.url]=a;user.frameAdjust[norm(it.url)]=a;user.activeFrameId=it.id;user.frame=it.url;user.decoration='none';save();q('#frameAdjustModal')&&q('#frameAdjustModal').classList.remove('show');window.renderInventory();applyProfile();if(typeof toast==='function')toast('Ajuste salvo e aplicado!');};
  const oldRP=window.renderProfile;
  window.renderProfile=function(){if(oldRP)oldRP();setTimeout(applyProfile,0);setTimeout(applyProfile,80);setTimeout(applyProfile,250);setTimeout(applyProfile,700);};
  document.addEventListener('click',function(e){
    const u=e.target.closest&&e.target.closest('[data-v3-use-frame],[data-dlinky-use-frame]'); if(u){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();window.useFrame(u.dataset.v3UseFrame||u.dataset.dlinkyUseFrame);return;}
    const a=e.target.closest&&e.target.closest('[data-v3-adjust-frame],[data-dlinky-adjust-frame]'); if(a){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();window.openFrameAdjustModal(a.dataset.v3AdjustFrame||a.dataset.dlinkyAdjustFrame);return;}
    if(e.target.closest&&e.target.closest('#saveFrameAdjust')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();window.saveFrameAdjustment();return;}
    if(e.target.closest&&e.target.closest('#resetFrameAdjust')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();fillControls({x:0,y:0,scale:1,rotate:0});updatePreview();return;}
    if(e.target.closest&&e.target.closest('#closeFrameAdjust')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();q('#frameAdjustModal')&&q('#frameAdjustModal').classList.remove('show');return;}
  });
  document.addEventListener('input',function(e){if(['adjustX','adjustY','adjustScale','adjustRotate'].includes(e.target&&e.target.id))updatePreview();});
  // disabled old repeating frame interval to avoid GIF restart
  setTimeout(()=>{ensure();window.renderInventory();applyProfile();},200);
})();

/* =========================================================
   DLINKY V4 — FIX REAL SOMENTE MOLDURAS
   Motivo do bug anterior: o perfil usava CSS/base diferente do inventário
   e vários patches antigos mexiam no #profileFrame. Agora o perfil usa um
   palco novo próprio, igual ao inventário/modal: 150x150, avatar 96, frame 138.
   ========================================================= */
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const norm=v=>String(v||'').trim().replace(/^url\(["']?|["']?\)$/g,'').replace(/\\/g,'/').split('?')[0].toLowerCase();
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const isFrame=it=>!!(it&&(it.url||String(it.type||'').toLowerCase().includes('frame')||String(it.name||'').toLowerCase().includes('moldura')));
  const clean=a=>({x:Number(a&&a.x)||0,y:Number(a&&a.y)||0,scale:Number(a&&a.scale)||1,rotate:Number(a&&a.rotate)||0});
  function makeId(it){
    if(!it)return'';
    if(it.id)return String(it.id);
    const base=(norm(it.url)||String(it.name||'moldura')).replace(/[^a-z0-9_-]+/g,'-').replace(/^-+|-+$/g,'');
    return 'frame_'+(base||'item').slice(-80);
  }
  function save(){try{localStorage.setItem('dlinkyUser',JSON.stringify(user));}catch(e){}}
  function ensure(){
    user.inventory=Array.isArray(user.inventory)?user.inventory:[];
    user.frameAdjustments=user.frameAdjustments||{};
    user.frameAdjust=user.frameAdjust||{};
    const seen=new Set();
    user.inventory=user.inventory.filter(it=>{
      if(!it)return false;
      if(isFrame(it)){
        it.id=makeId(it);
        const key='frame|'+(norm(it.url)||it.id);
        if(seen.has(key))return false;
        seen.add(key);
        const old=user.frameAdjustments[it.id]||user.frameAdjustments[it.url]||user.frameAdjustments[norm(it.url)]||user.frameAdjust[it.url]||user.frameAdjust[norm(it.url)];
        if(old)user.frameAdjustments[it.id]=clean(old);
        return true;
      }
      const key='item|'+String(it.id||it.name||it.value||'').toLowerCase();
      if(seen.has(key))return false;
      seen.add(key);
      return true;
    });
    if(user.frame){
      const found=user.inventory.find(it=>isFrame(it)&&norm(it.url)===norm(user.frame));
      if(found)user.activeFrameId=found.id;
    }
    save();
  }
  function frameById(id){
    ensure();
    return user.inventory.find(it=>isFrame(it)&&it.id===id)||user.inventory.find(it=>isFrame(it)&&norm(it.url)===norm(user.frame));
  }
  function activeFrame(){return frameById(user.activeFrameId)}
  function adjFor(id){const it=frameById(id);return clean(user.frameAdjustments?.[(it&&it.id)||id]);}
  function vars(a){a=clean(a);return `--frame-x:${a.x}px;--frame-y:${a.y}px;--frame-scale:${a.scale};--frame-rotate:${a.rotate}deg;`;}
  function setVars(el,a){if(!el)return;el.setAttribute('style',(el.getAttribute('style')||'')+';'+vars(a));}
  function avatarUrl(){return user.avatar||'';}
  function stageHtml(it,a,extra=''){
    return `<div class="dlinky-v4-stage ${extra}" style="${vars(a)}"><span class="dlinky-v4-avatar" style="background-image:url('${esc(avatarUrl())}')"></span><img class="dlinky-v4-frame" src="${esc(it.url||'')}" alt="${esc(it.name||'moldura')}"></div>`;
  }
  function readControls(){return clean({x:q('#adjustX')?.value,y:q('#adjustY')?.value,scale:Number(q('#adjustScale')?.value||100)/100,rotate:q('#adjustRotate')?.value});}
  function fillControls(a){a=clean(a);if(q('#adjustX'))q('#adjustX').value=a.x;if(q('#adjustY'))q('#adjustY').value=a.y;if(q('#adjustScale'))q('#adjustScale').value=Math.round(a.scale*100);if(q('#adjustRotate'))q('#adjustRotate').value=a.rotate;}
  function updateModal(){
    const av=q('#adjustAvatar'), fr=q('#adjustFrame');
    if(av)av.style.backgroundImage=avatarUrl()?`url("${avatarUrl()}")`:'';
    if(fr){fr.classList.add('dlinky-v4-modal-frame');fr.style.cssText=vars(readControls());}
  }
  function applyProfile(){
    ensure();
    const deco=q('#avatarDecoration');
    if(!deco)return;
    const it=activeFrame();
    let box=q('#dlinkyV4ProfileStage',deco);
    if(!it||!it.url){ if(box)box.remove(); deco.classList.remove('dlinky-v4-lock'); return; }
    user.frame=it.url;user.activeFrameId=it.id;user.decoration='none';save();
    deco.classList.add('dlinky-v4-lock');
    if(!box){
      box=document.createElement('div');
      box.id='dlinkyV4ProfileStage';
      box.className='dlinky-v4-stage dlinky-v4-profile-stage';
      box.innerHTML=`<span class="dlinky-v4-avatar"></span><img class="dlinky-v4-frame" alt="moldura">`;
      deco.appendChild(box);
    }
    box.style.cssText=vars(adjFor(it.id));
    const av=box.querySelector('.dlinky-v4-avatar'), fr=box.querySelector('.dlinky-v4-frame');
    if(av)av.style.backgroundImage=avatarUrl()?`url("${avatarUrl()}")`:'';
    if(fr)fr.src=it.url;
    const old=q('#profileFrame'); if(old)old.style.display='none';
  }
  function renderCard(it){
    const frame=isFrame(it);if(frame)it.id=makeId(it);
    const active=frame&&user.activeFrameId===it.id;
    return `<div class="asset-card inv-item-card"><div class="asset-preview shop-preview inv-preview ${frame?'dlinky-v4-inv':''}">${frame?stageHtml(it,adjFor(it.id)):'✦'}</div><div class="asset-body"><b>${esc(it.name||'Item')}</b><small>${esc(it.duration||it.type||'item')}</small>${frame?`<div class="inv-actions-row"><button class="btn primary small" data-v4-use-frame="${esc(it.id)}">${active?'Usando':'Usar'}</button><button class="btn adjust-frame-btn small" data-v4-adjust-frame="${esc(it.id)}">Ajustar</button></div>`:''}</div></div>`;
  }
  window.renderInventory=function(){ensure();const g=q('#inventoryGrid');if(!g)return;g.innerHTML=user.inventory.length?user.inventory.map(renderCard).join(''):'<p>Você ainda não possui itens no inventário.</p>';};
  window.useFrame=function(id){const it=frameById(id);if(!it||!it.url)return;user.activeFrameId=it.id;user.frame=it.url;user.decoration='none';save();window.renderInventory();applyProfile();if(typeof toast==='function')toast('Moldura aplicada!');};
  window.openFrameAdjustModal=function(id){
    const it=frameById(id);if(!it||!it.url)return;
    window.__dlinkyEditingFrameId=it.id;
    const m=q('#frameAdjustModal'), fr=q('#adjustFrame');if(!m||!fr)return;
    fr.src=it.url;fillControls(adjFor(it.id));updateModal();m.classList.add('show');
  };
  window.saveFrameAdjustment=function(){
    const it=frameById(window.__dlinkyEditingFrameId);if(!it||!it.url)return;
    const a=readControls();
    user.frameAdjustments=user.frameAdjustments||{};user.frameAdjustments[it.id]=a;
    user.frameAdjust=user.frameAdjust||{};user.frameAdjust[it.url]=a;user.frameAdjust[norm(it.url)]=a;
    user.activeFrameId=it.id;user.frame=it.url;user.decoration='none';save();
    q('#frameAdjustModal')?.classList.remove('show');
    window.renderInventory();applyProfile();
    if(typeof toast==='function')toast('Ajuste salvo e aplicado!');
  };
  const prevProfile=window.renderProfile;
  window.renderProfile=function(){if(prevProfile)prevProfile();[0,50,150,350,800,1400].forEach(t=>setTimeout(applyProfile,t));};
  document.addEventListener('click',function(e){
    const use=e.target.closest?.('[data-v4-use-frame],[data-v3-use-frame],[data-dlinky-use-frame]');
    if(use){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();window.useFrame(use.dataset.v4UseFrame||use.dataset.v3UseFrame||use.dataset.dlinkyUseFrame);return;}
    const adj=e.target.closest?.('[data-v4-adjust-frame],[data-v3-adjust-frame],[data-dlinky-adjust-frame]');
    if(adj){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();window.openFrameAdjustModal(adj.dataset.v4AdjustFrame||adj.dataset.v3AdjustFrame||adj.dataset.dlinkyAdjustFrame);return;}
    if(e.target.closest?.('#saveFrameAdjust')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();window.saveFrameAdjustment();return;}
    if(e.target.closest?.('#resetFrameAdjust')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();fillControls({x:0,y:0,scale:1,rotate:0});updateModal();return;}
    if(e.target.closest?.('#closeFrameAdjust')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();q('#frameAdjustModal')?.classList.remove('show');return;}
  });
  document.addEventListener('input',e=>{if(['adjustX','adjustY','adjustScale','adjustRotate'].includes(e.target?.id))updateModal();});
  let dragging=false,sx=0,sy=0,ox=0,oy=0;
  document.addEventListener('pointerdown',e=>{const box=e.target.closest?.('#adjustPreview');if(!box||!q('#frameAdjustModal')?.classList.contains('show'))return;dragging=true;sx=e.clientX;sy=e.clientY;ox=Number(q('#adjustX')?.value||0);oy=Number(q('#adjustY')?.value||0);});
  document.addEventListener('pointermove',e=>{if(!dragging)return;if(q('#adjustX'))q('#adjustX').value=Math.max(-80,Math.min(80,ox+e.clientX-sx));if(q('#adjustY'))q('#adjustY').value=Math.max(-80,Math.min(80,oy+e.clientY-sy));updateModal();});
  document.addEventListener('pointerup',()=>dragging=false,true);
  // disabled old repeating frame interval to avoid GIF restart
  setTimeout(()=>{ensure();window.renderInventory();applyProfile();},250);
})();

/* =========================================================
   DLINKY V5 — CORREÇÃO FINAL SOMENTE DA DUPLICIDADE
   - Remove/hide decoração antiga no perfil público.
   - Mantém apenas o palco V4 salvo com x/y/scale/rotate.
   - Reaplica após renders antigos para o ajuste não sumir ao atualizar.
   ========================================================= */
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const norm=v=>String(v||'').trim().replace(/^url\(["']?|["']?\)$/g,'').replace(/\\/g,'/').split('?')[0].toLowerCase();
  const clean=a=>({x:Number(a&&a.x)||0,y:Number(a&&a.y)||0,scale:Number(a&&a.scale)||1,rotate:Number(a&&a.rotate)||0});
  const isFrame=it=>!!(it&&(it.url||String(it.type||'').toLowerCase().includes('frame')||String(it.name||'').toLowerCase().includes('moldura')));
  function save(){try{localStorage.setItem('dlinkyUser',JSON.stringify(user));}catch(e){}}
  function makeId(it){
    if(!it)return'';
    if(it.id)return String(it.id);
    const base=(norm(it.url)||String(it.name||'moldura')).replace(/[^a-z0-9_-]+/g,'-').replace(/^-+|-+$/g,'');
    return 'frame_'+(base||'item').slice(-80);
  }
  function ensure(){
    user.inventory=Array.isArray(user.inventory)?user.inventory:[];
    user.frameAdjustments=user.frameAdjustments||{};
    user.frameAdjust=user.frameAdjust||{};
    const seen=new Set();
    user.inventory=user.inventory.filter(it=>{
      if(!it)return false;
      if(isFrame(it)){
        it.id=makeId(it);
        const key='frame|'+(norm(it.url)||it.id);
        if(seen.has(key))return false;
        seen.add(key);
        const old=user.frameAdjustments[it.id]||user.frameAdjustments[it.url]||user.frameAdjustments[norm(it.url)]||user.frameAdjust[it.url]||user.frameAdjust[norm(it.url)];
        if(old)user.frameAdjustments[it.id]=clean(old);
        return true;
      }
      const key='item|'+String(it.id||it.name||it.value||'').toLowerCase();
      if(seen.has(key))return false;
      seen.add(key);
      return true;
    });
    if(user.frame){
      const found=user.inventory.find(it=>isFrame(it)&&norm(it.url)===norm(user.frame));
      if(found)user.activeFrameId=found.id;
    }
    save();
  }
  function active(){
    ensure();
    return user.inventory.find(it=>isFrame(it)&&it.id===user.activeFrameId) || user.inventory.find(it=>isFrame(it)&&norm(it.url)===norm(user.frame));
  }
  function adjFor(it){return clean(user.frameAdjustments?.[it?.id]||user.frameAdjust?.[it?.url]||user.frameAdjust?.[norm(it?.url)]);}
  function vars(a){a=clean(a);return `--frame-x:${a.x}px;--frame-y:${a.y}px;--frame-scale:${a.scale};--frame-rotate:${a.rotate}deg;`;}
  function lockSingleFrame(){
    const deco=q('#avatarDecoration'); if(!deco)return;
    const it=active();
    const oldAvatar=q('#profileAvatar');
    const oldFrame=q('#profileFrame');
    const oldDecor=q('.decor-css',deco);
    if(oldAvatar) oldAvatar.style.setProperty('display','none','important');
    if(oldFrame) oldFrame.style.setProperty('display','none','important');
    if(oldDecor) oldDecor.style.setProperty('display','none','important');
    // remove classes antigas que criavam chifres/anel/órbita por CSS
    deco.className='avatar-decoration dlinky-v4-lock dlinky-v5-only-frame';
    if(!it||!it.url){
      q('#dlinkyV4ProfileStage',deco)?.remove();
      user.frame=''; user.activeFrameId=''; save();
      return;
    }
    user.frame=it.url; user.activeFrameId=it.id; user.decoration='none'; save();
    let stage=q('#dlinkyV4ProfileStage',deco);
    if(!stage){
      stage=document.createElement('div');
      stage.id='dlinkyV4ProfileStage';
      stage.className='dlinky-v4-stage dlinky-v4-profile-stage';
      stage.innerHTML='<span class="dlinky-v4-avatar"></span><img class="dlinky-v4-frame" alt="moldura">';
      deco.appendChild(stage);
    }
    stage.style.cssText=vars(adjFor(it));
    const av=q('.dlinky-v4-avatar',stage), fr=q('.dlinky-v4-frame',stage);
    if(av) av.style.backgroundImage=user.avatar?`url("${user.avatar}")`:'';
    if(fr){fr.src=it.url; fr.style.display='block';}
  }
  const previous=window.renderProfile;
  window.renderProfile=function(){
    if(previous) previous();
    [0,40,100,250,600,1200,2000].forEach(t=>setTimeout(lockSingleFrame,t));
  };
  // Depois de salvar/usar/voltar/atualizar, aplica de novo sem mexer no resto.
  const oldUse=window.useFrame;
  window.useFrame=function(id){ if(oldUse) oldUse(id); setTimeout(lockSingleFrame,0); setTimeout(lockSingleFrame,200); };
  const oldSave=window.saveFrameAdjustment;
  window.saveFrameAdjustment=function(){ if(oldSave) oldSave(); setTimeout(lockSingleFrame,0); setTimeout(lockSingleFrame,200); };
  window.addEventListener('storage',lockSingleFrame);
  window.addEventListener('hashchange',()=>setTimeout(lockSingleFrame,80));
  // disabled old repeating frame interval to avoid GIF restart
  setTimeout(lockSingleFrame,300);
})();

/* =========================================================
   DLINKY V6 — FIX FINAL PEDIDO
   1) Inventário sempre mostra Ajustar ao voltar do perfil, sem precisar atualizar.
   2) Salvar ajuste persiste imediatamente em localStorage e mantém ativo.
   3) Botão de som melhorado com controle de volume.
   ========================================================= */
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const norm=v=>String(v||'').trim().replace(/^url\(["']?|["']?\)$/g,'').replace(/\\/g,'/').split('?')[0].toLowerCase();
  const esc=s=>String(s||'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  const isFrame=it=>!!(it&&(it.url||String(it.type||'').toLowerCase().includes('frame')||String(it.name||'').toLowerCase().includes('moldura')));
  const clean=a=>({x:Number(a&&a.x)||0,y:Number(a&&a.y)||0,scale:Number(a&&a.scale)||1,rotate:Number(a&&a.rotate)||0});
  function save(){try{localStorage.setItem('dlinkyUser',JSON.stringify(user));}catch(e){}}
  function makeId(it){
    if(!it)return'';
    if(it.id)return String(it.id);
    const raw=(norm(it.url)||String(it.name||'moldura')).replace(/[^a-z0-9_-]+/g,'-').replace(/^-+|-+$/g,'');
    return 'frame_'+(raw||'item').slice(-90);
  }
  function ensureFrames(){
    user.inventory=Array.isArray(user.inventory)?user.inventory:[];
    user.frameAdjustments=user.frameAdjustments||{};
    user.frameAdjust=user.frameAdjust||{};
    const seen=new Set();
    user.inventory=user.inventory.filter(it=>{
      if(!it)return false;
      if(isFrame(it)){
        it.id=makeId(it);
        const k='frame|'+(norm(it.url)||it.id);
        if(seen.has(k))return false;
        seen.add(k);
        const old=user.frameAdjustments[it.id]||user.frameAdjustments[it.url]||user.frameAdjustments[norm(it.url)]||user.frameAdjust[it.url]||user.frameAdjust[norm(it.url)];
        if(old)user.frameAdjustments[it.id]=clean(old);
        return true;
      }
      const k='item|'+String(it.id||it.name||it.type||'item').toLowerCase();
      if(seen.has(k))return false;
      seen.add(k);return true;
    });
    if(user.frame){
      const current=user.inventory.find(it=>isFrame(it)&&norm(it.url)===norm(user.frame));
      if(current)user.activeFrameId=current.id;
    }
    save();
  }
  function frameById(id){ensureFrames();return user.inventory.find(it=>isFrame(it)&&it.id===id)||user.inventory.find(it=>isFrame(it)&&norm(it.url)===norm(id));}
  function activeFrame(){ensureFrames();return frameById(user.activeFrameId)||user.inventory.find(it=>isFrame(it)&&norm(it.url)===norm(user.frame));}
  function adjFor(it){return clean(user.frameAdjustments?.[it?.id]||user.frameAdjust?.[it?.url]||user.frameAdjust?.[norm(it?.url)]);}
  function cssVars(a){a=clean(a);return `--frame-x:${a.x}px;--frame-y:${a.y}px;--frame-scale:${a.scale};--frame-rotate:${a.rotate}deg;`;}

  function invCard(it){
    const active=it.id===user.activeFrameId || norm(it.url)===norm(user.frame);
    const adj=adjFor(it);
    return `<div class="asset-card inv-item-card dlinky-v6-card ${active?'is-active':''}">
      <div class="asset-preview shop-preview inv-preview dlinky-v4-stage" style="${cssVars(adj)}">
        <span class="dlinky-v4-avatar" style="background-image:url('${esc(user.avatar||'')}')"></span>
        <img class="dlinky-v4-frame" src="${esc(it.url||'')}" alt="${esc(it.name||'moldura')}">
      </div>
      <div class="asset-body"><b>${esc(it.name||'Moldura')}</b><small>${esc(it.duration||'Permanente')}</small>
        <button class="btn primary small" data-v6-use-frame="${esc(it.id)}">${active?'Usando':'Usar'}</button>
        <button class="btn primary small" data-v6-adjust-frame="${esc(it.id)}">Ajustar</button>
      </div>
    </div>`;
  }
  window.renderInventory=function(){
    ensureFrames();
    const g=q('#inventoryGrid'); if(!g)return;
    const frames=user.inventory.filter(isFrame);
    const others=user.inventory.filter(it=>!isFrame(it));
    const html=[...frames.map(invCard),...others.map(it=>`<div class="asset-card inv-item-card"><div class="asset-preview shop-preview">✦</div><div class="asset-body"><b>${esc(it.name||'Item')}</b><small>${esc(it.duration||it.type||'item')}</small><button class="btn primary small">Usar</button></div></div>`)].join('');
    g.innerHTML=html||'<p>Você ainda não possui itens no inventário.</p>';
  };

  window.useFrame=function(id){
    const it=frameById(id); if(!it)return;
    user.activeFrameId=it.id; user.frame=it.url; user.decoration='none';
    user.frameAdjustments=user.frameAdjustments||{};
    if(!user.frameAdjustments[it.id]) user.frameAdjustments[it.id]=adjFor(it);
    user.frameAdjust=user.frameAdjust||{}; user.frameAdjust[it.url]=user.frameAdjustments[it.id]; user.frameAdjust[norm(it.url)]=user.frameAdjustments[it.id];
    save(); window.renderInventory(); applyProfileFrame(); if(typeof toast==='function')toast('Moldura aplicada!');
  };

  function readControls(){return clean({x:q('#adjustX')?.value,y:q('#adjustY')?.value,scale:q('#adjustScale')?.value,rotate:q('#adjustRotate')?.value});}
  function fillControls(a){a=clean(a); if(q('#adjustX'))q('#adjustX').value=a.x; if(q('#adjustY'))q('#adjustY').value=a.y; if(q('#adjustScale'))q('#adjustScale').value=a.scale; if(q('#adjustRotate'))q('#adjustRotate').value=a.rotate;}
  function updateModal(){const img=q('#adjustFrame'); if(img)img.style.cssText=cssVars(readControls());}
  window.openFrameAdjustModal=function(id){
    const it=frameById(id); if(!it)return;
    window.__dlinkyEditingFrameId=it.id;
    const m=q('#frameAdjustModal'), img=q('#adjustFrame'); if(!m||!img)return;
    img.src=it.url; fillControls(adjFor(it)); updateModal();
    user.activeFrameId=it.id; user.frame=it.url; user.decoration='none'; save();
    m.classList.add('show'); m.style.display='flex';
  };
  window.saveFrameAdjustment=function(){
    const it=frameById(window.__dlinkyEditingFrameId||user.activeFrameId); if(!it)return;
    const a=readControls();
    user.frameAdjustments=user.frameAdjustments||{}; user.frameAdjust=user.frameAdjust||{};
    user.frameAdjustments[it.id]=a; user.frameAdjust[it.url]=a; user.frameAdjust[norm(it.url)]=a;
    user.activeFrameId=it.id; user.frame=it.url; user.decoration='none';
    save();
    q('#frameAdjustModal')?.classList.remove('show');
    if(q('#frameAdjustModal'))q('#frameAdjustModal').style.display='none';
    window.renderInventory(); applyProfileFrame();
    if(typeof toast==='function')toast('Ajuste salvo!');
  };
  function applyProfileFrame(){
    ensureFrames();
    const deco=q('#avatarDecoration'); if(!deco)return;
    const it=activeFrame();
    const oldAvatar=q('#profileAvatar'), oldFrame=q('#profileFrame'), oldCss=q('.decor-css',deco);
    if(oldAvatar)oldAvatar.style.setProperty('display','none','important');
    if(oldFrame)oldFrame.style.setProperty('display','none','important');
    if(oldCss)oldCss.style.setProperty('display','none','important');
    deco.className='avatar-decoration dlinky-v5-only-frame dlinky-v6-profile-frame';
    if(!it||!it.url){q('#dlinkyV4ProfileStage',deco)?.remove();return;}
    let stage=q('#dlinkyV4ProfileStage',deco);
    if(!stage){stage=document.createElement('div');stage.id='dlinkyV4ProfileStage';stage.className='dlinky-v4-stage dlinky-v4-profile-stage';stage.innerHTML='<span class="dlinky-v4-avatar"></span><img class="dlinky-v4-frame" alt="moldura">';deco.appendChild(stage);}
    stage.style.cssText=cssVars(adjFor(it));
    const av=q('.dlinky-v4-avatar',stage), fr=q('.dlinky-v4-frame',stage);
    if(av)av.style.backgroundImage=user.avatar?`url("${user.avatar}")`:'';
    if(fr){fr.src=it.url;fr.style.display='block';}
  }
  const oldRP=window.renderProfile;
  window.renderProfile=function(){if(oldRP)oldRP();[0,50,150,350,800,1500].forEach(t=>setTimeout(applyProfileFrame,t));};
  const oldRD=window.renderDash;
  window.renderDash=function(){if(oldRD)oldRD();setTimeout(()=>{ensureFrames();window.renderInventory();},0);setTimeout(()=>window.renderInventory(),150);};
  const oldOT=window.openTab;
  window.openTab=function(id){if(oldOT)oldOT(id); if(id==='inventory')setTimeout(()=>window.renderInventory(),0);};

  document.addEventListener('click',function(e){
    const use=e.target.closest?.('[data-v6-use-frame]');
    if(use){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();window.useFrame(use.dataset.v6UseFrame);return;}
    const adj=e.target.closest?.('[data-v6-adjust-frame]');
    if(adj){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();window.openFrameAdjustModal(adj.dataset.v6AdjustFrame);return;}
    if(e.target.closest?.('#saveFrameAdjust')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();window.saveFrameAdjustment();return;}
  });
  document.addEventListener('input',e=>{if(['adjustX','adjustY','adjustScale','adjustRotate'].includes(e.target?.id))updateModal();});
  window.addEventListener('hashchange',()=>setTimeout(()=>{if(location.hash==='#/dashboard')window.renderInventory(); if(q('#profile')?.classList.contains('active'))applyProfileFrame();},120));
  // disabled old repeating frame interval to avoid GIF restart

  function setupSoundControl(){
    const btn=q('#soundBtn'), audio=q('#profileAudio'); if(!btn||!audio)return;
    btn.innerHTML='<i class="fa-solid fa-volume-high"></i>';
    btn.title='Som e volume';
    let box=q('#soundPanel');
    if(!box){box=document.createElement('div');box.id='soundPanel';box.innerHTML='<button id="soundPlayPause" type="button"><i class="fa-solid fa-play"></i></button><input id="soundVolume" type="range" min="0" max="100" value="70"><span id="soundPercent">70%</span>';document.body.appendChild(box);}
    const vol=q('#soundVolume'), pct=q('#soundPercent'), pp=q('#soundPlayPause');
    audio.volume=Number(localStorage.getItem('dlinkyVolume')||70)/100; vol.value=Math.round(audio.volume*100); pct.textContent=vol.value+'%';
    function sync(){btn.innerHTML=audio.paused?'<i class="fa-solid fa-volume-high"></i>':'<i class="fa-solid fa-pause"></i>'; pp.innerHTML=audio.paused?'<i class="fa-solid fa-play"></i>':'<i class="fa-solid fa-pause"></i>';}
    btn.onclick=function(ev){ev.preventDefault();ev.stopPropagation();box.classList.toggle('show'); if(user.music&&audio.paused)audio.play().catch(()=>{}); sync();};
    pp.onclick=function(ev){ev.preventDefault();ev.stopPropagation(); if(!user.music)return; if(audio.paused)audio.play().catch(()=>{}); else audio.pause(); sync();};
    vol.oninput=function(){audio.volume=Number(vol.value)/100;localStorage.setItem('dlinkyVolume',vol.value);pct.textContent=vol.value+'%';};
    audio.addEventListener('play',sync); audio.addEventListener('pause',sync); sync();
  }
  const oldEntry=q('#entryOverlay')?.onclick;
  if(q('#entryOverlay'))q('#entryOverlay').onclick=function(e){ if(oldEntry)oldEntry.call(this,e); setTimeout(setupSoundControl,50); };
  setupSoundControl();
  setTimeout(()=>{ensureFrames();window.renderInventory();applyProfileFrame();setupSoundControl();},300);
})();

/* =========================================================
   DLINKY V8 — moldura final: ajuste fixo + GIF sem reiniciar
   ========================================================= */
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const norm=u=>String(u||'').trim().replace(/^url\(["']?|["']?\)$/g,'').split('?')[0];
  const empty=()=>({x:0,y:0,scale:1,rotate:0});
  const clean=a=>({x:Number(a?.x||0),y:Number(a?.y||0),scale:Math.max(.2,Number(a?.scale||1)),rotate:Number(a?.rotate||0)});
  const transform=a=>{a=clean(a);return `translate(calc(-50% + ${a.x}px),calc(-50% + ${a.y}px)) scale(${a.scale}) rotate(${a.rotate}deg)`};
  const isFrame=it=>it&&(it.type==='frame'||it.type==='frames'||it.kind==='frame'||/moldura|frame/i.test(String(it.name||''))||String(it.url||'').startsWith('data:image/svg+xml')||/\.(gif|png|webp|apng|svg)(\?|#|$)/i.test(String(it.url||'')));
  function persist(){localStorage.setItem('dlinkyUser',JSON.stringify(user));}
  function ensure(){
    user.inventory=Array.isArray(user.inventory)?user.inventory:[];
    user.frameAdjustments=user.frameAdjustments||{}; user.frameAdjust=user.frameAdjust||{};
    const seen=new Set();
    user.inventory=user.inventory.filter((it,i)=>{
      if(!it)return false;
      if(isFrame(it)){
        it.type='frame'; it.url=it.url||it.image||it.src||'';
        it.id=it.id||it.frameId||('frame_'+(norm(it.url)||it.name||i).toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,''));
        const k=norm(it.url)||it.id;
        if(seen.has(k))return false; seen.add(k);
        const old=user.frameAdjustments[it.id]||user.frameAdjustments[it.url]||user.frameAdjustments[norm(it.url)]||user.frameAdjust[it.url]||user.frameAdjust[norm(it.url)];
        if(old)user.frameAdjustments[it.id]=clean(old);
      }
      return true;
    });
    const act=user.inventory.find(it=>isFrame(it)&&(it.id===user.activeFrameId||norm(it.url)===norm(user.frame)));
    if(act){user.activeFrameId=act.id;user.frame=act.url;user.decoration='none';}
    persist();
  }
  function frameById(id){ensure();return user.inventory.find(it=>isFrame(it)&&(it.id===id||norm(it.url)===norm(id)))||null;}
  function activeFrame(){ensure();return frameById(user.activeFrameId)||frameById(user.frame);}
  function adjFor(it){return clean(user.frameAdjustments?.[it?.id]||user.frameAdjust?.[it?.url]||user.frameAdjust?.[norm(it?.url)]||empty());}
  function setAdj(it,a){a=clean(a);user.frameAdjustments[it.id]=a;user.frameAdjust[it.url]=a;user.frameAdjust[norm(it.url)]=a;}
  function stageHTML(it,a){a=clean(a);return `<div class="dlinky-final-stage"><span class="dlinky-final-avatar" style="background-image:url('${esc(user.avatar||'')}')"></span><img class="dlinky-final-frame" src="${esc(it.url||'')}" style="transform:${transform(a)}" alt="${esc(it.name||'moldura')}"></div>`;}
  window.renderInventory=function(){
    ensure(); const grid=q('#inventoryGrid'); if(!grid)return;
    const frames=user.inventory.filter(isFrame), others=user.inventory.filter(it=>!isFrame(it));
    grid.innerHTML=[...frames.map(it=>{const active=it.id===user.activeFrameId||norm(it.url)===norm(user.frame);return `<div class="asset-card inv-item-card ${active?'is-active':''}"><div class="asset-preview shop-preview">${stageHTML(it,adjFor(it))}</div><div class="asset-body"><b>${esc(it.name||'Moldura')}</b><small>${esc(it.duration||'Permanente')}</small><div class="inv-actions-row"><button class="btn primary small" data-v8-use-frame="${esc(it.id)}">${active?'Usando':'Usar'}</button><button class="btn primary small" data-v8-adjust-frame="${esc(it.id)}">Ajustar</button></div></div></div>`}),...others.map(it=>`<div class="asset-card inv-item-card"><div class="asset-preview shop-preview">✦</div><div class="asset-body"><b>${esc(it.name||'Item')}</b><small>${esc(it.duration||it.type||'item')}</small><button class="btn primary small">Usar</button></div></div>`)].join('')||'<p>Você ainda não possui itens no inventário.</p>';
  };
  window.useFrame=function(id){const it=frameById(id);if(!it)return;user.activeFrameId=it.id;user.frame=it.url;user.decoration='none';if(!user.frameAdjustments[it.id])setAdj(it,adjFor(it));persist();window.renderInventory();applyProfileFrame();if(typeof toast==='function')toast('Moldura aplicada!');};
  function buildModal(){
    let m=q('#frameAdjustModal'); if(!m){m=document.createElement('div');m.id='frameAdjustModal';document.body.appendChild(m);} 
    m.className='modal frame-adjust-modal show'; m.removeAttribute('style');
    m.innerHTML=`<div class="adjust-card"><button class="adjust-close" id="closeFrameAdjust" type="button">×</button><h2>Ajustar moldura</h2><p>Arraste a moldura ou use os controles para encaixar certinho na foto.</p><div class="adjust-preview" id="adjustPreview"><span id="adjustAvatar"></span><img id="adjustFrameFinal" alt="moldura"></div><div class="adjust-grid"><label>Horizontal<input id="adjustX" type="range" min="-80" max="80" step="1"></label><label>Vertical<input id="adjustY" type="range" min="-80" max="80" step="1"></label><label>Tamanho<input id="adjustScale" type="range" min="0.2" max="2.5" step="0.01"></label><label>Girar<input id="adjustRotate" type="range" min="-180" max="180" step="1"></label></div><div class="adjust-actions"><button class="btn dark" id="resetFrameAdjust" type="button">Resetar</button><button class="btn primary" id="saveFrameAdjust" type="button">Salvar ajuste</button></div></div>`;
    return m;
  }
  function readControls(){return clean({x:q('#adjustX')?.value,y:q('#adjustY')?.value,scale:q('#adjustScale')?.value,rotate:q('#adjustRotate')?.value});}
  function fillControls(a){a=clean(a);q('#adjustX').value=a.x;q('#adjustY').value=a.y;q('#adjustScale').value=a.scale;q('#adjustRotate').value=a.rotate;updateModal();}
  function updateModal(){const img=q('#adjustFrameFinal'); if(img)img.style.transform=transform(readControls());}
  window.openFrameAdjustModal=function(id){
    const it=frameById(id); if(!it)return; window.__dlinkyEditingFrameId=it.id;
    const m=buildModal(); q('#adjustAvatar',m).style.backgroundImage=user.avatar?`url("${user.avatar}")`:''; const im=q('#adjustFrameFinal',m); if(im.getAttribute('src')!==it.url) im.src=it.url;
    user.activeFrameId=it.id; user.frame=it.url; user.decoration='none'; persist(); fillControls(adjFor(it));
  };
  window.saveFrameAdjustment=function(){
    const it=frameById(window.__dlinkyEditingFrameId||user.activeFrameId); if(!it)return;
    setAdj(it,readControls()); user.activeFrameId=it.id; user.frame=it.url; user.decoration='none'; persist();
    q('#frameAdjustModal')?.classList.remove('show'); q('#frameAdjustModal')?.setAttribute('style','display:none!important');
    window.renderInventory(); applyProfileFrame(); if(typeof toast==='function')toast('Ajuste salvo!');
  };
  function applyProfileFrame(){
    ensure(); const deco=q('#avatarDecoration'); if(!deco)return; const it=activeFrame();
    deco.className='avatar-decoration dlinky-final-only';
    qa(':scope > .big-avatar, :scope > #profileFrame, :scope > .decor-css',deco).forEach(el=>el.style.setProperty('display','none','important'));
    qa('#dlinkyV4ProfileStage,#dlinkyFinalProfileStage',deco).forEach((el,i)=>{if(i>0)el.remove();});
    let st=q('#dlinkyFinalProfileStage',deco);
    if(!it||!it.url){if(st)st.remove();return;}
    if(!st){st=document.createElement('div');st.id='dlinkyFinalProfileStage';st.className='dlinky-final-stage';deco.appendChild(st);}
    let av=q('.dlinky-final-avatar',st); if(!av){av=document.createElement('span');av.className='dlinky-final-avatar';st.appendChild(av);} 
    let img=q('.dlinky-final-frame',st); if(!img){img=document.createElement('img');img.className='dlinky-final-frame';img.alt=it.name||'moldura';st.appendChild(img);} 
    av.style.backgroundImage=user.avatar?`url("${user.avatar}")`:'';
    if(img.getAttribute('src')!==it.url){ img.src=it.url; }
    img.alt=it.name||'moldura'; img.style.transform=transform(adjFor(it));
  }
  const oldRP=window.renderProfile; window.renderProfile=function(){if(oldRP)oldRP();[0,200,900,1700,2400].forEach(t=>setTimeout(applyProfileFrame,t));setupSound();};
  const oldRD=window.renderDash; window.renderDash=function(){if(oldRD)oldRD();setTimeout(()=>window.renderInventory(),0);};
  const oldOT=window.openTab; window.openTab=function(id){if(oldOT)oldOT(id);if(id==='inventory')setTimeout(()=>window.renderInventory(),0);};
  document.addEventListener('click',function(e){
    const use=e.target.closest?.('[data-v8-use-frame],[data-v7-use-frame]'); if(use){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();window.useFrame(use.dataset.v8UseFrame||use.dataset.v7UseFrame);return;}
    const adj=e.target.closest?.('[data-v8-adjust-frame],[data-v7-adjust-frame]'); if(adj){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();window.openFrameAdjustModal(adj.dataset.v8AdjustFrame||adj.dataset.v7AdjustFrame);return;}
    if(e.target.closest?.('#saveFrameAdjust')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();window.saveFrameAdjustment();return;}
    if(e.target.closest?.('#resetFrameAdjust')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();fillControls(empty());return;}
    if(e.target.closest?.('#closeFrameAdjust')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();q('#frameAdjustModal')?.classList.remove('show');q('#frameAdjustModal')?.setAttribute('style','display:none!important');return;}
  });
  document.addEventListener('input',e=>{if(['adjustX','adjustY','adjustScale','adjustRotate'].includes(e.target?.id))updateModal();});
  let drag=false,sx=0,sy=0,ox=0,oy=0;
  document.addEventListener('pointerdown',e=>{if(!e.target.closest?.('#adjustPreview'))return;drag=true;sx=e.clientX;sy=e.clientY;ox=Number(q('#adjustX')?.value||0);oy=Number(q('#adjustY')?.value||0);});
  document.addEventListener('pointermove',e=>{if(!drag)return;const nx=Math.max(-80,Math.min(80,ox+e.clientX-sx));const ny=Math.max(-80,Math.min(80,oy+e.clientY-sy));q('#adjustX').value=nx;q('#adjustY').value=ny;updateModal();});
  document.addEventListener('pointerup',()=>drag=false,true);
  function setupSound(){
    const btn=q('#soundBtn'), audio=q('#profileAudio'); if(!btn||!audio)return; btn.innerHTML='<i class="fa-solid fa-volume-high"></i>'; btn.title='Som e volume';
    let box=q('#soundPanel'); if(!box){box=document.createElement('div');box.id='soundPanel';box.innerHTML='<button id="soundPlayPause" type="button"><i class="fa-solid fa-play"></i></button><input id="soundVolume" type="range" min="0" max="100" value="70"><span id="soundPercent">70%</span>';document.body.appendChild(box);} 
    const vol=q('#soundVolume'), pct=q('#soundPercent'), pp=q('#soundPlayPause'); audio.volume=Number(localStorage.getItem('dlinkyVolume')||70)/100; vol.value=Math.round(audio.volume*100); pct.textContent=vol.value+'%';
    const sync=()=>{btn.innerHTML=audio.paused?'<i class="fa-solid fa-volume-high"></i>':'<i class="fa-solid fa-pause"></i>';pp.innerHTML=audio.paused?'<i class="fa-solid fa-play"></i>':'<i class="fa-solid fa-pause"></i>';};
    btn.onclick=ev=>{ev.preventDefault();ev.stopPropagation();box.classList.toggle('show');if(user.music&&audio.paused)audio.play().catch(()=>{});sync();};
    pp.onclick=ev=>{ev.preventDefault();ev.stopPropagation();if(!user.music)return;if(audio.paused)audio.play().catch(()=>{});else audio.pause();sync();};
    vol.oninput=()=>{audio.volume=Number(vol.value)/100;localStorage.setItem('dlinkyVolume',vol.value);pct.textContent=vol.value+'%';};
    audio.onplay=sync; audio.onpause=sync; sync();
  }
  window.addEventListener('hashchange',()=>setTimeout(()=>{if(location.hash==='#/dashboard')window.renderInventory();applyProfileFrame();setupSound();},300));
  setTimeout(()=>{ensure();window.renderInventory();applyProfileFrame();setupSound();},500);
})();

/* ===== DLINKY V10 — limpa duplicada sem mexer no resto ===== */
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>[...r.querySelectorAll(s)];
  function cleanDuplicateFrame(){
    const deco=q('#avatarDecoration');
    if(!deco) return;
    // Remove só os palcos antigos que estavam criando a segunda moldura quadrada.
    qa('#dlinkyV4ProfileStage,.dlinky-v4-profile-stage',deco).forEach(el=>el.remove());
    const old=q(':scope > #profileFrame',deco);
    if(old){old.style.setProperty('display','none','important');old.style.setProperty('visibility','hidden','important');}
    const css=q(':scope > .decor-css',deco);
    if(css){css.style.setProperty('display','none','important');css.style.setProperty('visibility','hidden','important');}
    // Mantém apenas o palco final que já estava funcionando.
    const finals=qa('#dlinkyFinalProfileStage',deco);
    finals.forEach((el,i)=>{ if(i>0) el.remove(); else {el.style.display='block';el.style.visibility='visible';} });
  }
  const prev=window.renderProfile;
  window.renderProfile=function(){
    if(prev) prev();
    [0,80,250,700,1400,2400].forEach(t=>setTimeout(cleanDuplicateFrame,t));
  };
  window.addEventListener('hashchange',()=>[120,500,1200].forEach(t=>setTimeout(cleanDuplicateFrame,t)));
  document.addEventListener('click',e=>{
    if(e.target.closest?.('#saveFrameAdjust,[data-v8-use-frame],[data-v8-adjust-frame]')){
      [80,250,700].forEach(t=>setTimeout(cleanDuplicateFrame,t));
    }
  });
  setInterval(()=>{ if((location.hash||'').includes('/profile') || document.querySelector('#profile.page.active')) cleanDuplicateFrame(); },1200);
})();


/* ===== DLINKY PATCH FINAL: player só no perfil + insígnias com ícones enviados + álbum premium ===== */

/* ===== DLINKY FINAL: ÁLBUM TOGGLE EM CIMA + ÁUDIO SÓ NO PERFIL ===== */

/* ===== DLINKY PEDIDO METADE 1: INSIGNIAS COM COMPRA/ADMIN + ALBUM NO TOPO ===== */


/* =========================================================
   PATCH FINAL — Molduras: duração visível + preço correto
   - Não mexe na Recarga
   - Não troca botões
   - Só devolve o select 3/7/15/Permanente e atualiza preço
   ========================================================= */
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const num=v=>{const m=String(v||'20').match(/\d+/);return m?Number(m[0]):20};
  function getFrames(){try{return JSON.parse(localStorage.getItem('dlinkyCustomFrames')||'[]')||[]}catch(e){return []}}
  function priceFor(f,d='3 dias'){
    if(f && f.prices && f.prices[d]!=null && f.prices[d]!=='' && !Number.isNaN(Number(f.prices[d]))) return Number(f.prices[d]);
    const base=num(f && f.price || 20);
    if(d==='7 dias') return base*2;
    if(d==='15 dias') return base*3;
    if(d==='Permanente') return base*5;
    return base;
  }
  function syncDuration(sel){
    const idx=Number(sel.dataset.frameDuration);
    const f=getFrames()[idx];
    if(!f) return;
    const price=priceFor(f,sel.value);
    const label=q(`[data-price-label="${idx}"]`);
    if(label) label.textContent=price+' Linkwuans';
    const card=sel.closest('[data-frame-card]');
    const durText=card?.querySelector('.compact-frame-meta .duration-text');
    if(durText) durText.textContent=sel.value;
    if(card) card.dataset.currentPrice=String(price);
  }
  function markDurationLabels(){
    qa('#tab-store #shopGrid.frames-shop-compact [data-frame-card]').forEach(card=>{
      const sel=card.querySelector('[data-frame-duration]');
      const meta=card.querySelector('.compact-frame-meta');
      if(meta && !meta.querySelector('.duration-text')){
        const spans=meta.querySelectorAll('span');
        if(spans[1]) spans[1].classList.add('duration-text');
      }
      if(sel) syncDuration(sel);
    });
  }
  document.addEventListener('change',e=>{
    const sel=e.target.closest('#tab-store #shopGrid.frames-shop-compact [data-frame-duration]');
    if(sel) syncDuration(sel);
  });
  document.addEventListener('click',()=>setTimeout(markDurationLabels,40),true);
  const oldRenderShop=window.renderShop;
  if(oldRenderShop){
    window.renderShop=function(mode){
      const r=oldRenderShop.apply(this,arguments);
      setTimeout(markDurationLabels,0);
      setTimeout(markDurationLabels,120);
      return r;
    };
  }
  const oldOpenTab=window.openTab;
  if(oldOpenTab){
    window.openTab=function(id){
      const r=oldOpenTab.apply(this,arguments);
      if(id==='store') setTimeout(markDurationLabels,160);
      return r;
    };
  }
  setTimeout(markDurationLabels,300);
})();


/* Admin Temas/Álbum Premium removido sem bloquear cliques. */
(function(){
  function removeThemeAdminOnce(){
    document.querySelector('#adminFinalPanel')?.remove();
    document.querySelector('#adminThemeList')?.closest('.panel')?.remove();
    [...document.querySelectorAll('h2,h3')].forEach(h=>{
      const t=(h.textContent||'').trim();
      if(t.includes('Admin — Temas e Álbum Premium') || t.includes('Temas cadastrados')){
        (h.closest('.panel') || h.parentElement)?.remove();
      }
    });
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(removeThemeAdminOnce,100));
  setTimeout(removeThemeAdminOnce,500);
})();


/* =========================================================
   PATCH FINAL DO PEDIDO — duração nas molduras sem mexer na Recarga
   - mantém botões Comprar / Presentear
   - mostra 3 dias / 7 dias / 15 dias / Permanente
   - atualiza preço exibido conforme duração
   - remove Admin Temas/Álbum Premium sem bloquear cliques
   ========================================================= */
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const onlyNum=v=>{const m=String(v||'20').match(/\d+/); return m?Number(m[0]):20;};
  function frames(){try{return JSON.parse(localStorage.getItem('dlinkyCustomFrames')||'[]')||[]}catch(e){return []}}
  function priceFor(f,d){
    if(f && f.prices && f.prices[d]!==undefined && f.prices[d]!=='' && !Number.isNaN(Number(f.prices[d]))) return Number(f.prices[d]);
    const base=onlyNum(f&&f.price||20);
    if(d==='7 dias') return base*2;
    if(d==='15 dias') return base*3;
    if(d==='Permanente') return base*5;
    return base;
  }
  function syncCard(card){
    if(!card) return;
    const idx=Number(card.dataset.frameCard||0);
    const f=frames()[idx];
    let sel=card.querySelector('select[data-frame-duration]');
    const actions=card.querySelector('.frame-actions,.compact-frame-actions');
    if(!sel){
      sel=document.createElement('select');
      sel.className='frame-duration compact-frame-duration-final';
      sel.dataset.frameDuration=String(idx);
      sel.innerHTML='<option>3 dias</option><option>7 dias</option><option>15 dias</option><option>Permanente</option>';
      if(actions) actions.parentElement.insertBefore(sel,actions);
      else card.appendChild(sel);
    }
    sel.classList.remove('compact-hidden-duration');
    sel.classList.add('compact-frame-duration-final');
    const dur=sel.value||'3 dias';
    const p=priceFor(f,dur);
    let price=q(`[data-price-label="${idx}"]`,card) || card.querySelector('[data-price-label]');
    if(price) price.textContent=p+' Linkwuans';
    let meta=card.querySelector('.compact-frame-meta');
    if(meta){
      let spans=meta.querySelectorAll('span');
      if(spans[1]) spans[1].textContent=dur;
    }
    card.dataset.currentDuration=dur;
    card.dataset.currentPrice=String(p);
  }
  function apply(){
    qa('#tab-store #shopGrid.frames-shop-compact [data-frame-card], #tab-store #shopGrid [data-frame-card].frame-shop-card').forEach(syncCard);
    qa('#adminFinalPanel,#adminThemeList').forEach(el=>(el.id==='adminThemeList'?el.closest('.panel'):el)?.remove());
    qa('h2,h3').forEach(h=>{const t=(h.textContent||'').trim(); if(t.includes('Admin — Temas e Álbum Premium')||t.includes('Temas cadastrados')) (h.closest('.panel')||h.parentElement)?.remove();});
  }
  document.addEventListener('change',e=>{
    const sel=e.target.closest('#tab-store select[data-frame-duration]');
    if(sel) syncCard(sel.closest('[data-frame-card]'));
  });
  const oldRenderShop=window.renderShop;
  if(oldRenderShop){
    window.renderShop=function(){const r=oldRenderShop.apply(this,arguments); setTimeout(apply,0); setTimeout(apply,120); return r;};
  }
  const oldOpenTab=window.openTab;
  if(oldOpenTab){
    window.openTab=function(id){const r=oldOpenTab.apply(this,arguments); if(id==='store'||id==='admin'){setTimeout(apply,80);setTimeout(apply,250);} return r;};
  }
  document.addEventListener('click',()=>setTimeout(apply,60),true);
  document.addEventListener('DOMContentLoaded',()=>{setTimeout(apply,200);setTimeout(apply,800);});
  setTimeout(apply,400);
})();


/* =========================================================
   PATCH FINAL CLEAN — select do estilo/movimento sem travar
   Este patch NÃO usa os selects antigos que ficavam voltando para Normal.
   Ele remove os controles bugados e cria controles limpos com IDs novos.
   ========================================================= */
(function(){
  const STYLE_KEY='dlinky_profile_card_style';
  const MOTION_KEY='dlinky_profile_card_motion';
  const VALID_STYLE=['normal','invisible','soft','glass','line'];
  const VALID_MOTION=['none','float','pulse','tilt','parallax'];
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));

  function getUser(){
    try{return JSON.parse(localStorage.getItem('dlinkyUser')||'{}')||{};}catch{return {};}
  }
  function setUserPatch(patch){
    const u=getUser();
    const merged=Object.assign({},u,patch);
    try{localStorage.setItem('dlinkyUser',JSON.stringify(merged));}catch{}
    if(window.user) Object.assign(window.user,patch);
    return merged;
  }
  function getStyle(){
    const u=getUser();
    const v=localStorage.getItem(STYLE_KEY)||u.profileCardStyle||'normal';
    return VALID_STYLE.includes(v)?v:'normal';
  }
  function getMotion(){
    const u=getUser();
    const v=localStorage.getItem(MOTION_KEY)||u.profileCardMotion||'none';
    return VALID_MOTION.includes(v)?v:'none';
  }
  function saveClean(){
    const st=q('#dlinkyCardStyleFixed')?.value||getStyle();
    const mo=q('#dlinkyCardMotionFixed')?.value||getMotion();
    const style=VALID_STYLE.includes(st)?st:'normal';
    const motion=VALID_MOTION.includes(mo)?mo:'none';
    localStorage.setItem(STYLE_KEY,style);
    localStorage.setItem(MOTION_KEY,motion);
    setUserPatch({profileCardStyle:style,profileCardMotion:motion});
    applyClean();
    syncClean();
  }
  function removeBuggedControls(){
    qa('#profileCardStyleCustom,#profileCardMotionCustom,#profileCardStyle,#profileCardMotion').forEach(sel=>{
      const lab=sel.closest('label');
      if(lab) lab.remove(); else sel.remove();
    });
    qa('.dlinky-profile-card-control').forEach(el=>{
      if(!el.querySelector('#dlinkyCardStyleFixed') && !el.querySelector('#dlinkyCardMotionFixed')) el.remove();
    });
  }
  function insertCleanControls(){
    const tab=q('#tab-custom');
    if(!tab) return;
    removeBuggedControls();
    const bg=q('#customBgFx',tab);
    if(!bg) return;
    if(!q('#dlinkyCardStyleFixed',tab)){
      const host=bg.closest('label')||bg.parentElement;
      const box=document.createElement('label');
      box.className='dlinky-profile-card-control dlinky-card-fixed-control';
      box.innerHTML='<b>Estilo do card do perfil</b><select id="dlinkyCardStyleFixed"><option value="normal">Normal</option><option value="invisible">Invisível / sem card</option><option value="soft">Suave transparente</option><option value="glass">Vidro transparente</option><option value="line">Só borda fina</option></select>';
      host.insertAdjacentElement('afterend',box);
    }
    if(!q('#dlinkyCardMotionFixed',tab)){
      const styleBox=q('#dlinkyCardStyleFixed',tab)?.closest('label')||q('#customBgFx',tab)?.closest('label');
      const box=document.createElement('label');
      box.className='dlinky-profile-card-control dlinky-card-fixed-control';
      box.innerHTML='<b>Movimento do card</b><select id="dlinkyCardMotionFixed"><option value="none">Nenhum</option><option value="float">Subir levemente</option><option value="pulse">Glow leve</option><option value="tilt">Inclinar seguindo mouse</option><option value="parallax">Parallax seguindo mouse</option></select>';
      styleBox.insertAdjacentElement('afterend',box);
    }
    syncClean();
  }
  function syncClean(){
    const s=q('#dlinkyCardStyleFixed');
    const m=q('#dlinkyCardMotionFixed');
    if(s && document.activeElement!==s) s.value=getStyle();
    if(m && document.activeElement!==m) m.value=getMotion();
  }
  function applyClean(){
    const style=getStyle();
    const motion=getMotion();
    const card=q('#profileCard')||q('.profile-wrap');
    if(!card) return;
    card.classList.remove('card-style-invisible','card-style-soft','card-style-glass','card-style-line','dlinky-card-none','card-move-float','card-move-pulse','card-move-tilt','card-move-parallax');
    card.style.transform='';
    if(style==='invisible'){
      card.classList.add('card-style-invisible','dlinky-card-none');
      ['background','background-color','background-image','border','box-shadow','backdrop-filter','-webkit-backdrop-filter','filter'].forEach(prop=>{
        card.style.setProperty(prop, prop==='background-image'?'none':(prop==='border'?'0':(prop.includes('filter')?'none':'transparent')), 'important');
      });
      const banner=q('.profile-banner',card); if(banner) banner.style.setProperty('display','none','important');
    }else{
      ['background','background-color','background-image','border','box-shadow','backdrop-filter','-webkit-backdrop-filter','filter'].forEach(prop=>card.style.removeProperty(prop));
      const banner=q('.profile-banner',card); if(banner) banner.style.removeProperty('display');
      if(style!=='normal') card.classList.add('card-style-'+style);
    }
    if(motion!=='none') card.classList.add('card-move-'+motion);
  }

  document.addEventListener('change',e=>{
    if(e.target && (e.target.id==='dlinkyCardStyleFixed'||e.target.id==='dlinkyCardMotionFixed')){
      saveClean();
      setTimeout(()=>{syncClean();applyClean();},120);
      setTimeout(()=>{syncClean();applyClean();},500);
    }
  });

  document.addEventListener('click',e=>{
    if(e.target && e.target.closest('#saveCustom,#saveCustomFinal,#saveCustomFinal2,#saveCustomFinalReal,#saveLayout')){
      saveClean();
      [100,350,800].forEach(t=>setTimeout(()=>{insertCleanControls();syncClean();applyClean();},t));
    }
  });

  const oldOpen=window.openTab;
  if(oldOpen){
    window.openTab=function(id){
      const r=oldOpen.apply(this,arguments);
      if(id==='custom'||id==='layout') [150,450,900,1400].forEach(t=>setTimeout(()=>{insertCleanControls();applyClean();},t));
      return r;
    };
  }
  const oldDash=window.renderDash;
  if(oldDash){
    window.renderDash=function(){
      const r=oldDash.apply(this,arguments);
      [180,500,1000].forEach(t=>setTimeout(()=>{insertCleanControls();applyClean();},t));
      return r;
    };
  }
  const oldProfile=window.renderProfile;
  if(oldProfile){
    window.renderProfile=function(){
      const r=oldProfile.apply(this,arguments);
      [0,180,600].forEach(t=>setTimeout(applyClean,t));
      return r;
    };
  }

  setTimeout(()=>{insertCleanControls();applyClean();},120);
})();


/* =========================================================
   PATCH ESTÁVEL — salva customização sem tela piscar + efeito de fundo limpo
   - não chama renderDash ao salvar customização
   - mantém os selects de card sem duplicar
   - remove raio/partículas do painel e só aplica no perfil público
   ========================================================= */
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const STYLE_KEY='dlinky_profile_card_style';
  const MOTION_KEY='dlinky_profile_card_motion';
  const styles=['normal','invisible','soft','glass','line'];
  const motions=['none','float','pulse','tilt','parallax'];
  function readUser(){try{return JSON.parse(localStorage.getItem('dlinkyUser')||'{}')||{};}catch{return {};}}
  function writeUser(patch){const u=Object.assign(readUser(),patch);try{localStorage.setItem('dlinkyUser',JSON.stringify(u));}catch{} if(window.user)Object.assign(window.user,patch);return u;}
  function getStyle(){const u=readUser();const v=localStorage.getItem(STYLE_KEY)||u.profileCardStyle||'normal';return styles.includes(v)?v:'normal';}
  function getMotion(){const u=readUser();const v=localStorage.getItem(MOTION_KEY)||u.profileCardMotion||'none';return motions.includes(v)?v:'none';}
  function saveCardPrefs(){const s=q('#dlinkyCardStyleFixed')?.value||getStyle();const m=q('#dlinkyCardMotionFixed')?.value||getMotion();const st=styles.includes(s)?s:'normal';const mo=motions.includes(m)?m:'none';localStorage.setItem(STYLE_KEY,st);localStorage.setItem(MOTION_KEY,mo);writeUser({profileCardStyle:st,profileCardMotion:mo});}
  function cleanDuplicateCardControls(){
    qa('#profileCardStyleCustom,#profileCardMotionCustom,#profileCardStyle,#profileCardMotion').forEach(el=>{const lab=el.closest('label'); if(lab)lab.remove(); else el.remove();});
    const styles=qa('#dlinkyCardStyleFixed'); styles.slice(1).forEach(el=>{const lab=el.closest('label'); if(lab)lab.remove(); else el.remove();});
    const moves=qa('#dlinkyCardMotionFixed'); moves.slice(1).forEach(el=>{const lab=el.closest('label'); if(lab)lab.remove(); else el.remove();});
  }
  function ensureControls(){
    const tab=q('#tab-custom'); if(!tab)return;
    cleanDuplicateCardControls();
    const bg=q('#customBgFx',tab); if(!bg)return;
    if(!q('#dlinkyCardStyleFixed',tab)){
      const host=bg.closest('label')||bg.parentElement;
      const lab=document.createElement('label');
      lab.className='dlinky-card-fixed-control';
      lab.innerHTML='<b>Estilo do card do perfil</b><select id="dlinkyCardStyleFixed"><option value="normal">Normal</option><option value="invisible">Invisível / sem card</option><option value="soft">Suave transparente</option><option value="glass">Vidro transparente</option><option value="line">Só borda fina</option></select>';
      host.insertAdjacentElement('afterend',lab);
    }
    if(!q('#dlinkyCardMotionFixed',tab)){
      const host=q('#dlinkyCardStyleFixed',tab)?.closest('label')||q('#customBgFx',tab)?.closest('label')||tab;
      const lab=document.createElement('label');
      lab.className='dlinky-card-fixed-control';
      lab.innerHTML='<b>Movimento do card</b><select id="dlinkyCardMotionFixed"><option value="none">Nenhum</option><option value="float">Subir levemente</option><option value="pulse">Glow leve</option><option value="tilt">Inclinar seguindo mouse</option><option value="parallax">Parallax seguindo mouse</option></select>';
      host.insertAdjacentElement('afterend',lab);
    }
    const s=q('#dlinkyCardStyleFixed',tab), m=q('#dlinkyCardMotionFixed',tab);
    if(s && document.activeElement!==s)s.value=getStyle();
    if(m && document.activeElement!==m)m.value=getMotion();
  }
  function applyCard(){
    const card=q('#profileCard')||q('.profile-wrap'); if(!card)return;
    const style=getStyle(), motion=getMotion();
    card.classList.remove('card-style-invisible','dlinky-card-none','card-style-soft','card-style-glass','card-style-line','card-move-float','card-move-pulse','card-move-tilt','card-move-parallax');
    card.style.removeProperty('transform');
    const banner=q('.profile-banner',card);
    if(style==='invisible'){
      card.classList.add('card-style-invisible','dlinky-card-none');
      ['background','background-color','background-image','border','box-shadow','backdrop-filter','-webkit-backdrop-filter','filter'].forEach(prop=>card.style.setProperty(prop,prop==='border'?'0':(prop.includes('filter')?'none':'transparent'),'important'));
      if(banner)banner.style.setProperty('display','none','important');
    }else{
      ['background','background-color','background-image','border','box-shadow','backdrop-filter','-webkit-backdrop-filter','filter'].forEach(prop=>card.style.removeProperty(prop));
      if(banner)banner.style.removeProperty('display');
      if(style!=='normal')card.classList.add('card-style-'+style);
    }
    if(motion!=='none')card.classList.add('card-move-'+motion);
  }
  function renderCleanFx(){
    q('#dlinkySingleBgFx')?.remove();
    q('#dlinkyStableBgFx')?.remove();
    const profileActive=q('#profile.page.active,#profile.active,.profile-page.active');
    if(!profileActive)return;
    const u=readUser(); const fx=u.bgFx||'none';
    if(!['snow','stars','raios'].includes(fx))return;
    const layer=document.createElement('div'); layer.id='dlinkyStableBgFx'; layer.className='dlinky-stable-bgfx fx-'+fx;
    const count=fx==='snow'?32:(fx==='stars'?30:8);
    for(let i=0;i<count;i++){
      const sp=document.createElement('span');
      sp.textContent=fx==='snow'?'❄':(fx==='raios'?'⚡':'✦');
      sp.style.left=(Math.random()*98)+'%'; sp.style.top=(Math.random()*95)+'%';
      sp.style.animationDelay=(-Math.random()*8)+'s'; sp.style.animationDuration=(7+Math.random()*8)+'s';
      sp.style.fontSize=(fx==='snow'?(10+Math.random()*12):(12+Math.random()*14))+'px';
      layer.appendChild(sp);
    }
    document.body.appendChild(layer);
  }
  function saveCustomClean(){
    saveCardPrefs();
    const patch={};
    const name=q('#customName')?.value?.trim(); if(name)patch.name=name;
    if(q('#customBio'))patch.bio=q('#customBio').value||'';
    if(q('#customBgFx'))patch.bgFx=q('#customBgFx').value||'none';
    writeUser(patch);
    ensureControls(); applyCard(); renderCleanFx();
    if(window.toast)toast('Customização salva!');
  }
  document.addEventListener('change',e=>{
    if(e.target?.id==='dlinkyCardStyleFixed'||e.target?.id==='dlinkyCardMotionFixed'){saveCardPrefs();applyCard();ensureControls();}
    if(e.target?.id==='customBgFx'){writeUser({bgFx:e.target.value||'none'});renderCleanFx();}
  });
  document.addEventListener('click',e=>{
    const btn=e.target?.closest?.('#saveCustom,#saveCustomFinal,#saveCustomFinal2,#saveCustomFinalReal,#saveLayout');
    if(!btn)return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    saveCustomClean();
  });
  window.addEventListener('hashchange',()=>setTimeout(()=>{ensureControls();applyCard();renderCleanFx();},40));
  const oldOpen=window.openTab; if(oldOpen){window.openTab=function(id){const r=oldOpen.apply(this,arguments);setTimeout(()=>{ensureControls();applyCard();renderCleanFx();},80);return r;};}
  const oldProfile=window.renderProfile; if(oldProfile){window.renderProfile=function(){const r=oldProfile.apply(this,arguments);requestAnimationFrame(()=>{applyCard();renderCleanFx();});setTimeout(()=>{applyCard();renderCleanFx();},100);return r;};}
  const oldDash=window.renderDash; if(oldDash){window.renderDash=function(){const r=oldDash.apply(this,arguments);setTimeout(()=>{ensureControls();applyCard();renderCleanFx();},80);return r;};}
  setTimeout(()=>{ensureControls();applyCard();renderCleanFx();},200);
})();

/* =========================================================
   PATCH FINAL — Sem efeito remove TODAS partículas do perfil
   - quando Efeito de fundo = Sem efeito, some pontos roxos/raios/neve
   - desliga canvas global no perfil público
   - não mexe em Recarga, Molduras, Loja ou Admin
   ========================================================= */
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  function readUser(){try{return JSON.parse(localStorage.getItem('dlinkyUser')||'{}')||{};}catch{return {};}}
  function isProfileActive(){return !!q('#profile.page.active,#profile.active,.profile-page.active');}
  function clearOldProfileFx(){
    const layer=q('#profileParticleLayer');
    if(layer) layer.innerHTML='';
    q('#dlinkySingleBgFx')?.remove();
    q('#dlinkyStableBgFx')?.remove();
  }
  function syncCanvas(){
    const canvas=q('#particlesCanvas');
    if(!canvas)return;
    if(isProfileActive()) canvas.style.setProperty('display','none','important');
    else canvas.style.removeProperty('display');
  }
  function applyOnlySelectedBgFx(){
    syncCanvas();
    clearOldProfileFx();
    if(!isProfileActive()) return;
    const u=readUser();
    const fx=(u.bgFx||'none');
    if(fx==='none' || fx==='') return;
    if(!['snow','stars','raios','scan'].includes(fx)) return;
    const stable=document.createElement('div');
    stable.id='dlinkyStableBgFx';
    stable.className='dlinky-stable-bgfx fx-'+fx;
    if(fx==='scan'){
      const scan=document.createElement('span');
      scan.className='dlinky-scanline-fixed';
      stable.appendChild(scan);
      document.body.appendChild(stable);
      return;
    }
    const count=fx==='snow'?32:(fx==='stars'?26:7);
    for(let i=0;i<count;i++){
      const sp=document.createElement('span');
      sp.textContent=fx==='snow'?'❄':(fx==='raios'?'⚡':'✦');
      sp.style.left=(Math.random()*98)+'%';
      sp.style.top=(Math.random()*94)+'%';
      sp.style.animationDelay=(-Math.random()*8)+'s';
      sp.style.animationDuration=(7+Math.random()*8)+'s';
      sp.style.fontSize=(fx==='snow'?(10+Math.random()*12):(10+Math.random()*12))+'px';
      stable.appendChild(sp);
    }
    document.body.appendChild(stable);
  }
  document.addEventListener('change',e=>{
    if(e.target && e.target.id==='customBgFx'){
      const u=readUser();
      u.bgFx=e.target.value||'none';
      if(u.bgFx==='none'){
        u.particles=false;
        u.particleType='none';
      }
      localStorage.setItem('dlinkyUser',JSON.stringify(u));
      if(window.user)Object.assign(window.user,{bgFx:u.bgFx,particles:u.particles,particleType:u.particleType});
      setTimeout(applyOnlySelectedBgFx,20);
    }
  });
  const oldRenderProfile=window.renderProfile;
  if(oldRenderProfile){
    window.renderProfile=function(){
      const r=oldRenderProfile.apply(this,arguments);
      requestAnimationFrame(applyOnlySelectedBgFx);
      setTimeout(applyOnlySelectedBgFx,120);
      return r;
    };
  }
  const oldRoute=window.route;
  if(oldRoute){
    window.route=function(){
      const r=oldRoute.apply(this,arguments);
      setTimeout(applyOnlySelectedBgFx,80);
      return r;
    };
  }
  window.addEventListener('hashchange',()=>setTimeout(applyOnlySelectedBgFx,80));
  document.addEventListener('click',()=>setTimeout(applyOnlySelectedBgFx,120),true);
  setInterval(()=>{ if(isProfileActive()){ syncCanvas(); const u=readUser(); if((u.bgFx||'none')==='none'){clearOldProfileFx();} } },800);
  setTimeout(applyOnlySelectedBgFx,200);
})();

/* =========================================================
   PATCH FINAL PEDIDO — movimento do card funcionando + fonte do perfil
   - não mexe em loja/recarga/molduras/admin
   - adiciona seletor de fonte na Customização
   - faz Movimento do card funcionar de verdade no perfil
   ========================================================= */
(function(){
  const STYLE_KEY='dlinky_profile_card_style';
  const MOTION_KEY='dlinky_profile_card_motion';
  const FONT_KEY='dlinky_profile_font';
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const validMotion=['none','float','pulse','tilt','parallax'];
  const validFont=['inter','poppins','montserrat','orbitron','mono','serif','cursive'];
  const fontMap={
    inter:'Inter, system-ui, sans-serif',
    poppins:'Poppins, Inter, system-ui, sans-serif',
    montserrat:'Montserrat, Inter, system-ui, sans-serif',
    orbitron:'Orbitron, Inter, system-ui, sans-serif',
    mono:'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    serif:'Georgia, Times New Roman, serif',
    cursive:'Comic Sans MS, Bradley Hand, cursive'
  };
  function readUser(){try{return JSON.parse(localStorage.getItem('dlinkyUser')||'{}')||{};}catch{return {};}}
  function writeUser(patch){const u=Object.assign({},readUser(),patch);try{localStorage.setItem('dlinkyUser',JSON.stringify(u));}catch{} if(window.user)Object.assign(window.user,patch);return u;}
  function getMotion(){const u=readUser();const v=localStorage.getItem(MOTION_KEY)||u.profileCardMotion||'none';return validMotion.includes(v)?v:'none';}
  function getFont(){const u=readUser();const v=localStorage.getItem(FONT_KEY)||u.profileFont||'inter';return validFont.includes(v)?v:'inter';}
  function saveMotionFont(){
    const m=q('#dlinkyCardMotionFixed')?.value||getMotion();
    const f=q('#dlinkyProfileFontFixed')?.value||getFont();
    const motion=validMotion.includes(m)?m:'none';
    const font=validFont.includes(f)?f:'inter';
    localStorage.setItem(MOTION_KEY,motion);
    localStorage.setItem(FONT_KEY,font);
    writeUser({profileCardMotion:motion,profileFont:font});
  }
  function ensureFontControl(){
    const tab=q('#tab-custom'); if(!tab)return;
    // remove duplicados antigos do mesmo controle, se existirem
    qa('#dlinkyProfileFontFixed').slice(1).forEach(el=>{const lab=el.closest('label'); if(lab)lab.remove(); else el.remove();});
    if(q('#dlinkyProfileFontFixed',tab)){
      const sel=q('#dlinkyProfileFontFixed',tab); if(document.activeElement!==sel)sel.value=getFont();
      return;
    }
    const motionLab=q('#dlinkyCardMotionFixed',tab)?.closest('label');
    const bio=q('#customBio',tab)?.closest('label')||q('#customBio',tab)?.parentElement;
    const host=motionLab||bio||tab;
    const lab=document.createElement('label');
    lab.className='dlinky-font-fixed-control';
    lab.innerHTML='<b>Fonte dos textos do perfil</b><select id="dlinkyProfileFontFixed"><option value="inter">Padrão</option><option value="poppins">Poppins</option><option value="montserrat">Montserrat</option><option value="orbitron">Gamer / Tech</option><option value="mono">Monospace</option><option value="serif">Serif elegante</option><option value="cursive">Cursiva</option></select>';
    host.insertAdjacentElement('afterend',lab);
    q('#dlinkyProfileFontFixed',tab).value=getFont();
  }
  function getProfileCard(){return q('#profileCard')||q('.profile-wrap');}
  let boundCard=null;
  function resetTransforms(card){
    if(!card)return;
    card.style.removeProperty('transform');
    qa('.profile-banner,.avatar-decoration,.profile-links,.profile-socials,.profile-meta',card).forEach(el=>el.style.removeProperty('transform'));
  }
  function bindMouseMotion(card){
    if(!card || boundCard===card)return;
    boundCard=card;
    card.addEventListener('mousemove',ev=>{
      const motion=getMotion();
      if(motion!=='tilt' && motion!=='parallax')return;
      const r=card.getBoundingClientRect();
      const x=(ev.clientX-r.left)/Math.max(r.width,1)-0.5;
      const y=(ev.clientY-r.top)/Math.max(r.height,1)-0.5;
      if(motion==='tilt'){
        card.style.transform=`perspective(900px) rotateX(${(-y*7).toFixed(2)}deg) rotateY(${(x*7).toFixed(2)}deg) translateY(-4px)`;
      }else{
        card.style.transform=`translate3d(${(x*10).toFixed(1)}px,${(y*10).toFixed(1)}px,0)`;
        const banner=q('.profile-banner',card); if(banner)banner.style.transform=`translate3d(${(x*14).toFixed(1)}px,${(y*8).toFixed(1)}px,0) scale(1.03)`;
        const avatar=q('.avatar-decoration',card); if(avatar)avatar.style.transform=`translate3d(${(-x*18).toFixed(1)}px,${(-y*12).toFixed(1)}px,0)`;
        const links=q('.profile-links',card); if(links)links.style.transform=`translate3d(${(-x*8).toFixed(1)}px,${(-y*6).toFixed(1)}px,0)`;
      }
    });
    card.addEventListener('mouseleave',()=>{resetTransforms(card);});
  }
  function applyMotionAndFont(){
    const card=getProfileCard();
    const motion=getMotion();
    const font=getFont();
    if(card){
      card.classList.remove('dlinky-motion-none','dlinky-motion-float','dlinky-motion-pulse','dlinky-motion-tilt','dlinky-motion-parallax');
      card.classList.add('dlinky-motion-'+motion);
      card.style.setProperty('--dlinky-profile-font',fontMap[font]||fontMap.inter);
      card.style.fontFamily='var(--dlinky-profile-font)';
      if(motion==='none'||motion==='float'||motion==='pulse')resetTransforms(card);
      bindMouseMotion(card);
    }
    const page=q('#profile')||q('.profile-page');
    if(page){
      page.style.setProperty('--dlinky-profile-font',fontMap[font]||fontMap.inter);
      page.style.fontFamily='var(--dlinky-profile-font)';
    }
    const fontSel=q('#dlinkyProfileFontFixed'); if(fontSel && document.activeElement!==fontSel)fontSel.value=font;
    const motionSel=q('#dlinkyCardMotionFixed'); if(motionSel && document.activeElement!==motionSel)motionSel.value=motion;
  }
  document.addEventListener('change',e=>{
    if(e.target && (e.target.id==='dlinkyCardMotionFixed'||e.target.id==='dlinkyProfileFontFixed')){
      saveMotionFont();
      requestAnimationFrame(applyMotionAndFont);
      setTimeout(applyMotionAndFont,120);
    }
  });
  document.addEventListener('click',e=>{
    if(e.target?.closest?.('#saveCustom,#saveCustomFinal,#saveCustomFinal2,#saveCustomFinalReal,#saveLayout')){
      saveMotionFont();
      setTimeout(()=>{ensureFontControl();applyMotionAndFont();},80);
    }
  });
  const oldOpen=window.openTab;
  if(oldOpen){window.openTab=function(id){const r=oldOpen.apply(this,arguments); if(id==='custom'||id==='layout')setTimeout(()=>{ensureFontControl();applyMotionAndFont();},120); return r;};}
  const oldDash=window.renderDash;
  if(oldDash){window.renderDash=function(){const r=oldDash.apply(this,arguments); setTimeout(()=>{ensureFontControl();applyMotionAndFont();},120); return r;};}
  const oldProfile=window.renderProfile;
  if(oldProfile){window.renderProfile=function(){const r=oldProfile.apply(this,arguments); requestAnimationFrame(applyMotionAndFont); setTimeout(applyMotionAndFont,180); return r;};}
  window.addEventListener('hashchange',()=>setTimeout(()=>{ensureFontControl();applyMotionAndFont();},120));
  setInterval(()=>{ if(q('#tab-custom.active'))ensureFontControl(); if(q('#profile.active,.profile-page.active'))applyMotionAndFont(); },900);
  setTimeout(()=>{ensureFontControl();applyMotionAndFont();},250);
})();

/* === HOTFIX: restaurar ícones sociais + partículas animadas reais === */
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  function readUser(){try{return JSON.parse(localStorage.getItem('dlinkyUser')||'{}')||{};}catch{return {};}}
  function isProfile(){return !!q('#profile.active,.profile-page.active,#profile.page.active');}
  const iconMap={
    Instagram:'fa-brands fa-instagram', TikTok:'fa-brands fa-tiktok', Discord:'fa-brands fa-discord',
    YouTube:'fa-brands fa-youtube', Spotify:'fa-brands fa-spotify', WhatsApp:'fa-brands fa-whatsapp',
    Twitch:'fa-brands fa-twitch', Steam:'fa-brands fa-steam', Github:'fa-brands fa-github',
    Roblox:'fa-solid fa-square', Telegram:'fa-brands fa-telegram', X:'fa-brands fa-x-twitter'
  };
  function safeUrl(u){u=String(u||'');return /^https?:\/\//i.test(u)?u:'#';}
  function cleanBrand(n){return String(n||'link').toLowerCase().replace(/[^a-z0-9]/g,'');}
  function restoreSocialIcons(){
    const box=q('#profileSocials'); if(!box)return;
    const u=readUser(); const list=Array.isArray(u.socials)?u.socials:[];
    if(!list.length)return;
    box.innerHTML=list.filter(s=>s&&s.on).map(s=>{
      const name=String(s.name||'Link');
      const cls=iconMap[name]||'fa-solid fa-link';
      return `<a class="social-icon brand-${cleanBrand(name)}" target="_blank" title="${name.replace(/"/g,'&quot;')}" href="${safeUrl(s.url)}"><i class="${cls}"></i></a>`;
    }).join('');
  }
  function clearAllFx(){
    const old=q('#profileParticleLayer'); if(old)old.innerHTML='';
    q('#dlinkySingleBgFx')?.remove();
    q('#dlinkyStableBgFx')?.remove();
  }
  function renderFallingFx(){
    if(!isProfile())return;
    const u=readUser(); const fx=String(u.bgFx||'none');
    clearAllFx();
    if(!['snow','stars','raios','scan'].includes(fx))return;
    const layer=document.createElement('div');
    layer.id='dlinkyStableBgFx';
    layer.className='dlinky-fixed-fall-fx fx-'+fx;
    if(fx==='scan'){
      const scan=document.createElement('span'); scan.className='dlinky-scanline-fixed'; layer.appendChild(scan);
      document.body.appendChild(layer); return;
    }
    const count=fx==='snow'?38:(fx==='stars'?34:10);
    for(let i=0;i<count;i++){
      const sp=document.createElement('span');
      sp.textContent=fx==='snow'?'❄':(fx==='raios'?'⚡':'✦');
      sp.style.left=(Math.random()*100)+'%';
      sp.style.setProperty('--drift', ((Math.random()*46)-23).toFixed(1)+'px');
      sp.style.animationDelay=(-Math.random()*12).toFixed(2)+'s';
      sp.style.animationDuration=(fx==='raios'?(4+Math.random()*4):(7+Math.random()*9)).toFixed(2)+'s';
      sp.style.fontSize=(fx==='snow'?(10+Math.random()*13):(fx==='raios'?(14+Math.random()*12):(12+Math.random()*14))).toFixed(1)+'px';
      layer.appendChild(sp);
    }
    document.body.appendChild(layer);
  }
  function applyFixes(){restoreSocialIcons();renderFallingFx();}
  const oldProfile=window.renderProfile;
  if(oldProfile){window.renderProfile=function(){const r=oldProfile.apply(this,arguments);requestAnimationFrame(applyFixes);setTimeout(applyFixes,160);return r;};}
  window.addEventListener('hashchange',()=>setTimeout(applyFixes,180));
  document.addEventListener('change',e=>{if(e.target&&e.target.id==='customBgFx')setTimeout(renderFallingFx,80);});
  document.addEventListener('click',e=>{if(e.target?.closest?.('#saveCustom,#saveCustomFinal,#saveCustomFinal2,#saveCustomFinalReal'))setTimeout(applyFixes,160);});
  setInterval(()=>{if(isProfile())restoreSocialIcons();},1500);
  setTimeout(applyFixes,250);
})();

/* === FINAL FIX DEFINITIVO: ícones sociais + partículas com animação própria === */
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  let raf=0, particles=[], activeFx='';
  const iconMap={
    Instagram:'fa-brands fa-instagram', TikTok:'fa-brands fa-tiktok', Discord:'fa-brands fa-discord',
    YouTube:'fa-brands fa-youtube', Spotify:'fa-brands fa-spotify', WhatsApp:'fa-brands fa-whatsapp',
    Twitch:'fa-brands fa-twitch', Steam:'fa-brands fa-steam', Github:'fa-brands fa-github',
    Roblox:'fa-solid fa-square', Telegram:'fa-brands fa-telegram', X:'fa-brands fa-x-twitter'
  };
  function readUser(){try{return JSON.parse(localStorage.getItem('dlinkyUser')||'{}')||{};}catch(e){return {};}}
  function saveUserObj(u){localStorage.setItem('dlinkyUser',JSON.stringify(u));}
  function isProfile(){return !!q('#profile.active,.profile-page.active');}
  function safeUrl(u){u=String(u||'');return /^https?:\/\//i.test(u)?u:'#';}
  function brand(n){return String(n||'link').toLowerCase().replace(/[^a-z0-9]/g,'');}
  function clearOldFx(){
    const ppl=q('#profileParticleLayer'); if(ppl) ppl.innerHTML='';
    ['#dlinkySingleBgFx','#dlinkyStableBgFx','#dlinkyFixedFallFxFinal'].forEach(id=>q(id)?.remove());
  }
  function stopFx(){
    if(raf){cancelAnimationFrame(raf);raf=0;}
    particles=[];activeFx='';
    q('#dlinkyFxAutoFinal')?.remove();
    clearOldFx();
  }
  function restoreIcons(){
    const box=q('#profileSocials'); if(!box) return;
    const u=readUser();
    let list=Array.isArray(u.socials)?u.socials:[];
    if(!list.length){
      list=[{name:'TikTok',url:'#',on:true},{name:'Discord',url:'#',on:true},{name:'Spotify',url:'#',on:true}];
    }
    box.innerHTML=list.filter(s=>s&&s.on!==false).map(s=>{
      const name=String(s.name||'Link');
      const cls=iconMap[name]||'fa-solid fa-link';
      return `<a class="social-icon brand-${brand(name)}" target="_blank" title="${name.replace(/"/g,'&quot;')}" href="${safeUrl(s.url)}"><i class="${cls}" aria-hidden="true"></i></a>`;
    }).join('');
  }
  function startFx(){
    if(!isProfile()){stopFx();return;}
    const u=readUser();
    const fx=String(u.bgFx||u.particleType||'none').toLowerCase();
    clearOldFx();
    if(!['snow','stars','raios','scan'].includes(fx)){stopFx();return;}
    let layer=q('#dlinkyFxAutoFinal');
    if(activeFx===fx && layer) return;
    stopFx();
    layer=document.createElement('div');
    layer.id='dlinkyFxAutoFinal';
    layer.className='fx-'+fx;
    document.body.appendChild(layer);
    activeFx=fx;
    if(fx==='scan') return;
    const W=()=>window.innerWidth||document.documentElement.clientWidth||1200;
    const H=()=>window.innerHeight||document.documentElement.clientHeight||800;
    const count=fx==='snow'?40:(fx==='stars'?34:12);
    const symbol=fx==='snow'?'❄':(fx==='raios'?'⚡':'✦');
    particles=[];
    for(let i=0;i<count;i++){
      const el=document.createElement('span');
      el.className='fx-auto-item';
      el.textContent=symbol;
      const size=fx==='snow'?(10+Math.random()*14):(fx==='raios'?(14+Math.random()*13):(11+Math.random()*13));
      el.style.fontSize=size+'px';
      layer.appendChild(el);
      particles.push({
        el,
        x:Math.random()*W(),
        y:Math.random()*H(),
        speed:fx==='raios'?(0.75+Math.random()*1.25):(0.35+Math.random()*0.95),
        drift:(Math.random()*0.7)-0.35,
        rot:Math.random()*360,
        rotSpeed:(Math.random()*1.8)-0.9,
        size
      });
    }
    function tick(){
      const w=W(), h=H();
      for(const p of particles){
        p.y+=p.speed; p.x+=p.drift; p.rot+=p.rotSpeed;
        if(p.y>h+40){p.y=-40; p.x=Math.random()*w;}
        if(p.x<-50)p.x=w+30; if(p.x>w+50)p.x=-30;
        p.el.style.transform=`translate3d(${p.x}px,${p.y}px,0) rotate(${p.rot}deg)`;
      }
      raf=requestAnimationFrame(tick);
    }
    raf=requestAnimationFrame(tick);
  }
  function applyAll(){restoreIcons();startFx();}
  const oldProfile=window.renderProfile;
  if(typeof oldProfile==='function'){
    window.renderProfile=function(){const r=oldProfile.apply(this,arguments);setTimeout(applyAll,60);setTimeout(applyAll,250);return r;};
  }
  window.addEventListener('hashchange',()=>setTimeout(applyAll,180));
  document.addEventListener('change',e=>{if(e.target&&e.target.id==='customBgFx'){const u=readUser();u.bgFx=e.target.value;saveUserObj(u);setTimeout(applyAll,80);}});
  document.addEventListener('click',e=>{if(e.target?.closest?.('#saveCustom,#saveCustomFinal,#saveCustomFinal2,#saveCustomFinalReal,.btn'))setTimeout(applyAll,180);});
  window.addEventListener('resize',()=>setTimeout(applyAll,80));
  setInterval(()=>{if(isProfile())restoreIcons();else stopFx();},1800);
  setTimeout(applyAll,300);
})();

/* === ULTRA FINAL: somente 1 camada de efeito animada, remove camada travada === */
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>[...r.querySelectorAll(s)];
  let raf=0, list=[], running='';
  function readUser(){try{return JSON.parse(localStorage.getItem('dlinkyUser')||'{}')||{};}catch{return {};}}
  function isProfile(){return !!q('#profile.active,.profile-page.active,#profile.page.active');}
  function killLegacyFx(){
    const ids=['#dlinkySingleBgFx','#dlinkyStableBgFx','#dlinkyFixedFallFxFinal'];
    ids.forEach(sel=>qa(sel).forEach(el=>el.remove()));
    const ppl=q('#profileParticleLayer');
    if(ppl){ppl.innerHTML='';ppl.style.setProperty('display','none','important');}
    const old=q('#particlesCanvas');
    if(old && isProfile()) old.style.setProperty('display','none','important');
  }
  function stop(){
    if(raf){cancelAnimationFrame(raf);raf=0;}
    list=[];running='';
    q('#dlinkyOnlyMovingFx')?.remove();
    killLegacyFx();
  }
  function start(){
    killLegacyFx();
    if(!isProfile()){stop();return;}
    const u=readUser();
    const fx=String(u.bgFx||'none').toLowerCase();
    if(!['snow','stars','raios','scan'].includes(fx)){stop();return;}
    if(running===fx && q('#dlinkyOnlyMovingFx')) return;
    stop();
    running=fx;
    const layer=document.createElement('div');
    layer.id='dlinkyOnlyMovingFx';
    layer.className='only-moving-fx fx-'+fx;
    document.body.appendChild(layer);
    if(fx==='scan') return;
    const sym=fx==='snow'?'❄':(fx==='raios'?'⚡':'✦');
    const count=fx==='snow'?42:(fx==='stars'?36:12);
    const W=()=>innerWidth||document.documentElement.clientWidth||1200;
    const H=()=>innerHeight||document.documentElement.clientHeight||800;
    for(let i=0;i<count;i++){
      const el=document.createElement('span');
      el.textContent=sym;
      el.className='only-moving-item';
      const size=fx==='snow'?(10+Math.random()*13):(fx==='raios'?(14+Math.random()*12):(11+Math.random()*13));
      el.style.fontSize=size+'px';
      layer.appendChild(el);
      list.push({
        el,
        x:Math.random()*W(),
        y:Math.random()*H(),
        vy:fx==='raios'?(0.9+Math.random()*1.4):(0.45+Math.random()*1.05),
        vx:(Math.random()*0.8)-0.4,
        rot:Math.random()*360,
        vr:(Math.random()*1.4)-0.7
      });
    }
    function frame(){
      killLegacyFx();
      const w=W(), h=H();
      for(const p of list){
        p.y+=p.vy; p.x+=p.vx; p.rot+=p.vr;
        if(p.y>h+45){p.y=-45;p.x=Math.random()*w;}
        if(p.x<-60)p.x=w+40; if(p.x>w+60)p.x=-40;
        p.el.style.transform=`translate3d(${p.x}px,${p.y}px,0) rotate(${p.rot}deg)`;
      }
      raf=requestAnimationFrame(frame);
    }
    raf=requestAnimationFrame(frame);
  }
  function boot(){setTimeout(start,60);setTimeout(start,250);}
  const oldRender=window.renderProfile;
  if(typeof oldRender==='function'){
    window.renderProfile=function(){const r=oldRender.apply(this,arguments);boot();return r;};
  }
  window.addEventListener('hashchange',boot);
  document.addEventListener('change',e=>{if(e.target&&e.target.id==='customBgFx'){stop();setTimeout(start,80);}});
  document.addEventListener('click',e=>{if(e.target?.closest?.('#saveCustom,#saveCustomFinal,#saveCustomFinal2,#saveCustomFinalReal'))boot();});
  setInterval(()=>{ if(isProfile()) start(); else stop(); },1200);
  setInterval(()=>{ if(isProfile()) killLegacyFx(); },250);
  boot();
})();





/* =========================================================
   PATCH FINAL PEDIDO — ADMIN INSÍGNIAS MANUAL LIMPO
   - Remove Admin Selos completamente
   - Limpa insígnias antigas quebradas 1 vez nesta versão
   - Admin Insígnias permite adicionar por URL e EXCLUIR funcionando
   - Aba Loja > Insígnias mostra SOMENTE as insígnias cadastradas no admin
   - Não mexe em Molduras, Recarga, Efeitos ou Outros
   ========================================================= */

/* ===== DLINKY HOTFIX DEFINITIVO — INSIGNIAS SOMENTE MANUAL, COM EXCLUIR REAL ===== */












/* ===== DLINKY — RECARGA E EFEITOS LIMPOS DO ZERO ===== */
(function(){
  const USER_KEY = "dlinkyUser";
  const COINS_KEY = "dlinkyCleanCoins";
  const EFFECTS_KEY = "dlinkyCleanEffects";

  const EFFECT_MAP = {
    fxNeonName: "neonName",
    fxShineName: "shineName",
    fxRainbowName: "rainbowName",
    fxPerspective: "perspective"
  };

  function q(s,r=document){return r.querySelector(s)}
  function qa(s,r=document){return Array.from(r.querySelectorAll(s))}
  function toastMsg(t){try{if(typeof toast==="function")return toast(t)}catch(e){} alert(t)}

  function readJSON(key, fallback){
    try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch(e){return fallback}
  }
  function writeJSON(key, value){
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getUser(){
    const saved = readJSON(USER_KEY, {});
    if(window.user){
      Object.assign(window.user, saved);
      return window.user;
    }
    return saved;
  }

  function saveUser(patch){
    const merged = Object.assign({}, getUser(), patch || {});
    writeJSON(USER_KEY, merged);
    if(window.user) Object.assign(window.user, merged);
    return merged;
  }

  function getCoins(){
    const fixed = localStorage.getItem(COINS_KEY);
    if(fixed !== null && fixed !== "") return Number(fixed || 0);

    const u = getUser();
    const initial = Number(u.coins ?? u.linkwuans ?? 0);
    localStorage.setItem(COINS_KEY, String(initial));
    return initial;
  }

  function setCoins(value){
    value = Number(value || 0);
    localStorage.setItem(COINS_KEY, String(value));
    saveUser({coins:value, linkwuans:value});

    if(window.user){
      window.user.coins = value;
      window.user.linkwuans = value;
    }

    renderWallet(value);
    setTimeout(()=>renderWallet(value), 30);
    setTimeout(()=>renderWallet(value), 120);
    setTimeout(()=>renderWallet(value), 350);
    setTimeout(()=>renderWallet(value), 1000);
  }

  function addCoins(amount){
    amount = Number(amount || 0);
    if(!amount) return;
    setCoins(getCoins() + amount);
  }

  function renderWallet(value=getCoins()){
    // IDs conhecidos
    ["coinCount","walletCoins","invCoins","dashCoins","sideCoins","linkwuansCount"].forEach(id=>{
      const el = q("#"+id);
      if(el) el.textContent = value;
    });

    // Atualiza o card de Carteira/Saldo sem depender de ID.
    qa("body *").forEach(el=>{
      if(!el || el.children.length > 6) return;

      const txt = (el.textContent || "").trim();
      const parentTxt = (el.parentElement?.textContent || "").toLowerCase();

      if((parentTxt.includes("carteira") || parentTxt.includes("saldo")) && /^\d+$/.test(txt)){
        el.textContent = value;
      }
    });

    qa(".card,.panel,[class*='wallet'],[class*='saldo'],[class*='carteira']").forEach(card=>{
      const txt = (card.textContent || "").toLowerCase();
      if(!txt.includes("carteira") && !txt.includes("saldo")) return;

      const num = qa("b,strong,span",card).find(x=>/^\d+$/.test((x.textContent || "").trim()));
      if(num) num.textContent = value;
    });
  }

  // protege renderDash antigo para ele nunca voltar saldo antigo
  function patchRenderDash(){
    const old = window.renderDash;
    if(typeof old !== "function" || old.__dlinkyCleanPatched) return;

    const patched = function(){
      const coins = getCoins();
      if(window.user){
        window.user.coins = coins;
        window.user.linkwuans = coins;
      }
      const result = old.apply(this, arguments);
      renderWallet(coins);
      setTimeout(()=>renderWallet(coins), 20);
      setTimeout(()=>renderWallet(coins), 120);
      return result;
    };
    patched.__dlinkyCleanPatched = true;

    window.renderDash = patched;
    try{ renderDash = patched; }catch(e){}
  }

  function storeRoot(){
    return q("#tab-store");
  }

  function activeShopMode(){
    const store = storeRoot();
    if(!store) return "";

    const active =
      q("[data-shop-tab].active",store) ||
      q(".asset-tabs button.active",store) ||
      q(".shop-tabs button.active",store) ||
      q("button.active",store);

    const raw = ((active?.dataset?.shopTab || "") + " " + (active?.textContent || "")).toLowerCase();

    if(raw.includes("recarga") || raw.includes("coin") || raw.includes("recharge")) return "recarga";
    if(raw.includes("efeito") || raw.includes("effect")) return "efeitos";
    if(raw.includes("moldura") || raw.includes("frame")) return "molduras";
    if(raw.includes("outro") || raw.includes("other")) return "outros";
    return raw;
  }

  function shopGrid(){
    const store = storeRoot();
    if(!store) return null;
    return q("#shopGrid",store) || q(".shop-grid",store) || q(".asset-grid",store);
  }

  function renderCleanRecharge(){
    if(activeShopMode() !== "recarga") return;

    const grid = shopGrid();
    if(!grid) return;

    if(grid.dataset.cleanRecharge === "1") return;

    grid.dataset.cleanRecharge = "1";
    grid.classList.add("dlinky-clean-recharge-grid");
    grid.innerHTML = `
      <div class="dlinky-clean-recharge-card">
        <h3>345 Linkwuans</h3>
        <p>R$ 30,00</p>
        <small>+15% bônus</small>
        <button type="button" data-clean-buy-coins="345">☉ Recarregar</button>
      </div>
      <div class="dlinky-clean-recharge-card">
        <h3>650 Linkwuans</h3>
        <p>R$ 50,00</p>
        <small>+30% bônus</small>
        <button type="button" data-clean-buy-coins="650">☉ Recarregar</button>
      </div>
      <div class="dlinky-clean-recharge-card">
        <h3>1450 Linkwuans</h3>
        <p>R$ 100,00</p>
        <small>+45% bônus</small>
        <button type="button" data-clean-buy-coins="1450">☉ Recarregar</button>
      </div>
      <div class="dlinky-clean-recharge-card best">
        <h3>3300 Linkwuans</h3>
        <p>R$ 200,00</p>
        <small>+65% bônus</small>
        <button type="button" data-clean-buy-coins="3300">☉ Recarregar</button>
      </div>
    `;
  }

  function clearRechargeFlagWhenLeave(){
    if(activeShopMode() === "recarga") return;
    const grid = shopGrid();
    if(!grid) return;
    grid.dataset.cleanRecharge = "";
    grid.classList.remove("dlinky-clean-recharge-grid");
  }

  function unlockStore(){
    const store = storeRoot();
    if(!store) return;
    qa("button",store).forEach(btn=>{
      btn.disabled = false;
      btn.removeAttribute("disabled");
      btn.style.pointerEvents = "auto";
      btn.style.cursor = "pointer";
    });
  }

  function cleanShopTick(){
    unlockStore();
    clearRechargeFlagWhenLeave();
    // não recria mais a recarga rosa por cima; mantém a loja original com "Comprar"
  }

  function getEffects(){
    const base = readJSON(EFFECTS_KEY, {});
    const u = getUser();
    return Object.assign({
      neonName: !!u.neonName,
      shineName: !!u.shineName,
      rainbowName: !!u.rainbowName,
      perspective: !!u.perspective
    }, base);
  }

  function saveEffects(patch){
    const merged = Object.assign({}, getEffects(), patch || {});
    writeJSON(EFFECTS_KEY, merged);
    saveUser(merged);
    syncEffectChecks();
    applyEffects();
  }

  function syncEffectChecks(){
    const e = getEffects();
    Object.entries(EFFECT_MAP).forEach(([id,key])=>{
      const el = q("#"+id);
      if(el) el.checked = !!e[key];
    });
  }

  function saveChecksFromScreen(){
    const patch = {};
    Object.entries(EFFECT_MAP).forEach(([id,key])=>{
      const el = q("#"+id);
      if(el) patch[key] = !!el.checked;
    });
    saveEffects(patch);
  }

  function applyEffects(){
    const e = getEffects();

    const name =
      q("#profileName") ||
      q("#publicName") ||
      q(".profile-name") ||
      q(".perfil-nome");

    if(name){
      name.classList.toggle("dlinky-neon-name", !!e.neonName);
      name.classList.toggle("dlinky-shine-name", !!e.shineName);
      name.classList.toggle("dlinky-rainbow-name", !!e.rainbowName);
    }

    const card =
      q(".profile-wrap") ||
      q("#profileCard") ||
      q(".profile-card");

    if(card){
      card.classList.toggle("dlinky-perspective-card", !!e.perspective);
    }
  }

  function buyEffectFromCard(card){
    const txt = (card?.textContent || "").toLowerCase();
    const patch = {};

    if(txt.includes("neon")) patch.neonName = true;
    if(txt.includes("brilho") || txt.includes("brilhante")) patch.shineName = true;
    if(txt.includes("colorido")) patch.rainbowName = true;
    if(txt.includes("perspectiva")) patch.perspective = true;

    if(!Object.keys(patch).length) return false;

    saveEffects(patch);
    return true;
  }

  function cardFor(el){
    const store = storeRoot();
    let node = el;
    let best = null;

    while(node && node !== store && node !== document.body){
      const txt = (node.textContent || "").toLowerCase();

      if(
        txt.includes("linkwuan") ||
        txt.includes("neon") ||
        txt.includes("brilho") ||
        txt.includes("colorido") ||
        txt.includes("perspectiva")
      ){
        best = node;
      }

      node = node.parentElement;
    }

    return best || el.closest("div");
  }

  function amountFromCard(card){
    const m = (card?.textContent || "").match(/(\d{2,6})\s*linkwuan/i);
    return m ? Number(m[1]) : 0;
  }

  function handleShopClick(e){
    const store = storeRoot();
    const btn = e.target.closest("button,.btn");
    if(!store || !btn || !store.contains(btn)) return;

    const mode = activeShopMode();
    const txt = (btn.textContent || "").toLowerCase();

    if(mode === "recarga"){

      if(!(txt.includes("comprar") || txt.includes("recarregar"))){
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const clickedButton = btn.closest("button");

      let amount = Number(clickedButton?.dataset?.cleanBuyCoins || 0);

      // fallback caso dataset falhe
      if(!amount){
        const card = cardFor(btn);

        if(card){
          const title = card.querySelector("h3");
          const match = title?.textContent?.match(/(\d+)/);

          if(match){
            amount = Number(match[1]);
          }
        }
      }

      if(!amount || isNaN(amount)){
        return;
      }

      const currentCoins = Number(getCoins() || 0);
      const updatedCoins = currentCoins + amount;

      setCoins(updatedCoins);

      toastMsg("Recarga adicionada: " + amount + " Linkwuans");

      return;
    }

    if(mode === "efeitos" && txt.includes("comprar")){
      e.preventDefault();
      e.stopImmediatePropagation();

      if(buyEffectFromCard(cardFor(btn))){
        toastMsg("Efeito comprado e ativado!");
      }
      return;
    }
  }

  function handleEffectCheckClick(e){
    const input = e.target.closest("#fxNeonName,#fxShineName,#fxRainbowName,#fxPerspective");
    if(input){
      setTimeout(saveChecksFromScreen, 10);
      return;
    }

    const label = e.target.closest("label");
    if(!label) return;

    const box = label.querySelector("input[type='checkbox']");
    if(!box || !EFFECT_MAP[box.id]) return;

    e.preventDefault();
    box.checked = !box.checked;
    saveChecksFromScreen();
  }

  ["click","mouseup","pointerup"].forEach(ev=>{
    document.addEventListener(ev, handleShopClick, true);
  });

  document.addEventListener("click", handleEffectCheckClick, true);

  document.addEventListener("change", function(e){
    if(e.target && EFFECT_MAP[e.target.id]){
      saveChecksFromScreen();
    }
  }, true);

  document.addEventListener("DOMContentLoaded", function(){
    setTimeout(function(){
      patchRenderDash();
      renderWallet();
      syncEffectChecks();
      applyEffects();
      cleanShopTick();
    }, 250);
  });

  window.addEventListener("hashchange", function(){
    setTimeout(function(){
      patchRenderDash();
      renderWallet();
      syncEffectChecks();
      applyEffects();
      cleanShopTick();
    }, 250);
  });

  setInterval(function(){
    patchRenderDash();
    renderWallet();
    applyEffects();
    cleanShopTick();
  }, 700);
})();









/* ===== DLINKY — CORES TAGS ABA CERTA FINAL ===== */
(function(){
  const KEY="dlinkyCleanColorsTagsV3";
  const TAGS=[
    ["☮️","Paz","paz"],["💻","Programador","programador"],["🖌️","Artista","artista"],
    ["🎨","Designer","designer"],["📝","Escritor","escritor"],["💸","Investidor","investidor"],
    ["🎸","Músico","musico"],["📷","Fotógrafo","fotografo"],["🏕️","Ar Livre","arlivre"],
    ["🍺","Bebida","bebida"],["🍽️","Comida","comida"],["🎬","Filmes","filmes"],
    ["📺","Seriados","seriados"],["🚬","Fumante","fumante"],["📊","Negócios","negocios"],
    ["💪","Academia","academia"],["📚","Leitor","leitor"],["🏃","Atleta","atleta"],
    ["🧪","Ciência","ciencia"],["💋","Bonito(a)","bonito"],["🌶️","Picante","picante"],
    ["🐾","Animais","animais"],["🎮","Gamer","gamer"],["😇","Anjo(a)","anjo"],
    ["😈","Perigoso(a)","perigoso"],["🛹","Skatista","skatista"],["🏀","Basquete","basquete"],
    ["❄️","Frio","frio"],["🇧🇷","Brasil","brasil"],["🌈","Lgbt","lgbt"],
    ["⚽","Futebol","futebol"],["🔥","Valente","valente"],["🧊","Counter-Strike 2","cs2"],
    ["💎","Paladins","paladins"],["🎯","Fortnite","fortnite"]
  ];

  function q(s,r=document){return r.querySelector(s)}
  function qa(s,r=document){return Array.from(r.querySelectorAll(s))}
  function toastMsg(t){try{if(typeof toast==="function")return toast(t)}catch(e){} alert(t)}

  function cfg(){
    try{
      return Object.assign({
        showFree:true,
        showDlinky:true,
        tags:["programador","artista","musico"],
        profileBg:"#1E40AF",
        cardBg:"#000000",
        textColor:"#FFFFFF",
        bioColor:"#FFFFFF"
      },JSON.parse(localStorage.getItem(KEY)||"{}"));
    }catch(e){
      return {showFree:true,showDlinky:true,tags:["programador","artista","musico"],profileBg:"#1E40AF",cardBg:"#000000",textColor:"#FFFFFF",bioColor:"#FFFFFF"};
    }
  }
  function save(c){localStorage.setItem(KEY,JSON.stringify(c))}

  function renderAdmin(){
    const box=q("#ctTagsList");
    if(!box) return;

    const c=cfg();
    const fields={
      ctShowFree:c.showFree,
      ctShowDlinky:c.showDlinky,
      ctProfileBg:c.profileBg,
      ctCardBg:c.cardBg,
      ctTextColor:c.textColor,
      ctBioColor:c.bioColor
    };

    Object.entries(fields).forEach(([id,val])=>{
      const el=q("#"+id);
      if(!el) return;
      if(el.type==="checkbox") el.checked=!!val;
      else el.value=val;
    });

    box.innerHTML=TAGS.map(([ico,name,id])=>`
      <button type="button" class="zyo-tag-chip ${c.tags.includes(id)?"active":""}" data-ct-tag="${id}">
        ${ico} ${name}
      </button>
    `).join("");
  }

  function collect(){
    const c=cfg();
    const ids=["ctShowFree","ctShowDlinky","ctProfileBg","ctCardBg","ctTextColor","ctBioColor"];
    ids.forEach(id=>{
      const el=q("#"+id);
      if(!el) return;
      if(id==="ctShowFree") c.showFree=el.checked;
      if(id==="ctShowDlinky") c.showDlinky=el.checked;
      if(id==="ctProfileBg") c.profileBg=el.value;
      if(id==="ctCardBg") c.cardBg=el.value;
      if(id==="ctTextColor") c.textColor=el.value;
      if(id==="ctBioColor") c.bioColor=el.value;
    });
    save(c);
    applyProfile();
  }

  function toggleTag(id){
    const c=cfg();
    c.tags=Array.isArray(c.tags)?c.tags:[];
    c.tags = c.tags.includes(id) ? c.tags.filter(x=>x!==id) : [...c.tags,id];
    save(c);
    renderAdmin();
    applyProfile();
  }

  function profileName(){
    return q("#profileName") || q("#publicName") || q(".profile-name") || q(".perfil-nome") || q("h1");
  }

  function applyProfile(){
    const c=cfg();
    const name=profileName();
    const card=q(".profile-wrap") || q("#profileCard") || q(".profile-card") || q(".public-card") || q(".card-profile");

    if(card){
      card.style.backgroundColor=c.cardBg || "";
      card.style.color=c.textColor || "";
    }
    if(name) name.style.color=c.textColor || "";

    const bio=q(".profile-bio") || q(".bio") || q("#profileBio");
    if(bio) bio.style.color=c.bioColor || "";

    qa(".profile-tags,.tags-profile,.perfil-tags,.user-tags").forEach(el=>{
      if(!el.dataset.cleanHidden){
        el.style.display="none";
        el.dataset.cleanHidden="1";
      }
    });

    let cont=q("#dlinkyProfileTags");
    if(!cont && name){
      cont=document.createElement("div");
      cont.id="dlinkyProfileTags";
      cont.className="dlinky-profile-tags";
      name.insertAdjacentElement("afterend",cont);
    }
    if(!cont) return;

    const html=[];
    if(c.showFree === true) html.push(`<span class="tag">✦ grátis</span>`);
    if(c.showDlinky === true) html.push(`<span class="tag">⚡ dlinky</span>`);

    (c.tags||[]).forEach(id=>{
      const t=TAGS.find(x=>x[2]===id);
      if(t) html.push(`<span class="tag">${t[0]} ${t[1].toLowerCase()}</span>`);
    });

    cont.innerHTML=html.join("");
  }

  document.addEventListener("click",function(e){
    const chip=e.target.closest("[data-ct-tag]");
    if(chip){
      e.preventDefault();
      toggleTag(chip.dataset.ctTag);
      return;
    }

    const saveBtn=e.target.closest("#ctSaveBtn");
    if(saveBtn){
      e.preventDefault();
      collect();
      toastMsg("Cores e tags salvas!");
      return;
    }

    const colorsLink=e.target.closest('[data-tab="colors"]');
    if(colorsLink){
      setTimeout(renderAdmin,80);
    }

    setTimeout(applyProfile,120);
  });

  document.addEventListener("change",function(e){
    if(e.target && ["ctShowFree","ctShowDlinky","ctProfileBg","ctCardBg","ctTextColor","ctBioColor"].includes(e.target.id)){
      collect();
    }
  });

  document.addEventListener("DOMContentLoaded",function(){
    setTimeout(function(){
      renderAdmin();
      applyProfile();
    },300);
  });

  window.addEventListener("hashchange",function(){
    setTimeout(function(){
      renderAdmin();
      applyProfile();
    },300);
  });

  setInterval(applyProfile,1500);
})();


setInterval(()=>{
  document.querySelectorAll('.profile-badges,.profile-badge,.badges,.user-badges,.default-tags').forEach(el=>{
    el.style.display='none';
  });
},500);




/* ===== DLINKY — REMOVER GRATIS DLINKY POR TEXTO ===== */
(function(){
  const KEYS = [
    "dlinkyCleanColorsTagsV3",
    "dlinkyCleanColorsTagsV2",
    "dlinkyCleanColorsTags"
  ];

  function getCfg(){
    for(const key of KEYS){
      try{
        const raw = localStorage.getItem(key);
        if(raw) return JSON.parse(raw);
      }catch(e){}
    }
    return {showFree:true, showDlinky:true};
  }

  function isInsideAdmin(el){
    return !!(
      el.closest("#tab-colors") ||
      el.closest("#tab-colorsTags") ||
      el.closest(".zyo-ct-card") ||
      el.closest(".ct-clean-card") ||
      el.closest("aside") ||
      el.closest(".sidebar")
    );
  }

  function looksLikePill(el){
    if(!el || el.children.length > 3) return false;
    const st = getComputedStyle(el);
    const w = el.offsetWidth || 0;
    const h = el.offsetHeight || 0;

    return (
      w > 25 && w < 180 &&
      h > 14 && h < 60 &&
      (
        st.borderRadius !== "0px" ||
        st.backgroundColor !== "rgba(0, 0, 0, 0)" ||
        st.backgroundColor !== "transparent"
      )
    );
  }

  function cleanOldTags(){
    const cfg = getCfg();
    const hideFree = cfg.showFree === false;
    const hideDlinky = cfg.showDlinky === false;

    document.querySelectorAll(".dlinky-hide-old-tag").forEach(el=>{
      const txt = (el.textContent || "").toLowerCase().trim();
      if((txt.includes("grátis") || txt.includes("gratis")) && !hideFree){
        el.classList.remove("dlinky-hide-old-tag");
        el.style.display = "";
      }
      if(txt.includes("dlinky") && !hideDlinky){
        el.classList.remove("dlinky-hide-old-tag");
        el.style.display = "";
      }
    });

    if(!hideFree && !hideDlinky) return;

    const candidates = Array.from(document.querySelectorAll("span,div,a,button,small,p"));
    candidates.forEach(el=>{
      if(isInsideAdmin(el)) return;

      const txt = (el.textContent || "").toLowerCase().trim();
      if(!txt) return;

      const isFree = txt === "✦ grátis" || txt === "grátis" || txt === "gratis" || txt.includes("grátis");
      const isDlinky = txt === "⚡ dlinky" || txt === "dlinky" || txt.includes("dlinky");

      if((hideFree && isFree) || (hideDlinky && isDlinky)){
        // sobe até o pill certo se o texto estiver dentro de span pequeno
        let target = el;
        for(let i=0;i<4;i++){
          if(looksLikePill(target)) break;
          if(!target.parentElement || isInsideAdmin(target.parentElement)) break;
          const pt = (target.parentElement.textContent || "").toLowerCase().trim();
          if(pt.length > 40) break;
          target = target.parentElement;
        }
        target.classList.add("dlinky-hide-old-tag");
        target.style.display = "none";
      }
    });
  }

  document.addEventListener("click",()=>setTimeout(cleanOldTags,80),true);
  document.addEventListener("change",()=>setTimeout(cleanOldTags,80),true);
  document.addEventListener("DOMContentLoaded",()=>setTimeout(cleanOldTags,300));
  window.addEventListener("hashchange",()=>setTimeout(cleanOldTags,300));
  setInterval(cleanOldTags,400);
})();





/* ===== DLINKY — EFEITOS CUSTOM LIMPO REAL ===== */

(function(){

const STORAGE_KEY = "dlinkyEffectsReal";

function qs(s){
  return document.querySelector(s);
}

function qsa(s){
  return Array.from(document.querySelectorAll(s));
}

function getName(){
  return (
    qs("#profileName") ||
    qs(".profile-name") ||
    qs(".profile-username") ||
    qs("h1")
  );
}

function getCard(){
  return (
    qs(".profile-card") ||
    qs("#profileCard") ||
    qs(".profile-wrap")
  );
}

function loadData(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  }catch(e){
    return {};
  }
}

function saveData(data){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function removeEffects(){

  const name = getName();
  const card = getCard();

  if(name){
    name.classList.remove(
      "dl-neon",
      "dl-glow",
      "dl-rainbow"
    );
  }

  if(card){
    card.classList.remove("dl-perspective");
  }
}

function applyEffects(){

  const data = loadData();

  const name = getName();
  const card = getCard();

  removeEffects();

  if(name){

    if(data.neon){
      name.classList.add("dl-neon");
    }

    if(data.glow){
      name.classList.add("dl-glow");
    }

    if(data.rainbow){
      name.classList.add("dl-rainbow");
    }
  }

  if(card && data.perspective){
    card.classList.add("dl-perspective");
  }
}

function updateFromCheckbox(box){

  const text = (
    box.parentElement?.textContent || ""
  ).toLowerCase();

  const data = loadData();

  if(text.includes("neon")){
    data.neon = box.checked;
  }

  if(text.includes("brilho")){
    data.glow = box.checked;
  }

  if(text.includes("colorido")){
    data.rainbow = box.checked;
  }

  if(text.includes("perspectiva")){
    data.perspective = box.checked;
  }

  saveData(data);
  applyEffects();
}

function syncBoxes(){

  const data = loadData();

  qsa('#tab-custom input[type="checkbox"]').forEach(box=>{

    const text = (
      box.parentElement?.textContent || ""
    ).toLowerCase();

    if(text.includes("neon")){
      box.checked = !!data.neon;
    }

    if(text.includes("brilho")){
      box.checked = !!data.glow;
    }

    if(text.includes("colorido")){
      box.checked = !!data.rainbow;
    }

    if(text.includes("perspectiva")){
      box.checked = !!data.perspective;
    }
  });
}

document.addEventListener("change",(e)=>{

  if(
    e.target.matches('#tab-custom input[type="checkbox"]')
  ){
    updateFromCheckbox(e.target);
  }

});

window.addEventListener("DOMContentLoaded",()=>{

  syncBoxes();
  applyEffects();

});

})();


/* ===== DLINKY PIX RECARGA ===== */

(function(){

const PIX_KEY = "SUA_CHAVE_PIX_AQUI";

function qs(s){
  return document.querySelector(s);
}





document.addEventListener("click",(e)=>{

  const closeBtn = e.target.closest("#closePixModal");

  if(closeBtn){
    closePixModal();
    return;
  }

  const copyBtn = e.target.closest("#copyPixKeyBtn");

  if(copyBtn){

    navigator.clipboard.writeText(PIX_KEY);

    if(typeof toast === "function"){
      toast("Chave PIX copiada!");
    }else{
      alert("Chave PIX copiada!");
    }

    return;
  }

  const btn = e.target.closest("button");

  if(!btn) return;

  // somente botões da área RECARGA
  const store = btn.closest("#tab-store");

  if(!store) return;

  const text = (btn.textContent || "").toLowerCase();

  const rechargeCard =
    btn.closest(".dlinky-clean-recharge-card") ||
    btn.closest("[data-clean-buy-coins]");

  if(
    rechargeCard &&
    (
      text.includes("comprar") ||
      text.includes("recarregar")
    )
  ){
    e.stopPropagation();
    openPixModal();
  }

});

})();






/* ===== DLINKY RECARGA — SOMENTE LÓGICA, SEM CRIAR CARD POR CIMA ===== */
(function(){

  if(window.__dlinkyRechargeLogicOnly) return;
  window.__dlinkyRechargeLogicOnly = true;

  const VALUES = [345, 650, 1450, 3300];

  function readUser(){
    try{
      return JSON.parse(localStorage.getItem("dlinkyUser") || "{}");
    }catch(e){
      return {};
    }
  }

  function writeUser(u){
    localStorage.setItem("dlinkyUser", JSON.stringify(u));

    try{
      if(typeof user !== "undefined" && user){
        Object.assign(user, u);
      }
    }catch(e){}
  }

  function getAmountFromButton(btn){

    const direct = Number(
      btn.dataset.cleanBuyCoins ||
      btn.dataset.buyCoins ||
      btn.dataset.coins ||
      0
    );

    if(VALUES.includes(direct)) return direct;

    const card =
      btn.closest(".asset-card") ||
      btn.closest(".shop-card") ||
      btn.closest(".dlinky-clean-recharge-card") ||
      btn.closest("[class*='card']") ||
      btn.parentElement;

    const text = ((card && card.textContent) || "").replace(/\s+/g, " ");

    const found = VALUES.find(v => text.includes(v + " Linkwuans"));

    return found || 0;
  }

  function isRechargeButton(btn){
    if(!btn) return false;

    const amount = getAmountFromButton(btn);
    if(!amount) return false;

    const text = (btn.textContent || "").toLowerCase();

    return (
      text.includes("comprar") ||
      text.includes("recarregar") ||
      btn.hasAttribute("data-buy-shop") ||
      btn.hasAttribute("data-clean-buy-coins")
    );
  }

  function updateWallet(value){

    [
      "coinCount",
      "walletCoins",
      "invCoins",
      "dashCoins",
      "sideCoins",
      "linkwuansCount"
    ].forEach(id=>{
      document.querySelectorAll("#" + id).forEach(el=>{
        el.textContent = value;
      });
    });

    document.querySelectorAll(".wallet-coins,.coin-balance,[data-wallet-coins]").forEach(el=>{
      el.textContent = value;
    });
  }

  function showToast(amount){

    const msg = "Recarga comprada com sucesso! +" + amount + " Linkwuans";

    if(typeof toast === "function"){
      toast(msg);
      return;
    }

    if(typeof toastMsg === "function"){
      toastMsg(msg);
      return;
    }

    console.log(msg);
  }

  window.addEventListener("click", function(e){

    const btn = e.target.closest("button");

    if(!isRechargeButton(btn)) return;

    const amount = getAmountFromButton(btn);

    if(!amount) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    if(window.dlinkyOpenPixRecharge) window.dlinkyOpenPixRecharge(amount);

  }, true);

})();



/* ===== RESTORE HOME FEATURES SECTION ===== */
(function(){

  if(window.__dlinkyHomeFeaturesRestored) return;
  window.__dlinkyHomeFeaturesRestored = true;

  function createFeatures(){

    if(document.querySelector("#dlinky-home-features")) return;

    const hero =
      document.querySelector(".hero") ||
      document.querySelector(".landing") ||
      document.querySelector("main");

    if(!hero) return;

    const section = document.createElement("section");
    section.id = "dlinky-home-features";

    section.innerHTML = `
      <div class="dlinky-features-container">

        <div class="dlinky-features-badge">
          ✦ Seja um membro agora da Dlinky ✦
        </div>

        <h2>Veja alguns recursos disponíveis</h2>

        <p>
          Acompanhe nos cards abaixo alguns dos recursos mais utilizados.
        </p>

        <div class="dlinky-features-grid">

          <div class="dlinky-feature-card">
            <div class="feature-number">1</div>
            <h3>Redes Sociais</h3>
            <span>
              Adicione quantas redes sociais desejar em seu perfil divulgando suas principais redes.
            </span>
          </div>

          <div class="dlinky-feature-card">
            <div class="feature-number">2</div>
            <h3>Links Personalizados</h3>
            <span>
              Compartilhe todos os seus links importantes em um só lugar, do jeito que preferir.
            </span>
          </div>

          <div class="dlinky-feature-card">
            <div class="feature-number">3</div>
            <h3>Áudio e Vídeo</h3>
            <span>
              Personalize com músicas, vídeos e background animado.
            </span>
          </div>

          <div class="dlinky-feature-card">
            <div class="feature-number">4</div>
            <h3>Dlinky Premium</h3>
            <span>
              Desbloqueie recursos exclusivos, molduras e efeitos especiais.
            </span>
          </div>

        </div>

      </div>
    `;

    hero.insertAdjacentElement("afterend", section);

    const style = document.createElement("style");

    style.innerHTML = `

      #dlinky-home-features{
        position:relative;
        z-index:2;
        width:100%;
        padding:120px 20px 100px;
      }

      .dlinky-features-container{
        max-width:1120px;
        margin:0 auto;
        text-align:center;
      }

      .dlinky-features-badge{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        padding:14px 26px;
        border-radius:999px;
        background:rgba(100,30,180,.18);
        border:1px solid rgba(180,120,255,.35);
        color:#fff;
        font-weight:700;
        margin-bottom:26px;
      }

      .dlinky-features-container h2{
        color:#fff;
        font-size:78px;
        line-height:1;
        font-weight:900;
        margin-bottom:24px;
      }

      .dlinky-features-container p{
        color:rgba(255,255,255,.78);
        font-size:24px;
        margin-bottom:70px;
      }

      .dlinky-features-grid{
        display:grid;
        grid-template-columns:repeat(2,1fr);
        gap:34px;
      }

      .dlinky-feature-card{
        position:relative;
        padding:54px;
        border-radius:28px;
        text-align:left;
        background:linear-gradient(135deg,rgba(255,255,255,.04),rgba(255,255,255,.02));
        border:1px solid rgba(120,90,255,.22);
        backdrop-filter:blur(12px);
      }

      .feature-number{
        position:absolute;
        top:-18px;
        left:-18px;
        width:58px;
        height:58px;
        border-radius:50%;
        background:#3182ff;
        color:#fff;
        font-size:30px;
        font-weight:900;
        display:flex;
        align-items:center;
        justify-content:center;
      }

      .dlinky-feature-card h3{
        color:#fff;
        font-size:34px;
        margin-bottom:22px;
      }

      .dlinky-feature-card span{
        display:block;
        color:rgba(255,255,255,.75);
        font-size:22px;
        line-height:1.7;
      }

      @media(max-width:900px){

        .dlinky-features-grid{
          grid-template-columns:1fr;
        }

        .dlinky-features-container h2{
          font-size:48px;
        }

        .dlinky-features-container p{
          font-size:18px;
        }

        .dlinky-feature-card{
          padding:34px;
        }

        .dlinky-feature-card h3{
          font-size:28px;
        }

        .dlinky-feature-card span{
          font-size:18px;
        }

      }

    `;

    document.head.appendChild(style);

  }

  window.addEventListener("load", createFeatures);

})();


















/* ===== DLINKY FIX REAL — MESMA LÓGICA DOS ITENS, 1 SALDO VERDADEIRO ===== */
(function(){

  if(window.__dlinkySaldoRealMesmoDosItens) return;
  window.__dlinkySaldoRealMesmoDosItens = true;

  const RECARGAS = [345, 650, 1450, 3300];
  const USER_KEY = "dlinkyUser";

  function readUser(){
    try{
      return JSON.parse(localStorage.getItem(USER_KEY) || "{}");
    }catch(e){
      return {};
    }
  }

  function saveUser(u){
    localStorage.setItem(USER_KEY, JSON.stringify(u));

    try{
      if(typeof user !== "undefined" && user){
        Object.assign(user, u);
      }
    }catch(e){}
  }

  function saldoVerdadeiro(){
    const u = readUser();

    // Pega o maior valor salvo, porque o fake antigo ficou preso em dlinkyCleanCoins.
    const valores = [
      Number(u.coins),
      Number(u.linkwuans),
      Number(localStorage.getItem("linkwuans")),
      Number(localStorage.getItem("dlinkyWalletCoins")),
      Number(localStorage.getItem("dlinkyCleanCoins"))
    ].filter(n => Number.isFinite(n) && n >= 0);

    return valores.length ? Math.max(...valores) : 0;
  }

  function salvarSaldo(v){
    v = Number(v || 0);

    const u = readUser();
    u.coins = v;
    u.linkwuans = v;

    saveUser(u);

    // ESSA era a chave que estava voltando o valor fake.
    localStorage.setItem("dlinkyCleanCoins", String(v));

    // chaves antigas também sincronizadas
    localStorage.setItem("linkwuans", String(v));
    localStorage.setItem("dlinkyWalletCoins", String(v));

    try{
      if(typeof user !== "undefined" && user){
        user.coins = v;
        user.linkwuans = v;
      }
    }catch(e){}

    pintarSaldo(v);
  }

  function pintarSaldo(v){
    v = Number(v ?? saldoVerdadeiro());

    // IDs corretos. O saldo do inventário usa invCoins.
    [
      "invCoins",
      "coinCount",
      "walletCoins",
      "dashCoins",
      "sideCoins",
      "linkwuansCount",
      "saldoCoins"
    ].forEach(id=>{
      document.querySelectorAll("#" + id).forEach(el=>{
        el.textContent = v;
      });
    });

    document.querySelectorAll("[data-wallet-coins],[data-saldo-coins],.wallet-coins,.coin-balance,.coins-balance,.saldo-coins").forEach(el=>{
      if(el.tagName !== "BUTTON"){
        el.textContent = v;
      }
    });
  }

  function valorRecarga(btn){
    const direto = Number(btn.dataset.cleanBuyCoins || btn.dataset.buyCoins || btn.dataset.coins || 0);
    if(RECARGAS.includes(direto)) return direto;

    const card = btn.closest(".asset-card,.shop-card,.dlinky-clean-recharge-card,[class*='card']");
    const txt = ((card && card.textContent) || "").replace(/\s+/g, " ");

    return RECARGAS.find(n => txt.includes(n + " Linkwuans")) || 0;
  }

  function aviso(n){
    const msg = "Recarga comprada com sucesso! +" + n + " Linkwuans";
    if(typeof toast === "function") toast(msg);
    else if(typeof toastMsg === "function") toastMsg(msg);
    else console.log(msg);
  }

  window.addEventListener("click", function(e){

    const btn = e.target.closest("button");
    if(!btn) return;

    const n = valorRecarga(btn);
    if(!n) return;

    const txt = (btn.textContent || "").toLowerCase();
    if(!txt.includes("comprar") && !txt.includes("recarregar")) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const novoSaldo = saldoVerdadeiro() + n;

    const u = readUser();
    u.coins = novoSaldo;
    u.linkwuans = novoSaldo;
    u.purchases = Array.isArray(u.purchases) ? u.purchases : [];
    u.purchases.unshift({
      id: Date.now(),
      method: "Mistic Pay PIX",
      status: "Aprovado",
      value: "+" + n + " Linkwuans",
      date: new Date().toLocaleDateString("pt-BR")
    });

    saveUser(u);
    salvarSaldo(novoSaldo);

    try{
      if(typeof renderDash === "function") renderDash();
    }catch(err){}

    pintarSaldo(novoSaldo);
    requestAnimationFrame(()=>pintarSaldo(novoSaldo));
    setTimeout(()=>pintarSaldo(novoSaldo), 80);
    setTimeout(()=>pintarSaldo(novoSaldo), 250);

    aviso(n);

  }, true);

  const oldRenderDash = window.renderDash;

  if(typeof oldRenderDash === "function" && !oldRenderDash.__saldoRealMesmoDosItens){

    const patched = function(){

      const saldo = saldoVerdadeiro();

      // Antes de chamar renderDash antigo, sincroniza a chave fake também.
      salvarSaldo(saldo);

      const result = oldRenderDash.apply(this, arguments);

      pintarSaldo(saldo);
      requestAnimationFrame(()=>pintarSaldo(saldo));

      return result;
    };

    patched.__saldoRealMesmoDosItens = true;

    window.renderDash = patched;

    try{
      renderDash = patched;
    }catch(e){}
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    const s = saldoVerdadeiro();
    salvarSaldo(s);
    pintarSaldo(s);
  });

  window.addEventListener("load", ()=>{
    const s = saldoVerdadeiro();
    salvarSaldo(s);
    pintarSaldo(s);
  });

})();






/* ===== DLINKY FIREBASE REAL — CONTAS SEPARADAS, LOGIN REAL, DADOS ONLINE ===== */
(function(){

  if(window.__dlinkyFirebaseRealOnlineV2) return;
  window.__dlinkyFirebaseRealOnlineV2 = true;

  const ADMIN_EMAIL = "jailtonsilas48@gmail.com";

  const firebaseConfig = {
    apiKey: "AIzaSyCPmjhOSXXNaVXXXdrAK9Y77fqxCoLv7Wo",
    authDomain: "dlinky.firebaseapp.com",
    projectId: "dlinky",
    storageBucket: "dlinky.firebasestorage.app",
    messagingSenderId: "856690547155",
    appId: "1:856690547155:web:6444b8a4be23ee5a6d7726"
  };

  function $(s){ return document.querySelector(s); }

  function notify(msg){
    try{
      if(typeof toast === "function"){
        toast(msg);
        return;
      }
    }catch(e){}

    const box = document.createElement("div");
    box.textContent = msg;
    box.style.position = "fixed";
    box.style.top = "22px";
    box.style.left = "50%";
    box.style.transform = "translateX(-50%)";
    box.style.zIndex = "9999999";
    box.style.padding = "13px 24px";
    box.style.borderRadius = "12px";
    box.style.background = "rgba(15,8,25,.96)";
    box.style.border = "1px solid rgba(168,85,247,.75)";
    box.style.color = "#fff";
    box.style.fontWeight = "700";
    box.style.boxShadow = "0 0 35px rgba(168,85,247,.25)";
    document.body.appendChild(box);
    setTimeout(()=>box.remove(),2600);
  }

  function cleanSlug(v){
    return (v || "usuario")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g,"")
      .replace(/[^a-z0-9_-]/g,"")
      .slice(0,30) || "usuario";
  }

  function readLocalUser(){
    try{
      return JSON.parse(localStorage.getItem("dlinkyUser") || "{}");
    }catch(e){
      return {};
    }
  }

  function writeLocalUser(u){
    localStorage.setItem("dlinkyUser", JSON.stringify(u));

    localStorage.setItem("dlinkyCleanCoins", String(Number(u.coins || 0)));
    localStorage.setItem("linkwuans", String(Number(u.coins || 0)));
    localStorage.setItem("dlinkyWalletCoins", String(Number(u.coins || 0)));

    try{
      if(typeof user !== "undefined" && user){
        Object.keys(user).forEach(k=>delete user[k]);
        Object.assign(user, u);
      }
    }catch(e){}

    try{
      if(typeof window.user !== "undefined" && window.user){
        Object.keys(window.user).forEach(k=>delete window.user[k]);
        Object.assign(window.user, u);
      }
    }catch(e){}
  }

  function currentUid(){
    try{
      return firebase.auth().currentUser && firebase.auth().currentUser.uid;
    }catch(e){
      return null;
    }
  }

  function db(){
    return firebase.firestore();
  }

  function userRef(uid){
    return db().collection("users").doc(uid);
  }

  function publicRef(slug){
    return db().collection("profiles").doc(slug);
  }

  function blankUser(firebaseUser, extra){
    const email = (firebaseUser?.email || extra?.email || "").toLowerCase().trim();
    const baseName = extra?.name || (email ? email.split("@")[0] : "Usuário");
    const slug = cleanSlug(extra?.slug || baseName);

    return {
      uid: firebaseUser?.uid || "",
      name: baseName,
      slug,
      email,
      bio: "",
      avatar: "",
      banner: "",
      bg: "",
      video: "",
      frame: "",
      music: "",
      welcome: "",
      color: "#a855f7",
      particles: true,
      particleType: "snow",
      verified: false,
      premiumUntil: 0,
      coins: 0,
      linkwuans: 0,
      inventory: [],
      purchases: [],
      history: [],
      links: [],
      socials: [],
      tags: [],
      embeds: [],
      neonName: false,
      shineName: false,
      rainbowName: false,
      hideViews: false,
      decoration: "",
      frameAdjustments: {},
      frameAdjust: {},
      isAdmin: email === ADMIN_EMAIL,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
  }

  function normalizeUser(data, firebaseUser){
    const email = (firebaseUser?.email || data?.email || "").toLowerCase().trim();

    const coins = Number(
      data?.coins ??
      data?.linkwuans ??
      0
    );

    return {
      uid: firebaseUser?.uid || data?.uid || "",
      name: data?.name || (email ? email.split("@")[0] : "Usuário"),
      slug: cleanSlug(data?.slug || data?.name || (email ? email.split("@")[0] : "usuario")),
      email,
      bio: data?.bio || "",
      avatar: data?.avatar || (() => {
        try {
          const local = JSON.parse(localStorage.getItem('dlinkyUser') || '{}');
          const k = 'dlinkyAvatarPreserve_' + ((firebaseUser?.email || data?.email || local.email || local.slug || 'local').toLowerCase().trim());
          return local.avatar || localStorage.getItem(k) || '';
        } catch(e) { return ''; }
      })(),
      banner: data?.banner || "",
      bg: data?.bg || "",
      video: data?.video || "",
      frame: data?.frame || "",
      music: data?.music || "",
      welcome: data?.welcome || "",
      color: data?.color || "#a855f7",
      particles: data?.particles !== false,
      particleType: data?.particleType || "snow",
      verified: !!data?.verified,
      premiumUntil: data?.premiumUntil || 0,
      coins,
      linkwuans: coins,
      inventory: Array.isArray(data?.inventory) ? data.inventory : [],
      purchases: Array.isArray(data?.purchases) ? data.purchases : [],
      history: Array.isArray(data?.history) ? data.history : [],
      links: Array.isArray(data?.links) ? data.links : [],
      socials: Array.isArray(data?.socials) ? data.socials : [],
      tags: Array.isArray(data?.tags) ? data.tags : [],
      embeds: Array.isArray(data?.embeds) ? data.embeds : [],
      neonName: !!data?.neonName,
      shineName: !!data?.shineName,
      rainbowName: !!data?.rainbowName,
      hideViews: !!data?.hideViews,
      decoration: data?.decoration || "",
      frameAdjustments: data?.frameAdjustments || {},
      frameAdjust: data?.frameAdjust || {},
      isAdmin: email === ADMIN_EMAIL,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
  }

  function publicProfileData(u){
    return {
      uid: u.uid || currentUid() || "",
      name: u.name || "Usuário",
      slug: u.slug || "usuario",
      email: u.email || "",
      bio: u.bio || "",
      avatar: u.avatar || (() => {
        try {
          const local = JSON.parse(localStorage.getItem('dlinkyUser') || '{}');
          const k = 'dlinkyAvatarPreserve_' + ((u.email || u.slug || local.email || local.slug || 'local').toLowerCase().trim());
          return local.avatar || localStorage.getItem(k) || '';
        } catch(e) { return ''; }
      })(),
      banner: u.banner || "",
      bg: u.bg || "",
      video: u.video || "",
      frame: u.frame || "",
      music: u.music || "",
      welcome: u.welcome || "",
      color: u.color || "#a855f7",
      particles: u.particles !== false,
      particleType: u.particleType || "snow",
      verified: !!u.verified,
      tags: Array.isArray(u.tags) ? u.tags : [],
      links: Array.isArray(u.links) ? u.links : [],
      socials: Array.isArray(u.socials) ? u.socials : [],
      embeds: Array.isArray(u.embeds) ? u.embeds : [],
      decoration: u.decoration || "",
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
  }

  async function saveOnlineNow(){
    const uid = currentUid();
    if(!uid) return;

    const local = normalizeUser(readLocalUser(), firebase.auth().currentUser);

    await userRef(uid).set(local, {merge:true});

    if(local.slug){
      await publicRef(local.slug).set(publicProfileData(local), {merge:true});
    }
  }

  let saveTimer = null;
  function scheduleOnlineSave(){
    if(!currentUid()) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(()=>{
      saveOnlineNow().catch(err=>console.warn("Dlinky Firebase save:", err));
    }, 700);
  }

  async function loadOnlineUser(uid){
    const fbUser = firebase.auth().currentUser;
    const snap = await userRef(uid).get();

    let data;

    if(!snap.exists){
      // Conta nova começa limpa. Não puxa dados antigos do navegador.
      data = blankUser(fbUser, {});
      await userRef(uid).set(data, {merge:true});
      await publicRef(data.slug).set(publicProfileData(data), {merge:true});
    }else{
      // Conta existente usa só os dados dela no Firebase.
      data = normalizeUser(snap.data() || {}, fbUser);
      await userRef(uid).set({
        email: data.email,
        isAdmin: data.email === ADMIN_EMAIL,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, {merge:true});
    }

    writeLocalUser(data);

    try{
      if(typeof renderDash === "function") renderDash();
      if(typeof renderInventory === "function") renderInventory();
      if(typeof renderPremiumHistory === "function") renderPremiumHistory();
    }catch(e){}

    return data;
  }

  function patchLocalStorageMirror(){
    if(window.__dlinkyLocalStorageMirrorV2) return;
    window.__dlinkyLocalStorageMirrorV2 = true;

    const originalSetItem = localStorage.setItem.bind(localStorage);

    localStorage.setItem = function(key, value){
      const result = originalSetItem(key, value);

      if(
        key === "dlinkyUser" ||
        key === "dlinkyCleanCoins" ||
        key === "linkwuans" ||
        key === "dlinkyWalletCoins"
      ){
        scheduleOnlineSave();
      }

      return result;
    };
  }

  async function registerReal(e){
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const name = $("#regName")?.value?.trim() || "Usuário";
    const slug = cleanSlug($("#regSlug")?.value || name);
    const email = ($("#regEmail")?.value || "").trim().toLowerCase();
    const pass = $("#regPass")?.value || "";
    const pass2 = $("#regPass2")?.value || "";

    if(!email) return notify("Digite seu e-mail.");
    if(pass.length < 6) return notify("A senha precisa ter pelo menos 6 caracteres.");
    if(pass !== pass2) return notify("As senhas não conferem.");

    try{
      const cred = await firebase.auth().createUserWithEmailAndPassword(email, pass);

      const data = blankUser(cred.user, {name, slug, email});

      writeLocalUser(data);

      await userRef(cred.user.uid).set(data, {merge:true});
      await publicRef(data.slug).set(publicProfileData(data), {merge:true});

      notify("Conta criada com Firebase!");
      location.hash = "#/dashboard";

      try{
        if(typeof renderDash === "function") renderDash();
      }catch(e){}

    }catch(err){
      const code = err && err.code || "";
      if(code.includes("email-already-in-use")) return notify("Esse e-mail já está cadastrado. Use login.");
      if(code.includes("invalid-email")) return notify("E-mail inválido.");
      if(code.includes("weak-password")) return notify("Senha fraca. Use pelo menos 6 caracteres.");
      notify("Erro ao registrar: " + (err.message || "tente novamente"));
    }
  }

  async function loginReal(e){
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const email = ($("#loginEmail")?.value || "").trim().toLowerCase();
    const pass = $("#loginPass")?.value || "";

    if(!email) return notify("Digite seu e-mail.");
    if(!pass) return notify("Digite sua senha.");

    try{
      const cred = await firebase.auth().signInWithEmailAndPassword(email, pass);

      await loadOnlineUser(cred.user.uid);

      notify("Login real efetuado!");
      location.hash = "#/dashboard";

      try{
        if(typeof renderDash === "function") renderDash();
      }catch(e){}

    }catch(err){
      const code = err && err.code || "";
      if(code.includes("user-not-found")) return notify("Essa conta ainda não existe. Crie a conta primeiro.");
      if(code.includes("invalid-credential")) return notify("E-mail ou senha incorretos.");
      if(code.includes("wrong-password")) return notify("Senha incorreta.");
      if(code.includes("invalid-email")) return notify("E-mail inválido.");
      notify("Erro no login: " + (err.message || "tente novamente"));
    }
  }

  function patchForms(){
    const registerForm = $("#registerForm");
    const loginForm = $("#loginForm");

    if(registerForm && !registerForm.__firebaseRealV2){
      registerForm.__firebaseRealV2 = true;
      registerForm.addEventListener("submit", registerReal, true);
    }

    if(loginForm && !loginForm.__firebaseRealV2){
      loginForm.__firebaseRealV2 = true;
      loginForm.addEventListener("submit", loginReal, true);
    }

    const logout = $("#logoutBtn");
    if(logout && !logout.__firebaseRealV2){
      logout.__firebaseRealV2 = true;
      logout.addEventListener("click", function(ev){
        ev.preventDefault();
        ev.stopPropagation();
        ev.stopImmediatePropagation();

        firebase.auth().signOut().then(()=>{
          writeLocalUser(blankUser(null, {name:"Usuário", slug:"usuario", email:""}));
          notify("Você saiu da conta.");
          location.hash = "#/";
        });
      }, true);
    }
  }

  function patchRenderForOnlineSave(){
    const oldRenderDash = window.renderDash;
    if(typeof oldRenderDash === "function" && !oldRenderDash.__firebaseV2Patched){
      const patched = function(){
        const r = oldRenderDash.apply(this, arguments);
        patchForms();
        return r;
      };
      patched.__firebaseV2Patched = true;
      window.renderDash = patched;
      try{ renderDash = patched; }catch(e){}
    }
  }

  function init(){
    if(!window.firebase || !firebase.apps){
      notify("Firebase não carregou. Verifique sua internet.");
      return;
    }

    if(!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
    }

    patchLocalStorageMirror();
    patchForms();
    patchRenderForOnlineSave();

    firebase.auth().onAuthStateChanged(async function(fbUser){
      if(fbUser){
        try{
          await loadOnlineUser(fbUser.uid);
        }catch(err){
          console.warn("Dlinky Firebase load:", err);
        }
      }
    });

    setTimeout(patchForms, 500);
    setTimeout(patchForms, 1500);
    setTimeout(patchForms, 3000);
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  }else{
    init();
  }

})();



/* ===== DLINKY FIX — CONTA NOVA SEM ITEM/SELO ANTIGO DO NAVEGADOR ===== */
(function(){

  if(window.__dlinkyNoInventoryBleed) return;
  window.__dlinkyNoInventoryBleed = true;

  const USER_KEY = "dlinkyUser";

  function readUser(){
    try{
      return JSON.parse(localStorage.getItem(USER_KEY) || "{}");
    }catch(e){
      return {};
    }
  }

  function writeUser(u){
    localStorage.setItem(USER_KEY, JSON.stringify(u));

    try{
      if(typeof user !== "undefined" && user){
        Object.keys(user).forEach(k=>delete user[k]);
        Object.assign(user, u);
      }
    }catch(e){}
  }

  function clearVisualLocalBleed(){
    // Não apaga conta/saldo. Só remove catálogos/estado antigo que vazava item visual entre contas.
    [
      "dlinkyInventory",
      "dlinkySelos",
      "dlinkyBadges",
      "dlinkyOwnedSelos",
      "dlinkyOwnedBadges",
      "dlinkyActiveSelo",
      "dlinkyActiveBadge",
      "dlinkyCleanSelos",
      "dlinkyCleanBadges",
      "dlinkyAdminSelos",
      "dlinkyCustomSelos",
      "dlinkyUserSelos",
      "dlinkyUserBadges"
    ].forEach(k=>{
      try{ localStorage.removeItem(k); }catch(e){}
    });
  }

  function normalizeInventoryOnlyFromFirebase(){
    const u = readUser();

    u.inventory = Array.isArray(u.inventory) ? u.inventory : [];

    // Conta nova limpa não pode nascer com "Selo Verificado premium azul" vindo de cache antigo.
    if(!u.verified && !u.isAdmin){
      u.inventory = u.inventory.filter(item=>{
        const text = JSON.stringify(item || {}).toLowerCase();
        if(text.includes("selo verificado")) return false;
        if(text.includes("premium azul")) return false;
        if(text.includes("verified")) return false;
        return true;
      });

      if(u.activeSelo) delete u.activeSelo;
      if(u.selo) delete u.selo;
      if(u.badge) delete u.badge;
    }

    writeUser(u);
  }

  function afterFirebaseLoadClean(){
    setTimeout(()=>{
      clearVisualLocalBleed();
      normalizeInventoryOnlyFromFirebase();

      try{
        if(typeof renderInventory === "function") renderInventory();
        if(typeof renderDash === "function") renderDash();
      }catch(e){}
    }, 350);

    setTimeout(()=>{
      normalizeInventoryOnlyFromFirebase();
      try{
        if(typeof renderInventory === "function") renderInventory();
      }catch(e){}
    }, 1200);
  }

  // Quando login/cadastro Firebase terminar e for pro dashboard, limpa cache antigo antes de desenhar inventário.
  window.addEventListener("hashchange", ()=>{
    if(String(location.hash).includes("dashboard")){
      afterFirebaseLoadClean();
    }
  });

  document.addEventListener("DOMContentLoaded", afterFirebaseLoadClean);
  window.addEventListener("load", afterFirebaseLoadClean);

})();







/* ===== DLINKY FIX — AVATAR ALINHADO COM MOLDURA NO VER PERFIL ===== */
(function(){

  if(window.__dlinkyAvatarMolduraAlinhado) return;
  window.__dlinkyAvatarMolduraAlinhado = true;

  function getUser(){
    try{
      return JSON.parse(localStorage.getItem("dlinkyUser") || "{}");
    }catch(e){
      return {};
    }
  }

  function avatarUrl(){
    const u = getUser();
    return u.avatar || u.avatarUrl || u.photoURL || "";
  }

  function applyAvatar(){
    try{
      const url = avatarUrl();
      if(!url) return;

      const wrap = document.querySelector("#avatarDecoration");
      if(!wrap) return;

      // Se a moldura custom criou um stage próprio, usa o avatar desse stage.
      // Isso evita jogar um avatar novo por cima da moldura.
      const stageAvatar =
        wrap.querySelector(".dlinky-final-avatar") ||
        wrap.querySelector(".dlinky-v4-avatar");

      if(stageAvatar){
        const oldExtra = document.querySelector("#dlinkyRealProfileAvatar");
        if(oldExtra) oldExtra.remove();

        stageAvatar.style.setProperty("background-image", 'url("' + url.replace(/"/g, "%22") + '")', "important");
        stageAvatar.style.setProperty("background-size", "cover", "important");
        stageAvatar.style.setProperty("background-position", "center", "important");
        stageAvatar.style.setProperty("background-repeat", "no-repeat", "important");
        stageAvatar.style.setProperty("border-radius", "50%", "important");
        stageAvatar.style.setProperty("z-index", "2", "important");

        const frame =
          wrap.querySelector(".dlinky-final-frame") ||
          wrap.querySelector(".dlinky-v4-frame") ||
          document.querySelector("#profileFrame");

        if(frame){
          frame.style.setProperty("z-index", "5", "important");
          frame.style.setProperty("pointer-events", "none", "important");
        }

        return;
      }

      // Sem stage de moldura: usa o avatar normal do perfil.
      const oldAvatar = document.querySelector("#profileAvatar");

      if(oldAvatar){
        oldAvatar.style.setProperty("display", "block", "important");
        oldAvatar.style.setProperty("background-image", 'url("' + url.replace(/"/g, "%22") + '")', "important");
        oldAvatar.style.setProperty("background-size", "cover", "important");
        oldAvatar.style.setProperty("background-position", "center", "important");
        oldAvatar.style.setProperty("background-repeat", "no-repeat", "important");
        oldAvatar.style.setProperty("border-radius", "50%", "important");
        oldAvatar.style.setProperty("z-index", "2", "important");
        return;
      }

    }catch(e){}
  }

  const oldRenderProfile = window.renderProfile;

  if(typeof oldRenderProfile === "function" && !oldRenderProfile.__dlinkyAvatarMolduraAlinhado){
    const patched = function(){
      const r = oldRenderProfile.apply(this, arguments);

      setTimeout(applyAvatar, 80);
      setTimeout(applyAvatar, 300);
      setTimeout(applyAvatar, 800);

      return r;
    };

    patched.__dlinkyAvatarMolduraAlinhado = true;
    window.renderProfile = patched;

    try{
      renderProfile = patched;
    }catch(e){}
  }

  document.addEventListener("DOMContentLoaded", ()=>setTimeout(applyAvatar, 300));
  window.addEventListener("load", ()=>setTimeout(applyAvatar, 300));
  window.addEventListener("hashchange", ()=>{
    setTimeout(applyAvatar, 300);
    setTimeout(applyAvatar, 900);
  });

})();









/* ===== DLINKY FIX SEGURO — EFEITOS LIGA/DESLIGA SEM QUEBRAR LOGIN ===== */
(function(){

  if(window.__dlinkyEfeitosLigaDesligaSeguro) return;
  window.__dlinkyEfeitosLigaDesligaSeguro = true;

  const USER_KEY = "dlinkyUser";
  const CLEAN_KEY = "dlinkyCleanEffects";
  const REAL_KEY = "dlinkyEffectsReal";

  const MAP = {
    fxNeonName: ["neonName", "neon"],
    fxShineName: ["shineName", "glow"],
    fxRainbowName: ["rainbowName", "rainbow"],
    fxPerspective: ["perspective", "perspective"]
  };

  function readJSON(key, fallback){
    try{
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    }catch(e){
      return fallback;
    }
  }

  function writeJSON(key, value){
    localStorage.setItem(key, JSON.stringify(value || {}));
  }

  function saveOne(id, checked){
    const pair = MAP[id];
    if(!pair) return;

    const cleanName = pair[0];
    const realName = pair[1];

    const u = readJSON(USER_KEY, {});
    const clean = readJSON(CLEAN_KEY, {});
    const real = readJSON(REAL_KEY, {});

    u[cleanName] = !!checked;
    clean[cleanName] = !!checked;
    real[realName] = !!checked;

    localStorage.setItem(USER_KEY, JSON.stringify(u));
    writeJSON(CLEAN_KEY, clean);
    writeJSON(REAL_KEY, real);

    try{
      if(typeof user !== "undefined" && user){
        user[cleanName] = !!checked;
      }
    }catch(e){}
  }

  function getState(){
    const u = readJSON(USER_KEY, {});
    const clean = readJSON(CLEAN_KEY, {});
    const real = readJSON(REAL_KEY, {});

    return {
      neonName: !!(clean.neonName ?? u.neonName ?? real.neon),
      shineName: !!(clean.shineName ?? u.shineName ?? real.glow),
      rainbowName: !!(clean.rainbowName ?? u.rainbowName ?? real.rainbow),
      perspective: !!(clean.perspective ?? u.perspective ?? real.perspective)
    };
  }

  function syncBoxes(){
    const s = getState();

    const values = {
      fxNeonName: s.neonName,
      fxShineName: s.shineName,
      fxRainbowName: s.rainbowName,
      fxPerspective: s.perspective
    };

    Object.keys(values).forEach(id=>{
      const el = document.getElementById(id);
      if(el && el.type === "checkbox"){
        el.checked = !!values[id];
      }
    });
  }

  function applyProfile(){
    const s = getState();

    const name =
      document.getElementById("profileName") ||
      document.querySelector(".profile-name") ||
      document.querySelector(".profile-username") ||
      document.querySelector(".perfil-nome");

    if(name){
      name.classList.toggle("dlinky-neon-name", s.neonName);
      name.classList.toggle("dlinky-shine-name", s.shineName);
      name.classList.toggle("dlinky-rainbow-name", s.rainbowName);
      name.classList.toggle("dl-neon", s.neonName);
      name.classList.toggle("dl-glow", s.shineName);
      name.classList.toggle("dl-rainbow", s.rainbowName);
    }

    const card =
      document.querySelector(".profile-wrap") ||
      document.getElementById("profileCard") ||
      document.querySelector(".profile-card");

    if(card){
      card.classList.toggle("dlinky-perspective-card", s.perspective);
      card.classList.toggle("dl-perspective", s.perspective);
    }
  }

  document.addEventListener("change", function(e){
    const el = e.target;
    if(!el || !MAP[el.id]) return;

    const id = el.id;
    const checked = !!el.checked;

    // Espera os handlers antigos rodarem e força o estado correto do clique.
    setTimeout(function(){
      saveOne(id, checked);
      syncBoxes();
      applyProfile();
    }, 60);

    setTimeout(function(){
      saveOne(id, checked);
      syncBoxes();
      applyProfile();
    }, 220);
  }, true);

  document.addEventListener("click", function(e){
    if(
      e.target.closest("[data-tab='custom']") ||
      e.target.closest("#viewProfile") ||
      e.target.closest("#viewProfile2")
    ){
      setTimeout(function(){
        syncBoxes();
        applyProfile();
      }, 300);
    }
  }, true);

  const oldRenderProfile = window.renderProfile;
  if(typeof oldRenderProfile === "function" && !oldRenderProfile.__efeitosLigaDesligaSeguro){
    const patched = function(){
      const result = oldRenderProfile.apply(this, arguments);
      setTimeout(applyProfile, 100);
      setTimeout(applyProfile, 350);
      return result;
    };

    patched.__efeitosLigaDesligaSeguro = true;
    window.renderProfile = patched;
    try{ renderProfile = patched; }catch(e){}
  }

  document.addEventListener("DOMContentLoaded", function(){
    setTimeout(syncBoxes, 400);
    setTimeout(applyProfile, 400);
  });

  window.addEventListener("load", function(){
    setTimeout(syncBoxes, 400);
    setTimeout(applyProfile, 400);
  });

  window.addEventListener("hashchange", function(){
    setTimeout(syncBoxes, 400);
    setTimeout(applyProfile, 400);
  });

})();



/* ===== DLINKY HUD PLAYER RESTAURADO ===== */
(function(){
  if(window.__dlinkyHudPlayerRestaurado) return;
  window.__dlinkyHudPlayerRestaurado = true;

  function q(s){ return document.querySelector(s); }

  function isProfile(){
    return String(location.hash || "").includes("profile");
  }

  function getAudio(){
    return q("#profileAudio") || q("audio");
  }

  function syncVisibility(){
    document.body.classList.toggle("profile-view", isProfile());
  }

  function bind(){
    syncVisibility();

    const btn = q("#dlinkyHudMute");
    const vol = q("#dlinkyHudVolume");
    const audio = getAudio();

    if(btn && !btn.__dlinkyBound){
      btn.__dlinkyBound = true;
      btn.addEventListener("click", function(){
        const a = getAudio();
        if(!a) return;
        a.muted = !a.muted;
        btn.textContent = a.muted ? "🔇" : "🔊";
      });
    }

    if(vol && !vol.__dlinkyBound){
      vol.__dlinkyBound = true;
      vol.addEventListener("input", function(){
        const a = getAudio();
        if(!a) return;
        a.volume = Math.max(0, Math.min(1, Number(vol.value || 0) / 100));
        if(a.volume > 0) a.muted = false;
        if(btn) btn.textContent = a.muted ? "🔇" : "🔊";
      });
    }

    if(audio && vol){
      const current = Number(vol.value || 70) / 100;
      if(Number.isFinite(current)) audio.volume = Math.max(0, Math.min(1, current));
    }
  }

  const oldRenderProfile = window.renderProfile;
  if(typeof oldRenderProfile === "function" && !oldRenderProfile.__dlinkyHudPlayerRestaurado){
    const patched = function(){
      const r = oldRenderProfile.apply(this, arguments);
      setTimeout(bind, 100);
      setTimeout(bind, 400);
      return r;
    };
    patched.__dlinkyHudPlayerRestaurado = true;
    window.renderProfile = patched;
    try{ renderProfile = patched; }catch(e){}
  }

  document.addEventListener("DOMContentLoaded", function(){ setTimeout(bind, 300); });
  window.addEventListener("load", function(){ setTimeout(bind, 300); });
  window.addEventListener("hashchange", function(){ setTimeout(bind, 250); });
})();



/* ===== DLINKY HUD PLAYER FORÇADO NO PERFIL ===== */
(function(){
  if(window.__dlinkyHudPlayerForceVisible) return;
  window.__dlinkyHudPlayerForceVisible = true;

  function isProfile(){
    const h = String(location.hash || "").toLowerCase();
    return h === "#/profile" || h.includes("/profile");
  }

  function audio(){
    return document.querySelector("#profileAudio") || document.querySelector("audio");
  }

  function ensureHud(){
    let hud = document.querySelector("#dlinkyProfileHudPlayer");

    if(!hud){
      hud = document.createElement("div");
      hud.id = "dlinkyProfileHudPlayer";
      hud.className = "dlinky-profile-hud-player";
      hud.innerHTML = `
        <div class="dlinky-hud-left">
          <span class="dlinky-hud-brand">dlinky</span>
          <button type="button" id="dlinkyHudMute" class="dlinky-hud-btn">🔊</button>
          <input type="range" id="dlinkyHudVolume" class="dlinky-hud-volume" min="0" max="100" value="70">
        </div>
        <div class="dlinky-hud-credit">❤ Feito por Dlinky</div>
      `;
      document.body.appendChild(hud);
    }

    hud.style.setProperty("position","fixed","important");
    hud.style.setProperty("top","16px","important");
    hud.style.setProperty("left","16px","important");
    hud.style.setProperty("right","16px","important");
    hud.style.setProperty("z-index","2147483647","important");
    hud.style.setProperty("display", isProfile() ? "flex" : "none", "important");

    const btn = document.querySelector("#dlinkyHudMute");
    const vol = document.querySelector("#dlinkyHudVolume");

    if(btn && !btn.__boundDlinkyForce){
      btn.__boundDlinkyForce = true;
      btn.addEventListener("click", function(){
        const a = audio();
        if(!a) return;
        a.muted = !a.muted;
        btn.textContent = a.muted ? "🔇" : "🔊";
      }, true);
    }

    if(vol && !vol.__boundDlinkyForce){
      vol.__boundDlinkyForce = true;
      vol.addEventListener("input", function(){
        const a = audio();
        if(!a) return;
        a.volume = Math.max(0, Math.min(1, Number(vol.value || 0) / 100));
        if(a.volume > 0) a.muted = false;
        if(btn) btn.textContent = a.muted ? "🔇" : "🔊";
      }, true);
    }

    const a = audio();
    if(a && vol){
      a.volume = Math.max(0, Math.min(1, Number(vol.value || 70) / 100));
    }
  }

  const oldRenderProfile = window.renderProfile;
  if(typeof oldRenderProfile === "function" && !oldRenderProfile.__hudForceVisible){
    const patched = function(){
      const r = oldRenderProfile.apply(this, arguments);
      setTimeout(ensureHud, 50);
      setTimeout(ensureHud, 300);
      setTimeout(ensureHud, 900);
      return r;
    };
    patched.__hudForceVisible = true;
    window.renderProfile = patched;
    try{ renderProfile = patched; }catch(e){}
  }

  document.addEventListener("DOMContentLoaded", function(){ setTimeout(ensureHud, 300); });
  window.addEventListener("load", function(){ setTimeout(ensureHud, 300); });
  window.addEventListener("hashchange", function(){
    setTimeout(ensureHud, 100);
    setTimeout(ensureHud, 500);
  });
  setInterval(ensureHud, 1200);
})();



/* ===== DLINKY FIX — PLAYER SOMENTE NO VER PERFIL ===== */
(function(){
  if(window.__dlinkyPlayerSomentePerfil) return;
  window.__dlinkyPlayerSomentePerfil = true;

  function estaNoPerfil(){
    const h = String(location.hash || "").toLowerCase();
    return h === "#/profile" || h.includes("/profile");
  }

  function aplicar(){
    const hud = document.querySelector("#dlinkyProfileHudPlayer");
    if(!hud) return;
    hud.style.setProperty("display", estaNoPerfil() ? "flex" : "none", "important");
  }

  document.addEventListener("DOMContentLoaded", ()=>setTimeout(aplicar, 200));
  window.addEventListener("load", ()=>setTimeout(aplicar, 200));
  window.addEventListener("hashchange", ()=>{
    setTimeout(aplicar, 50);
    setTimeout(aplicar, 300);
  });

  setInterval(aplicar, 700);
})();



/* ===== DLINKY FIX FINAL — PLAYER SOMENTE NA ROTA #/profile ===== */
(function(){
  if(window.__dlinkyPlayerSomenteRotaProfileFinal) return;
  window.__dlinkyPlayerSomenteRotaProfileFinal = true;

  function isProfileRoute(){
    const h = String(location.hash || "").toLowerCase().trim();
    return h === "#/profile" || h === "#profile" || h.endsWith("/profile");
  }

  function applyPlayerRoute(){
    const on = isProfileRoute();
    document.body.classList.toggle("dlinky-only-profile-view", on);

    const hud = document.getElementById("dlinkyProfileHudPlayer");
    if(!hud) return;

    if(on){
      hud.style.setProperty("display", "flex", "important");
      hud.style.setProperty("visibility", "visible", "important");
      hud.style.setProperty("opacity", "1", "important");
    }else{
      hud.style.setProperty("display", "none", "important");
      hud.style.setProperty("visibility", "hidden", "important");
      hud.style.setProperty("opacity", "0", "important");
    }
  }

  document.addEventListener("DOMContentLoaded", function(){
    setTimeout(applyPlayerRoute, 0);
    setTimeout(applyPlayerRoute, 300);
  });

  window.addEventListener("load", function(){
    setTimeout(applyPlayerRoute, 0);
    setTimeout(applyPlayerRoute, 300);
  });

  window.addEventListener("hashchange", function(){
    setTimeout(applyPlayerRoute, 0);
    setTimeout(applyPlayerRoute, 100);
    setTimeout(applyPlayerRoute, 500);
  });

  document.addEventListener("mousemove", applyPlayerRoute, true);
  document.addEventListener("scroll", applyPlayerRoute, true);
  document.addEventListener("click", function(){
    setTimeout(applyPlayerRoute, 0);
    setTimeout(applyPlayerRoute, 150);
  }, true);

  setInterval(applyPlayerRoute, 250);
})();



/* ===== DLINKY PLAYER ESTILO ZYO — CLIQUE ABRE VOLUME, MOUSE SAI FECHA ===== */
(function(){
  if(window.__dlinkyPlayerZyoStyle) return;
  window.__dlinkyPlayerZyoStyle = true;

  function q(s){ return document.querySelector(s); }
  function hud(){ return q("#dlinkyProfileHudPlayer"); }
  function audio(){ return q("#profileAudio") || q("audio"); }

  function bindZyoPlayer(){
    const box = hud();
    const btn = q("#dlinkyHudMute");
    const vol = q("#dlinkyHudVolume");
    const left = box && q(".dlinky-hud-left");

    if(!box || !btn || !vol || !left) return;

    if(!btn.__zyoStyleBound){
      btn.__zyoStyleBound = true;
      btn.addEventListener("click", function(e){
        e.preventDefault();
        e.stopPropagation();

        box.classList.add("dlinky-volume-open");

        const a = audio();
        if(a){
          a.muted = !a.muted;
          btn.textContent = a.muted ? "🔇" : "🔊";
        }
      }, true);
    }

    if(!vol.__zyoStyleBound){
      vol.__zyoStyleBound = true;
      vol.addEventListener("input", function(){
        const a = audio();
        if(!a) return;
        a.volume = Math.max(0, Math.min(1, Number(vol.value || 0) / 100));
        if(a.volume > 0) a.muted = false;
        btn.textContent = a.muted ? "🔇" : "🔊";
      }, true);
    }

    if(!left.__zyoStyleBound){
      left.__zyoStyleBound = true;

      left.addEventListener("mouseenter", function(){
        box.classList.add("dlinky-volume-open");
      });

      left.addEventListener("mouseleave", function(){
        box.classList.remove("dlinky-volume-open");
      });
    }

    const a = audio();
    if(a){
      btn.textContent = a.muted ? "🔇" : "🔊";
    }
  }

  document.addEventListener("DOMContentLoaded", ()=>setTimeout(bindZyoPlayer, 400));
  window.addEventListener("load", ()=>setTimeout(bindZyoPlayer, 400));
  window.addEventListener("hashchange", ()=>setTimeout(bindZyoPlayer, 400));
  setInterval(bindZyoPlayer, 1200);
})();



/* ===== DLINKY PIX RECARGA MANUAL + HISTÓRICO ADMIN ===== */
(function(){
  if(window.__dlinkyPixRecargaManualAdmin) return;
  window.__dlinkyPixRecargaManualAdmin = true;

  const ADMIN_EMAIL = "jailtonsilas48@gmail.com";
  const PIX_KEY = "COLOQUE_SUA_CHAVE_PIX_AQUI";
  const ORDERS_KEY = "dlinkyPixRechargeOrders";

  const PACKS = {
    345:  {price:"R$ 30,00"},
    650:  {price:"R$ 50,00"},
    1450: {price:"R$ 100,00"},
    3300: {price:"R$ 200,00"}
  };

  function q(s,r=document){return r.querySelector(s)}
  function qa(s,r=document){return Array.from(r.querySelectorAll(s))}
  function toastMsg(t){try{if(typeof toast==="function")return toast(t)}catch(e){} alert(t)}
  function readJSON(k,f){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}}
  function writeJSON(k,v){localStorage.setItem(k,JSON.stringify(v||[]))}
  function getUser(){try{return JSON.parse(localStorage.getItem("dlinkyUser")||"{}")}catch(e){return {}}}
  function isAdmin(){return String(getUser().email||"").toLowerCase().trim()===ADMIN_EMAIL}

  let currentOrder = null;

  function orderId(){
    return "PIX-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2,6).toUpperCase();
  }

  function drawQr(text){
    const box=q("#dlinkyPixQr");
    if(!box) return;

    // QR visual simples para não depender de biblioteca externa.
    let seed = 0;
    for(let i=0;i<text.length;i++) seed = (seed + text.charCodeAt(i) * (i+1)) % 9973;

    let cells = "";
    for(let i=0;i<121;i++){
      const on = ((i*37 + seed + Math.floor(i/11)*17) % 5) < 2;
      cells += `<i style="background:${on?"#111":"#fff"}"></i>`;
    }

    box.innerHTML = `<div style="display:grid;grid-template-columns:repeat(11,1fr);gap:2px;width:150px;height:150px;background:#fff;padding:8px">${cells}</div>`;
  }

  function openPix(coins){
    const u=getUser();
    const pack=PACKS[coins]||{price:"R$ 0,00"};

    currentOrder = {
      id: orderId(),
      uid: u.uid || "",
      name: u.name || "Usuário",
      slug: u.slug || "",
      email: u.email || "",
      product: `${coins} Linkwuans`,
      coins: Number(coins),
      price: pack.price,
      status: "pendente",
      date: new Date().toLocaleString("pt-BR")
    };

    q("#dlinkyPixProduct").textContent = currentOrder.product;
    q("#dlinkyPixPrice").textContent = currentOrder.price;
    q("#dlinkyPixUser").textContent = currentOrder.email || currentOrder.name || "Usuário";
    q("#dlinkyPixKey").value = PIX_KEY;
    q("#dlinkyPixOrderId").value = currentOrder.id;

    drawQr(`${PIX_KEY}|${currentOrder.id}|${currentOrder.product}|${currentOrder.price}|${currentOrder.email}`);

    q("#dlinkyPixRechargeModal")?.classList.add("show");
  }

  window.dlinkyOpenPixRecharge = openPix;

  function confirmPix(){
    if(!currentOrder) return;

    const orders=readJSON(ORDERS_KEY,[]);
    const exists=orders.some(o=>o.id===currentOrder.id);

    if(!exists){
      orders.unshift(currentOrder);
      writeJSON(ORDERS_KEY,orders);
    }

    q("#dlinkyPixRechargeModal")?.classList.remove("show");
    toastMsg("Pedido enviado ao admin. Aguarde a liberação dos Linkwuans.");
    renderAdminOrders();
  }

  function findCoinsFromButton(btn){
    if(!btn) return 0;

    if(btn.dataset.cleanBuyCoins) return Number(btn.dataset.cleanBuyCoins);

    const card = btn.closest(".dlinky-clean-recharge-card,.shop-card,.asset-card,.card,div");
    const text = (card?.textContent || btn.textContent || "").toLowerCase();
    const m = text.match(/(345|650|1450|3300)\s*linkwuan/);
    return m ? Number(m[1]) : 0;
  }

  function isRechargeClick(btn){
    if(!btn) return false;
    const store = btn.closest("#tab-store");
    if(!store) return false;

    const active = q(".shop-tabs button.active,#tab-store button.active", store);
    const activeText = String(active?.textContent || "").toLowerCase();

    const cardText = String(btn.closest(".shop-card,.asset-card,.dlinky-clean-recharge-card,div")?.textContent || "").toLowerCase();

    return activeText.includes("recarga") && cardText.includes("linkwuan") && (btn.textContent||"").toLowerCase().includes("compr");
  }

  function renderAdminOrders(){
    if(!isAdmin()) return;

    const tab = q("#tab-admin") || q("#admin") || q("[data-admin-panel]");
    if(!tab) return;

    let panel = q("#dlinkyAdminPixOrders", tab);
    if(!panel){
      panel=document.createElement("div");
      panel.id="dlinkyAdminPixOrders";
      panel.className="panel dlinky-admin-orders-panel";
      panel.innerHTML = `<h2>Histórico de compras PIX</h2><div id="dlinkyAdminPixOrdersList"></div>`;
      tab.appendChild(panel);
    }

    const list=q("#dlinkyAdminPixOrdersList", panel);
    const orders=readJSON(ORDERS_KEY,[]);

    list.innerHTML = orders.length ? orders.map(o=>`
      <div class="dlinky-admin-order">
        <div>
          <b>${o.product} • ${o.price}</b>
          <small>${o.email || "sem e-mail"} • ${o.name || "Usuário"} • ${o.date}</small>
          <small>Código: ${o.id} • Status: ${o.status || "pendente"}</small>
        </div>
        <button type="button" data-admin-release-coins="${o.id}" ${o.status==="liberado"?"disabled":""}>
          ${o.status==="liberado"?"Liberado":"Marcar liberado"}
        </button>
      </div>
    `).join("") : `<p>Nenhuma compra PIX registrada ainda.</p>`;
  }

  function markReleased(id){
    const orders=readJSON(ORDERS_KEY,[]);
    const order=orders.find(o=>o.id===id);
    if(!order) return;

    order.status="liberado";
    order.releasedAt=new Date().toLocaleString("pt-BR");

    writeJSON(ORDERS_KEY,orders);
    renderAdminOrders();
    toastMsg("Pedido marcado como liberado. Agora envie os Linkwuans para o usuário.");
  }

  document.addEventListener("click",function(e){
    const close=e.target.closest("#dlinkyPixClose");
    if(close){
      e.preventDefault();
      q("#dlinkyPixRechargeModal")?.classList.remove("show");
      return;
    }

    const copy=e.target.closest("#dlinkyPixCopy");
    if(copy){
      e.preventDefault();
      navigator.clipboard?.writeText(q("#dlinkyPixKey")?.value || PIX_KEY);
      toastMsg("Chave PIX copiada.");
      return;
    }

    const confirm=e.target.closest("#dlinkyPixConfirm");
    if(confirm){
      e.preventDefault();
      confirmPix();
      return;
    }

    const release=e.target.closest("[data-admin-release-coins]");
    if(release){
      e.preventDefault();
      markReleased(release.dataset.adminReleaseCoins);
      return;
    }

    const btn=e.target.closest("button,.btn");
    if(isRechargeClick(btn)){
      const coins=findCoinsFromButton(btn);
      if(coins){
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        openPix(coins);
      }
    }

    setTimeout(renderAdminOrders,200);
  },true);

  document.addEventListener("DOMContentLoaded",()=>setTimeout(renderAdminOrders,500));
  window.addEventListener("hashchange",()=>setTimeout(renderAdminOrders,500));
  setInterval(renderAdminOrders,2500);
})();























/* ===== DLINKY SELO LIMPO DEFINITIVO SEM SOBREPOSIÇÃO ===== */
(function(){
  if(window.__dlinkySeloCleanDefinitivo) return;
  window.__dlinkySeloCleanDefinitivo = true;

  const USER_KEY="dlinkyUser";
  const CATALOG_KEY="dlinkyCleanAdminSelosCatalog";
  const OWNED_KEY="dlinkyOwnedSelosClean";
  const ACTIVE_KEY="dlinkyActiveSelo";
  const SIZE_KEY="dlinkySeloSize";

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));

  function readJSON(k,f){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}}
  function writeJSON(k,v){localStorage.setItem(k,JSON.stringify(v))}
  function norm(v){return String(v||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim()}
  function slug(v){return norm(v).replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}
  function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
  function userObj(){return readJSON(USER_KEY,{})}
  function saveUser(u){localStorage.setItem(USER_KEY,JSON.stringify(u||{}));try{if(typeof user!=="undefined"&&user)Object.assign(user,u||{})}catch(e){}}
  function toastMsg(t){try{if(typeof toast==="function")return toast(t)}catch(e){} console.log(t)}

  function rawCatalog(){const a=readJSON(CATALOG_KEY,[]);return Array.isArray(a)?a:[]}
  function isFake(s){
    const id=String(s&& (s.id||s.seloId||""));
    const name=norm(s&&(s.name||s.nome||""));
    const url=String(s&&(s.url||s.img||s.image||"")||"").trim();
    return id==="selo_verificado_premium_azul" || id==="verified" || ((name.includes("selo verificado premium azul")||name==="selo") && !url);
  }
  function keyOf(s){
    const url=String(s&&(s.url||s.img||s.image)||"").trim();
    return url ? "url:"+url : "name:"+slug(s&&(s.name||s.nome)||"selo");
  }
  function catalog(){
    let arr=rawCatalog().filter(s=>!isFake(s));
    const map=new Map();
    arr.forEach((s,i)=>{
      const k=keyOf(s);
      const old=map.get(k);
      if(!old || i>old.i) map.set(k,{i,s});
    });
    arr=Array.from(map.values()).map((x,i)=>{
      const s=x.s;
      s.type="selo";
      if(!s.id) s.id="selo_"+slug(s.name||s.nome||"admin")+"_"+i;
      return s;
    });
    writeJSON(CATALOG_KEY,arr);
    return arr;
  }
  function idOf(item){
    const raw=String(item&&(item.seloId||item.itemId||item.value||item.id||item.name||item.nome)||"");
    const cat=catalog();
    const byId=cat.find(s=>String(s.id)===raw||String(s.seloId)===raw);
    if(byId) return String(byId.id);
    const byUrl=cat.find(s=>String(s.url||s.img||s.image||"")===String(item&&(item.url||item.img||item.image)||""));
    if(byUrl) return String(byUrl.id);
    const byName=cat.find(s=>norm(s.name||s.nome)===norm(raw));
    if(byName) return String(byName.id);
    return raw;
  }
  function owned(){
    const u=userObj();
    const valid=new Set(catalog().map(s=>String(s.id)));
    let ids=[...(Array.isArray(u.selosOwned)?u.selosOwned:[]), ...readJSON(OWNED_KEY,[])];
    if(Array.isArray(u.inventory)){
      ids.push(...u.inventory.filter(it=>["selo","selos"].includes(norm(it.type))).map(idOf));
    }
    ids=Array.from(new Set(ids.map(String).filter(id=>valid.has(id))));
    u.selosOwned=ids;
    u.inventory=Array.isArray(u.inventory)?u.inventory.filter(it=>!["selo","selos"].includes(norm(it.type))):[];
    if(u.activeSelo && !ids.includes(String(u.activeSelo))) delete u.activeSelo;
    if(localStorage.getItem(ACTIVE_KEY) && !ids.includes(String(localStorage.getItem(ACTIVE_KEY)))) localStorage.removeItem(ACTIVE_KEY);
    writeJSON(OWNED_KEY,ids);
    saveUser(u);
    return ids;
  }
  function selo(id){return catalog().find(s=>String(s.id)===String(id))||null}
  function active(){const u=userObj();const id=String(u.activeSelo||localStorage.getItem(ACTIVE_KEY)||"");return owned().includes(id)?id:""}
  function size(){
    const el=$("#adminSeloSize")||$("#seloSize")||$("#dlinkySeloSize")||$("input[type='range'][id*='Selo']")||$("input[type='range'][id*='selo']");
    let v=el?Number(el.value):Number(localStorage.getItem(SIZE_KEY)||userObj().seloSize||32);
    if(!Number.isFinite(v)||v<12)v=32;if(v>80)v=80;return Math.round(v);
  }
  function applySize(){
    const v=size();
    localStorage.setItem(SIZE_KEY,String(v));
    const u=userObj();u.seloSize=v;saveUser(u);
    document.documentElement.style.setProperty("--dlinky-selo-size",v+"px");
    $$("*").forEach(el=>{if(el.children.length===0 && /Tamanho atual:\s*\d+px/i.test(el.textContent||"")) el.textContent="Tamanho atual: "+v+"px";});
  }

  function removeOldName(){
    ["#dlinkyActiveProfileSelo","#dlinkyActiveProfileSeloSafe","#dlinkyFinalFixedNameSelo","#dlinkyFinalNameSelo","#dlinkySeloNomeUnico","#dlinkySeloNomeFinal",".perfil-selo",".dlinky-final-name-selo",".dlinky-selo-name-badge-safe"].forEach(sel=>$$(sel).forEach(e=>e.remove()));
    const clean=$$("#dlinkySeloNomeClean");clean.slice(1).forEach(e=>e.remove());
  }
  function applyName(){
    removeOldName();
    $("#dlinkySeloNomeClean")?.remove();
    const id=active(); if(!id)return;
    const s=selo(id); if(!s)return;
    const name=$("#profileName")||$(".profile-name")||$(".profile-username")||$(".perfil-nome")||$("h1"); if(!name)return;
    const url=s.url||s.img||s.image||"";
    let el;
    if(url){el=document.createElement("img");el.src=url;el.alt=s.name||s.nome||"Selo";}
    else{el=document.createElement("span");el.textContent="✓";el.style.background="#0ea5e9";el.style.color="#fff";el.style.display="inline-grid";el.style.placeItems="center";el.style.fontWeight="900";}
    el.id="dlinkySeloNomeClean";
    name.appendChild(el);
    applySize();
  }

  function ensureInvTabs(){
    const root=$("#tab-inventory")||$("#inventory"); if(!root)return;
    const tabs=$("#inventoryTabs",root)||$(".asset-tabs",root); if(!tabs)return;
    const specs=[["todos","Todos"],["molduras","Molduras"],["insignias","Insígnias"],["efeitos","Efeitos"],["presentes","Presentes"],["selos","Selos"]];
    const existing=$$("button",tabs).map(b=>norm(b.textContent));
    specs.forEach(([key,label])=>{if(!existing.includes(norm(label))){const b=document.createElement("button");b.textContent=label;b.dataset.invFilter=key;tabs.appendChild(b);}});
    $$("button",tabs).forEach(b=>{const t=norm(b.textContent); if(t.includes("todo"))b.dataset.invFilter="todos"; if(t.includes("moldura"))b.dataset.invFilter="molduras"; if(t.includes("insign"))b.dataset.invFilter="insignias"; if(t.includes("efeito"))b.dataset.invFilter="efeitos"; if(t.includes("presente"))b.dataset.invFilter="presentes"; if(t.includes("selo"))b.dataset.invFilter="selos";});
  }
  function invRoot(){return $("#tab-inventory")||$("#inventory")}
  function invGrid(){const r=invRoot();return r?($("#inventoryGrid",r)||$(".asset-grid",r)||$(".inventory-grid",r)):null}
  function ensureSeloGrid(){
    const root=invRoot(); if(!root)return null;
    let g=$("#dlinkySelosCleanGrid",root); if(g)return g;
    g=document.createElement("div"); g.id="dlinkySelosCleanGrid";
    const base=invGrid()||root; if(base.parentElement)base.parentElement.appendChild(g); else root.appendChild(g);
    return g;
  }
  function renderSelos(){
    const g=ensureSeloGrid(); if(!g)return;
    const ids=owned(); const act=active();
    g.innerHTML=ids.length?ids.map(id=>{
      const s=selo(id); if(!s)return "";
      const url=s.url||s.img||s.image||""; const name=s.name||s.nome||"Selo"; const using=act===id;
      return `<div class="dlinky-selo-clean-card" data-clean-selo-card="${esc(id)}">
        <div class="dlinky-selo-clean-preview">${url?`<img class="dlinky-selo-clean-img" src="${esc(url)}" alt="${esc(name)}">`:`<span class="dlinky-selo-clean-img" style="display:grid;place-items:center;background:#0ea5e9;color:#fff;font-size:34px;font-weight:900">✓</span>`}</div>
        <div class="dlinky-selo-clean-body"><b>${esc(name)}</b><small>selos • ${using?"Usando":"Comprado"}</small><div class="dlinky-selo-clean-actions"><button type="button" data-clean-use-selo="${esc(id)}">${using?"Usando":"Usar"}</button><button type="button" class="danger" data-clean-remove-selo="${esc(id)}">Remover</button></div></div>
      </div>`;
    }).join(""):'<p style="color:#fff;padding:12px 0">Você ainda não possui selos.</p>';
  }
  function isSeloCard(el){const t=norm(el.textContent); const d=norm(el.dataset?.realType||el.dataset?.itemType||el.dataset?.type||el.dataset?.category||"");return d.includes("selo")||t.includes("selo verificado")||t.includes("premium azul")||t.includes("selos");}
  function isMolduraCard(el){const t=norm(el.textContent); const d=norm(el.dataset?.realType||el.dataset?.itemType||el.dataset?.type||el.dataset?.category||"");return d.includes("moldura")||d.includes("frame")||t.includes("moldura")||t.includes("spike")||t.includes("frame");}
  function filterInv(){
    ensureInvTabs(); renderSelos();
    const root=invRoot(); if(!root)return;
    const activeBtn=$$("button",root).find(b=>b.classList.contains("active")||b.classList.contains("dlinky-inv-filter-active")||b.getAttribute("aria-selected")==="true");
    const f=activeBtn?.dataset?.invFilter||"todos";
    const grid=invGrid(); const sg=$("#dlinkySelosCleanGrid",root);
    ["#dlinkySeloInventoryGridFinal","#dlinkySelosInventoryGrid","#dlinkyFinalSeloGrid","#dlinkySeloGridLimpo"].forEach(sel=>{const x=$(sel,root); if(x&&x!==sg)x.style.display="none";});
    const cards=$$(".asset-card,.inv-item-card,.inventory-card,.shop-card,[data-item-type],[data-card-type]",root).filter(e=>!e.closest("#dlinkySelosCleanGrid"));
    if(f==="selos"){if(grid)grid.style.display="none"; if(sg)sg.style.display="grid"; cards.forEach(c=>c.style.display="none"); return;}
    if(sg)sg.style.display="none"; if(grid)grid.style.display="";
    if(f==="molduras"){cards.forEach(c=>c.style.display=(isMolduraCard(c)&&!isSeloCard(c))?"":"none"); return;}
    if(f==="todos"){cards.forEach(c=>c.style.display=isSeloCard(c)?"none":""); return;}
    cards.forEach(c=>{if(isSeloCard(c))c.style.display="none";});
  }

  function renderShopOutros(){
    const btn=$('.shop-tabs [data-shop-tab="other"].active'); const grid=$("#shopGrid"); if(!btn||!grid)return;
    const arr=catalog(); const own=new Set(owned());
    grid.innerHTML=arr.length?arr.map(s=>{
      const id=String(s.id); const url=s.url||s.img||s.image||""; const name=s.name||s.nome||"Selo"; const price=Number(s.price||120);
      return `<div class="dlinky-selo-clean-card" data-shop-selo-clean="${esc(id)}">
        <div class="dlinky-selo-clean-preview">${url?`<img class="dlinky-selo-clean-img" src="${esc(url)}" alt="${esc(name)}">`:`<span class="dlinky-selo-clean-img" style="display:grid;place-items:center;background:#0ea5e9;color:#fff;font-size:34px;font-weight:900">✓</span>`}</div>
        <div class="dlinky-selo-clean-body"><b>${esc(name)}</b><small>${price} Linkwuans</small><div class="dlinky-selo-clean-actions"><button type="button" data-clean-buy-selo="${esc(id)}">${own.has(id)?"Comprado":"Comprar"}</button></div></div>
      </div>`;
    }).join(""):'<p style="color:#fff;padding:12px 0">Nenhum selo cadastrado na loja ainda.</p>';
  }
  function buy(id){
    const s=selo(id); if(!s)return;
    const u=userObj(); const price=Number(s.price||120); const coins=Number(u.coins||u.linkwuans||0);
    if(coins<price){toastMsg("Saldo insuficiente em Linkwuans."); return;}
    u.coins=coins-price; u.linkwuans=u.coins; u.selosOwned=Array.from(new Set([...(Array.isArray(u.selosOwned)?u.selosOwned:[]),String(id)])); saveUser(u); writeJSON(OWNED_KEY,owned().concat([String(id)])); renderShopOutros(); filterInv();
    try{if(typeof renderDash==="function")renderDash()}catch(e){}
  }
  function use(id){if(!owned().includes(String(id)))return; const u=userObj(); u.activeSelo=String(id); localStorage.setItem(ACTIVE_KEY,String(id)); saveUser(u); renderSelos(); applyName();}
  function remove(id){
    // REMOVER DO SELO = apenas desequipar do perfil. Não apaga compra/inventário.
    const u=userObj();
    if(u.activeSelo===String(id) || localStorage.getItem(ACTIVE_KEY)===String(id)){
      delete u.activeSelo;
      localStorage.removeItem(ACTIVE_KEY);
      saveUser(u);
    }
    applyName();
    filterInv();
    try{ if(typeof toast==="function") toast("Selo removido do perfil."); }catch(e){}
  }

  document.addEventListener("click",function(e){
    const inv=e.target.closest("#inventoryTabs button,#tab-inventory .asset-tabs button,#inventory .asset-tabs button");
    if(inv){e.preventDefault(); const tabs=inv.closest(".asset-tabs"); $$("button",tabs).forEach(b=>b.classList.remove("active","dlinky-inv-filter-active")); inv.classList.add("active","dlinky-inv-filter-active"); setTimeout(filterInv,20); return;}
    const other=e.target.closest('.shop-tabs [data-shop-tab="other"]');
    if(other){e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); $$(".shop-tabs button").forEach(b=>b.classList.toggle("active",b===other)); renderShopOutros(); return;}
    const b=e.target.closest("[data-clean-buy-selo]"); if(b){e.preventDefault(); buy(b.dataset.cleanBuySelo); return;}
    const u=e.target.closest("[data-clean-use-selo]"); if(u){e.preventDefault(); use(u.dataset.cleanUseSelo); return;}
    const r=e.target.closest("[data-clean-remove-selo]"); if(r){e.preventDefault(); remove(r.dataset.cleanRemoveSelo); return;}
  },true);
  document.addEventListener("input",function(e){if(e.target&&e.target.matches("input[type='range']")&&/selo|seal/i.test(e.target.id||e.target.name||"")){applySize();applyName();}},true);

  const oldProfile=window.renderProfile;
  if(typeof oldProfile==="function"&&!oldProfile.__seloCleanDefinitivo){const p=function(){const r=oldProfile.apply(this,arguments);setTimeout(applyName,80);return r;};p.__seloCleanDefinitivo=true;window.renderProfile=p;try{renderProfile=p}catch(e){}}
  const oldInv=window.renderInventory;
  if(typeof oldInv==="function"&&!oldInv.__seloCleanDefinitivo){const p=function(){const r=oldInv.apply(this,arguments);setTimeout(filterInv,80);return r;};p.__seloCleanDefinitivo=true;window.renderInventory=p;try{renderInventory=p}catch(e){}}

  document.addEventListener("DOMContentLoaded",()=>{catalog();owned();applySize();setTimeout(filterInv,350);setTimeout(applyName,350);});
  window.addEventListener("hashchange",()=>{catalog();owned();applySize();setTimeout(filterInv,220);setTimeout(applyName,220);setTimeout(renderShopOutros,220);});
})();



/* ===== DLINKY FIX ADMIN SELOS — CADASTRAR NA LOJA ===== */
(function(){
  if(window.__dlinkyFixAdminSelosCadastro) return;
  window.__dlinkyFixAdminSelosCadastro = true;

  const CATALOG_KEY = "dlinkyCleanAdminSelosCatalog";

  function q(s,r=document){return r.querySelector(s)}
  function qa(s,r=document){return Array.from(r.querySelectorAll(s))}
  function readJSON(k,f){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}}
  function writeJSON(k,v){localStorage.setItem(k,JSON.stringify(v))}
  function norm(v){return String(v||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim()}
  function slug(v){return norm(v).replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}
  function toastMsg(t){try{if(typeof toast==="function")return toast(t)}catch(e){} alert(t)}

  function getCatalog(){
    const arr = readJSON(CATALOG_KEY,[]);
    return Array.isArray(arr) ? arr : [];
  }

  function setCatalog(arr){
    writeJSON(CATALOG_KEY, Array.isArray(arr) ? arr : []);
  }

  function cleanFakeAndDuplicates(arr){
    const map = new Map();

    (arr || []).forEach((s, i)=>{
      if(!s) return;

      const id = String(s.id || s.seloId || "");
      const name = String(s.name || s.nome || "").trim();
      const url = String(s.url || s.img || s.image || "").trim();

      const isFake =
        id === "selo_verificado_premium_azul" ||
        id === "verified" ||
        ((norm(name).includes("selo verificado premium azul") || norm(name) === "selo") && !url);

      if(isFake) return;

      const key = url ? "url:"+url : "name:"+slug(name || "selo");

      if(!map.has(key) || i > map.get(key).i){
        s.type = "selo";
        if(!s.id) s.id = "selo_" + slug(name || "admin") + "_" + Date.now().toString(36);
        map.set(key, {i, s});
      }
    });

    return Array.from(map.values()).map(x=>x.s);
  }

  function renderAdminSelos(){
    const list = q("#adminSelosList");
    if(!list) return;

    const arr = cleanFakeAndDuplicates(getCatalog());
    setCatalog(arr);

    list.innerHTML = arr.length ? arr.map((s, i)=>{
      const name = s.name || s.nome || "Selo";
      const desc = s.desc || s.description || "selo para o perfil";
      const url = s.url || s.img || s.image || "";
      return `
        <div class="admin-item" data-admin-selo-id="${s.id}">
          ${url ? `<img src="${url}" alt="">` : ""}
          <div>
            <b>${name}</b><br>
            <small>${desc}</small>
          </div>
          <button class="delete" data-admin-selo-delete-final="${i}">×</button>
        </div>
      `;
    }).join("") : "<p>Nenhum selo cadastrado ainda.</p>";

    const select = q("#adminSeloGiftSelect");
    if(select){
      select.innerHTML = '<option value="">Selecione um selo</option>' + arr.map(s=>`<option value="${s.id}">${s.name || s.nome || "Selo"}</option>`).join("");
    }
  }

  function addSelo(){
    const nameEl = q("#adminSeloName");
    const descEl = q("#adminSeloDesc");
    const priceEl = q("#adminSeloPrice");
    const urlEl = q("#adminSeloUrl");

    const name = (nameEl?.value || "").trim() || "Selo";
    const desc = (descEl?.value || "").trim() || "selo para o perfil";
    const price = Number(priceEl?.value || 120);
    const url = (urlEl?.value || "").trim();

    if(!url){
      toastMsg("Coloque a URL/arquivo do selo antes de adicionar.");
      return;
    }

    let arr = cleanFakeAndDuplicates(getCatalog());

    const same = arr.findIndex(s =>
      String(s.url || s.img || s.image || "").trim() === url ||
      slug(s.name || s.nome || "") === slug(name)
    );

    const item = {
      id: "selo_" + slug(name) + "_" + Date.now().toString(36),
      name,
      desc,
      price: Number.isFinite(price) ? price : 120,
      url,
      type: "selo"
    };

    if(same >= 0) arr[same] = item;
    else arr.unshift(item);

    arr = cleanFakeAndDuplicates(arr);
    setCatalog(arr);

    if(nameEl) nameEl.value = "";
    if(descEl) descEl.value = "";
    if(priceEl) priceEl.value = "120";
    if(urlEl) urlEl.value = "";

    renderAdminSelos();

    // Atualiza loja Outros, se estiver aberta
    const other = q('.shop-tabs [data-shop-tab="other"].active');
    if(other){
      other.click();
      setTimeout(()=>other.click(), 80);
    }

    toastMsg("Selo adicionado na loja.");
  }

  function deleteSelo(index){
    let arr = cleanFakeAndDuplicates(getCatalog());
    const removed = arr.splice(Number(index), 1)[0];
    setCatalog(arr);

    if(removed){
      // limpa posse do selo removido para não ficar item fantasma
      try{
        const ids = readJSON("dlinkyOwnedSelosClean",[]).filter(id=>String(id)!==String(removed.id));
        writeJSON("dlinkyOwnedSelosClean",ids);
        const u = readJSON("dlinkyUser",{});
        if(Array.isArray(u.selosOwned)) u.selosOwned = u.selosOwned.filter(id=>String(id)!==String(removed.id));
        if(String(u.activeSelo)===String(removed.id)) delete u.activeSelo;
        localStorage.setItem("dlinkyUser",JSON.stringify(u));
        if(String(localStorage.getItem("dlinkyActiveSelo"))===String(removed.id)) localStorage.removeItem("dlinkyActiveSelo");
      }catch(e){}
    }

    renderAdminSelos();
    toastMsg("Selo removido.");
  }

  function updateSizeLabel(){
    const input = q("#adminSeloSize");
    const label = q("#adminSeloSizeValue");
    if(input && label) label.textContent = input.value + "px";
  }

  document.addEventListener("click", function(e){
    const add = e.target.closest("#adminAddSeloBtn");
    if(add){
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      addSelo();
      return;
    }

    const del = e.target.closest("[data-admin-selo-delete-final]");
    if(del){
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      deleteSelo(del.dataset.adminSeloDeleteFinal);
      return;
    }

    if(e.target.closest('[data-tab="adminSelos"],#tab-adminSelos button')){
      setTimeout(renderAdminSelos, 150);
    }
  }, true);

  document.addEventListener("input", function(e){
    if(e.target && e.target.id === "adminSeloSize"){
      updateSizeLabel();
    }
  }, true);

  document.addEventListener("DOMContentLoaded", function(){
    updateSizeLabel();
    setTimeout(renderAdminSelos, 400);
  });

  window.addEventListener("hashchange", function(){
    updateSizeLabel();
    setTimeout(renderAdminSelos, 250);
  });
})();



/* ===== DLINKY FIX — OPACIDADE E DESFOQUE FUNCIONANDO ===== */
(function(){
  if(window.__dlinkyLayoutOpacityBlurFix) return;
  window.__dlinkyLayoutOpacityBlurFix = true;

  const USER_KEY = "dlinkyUser";

  function q(s,r=document){return r.querySelector(s)}
  function readUser(){try{return JSON.parse(localStorage.getItem(USER_KEY)||"{}")}catch(e){return {}}}
  function saveUser(u){localStorage.setItem(USER_KEY,JSON.stringify(u||{}));try{if(typeof user!=="undefined"&&user)Object.assign(user,u||{})}catch(e){}}
  function toastMsg(t){try{if(typeof toast==="function")return toast(t)}catch(e){console.log(t)}}

  function num(v, fallback){
    v = Number(v);
    return Number.isFinite(v) ? v : fallback;
  }

  function applyLayoutVars(){
    const u = readUser();

    const opacity = Math.max(25, Math.min(100, num(u.opacity, 100)));
    const blur = Math.max(0, Math.min(24, num(u.blur, 0)));

    document.documentElement.style.setProperty("--cardOpacity", String(opacity / 100));
    document.documentElement.style.setProperty("--profileBlur", blur + "px");
    document.documentElement.style.setProperty("--dlinky-card-opacity", String(opacity / 100));
    document.documentElement.style.setProperty("--dlinky-card-blur", blur + "px");

    const card = q("#profileCard") || q(".profile-wrap");
    if(card){
      card.style.setProperty("--cardOpacity", String(opacity / 100));
      card.style.setProperty("--profileBlur", blur + "px");
      card.style.setProperty("--dlinky-card-opacity", String(opacity / 100));
      card.style.setProperty("--dlinky-card-blur", blur + "px");
      card.style.setProperty("background-color", "rgba(6,3,11," + (opacity / 100) + ")", "important");
      card.style.setProperty("-webkit-backdrop-filter", "blur(" + blur + "px)", "important");
      card.style.setProperty("backdrop-filter", "blur(" + blur + "px)", "important");
    }

    const op = q("#layoutOpacity");
    const bl = q("#layoutBlur");
    if(op && String(op.value || "") !== String(opacity)) op.value = opacity;
    if(bl && String(bl.value || "") !== String(blur)) bl.value = blur;
  }

  function saveLayoutOnly(){
    const u = readUser();

    const type = q("#layoutType");
    const center = q("#layoutCenter");
    const welcome = q("#layoutWelcome");
    const opacity = q("#layoutOpacity");
    const blur = q("#layoutBlur");

    if(type) u.layout = type.value;
    if(center) u.center = center.value;
    if(welcome) u.welcome = welcome.value || "Clique aqui";
    if(opacity) u.opacity = Math.max(25, Math.min(100, num(opacity.value, 100)));
    if(blur) u.blur = Math.max(0, Math.min(24, num(blur.value, 0)));

    saveUser(u);
    applyLayoutVars();
    toastMsg("Layout alterado");
  }

  document.addEventListener("click", function(e){
    const btn = e.target.closest("#saveLayout");
    if(!btn) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    saveLayoutOnly();
  }, true);

  document.addEventListener("input", function(e){
    if(e.target && (e.target.id === "layoutOpacity" || e.target.id === "layoutBlur")){
      const u = readUser();
      if(e.target.id === "layoutOpacity") u.opacity = Math.max(25, Math.min(100, num(e.target.value, 100)));
      if(e.target.id === "layoutBlur") u.blur = Math.max(0, Math.min(24, num(e.target.value, 0)));
      saveUser(u);
      applyLayoutVars();
    }
  }, true);

  const oldRenderProfile = window.renderProfile;
  if(typeof oldRenderProfile === "function" && !oldRenderProfile.__layoutOpacityBlurFix){
    const patched = function(){
      const r = oldRenderProfile.apply(this, arguments);
      setTimeout(applyLayoutVars, 40);
      setTimeout(applyLayoutVars, 200);
      return r;
    };
    patched.__layoutOpacityBlurFix = true;
    window.renderProfile = patched;
    try{renderProfile = patched}catch(e){}
  }

  document.addEventListener("DOMContentLoaded", function(){
    setTimeout(applyLayoutVars, 300);
  });

  window.addEventListener("hashchange", function(){
    setTimeout(applyLayoutVars, 150);
    setTimeout(applyLayoutVars, 400);
  });
})();

/* ===== DLINKY — ABA PARTÍCULAS NO PERFIL ===== */
(function(){
  if(window.__dlinkyParticlesTabFinal) return;
  window.__dlinkyParticlesTabFinal = true;
  const KEY = 'dlinkyUser';
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}}
  function write(u){localStorage.setItem(KEY, JSON.stringify(u||{})); try{ if(typeof user!=='undefined' && user) Object.assign(user,u||{}); }catch(e){}}
  function msg(t){try{ if(typeof toast==='function') return toast(t); }catch(e){} console.log(t);}
  const defaults = {type:'snow',count:45,speed:5,size:'medium'};
  function cfg(){const u=read(); return Object.assign({}, defaults, u.particleConfig||{}, {type:u.particleType||u.particleConfig?.type||defaults.type});}
  function icon(type){return ({snow:'❄',raios:'⚡',stars:'✦',bubbles:'',rain:'╱',fire:'•',leaves:'🍃',matrix:'1',hearts:'❤',embers:'•'})[type] || '✦';}
  function px(size){return size==='small'?[10,18]:size==='large'?[22,38]:[15,28];}
  function fill(){const c=cfg(); const type=$('#particleTypeNew'), count=$('#particleCountNew'), speed=$('#particleSpeedNew'), size=$('#particleSizeNew'); if(type) type.value=c.type; if(count) count.value=c.count; if(speed) speed.value=c.speed; if(size) size.value=c.size; $$('.particle-choice-grid button').forEach(b=>b.classList.toggle('active', b.dataset.particlePick===c.type));}
  function saveParticles(){const u=read(); const c={type:$('#particleTypeNew')?.value||'none', count:Math.max(10,Math.min(120,Number($('#particleCountNew')?.value||45))), speed:Math.max(1,Math.min(10,Number($('#particleSpeedNew')?.value||5))), size:$('#particleSizeNew')?.value||'medium'}; u.particleConfig=c; u.particleType=c.type; u.particles=c.type!=='none'; write(u); fill(); msg('Partículas salvas!');}
  function makeParticles(type){
    const old = $('#dlinkyProfileParticles'); if(old) old.remove();
    const base = cfg(); if(type) base.type=type; if(base.type==='none') return;
    const layer=document.createElement('div'); layer.id='dlinkyProfileParticles'; layer.className='dl-particles-'+base.type;
    const range=px(base.size); const total=Math.max(10,Math.min(120,Number(base.count)||45));
    for(let i=0;i<total;i++){
      const el=document.createElement('span'); el.className='dl-particle '+base.type;
      const sz=range[0]+Math.random()*(range[1]-range[0]);
      el.style.left=(Math.random()*100)+'%'; el.style.fontSize=sz+'px'; el.style.setProperty('--drift', ((Math.random()*70)-35)+'px');
      const dur=(13 - Number(base.speed||5)) + Math.random()*6; el.style.animationDuration=Math.max(2.5,dur)+'s'; el.style.animationDelay=(-Math.random()*12)+'s';
      if(base.type==='bubbles'){el.style.width=sz+'px'; el.style.height=sz+'px';} else {el.textContent=icon(base.type);}
      layer.appendChild(el);
    }
    const page=$('#profile') || document.body; page.appendChild(layer);
  }
  window.createProfileParticles = function(type){ makeParticles(type); };
  try{ createProfileParticles = window.createProfileParticles; }catch(e){}
  const oldOpen = window.openTab;
  if(typeof oldOpen==='function'){
    window.openTab = function(id){ const r=oldOpen.apply(this, arguments); if(id==='particles') setTimeout(fill,30); return r; };
    try{ openTab = window.openTab; }catch(e){}
  }
  document.addEventListener('click', function(e){
    const pick=e.target.closest('[data-particle-pick]'); if(pick){ const s=$('#particleTypeNew'); if(s) s.value=pick.dataset.particlePick; fill(); }
    if(e.target.closest('#saveParticlesNew')){ e.preventDefault(); saveParticles(); }
    if(e.target.closest('#previewParticlesNew')){ e.preventDefault(); saveParticles(); location.hash='#/profile'; }
  }, true);
  document.addEventListener('change', function(e){ if(e.target && ['particleTypeNew','particleCountNew','particleSpeedNew','particleSizeNew'].includes(e.target.id)) fill(); }, true);
  const oldRP = window.renderProfile;
  if(typeof oldRP==='function'){
    window.renderProfile=function(){ const r=oldRP.apply(this, arguments); setTimeout(()=>makeParticles(),60); setTimeout(()=>makeParticles(),300); return r; };
    try{ renderProfile=window.renderProfile; }catch(e){}
  }
  document.addEventListener('DOMContentLoaded', fill);
  setTimeout(fill,300);
})();



/* ===== DLINKY PARTICULAS ESTÁVEL — SALVA, APLICA E DESLIGA SEM BUG ===== */
(function(){
  if(window.__dlinkyParticlesStableFix) return;
  window.__dlinkyParticlesStableFix = true;

  const USER_KEY = "dlinkyUser";
  const LAYER_ID = "dlinkyParticlesStableLayer";

  function q(s,r=document){return r.querySelector(s)}
  function qa(s,r=document){return Array.from(r.querySelectorAll(s))}
  function readUser(){try{return JSON.parse(localStorage.getItem(USER_KEY)||"{}")}catch(e){return {}}}
  function writeUser(u){localStorage.setItem(USER_KEY,JSON.stringify(u||{}));try{if(typeof user!=="undefined"&&user)Object.assign(user,u||{})}catch(e){}}
  function msg(t){try{if(typeof toast==="function")return toast(t)}catch(e){console.log(t)}}

  const defaults = {type:"none", count:45, speed:5, size:"medium"};

  function clamp(n,min,max,fallback){
    n = Number(n);
    if(!Number.isFinite(n)) n = fallback;
    return Math.max(min, Math.min(max, n));
  }

  function config(){
    const u = readUser();
    const c = Object.assign({}, defaults, u.particleConfig || {});
    c.type = u.particleType || c.type || "none";
    c.count = clamp(c.count, 10, 120, 45);
    c.speed = clamp(c.speed, 1, 10, 5);
    c.size = ["small","medium","large"].includes(c.size) ? c.size : "medium";
    if(c.type === "off") c.type = "none";
    return c;
  }

  function icon(type){
    return ({
      snow:"❄",
      raios:"⚡",
      stars:"✦",
      bubbles:"",
      rain:"╱",
      fire:"•",
      leaves:"🍃",
      matrix:"1",
      hearts:"❤"
    })[type] || "✦";
  }

  function sizeRange(size){
    if(size === "small") return [8,15];
    if(size === "large") return [22,38];
    return [14,26];
  }

  function isProfileRoute(){
    const u = readUser();
    const h = location.hash || "#/";
    return h === "#/profile" || (!!u.slug && h === "#/" + u.slug) || q("#profile.page.active");
  }

  function removeOldParticleLayers(){
    qa("#dlinkyProfileParticles,#profileParticleLayer").forEach(el=>el.remove());
    qa("#" + LAYER_ID).slice(1).forEach(el=>el.remove());
  }

  function removeStable(){
    q("#" + LAYER_ID)?.remove();
    removeOldParticleLayers();
  }

  function fillControls(){
    const c = config();
    const type = q("#particleTypeNew");
    const count = q("#particleCountNew");
    const speed = q("#particleSpeedNew");
    const size = q("#particleSizeNew");

    if(type) type.value = c.type;
    if(count) count.value = c.count;
    if(speed) speed.value = c.speed;
    if(size) size.value = c.size;

    qa(".particle-choice-grid button").forEach(btn=>{
      btn.classList.toggle("active", btn.dataset.particlePick === c.type);
    });
  }

  function readControls(){
    return {
      type: q("#particleTypeNew")?.value || "none",
      count: clamp(q("#particleCountNew")?.value, 10, 120, 45),
      speed: clamp(q("#particleSpeedNew")?.value, 1, 10, 5),
      size: q("#particleSizeNew")?.value || "medium"
    };
  }

  function saveParticles(showToast=true){
    const u = readUser();
    const c = readControls();

    u.particleConfig = c;
    u.particleType = c.type;
    u.particles = c.type !== "none";

    writeUser(u);
    fillControls();

    if(c.type === "none") removeStable();
    else applyParticles();

    if(showToast) msg("Partículas salvas!");
  }

  function applyParticles(){
    removeOldParticleLayers();

    if(!isProfileRoute()){
      q("#" + LAYER_ID)?.remove();
      return;
    }

    const c = config();

    if(c.type === "none" || c.type === "off" || c.type === ""){
      removeStable();
      return;
    }

    q("#" + LAYER_ID)?.remove();

    const layer = document.createElement("div");
    layer.id = LAYER_ID;
    layer.className = "dlinky-stable-" + c.type;

    const [min,max] = sizeRange(c.size);
    const total = clamp(c.count, 10, 120, 45);

    for(let i=0;i<total;i++){
      const p = document.createElement("span");
      p.className = "dlinky-stable-particle " + c.type;

      const sz = min + Math.random() * (max-min);
      const duration = Math.max(2.5, (14 - c.speed) + Math.random() * 5);

      p.style.left = (Math.random() * 100) + "%";
      p.style.fontSize = sz + "px";
      p.style.animationDuration = duration + "s";
      p.style.animationDelay = (-Math.random() * duration) + "s";
      p.style.setProperty("--dx", ((Math.random()*90)-45) + "px");

      if(c.type === "bubbles"){
        p.style.width = sz + "px";
        p.style.height = sz + "px";
      }else{
        p.textContent = icon(c.type);
      }

      layer.appendChild(p);
    }

    (q("#profile") || document.body).appendChild(layer);
  }

  // neutraliza o sistema antigo, para não criar 2 camadas
  window.createProfileParticles = function(type){
    if(type){
      const u = readUser();
      const c = Object.assign({}, config(), {type});
      u.particleConfig = c;
      u.particleType = c.type;
      u.particles = c.type !== "none";
      writeUser(u);
    }
    applyParticles();
  };
  try{ createProfileParticles = window.createProfileParticles; }catch(e){}

  document.addEventListener("click", function(e){
    const pick = e.target.closest("[data-particle-pick]");
    if(pick){
      e.preventDefault();
      const select = q("#particleTypeNew");
      if(select) select.value = pick.dataset.particlePick;
      fillControls();
      saveParticles(false);
      return;
    }

    const save = e.target.closest("#saveParticlesNew");
    if(save){
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      saveParticles(true);
      return;
    }

    const preview = e.target.closest("#previewParticlesNew");
    if(preview){
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      saveParticles(false);
      location.hash = "#/profile";
      setTimeout(applyParticles, 120);
      return;
    }
  }, true);

  document.addEventListener("input", function(e){
    if(e.target && ["particleTypeNew","particleCountNew","particleSpeedNew","particleSizeNew"].includes(e.target.id)){
      saveParticles(false);
    }
  }, true);

  document.addEventListener("change", function(e){
    if(e.target && ["particleTypeNew","particleCountNew","particleSpeedNew","particleSizeNew"].includes(e.target.id)){
      saveParticles(false);
    }
  }, true);

  const oldRenderProfile = window.renderProfile;
  if(typeof oldRenderProfile === "function" && !oldRenderProfile.__dlinkyParticlesStableFix){
    const patched = function(){
      const r = oldRenderProfile.apply(this, arguments);
      setTimeout(applyParticles, 90);
      setTimeout(applyParticles, 360);
      setTimeout(applyParticles, 750);
      return r;
    };
    patched.__dlinkyParticlesStableFix = true;
    window.renderProfile = patched;
    try{renderProfile = patched}catch(e){}
  }

  const oldRoute = window.route;
  if(typeof oldRoute === "function" && !oldRoute.__dlinkyParticlesStableFix){
    const patchedRoute = function(){
      const r = oldRoute.apply(this, arguments);
      setTimeout(function(){
        if(isProfileRoute()) applyParticles();
        else removeStable();
      }, 80);
      return r;
    };
    patchedRoute.__dlinkyParticlesStableFix = true;
    window.route = patchedRoute;
    try{route = patchedRoute}catch(e){}
  }

  document.addEventListener("DOMContentLoaded", function(){
    fillControls();
    setTimeout(function(){
      if(isProfileRoute()) applyParticles();
      else removeStable();
    }, 300);
  });

  window.addEventListener("hashchange", function(){
    setTimeout(function(){
      fillControls();
      if(isProfileRoute()) applyParticles();
      else removeStable();
    }, 120);
  });
})();











/* ===== DLINKY SELO TAMANHO INDIVIDUAL REAL ===== */
(function(){
  if(window.__dlinkySeloTamanhoIndividualReal) return;
  window.__dlinkySeloTamanhoIndividualReal = true;

  const USER_KEY = "dlinkyUser";
  const ACTIVE_KEY = "dlinkyActiveSelo";
  const SIZE_MAP_KEY = "dlinkySeloSizesById";

  function q(s,r=document){return r.querySelector(s)}
  function qa(s,r=document){return Array.from(r.querySelectorAll(s))}
  function readJSON(k,f){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}}
  function writeJSON(k,v){localStorage.setItem(k,JSON.stringify(v))}
  function getUser(){return readJSON(USER_KEY,{})}
  function saveUser(u){localStorage.setItem(USER_KEY,JSON.stringify(u||{}));try{if(typeof user!=="undefined"&&user)Object.assign(user,u||{})}catch(e){}}
  function norm(v){return String(v||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim()}
  function slug(v){return norm(v).replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}
  function clamp(n){n=Number(n); if(!Number.isFinite(n)) n=32; return Math.max(16,Math.min(120,Math.round(n)));}

  function sizes(){
    const u=getUser();
    const map=readJSON(SIZE_MAP_KEY,u.seloSizes||{});
    return map && typeof map==="object" ? map : {};
  }
  function saveSizes(map){
    writeJSON(SIZE_MAP_KEY,map||{});
    const u=getUser();
    u.seloSizes=Object.assign({},map||{});
    saveUser(u);
  }

  function cardId(card){
    if(!card) return "";
    const direct =
      card.dataset.cleanSeloCard ||
      card.dataset.seloId ||
      card.dataset.shopSeloClean ||
      card.dataset.finalSeloId ||
      "";
    if(direct && direct !== "selo") return String(direct);

    const title = card.querySelector("b,h3,h4")?.textContent || card.textContent || "selo";
    return slug(title);
  }

  function activeId(){
    const u=getUser();
    return String(u.activeSelo || localStorage.getItem(ACTIVE_KEY) || "");
  }

  function getSizeFor(id){
    const map=sizes();
    return clamp(map[String(id)] || 32);
  }

  function setSizeFor(id,value){
    id=String(id||"");
    if(!id) return;
    const n=clamp(value);
    const map=sizes();
    map[id]=n;
    saveSizes(map);

    qa(`.dlinky-selo-size-personal[data-selo-size-id="${CSS.escape(id)}"]`).forEach(w=>{
      const label=w.querySelector("span");
      const input=w.querySelector("input");
      if(label) label.textContent=n+"px";
      if(input && String(input.value)!==String(n)) input.value=n;
    });

    if(activeId()===id) applyActiveSize();
  }

  function applyActiveSize(){
    const id=activeId();
    const n=getSizeFor(id);
    document.documentElement.style.setProperty("--dlinky-active-selo-size",n+"px");

    const badge=q("#dlinkySeloNomeClean") || q("#dlinkySeloNomeFinal");
    if(badge){
      ["width","height","min-width","min-height","max-width","max-height"].forEach(p=>{
        badge.style.setProperty(p,n+"px","important");
      });
    }
  }

  function injectControls(){
    qa(".dlinky-selo-clean-card,.dlinky-selo-card-final,.dlinky-final-selo-card").forEach(card=>{
      if(!/selo/i.test(card.textContent||"")) return;

      const id=cardId(card);
      if(!id) return;

      // remove controles antigos globais e pessoais duplicados neste card
      qa(".selo-size-mini,.dlinky-selo-size-inline",card).forEach(x=>x.remove());
      qa(".dlinky-selo-size-personal",card).forEach((x,i)=>{if(i>0)x.remove()});

      let wrap=card.querySelector(".dlinky-selo-size-personal");
      const n=getSizeFor(id);

      if(!wrap){
        const actions=card.querySelector(".dlinky-selo-clean-actions,.dlinky-selo-actions-final,.dlinky-final-selo-actions") || card;
        wrap=document.createElement("div");
        wrap.className="dlinky-selo-size-personal";
        wrap.dataset.seloSizeId=id;
        wrap.innerHTML=`<span>${n}px</span><input type="range" min="16" max="120" value="${n}">`;
        actions.appendChild(wrap);
      }else{
        wrap.dataset.seloSizeId=id;
        const label=wrap.querySelector("span");
        const input=wrap.querySelector("input");
        if(label) label.textContent=n+"px";
        if(input) input.value=n;
      }
    });
    applyActiveSize();
  }

  // Remover = só desequipar, nunca apagar do inventário
  function removeOnlyProfile(){
    const u=getUser();
    delete u.activeSelo;
    delete u.seloAtivo;
    saveUser(u);
    localStorage.removeItem(ACTIVE_KEY);
    ["#dlinkySeloNomeClean","#dlinkySeloNomeFinal","#dlinkyActiveProfileSelo","#dlinkyActiveProfileSeloSafe","#dlinkyFinalFixedNameSelo",".perfil-selo"].forEach(sel=>{
      qa(sel).forEach(el=>el.remove());
    });
    qa(".dlinky-selo-clean-card,.dlinky-selo-card-final,.dlinky-final-selo-card").forEach(card=>{
      const small=card.querySelector("small");
      if(small && /selos/i.test(small.textContent)) small.textContent="selos • Comprado";
      qa("button",card).forEach(btn=>{if(/usando/i.test(btn.textContent)) btn.textContent="Usar";});
    });
  }

  document.addEventListener("input",function(e){
    const wrap=e.target.closest && e.target.closest(".dlinky-selo-size-personal");
    if(!wrap || !e.target.matches("input[type='range']")) return;
    e.stopPropagation();
    e.stopImmediatePropagation();
    setSizeFor(wrap.dataset.seloSizeId,e.target.value);
  },true);

  document.addEventListener("click",function(e){
    const rem=e.target.closest("[data-clean-remove-selo],[data-final-remove-selo-clean],[data-selo-final-remove],[data-final-remove-selo],[data-safe-remove-selo]");
    if(rem){
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      removeOnlyProfile();
      setTimeout(injectControls,80);
      return;
    }

    if(e.target.closest("[data-clean-use-selo],[data-final-use-selo-clean],[data-selo-final-use],[data-final-use-selo],[data-safe-use-selo],#tab-inventory button,#inventory button")){
      setTimeout(injectControls,90);
      setTimeout(injectControls,350);
    }
  },true);

  const oldRenderProfile=window.renderProfile;
  if(typeof oldRenderProfile==="function" && !oldRenderProfile.__seloTamanhoIndividualReal){
    const patched=function(){
      const r=oldRenderProfile.apply(this,arguments);
      setTimeout(applyActiveSize,80);
      setTimeout(applyActiveSize,260);
      return r;
    };
    patched.__seloTamanhoIndividualReal=true;
    window.renderProfile=patched;
    try{renderProfile=patched}catch(e){}
  }

  const oldRenderInventory=window.renderInventory;
  if(typeof oldRenderInventory==="function" && !oldRenderInventory.__seloTamanhoIndividualReal){
    const patchedInv=function(){
      const r=oldRenderInventory.apply(this,arguments);
      setTimeout(injectControls,120);
      setTimeout(injectControls,420);
      return r;
    };
    patchedInv.__seloTamanhoIndividualReal=true;
    window.renderInventory=patchedInv;
    try{renderInventory=patchedInv}catch(e){}
  }

  document.addEventListener("DOMContentLoaded",function(){
    setTimeout(injectControls,500);
    setTimeout(applyActiveSize,550);
  });
  window.addEventListener("hashchange",function(){
    setTimeout(injectControls,300);
    setTimeout(applyActiveSize,350);
  });
})();



/* ===== DLINKY FIX FINAL — REMOVER SELO APENAS DO PERFIL ===== */
(function(){
  if(window.__dlinkyRemoverSeloApenasPerfilFinal) return;
  window.__dlinkyRemoverSeloApenasPerfilFinal = true;

  const USER_KEY = "dlinkyUser";
  const ACTIVE_KEY = "dlinkyActiveSelo";

  function q(s,r=document){return r.querySelector(s)}
  function qa(s,r=document){return Array.from(r.querySelectorAll(s))}
  function readUser(){try{return JSON.parse(localStorage.getItem(USER_KEY)||"{}")}catch(e){return {}}}
  function saveUser(u){localStorage.setItem(USER_KEY,JSON.stringify(u||{}));try{if(typeof user!=="undefined"&&user)Object.assign(user,u||{})}catch(e){}}
  function norm(v){return String(v||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim()}

  function isSeloCard(card){
    if(!card) return false;
    const txt = norm(card.textContent || "");
    const data = norm(card.dataset?.cleanSeloCard || card.dataset?.seloId || card.dataset?.shopSeloClean || card.dataset?.realType || "");
    return data.includes("selo") || txt.includes("selo") || txt.includes("selos");
  }

  function getCardFromButton(btn){
    return btn.closest(".dlinky-selo-clean-card,.dlinky-selo-card-final,.dlinky-final-selo-card,.inventory-card,.asset-card,.shop-card");
  }

  function removerSomenteDoPerfil(){
    const u = readUser();

    // NÃO mexe em u.selosOwned, NÃO mexe em dlinkyOwnedSelosClean, NÃO mexe no inventário comprado.
    delete u.activeSelo;
    delete u.seloAtivo;
    saveUser(u);
    localStorage.removeItem(ACTIVE_KEY);

    [
      "#dlinkySeloNomeClean",
      "#dlinkySeloNomeFinal",
      "#dlinkyActiveProfileSelo",
      "#dlinkyActiveProfileSeloSafe",
      "#dlinkyFinalFixedNameSelo",
      ".perfil-selo",
      ".dlinky-final-name-selo",
      ".dlinky-selo-name-badge-safe"
    ].forEach(sel => qa(sel).forEach(el => el.remove()));

    qa(".dlinky-selo-clean-card,.dlinky-selo-card-final,.dlinky-final-selo-card,.inventory-card,.asset-card").forEach(card=>{
      if(!isSeloCard(card)) return;
      const small = card.querySelector("small");
      if(small && /selos/i.test(small.textContent || "")) small.textContent = "selos • Comprado";

      qa("button", card).forEach(btn=>{
        if(/usando/i.test(btn.textContent || "")) btn.textContent = "Usar";
      });
    });

    try{ if(typeof toast === "function") toast("Selo removido do perfil."); }catch(e){}
  }

  document.addEventListener("click", function(e){
    const btn = e.target.closest("button,[data-clean-remove-selo],[data-final-remove-selo-clean],[data-selo-final-remove],[data-final-remove-selo],[data-safe-remove-selo]");
    if(!btn) return;

    const card = getCardFromButton(btn);
    const isRemove =
      /remover/i.test(btn.textContent || "") ||
      btn.hasAttribute("data-clean-remove-selo") ||
      btn.hasAttribute("data-final-remove-selo-clean") ||
      btn.hasAttribute("data-selo-final-remove") ||
      btn.hasAttribute("data-final-remove-selo") ||
      btn.hasAttribute("data-safe-remove-selo");

    if(isRemove && isSeloCard(card)){
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      removerSomenteDoPerfil();
      return false;
    }
  }, true);
})();



/* ===== DLINKY FIX FINAL — LIBERAR LINKWUANS DO PIX PARA O USUÁRIO ===== */
(function(){
  if(window.__dlinkyPixReleaseCreditsFinal) return;
  window.__dlinkyPixReleaseCreditsFinal = true;

  const USER_KEY = "dlinkyUser";
  const ORDERS_KEY = "dlinkyPixRechargeOrders";
  const CREDIT_KEY = "dlinkyPixReleasedCreditsByEmail";

  function readJSON(k,f){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}}
  function writeJSON(k,v){localStorage.setItem(k,JSON.stringify(v))}
  function getUser(){return readJSON(USER_KEY,{})}
  function saveUser(u){localStorage.setItem(USER_KEY,JSON.stringify(u||{}));try{if(typeof user!=="undefined"&&user)Object.assign(user,u||{})}catch(e){}}
  function toastMsg(t){try{if(typeof toast==="function")return toast(t)}catch(e){console.log(t)}}
  function emailKey(email){return String(email||"").toLowerCase().trim()}

  function addCreditForOrder(order){
    if(!order || !order.email) return;

    const email = emailKey(order.email);
    const coins = Number(order.coins || String(order.product||"").match(/\d+/)?.[0] || 0);
    if(!email || !coins) return;

    const credits = readJSON(CREDIT_KEY,{});
    credits[email] = Number(credits[email] || 0) + coins;
    writeJSON(CREDIT_KEY, credits);
  }

  function applyCreditsToCurrentUser(){
    const u = getUser();
    const email = emailKey(u.email);
    if(!email) return;

    const credits = readJSON(CREDIT_KEY,{});
    const amount = Number(credits[email] || 0);

    if(amount > 0){
      const current = Number(u.coins || u.linkwuans || 0);
      u.coins = current + amount;
      u.linkwuans = u.coins;

      credits[email] = 0;
      writeJSON(CREDIT_KEY, credits);
      saveUser(u);

      try{ if(typeof renderDash==="function") renderDash(); }catch(e){}
      toastMsg("Linkwuans liberados: +" + amount);
    }
  }

  function patchReleasedOrders(){
    const orders = readJSON(ORDERS_KEY,[]);
    let changed = false;

    orders.forEach(o=>{
      if(o && o.status === "liberado" && !o.creditRegistered){
        addCreditForOrder(o);
        o.creditRegistered = true;
        changed = true;
      }
    });

    if(changed){
      writeJSON(ORDERS_KEY,orders);
    }

    applyCreditsToCurrentUser();
  }

  // Captura o clique do admin ANTES do handler antigo quando possível e registra crédito.
  document.addEventListener("click", function(e){
    const btn = e.target.closest("[data-admin-release-coins]");
    if(!btn) return;

    const id = btn.dataset.adminReleaseCoins;
    const orders = readJSON(ORDERS_KEY,[]);
    const order = orders.find(o=>o.id===id);

    if(order && order.status !== "liberado"){
      order.status = "liberado";
      order.releasedAt = new Date().toLocaleString("pt-BR");
      order.creditRegistered = true;
      addCreditForOrder(order);
      writeJSON(ORDERS_KEY,orders);
      toastMsg("Pedido liberado. Os Linkwuans serão aplicados na conta do comprador.");
    }
  }, true);

  document.addEventListener("DOMContentLoaded", function(){
    setTimeout(patchReleasedOrders,500);
    setTimeout(applyCreditsToCurrentUser,900);
  });

  window.addEventListener("hashchange", function(){
    setTimeout(patchReleasedOrders,250);
    setTimeout(applyCreditsToCurrentUser,600);
  });

  setInterval(applyCreditsToCurrentUser,3000);
})();



/* ===== DLINKY WELCOME CARD — TROCA AVISO DE VERIFICAÇÃO ===== */
(function(){
  if(window.__dlinkyWelcomeCardReplace) return;
  window.__dlinkyWelcomeCardReplace = true;

  function replaceVerifyCard(){
    const cards = Array.from(document.querySelectorAll(".verify-box,.verification-box,.alert,.panel"));
    const card = cards.find(el => /Sua conta ainda não foi ativada|Confirme seu e-mail|Solicitar verificação/i.test(el.textContent || ""));
    if(!card) return;

    card.className = "verify-box dlinky-welcome-dashboard-card";
    card.innerHTML = `
      <div class="dlinky-welcome-glow"></div>
      <div class="dlinky-welcome-icon">✦</div>
      <div class="dlinky-welcome-content">
        <b>Bem-vindo ao painel Dlinky</b>
        <p>Personalize seu perfil gamer, configure links, efeitos, selos, molduras e deixe sua página com a sua identidade.</p>
      </div>
    `;
  }

  const oldRenderDash = window.renderDash;
  if(typeof oldRenderDash === "function" && !oldRenderDash.__dlinkyWelcomeCardReplace){
    const patched = function(){
      const r = oldRenderDash.apply(this, arguments);
      setTimeout(replaceVerifyCard, 80);
      setTimeout(replaceVerifyCard, 250);
      return r;
    };
    patched.__dlinkyWelcomeCardReplace = true;
    window.renderDash = patched;
    try{renderDash = patched}catch(e){}
  }

  document.addEventListener("DOMContentLoaded",()=>setTimeout(replaceVerifyCard,400));
  window.addEventListener("hashchange",()=>setTimeout(replaceVerifyCard,250));
})();



/* ===== DLINKY FIX — CONTAS SEPARADAS E PERFIL LIMPO POR E-MAIL ===== */
(function(){
  if(window.__dlinkyContasSeparadasLimpo) return;
  window.__dlinkyContasSeparadasLimpo = true;

  const CURRENT_KEY = "dlinkyUser";
  const ACCOUNTS_KEY = "dlinkyAccountsByEmailClean";
  const ADMIN_EMAIL = "jailtonsilas48@gmail.com";

  function q(s,r=document){return r.querySelector(s)}
  function readJSON(k,f){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}}
  function writeJSON(k,v){localStorage.setItem(k,JSON.stringify(v))}
  function emailKey(v){return String(v||"").toLowerCase().trim()}
  function slug(v){
    return String(v||"")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g,"")
      .replace(/[^a-z0-9]+/g,"")
      .slice(0,24) || ("user" + Date.now().toString(36));
  }
  function toastMsg(t){try{if(typeof toast==="function")return toast(t)}catch(e){console.log(t)}}

  function cleanUser(email, name, wantedSlug){
    email = emailKey(email);
    const base = email.split("@")[0] || "novo usuario";
    const displayName = (name || base).trim();

    return {
      uid: "uid_" + email.replace(/[^a-z0-9]/g,"_"),
      name: displayName,
      slug: slug(wantedSlug || displayName || base),
      email: email,
      bio: "",
      avatar: "",
      banner: "",
      bg: "",
      video: "",
      frame: "",
      music: "",
      welcome: "Bem-vindo ao meu perfil",
      color: "#a855f7",
      particles: false,
      particleType: "none",
      verified: false,
      hideViews: false,
      template: "default",
      decoration: "",
      views: 0,
      links: [],
      socials: [],
      history: ["Conta criada no Dlinky"],
      inventory: [],
      coins: 0,
      linkwuans: 0,
      selosOwned: [],
      activeSelo: "",
      seloSizes: {}
    };
  }

  function accounts(){
    const a = readJSON(ACCOUNTS_KEY,{});
    return a && typeof a === "object" ? a : {};
  }

  function saveAccount(u){
    if(!u || !u.email) return;
    const all = accounts();
    all[emailKey(u.email)] = JSON.parse(JSON.stringify(u));
    writeJSON(ACCOUNTS_KEY, all);
  }

  function loadAccount(email){
    const key = emailKey(email);
    const all = accounts();
    if(all[key]) return all[key];

    // Se for o admin e já existir perfil antigo salvo, aproveita como conta admin.
    const current = readJSON(CURRENT_KEY,{});
    if(key === ADMIN_EMAIL && current && emailKey(current.email) === ADMIN_EMAIL){
      all[key] = current;
      writeJSON(ACCOUNTS_KEY, all);
      return current;
    }

    const fresh = cleanUser(key);
    all[key] = fresh;
    writeJSON(ACCOUNTS_KEY, all);
    return fresh;
  }

  function setCurrentAccount(u){
    user = Object.assign({}, u);
    localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
    saveAccount(user);
  }

  function patchSaveUser(){
    try{
      const old = saveUser;
      saveUser = function(){
        localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
        saveAccount(user);
        try{ renderDash(); }catch(e){}
        toastMsg("Salvo com sucesso!");
      };
      window.saveUser = saveUser;
    }catch(e){}
  }

  function patchAuthForms(){
    const register = q("#registerForm");
    const login = q("#loginForm");

    if(register && !register.__dlinkyAccountCleanPatched){
      register.__dlinkyAccountCleanPatched = true;
      register.onsubmit = function(e){
        e.preventDefault();

        const name = q("#regName")?.value?.trim() || "";
        const email = emailKey(q("#regEmail")?.value || "");
        const pass = q("#regPass")?.value || "";
        const pass2 = q("#regPass2")?.value || "";
        const wantedSlug = q("#regSlug")?.value || "";

        if(!email) return toastMsg("Coloque um e-mail.");
        if(pass !== pass2) return toastMsg("As senhas não conferem");

        const all = accounts();
        const fresh = cleanUser(email, name, wantedSlug);
        fresh.password = pass;

        all[email] = fresh;
        writeJSON(ACCOUNTS_KEY, all);
        setCurrentAccount(fresh);

        toastMsg("Conta criada!");
        location.hash = "#/dashboard";
      };
    }

    if(login && !login.__dlinkyAccountCleanPatched){
      login.__dlinkyAccountCleanPatched = true;
      login.onsubmit = function(e){
        e.preventDefault();

        const email = emailKey(q("#loginEmail")?.value || q("#email")?.value || q("input[type='email']", login)?.value || "");
        const pass = q("#loginPass")?.value || q("#password")?.value || q("input[type='password']", login)?.value || "";

        if(!email) return toastMsg("Coloque o e-mail.");

        const all = accounts();
        let acc = all[email];

        if(!acc){
          // Login com e-mail novo entra em conta limpa, não no perfil de outra pessoa.
          acc = cleanUser(email);
          acc.password = pass;
          all[email] = acc;
          writeJSON(ACCOUNTS_KEY, all);
        }

        setCurrentAccount(acc);
        toastMsg("Login efetuado");
        location.hash = "#/dashboard";
      };
    }
  }

  function protectCurrentUser(){
    const cur = readJSON(CURRENT_KEY,{});
    const email = emailKey(cur.email);

    if(!email) return;

    const all = accounts();

    // Se entrou com outro e-mail mas o perfil ainda está linkroubadao, troca para uma conta limpa desse e-mail.
    const looksLeaked =
      email !== ADMIN_EMAIL &&
      (String(cur.slug||"").toLowerCase() === "linkroubadao" ||
       String(cur.name||"").toLowerCase().includes("linkroubadao"));

    if(looksLeaked){
      const clean = all[email] || cleanUser(email);
      all[email] = clean;
      writeJSON(ACCOUNTS_KEY, all);
      setCurrentAccount(clean);
    }else{
      all[email] = cur;
      writeJSON(ACCOUNTS_KEY, all);
    }
  }

  function hideAdminForNonAdmin(){
    const cur = readJSON(CURRENT_KEY,{});
    const isAdmin = emailKey(cur.email) === ADMIN_EMAIL;

    document.querySelectorAll(".admin-only,#tab-admin,[data-tab='admin']").forEach(el=>{
      if(!isAdmin){
        el.style.display = "none";
        el.classList.remove("show");
      }
    });
  }

  patchSaveUser();

  document.addEventListener("DOMContentLoaded", function(){
    patchAuthForms();
    protectCurrentUser();
    hideAdminForNonAdmin();
  });

  window.addEventListener("hashchange", function(){
    setTimeout(function(){
      patchAuthForms();
      protectCurrentUser();
      hideAdminForNonAdmin();
    }, 80);
  });

  const oldRenderDash = window.renderDash || (typeof renderDash !== "undefined" ? renderDash : null);
  if(typeof oldRenderDash === "function" && !oldRenderDash.__dlinkyContasSeparadasLimpo){
    const patched = function(){
      protectCurrentUser();
      const r = oldRenderDash.apply(this, arguments);
      setTimeout(hideAdminForNonAdmin, 50);
      return r;
    };
    patched.__dlinkyContasSeparadasLimpo = true;
    window.renderDash = patched;
    try{renderDash = patched}catch(e){}
  }
})();



/* ===== DLINKY FIX — CONTA NOVA SEM INVENTÁRIO/SELOS ===== */
(function(){
  if(window.__dlinkyContaNovaSemItens) return;
  window.__dlinkyContaNovaSemItens = true;

  const CURRENT_KEY = "dlinkyUser";
  const ACCOUNTS_KEY = "dlinkyAccountsByEmailClean";
  const OWNED_SELOS_KEY = "dlinkyOwnedSelosClean";
  const ACTIVE_SELO_KEY = "dlinkyActiveSelo";
  const ADMIN_EMAIL = "jailtonsilas48@gmail.com";

  function q(s,r=document){return r.querySelector(s)}
  function readJSON(k,f){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}}
  function writeJSON(k,v){localStorage.setItem(k,JSON.stringify(v))}
  function emailKey(v){return String(v||"").toLowerCase().trim()}
  function saveUser(u){localStorage.setItem(CURRENT_KEY,JSON.stringify(u||{}));try{if(typeof user!=="undefined"&&user)Object.assign(user,u||{})}catch(e){}}

  function resetPaidItemsForNewUser(u){
    if(!u) return u;

    // Conta comum começa zerada: sem inventário, sem selo comprado, sem selo ativo.
    u.inventory = [];
    u.selosOwned = [];
    u.activeSelo = "";
    u.seloAtivo = "";
    u.frame = "";
    u.decoration = "";
    u.badges = [];
    u.gifts = [];
    u.presents = [];

    // mantém moedas zeradas para conta nova
    if(!Number(u.coins)) u.coins = 0;
    if(!Number(u.linkwuans)) u.linkwuans = 0;

    return u;
  }

  function cleanIfNonAdminNewLeak(){
    const u = readJSON(CURRENT_KEY,{});
    const email = emailKey(u.email);
    if(!email || email === ADMIN_EMAIL) return;

    const createdClean = u.__cleanNewAccount === true;
    const hasPaidItems =
      (Array.isArray(u.inventory) && u.inventory.length) ||
      (Array.isArray(u.selosOwned) && u.selosOwned.length) ||
      u.activeSelo ||
      u.seloAtivo;

    if(createdClean && hasPaidItems){
      // CORREÇÃO: não limpar inventário inteiro depois que o usuário compra moldura/efeito.
      // Este patch existia para impedir vazamento de SELos em conta nova, mas estava removendo molduras compradas
      // ao abrir o perfil/voltar para o site. Agora só remove itens de selo vazados.
      u.inventory = Array.isArray(u.inventory) ? u.inventory.filter(it=>{
        const t = String(it && it.type || '').toLowerCase();
        const n = String((it && (it.name || it.nome || it.title)) || '').toLowerCase();
        return !(t === 'selo' || t === 'selos' || n.includes('selo'));
      }) : [];
      u.selosOwned = [];
      u.activeSelo = '';
      u.seloAtivo = '';
      saveUser(u);
      localStorage.removeItem(OWNED_SELOS_KEY);
      localStorage.removeItem(ACTIVE_SELO_KEY);

      const all = readJSON(ACCOUNTS_KEY,{});
      all[email] = u;
      writeJSON(ACCOUNTS_KEY,all);
    }
  }

  function patchRegisterAndLogin(){
    const reg = q("#registerForm");
    if(reg && !reg.__semItensPatch){
      reg.__semItensPatch = true;

      const old = reg.onsubmit;
      reg.onsubmit = function(e){
        if(typeof old === "function"){
          old.call(this,e);
        }

        setTimeout(function(){
          const u = readJSON(CURRENT_KEY,{});
          const email = emailKey(u.email);
          if(email && email !== ADMIN_EMAIL){
            resetPaidItemsForNewUser(u);
            u.__cleanNewAccount = true;
            saveUser(u);

            localStorage.removeItem(OWNED_SELOS_KEY);
            localStorage.removeItem(ACTIVE_SELO_KEY);

            const all = readJSON(ACCOUNTS_KEY,{});
            all[email] = u;
            writeJSON(ACCOUNTS_KEY,all);
          }
        },80);
      };
    }

    const login = q("#loginForm");
    if(login && !login.__semItensPatch){
      login.__semItensPatch = true;

      const old = login.onsubmit;
      login.onsubmit = function(e){
        if(typeof old === "function"){
          old.call(this,e);
        }

        setTimeout(function(){
          const u = readJSON(CURRENT_KEY,{});
          const email = emailKey(u.email);
          if(email && email !== ADMIN_EMAIL && u.__cleanNewAccount === true){
            cleanIfNonAdminNewLeak();
          }
        },120);
      };
    }
  }

  function hideSeloCardsIfUserDoesntOwn(){
    const u = readJSON(CURRENT_KEY,{});
    const email = emailKey(u.email);
    if(!email || email === ADMIN_EMAIL) return;

    const owned = Array.isArray(u.selosOwned) ? u.selosOwned : [];
    const inventory = Array.isArray(u.inventory) ? u.inventory : [];

    if(owned.length || inventory.length) return;

    const inv = q("#tab-inventory") || q("#inventory");
    if(!inv) return;

    // Na aba Selos, sem compra, mostra mensagem limpa em vez de card.
    const activeTab = Array.from(inv.querySelectorAll("button")).find(b => b.classList.contains("active") || b.classList.contains("dlinky-inv-filter-active"));
    const isSelos = activeTab && /selo/i.test(activeTab.textContent || "");

    if(isSelos){
      inv.querySelectorAll(".dlinky-selo-clean-card,.dlinky-selo-card-final,.dlinky-final-selo-card,.asset-card,.inventory-card").forEach(card=>{
        if(/selo/i.test(card.textContent || "")) card.remove();
      });

      const grid = inv.querySelector("#dlinkySelosCleanGrid,#dlinkySeloInventoryGridFinal,#inventoryGrid,.asset-grid,.inventory-grid");
      if(grid && !/Você ainda não possui selos/i.test(grid.textContent || "")){
        grid.innerHTML = '<p style="color:#fff;padding:12px 0">Você ainda não possui selos.</p>';
      }
    }
  }

  document.addEventListener("DOMContentLoaded",function(){
    patchRegisterAndLogin();
    cleanIfNonAdminNewLeak();
    setTimeout(hideSeloCardsIfUserDoesntOwn,400);
  });

  window.addEventListener("hashchange",function(){
    setTimeout(function(){
      patchRegisterAndLogin();
      cleanIfNonAdminNewLeak();
      hideSeloCardsIfUserDoesntOwn();
    },200);
  });

  document.addEventListener("click",function(e){
    if(e.target.closest("#tab-inventory button,#inventory button")){
      setTimeout(hideSeloCardsIfUserDoesntOwn,250);
    }
  },true);
})();



/* ===== DLINKY FIX REAL — CONTA NOVA NÃO MOSTRA SELOS NO INVENTÁRIO ===== */
(function(){
  if(window.__dlinkyContaNovaNaoMostraSelosInventario) return;
  window.__dlinkyContaNovaNaoMostraSelosInventario = true;

  const USER_KEY = "dlinkyUser";
  const ACCOUNTS_KEY = "dlinkyAccountsByEmailClean";
  const ADMIN_EMAIL = "jailtonsilas48@gmail.com";

  function q(s,r=document){return r.querySelector(s)}
  function qa(s,r=document){return Array.from(r.querySelectorAll(s))}
  function readJSON(k,f){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}}
  function writeJSON(k,v){localStorage.setItem(k,JSON.stringify(v))}
  function emailKey(v){return String(v||"").toLowerCase().trim()}
  function norm(v){return String(v||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim()}
  function saveUser(u){localStorage.setItem(USER_KEY,JSON.stringify(u||{}));try{if(typeof user!=="undefined"&&user)Object.assign(user,u||{})}catch(e){}}

  function isNewCleanUser(){
    const u = readJSON(USER_KEY,{});
    const email = emailKey(u.email);
    if(!email || email === ADMIN_EMAIL) return false;

    const noInventory = !Array.isArray(u.inventory) || u.inventory.length === 0;
    const noSelos = !Array.isArray(u.selosOwned) || u.selosOwned.length === 0;
    const noActive = !u.activeSelo && !u.seloAtivo;

    return noInventory && noSelos && noActive;
  }

  function forceCleanUserPaidItems(){
    const u = readJSON(USER_KEY,{});
    const email = emailKey(u.email);
    if(!email || email === ADMIN_EMAIL) return;

    u.inventory = [];
    u.selosOwned = [];
    u.activeSelo = "";
    u.seloAtivo = "";
    u.frame = "";
    u.decoration = "";
    u.badges = [];
    u.gifts = [];
    u.presents = [];

    saveUser(u);

    // IMPORTANTE: esses eram globais e faziam a conta nova puxar selo antigo.
    localStorage.removeItem("dlinkyOwnedSelosClean");
    localStorage.removeItem("dlinkyActiveSelo");

    const all = readJSON(ACCOUNTS_KEY,{});
    if(all[email]){
      all[email] = Object.assign({}, all[email], u, {
        inventory: [],
        selosOwned: [],
        activeSelo: "",
        seloAtivo: "",
        frame: "",
        decoration: "",
        badges: [],
        gifts: [],
        presents: []
      });
      writeJSON(ACCOUNTS_KEY, all);
    }
  }

  function inventoryIsOnSelos(){
    const root = q("#tab-inventory") || q("#inventory");
    if(!root) return false;

    const active = qa("button",root).find(b =>
      b.classList.contains("active") ||
      b.classList.contains("dlinky-inv-filter-active") ||
      b.getAttribute("aria-selected") === "true"
    );

    return active && /selo/i.test(active.textContent || "");
  }

  function wipeSeloCardsForCleanAccount(){
    if(!isNewCleanUser()) return;

    const root = q("#tab-inventory") || q("#inventory");
    if(!root) return;

    if(!inventoryIsOnSelos()) return;

    // Remove qualquer card de selo que algum render antigo criou por cima.
    qa(".dlinky-selo-clean-card,.dlinky-selo-card-final,.dlinky-final-selo-card,.asset-card,.inventory-card,.inv-item-card,.shop-card,[data-clean-selo-card],[data-selo-id]", root).forEach(card=>{
      if(/selo/i.test(card.textContent || "") || card.dataset.cleanSeloCard || card.dataset.seloId){
        card.remove();
      }
    });

    // Mostra mensagem limpa na aba Selos.
    const grid =
      q("#dlinkySelosCleanGrid",root) ||
      q("#dlinkySeloInventoryGridFinal",root) ||
      q("#inventoryGrid",root) ||
      q(".asset-grid",root) ||
      q(".inventory-grid",root);

    if(grid){
      grid.style.display = "block";
      grid.innerHTML = '<p style="color:#fff;padding:12px 0">Você ainda não possui selos.</p>';
    }
  }

  // Intercepta render antigo de inventário e limpa depois.
  const oldRenderInventory = window.renderInventory || (typeof renderInventory !== "undefined" ? renderInventory : null);
  if(typeof oldRenderInventory === "function" && !oldRenderInventory.__contaNovaNaoMostraSelos){
    const patched = function(){
      const r = oldRenderInventory.apply(this, arguments);
      setTimeout(wipeSeloCardsForCleanAccount, 40);
      setTimeout(wipeSeloCardsForCleanAccount, 180);
      setTimeout(wipeSeloCardsForCleanAccount, 500);
      return r;
    };
    patched.__contaNovaNaoMostraSelos = true;
    window.renderInventory = patched;
    try{renderInventory = patched}catch(e){}
  }

  document.addEventListener("click",function(e){
    if(e.target.closest("#tab-inventory button,#inventory button")){
      setTimeout(function(){
        if(isNewCleanUser()){
          forceCleanUserPaidItems();
          wipeSeloCardsForCleanAccount();
        }
      },60);
      setTimeout(wipeSeloCardsForCleanAccount,250);
      setTimeout(wipeSeloCardsForCleanAccount,700);
    }
  },true);

  document.addEventListener("DOMContentLoaded",function(){
    if(isNewCleanUser()){
      forceCleanUserPaidItems();
      setTimeout(wipeSeloCardsForCleanAccount,400);
    }
  });

  window.addEventListener("hashchange",function(){
    setTimeout(function(){
      if(isNewCleanUser()){
        forceCleanUserPaidItems();
        wipeSeloCardsForCleanAccount();
      }
    },250);
    setTimeout(wipeSeloCardsForCleanAccount,700);
  });
})();



/* ===== DLINKY FIX DEFINITIVO — SELos NÃO VAZAM PARA CONTA NOVA ===== */
(function(){
  if(window.__dlinkySeloNaoVazaContaNovaDefinitivo) return;
  window.__dlinkySeloNaoVazaContaNovaDefinitivo = true;

  const USER_KEY = "dlinkyUser";
  const ACCOUNTS_KEY = "dlinkyAccountsByEmailClean";
  const ADMIN_EMAIL = "jailtonsilas48@gmail.com";

  function q(s,r=document){return r.querySelector(s)}
  function qa(s,r=document){return Array.from(r.querySelectorAll(s))}
  function readJSON(k,f){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}}
  function writeJSON(k,v){localStorage.setItem(k,JSON.stringify(v))}
  function emailKey(v){return String(v||"").toLowerCase().trim()}
  function saveUser(u){localStorage.setItem(USER_KEY,JSON.stringify(u||{}));try{if(typeof user!=="undefined"&&user)Object.assign(user,u||{})}catch(e){}}

  function isNonAdminCleanAccount(){
    const u = readJSON(USER_KEY,{});
    const email = emailKey(u.email);
    if(!email || email === ADMIN_EMAIL) return false;

    // Conta criada nova deve ficar sem item pago até comprar.
    // Mesmo se algum código antigo puxar dlinkyOwnedSelosClean global, aqui bloqueia.
    return u.__cleanNewAccount === true && u.__hasPurchasedSelo !== true;
  }

  function clearSeloLeak(){
    if(!isNonAdminCleanAccount()) return;

    const u = readJSON(USER_KEY,{});
    u.inventory = Array.isArray(u.inventory) ? u.inventory.filter(it => {
      const t = String(it && it.type || "").toLowerCase();
      return t !== "selo" && t !== "selos";
    }) : [];

    u.selosOwned = [];
    u.activeSelo = "";
    u.seloAtivo = "";

    saveUser(u);

    // Estes eram globais e faziam conta nova puxar selo comprado/cadastrado antigo.
    localStorage.removeItem("dlinkyOwnedSelosClean");
    localStorage.removeItem("dlinkyActiveSelo");

    const all = readJSON(ACCOUNTS_KEY,{});
    const email = emailKey(u.email);
    if(email && all[email]){
      all[email] = Object.assign({}, all[email], {
        inventory: u.inventory,
        selosOwned: [],
        activeSelo: "",
        seloAtivo: "",
        __cleanNewAccount: true,
        __hasPurchasedSelo: false
      });
      writeJSON(ACCOUNTS_KEY,all);
    }
  }

  function inventoryIsSelos(){
    const root = q("#tab-inventory") || q("#inventory");
    if(!root) return false;
    const active = qa("button",root).find(b =>
      b.classList.contains("active") ||
      b.classList.contains("dlinky-inv-filter-active") ||
      b.getAttribute("aria-selected") === "true"
    );
    return !!(active && /selo/i.test(active.textContent || ""));
  }

  function forceEmptySeloTab(){
    clearSeloLeak();

    if(!isNonAdminCleanAccount()) return;

    const root = q("#tab-inventory") || q("#inventory");
    if(!root || !inventoryIsSelos()) return;

    qa(".dlinky-selo-clean-card,.dlinky-selo-card-final,.dlinky-final-selo-card,.asset-card,.inventory-card,.inv-item-card,.shop-card,[data-clean-selo-card],[data-selo-id]", root).forEach(card=>{
      if(/selo/i.test(card.textContent || "") || card.dataset.cleanSeloCard || card.dataset.seloId){
        card.remove();
      }
    });

    const grids = [
      q("#dlinkySelosCleanGrid",root),
      q("#dlinkySeloInventoryGridFinal",root),
      q("#inventoryGrid",root),
      q(".asset-grid",root),
      q(".inventory-grid",root)
    ].filter(Boolean);

    const grid = grids[0];
    if(grid){
      grid.style.display = "block";
      grid.innerHTML = '<p style="color:#fff;padding:12px 0">Você ainda não possui selos.</p>';
    }
  }

  function markPurchasedIfActuallyBought(){
    const u = readJSON(USER_KEY,{});
    const email = emailKey(u.email);
    if(!email || email === ADMIN_EMAIL) return;

    const hasOwned = (Array.isArray(u.selosOwned) && u.selosOwned.length > 0) ||
      (Array.isArray(u.inventory) && u.inventory.some(it => /selo/i.test(String(it && it.type || ""))));

    if(hasOwned){
      u.__hasPurchasedSelo = true;
      saveUser(u);

      const all = readJSON(ACCOUNTS_KEY,{});
      if(all[email]){
        all[email] = Object.assign({}, all[email], u);
        writeJSON(ACCOUNTS_KEY,all);
      }
    }
  }

  // Antes de qualquer clique em Selos, limpa o vazamento.
  document.addEventListener("click",function(e){
    if(e.target.closest("#tab-inventory button,#inventory button")){
      clearSeloLeak();
      setTimeout(forceEmptySeloTab,30);
      setTimeout(forceEmptySeloTab,180);
      setTimeout(forceEmptySeloTab,600);
    }

    // Se a pessoa comprar um selo de verdade, libera o inventário para essa conta.
    if(e.target.closest("[data-clean-buy-selo],[data-final-buy-selo-clean],[data-buy-selo-final]")){
      setTimeout(markPurchasedIfActuallyBought,250);
      setTimeout(markPurchasedIfActuallyBought,800);
    }
  }, true);

  // Envolve renderInventory: limpa ANTES e DEPOIS para nenhum sistema antigo renderizar selo vazado.
  const oldRenderInventory = window.renderInventory || (typeof renderInventory !== "undefined" ? renderInventory : null);
  if(typeof oldRenderInventory === "function" && !oldRenderInventory.__seloNaoVazaContaNovaDefinitivo){
    const patched = function(){
      clearSeloLeak();
      const r = oldRenderInventory.apply(this, arguments);
      setTimeout(forceEmptySeloTab,30);
      setTimeout(forceEmptySeloTab,180);
      setTimeout(forceEmptySeloTab,600);
      return r;
    };
    patched.__seloNaoVazaContaNovaDefinitivo = true;
    window.renderInventory = patched;
    try{renderInventory = patched}catch(e){}
  }

  document.addEventListener("DOMContentLoaded",function(){
    clearSeloLeak();
    setTimeout(forceEmptySeloTab,400);
  });

  window.addEventListener("hashchange",function(){
    clearSeloLeak();
    setTimeout(forceEmptySeloTab,200);
    setTimeout(forceEmptySeloTab,700);
  });
})();



/* ===== DLINKY FIX LEVE — SELos VAZIOS SEM CONGELAR ===== */
(function(){
  if(window.__dlinkySelosVaziosSemCongelar) return;
  window.__dlinkySelosVaziosSemCongelar = true;

  const USER_KEY = "dlinkyUser";
  const ADMIN_EMAIL = "jailtonsilas48@gmail.com";

  function q(s,r=document){return r.querySelector(s)}
  function qa(s,r=document){return Array.from(r.querySelectorAll(s))}
  function readJSON(k,f){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}}
  function saveUser(u){localStorage.setItem(USER_KEY,JSON.stringify(u||{}));try{if(typeof user!=="undefined"&&user)Object.assign(user,u||{})}catch(e){}}
  function emailKey(v){return String(v||"").toLowerCase().trim()}
  function norm(v){return String(v||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim()}

  function currentUser(){return readJSON(USER_KEY,{})}
  function isAdmin(){return emailKey(currentUser().email) === ADMIN_EMAIL}

  function hasBoughtSelo(){
    const u = currentUser();
    if(isAdmin()) return true;

    const owned = Array.isArray(u.selosOwned) ? u.selosOwned.filter(Boolean) : [];
    const inv = Array.isArray(u.inventory) ? u.inventory : [];

    const invSelo = inv.some(it=>{
      const t = norm(it && it.type);
      const name = norm((it && (it.name || it.nome || it.title)) || "");
      return t === "selo" || t === "selos" || name.includes("selo");
    });

    return owned.length > 0 || invSelo || u.__hasPurchasedSelo === true;
  }

  function cleanOnlyIfZero(){
    if(hasBoughtSelo()) return false;

    const u = currentUser();
    if(isAdmin()) return false;

    u.selosOwned = [];
    u.activeSelo = "";
    u.seloAtivo = "";
    u.inventory = Array.isArray(u.inventory) ? u.inventory.filter(it=>{
      const t = norm(it && it.type);
      const name = norm((it && (it.name || it.nome || it.title)) || "");
      return !(t === "selo" || t === "selos" || name.includes("selo"));
    }) : [];

    saveUser(u);
    localStorage.removeItem("dlinkyOwnedSelosClean");
    localStorage.removeItem("dlinkyActiveSelo");
    return true;
  }

  function selosTabActive(root){
    const active = qa("button",root).find(b =>
      b.classList.contains("active") ||
      b.classList.contains("dlinky-inv-filter-active") ||
      b.getAttribute("aria-selected") === "true"
    );
    return !!(active && /selo/i.test(active.textContent || ""));
  }

  function showEmptySelosOnce(){
    const root = q("#tab-inventory") || q("#inventory");
    if(!root || !selosTabActive(root)) return;
    if(hasBoughtSelo()) return;

    cleanOnlyIfZero();

    const oldGrids = qa("#dlinkySeloInventoryGridFinal,#dlinkySelosInventoryGrid,#dlinkyFinalSeloGrid,#dlinkySeloGridLimpo", root);
    oldGrids.forEach(g=>{ g.style.display = "none"; });

    qa(".dlinky-selo-clean-card,.dlinky-selo-card-final,.dlinky-final-selo-card,.asset-card,.inventory-card,.inv-item-card,.shop-card,[data-clean-selo-card],[data-selo-id]", root).forEach(card=>{
      const txt = norm(card.textContent || "");
      const data = norm(card.dataset.cleanSeloCard || card.dataset.seloId || card.dataset.itemType || "");
      if(txt.includes("selo") || data.includes("selo")) card.remove();
    });

    let grid = q("#dlinkySelosCleanGrid", root) || q("#inventoryGrid", root) || q(".asset-grid", root) || q(".inventory-grid", root);
    if(!grid){
      grid = document.createElement("div");
      grid.id = "dlinkySelosCleanGrid";
      root.appendChild(grid);
    }
    grid.style.display = "block";
    grid.innerHTML = '<p style="color:#fff;padding:12px 0">Você ainda não possui selos.</p>';
  }

  function runSoon(){
    setTimeout(showEmptySelosOnce, 80);
    setTimeout(showEmptySelosOnce, 250);
  }

  document.addEventListener("click", function(e){
    if(e.target.closest("#tab-inventory button,#inventory button")){
      cleanOnlyIfZero();
      runSoon();
    }

    if(e.target.closest("[data-clean-buy-selo],[data-final-buy-selo-clean],[data-buy-selo-final]")){
      setTimeout(function(){
        const u = currentUser();
        if(!isAdmin()){
          u.__hasPurchasedSelo = true;
          saveUser(u);
        }
      }, 300);
    }
  }, true);

  const oldRenderInventory = window.renderInventory || (typeof renderInventory !== "undefined" ? renderInventory : null);
  if(typeof oldRenderInventory === "function" && !oldRenderInventory.__selosVaziosSemCongelar){
    const patched = function(){
      cleanOnlyIfZero();
      const r = oldRenderInventory.apply(this, arguments);
      runSoon();
      return r;
    };
    patched.__selosVaziosSemCongelar = true;
    window.renderInventory = patched;
    try{renderInventory = patched}catch(e){}
  }

  document.addEventListener("DOMContentLoaded", function(){
    cleanOnlyIfZero();
    runSoon();
  });

  window.addEventListener("hashchange", function(){
    cleanOnlyIfZero();
    runSoon();
  });
})();



/* ===== DLINKY FIX — ADMIN VOLTA E AVISO SÓ NO INÍCIO ===== */
(function(){
  if(window.__dlinkyAdminVoltaNoticeInicio) return;
  window.__dlinkyAdminVoltaNoticeInicio = true;

  const ADMIN_EMAIL = "jailtonsilas48@gmail.com";
  const USER_KEY = "dlinkyUser";

  function q(s,r=document){return r.querySelector(s)}
  function qa(s,r=document){return Array.from(r.querySelectorAll(s))}
  function readUser(){try{return JSON.parse(localStorage.getItem(USER_KEY)||"{}")}catch(e){return {}}}
  function emailKey(v){return String(v||"").toLowerCase().trim()}
  function isAdmin(){
    const u = readUser();
    const runtime = (typeof user !== "undefined" && user && user.email) ? user.email : "";
    return emailKey(u.email || runtime) === ADMIN_EMAIL;
  }

  function activeTabId(){
    const active = q(".dash-tab.active");
    return active ? active.id.replace("tab-","") : "home";
  }

  function updateNotice(){
    document.body.classList.toggle("dlinky-home-active", activeTabId() === "home");
  }

  function showAdminLinks(){
    qa(".admin-only").forEach(el=>{
      if(isAdmin()){
        el.classList.add("show");
        el.style.display = "flex";
      }else{
        el.classList.remove("show");
        el.style.display = "none";
      }
    });
  }

  function openTabSafe(id){
    if((id === "admin" || id === "adminSelos") && !isAdmin()){
      try{ if(typeof toast === "function") toast("Admin disponível somente para o dono."); }catch(e){}
      id = "home";
    }

    qa(".dash-tab").forEach(x=>x.classList.remove("active"));
    const tab = q("#tab-" + id);
    if(tab) tab.classList.add("active");

    qa(".side-link").forEach(x=>x.classList.toggle("active", x.dataset.tab === id));

    try{ q(".sidebar")?.classList.remove("open"); }catch(e){}

    if(id === "admin"){
      try{ if(typeof renderAdminList === "function") renderAdminList(); }catch(e){}
      try{ if(typeof renderAdminOrders === "function") renderAdminOrders(); }catch(e){}
    }

    if(id === "adminSelos"){
      try{
        const ev = new Event("hashchange");
        window.dispatchEvent(ev);
      }catch(e){}
    }

    updateNotice();
    showAdminLinks();
  }

  // Corrige clique direto nos links do menu admin e força o conteúdo aparecer.
  document.addEventListener("click",function(e){
    const link = e.target.closest("[data-tab]");
    if(!link) return;

    const id = link.dataset.tab;
    if(id === "admin" || id === "adminSelos" || id === "home"){
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      openTabSafe(id);
      return false;
    }

    setTimeout(updateNotice,80);
  },true);

  const oldOpenTab = window.openTab || (typeof openTab !== "undefined" ? openTab : null);
  if(typeof oldOpenTab === "function" && !oldOpenTab.__adminVoltaNoticeInicio){
    const patched = function(id){
      if(id === "admin" || id === "adminSelos" || id === "home"){
        openTabSafe(id);
        return;
      }
      const r = oldOpenTab.apply(this,arguments);
      setTimeout(updateNotice,50);
      setTimeout(showAdminLinks,50);
      return r;
    };
    patched.__adminVoltaNoticeInicio = true;
    window.openTab = patched;
    try{openTab = patched}catch(e){}
  }

  const oldRenderDash = window.renderDash || (typeof renderDash !== "undefined" ? renderDash : null);
  if(typeof oldRenderDash === "function" && !oldRenderDash.__adminVoltaNoticeInicio){
    const patchedDash = function(){
      const r = oldRenderDash.apply(this,arguments);
      setTimeout(showAdminLinks,50);
      setTimeout(updateNotice,60);
      return r;
    };
    patchedDash.__adminVoltaNoticeInicio = true;
    window.renderDash = patchedDash;
    try{renderDash = patchedDash}catch(e){}
  }

  document.addEventListener("DOMContentLoaded",function(){
    setTimeout(showAdminLinks,300);
    setTimeout(updateNotice,300);
  });

  window.addEventListener("hashchange",function(){
    setTimeout(showAdminLinks,150);
    setTimeout(updateNotice,150);
  });
})();



/* ===== DLINKY LINKTREE FLOW — DASHBOARD NORMAL + LINK PÚBLICO ===== */
(function(){
  if(window.__dlinkyLinktreeFlowFix) return;
  window.__dlinkyLinktreeFlowFix = true;

  const USER_KEY = "dlinkyUser";

  function q(s,r=document){return r.querySelector(s)}
  function qa(s,r=document){return Array.from(r.querySelectorAll(s))}
  function readJSON(k,f){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}}
  function saveLocalUser(u){
    localStorage.setItem(USER_KEY, JSON.stringify(u || {}));
    try{
      if(typeof user !== "undefined" && user){
        Object.keys(user).forEach(k=>delete user[k]);
        Object.assign(user, u || {});
      }
    }catch(e){}
  }
  function cleanSlug(v){
    return String(v||"")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g,"")
      .replace(/[^a-z0-9_-]/g,"")
      .slice(0,30);
  }
  function toastMsg(t){try{if(typeof toast==="function")return toast(t)}catch(e){} console.log(t)}
  function isFile(){return location.protocol === "file:" || location.origin === "null"}
  function reserved(s){
    s = String(s||"").toLowerCase();
    return ["","login","register","dashboard","profile","assets","premium","admin","index.html"].includes(s);
  }

  function getPublicSlug(){
    // No PC pelo arquivo local, NÃO usa pathname C:/Users/... como perfil.
    // Só usa hash se for #/nome.
    const hash = location.hash || "";
    if(hash.startsWith("#/")){
      const hslug = cleanSlug(hash.replace("#/","").split("/")[0]);
      if(!reserved(hslug)) return hslug;
    }

    // Online publicado: https://site.netlify.app/linkroubadao
    if(!isFile()){
      const path = cleanSlug(location.pathname.replace(/^\/+|\/+$/g,"").split("/")[0]);
      if(!reserved(path)) return path;
    }

    return "";
  }

  function publicUrl(slug){
    slug = cleanSlug(slug || readJSON(USER_KEY,{}).slug || "usuario");
    // Local: mostra formato de teste com hash.
    if(isFile()) return location.href.split("#")[0] + "#/" + slug;
    return location.origin + "/" + slug;
  }

  async function loadProfile(slug){
    slug = cleanSlug(slug);
    if(!slug) return null;

    // Firebase, quando publicado ou quando o SDK estiver carregado.
    try{
      if(window.firebase && firebase.apps && firebase.apps.length && firebase.firestore){
        const snap = await firebase.firestore().collection("profiles").doc(slug).get();
        if(snap.exists) return snap.data() || null;
      }
    }catch(e){
      console.warn("Public profile Firebase:", e);
    }

    // Fallback local: o próprio usuário logado.
    const local = readJSON(USER_KEY,{});
    if(cleanSlug(local.slug) === slug) return local;

    return null;
  }

  function renderPublic(data){
    if(!data) return false;

    const old = readJSON(USER_KEY,{});
    const merged = Object.assign({}, old, data, {
      slug: cleanSlug(data.slug || old.slug || ""),
      __publicView: true
    });

    saveLocalUser(merged);

    qa(".page").forEach(p=>p.classList.remove("active"));
    q("#profile")?.classList.add("active");

    document.body.classList.add("dlinky-public-view");

    try{ if(typeof renderProfile === "function") renderProfile(); }catch(e){}

    document.body.classList.add("dlinky-public-view");
    return true;
  }

  async function openPublicIfNeeded(){
    const slug = getPublicSlug();
    if(!slug){
      document.body.classList.remove("dlinky-public-view");
      return false;
    }

    const data = await loadProfile(slug);

    if(data){
      renderPublic(data);
      return true;
    }

    qa(".page").forEach(p=>p.classList.remove("active"));
    q("#simple")?.classList.add("active");
    if(q("#simpleTitle")) q("#simpleTitle").textContent = "Perfil não encontrado";
    if(q("#simpleText")) q("#simpleText").textContent = "Esse perfil ainda não existe ou ainda não foi publicado.";
    return true;
  }

  async function publishCurrentProfile(){
    const u = readJSON(USER_KEY,{});
    const slug = cleanSlug(u.slug);
    if(!slug || reserved(slug)) return;

    try{
      if(window.firebase && firebase.apps && firebase.apps.length && firebase.firestore){
        await firebase.firestore().collection("profiles").doc(slug).set({
          uid: u.uid || "",
          name: u.name || "Usuário",
          slug,
          email: u.email || "",
          bio: u.bio || "",
          avatar: u.avatar || (() => {
        try {
          const local = JSON.parse(localStorage.getItem('dlinkyUser') || '{}');
          const k = 'dlinkyAvatarPreserve_' + ((u.email || u.slug || local.email || local.slug || 'local').toLowerCase().trim());
          return local.avatar || localStorage.getItem(k) || '';
        } catch(e) { return ''; }
      })(),
          banner: u.banner || "",
          bg: u.bg || "",
          video: u.video || "",
          frame: u.frame || "",
          music: u.music || "",
          welcome: u.welcome || "",
          color: u.color || "#a855f7",
          particles: u.particles !== false,
          particleType: u.particleType || "snow",
          verified: !!u.verified,
          links: Array.isArray(u.links) ? u.links : [],
          socials: Array.isArray(u.socials) ? u.socials : [],
          tags: Array.isArray(u.tags) ? u.tags : [],
          embeds: Array.isArray(u.embeds) ? u.embeds : [],
          decoration: u.decoration || "",
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, {merge:true});
      }
    }catch(e){
      console.warn("Publish profile:", e);
    }
  }

  function addCopyButton(){
    [q("#viewProfile"), q("#viewProfile2")].filter(Boolean).forEach(btn=>{
      if(btn.__copyLinkFixed) return;
      btn.__copyLinkFixed = true;

      const copy = document.createElement("button");
      copy.type = "button";
      copy.className = "btn dark small dlinky-copy-link-btn";
      copy.textContent = "🔗 Copiar link";
      copy.onclick = async function(e){
        e.preventDefault();
        e.stopPropagation();

        const u = readJSON(USER_KEY,{});
        const link = publicUrl(u.slug);

        try{
          await navigator.clipboard.writeText(link);
          toastMsg("Link copiado!");
        }catch(err){
          prompt("Copie seu link:", link);
        }
      };

      btn.insertAdjacentElement("afterend", copy);
    });
  }

  function fixViewProfileButton(){
    [q("#viewProfile"), q("#viewProfile2")].filter(Boolean).forEach(btn=>{
      if(btn.__viewProfileFixed) return;
      btn.__viewProfileFixed = true;
      btn.addEventListener("click", function(e){
        e.preventDefault();
        e.stopPropagation();

        const u = readJSON(USER_KEY,{});
        location.hash = "#/" + cleanSlug(u.slug || "profile");
      }, true);
    });
  }

  const oldRoute = window.route || (typeof route !== "undefined" ? route : null);
  if(typeof oldRoute === "function" && !oldRoute.__linktreeFlowFix){
    const patched = function(){
      const slug = getPublicSlug();

      // Se for login/register/dashboard, deixa o sistema normal abrir.
      if(slug){
        openPublicIfNeeded();
        return;
      }

      document.body.classList.remove("dlinky-public-view");
      const r = oldRoute.apply(this, arguments);
      setTimeout(addCopyButton,80);
      setTimeout(fixViewProfileButton,80);
      return r;
    };
    patched.__linktreeFlowFix = true;
    window.route = patched;
    try{ route = patched; }catch(e){}
  }

  const oldRenderDash = window.renderDash || (typeof renderDash !== "undefined" ? renderDash : null);
  if(typeof oldRenderDash === "function" && !oldRenderDash.__linktreeFlowFix){
    const patchedDash = function(){
      const r = oldRenderDash.apply(this, arguments);
      setTimeout(addCopyButton,80);
      setTimeout(fixViewProfileButton,80);
      setTimeout(publishCurrentProfile,900);
      return r;
    };
    patchedDash.__linktreeFlowFix = true;
    window.renderDash = patchedDash;
    try{ renderDash = patchedDash; }catch(e){}
  }

  // Salva no Firebase depois de alterações, sem atrapalhar login/dashboard.
  if(!localStorage.__dlinkyLinktreeFlowFix){
    localStorage.__dlinkyLinktreeFlowFix = true;
    const originalSetItem = localStorage.setItem.bind(localStorage);
    localStorage.setItem = function(key,value){
      const r = originalSetItem(key,value);
      if(key === USER_KEY){
        clearTimeout(window.__dlinkyPublishProfileTimer);
        window.__dlinkyPublishProfileTimer = setTimeout(publishCurrentProfile,1000);
      }
      return r;
    };
  }

  document.addEventListener("DOMContentLoaded",function(){
    const slug = getPublicSlug();
    if(slug) openPublicIfNeeded();
    setTimeout(addCopyButton,300);
    setTimeout(fixViewProfileButton,300);
    setTimeout(publishCurrentProfile,1200);
  });

  window.addEventListener("hashchange",function(){
    const slug = getPublicSlug();
    if(slug) openPublicIfNeeded();
    else document.body.classList.remove("dlinky-public-view");

    setTimeout(addCopyButton,200);
    setTimeout(fixViewProfileButton,200);
  });
})();



/* ===== DLINKY FIX — MOLDURA NORMAL NO PERFIL PÚBLICO / NETLIFY ===== */
(function(){
  if(window.__dlinkyMolduraPerfilPublicoNormal) return;
  window.__dlinkyMolduraPerfilPublicoNormal = true;

  const USER_KEY = "dlinkyUser";

  function q(s,r=document){return r.querySelector(s)}
  function readJSON(k,f){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}}
  function saveLocalUser(u){
    localStorage.setItem(USER_KEY, JSON.stringify(u || {}));
    try{
      if(typeof user !== "undefined" && user){
        Object.keys(user).forEach(k=>delete user[k]);
        Object.assign(user,u||{});
      }
    }catch(e){}
  }
  function norm(v){
    return String(v||"")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g,"")
      .trim();
  }
  function isGoodImageUrl(v){
    v = String(v||"").trim();
    if(!v) return false;
    if(v.startsWith("http://") || v.startsWith("https://") || v.startsWith("data:image/")) return true;
    if(v.startsWith("assets/")) return true;
    if(/\.(png|apng|gif|webp|jpg|jpeg|svg)(\?|#|$)/i.test(v)) return true;
    return false;
  }

  function customFrames(){
    return readJSON("dlinkyCustomFrames",[]);
  }

  function allFrameSources(){
    const u = readJSON(USER_KEY,{});
    const inv = Array.isArray(u.inventory) ? u.inventory : [];
    const custom = Array.isArray(customFrames()) ? customFrames() : [];
    return [...inv, ...custom].filter(Boolean);
  }

  function resolveFrameUrl(){
    const u = readJSON(USER_KEY,{});

    if(isGoodImageUrl(u.frame)) return u.frame;

    const active = String(u.activeFrameId || "").trim();
    const wanted = norm(u.frame || u.frameName || active);

    const found = allFrameSources().find(it=>{
      const id = String(it.id || "").trim();
      const name = norm(it.name || it.nome || it.title || "");
      const url = String(it.url || it.frame || it.image || "").trim();
      return url && (
        (active && id === active) ||
        (wanted && name === wanted) ||
        (wanted && norm(id) === wanted) ||
        (wanted && norm(url) === wanted)
      );
    });

    if(found && isGoodImageUrl(found.url || found.frame || found.image)){
      return found.url || found.frame || found.image;
    }

    return "";
  }

  function fixFrameNow(){
    const img = q("#profileFrame");
    const wrap = q("#avatarDecoration");
    if(!img) return;

    const u = readJSON(USER_KEY,{});
    const url = resolveFrameUrl();

    if(url){
      u.frame = url;
      saveLocalUser(u);

      img.src = url;
      img.alt = "";
      img.classList.remove("dlinky-frame-broken");
      img.classList.add("dlinky-frame-ok");
      img.style.display = "block";
      if(wrap) wrap.classList.add("has-img-frame","frame-final-fit","dlinky-profile-frame-lock");
    }else{
      // Se veio só o nome da moldura, não mostra imagem quebrada no perfil.
      if(!isGoodImageUrl(u.frame)){
        img.removeAttribute("src");
        img.alt = "";
        img.classList.remove("dlinky-frame-ok");
        img.classList.add("dlinky-frame-broken");
        img.style.display = "none";
        if(wrap) wrap.classList.remove("has-img-frame");
      }
    }
  }

  // Publica dados públicos com a URL real da moldura, não só o nome.
  async function publishFrameFixed(){
    const u = readJSON(USER_KEY,{});
    const slug = String(u.slug || "").trim().toLowerCase();
    const url = resolveFrameUrl();

    if(url){
      u.frame = url;
      saveLocalUser(u);
    }

    try{
      if(slug && window.firebase && firebase.apps && firebase.apps.length && firebase.firestore){
        await firebase.firestore().collection("profiles").doc(slug).set({
          frame: url || "",
          activeFrameId: u.activeFrameId || "",
          frameAdjustments: u.frameAdjustments || {},
          frameAdjust: u.frameAdjust || {},
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, {merge:true});
      }
    }catch(e){
      console.warn("Dlinky frame publish:", e);
    }
  }

  const oldRenderProfile = window.renderProfile || (typeof renderProfile !== "undefined" ? renderProfile : null);
  if(typeof oldRenderProfile === "function" && !oldRenderProfile.__molduraPerfilPublicoNormal){
    const patched = function(){
      const r = oldRenderProfile.apply(this,arguments);
      setTimeout(fixFrameNow,0);
      setTimeout(fixFrameNow,120);
      setTimeout(fixFrameNow,400);
      return r;
    };
    patched.__molduraPerfilPublicoNormal = true;
    window.renderProfile = patched;
    try{renderProfile = patched}catch(e){}
  }

  document.addEventListener("error", function(e){
    if(e.target && e.target.id === "profileFrame"){
      e.target.removeAttribute("src");
      e.target.alt = "";
      e.target.style.display = "none";
      e.target.classList.add("dlinky-frame-broken");
    }
  }, true);

  document.addEventListener("DOMContentLoaded",function(){
    setTimeout(fixFrameNow,400);
    setTimeout(publishFrameFixed,1200);
  });

  window.addEventListener("hashchange",function(){
    setTimeout(fixFrameNow,250);
    setTimeout(publishFrameFixed,900);
  });

  document.addEventListener("click",function(e){
    if(e.target.closest("[data-dlinky-use-frame],#saveFrameAdjust,#viewProfile,#viewProfile2")){
      setTimeout(fixFrameNow,100);
      setTimeout(publishFrameFixed,800);
    }
  },true);
})();



/* ===== DLINKY MOLDURA ESTÁVEL — NÃO REMOVE INVENTÁRIO ===== */
(function(){
  if(window.__dlinkyMolduraNaoSumirEstavel) return;
  window.__dlinkyMolduraNaoSumirEstavel = true;

  const USER_KEY = "dlinkyUser";
  const FRAMES_KEY = "dlinkyCustomFrames";

  function q(s,r=document){return r.querySelector(s)}
  function qa(s,r=document){return Array.from(r.querySelectorAll(s))}
  function readJSON(k,f){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}}
  function writeJSON(k,v){localStorage.setItem(k,JSON.stringify(v))}
  function getUser(){return readJSON(USER_KEY,{})}
  function saveUser(u){
    localStorage.setItem(USER_KEY,JSON.stringify(u||{}));
    try{
      if(typeof user !== "undefined" && user){
        Object.keys(user).forEach(k=>delete user[k]);
        Object.assign(user,u||{});
      }
    }catch(e){}
  }

  function cleanUrl(v){
    return String(v||"")
      .trim()
      .replace(/^url\(["']?|["']?\)$/g,"")
      .replace(/\\/g,"/");
  }

  function isImageUrl(v){
    v = cleanUrl(v);
    if(!v) return false;
    if(v.startsWith("data:image/")) return true;
    if(v.startsWith("http://") || v.startsWith("https://") || v.startsWith("assets/")){
      return /\.(png|apng|gif|webp|jpg|jpeg|svg)(\?|#|$)/i.test(v);
    }
    return false;
  }

  function itemUrl(it){
    return cleanUrl(it && (it.url || it.frameUrl || it.image || it.img || it.src || it.frame));
  }

  function isFrameItem(it){
    if(!it) return false;
    const t = String(it.type||"").toLowerCase();
    const n = String(it.name||it.nome||it.title||"").toLowerCase();
    return t.includes("frame") || t.includes("moldura") || n.includes("moldura") || isImageUrl(itemUrl(it));
  }

  function allFrames(){
    const u = getUser();
    const inv = Array.isArray(u.inventory) ? u.inventory : [];
    const admin = readJSON(FRAMES_KEY,[]);
    return [...inv, ...(Array.isArray(admin)?admin:[])].filter(isFrameItem);
  }

  function normalizeFrameItemsOnly(){
    const u = getUser();
    if(!Array.isArray(u.inventory)) u.inventory = [];

    let changed = false;
    u.inventory = u.inventory.map(it=>{
      if(!isFrameItem(it)) return it;

      const url = itemUrl(it);

      // NÃO remove item se a URL estiver estranha. Só não aplica no perfil.
      const fixed = Object.assign({}, it, {
        type: "frame",
        url: url || it.url || "",
        frameUrl: url || it.frameUrl || ""
      });

      if(JSON.stringify(fixed) !== JSON.stringify(it)) changed = true;
      return fixed;
    });

    if(changed) saveUser(u);
  }

  function resolveActiveFrameUrl(){
    const u = getUser();

    if(isImageUrl(u.frameUrl)) return cleanUrl(u.frameUrl);
    if(isImageUrl(u.frame)) return cleanUrl(u.frame);

    const active = String(u.activeFrameId || "").trim();
    const wantedName = String(u.frameName || u.frame || "").toLowerCase().trim();

    const found = allFrames().find(it=>{
      const id = String(it.id||"").trim();
      const name = String(it.name||it.nome||it.title||"").toLowerCase().trim();
      const url = itemUrl(it);
      return isImageUrl(url) && (
        (active && id === active) ||
        (wantedName && name === wantedName) ||
        (wantedName && url.toLowerCase() === wantedName)
      );
    });

    return found ? itemUrl(found) : "";
  }

  function applyFrameToProfile(){
    const img = q("#profileFrame");
    const wrap = q("#avatarDecoration");
    if(!img) return;

    const url = resolveActiveFrameUrl();
    const u = getUser();

    if(url && isImageUrl(url)){
      u.frame = url;
      u.frameUrl = url;
      saveUser(u);

      img.src = url;
      img.alt = "";
      img.classList.remove("dlinky-frame-off");
      img.style.display = "block";
      if(wrap) wrap.classList.add("has-img-frame","frame-final-fit","dlinky-profile-frame-lock");
    }else{
      img.removeAttribute("src");
      img.alt = "";
      img.classList.add("dlinky-frame-off");
      img.style.display = "none";
      if(wrap) wrap.classList.remove("has-img-frame","frame-final-fit","dlinky-profile-frame-lock");
    }
  }

  // Quando clicar em Usar/Ajustar, garante que a URL real do card/item fica salva.
  document.addEventListener("click",function(e){
    const use = e.target.closest("[data-dlinky-use-frame]");
    if(use){
      setTimeout(function(){
        normalizeFrameItemsOnly();

        const u = getUser();
        const id = String(use.dataset.dlinkyUseFrame || "").trim();
        const found = allFrames().find(it=>String(it.id||"").trim() === id);

        if(found && isImageUrl(itemUrl(found))){
          u.activeFrameId = id;
          u.frame = itemUrl(found);
          u.frameUrl = itemUrl(found);
          u.decoration = "none";
          saveUser(u);
        }

        applyFrameToProfile();
      },60);
    }

    if(e.target.closest("#saveFrameAdjust,#viewProfile,#viewProfile2")){
      setTimeout(function(){
        normalizeFrameItemsOnly();
        applyFrameToProfile();
      },100);
      setTimeout(applyFrameToProfile,500);
    }
  },true);

  const oldRenderProfile = window.renderProfile || (typeof renderProfile !== "undefined" ? renderProfile : null);
  if(typeof oldRenderProfile === "function" && !oldRenderProfile.__molduraNaoSumirEstavel){
    const patched = function(){
      const r = oldRenderProfile.apply(this,arguments);
      setTimeout(applyFrameToProfile,0);
      setTimeout(applyFrameToProfile,150);
      setTimeout(applyFrameToProfile,600);
      return r;
    };
    patched.__molduraNaoSumirEstavel = true;
    window.renderProfile = patched;
    try{renderProfile = patched}catch(e){}
  }

  const oldRenderInventory = window.renderInventory || (typeof renderInventory !== "undefined" ? renderInventory : null);
  if(typeof oldRenderInventory === "function" && !oldRenderInventory.__molduraNaoSumirEstavel){
    const patchedInv = function(){
      normalizeFrameItemsOnly();
      return oldRenderInventory.apply(this,arguments);
    };
    patchedInv.__molduraNaoSumirEstavel = true;
    window.renderInventory = patchedInv;
    try{renderInventory = patchedInv}catch(e){}
  }

  document.addEventListener("error",function(e){
    const img = e.target;
    if(img && img.id === "profileFrame"){
      img.removeAttribute("src");
      img.alt = "";
      img.classList.add("dlinky-frame-off");
      img.style.display = "none";
    }
  },true);

  document.addEventListener("DOMContentLoaded",function(){
    normalizeFrameItemsOnly();
    setTimeout(applyFrameToProfile,300);
  });

  window.addEventListener("hashchange",function(){
    normalizeFrameItemsOnly();
    setTimeout(applyFrameToProfile,250);
  });
})();



/* ===== DLINKY MOLDURA SEM FALLBACK SPIKE — USA SOMENTE A ESCOLHIDA ===== */
(function(){
  if(window.__dlinkyMolduraSemFallbackSpike) return;
  window.__dlinkyMolduraSemFallbackSpike = true;

  const USER_KEY = "dlinkyUser";
  const FRAMES_KEY = "dlinkyCustomFrames";
  const LAST_KEY = "dlinkyLastGoodFrameUrl";

  function q(s,r=document){return r.querySelector(s)}
  function qa(s,r=document){return Array.from(r.querySelectorAll(s))}
  function readJSON(k,f){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}}
  function writeJSON(k,v){localStorage.setItem(k,JSON.stringify(v))}
  function getUser(){return readJSON(USER_KEY,{})}
  function saveUser(u){
    localStorage.setItem(USER_KEY,JSON.stringify(u||{}));
    try{
      if(typeof user !== "undefined" && user){
        Object.keys(user).forEach(k=>delete user[k]);
        Object.assign(user,u||{});
      }
    }catch(e){}
  }
  function clean(v){
    return String(v||"")
      .trim()
      .replace(/^url\(["']?|["']?\)$/g,"")
      .replace(/\\/g,"/");
  }
  function isImg(v){
    v = clean(v);
    if(!v) return false;
    if(v.startsWith("data:image/")) return true;
    if(v.startsWith("http://") || v.startsWith("https://") || v.startsWith("assets/")){
      return /\.(png|apng|gif|webp|jpg|jpeg|svg)(\?|#|$)/i.test(v);
    }
    return false;
  }
  function urlOf(it){
    return clean(it && (it.url || it.frameUrl || it.image || it.img || it.src || it.frame));
  }
  function isFrame(it){
    if(!it) return false;
    const t = String(it.type||"").toLowerCase();
    const n = String(it.name||it.nome||it.title||"").toLowerCase();
    return t.includes("frame") || t.includes("moldura") || n.includes("moldura") || isImg(urlOf(it));
  }
  function isOldSpike(it){
    const n = String(it && (it.name || it.nome || it.title) || "").toLowerCase();
    const u = String(urlOf(it)).toLowerCase();
    // remove só fallback/antigo que fica voltando sozinho
    return n.includes("moldura spike dark") || n.includes("golden spike") || n.includes("moldura golden") || u.includes("spike-dark-fallback");
  }

  function removeSpikeFallbacks(){
    localStorage.removeItem(LAST_KEY);

    const frames = readJSON(FRAMES_KEY,[]);
    if(Array.isArray(frames)){
      writeJSON(FRAMES_KEY, frames.filter(f => !isOldSpike(f)));
    }

    const u = getUser();
    if(Array.isArray(u.inventory)){
      u.inventory = u.inventory.filter(it => !(isFrame(it) && isOldSpike(it)));
    }

    if(isOldSpike({name:u.frameName, url:u.frame}) || isOldSpike({name:u.frameName, url:u.frameUrl})){
      u.frame = "";
      u.frameUrl = "";
      u.activeFrameId = "";
      u.frameName = "";
    }

    saveUser(u);
  }

  function normalizeInventory(){
    const u = getUser();
    if(!Array.isArray(u.inventory)) u.inventory = [];

    let changed = false;
    u.inventory = u.inventory.map(it=>{
      if(!isFrame(it)) return it;
      const url = urlOf(it);
      const fixed = Object.assign({}, it, {
        type: "frame",
        url: url,
        frameUrl: url,
        image: url
      });
      if(JSON.stringify(fixed) !== JSON.stringify(it)) changed = true;
      return fixed;
    });

    if(changed) saveUser(u);
  }

  function allFrames(){
    const u = getUser();
    const inv = Array.isArray(u.inventory) ? u.inventory : [];
    const admin = readJSON(FRAMES_KEY,[]);
    return [...inv, ...(Array.isArray(admin)?admin:[])].filter(isFrame);
  }

  function chosenUrl(){
    const u = getUser();

    // prioridade absoluta: o frame ativo salvo agora
    if(isImg(u.frameUrl)) return clean(u.frameUrl);
    if(isImg(u.frame)) return clean(u.frame);

    const active = String(u.activeFrameId || "").trim();
    if(active){
      const found = allFrames().find(it => String(it.id || "").trim() === active && isImg(urlOf(it)));
      if(found) return urlOf(found);
    }

    // NÃO usa mais "última moldura boa", porque isso estava voltando para Spike.
    return "";
  }

  function applyFrame(){
    const img = q("#profileFrame");
    const wrap = q("#avatarDecoration");
    if(!img) return;

    const url = chosenUrl();
    const u = getUser();

    if(isImg(url)){
      u.frame = clean(url);
      u.frameUrl = clean(url);
      saveUser(u);

      img.src = clean(url);
      img.alt = "";
      img.classList.remove("dlinky-frame-off","dlinky-frame-broken","dlinky-frame-hidden");
      img.style.setProperty("display","block","important");
      if(wrap) wrap.classList.add("has-img-frame","frame-final-fit","dlinky-profile-frame-lock");
    }else{
      img.removeAttribute("src");
      img.alt = "";
      img.classList.add("dlinky-frame-off");
      img.style.setProperty("display","none","important");
      if(wrap) wrap.classList.remove("has-img-frame","frame-final-fit","dlinky-profile-frame-lock");
    }
  }

  function saveCurrentFromUseButton(btn){
    const id = String(btn && btn.dataset && btn.dataset.dlinkyUseFrame || "").trim();
    if(!id) return;

    const found = allFrames().find(it => String(it.id || "").trim() === id);
    const url = found ? urlOf(found) : "";

    if(isImg(url)){
      const u = getUser();
      u.activeFrameId = id;
      u.frame = clean(url);
      u.frameUrl = clean(url);
      u.frameName = found.name || found.nome || found.title || "";
      u.decoration = "none";
      saveUser(u);
    }
  }

  document.addEventListener("click",function(e){
    const use = e.target.closest("[data-dlinky-use-frame]");
    if(use){
      setTimeout(()=>{
        removeSpikeFallbacks();
        normalizeInventory();
        saveCurrentFromUseButton(use);
        applyFrame();
      },60);
      setTimeout(applyFrame,300);
    }

    if(e.target.closest("#saveFrameAdjust,#viewProfile,#viewProfile2")){
      setTimeout(()=>{
        removeSpikeFallbacks();
        normalizeInventory();
        applyFrame();
      },80);
      setTimeout(applyFrame,400);
    }
  },true);

  const oldRenderProfile = window.renderProfile || (typeof renderProfile !== "undefined" ? renderProfile : null);
  if(typeof oldRenderProfile === "function" && !oldRenderProfile.__semFallbackSpike){
    const patched = function(){
      removeSpikeFallbacks();
      normalizeInventory();
      const r = oldRenderProfile.apply(this,arguments);
      setTimeout(applyFrame,0);
      setTimeout(applyFrame,160);
      setTimeout(applyFrame,650);
      return r;
    };
    patched.__semFallbackSpike = true;
    window.renderProfile = patched;
    try{renderProfile = patched}catch(e){}
  }

  const oldRenderInventory = window.renderInventory || (typeof renderInventory !== "undefined" ? renderInventory : null);
  if(typeof oldRenderInventory === "function" && !oldRenderInventory.__semFallbackSpike){
    const patchedInv = function(){
      removeSpikeFallbacks();
      normalizeInventory();
      return oldRenderInventory.apply(this,arguments);
    };
    patchedInv.__semFallbackSpike = true;
    window.renderInventory = patchedInv;
    try{renderInventory = patchedInv}catch(e){}
  }

  document.addEventListener("error",function(e){
    const img = e.target;
    if(img && img.id === "profileFrame"){
      // Se a imagem escolhida falhar, só esconde. NÃO troca para Spike.
      img.removeAttribute("src");
      img.alt = "";
      img.classList.add("dlinky-frame-off");
      img.style.setProperty("display","none","important");
    }
  },true);

  document.addEventListener("DOMContentLoaded",function(){
    removeSpikeFallbacks();
    normalizeInventory();
    setTimeout(applyFrame,300);
  });

  window.addEventListener("hashchange",function(){
    removeSpikeFallbacks();
    normalizeInventory();
    setTimeout(applyFrame,250);
  });
})();



/* ===== DLINKY ICON CLEAN REBUILD — ÚNICO CÓDIGO DO AVATAR ===== */
(function(){
  if(window.__dlinkyIconCleanRebuild) return;
  window.__dlinkyIconCleanRebuild = true;

  const USER_KEY = "dlinkyUser";

  function q(s,r=document){return r.querySelector(s)}
  function qa(s,r=document){return Array.from(r.querySelectorAll(s))}
  function readUser(){try{return JSON.parse(localStorage.getItem(USER_KEY)||"{}")}catch(e){return {}}}
  function writeUser(u){
    localStorage.setItem(USER_KEY,JSON.stringify(u||{}));
    try{ if(typeof user!=="undefined"&&user) Object.assign(user,u||{}); }catch(e){}
  }
  function clean(v){
    return String(v||"").trim().replace(/^url\(["']?|["']?\)$/g,"").replace(/["']/g,"").replace(/\\/g,"/");
  }
  function ok(v){
    v=clean(v);
    return !!v && v!=="none" && v!=="undefined" && v!=="null";
  }
  function key(u){
    return "dlinky_avatar_clean_"+String((u&&u.email)||(u&&u.slug)||"local").toLowerCase().trim();
  }
  function avatar(){
    const u=readUser();
    if(ok(u.avatar)){
      localStorage.setItem(key(u),clean(u.avatar));
      return clean(u.avatar);
    }
    const saved=localStorage.getItem(key(u));
    if(ok(saved)){
      u.avatar=clean(saved);
      writeUser(u);
      return clean(saved);
    }
    return "";
  }
  function apply(){
    const av=avatar();
    const targets=qa("#profileAvatar,.dlinky-v4-avatar,#adjustAvatar");
    targets.forEach(el=>{
      if(!el) return;
      if(ok(av)){
        el.style.setProperty("display","block","important");
        el.style.setProperty("opacity","1","important");
        el.style.setProperty("visibility","visible","important");
        el.style.setProperty("background-image",`url("${av}")`,"important");
        el.style.setProperty("background-size","cover","important");
        el.style.setProperty("background-position","center","important");
        el.style.setProperty("background-repeat","no-repeat","important");
      }
    });
  }

  // Protege dlinkyUser: se algum código salvar sem avatar, recoloca o salvo.
  if(!localStorage.__dlinkyIconCleanSetItem){
    localStorage.__dlinkyIconCleanSetItem=true;
    const oldSet=localStorage.setItem.bind(localStorage);
    localStorage.setItem=function(k,v){
      if(k===USER_KEY){
        try{
          const obj=JSON.parse(v||"{}");
          if(ok(obj.avatar)){
            localStorage.setItem(key(obj),clean(obj.avatar));
          }else{
            const saved=localStorage.getItem(key(obj));
            if(ok(saved)){
              obj.avatar=clean(saved);
              v=JSON.stringify(obj);
            }
          }
        }catch(e){}
      }
      return oldSet(k,v);
    };
  }

  const oldRender=window.renderProfile || (typeof renderProfile!=="undefined" ? renderProfile : null);
  if(typeof oldRender==="function" && !oldRender.__iconCleanRebuild){
    const patched=function(){
      const r=oldRender.apply(this,arguments);
      setTimeout(apply,0);
      setTimeout(apply,120);
      setTimeout(apply,500);
      return r;
    };
    patched.__iconCleanRebuild=true;
    window.renderProfile=patched;
    try{renderProfile=patched}catch(e){}
  }

  document.addEventListener("input",function(e){
    if(e.target && /avatar/i.test((e.target.id||"")+" "+(e.target.name||"")) && ok(e.target.value)){
      const u=readUser();
      u.avatar=clean(e.target.value);
      writeUser(u);
      localStorage.setItem(key(u),u.avatar);
      setTimeout(apply,80);
    }
  },true);

  document.addEventListener("click",function(e){
    if(e.target.closest("#saveImages,#viewProfile,#viewProfile2,#saveFrameAdjust")){
      setTimeout(apply,80);
      setTimeout(apply,350);
      setTimeout(apply,900);
    }
  },true);

  document.addEventListener("DOMContentLoaded",()=>setTimeout(apply,300));
  window.addEventListener("hashchange",()=>setTimeout(apply,250));
})();



/* ===== DLINKY AVATAR IMG REAL — SEM BACKGROUND BUG ===== */
(function(){
  if(window.__dlinkyAvatarImgReal) return;
  window.__dlinkyAvatarImgReal = true;

  const USER_KEY='dlinkyUser';

  function q(s,r=document){return r.querySelector(s)}
  function readUser(){try{return JSON.parse(localStorage.getItem(USER_KEY)||'{}')}catch(e){return {}}}
  function writeUser(u){
    localStorage.setItem(USER_KEY,JSON.stringify(u||{}));
    try{if(typeof user!=='undefined'&&user)Object.assign(user,u||{});}catch(e){}
  }
  function clean(v){
    return String(v||'').trim().replace(/^url\(["']?|["']?\)$/g,'').replace(/["']/g,'').replace(/\\/g,'/');
  }
  function ok(v){
    v=clean(v);
    return v && v!=='none' && v!=='undefined' && v!=='null';
  }
  function key(u){
    return 'dlinky_avatar_real_'+String((u&&u.email)||(u&&u.slug)||'local').toLowerCase().trim();
  }
  function getAvatar(){
    const u=readUser();
    if(ok(u.avatar)){
      localStorage.setItem(key(u),clean(u.avatar));
      return clean(u.avatar);
    }
    const saved=localStorage.getItem(key(u));
    if(ok(saved)){
      u.avatar=clean(saved);
      writeUser(u);
      return clean(saved);
    }
    return '';
  }
  function ensureImg(){
    const wrap=q('#avatarDecoration');
    if(!wrap) return null;

    let img=q('#profileAvatar');
    if(!img || img.tagName!=='IMG'){
      const old=img;
      img=document.createElement('img');
      img.id='profileAvatar';
      img.className='avatar big-avatar';
      img.alt='';
      if(old && old.parentNode){
        old.parentNode.replaceChild(img,old);
      }else{
        const frame=q('#profileFrame',wrap);
        wrap.insertBefore(img,frame || wrap.firstChild);
      }
    }

    return img;
  }
  function apply(){
    const url=getAvatar();
    const img=ensureImg();
    if(!img) return;

    img.className='avatar big-avatar';
    img.alt='';
    img.style.setProperty('width','94px','important');
    img.style.setProperty('height','94px','important');
    img.style.setProperty('border-radius','50%','important');
    img.style.setProperty('object-fit','cover','important');
    img.style.setProperty('display','block','important');
    img.style.setProperty('opacity','1','important');
    img.style.setProperty('visibility','visible','important');
    img.style.setProperty('position','relative','important');
    img.style.setProperty('z-index','20','important');

    if(ok(url)){
      if(img.getAttribute('src')!==url) img.setAttribute('src',url);
    }

    // Também corrige o avatar do palco da moldura, se existir
    const stage=q('.dlinky-v4-avatar');
    if(stage && ok(url)){
      stage.style.setProperty('background-image',`url("${url}")`,'important');
      stage.style.setProperty('background-size','cover','important');
      stage.style.setProperty('background-position','center','important');
    }
  }

  // Protege o dlinkyUser: se algum código salvar sem avatar, restaura.
  if(!localStorage.__dlinkyAvatarImgRealSetItem){
    localStorage.__dlinkyAvatarImgRealSetItem=true;
    const oldSet=localStorage.setItem.bind(localStorage);
    localStorage.setItem=function(k,v){
      if(k===USER_KEY){
        try{
          const obj=JSON.parse(v||'{}');
          if(ok(obj.avatar)){
            localStorage.setItem(key(obj),clean(obj.avatar));
          }else{
            const saved=localStorage.getItem(key(obj));
            if(ok(saved)){
              obj.avatar=clean(saved);
              v=JSON.stringify(obj);
            }
          }
        }catch(e){}
      }
      return oldSet(k,v);
    };
  }

  // Se salvar imagens, guarda o valor do campo avatar.
  document.addEventListener('input',function(e){
    if(e.target && /avatar/i.test((e.target.id||'')+' '+(e.target.name||'')) && ok(e.target.value)){
      const u=readUser();
      u.avatar=clean(e.target.value);
      writeUser(u);
      localStorage.setItem(key(u),u.avatar);
      setTimeout(apply,50);
    }
  },true);

  document.addEventListener('click',function(e){
    if(e.target.closest('#saveImages,#viewProfile,#viewProfile2,#saveFrameAdjust')){
      setTimeout(apply,50);
      setTimeout(apply,250);
      setTimeout(apply,800);
    }
  },true);

  const oldRender=window.renderProfile || (typeof renderProfile!=='undefined'?renderProfile:null);
  if(typeof oldRender==='function' && !oldRender.__avatarImgReal){
    const patched=function(){
      const r=oldRender.apply(this,arguments);
      setTimeout(apply,0);
      setTimeout(apply,180);
      setTimeout(apply,700);
      return r;
    };
    patched.__avatarImgReal=true;
    window.renderProfile=patched;
    try{renderProfile=patched}catch(e){}
  }

  document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,300));
  window.addEventListener('hashchange',()=>setTimeout(apply,250));

  // Sem loop pesado: só reforça algumas vezes após abrir
  setTimeout(apply,1000);
  setTimeout(apply,2000);
})();



/* ===== DLINKY AVATAR FINAL SRC LOCK ===== */
(function(){
  if(window.__dlinkyAvatarFinalSrcLock) return;
  window.__dlinkyAvatarFinalSrcLock = true;

  const USER_KEY='dlinkyUser';

  function q(s,r=document){return r.querySelector(s)}
  function readUser(){try{return JSON.parse(localStorage.getItem(USER_KEY)||'{}')}catch(e){return {}}}
  function writeUser(u){
    localStorage.setItem(USER_KEY,JSON.stringify(u||{}));
    try{if(typeof user!=='undefined'&&user)Object.assign(user,u||{});}catch(e){}
  }
  function clean(v){
    return String(v||'').trim().replace(/^url\(["']?|["']?\)$/g,'').replace(/["']/g,'').replace(/\\/g,'/');
  }
  function ok(v){
    v=clean(v);
    return v && v!=='none' && v!=='undefined' && v!=='null';
  }
  function key(u){return 'dlinky_avatar_real_'+String((u&&u.email)||(u&&u.slug)||'local').toLowerCase().trim();}
  function getAvatar(){
    const u=readUser();
    if(ok(u.avatar)){
      localStorage.setItem(key(u),clean(u.avatar));
      return clean(u.avatar);
    }
    const saved=localStorage.getItem(key(u)) || localStorage.getItem('dlinky_avatar_clean_'+(u.email||u.slug||'local'));
    if(ok(saved)){
      u.avatar=clean(saved);
      writeUser(u);
      return clean(saved);
    }
    return '';
  }
  function ensureImg(){
    const wrap=q('#avatarDecoration');
    if(!wrap) return null;

    let av=q('#profileAvatar');
    if(!av || av.tagName!=='IMG'){
      const img=document.createElement('img');
      img.id='profileAvatar';
      img.className='avatar big-avatar';
      img.alt='';
      if(av && av.parentNode) av.parentNode.replaceChild(img,av);
      else wrap.insertBefore(img, q('#profileFrame',wrap) || wrap.firstChild);
      av=img;
    }
    return av;
  }
  function apply(){
    const url=getAvatar();
    const av=ensureImg();
    if(!av || !ok(url)) return;

    av.src=url;
    av.removeAttribute('srcset');
    av.alt='';
    av.className='avatar big-avatar';
    av.style.setProperty('display','block','important');
    av.style.setProperty('opacity','1','important');
    av.style.setProperty('visibility','visible','important');
    av.style.setProperty('width','94px','important');
    av.style.setProperty('height','94px','important');
    av.style.setProperty('border-radius','50%','important');
    av.style.setProperty('object-fit','cover','important');
    av.style.setProperty('position','relative','important');
    av.style.setProperty('z-index','30','important');

    const stage=q('.dlinky-v4-avatar');
    if(stage){
      stage.style.setProperty('background-image',`url("${url}")`,'important');
    }
  }

  // Sempre que renderizar, aplica DEPOIS dos outros códigos.
  const oldRender=window.renderProfile || (typeof renderProfile!=='undefined'?renderProfile:null);
  if(typeof oldRender==='function' && !oldRender.__avatarFinalSrcLock){
    const patched=function(){
      const r=oldRender.apply(this,arguments);
      setTimeout(apply,0);
      setTimeout(apply,100);
      setTimeout(apply,300);
      setTimeout(apply,800);
      return r;
    };
    patched.__avatarFinalSrcLock=true;
    window.renderProfile=patched;
    try{renderProfile=patched}catch(e){}
  }

  // Protege se algum script remover o src.
  const obs={observe(){},disconnect(){}}; // V9: observer antigo desativado
  document.addEventListener('DOMContentLoaded',()=>{
    setTimeout(apply,200);
    if(document.body) obs.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['src','style','class']});
  });

  window.addEventListener('hashchange',()=>setTimeout(apply,200));
})();


/* ===== DLINKY AVATAR CENTRALIZADO - FIX SRC LIMPO ===== */
(function(){
  if(window.__dlinkyAvatarCentralizadoFinal) return;
  window.__dlinkyAvatarCentralizadoFinal = true;

  const USER_KEY = "dlinkyUser";

  function q(s,r=document){ return r.querySelector(s); }
  function readUser(){
    try { return JSON.parse(localStorage.getItem(USER_KEY) || "{}"); }
    catch(e){ return {}; }
  }
  function clean(v){
    return String(v || "")
      .trim()
      .replace(/^url\(["']?|["']?\)$/g, "")
      .replace(/["']/g, "")
      .replace(/\\/g, "/");
  }
  function ok(v){
    v = clean(v);
    return !!v && v !== "none" && v !== "undefined" && v !== "null";
  }
  function avatarBackupKey(u){
    return "dlinky_avatar_real_" + String((u.email || u.slug || "local")).toLowerCase().trim();
  }
  function getAvatar(){
    const u = readUser();
    if(ok(u.avatar)){
      localStorage.setItem(avatarBackupKey(u), clean(u.avatar));
      return clean(u.avatar);
    }
    return clean(localStorage.getItem(avatarBackupKey(u)) || "");
  }
  function applyAvatar(){
    const url = getAvatar();
    const av = q("#profileAvatar");
    if(!av || !ok(url)) return;

    if(av.tagName === "IMG"){
      av.src = url;
      av.removeAttribute("srcset");
      av.alt = "";
    }else{
      av.style.setProperty("background-image", `url("${url}")`, "important");
    }

    av.style.setProperty("display", "block", "important");
    av.style.setProperty("opacity", "1", "important");
    av.style.setProperty("visibility", "visible", "important");
    av.style.setProperty("width", "92px", "important");
    av.style.setProperty("height", "92px", "important");
    av.style.setProperty("border-radius", "50%", "important");
    av.style.setProperty("object-fit", "cover", "important");
    av.style.setProperty("margin", "0", "important");
    av.style.setProperty("left", "auto", "important");
    av.style.setProperty("right", "auto", "important");
    av.style.setProperty("top", "auto", "important");
    av.style.setProperty("transform", "none", "important");
  }

  const oldRender = window.renderProfile || (typeof renderProfile !== "undefined" ? renderProfile : null);
  if(typeof oldRender === "function" && !oldRender.__avatarCentralizadoFinal){
    const patched = function(){
      const r = oldRender.apply(this, arguments);
      setTimeout(applyAvatar, 0);
      setTimeout(applyAvatar, 120);
      setTimeout(applyAvatar, 500);
      return r;
    };
    patched.__avatarCentralizadoFinal = true;
    window.renderProfile = patched;
    try{ renderProfile = patched; }catch(e){}
  }

  document.addEventListener("DOMContentLoaded", () => setTimeout(applyAvatar, 250));
  window.addEventListener("hashchange", () => setTimeout(applyAvatar, 250));
})();

/* =========================================================

/* ===== DLINKY V3 FINAL — LOJA + INVENTÁRIO + MOLDURA ÚNICA ESTÁVEL ===== */
(function(){
  'use strict';
  if(window.__DLINKY_V3_FINAL_INVENTORY_SHOP__) return;
  window.__DLINKY_V3_FINAL_INVENTORY_SHOP__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const USER_KEY='dlinkyUser';
  const FRAMES_KEY='dlinkyCustomFrames';
  const OLD_FRAMES_KEY='dlinkyFrames';
  let shopMode='coins';
  let invMode='todos';
  let pendingFrameBuy=null;
  let editingFrameId=null;

  const safeShopData={
    coins:[['345 Linkwuans','R$ 30,00',345],['650 Linkwuans','R$ 50,00',650],['1450 Linkwuans','R$ 100,00',1450],['3300 Linkwuans','R$ 200,00',3300]],
    effects:[['Neon no Nome','180 Linkwuans','neonName'],['Nome Brilhante','220 Linkwuans','shineName'],['Nome Colorido','240 Linkwuans','rainbowName'],['Ocultar Views','150 Linkwuans','hideViews']],
    other:[['Cursor Custom','120 Linkwuans','cursor'],['Tema Cyber','300 Linkwuans','cyber']],
    badges:[]
  };

  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function slug(v){return 'frame_'+Math.abs([...String(v||'frame')].reduce((a,c)=>((a<<5)-a+c.charCodeAt(0))|0,0));}
  function num(v){const n=Number(String(v??'').replace(/[^0-9.,-]/g,'').replace(',','.'));return Number.isFinite(n)?n:0;}
  function norm(v){return String(v||'').trim().toLowerCase();}
  function read(k,fb){try{return JSON.parse(localStorage.getItem(k)||'')??fb}catch(e){return fb}}
  function write(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  function userData(){const u=read(USER_KEY,{});u.inventory=Array.isArray(u.inventory)?u.inventory:[];u.purchases=Array.isArray(u.purchases)?u.purchases:[];u.coins=Number(u.coins??u.linkwuans??0);u.linkwuans=u.coins;return u;}
  function saveUser(u){u.coins=Number(u.coins??u.linkwuans??0);u.linkwuans=u.coins;write(USER_KEY,u);try{if(typeof user!=='undefined'&&user)Object.assign(user,u)}catch(e){};try{if(window.user)Object.assign(window.user,u)}catch(e){};saveOnline(u);}
  async function saveOnline(u){try{if(!window.firebase||!firebase.auth||!firebase.firestore)return;const fb=firebase.auth().currentUser;if(!fb)return;const db=firebase.firestore();await db.collection('users').doc(fb.uid).set(Object.assign({},u,{updatedAt:firebase.firestore.FieldValue.serverTimestamp()}),{merge:true});if(u.slug)await db.collection('profiles').doc(u.slug).set({uid:fb.uid,name:u.name||'Usuário',slug:u.slug,email:u.email||'',bio:u.bio||'',avatar:u.avatar||'',banner:u.banner||'',bg:u.bg||'',video:u.video||'',frame:u.frame||'',frameUrl:u.frameUrl||u.frame||'',activeFrameId:u.activeFrameId||'',frameAdjustments:u.frameAdjustments||{},music:u.music||'',color:u.color||'#a855f7',particleType:u.particleType||'snow',particles:u.particles!==false,verified:!!u.verified,links:Array.isArray(u.links)?u.links:[],socials:Array.isArray(u.socials)?u.socials:[],tags:Array.isArray(u.tags)?u.tags:[],embeds:Array.isArray(u.embeds)?u.embeds:[],decoration:u.decoration||'',updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});}catch(e){console.warn('Dlinky V3 saveOnline',e)}}
  function toastSafe(msg){try{if(typeof toast==='function')return toast(msg)}catch(e){} console.log('[Dlinky V3]',msg)}
  function isFake(url){const s=norm(url);return !s||['purple-ring','red-ring','orbit-frame','flame-frame','butterfly-frame','fox-frame','mirror-frame','flower-frame','marine-frame','autumn-frame','spider-frame','constellation-frame','yinyang-frame','hearts-frame','vortex-frame','snow-frame','bonsai-frame','batarang-frame','king-frame','sparkle-frame'].some(x=>s===x||s.includes('/'+x));}
  function normalizeFrame(raw,i){const url=String(raw?.url||raw?.frameUrl||'').trim();const price=num(raw?.price??raw?.basePrice??raw?.prices?.['3 dias']??20)||20;const prices=Object.assign({},raw?.prices||{});['3 dias','7 dias','15 dias','Permanente'].forEach(k=>{prices[k]=num(prices[k])||0});if(!prices['3 dias'])prices['3 dias']=price;if(!prices['7 dias'])prices['7 dias']=Math.round(price*1.5);if(!prices['15 dias'])prices['15 dias']=Math.round(price*2);if(!prices['Permanente'])prices['Permanente']=Math.round(price*3);return {id:String(raw?.id||slug(url||raw?.name||i)),name:String(raw?.name||raw?.title||'Moldura'),desc:String(raw?.desc||raw?.description||''),url,price,prices};}
  function allFrames(){const src=[...read(FRAMES_KEY,[]),...read(OLD_FRAMES_KEY,[]),...(userData().customFrames||[])];const map=new Map();src.forEach((f,i)=>{const n=normalizeFrame(f,i);if(n.url&&!isFake(n.url))map.set(norm(n.url),n)});const arr=[...map.values()];write(FRAMES_KEY,arr);write(OLD_FRAMES_KEY,arr);const u=userData();u.customFrames=arr;write(USER_KEY,u);return arr;}
  function saveFrames(arr){const map=new Map();(Array.isArray(arr)?arr:[]).forEach((f,i)=>{const n=normalizeFrame(f,i);if(n.url&&!isFake(n.url))map.set(norm(n.url),n)});const clean=[...map.values()];write(FRAMES_KEY,clean);write(OLD_FRAMES_KEY,clean);const u=userData();u.customFrames=clean;saveUser(u);return clean;}
  function framePrice(f,d='3 dias'){return num(f?.price)||Number(f?.prices?.['3 dias']||0)||20;}
  function frameUrl(it){return String(it?.url||it?.frameUrl||'').trim();}
  function isFrameItem(it){return !!(it&&frameUrl(it)&&/frame|moldur/i.test(String(it.type||it.kind||it.name||'frame')));}
  function itemId(it){return String(it?.id||slug(frameUrl(it)||it?.name));}
  function sanitize(){const frames=allFrames();const allowed=new Map(frames.map(f=>[norm(f.url),f]));const u=userData();const seen=new Set();u.inventory=u.inventory.filter(it=>{if(!isFrameItem(it))return true;const currentUrl=frameUrl(it);if(!currentUrl)return false;const f=allowed.get(norm(currentUrl));const finalUrl=f?f.url:currentUrl;const finalId=f?f.id:itemId(it);if(seen.has(norm(finalUrl)))return false;seen.add(norm(finalUrl));it.id=finalId;it.name=it.name||(f&&f.name)||'Moldura';it.url=finalUrl;it.frameUrl=finalUrl;it.type='frames';it.kind='frame';return true});if(u.frame&&!u.inventory.some(it=>isFrameItem(it)&&norm(frameUrl(it))===norm(u.frame))){const byId=u.inventory.find(it=>isFrameItem(it)&&String(it.id||'')===String(u.activeFrameId||''));if(byId){u.frame=frameUrl(byId);u.frameUrl=frameUrl(byId);u.frameName=byId.name||'Moldura';}else{u.frame='';u.frameUrl='';u.frameName='';u.activeFrameId='';}}saveUser(u);return u;}
  function counters(){const u=userData();['walletCoins','invCoins','coinCount'].forEach(id=>{const el=$('#'+id);if(el)el.textContent=u.coins});['invItemsCount','invCountMini'].forEach(id=>{const el=$('#'+id);if(el)el.textContent=u.inventory.length});const giftCount=u.inventory.filter(x=>x.gift).length;const giftBox=$('#tab-inventory .cards4 .card:nth-child(3) b');if(giftBox)giftBox.textContent=giftCount;}

  function renderAdminFrames(){const list=$('#adminFramesList');if(list){const arr=allFrames();list.innerHTML=arr.length?arr.map((f,i)=>`<div class="admin-frame-row"><img src="${esc(f.url)}" alt="${esc(f.name)}"><div><b>${esc(f.name)}</b><small>${framePrice(f,'3 dias')} Linkwuans • ${esc(f.desc||'moldura')}</small></div><button class="delete" type="button" data-v3-del-frame="${i}">×</button></div>`).join(''):'<p>Nenhuma moldura custom adicionada ainda.</p>'}const sel=$('#giftItemSelect');if(sel){const arr=allFrames();sel.innerHTML='<option value="">Selecione uma moldura da loja</option>'+arr.map((f,i)=>`<option value="${i}">${esc(f.name)} — ${framePrice(f,'3 dias')} Linkwuans</option>`).join('')}}
  function addFrame(){const url=$('#adminFrameUrl')?.value?.trim()||'';if(!url)return toastSafe('Coloque a URL/arquivo da moldura.');if(isFake(url))return toastSafe('Use uma URL/arquivo real da moldura.');const price=num($('#adminFramePrice')?.value||$('#adminPrice3')?.value||20)||20;const f=normalizeFrame({url,name:$('#adminFrameName')?.value?.trim()||'Moldura',desc:$('#adminFrameDesc')?.value?.trim()||'',price,prices:{'3 dias':num($('#adminPrice3')?.value)||price,'7 dias':num($('#adminPrice7')?.value)||Math.round(price*1.5),'15 dias':num($('#adminPrice15')?.value)||Math.round(price*2),'Permanente':num($('#adminPricePerm')?.value)||Math.round(price*3)}});saveFrames([f,...allFrames().filter(x=>norm(x.url)!==norm(f.url))]);['adminFrameName','adminFrameDesc','adminFramePrice','adminPrice3','adminPrice7','adminPrice15','adminPricePerm','adminFrameUrl'].forEach(id=>{const el=$('#'+id);if(el)el.value=''});renderAdminFrames();renderShop();toastSafe('Moldura cadastrada na loja.');}

  function renderShop(){const grid=$('#shopGrid');if(!grid)return;$$('.shop-tabs [data-shop-tab]').forEach(b=>b.classList.toggle('active',(b.dataset.shopTab||'')===shopMode));if(shopMode==='frames'){const arr=allFrames();grid.className='asset-grid frames-shop-grid';if(!arr.length){grid.innerHTML='<div class="panel"><h2>Nenhuma moldura cadastrada</h2><p>Cadastre uma moldura real no Admin para aparecer aqui.</p></div>';return}const av=esc((window.__dlinkyGetBestAvatar&&window.__dlinkyGetBestAvatar())||userData().avatar||'');grid.innerHTML=arr.map((f,i)=>{const d=f.__duration||'3 dias';return `<div class="asset-card frame-shop-card"><div class="asset-preview inv-preview real-inv-preview"><span class="real-inv-avatar" style="background-image:url('${av}')"></span><img class="real-inv-frame" src="${esc(f.url)}" alt="${esc(f.name)}"></div><div class="asset-body"><b>${esc(f.name)}</b><small>${esc(f.desc||'Moldura')}</small><div class="frame-price">Preço: <b data-v3-price="${i}">${framePrice(f,d)} Linkwuans</b></div><select class="frame-duration" data-v3-duration="${i}">${['3 dias','7 dias','15 dias','Permanente'].map(x=>`<option ${x===d?'selected':''}>${x}</option>`).join('')}</select><button class="btn primary small" type="button" data-v3-buy-frame="${i}">Comprar</button></div></div>`}).join('');return}const data=(typeof shopData!=='undefined'&&shopData[shopMode])?shopData[shopMode]:(safeShopData[shopMode]||[]);grid.className='asset-grid';grid.innerHTML=data.length?data.map((it,i)=>`<div class="asset-card"><div class="asset-preview shop-preview">${shopMode==='coins'?'◈':'✦'}</div><div class="asset-body"><b>${esc(it[0])}</b><small>${esc(it[1])}</small><button class="btn primary small" type="button" data-v3-buy-normal="${i}">Comprar</button></div></div>`).join(''):'<p>Nada cadastrado nessa aba.</p>';}
  function openFrameBuy(i){const f=allFrames()[Number(i)];if(!f)return;const d=$(`[data-v3-duration="${i}"]`)?.value||'3 dias';pendingFrameBuy={i:Number(i),duration:d,price:framePrice(f,d)};const m=$('#frameBuyModal');if(!m)return confirmFrameBuy();$('#frameBuyName')&&($('#frameBuyName').textContent=f.name);$('#frameBuyDuration')&&($('#frameBuyDuration').textContent=d);$('#frameBuyType')&&($('#frameBuyType').textContent=d==='Permanente'?'Permanente':'Normal');$('#frameBuyPrice')&&($('#frameBuyPrice').textContent=pendingFrameBuy.price+' Linkwuans');$('#frameBuyUser')&&($('#frameBuyUser').textContent=userData().name||'Usuário');const img=$('#frameBuyImg');if(img)img.src=f.url;const av=$('#frameBuyAvatar');if(av)av.style.backgroundImage=userData().avatar?`url("${userData().avatar}")`:'';m.classList.add('show');m.style.display='flex';}
  function closeFrameBuy(){const m=$('#frameBuyModal');if(m){m.classList.remove('show');m.style.display='none'}pendingFrameBuy=null;}
  function confirmFrameBuy(){if(!pendingFrameBuy)return;const f=allFrames()[pendingFrameBuy.i];if(!f)return;const u=userData();if(u.coins<pendingFrameBuy.price){closeFrameBuy();return toastSafe('Saldo insuficiente em Linkwuans.')}u.coins-=pendingFrameBuy.price;u.linkwuans=u.coins;u.inventory=u.inventory.filter(it=>!(isFrameItem(it)&&norm(frameUrl(it))===norm(f.url)));u.inventory.unshift({id:f.id,type:'frames',kind:'frame',source:'admin',name:f.name,url:f.url,frameUrl:f.url,duration:pendingFrameBuy.duration,price:pendingFrameBuy.price+' Linkwuans',boughtAt:Date.now()});u.__hasPurchasedFrame=true;u.__hasPurchasedItem=true;u.__cleanNewAccount=false;u.frame=f.url;u.frameUrl=f.url;u.frameName=f.name;u.activeFrameId=f.id;u.decoration='none';u.purchases.unshift({id:Date.now(),method:'Linkwuans',status:'Aprovado',value:pendingFrameBuy.price+' Linkwuans',date:new Date().toLocaleDateString('pt-BR')});saveUser(u);closeFrameBuy();counters();renderInventory();applyProfileFrame();toastSafe('Moldura comprada e salva no inventário!');}

  function adjustment(u,it){const k=itemId(it),url=frameUrl(it);const a=(u.frameAdjustments||{})[k]||(u.frameAdjustments||{})[url]||(u.frameAdjust||{})[url]||{};return {x:Number(a.x||0),y:Number(a.y||0),scale:Number(a.scale||1),rotate:Number(a.rotate||0)}}
  function tr(a){return `translate(calc(-50% + ${a.x}px), calc(-50% + ${a.y}px)) scale(${a.scale}) rotate(${a.rotate}deg)`}
  function filteredInventory(){const u=sanitize();let arr=[...u.inventory];if(invMode==='molduras')arr=arr.filter(isFrameItem);if(invMode==='insignias')arr=arr.filter(it=>/badge|insignia|insígnia/i.test(String(it.type||it.kind||it.name||'')));if(invMode==='efeitos')arr=arr.filter(it=>/effect|efeito/i.test(String(it.type||it.kind||it.name||'')));if(invMode==='presentes')arr=arr.filter(it=>it.gift);if(invMode==='selos')arr=arr.filter(it=>/selo/i.test(String(it.type||it.kind||it.name||'')));return {u,arr}}
  function renderInventory(){const grid=$('#inventoryGrid');if(!grid)return;const {u,arr}=filteredInventory();counters();$$('#inventoryTabs [data-inv-filter]').forEach(b=>b.classList.toggle('active',(b.dataset.invFilter||'todos')===invMode));if(!arr.length){grid.innerHTML='<p>Você ainda não possui itens nessa aba.</p>';return}const av=esc(u.avatar||'');grid.className='asset-grid';grid.innerHTML=arr.map(it=>{const realIdx=u.inventory.indexOf(it);if(isFrameItem(it)){const a=adjustment(u,it);const active=norm(frameUrl(it))===norm(u.frame||u.frameUrl);return `<div class="asset-card inv-item-card ${active?'is-active':''}"><div class="asset-preview inv-preview real-inv-preview"><span class="real-inv-avatar" style="background-image:url('${av}')"></span><img class="real-inv-frame" src="${esc(frameUrl(it))}" style="transform:${tr(a)}" alt="${esc(it.name||'Moldura')}"></div><div class="asset-body"><b>${esc(it.name||'Moldura')}</b><small>${esc(it.duration||'Comprada')}</small><div class="inv-actions-row"><button class="btn primary small" type="button" data-v3-use-inv="${realIdx}">${active?'Usando':'Usar'}</button><button class="btn dark small" type="button" data-v3-adjust-inv="${realIdx}">Ajustar</button></div></div></div>`}return `<div class="asset-card inv-item-card"><div class="asset-preview shop-preview">✦</div><div class="asset-body"><b>${esc(it.name||'Item')}</b><small>${esc(it.duration||it.type||'item')}</small><button class="btn primary small" type="button" data-v3-use-effect="${realIdx}">Usar</button></div></div>`}).join('')}
  function useInventory(idx){const u=sanitize();const it=u.inventory[Number(idx)];if(!it)return;if(isFrameItem(it)){u.frame=frameUrl(it);u.frameUrl=frameUrl(it);u.frameName=it.name||'Moldura';u.activeFrameId=itemId(it);u.decoration='none'}else if(it.value){if(['neonName','shineName','rainbowName','hideViews'].includes(it.value))u[it.value]=true;if(it.value==='verified')u.verified=true}saveUser(u);renderInventory();applyProfileFrame();toastSafe('Item aplicado!')}
  function openAdjust(idx){const u=sanitize();const it=u.inventory[Number(idx)];if(!it||!isFrameItem(it))return;editingFrameId=itemId(it);const m=$('#frameAdjustModal');if(!m)return;const av=$('#adjustAvatar');if(av)av.style.backgroundImage=u.avatar?`url("${u.avatar}")`:'';const fr=$('#adjustFrame');if(fr)fr.src=frameUrl(it);const a=adjustment(u,it);$('#adjustX')&&($('#adjustX').value=a.x);$('#adjustY')&&($('#adjustY').value=a.y);$('#adjustScale')&&($('#adjustScale').value=Math.round(a.scale*100));$('#adjustRotate')&&($('#adjustRotate').value=a.rotate);updateAdjustPreview();m.classList.add('show');m.style.display='flex'}
  function readAdj(){let scale=Number($('#adjustScale')?.value||100);if(scale>10)scale/=100;return {x:Number($('#adjustX')?.value||0),y:Number($('#adjustY')?.value||0),scale,rotate:Number($('#adjustRotate')?.value||0)}}
  function updateAdjustPreview(){const fr=$('#adjustFrame');if(fr)fr.style.transform=tr(readAdj())}
  function saveAdjust(){const u=sanitize();const it=u.inventory.find(x=>isFrameItem(x)&&itemId(x)===editingFrameId);if(!it)return;const a=readAdj();u.frameAdjustments=(u.frameAdjustments&&typeof u.frameAdjustments==='object')?u.frameAdjustments:{};u.frameAdjust=(u.frameAdjust&&typeof u.frameAdjust==='object')?u.frameAdjust:{};u.frameAdjustments[itemId(it)]=a;u.frameAdjust[frameUrl(it)]=a;u.frame=frameUrl(it);u.frameUrl=frameUrl(it);u.activeFrameId=itemId(it);u.frameName=it.name||'Moldura';u.decoration='none';saveUser(u);const m=$('#frameAdjustModal');if(m){m.classList.remove('show');m.style.display='none'}renderInventory();applyProfileFrame();toastSafe('Ajuste salvo e aplicado!')}
  function resetAdjust(){['adjustX','adjustY','adjustRotate'].forEach(id=>{const el=$('#'+id);if(el)el.value=0});const s=$('#adjustScale');if(s)s.value=100;updateAdjustPreview()}
  function applyProfileFrame(){const u=sanitize();const it=u.inventory.find(x=>isFrameItem(x)&&norm(frameUrl(x))===norm(u.frame||u.frameUrl));const frame=$('#profileFrame'), deco=$('#avatarDecoration'), av=$('#profileAvatar');if(av){av.style.setProperty('left','50%','important');av.style.setProperty('top','50%','important');av.style.setProperty('transform','translate(-50%,-50%)','important')}if(!frame)return;if(!it){frame.removeAttribute('src');frame.style.setProperty('display','none','important');deco&&deco.classList.remove('has-img-frame');return}frame.src=frameUrl(it);frame.style.setProperty('display','block','important');frame.style.setProperty('visibility','visible','important');frame.style.setProperty('left','50%','important');frame.style.setProperty('top','50%','important');frame.style.setProperty('transform',tr(adjustment(u,it)),'important');frame.style.setProperty('transform-origin','center center','important');deco&&deco.classList.add('has-img-frame')}

  const oldOpenTab=window.openTab, oldRenderDash=window.renderDash, oldRenderProfile=window.renderProfile;
  window.renderShop=renderShop; try{renderShop=window.renderShop}catch(e){}
  window.renderInventory=renderInventory; try{renderInventory=window.renderInventory}catch(e){}
  window.renderAdminList=renderAdminFrames; try{renderAdminList=window.renderAdminList}catch(e){}
  window.renderProfile=function(){if(typeof oldRenderProfile==='function')oldRenderProfile();setTimeout(applyProfileFrame,0);setTimeout(applyProfileFrame,160)}; try{renderProfile=window.renderProfile}catch(e){}
  window.renderDash=function(){if(typeof oldRenderDash==='function')oldRenderDash();setTimeout(()=>{counters();renderAdminFrames();if($('#tab-store')?.classList.contains('active'))renderShop();if($('#tab-inventory')?.classList.contains('active'))renderInventory();applyProfileFrame()},0)}; try{renderDash=window.renderDash}catch(e){}
  window.openTab=function(id){if(typeof oldOpenTab==='function')oldOpenTab(id);if(id==='store')setTimeout(renderShop,0);if(id==='inventory')setTimeout(renderInventory,0);if(id==='admin')setTimeout(renderAdminFrames,0);if(id==='profile')setTimeout(applyProfileFrame,0)}; try{openTab=window.openTab}catch(e){}

  document.addEventListener('click',function(e){const shop=e.target.closest?.('[data-shop-tab]');if(shop){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();shopMode=shop.dataset.shopTab||'coins';renderShop();return}const inv=e.target.closest?.('[data-inv-filter]');if(inv){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();invMode=inv.dataset.invFilter||'todos';renderInventory();return}const add=e.target.closest?.('#adminAddFrame');if(add){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();addFrame();return}const del=e.target.closest?.('[data-v3-del-frame]');if(del){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const arr=allFrames();arr.splice(Number(del.dataset.v3DelFrame),1);saveFrames(arr);sanitize();renderAdminFrames();renderShop();renderInventory();applyProfileFrame();return}const bn=e.target.closest?.('[data-v3-buy-normal]');if(bn){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const data=(typeof shopData!=='undefined'&&shopData[shopMode])?shopData[shopMode]:(safeShopData[shopMode]||[]);const it=data[Number(bn.dataset.v3BuyNormal)];if(!it)return;const u=userData();if(shopMode==='coins'){if(window.dlinkyOpenPixRecharge){window.dlinkyOpenPixRecharge(Number(it[2]||0));return}u.coins+=Number(it[2]||0);saveUser(u);counters();toastSafe('Linkwuans adicionados.');return}u.inventory.unshift({type:shopMode,kind:shopMode,name:it[0],value:it[2],duration:'Permanente',source:'shop',date:Date.now()});u.__hasPurchasedItem=true;u.__cleanNewAccount=false;if(['neonName','shineName','rainbowName','hideViews'].includes(it[2]))u[it[2]]=true;saveUser(u);counters();renderInventory();toastSafe('Item comprado e salvo no inventário!');return}const bf=e.target.closest?.('[data-v3-buy-frame]');if(bf){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openFrameBuy(bf.dataset.v3BuyFrame);return}if(e.target.closest?.('#confirmFrameBuy')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();if(window.__dlinkyForceFrameBuyFromModal){window.__dlinkyForceFrameBuyFromModal();}else{confirmFrameBuy();}return}if(e.target.closest?.('#closeFrameBuy,#cancelFrameBuy')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();closeFrameBuy();return}const use=e.target.closest?.('[data-v3-use-inv],[data-v3-use-effect]');if(use){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();useInventory(use.dataset.v3UseInv??use.dataset.v3UseEffect);return}const adj=e.target.closest?.('[data-v3-adjust-inv]');if(adj){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openAdjust(adj.dataset.v3AdjustInv);return}if(e.target.closest?.('#saveFrameAdjust')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();saveAdjust();return}if(e.target.closest?.('#resetFrameAdjust')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();resetAdjust();return}if(e.target.closest?.('#closeFrameAdjust')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const m=$('#frameAdjustModal');if(m){m.classList.remove('show');m.style.display='none'}return}},true);
  document.addEventListener('change',function(e){const sel=e.target.closest?.('[data-v3-duration]');if(!sel)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const i=Number(sel.dataset.v3Duration), f=allFrames()[i];const lab=$(`[data-v3-price="${i}"]`);if(lab&&f)lab.textContent=framePrice(f,sel.value)+' Linkwuans'},true);
  document.addEventListener('input',function(e){if(['adjustX','adjustY','adjustScale','adjustRotate'].includes(e.target?.id))updateAdjustPreview()},true);

  const css=document.createElement('style');css.textContent=`.real-inv-preview{position:relative;min-height:150px;overflow:visible}.real-inv-avatar{position:absolute;left:50%;top:50%;width:96px;height:96px;border-radius:50%;transform:translate(-50%,-50%);background-size:cover;background-position:center;background-color:#1b1020}.real-inv-frame{position:absolute;left:50%;top:50%;width:138px;height:138px;object-fit:contain;pointer-events:none;transform:translate(-50%,-50%)}.inv-actions-row{display:flex;gap:8px;flex-wrap:wrap}.inv-item-card.is-active{outline:1px solid rgba(255,105,180,.75);box-shadow:0 0 22px rgba(255,105,180,.18)}#profileFrame.profile-frame{position:absolute!important;left:50%!important;top:50%!important;width:150px!important;height:150px!important;object-fit:contain!important;pointer-events:none!important;z-index:4!important}.frame-duration{width:100%;margin:8px 0;padding:8px;border-radius:10px;background:#160814;color:#fff;border:1px solid rgba(255,255,255,.16)}`;document.head.appendChild(css);
  document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{sanitize();counters();renderAdminFrames();renderShop();renderInventory();applyProfileFrame()},100));
  setTimeout(()=>{sanitize();counters();renderAdminFrames();if($('#tab-store')?.classList.contains('active'))renderShop();if($('#tab-inventory')?.classList.contains('active'))renderInventory();applyProfileFrame()},600);
})();

/* =========================================================
   DLINKY V3 FINAL — FIX SOMENTE ÍCONE/AVATAR
   Um único palco estável para o avatar GIF + moldura.
   Não mexe em loja, inventário, login ou admin.
   ========================================================= */
(function(){
  'use strict';
  if(window.__DLINKY_FIX_SOMENTE_ICONE_FINAL__) return;
  window.__DLINKY_FIX_SOMENTE_ICONE_FINAL__ = true;

  const USER_KEY = 'dlinkyUser';
  const $ = (s,r=document)=>r.querySelector(s);

  function readUser(){
    try{
      const stored = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
      if(typeof user !== 'undefined' && user && typeof user === 'object') return Object.assign({}, stored, user);
      return stored;
    }catch(e){
      try{return (typeof user !== 'undefined' && user) ? user : {}; }catch(_){ return {}; }
    }
  }
  function clean(v){
    return String(v || '').trim().replace(/^url\(["']?|["']?\)$/g,'').replace(/["']/g,'').replace(/\\/g,'/');
  }
  function ok(v){
    v = clean(v);
    return !!v && v !== 'none' && v !== 'undefined' && v !== 'null';
  }
  function avatarKey(u){
    return 'dlinky_avatar_real_' + String((u.email || u.slug || 'local')).toLowerCase().trim();
  }
  function getAvatar(u){
    const av = clean(u.avatar || '');
    if(ok(av)){
      try{ localStorage.setItem(avatarKey(u), av); }catch(e){}
      return av;
    }
    return clean(localStorage.getItem(avatarKey(u)) || localStorage.getItem('dlinky_avatar_clean_'+(u.email||u.slug||'local')) || '');
  }
  function getFrame(u){
    return clean(u.frame || u.frameUrl || '');
  }
  function getFrameAdj(u){
    const frame = getFrame(u);
    let a = null;
    try{
      a = (u.frameAdjust && u.frameAdjust[frame]) || (u.frameAdjustments && (u.frameAdjustments[u.activeFrameId] || u.frameAdjustments[frame]));
    }catch(e){}
    a = a || {};
    let scale = Number(a.scale || 1);
    if(scale > 10) scale = scale / 100;
    return {x:Number(a.x||0), y:Number(a.y||0), scale:scale||1, rotate:Number(a.rotate||0)};
  }
  function ensureStage(){
    const wrap = $('#avatarDecoration');
    if(!wrap) return null;

    wrap.classList.add('dlinky-avatar-final-lock');
    wrap.classList.remove('dlinky-avatar-lite-on','dlinky-hard-avatar-v8','dlinky-clean-avatar-v7','dlinky-final-avatar-stage');

    // Remove só palcos duplicados criados por hotfix antigo. Não remove o HTML original.
    ['#dlinkyAvatarLiteRoot','#dlinkyCleanAvatarStage','#dlinkyFinalProfileStage','#dlinkyV4ProfileStage'].forEach(sel=>{
      wrap.querySelectorAll(sel).forEach(el=>el.remove());
    });

    let stage = $('#dlinkyStableAvatarStage', wrap);
    if(!stage){
      stage = document.createElement('div');
      stage.id = 'dlinkyStableAvatarStage';
      stage.innerHTML = '<img id="dlinkyStableAvatarImg" alt=""><img id="dlinkyStableFrameImg" alt="">';
      wrap.appendChild(stage);
    }else{
      if(!$('#dlinkyStableAvatarImg', stage)){
        const img = document.createElement('img'); img.id='dlinkyStableAvatarImg'; img.alt=''; stage.prepend(img);
      }
      if(!$('#dlinkyStableFrameImg', stage)){
        const img = document.createElement('img'); img.id='dlinkyStableFrameImg'; img.alt=''; stage.appendChild(img);
      }
    }
    return stage;
  }
  function applyIconOnly(){
    const u = readUser();
    const stage = ensureStage();
    if(!stage) return;

    const av = $('#dlinkyStableAvatarImg', stage);
    const fr = $('#dlinkyStableFrameImg', stage);
    const avatarUrl = getAvatar(u);
    const frameUrl = getFrame(u);

    if(av){
      if(ok(avatarUrl)){
        if(av.getAttribute('src') !== avatarUrl) av.setAttribute('src', avatarUrl);
        av.style.display = 'block';
      }else{
        av.removeAttribute('src');
        av.style.display = 'none';
      }
    }

    if(fr){
      if(ok(frameUrl)){
        if(fr.getAttribute('src') !== frameUrl) fr.setAttribute('src', frameUrl);
        const a = getFrameAdj(u);
        stage.style.setProperty('--dlinky-final-frame-x', a.x+'px');
        stage.style.setProperty('--dlinky-final-frame-y', a.y+'px');
        stage.style.setProperty('--dlinky-final-frame-scale', a.scale);
        stage.style.setProperty('--dlinky-final-frame-rotate', a.rotate+'deg');
        fr.style.display = 'block';
      }else{
        fr.removeAttribute('src');
        fr.style.display = 'none';
      }
    }
  }

  const oldRenderProfile = window.renderProfile || (typeof renderProfile !== 'undefined' ? renderProfile : null);
  if(typeof oldRenderProfile === 'function' && !oldRenderProfile.__DLINKY_FIX_SOMENTE_ICONE_FINAL__){
    const patched = function(){
      const r = oldRenderProfile.apply(this, arguments);
      requestAnimationFrame(applyIconOnly);
      setTimeout(applyIconOnly, 80);
      return r;
    };
    patched.__DLINKY_FIX_SOMENTE_ICONE_FINAL__ = true;
    window.renderProfile = patched;
    try{ renderProfile = patched; }catch(e){}
  }

  document.addEventListener('click', function(e){
    if(e.target.closest('#saveImages,#viewProfile,#viewProfile2,#saveFrameAdjust,[data-v3-use-inv],[data-dlinky-use-frame]')){
      setTimeout(applyIconOnly, 80);
    }
  }, true);
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(applyIconOnly, 120); });
  window.addEventListener('hashchange', function(){ setTimeout(applyIconOnly, 120); });
  setTimeout(applyIconOnly, 300);
})();

/* =========================================================
   DLINKY — FIX DEFINITIVO INVENTÁRIO DE MOLDURAS 2026
   Problema: patches antigos salvavam dlinkyUser sem inventory/frame
   ao abrir perfil/voltar para dashboard. Esta trava cria um backup por
   conta e mescla molduras antes de qualquer gravação em localStorage.
   Mexe só em: inventory de molduras, frame ativo e ajustes.
   ========================================================= */
(function(){
  'use strict';
  if(window.__DLINKY_FRAME_INVENTORY_VAULT_2026__) return;
  window.__DLINKY_FRAME_INVENTORY_VAULT_2026__ = true;

  const USER_KEY = 'dlinkyUser';
  const VAULT_KEY = 'dlinkyFrameInventoryVaultByAccount2026';
  const $ = (s,r=document)=>r.querySelector(s);
  const norm = v => String(v||'').trim().replace(/^url\(["']?|["']?\)$/g,'').replace(/\\/g,'/').split('?')[0].toLowerCase();
  const esc = v => String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const cleanAdj = a => ({x:Number(a?.x)||0,y:Number(a?.y)||0,scale:Number(a?.scale)||1,rotate:Number(a?.rotate)||0});
  const isFrame = it => !!(it && frameUrl(it) && (/frame|frames|moldur/i.test(String(it.type||it.kind||it.name||'')) || /\.(gif|png|webp|apng|svg)(\?|#|$)|^data:image\//i.test(frameUrl(it))));
  const frameUrl = it => String(it?.url || it?.frameUrl || it?.image || it?.src || '').trim();
  const makeId = it => String(it?.id || it?.frameId || ('frame_' + Math.abs([...norm(frameUrl(it)||it?.name||Date.now())].reduce((a,c)=>((a<<5)-a+c.charCodeAt(0))|0,0))));

  function readJSON(k,fb){ try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(fb));}catch(e){return fb;} }
  function rawWrite(k,v){ try{ localStorage.setItem.__dlinkyOriginal ? localStorage.setItem.__dlinkyOriginal(k,v) : Storage.prototype.setItem.call(localStorage,k,v); }catch(e){ try{Storage.prototype.setItem.call(localStorage,k,v)}catch(_){} } }
  function accountKey(u){
    const email = String(u?.email||'').toLowerCase().trim();
    const slug = String(u?.slug||'').toLowerCase().trim();
    return email || slug || 'local';
  }
  function frameKey(it){ return norm(frameUrl(it)) || String(makeId(it)); }
  function normalizeFrameItem(it){
    const url = frameUrl(it);
    const id = makeId(it);
    return Object.assign({}, it, {
      id,
      type: 'frames',
      kind: 'frame',
      url,
      frameUrl: url,
      name: it?.name || it?.frameName || 'Moldura',
      duration: it?.duration || 'Permanente'
    });
  }
  function mergeFrameArrays(a,b){
    const map = new Map();
    [...(Array.isArray(a)?a:[]), ...(Array.isArray(b)?b:[])].forEach(it=>{
      if(!isFrame(it)) return;
      const n = normalizeFrameItem(it);
      map.set(frameKey(n), Object.assign(map.get(frameKey(n))||{}, n));
    });
    return [...map.values()];
  }
  function readVault(){ return readJSON(VAULT_KEY,{}); }
  function writeVault(v){ rawWrite(VAULT_KEY, JSON.stringify(v||{})); }
  function saveBackup(u){
    if(!u || typeof u !== 'object') return u;
    const frames = (Array.isArray(u.inventory)?u.inventory:[]).filter(isFrame).map(normalizeFrameItem);
    if(!frames.length && !u.frame && !u.frameUrl) return u;
    const key = accountKey(u);
    const vault = readVault();
    const old = vault[key] || {inventory:[], frameAdjustments:{}, frameAdjust:{}};
    const mergedFrames = mergeFrameArrays(old.inventory, frames);
    const activeUrl = norm(u.frame || u.frameUrl);
    const active = mergedFrames.find(it=>norm(frameUrl(it))===activeUrl) || mergedFrames.find(it=>String(it.id)===String(u.activeFrameId)) || mergedFrames[0];
    vault[key] = {
      inventory: mergedFrames,
      frame: active ? frameUrl(active) : (u.frame || u.frameUrl || old.frame || ''),
      frameUrl: active ? frameUrl(active) : (u.frameUrl || u.frame || old.frameUrl || ''),
      activeFrameId: active ? active.id : (u.activeFrameId || old.activeFrameId || ''),
      frameName: active ? active.name : (u.frameName || old.frameName || ''),
      frameAdjustments: Object.assign({}, old.frameAdjustments||{}, u.frameAdjustments||{}),
      frameAdjust: Object.assign({}, old.frameAdjust||{}, u.frameAdjust||{})
    };
    writeVault(vault);
    return u;
  }
  function mergeWithBackup(u){
    if(!u || typeof u !== 'object') u = {};
    const key = accountKey(u);
    const vault = readVault();
    const bak = vault[key];
    if(!bak) return saveBackup(u);

    const currentInv = Array.isArray(u.inventory) ? u.inventory : [];
    const currentFrames = currentInv.filter(isFrame).map(normalizeFrameItem);
    const backupFrames = Array.isArray(bak.inventory) ? bak.inventory.filter(isFrame).map(normalizeFrameItem) : [];
    const frames = mergeFrameArrays(backupFrames, currentFrames);
    const others = currentInv.filter(it=>!isFrame(it));

    if(frames.length){
      const activeUrl = norm(u.frame || u.frameUrl || bak.frame || bak.frameUrl);
      const active = frames.find(it=>norm(frameUrl(it))===activeUrl) || frames.find(it=>String(it.id)===String(u.activeFrameId||bak.activeFrameId)) || frames[0];
      u.inventory = [...frames, ...others];
      u.frame = frameUrl(active);
      u.frameUrl = frameUrl(active);
      u.frameName = active.name || 'Moldura';
      u.activeFrameId = active.id;
      u.decoration = 'none';
      u.frameAdjustments = Object.assign({}, bak.frameAdjustments||{}, u.frameAdjustments||{});
      u.frameAdjust = Object.assign({}, bak.frameAdjust||{}, u.frameAdjust||{});
    }
    saveBackup(u);
    return u;
  }

  // Captura qualquer gravação antiga em dlinkyUser e impede ela de apagar molduras compradas.
  if(!localStorage.setItem.__dlinkyFrameVaultPatched){
    const original = localStorage.setItem.bind(localStorage);
    const patched = function(key,value){
      if(key === USER_KEY){
        try{
          const merged = mergeWithBackup(JSON.parse(value||'{}'));
          value = JSON.stringify(merged);
          if(typeof user !== 'undefined' && user && typeof user === 'object') Object.assign(user, merged);
          if(window.user && typeof window.user === 'object') Object.assign(window.user, merged);
        }catch(e){}
      }
      return original(key,value);
    };
    patched.__dlinkyOriginal = original;
    patched.__dlinkyFrameVaultPatched = true;
    localStorage.setItem = patched;
  }

  function currentUser(){
    const u = mergeWithBackup(readJSON(USER_KEY,{}));
    rawWrite(USER_KEY, JSON.stringify(u));
    try{ if(typeof user !== 'undefined' && user) Object.assign(user,u); if(window.user) Object.assign(window.user,u); }catch(e){}
    return u;
  }
  function adjustment(u,it){
    const id = makeId(it), url = frameUrl(it);
    return cleanAdj(u.frameAdjustments?.[id] || u.frameAdjust?.[url] || u.frameAdjust?.[norm(url)] || {x:0,y:0,scale:1,rotate:0});
  }
  function tr(a){ a=cleanAdj(a); return `translate(calc(-50% + ${a.x}px),calc(-50% + ${a.y}px)) scale(${a.scale}) rotate(${a.rotate}deg)`; }
  function activeFrame(u){
    const frames = (Array.isArray(u.inventory)?u.inventory:[]).filter(isFrame).map(normalizeFrameItem);
    return frames.find(it=>norm(frameUrl(it))===norm(u.frame||u.frameUrl)) || frames.find(it=>String(it.id)===String(u.activeFrameId)) || frames[0];
  }

  function renderInventorySafe(){
    const grid = $('#inventoryGrid');
    if(!grid) return;
    const u = currentUser();
    const frames = (u.inventory||[]).filter(isFrame).map(normalizeFrameItem);
    const others = (u.inventory||[]).filter(it=>!isFrame(it));
    if(!frames.length && !others.length){ grid.innerHTML='<p>Você ainda não possui itens no inventário.</p>'; return; }
    grid.innerHTML = [
      ...frames.map(it=>{
        const a = adjustment(u,it);
        const active = norm(frameUrl(it))===norm(u.frame||u.frameUrl) || String(it.id)===String(u.activeFrameId);
        return `<div class="asset-card inv-item-card ${active?'is-active':''}">
          <div class="asset-preview shop-preview real-inv-preview">
            <span class="real-inv-avatar" style="background-image:url('${esc(u.avatar||'')}')"></span>
            <img class="real-inv-frame" src="${esc(frameUrl(it))}" style="transform:${tr(a)}" alt="${esc(it.name||'Moldura')}">
          </div>
          <div class="asset-body"><b>${esc(it.name||'Moldura')}</b><small>${esc(it.duration||'Permanente')}</small>
            <div class="inv-actions-row"><button class="btn primary small" data-frame-vault-use="${esc(it.id)}">${active?'Usando':'Usar'}</button><button class="btn primary small" data-frame-vault-adjust="${esc(it.id)}">Ajustar</button></div>
          </div>
        </div>`;
      }),
      ...others.map(it=>`<div class="asset-card inv-item-card"><div class="asset-preview shop-preview">✦</div><div class="asset-body"><b>${esc(it.name||'Item')}</b><small>${esc(it.duration||it.type||'item')}</small></div></div>`)
    ].join('');
  }

  function applyProfileSafe(){
    const u = currentUser();
    const it = activeFrame(u);
    const deco = $('#avatarDecoration');
    if(!deco) return;
    const oldAvatar = $('#profileAvatar');
    const oldFrame = $('#profileFrame');
    if(oldAvatar) oldAvatar.style.setProperty('display','none','important');
    if(oldFrame) oldFrame.style.setProperty('display','none','important');
    deco.className = 'avatar-decoration dlinky-frame-vault-only';
    let stage = $('#dlinkyFrameVaultStage',deco);
    if(!it || !frameUrl(it)){ if(stage) stage.remove(); return; }
    if(!stage){
      stage = document.createElement('div');
      stage.id = 'dlinkyFrameVaultStage';
      stage.innerHTML = '<span class="dlinky-frame-vault-avatar"></span><img class="dlinky-frame-vault-img" alt="moldura">';
      deco.appendChild(stage);
    }
    const av = $('.dlinky-frame-vault-avatar',stage);
    const img = $('.dlinky-frame-vault-img',stage);
    if(av) av.style.backgroundImage = u.avatar ? `url("${u.avatar}")` : '';
    if(img){ img.src = frameUrl(it); img.style.transform = tr(adjustment(u,it)); }
  }

  function useFrame(id){
    const u = currentUser();
    const it = (u.inventory||[]).filter(isFrame).map(normalizeFrameItem).find(x=>String(x.id)===String(id) || norm(frameUrl(x))===norm(id));
    if(!it) return;
    u.frame = frameUrl(it); u.frameUrl = frameUrl(it); u.frameName = it.name||'Moldura'; u.activeFrameId = it.id; u.decoration = 'none';
    rawWrite(USER_KEY, JSON.stringify(mergeWithBackup(u)));
    renderInventorySafe(); applyProfileSafe();
    try{ if(typeof toast==='function') toast('Moldura aplicada e fixa!'); }catch(e){}
  }
  function openAdjust(id){
    const u = currentUser();
    const it = (u.inventory||[]).filter(isFrame).map(normalizeFrameItem).find(x=>String(x.id)===String(id));
    if(!it) return;
    window.__dlinkyEditingFrameId = it.id;
    if(typeof window.openFrameAdjustModal === 'function' && !window.openFrameAdjustModal.__vaultCalling){
      try{ window.openFrameAdjustModal.__vaultCalling = true; window.openFrameAdjustModal(it.id); window.openFrameAdjustModal.__vaultCalling = false; return; }catch(e){ window.openFrameAdjustModal.__vaultCalling = false; }
    }
  }

  const prevRenderInventory = window.renderInventory;
  window.renderInventory = function(){ currentUser(); if(typeof prevRenderInventory==='function') prevRenderInventory.apply(this,arguments); renderInventorySafe(); };
  try{ renderInventory = window.renderInventory; }catch(e){}

  const prevRenderProfile = window.renderProfile;
  window.renderProfile = function(){ currentUser(); if(typeof prevRenderProfile==='function') prevRenderProfile.apply(this,arguments); [0,80,250,700,1400].forEach(t=>setTimeout(applyProfileSafe,t)); };
  try{ renderProfile = window.renderProfile; }catch(e){}

  document.addEventListener('click',function(e){
    const use = e.target.closest?.('[data-frame-vault-use]');
    if(use){ e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); useFrame(use.dataset.frameVaultUse); return; }
    const adj = e.target.closest?.('[data-frame-vault-adjust]');
    if(adj){ e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); openAdjust(adj.dataset.frameVaultAdjust); return; }
    if(e.target.closest?.('#saveFrameAdjust')) setTimeout(()=>{ currentUser(); renderInventorySafe(); applyProfileSafe(); },120);
  }, true);

  window.addEventListener('hashchange',()=>setTimeout(()=>{ currentUser(); renderInventorySafe(); applyProfileSafe(); },120));
  document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{ currentUser(); renderInventorySafe(); applyProfileSafe(); },300));
  setTimeout(()=>{ currentUser(); renderInventorySafe(); applyProfileSafe(); },700);

  const css = document.createElement('style');
  css.textContent = `
    .real-inv-preview{position:relative!important;min-height:150px!important;overflow:visible!important}.real-inv-avatar{position:absolute!important;left:50%!important;top:50%!important;width:96px!important;height:96px!important;border-radius:50%!important;transform:translate(-50%,-50%)!important;background-size:cover!important;background-position:center!important}.real-inv-frame{position:absolute!important;left:50%!important;top:50%!important;width:138px!important;height:138px!important;object-fit:contain!important;pointer-events:none!important;transform-origin:center center!important}.dlinky-frame-vault-only{position:relative!important;width:160px!important;height:160px!important;margin:auto!important}.dlinky-frame-vault-only>#dlinkyFrameVaultStage{position:absolute!important;inset:0!important;display:block!important}.dlinky-frame-vault-avatar{position:absolute!important;left:50%!important;top:50%!important;width:96px!important;height:96px!important;border-radius:50%!important;background-size:cover!important;background-position:center!important;transform:translate(-50%,-50%)!important}.dlinky-frame-vault-img{position:absolute!important;left:50%!important;top:50%!important;width:150px!important;height:150px!important;object-fit:contain!important;pointer-events:none!important;transform-origin:center center!important}.inv-actions-row{display:flex!important;gap:8px!important;flex-wrap:wrap!important}.inv-item-card.is-active{outline:1px solid rgba(255,105,180,.8)!important;box-shadow:0 0 20px rgba(255,105,180,.18)!important}`;
  document.head.appendChild(css);
})();

/* =========================================================
   HOTFIX CLIQUE SALVAR AJUSTE — SOMENTE MODAL DE MOLDURA
   Resolve quando patches antigos impedem o clique do botão salvar.
   ========================================================= */
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const norm=u=>String(u||'').trim().replace(/^url\(["']?|["']?\)$/g,'').split('?')[0];
  const clean=a=>({x:Number(a&&a.x)||0,y:Number(a&&a.y)||0,scale:Math.max(.2,Number(a&&a.scale)||1),rotate:Number(a&&a.rotate)||0});
  const isFrame=it=>!!(it&&(it.type==='frame'||it.type==='frames'||it.kind==='frame'||/moldura|frame/i.test(String(it.name||''))||/\.(gif|png|webp|apng|svg)(\?|#|$)/i.test(String(it.url||''))||String(it.url||'').startsWith('data:image/svg+xml')));
  function saveUserNow(){ try{ localStorage.setItem('dlinkyUser',JSON.stringify(window.user||user)); }catch(e){} }
  function findEditingFrame(){
    const u=window.user||user;
    u.inventory=Array.isArray(u.inventory)?u.inventory:[];
    const edit=window.__dlinkyEditingFrameId||u.activeFrameId||u.frame;
    return u.inventory.find(it=>isFrame(it)&&(it.id===edit||norm(it.url)===norm(edit))) || u.inventory.find(it=>isFrame(it)&&norm(it.url)===norm(u.frame)) || u.inventory.find(isFrame);
  }
  function readAdjustControls(){
    return clean({
      x:q('#adjustX')?.value,
      y:q('#adjustY')?.value,
      scale:q('#adjustScale')?.value,
      rotate:q('#adjustRotate')?.value
    });
  }
  function forceSaveFrameAdjust(ev){
    const btn=ev.target && ev.target.closest && ev.target.closest('#saveFrameAdjust');
    if(!btn) return;
    ev.preventDefault();
    ev.stopPropagation();
    ev.stopImmediatePropagation();

    const u=window.user||user;
    const it=findEditingFrame();
    if(!it || !it.url){ if(typeof toast==='function') toast('Não encontrei a moldura para salvar.'); return false; }

    it.id=it.id || ('frame_'+(norm(it.url)||it.name||Date.now()).toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,''));
    const adj=readAdjustControls();
    u.frameAdjustments=u.frameAdjustments||{};
    u.frameAdjust=u.frameAdjust||{};
    u.frameAdjustments[it.id]=adj;
    u.frameAdjust[it.url]=adj;
    u.frameAdjust[norm(it.url)]=adj;
    u.activeFrameId=it.id;
    u.frame=it.url;
    u.decoration='none';
    saveUserNow();

    const modal=q('#frameAdjustModal');
    if(modal){ modal.classList.remove('show'); modal.style.setProperty('display','none','important'); }
    if(typeof window.renderInventory==='function') setTimeout(()=>window.renderInventory(),0);
    if((location.hash||'').includes('/profile') && typeof window.renderProfile==='function') setTimeout(()=>window.renderProfile(),30);
    if(typeof toast==='function') toast('Ajuste salvo!');
    return false;
  }
  document.addEventListener('click',forceSaveFrameAdjust,true);
  document.addEventListener('pointerup',function(ev){ if(ev.target?.closest?.('#saveFrameAdjust')) forceSaveFrameAdjust(ev); },true);
})();

/* =========================================================
   DLINKY HOTFIX LIMPO — APENAS PISCAR/RESET DA MOLDURA
   Base: versão SALVAR_AJUSTE_CLICAVEL_FIX.
   Não troca avatar, não remove inventário, não recria modal.
   Só reaplica o ajuste salvo depois que códigos antigos tentam voltar
   a moldura para o tamanho padrão.
   ========================================================= */
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const USER_KEY='dlinkyUser';
  const norm=v=>String(v||'').trim().replace(/^url\(["']?|["']?\)$/g,'').replace(/\\/g,'/').split('?')[0].toLowerCase();
  const isFrame=it=>!!(it&&(it.url||/moldura|frame/i.test(String(it.name||''))||/frame/i.test(String(it.type||it.kind||''))));
  const frameUrl=it=>String((it&&(it.url||it.value||it.src))||'');
  function readUser(){try{return JSON.parse(localStorage.getItem(USER_KEY)||'{}')}catch(e){return (window.user||{})}}
  function clean(a){let s=Number(a&&a.scale); if(!s)s=1; if(s>10)s=s/100; return {x:Number(a&&a.x)||0,y:Number(a&&a.y)||0,scale:s,rotate:Number(a&&a.rotate)||0};}
  function makeId(it){if(!it)return''; if(it.id)return String(it.id); return 'frame_'+(norm(frameUrl(it))||String(it.name||'moldura')).replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'').slice(-70);}
  function activeFrame(u){const inv=Array.isArray(u.inventory)?u.inventory:[];const frames=inv.filter(isFrame);return frames.find(it=>String(makeId(it))===String(u.activeFrameId))||frames.find(it=>norm(frameUrl(it))===norm(u.frame||u.frameUrl))||frames[0];}
  function adjustment(u,it){const id=makeId(it), url=frameUrl(it);return clean((u.frameAdjustments&&u.frameAdjustments[id])||(u.frameAdjust&&u.frameAdjust[url])||(u.frameAdjust&&u.frameAdjust[norm(url)])||{x:0,y:0,scale:1,rotate:0});}
  function transform(a){a=clean(a);return `translate(calc(-50% + ${a.x}px),calc(-50% + ${a.y}px)) scale(${a.scale}) rotate(${a.rotate}deg)`;}
  function applyNoFlicker(){
    const u=readUser(); const it=activeFrame(u); if(!it||!frameUrl(it))return;
    const a=adjustment(u,it); const tr=transform(a);
    const img=q('#dlinkyFrameVaultStage .dlinky-frame-vault-img')||q('.dlinky-frame-vault-img')||q('#profileFrame');
    if(img){
      img.src=frameUrl(it);
      img.style.setProperty('display','block','important');
      img.style.setProperty('visibility','visible','important');
      img.style.setProperty('opacity','1','important');
      img.style.setProperty('transform',tr,'important');
      img.style.setProperty('transform-origin','center center','important');
      img.style.setProperty('will-change','auto','important');
    }
    const av=q('#dlinkyFrameVaultStage .dlinky-frame-vault-avatar')||q('.dlinky-frame-vault-avatar');
    if(av&&u.avatar){av.style.setProperty('background-image',`url("${u.avatar}")`,'important');}
    const deco=q('#avatarDecoration');
    if(deco){deco.style.setProperty('transition','none','important');deco.classList.add('dlinky-no-flicker-lock');}
  }
  function applyBurst(){[0,40,120,260,520,900,1500,2300].forEach(t=>setTimeout(applyNoFlicker,t));}
  const oldRenderProfile=window.renderProfile;
  window.renderProfile=function(){ if(typeof oldRenderProfile==='function') oldRenderProfile.apply(this,arguments); applyBurst(); };
  try{renderProfile=window.renderProfile;}catch(e){}
  window.addEventListener('hashchange',applyBurst);
  document.addEventListener('click',function(e){
    if(e.target.closest?.('#saveFrameAdjust,[data-frame-vault-use],[data-v3-use-inv],[data-v3-use-effect],[data-dlinky-use-frame]')) applyBurst();
  },true);
  document.addEventListener('DOMContentLoaded',applyBurst);
  setTimeout(applyBurst,500);
})();

/* =========================================================
   DLINKY V11 — FIX SÓ DA MOLDURA DE PRIMEIRA
   - Ajustar funciona antes de abrir Ver Perfil.
   - O slider Tamanho usa porcentagem no HTML, mas salva escala decimal.
   - A prévia do modal nunca some quando diminui/aumenta.
   - Salvar aplica direto no inventário e no perfil.
   ========================================================= */
(function(){
  'use strict';
  const q=(s,r=document)=>r.querySelector(s);
  const norm=v=>String(v||'').trim().replace(/^url\(["']?|["']?\)$/g,'').replace(/\\/g,'/').split('?')[0].toLowerCase();
  const isFrame=it=>!!(it&&(it.url||it.frameUrl||it.image||it.src||/moldura|frame/i.test(String(it.name||''))||/frame/i.test(String(it.type||it.kind||''))));
  const urlOf=it=>String((it&&(it.url||it.frameUrl||it.image||it.src||it.value))||'').trim();
  const makeId=it=>String((it&&(it.id||it.frameId))||('frame_'+(norm(urlOf(it))||String(it&&it.name||'moldura')).replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'').slice(-80)));
  const clean=a=>{let s=Number(a&&a.scale); if(!s) s=1; if(s>10) s=s/100; return {x:Number(a&&a.x)||0,y:Number(a&&a.y)||0,scale:Math.max(.2,Math.min(3,s)),rotate:Number(a&&a.rotate)||0};};
  function u(){return window.user||user;}
  function save(){try{localStorage.setItem('dlinkyUser',JSON.stringify(u()));}catch(e){}}
  function ensure(){const user=u(); user.inventory=Array.isArray(user.inventory)?user.inventory:[]; user.frameAdjustments=user.frameAdjustments||{}; user.frameAdjust=user.frameAdjust||{}; user.inventory.forEach(it=>{if(isFrame(it)){it.id=makeId(it); it.url=urlOf(it); it.type=it.type||'frames';}});}
  function frameById(id){ensure(); const user=u(); return user.inventory.find(it=>isFrame(it)&&(String(makeId(it))===String(id)||norm(urlOf(it))===norm(id))) || user.inventory.find(it=>isFrame(it)&&norm(urlOf(it))===norm(user.frame||user.frameUrl)) || user.inventory.find(isFrame);}
  function activeFrame(){ensure(); const user=u(); return frameById(user.activeFrameId)||frameById(user.frame);}
  function adjFor(it){const user=u(); if(!it)return clean({}); const id=makeId(it), url=urlOf(it); return clean((user.frameAdjustments&&user.frameAdjustments[id])||(user.frameAdjust&&user.frameAdjust[url])||(user.frameAdjust&&user.frameAdjust[norm(url)])||{});}
  function storeAdj(it,a){const user=u(); a=clean(a); const id=makeId(it), url=urlOf(it); user.frameAdjustments=user.frameAdjustments||{}; user.frameAdjust=user.frameAdjust||{}; user.frameAdjustments[id]=a; user.frameAdjust[url]=a; user.frameAdjust[norm(url)]=a; user.activeFrameId=id; user.frame=url; user.frameUrl=url; user.decoration='none'; save(); return a;}
  function scaleInputIsPercent(){const el=q('#adjustScale'); return !el || Number(el.max||0)>10;}
  function toInputScale(scale){scale=clean({scale}).scale; return scaleInputIsPercent()?Math.round(scale*100):scale;}
  function fromInputScale(v){let n=Number(v); if(!n)n=scaleInputIsPercent()?100:1; return scaleInputIsPercent()?n/100:n;}
  function transform(a){a=clean(a); return `translate(calc(-50% + ${a.x}px), calc(-50% + ${a.y}px)) scale(${a.scale}) rotate(${a.rotate}deg)`;}
  function modalImg(){return q('#adjustFrame')||q('#adjustFrameFinal');}
  function readControls(){return clean({x:q('#adjustX')?.value,y:q('#adjustY')?.value,scale:fromInputScale(q('#adjustScale')?.value),rotate:q('#adjustRotate')?.value});}
  function fillControls(a){a=clean(a); if(q('#adjustX'))q('#adjustX').value=a.x; if(q('#adjustY'))q('#adjustY').value=a.y; if(q('#adjustScale'))q('#adjustScale').value=toInputScale(a.scale); if(q('#adjustRotate'))q('#adjustRotate').value=a.rotate; updateModalPreview();}
  function updateModalPreview(){const img=modalImg(); const av=q('#adjustAvatar'); const user=u(); if(av){av.style.backgroundImage=user.avatar?`url("${user.avatar}")`:''; av.style.display='block'; av.style.visibility='visible'; av.style.opacity='1';} if(img){img.style.setProperty('display','block','important'); img.style.setProperty('visibility','visible','important'); img.style.setProperty('opacity','1','important'); img.style.setProperty('left','50%','important'); img.style.setProperty('top','50%','important'); img.style.setProperty('transform',transform(readControls()),'important'); img.style.setProperty('transform-origin','center center','important'); img.style.setProperty('object-fit','contain','important');}}
  function applyEverywhere(){ensure(); const it=activeFrame(); if(!it||!urlOf(it))return; const a=adjFor(it), tr=transform(a), url=urlOf(it); ['#dlinkyStableFrameImg','#dlinkyFrameVaultStage .dlinky-frame-vault-img','.dlinky-frame-vault-img','#dlinkyFinalProfileStage .dlinky-final-frame','#profileFrame'].forEach(sel=>{const img=q(sel); if(img){if(img.getAttribute('src')!==url)img.setAttribute('src',url); img.style.setProperty('display','block','important'); img.style.setProperty('visibility','visible','important'); img.style.setProperty('opacity','1','important'); img.style.setProperty('transform',tr,'important'); img.style.setProperty('transform-origin','center center','important');}}); const stable=q('#dlinkyStableAvatarStage'); if(stable){stable.style.setProperty('--dlinky-final-frame-x',a.x+'px');stable.style.setProperty('--dlinky-final-frame-y',a.y+'px');stable.style.setProperty('--dlinky-final-frame-scale',a.scale);stable.style.setProperty('--dlinky-final-frame-rotate',a.rotate+'deg');} const av=q('#dlinkyStableAvatarImg')||q('#dlinkyFrameVaultStage .dlinky-frame-vault-avatar'); if(av&&u().avatar){ if(av.tagName==='IMG') av.src=u().avatar; else av.style.backgroundImage=`url("${u().avatar}")`; }}
  window.openFrameAdjustModal=function(id){const it=frameById(id); if(!it||!urlOf(it))return; const user=u(); window.__dlinkyEditingFrameId=makeId(it); user.activeFrameId=makeId(it); user.frame=urlOf(it); user.frameUrl=urlOf(it); user.decoration='none'; save(); const m=q('#frameAdjustModal'); const img=modalImg(); if(!m||!img)return; if(img.getAttribute('src')!==urlOf(it)) img.setAttribute('src',urlOf(it)); m.classList.add('show'); m.style.setProperty('display','flex','important'); fillControls(adjFor(it)); updateModalPreview(); applyEverywhere(); };
  window.saveFrameAdjustment=function(){const it=frameById(window.__dlinkyEditingFrameId||u().activeFrameId||u().frame); if(!it||!urlOf(it))return; storeAdj(it,readControls()); const m=q('#frameAdjustModal'); if(m){m.classList.remove('show');m.style.setProperty('display','none','important');} if(typeof window.renderInventory==='function')setTimeout(()=>window.renderInventory(),0); applyEverywhere(); if(typeof toast==='function')toast('Ajuste salvo!');};
  document.addEventListener('input',e=>{if(['adjustX','adjustY','adjustScale','adjustRotate'].includes(e.target?.id))updateModalPreview();},true);
  document.addEventListener('click',e=>{const adj=e.target.closest?.('[data-frame-vault-adjust],[data-v8-adjust-frame],[data-v7-adjust-frame],[data-v6-adjust-frame],[data-v4-adjust-frame],[data-v3-adjust-frame],[data-dlinky-adjust-frame]'); if(adj){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation(); window.openFrameAdjustModal(adj.dataset.frameVaultAdjust||adj.dataset.v8AdjustFrame||adj.dataset.v7AdjustFrame||adj.dataset.v6AdjustFrame||adj.dataset.v4AdjustFrame||adj.dataset.v3AdjustFrame||adj.dataset.dlinkyAdjustFrame); return;} const saveBtn=e.target.closest?.('#saveFrameAdjust'); if(saveBtn){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation(); window.saveFrameAdjustment(); return;}},true);
  const oldRP=window.renderProfile; window.renderProfile=function(){if(typeof oldRP==='function')oldRP.apply(this,arguments); [0,80,220,600,1200].forEach(t=>setTimeout(applyEverywhere,t));}; try{renderProfile=window.renderProfile;}catch(e){}
  window.addEventListener('hashchange',()=>[80,220,600].forEach(t=>setTimeout(applyEverywhere,t)));
  setTimeout(applyEverywhere,500);
})();

/* =========================================================
   DLINKY — REMOVER APENAS AS 2 MOLDURAS FAKE DO INVENTÁRIO
   - Remove permanentemente: "Moldura Spike Dark" e "Moldura Golden Spike".
   - Não remove a moldura real "spike" comprada/cadastrada na loja.
   - Limpa também backups que podiam trazer elas de volta.
   ========================================================= */
(function(){
  'use strict';
  if(window.__dlinkyRemoveSomenteMoldurasFakeV1) return;
  window.__dlinkyRemoveSomenteMoldurasFakeV1 = true;

  const USER_KEY = 'dlinkyUser';
  const VAULT_KEY = 'dlinkyFrameVault';
  const CUSTOM_FRAMES_KEY = 'dlinkyCustomFrames';
  const OLD_FRAMES_KEY = 'dlinkyFrames';
  const LAST_KEY = 'dlinkyLastGoodFrameUrl';

  function normText(v){
    return String(v||'')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/\s+/g,' ')
      .trim();
  }
  function normUrl(v){
    return String(v||'')
      .trim()
      .replace(/^url\(["']?|["']?\)$/g,'')
      .replace(/\\/g,'/')
      .split('?')[0]
      .toLowerCase();
  }
  function read(k,fb){ try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(fb));}catch(e){return fb;} }
  function write(k,v){ try{localStorage.setItem(k,JSON.stringify(v));}catch(e){} }
  function urlOf(it){ return normUrl(it && (it.url || it.frameUrl || it.image || it.src || it.value || it.frame)); }
  function nameOf(it){ return normText(it && (it.name || it.nome || it.title || it.frameName)); }
  function idOf(it){ return normText(it && (it.id || it.frameId || it.value)); }

  function isFakeFrame(it){
    const n = nameOf(it);
    const id = idOf(it);
    const u = urlOf(it);

    // Remove só as DUAS molduras falsas que apareceram no inventário.
    // A moldura real chamada só "spike" continua.
    if(n === 'moldura spike dark') return true;
    if(n === 'moldura golden spike') return true;
    if(id === 'moldura spike dark' || id === 'moldura golden spike') return true;

    // Fallback antigo específico, caso alguma versão tenha salvo sem nome.
    if(u.includes('spike-dark-fallback')) return true;
    if(u.includes('golden-spike-fallback')) return true;
    return false;
  }

  function isFrame(it){
    if(!it) return false;
    const t = normText(it.type || it.kind || '');
    const n = nameOf(it);
    const u = urlOf(it);
    return t.includes('frame') || t.includes('moldura') || n.includes('moldura') || /\.(png|apng|gif|webp|jpg|jpeg|svg)$/.test(u) || u.startsWith('data:image/');
  }

  function normalizeRealFrame(it){
    const url = String(it.url || it.frameUrl || it.image || it.src || '').trim();
    const id = String(it.id || it.frameId || ('frame_'+(normUrl(url)||nameOf(it)||Date.now()).replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')));
    return Object.assign({}, it, {id, type: it.type || 'frames', kind: 'frame', url, frameUrl: url});
  }

  function pickActive(u){
    const frames = (Array.isArray(u.inventory) ? u.inventory : []).filter(it => isFrame(it) && !isFakeFrame(it)).map(normalizeRealFrame);
    if(!frames.length){
      u.frame = ''; u.frameUrl = ''; u.frameName = ''; u.activeFrameId = '';
      return u;
    }
    const active = frames.find(it => normUrl(it.url) === normUrl(u.frame || u.frameUrl))
      || frames.find(it => String(it.id) === String(u.activeFrameId))
      || frames[0];
    u.frame = active.url || active.frameUrl || '';
    u.frameUrl = active.url || active.frameUrl || '';
    u.frameName = active.name || 'Moldura';
    u.activeFrameId = active.id || '';
    u.decoration = 'none';
    return u;
  }

  function cleanUserObject(u){
    if(!u || typeof u !== 'object') u = {};
    if(!Array.isArray(u.inventory)) u.inventory = [];
    const before = u.inventory.length;
    u.inventory = u.inventory.filter(it => !isFakeFrame(it));
    const activeWasFake = isFakeFrame({name:u.frameName, id:u.activeFrameId, url:u.frame || u.frameUrl});
    if(before !== u.inventory.length || activeWasFake){ pickActive(u); }
    return u;
  }

  function cleanArrayKey(key){
    const arr = read(key, null);
    if(!Array.isArray(arr)) return;
    const cleaned = arr.filter(it => !isFakeFrame(it));
    if(cleaned.length !== arr.length) write(key, cleaned);
  }

  function cleanVault(){
    const vault = read(VAULT_KEY, null);
    if(!vault || typeof vault !== 'object') return;
    let changed = false;
    Object.keys(vault).forEach(acc => {
      const entry = vault[acc];
      if(!entry || typeof entry !== 'object') return;
      if(Array.isArray(entry.inventory)){
        const oldLen = entry.inventory.length;
        entry.inventory = entry.inventory.filter(it => !isFakeFrame(it));
        if(oldLen !== entry.inventory.length) changed = true;
      }
      if(isFakeFrame({name:entry.frameName, id:entry.activeFrameId, url:entry.frame || entry.frameUrl})){
        const frames = Array.isArray(entry.inventory) ? entry.inventory.filter(it => isFrame(it) && !isFakeFrame(it)).map(normalizeRealFrame) : [];
        const active = frames[0];
        entry.frame = active ? active.url : '';
        entry.frameUrl = active ? active.url : '';
        entry.frameName = active ? (active.name || 'Moldura') : '';
        entry.activeFrameId = active ? active.id : '';
        changed = true;
      }
    });
    if(changed) write(VAULT_KEY, vault);
  }

  function cleanEverything(){
    localStorage.removeItem(LAST_KEY);
    cleanArrayKey(CUSTOM_FRAMES_KEY);
    cleanArrayKey(OLD_FRAMES_KEY);
    cleanVault();
    const u = cleanUserObject(read(USER_KEY, {}));
    write(USER_KEY, u);
    try{ if(typeof user !== 'undefined' && user) Object.assign(user, u); }catch(e){}
    try{ if(window.user) Object.assign(window.user, u); }catch(e){}
    return u;
  }

  // Protege contra qualquer patch antigo que tente salvar essas duas molduras de volta.
  if(!localStorage.setItem.__dlinkyRemoveFakeFramesPatched){
    const originalSetItem = localStorage.setItem.bind(localStorage);
    const patched = function(key, value){
      try{
        if(key === USER_KEY){ value = JSON.stringify(cleanUserObject(JSON.parse(value || '{}'))); }
        if(key === CUSTOM_FRAMES_KEY || key === OLD_FRAMES_KEY){
          const arr = JSON.parse(value || '[]');
          if(Array.isArray(arr)) value = JSON.stringify(arr.filter(it => !isFakeFrame(it)));
        }
        if(key === VAULT_KEY){
          const vault = JSON.parse(value || '{}');
          if(vault && typeof vault === 'object'){
            Object.keys(vault).forEach(acc=>{
              if(Array.isArray(vault[acc]?.inventory)) vault[acc].inventory = vault[acc].inventory.filter(it => !isFakeFrame(it));
            });
            value = JSON.stringify(vault);
          }
        }
      }catch(e){}
      return originalSetItem(key, value);
    };
    patched.__dlinkyRemoveFakeFramesPatched = true;
    localStorage.setItem = patched;
  }

  const oldRenderInventory = window.renderInventory;
  window.renderInventory = function(){
    cleanEverything();
    const r = typeof oldRenderInventory === 'function' ? oldRenderInventory.apply(this, arguments) : undefined;
    cleanEverything();
    return r;
  };
  try{ renderInventory = window.renderInventory; }catch(e){}

  const oldRenderProfile = window.renderProfile;
  window.renderProfile = function(){
    cleanEverything();
    const r = typeof oldRenderProfile === 'function' ? oldRenderProfile.apply(this, arguments) : undefined;
    cleanEverything();
    return r;
  };
  try{ renderProfile = window.renderProfile; }catch(e){}

  document.addEventListener('DOMContentLoaded', () => { cleanEverything(); setTimeout(cleanEverything,150); setTimeout(cleanEverything,700); });
  window.addEventListener('hashchange', () => { cleanEverything(); setTimeout(cleanEverything,200); });
  document.addEventListener('click', () => setTimeout(cleanEverything,80), true);
  cleanEverything();
})();

/* =========================================================
   DLINKY FIX REAL — Ajustar moldura não some da prévia
   - Corrige somente a janela de Ajustar.
   - Intercepta o botão do inventário data-v3-adjust-inv.
   - Usa sempre a moldura real do item, não a imagem do avatar.
   - Não recria inventário, não remove loja, não mexe em outros itens.
   ========================================================= */
(function(){
  'use strict';
  if(window.__dlinkyFixAjustePreviewNaoSomeV2) return;
  window.__dlinkyFixAjustePreviewNaoSomeV2 = true;

  const $ = (s,r=document)=>r.querySelector(s);
  const USER_KEY = 'dlinkyUser';
  const norm = v => String(v||'').trim().replace(/^url\(["']?|["']?\)$/g,'').replace(/\\/g,'/').split('?')[0].toLowerCase();
  const isFrame = it => !!(it && (it.url || it.frameUrl || it.image || it.src || /moldura|frame/i.test(String(it.name||'')) || /frame|frames/i.test(String(it.type||it.kind||''))));
  const urlOf = it => String((it && (it.url || it.frameUrl || it.image || it.src || it.value)) || '').trim();
  const idOf = it => String((it && (it.id || it.frameId)) || ('frame_' + (norm(urlOf(it)) || String(it && it.name || 'moldura')).replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'').slice(-90)));
  const clean = a => {
    let s = Number(a && a.scale);
    if(!s) s = 1;
    if(s > 10) s = s / 100;
    return { x:Number(a&&a.x)||0, y:Number(a&&a.y)||0, scale:Math.max(.2, Math.min(3, s)), rotate:Number(a&&a.rotate)||0 };
  };
  const transform = a => { a=clean(a); return `translate(calc(-50% + ${a.x}px), calc(-50% + ${a.y}px)) scale(${a.scale}) rotate(${a.rotate}deg)`; };

  function getUser(){
    try{
      const data = JSON.parse(localStorage.getItem(USER_KEY)||'{}') || {};
      if(typeof window.user === 'object' && window.user) Object.assign(window.user, data);
      return (typeof window.user === 'object' && window.user) ? window.user : data;
    }catch(e){ return (typeof window.user === 'object' && window.user) ? window.user : {}; }
  }
  function saveUser(u){
    try{ localStorage.setItem(USER_KEY, JSON.stringify(u)); }catch(e){}
    try{ if(typeof window.user === 'object' && window.user) Object.assign(window.user, u); }catch(e){}
  }
  function frames(){
    const u = getUser();
    u.inventory = Array.isArray(u.inventory) ? u.inventory : [];
    return u.inventory.filter(isFrame).map((it,idx)=>({it,idx,id:idOf(it),url:urlOf(it)})).filter(x=>x.url);
  }
  function findFrame(ref){
    const list = frames();
    if(ref && /^\d+$/.test(String(ref)) && list.find(x=>String(x.idx)===String(ref))) return list.find(x=>String(x.idx)===String(ref));
    return list.find(x=>String(x.id)===String(ref) || norm(x.url)===norm(ref)) || list.find(x=>norm(x.url)===norm(getUser().frame || getUser().frameUrl)) || list[0];
  }
  function adjOf(f){
    const u=getUser(), it=f&&f.it; if(!it) return clean({});
    return clean((u.frameAdjustments&&u.frameAdjustments[idOf(it)]) || (u.frameAdjustments&&u.frameAdjustments[urlOf(it)]) || (u.frameAdjust&&u.frameAdjust[urlOf(it)]) || (u.frameAdjust&&u.frameAdjust[norm(urlOf(it))]) || {});
  }
  function setControls(a){
    a=clean(a);
    if($('#adjustX')) $('#adjustX').value = a.x;
    if($('#adjustY')) $('#adjustY').value = a.y;
    if($('#adjustScale')){
      $('#adjustScale').min = 20;
      $('#adjustScale').max = 300;
      $('#adjustScale').step = 1;
      $('#adjustScale').value = Math.round(a.scale * 100);
    }
    if($('#adjustRotate')) $('#adjustRotate').value = a.rotate;
  }
  function readControls(){
    return clean({
      x: $('#adjustX')?.value,
      y: $('#adjustY')?.value,
      scale: Number($('#adjustScale')?.value || 100) / 100,
      rotate: $('#adjustRotate')?.value
    });
  }
  function forcePreview(){
    const u=getUser();
    const f=findFrame(window.__dlinkyEditingFrameId || window.__dlinkyEditingFrameIdx || u.activeFrameId || u.frame || u.frameUrl);
    const box=$('#adjustPreview'), av=$('#adjustAvatar'), img=$('#adjustFrame') || $('#adjustFrameFinal');
    if(!box || !img || !f) return;
    box.style.setProperty('position','relative','important');
    box.style.setProperty('overflow','visible','important');
    box.style.setProperty('isolation','isolate','important');
    if(av){
      av.style.setProperty('display','block','important');
      av.style.setProperty('visibility','visible','important');
      av.style.setProperty('opacity','1','important');
      av.style.setProperty('position','absolute','important');
      av.style.setProperty('left','50%','important');
      av.style.setProperty('top','50%','important');
      av.style.setProperty('width','94px','important');
      av.style.setProperty('height','94px','important');
      av.style.setProperty('border-radius','50%','important');
      av.style.setProperty('background-size','cover','important');
      av.style.setProperty('background-position','center','important');
      av.style.setProperty('transform','translate(-50%,-50%)','important');
      av.style.setProperty('z-index','1','important');
      if(u.avatar) av.style.setProperty('background-image',`url("${u.avatar}")`,'important');
    }
    if(img.getAttribute('src') !== f.url) img.setAttribute('src', f.url);
    img.style.setProperty('display','block','important');
    img.style.setProperty('visibility','visible','important');
    img.style.setProperty('opacity','1','important');
    img.style.setProperty('position','absolute','important');
    img.style.setProperty('left','50%','important');
    img.style.setProperty('top','50%','important');
    img.style.setProperty('width','150px','important');
    img.style.setProperty('height','150px','important');
    img.style.setProperty('max-width','none','important');
    img.style.setProperty('max-height','none','important');
    img.style.setProperty('object-fit','contain','important');
    img.style.setProperty('object-position','center','important');
    img.style.setProperty('z-index','5','important');
    img.style.setProperty('pointer-events','none','important');
    img.style.setProperty('transform-origin','center center','important');
    img.style.setProperty('transform', transform(readControls()), 'important');
  }
  function openFixed(ref){
    const f=findFrame(ref); if(!f) return;
    const u=getUser();
    window.__dlinkyEditingFrameId = f.id;
    window.__dlinkyEditingFrameIdx = f.idx;
    u.activeFrameId = f.id;
    u.frame = f.url;
    u.frameUrl = f.url;
    u.frameName = f.it.name || 'Moldura';
    u.decoration = 'none';
    saveUser(u);
    const modal=$('#frameAdjustModal'); if(!modal) return;
    modal.classList.add('show');
    modal.style.setProperty('display','flex','important');
    setControls(adjOf(f));
    forcePreview();
    setTimeout(forcePreview, 30);
    setTimeout(forcePreview, 120);
  }
  function saveFixed(){
    const f=findFrame(window.__dlinkyEditingFrameId || window.__dlinkyEditingFrameIdx); if(!f) return;
    const u=getUser(), a=readControls();
    u.frameAdjustments = (u.frameAdjustments && typeof u.frameAdjustments==='object') ? u.frameAdjustments : {};
    u.frameAdjust = (u.frameAdjust && typeof u.frameAdjust==='object') ? u.frameAdjust : {};
    u.frameAdjustments[f.id] = a;
    u.frameAdjustments[f.url] = a;
    u.frameAdjust[f.url] = a;
    u.frameAdjust[norm(f.url)] = a;
    u.activeFrameId = f.id;
    u.frame = f.url;
    u.frameUrl = f.url;
    u.frameName = f.it.name || 'Moldura';
    u.decoration = 'none';
    saveUser(u);
    const m=$('#frameAdjustModal'); if(m){ m.classList.remove('show'); m.style.setProperty('display','none','important'); }
    try{ if(typeof window.renderInventory==='function') window.renderInventory(); }catch(e){}
    try{ if(typeof window.renderProfile==='function') window.renderProfile(); }catch(e){}
    if(typeof toast === 'function') toast('Ajuste salvo e aplicado!');
  }

  document.addEventListener('click', function(e){
    const btn = e.target.closest?.('[data-v3-adjust-inv],[data-v3-adjust-frame],[data-v6-adjust-frame],[data-v7-adjust-frame],[data-v8-adjust-frame],[data-frame-vault-adjust],[data-dlinky-adjust-frame]');
    if(btn){
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      openFixed(btn.dataset.v3AdjustInv || btn.dataset.v3AdjustFrame || btn.dataset.v6AdjustFrame || btn.dataset.v7AdjustFrame || btn.dataset.v8AdjustFrame || btn.dataset.frameVaultAdjust || btn.dataset.dlinkyAdjustFrame);
      return;
    }
    if(e.target.closest?.('#saveFrameAdjust')){ e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); saveFixed(); return; }
    if(e.target.closest?.('#resetFrameAdjust')){ e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); setControls({x:0,y:0,scale:1,rotate:0}); forcePreview(); return; }
  }, true);
  document.addEventListener('input', function(e){
    if(['adjustX','adjustY','adjustScale','adjustRotate'].includes(e.target?.id)) forcePreview();
  }, true);
})();

/* =========================================================
   DLINKY FIX REAL — INVENTÁRIO OBEDECE SOMENTE MOLDURAS CADASTRADAS
   - Se a moldura não existir no Admin/Loja (dlinkyCustomFrames), ela sai do inventário.
   - Remove também activeFrame/frameUrl para não continuar aplicando moldura fantasma.
   - Não cria moldura fake e não adiciona item novo.
   ========================================================= */
(function(){
  'use strict';
  if(window.__dlinkySomenteMoldurasCadastradasV1) return;
  window.__dlinkySomenteMoldurasCadastradasV1 = true;

  const USER_KEY = 'dlinkyUser';
  const CUSTOM_KEY = 'dlinkyCustomFrames';
  const OLD_KEY = 'dlinkyFrames';
  const VAULT_KEY = 'dlinkyFrameVault';
  const LAST_KEY = 'dlinkyLastGoodFrameUrl';

  function norm(v){
    return String(v||'')
      .trim()
      .replace(/^url\(["']?|["']?\)$/g,'')
      .replace(/\\/g,'/')
      .split('?')[0]
      .toLowerCase();
  }
  function read(k,fb){ try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(fb));}catch(e){return fb;} }
  function rawWrite(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
  function urlOf(it){ return String((it && (it.url || it.frameUrl || it.image || it.src || it.value || it.frame)) || '').trim(); }
  function isImgUrl(v){ v=norm(v); return v.startsWith('data:image/') || /\.(png|apng|gif|webp|jpg|jpeg|svg)$/.test(v); }
  function isFrameItem(it){
    if(!it) return false;
    const txt = String([it.type,it.kind,it.name,it.nome,it.title,it.id,it.frameId].filter(Boolean).join(' ')).toLowerCase();
    return txt.includes('frame') || txt.includes('moldura') || isImgUrl(urlOf(it));
  }
  function registeredFrames(){
    const arr = read(CUSTOM_KEY, []);
    if(!Array.isArray(arr)) return [];
    const seen = new Set();
    return arr.filter(f=>{
      const u = norm(urlOf(f));
      if(!u || seen.has(u)) return false;
      seen.add(u);
      return true;
    });
  }
  function allowedUrls(){ return new Set(registeredFrames().map(f=>norm(urlOf(f))).filter(Boolean)); }
  function filterInventory(inv, allowed){
    if(!Array.isArray(inv)) return [];
    return inv.filter(it=>{
      if(!isFrameItem(it)) return true;
      const u = norm(urlOf(it));
      return !!u && allowed.has(u);
    });
  }
  function cleanUser(u){
    if(!u || typeof u !== 'object') u = {};
    const allowed = allowedUrls();

    // A loja/admin é a fonte oficial. Se não está no Admin, não fica salvo como catálogo do usuário.
    u.customFrames = registeredFrames();

    u.inventory = filterInventory(u.inventory, allowed);

    const activeUrl = norm(u.frameUrl || u.frame);
    const activeStillExists = activeUrl && allowed.has(activeUrl) && u.inventory.some(it=>isFrameItem(it) && norm(urlOf(it))===activeUrl);
    if(!activeStillExists){
      u.frame = '';
      u.frameUrl = '';
      u.frameName = '';
      u.activeFrameId = '';
      u.decoration = u.decoration === 'none' ? '' : (u.decoration || '');
    }
    return u;
  }
  function cleanVault(){
    const allowed = allowedUrls();
    const vault = read(VAULT_KEY, null);
    if(!vault || typeof vault !== 'object') return;
    let changed = false;
    Object.keys(vault).forEach(k=>{
      const v = vault[k];
      if(!v || typeof v !== 'object') return;
      const before = Array.isArray(v.inventory) ? v.inventory.length : 0;
      v.customFrames = registeredFrames();
      v.inventory = filterInventory(v.inventory, allowed);
      const activeUrl = norm(v.frameUrl || v.frame);
      const ok = activeUrl && allowed.has(activeUrl) && v.inventory.some(it=>isFrameItem(it) && norm(urlOf(it))===activeUrl);
      if(!ok){ v.frame=''; v.frameUrl=''; v.frameName=''; v.activeFrameId=''; }
      if(before !== v.inventory.length || !ok) changed = true;
    });
    if(changed) rawWrite(VAULT_KEY, vault);
  }
  function cleanAll(){
    try{ localStorage.removeItem(LAST_KEY); }catch(e){}
    const registered = registeredFrames();
    // dlinkyFrames antigo não pode guardar moldura que já foi apagada no Admin.
    rawWrite(OLD_KEY, registered);
    cleanVault();
    const u = cleanUser(read(USER_KEY, {}));
    rawWrite(USER_KEY, u);
    try{ if(typeof user !== 'undefined' && user && typeof user === 'object'){ Object.keys(user).forEach(k=>delete user[k]); Object.assign(user,u); } }catch(e){}
    try{ if(window.user && typeof window.user === 'object'){ Object.keys(window.user).forEach(k=>delete window.user[k]); Object.assign(window.user,u); } }catch(e){}
    return u;
  }

  // Impede qualquer código antigo de salvar de volta moldura não cadastrada.
  if(!localStorage.setItem.__dlinkyStrictRegisteredFrames){
    const original = localStorage.setItem.bind(localStorage);
    const patched = function(key, value){
      try{
        if(key === OLD_KEY){ value = JSON.stringify(registeredFrames()); }
        if(key === USER_KEY){ value = JSON.stringify(cleanUser(JSON.parse(value || '{}'))); }
        if(key === VAULT_KEY){
          const vault = JSON.parse(value || '{}');
          const allowed = allowedUrls();
          if(vault && typeof vault === 'object'){
            Object.keys(vault).forEach(k=>{
              if(vault[k] && typeof vault[k] === 'object'){
                vault[k].customFrames = registeredFrames();
                vault[k].inventory = filterInventory(vault[k].inventory, allowed);
                const activeUrl = norm(vault[k].frameUrl || vault[k].frame);
                const ok = activeUrl && allowed.has(activeUrl) && vault[k].inventory.some(it=>isFrameItem(it) && norm(urlOf(it))===activeUrl);
                if(!ok){ vault[k].frame=''; vault[k].frameUrl=''; vault[k].frameName=''; vault[k].activeFrameId=''; }
              }
            });
          }
          value = JSON.stringify(vault);
        }
      }catch(e){}
      return original(key, value);
    };
    patched.__dlinkyStrictRegisteredFrames = true;
    localStorage.setItem = patched;
  }

  function wrap(name){
    const old = window[name];
    if(typeof old === 'function' && !old.__dlinkyStrictRegisteredFrames){
      const fn = function(){ cleanAll(); const r = old.apply(this, arguments); cleanAll(); return r; };
      fn.__dlinkyStrictRegisteredFrames = true;
      window[name] = fn;
      try{ eval(name + ' = window[name]'); }catch(e){}
    }
  }
  ['renderInventory','renderProfile','renderShop','renderAdminList','renderDash'].forEach(wrap);

  document.addEventListener('click', function(){ setTimeout(cleanAll, 30); setTimeout(cleanAll, 250); }, true);
  document.addEventListener('DOMContentLoaded', function(){ cleanAll(); setTimeout(cleanAll,100); setTimeout(cleanAll,800); });
  window.addEventListener('hashchange', function(){ cleanAll(); setTimeout(cleanAll,200); });
  cleanAll();
})();

/* =========================================================
   DLINKY PATCH LIMPO — somente Ajustar Moldura
   Remove a sobreposição dos ajustes antigos no modal e mantém
   o ajuste salvo funcionando no perfil/inventário.
   ========================================================= */
(function(){
  const q=(s,r=document)=>r.querySelector(s);
  const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const norm=u=>String(u||'').trim().replace(/^url\(["']?|["']?\)$/g,'').replace(/\\/g,'/').split('?')[0].toLowerCase();
  const clean=a=>({x:Number(a&&a.x)||0,y:Number(a&&a.y)||0,scale:Math.max(.2,Number(a&&a.scale)||1),rotate:Number(a&&a.rotate)||0});
  const transform=a=>{a=clean(a);return `translate(calc(-50% + ${a.x}px),calc(-50% + ${a.y}px)) scale(${a.scale}) rotate(${a.rotate}deg)`};
  const isFrame=it=>!!(it&&(it.type==='frame'||it.kind==='frame'||/moldura|frame/i.test(String(it.name||''))||/\.(gif|png|webp|apng|svg)(\?|#|$)/i.test(String(it.url||it.src||it.image||''))));
  function registered(){try{return JSON.parse(localStorage.getItem('dlinkyCustomFrames')||'[]')||[]}catch(e){return []}}
  function allowed(){return new Set(registered().map(f=>norm(f.url||f.image||f.src)).filter(Boolean))}
  function save(){try{localStorage.setItem('dlinkyUser',JSON.stringify(user));}catch(e){}}
  function idFor(it){
    if(it.id)return String(it.id);
    const raw=(norm(it.url||it.image||it.src)||String(it.name||'moldura')).replace(/[^a-z0-9_-]+/g,'_').replace(/^_+|_+$/g,'');
    return 'frame_'+(raw||'item').slice(-90);
  }
  function ensure(){
    user.inventory=Array.isArray(user.inventory)?user.inventory:[];
    user.frameAdjustments=user.frameAdjustments||{}; user.frameAdjust=user.frameAdjust||{};
    const allow=allowed(); const seen=new Set();
    user.inventory=user.inventory.filter(it=>{
      if(!it)return false;
      if(isFrame(it)){
        it.type='frame'; it.url=it.url||it.image||it.src||''; it.id=idFor(it);
        const u=norm(it.url); if(allow.size && !allow.has(u))return false;
        const k='frame|'+(u||it.id); if(seen.has(k))return false; seen.add(k);
        const old=user.frameAdjustments[it.id]||user.frameAdjustments[it.url]||user.frameAdjustments[norm(it.url)]||user.frameAdjust[it.url]||user.frameAdjust[norm(it.url)];
        if(old)user.frameAdjustments[it.id]=clean(old);
      }
      return true;
    });
    const active=user.inventory.find(it=>isFrame(it)&&(it.id===user.activeFrameId||norm(it.url)===norm(user.frame)));
    if(active){user.activeFrameId=active.id;user.frame=active.url;user.decoration='none';}
    else if(user.frame){user.frame='';user.activeFrameId='';}
    save();
  }
  function frameById(id){ensure();return user.inventory.find(it=>isFrame(it)&&(it.id===id||norm(it.url)===norm(id)))||null}
  function activeFrame(){ensure();return frameById(user.activeFrameId)||frameById(user.frame)}
  function adjFor(it){return clean(user.frameAdjustments?.[it?.id]||user.frameAdjust?.[it?.url]||user.frameAdjust?.[norm(it?.url)]||{})}
  function setAdj(it,a){a=clean(a);user.frameAdjustments[it.id]=a;user.frameAdjust[it.url]=a;user.frameAdjust[norm(it.url)]=a;}
  function readControls(){return clean({x:q('#adjustX')?.value,y:q('#adjustY')?.value,scale:q('#adjustScale')?.value,rotate:q('#adjustRotate')?.value})}
  function fillControls(a){a=clean(a); if(q('#adjustX'))q('#adjustX').value=a.x; if(q('#adjustY'))q('#adjustY').value=a.y; if(q('#adjustScale'))q('#adjustScale').value=a.scale; if(q('#adjustRotate'))q('#adjustRotate').value=a.rotate; updateModal();}
  function updateModal(){const img=q('#adjustFrameFinal'); if(img)img.style.transform=transform(readControls());}
  function stage(it,a){return `<div class="dlinky-final-stage"><span class="dlinky-final-avatar" style="background-image:url('${esc(user.avatar||'')}')"></span><img class="dlinky-final-frame" src="${esc(it.url||'')}" style="transform:${transform(a)}" alt="${esc(it.name||'moldura')}"></div>`}
  window.renderInventory=function(){
    ensure(); const grid=q('#inventoryGrid'); if(!grid)return;
    const frames=user.inventory.filter(isFrame), others=user.inventory.filter(it=>!isFrame(it));
    grid.innerHTML=[...frames.map(it=>{const active=it.id===user.activeFrameId||norm(it.url)===norm(user.frame);return `<div class="asset-card inv-item-card ${active?'is-active':''}"><div class="asset-preview shop-preview">${stage(it,adjFor(it))}</div><div class="asset-body"><b>${esc(it.name||'Moldura')}</b><small>${esc(it.duration||'Permanente')}</small><div class="inv-actions-row"><button class="btn primary small" data-clean-use-frame="${esc(it.id)}">${active?'Usando':'Usar'}</button><button class="btn primary small" data-clean-adjust-frame="${esc(it.id)}">Ajustar</button></div></div></div>`}),...others.map(it=>`<div class="asset-card inv-item-card"><div class="asset-preview shop-preview">✦</div><div class="asset-body"><b>${esc(it.name||'Item')}</b><small>${esc(it.duration||it.type||'item')}</small><button class="btn primary small">Usar</button></div></div>`)].join('')||'<p>Você ainda não possui itens no inventário.</p>';
  };
  window.useFrame=function(id){const it=frameById(id);if(!it)return;user.activeFrameId=it.id;user.frame=it.url;user.decoration='none';if(!user.frameAdjustments[it.id])setAdj(it,adjFor(it));save();window.renderInventory();applyProfile();if(typeof toast==='function')toast('Moldura aplicada!');};
  window.openFrameAdjustModal=function(id){
    const it=frameById(id); if(!it)return; window.__dlinkyEditingFrameId=it.id;
    let m=q('#frameAdjustModal'); if(!m){m=document.createElement('div');m.id='frameAdjustModal';document.body.appendChild(m);}
    m.className='modal frame-adjust-modal dlinky-clean-adjust show'; m.removeAttribute('style');
    m.innerHTML=`<div class="adjust-card"><button class="adjust-close" id="closeFrameAdjust" type="button">×</button><h2>Ajustar moldura</h2><p>Arraste a moldura ou use os controles para encaixar certinho na foto.</p><div class="adjust-preview" id="adjustPreview"><span id="adjustAvatar"></span><img id="adjustFrameFinal" alt="moldura"></div><div class="adjust-grid"><label>Horizontal<input id="adjustX" type="range" min="-80" max="80" step="1"></label><label>Vertical<input id="adjustY" type="range" min="-80" max="80" step="1"></label><label>Tamanho<input id="adjustScale" type="range" min="0.2" max="2.5" step="0.01"></label><label>Girar<input id="adjustRotate" type="range" min="-180" max="180" step="1"></label></div><div class="adjust-actions"><button class="btn dark" id="resetFrameAdjust" type="button">Resetar</button><button class="btn primary" id="saveFrameAdjust" type="button">Salvar ajuste</button></div></div>`;
    q('#adjustAvatar',m).style.backgroundImage=user.avatar?`url("${user.avatar}")`:'';
    q('#adjustFrameFinal',m).src=it.url;
    user.activeFrameId=it.id; user.frame=it.url; user.decoration='none'; save(); fillControls(adjFor(it));
  };
  window.saveFrameAdjustment=function(){const it=frameById(window.__dlinkyEditingFrameId||user.activeFrameId);if(!it)return;setAdj(it,readControls());user.activeFrameId=it.id;user.frame=it.url;user.decoration='none';save();const m=q('#frameAdjustModal');if(m){m.classList.remove('show');m.style.setProperty('display','none','important');}window.renderInventory();applyProfile();if(typeof toast==='function')toast('Ajuste salvo!');};
  function closeModal(){const m=q('#frameAdjustModal');if(m){m.classList.remove('show');m.style.setProperty('display','none','important');}}
  function applyProfile(){
    ensure(); const deco=q('#avatarDecoration'); if(!deco)return; const it=activeFrame();
    deco.className='avatar-decoration dlinky-final-only';
    Array.from(deco.querySelectorAll(':scope > .big-avatar,:scope > #profileFrame,:scope > .decor-css,#dlinkyV4ProfileStage')).forEach(el=>el.style.setProperty('display','none','important'));
    let st=q('#dlinkyFinalProfileStage',deco);
    if(!it||!it.url){if(st)st.remove();return;}
    if(!st){st=document.createElement('div');st.id='dlinkyFinalProfileStage';st.className='dlinky-final-stage';deco.appendChild(st);}
    let av=q('.dlinky-final-avatar',st); if(!av){av=document.createElement('span');av.className='dlinky-final-avatar';st.appendChild(av);} 
    let img=q('.dlinky-final-frame',st); if(!img){img=document.createElement('img');img.className='dlinky-final-frame';img.alt='moldura';st.appendChild(img);} 
    av.style.backgroundImage=user.avatar?`url("${user.avatar}")`:''; img.src=it.url; img.style.transform=transform(adjFor(it));
  }
  const oldProfile=window.renderProfile; window.renderProfile=function(){if(oldProfile)oldProfile();[0,120,450,1000].forEach(t=>setTimeout(applyProfile,t));};
  const oldDash=window.renderDash; window.renderDash=function(){if(oldDash)oldDash();setTimeout(()=>window.renderInventory(),0);};
  const oldTab=window.openTab; window.openTab=function(id){if(oldTab)oldTab(id);if(id==='inventory')setTimeout(()=>window.renderInventory(),0);};
  document.addEventListener('click',function(e){
    const use=e.target.closest?.('[data-clean-use-frame]'); if(use){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();window.useFrame(use.dataset.cleanUseFrame);return;}
    const adj=e.target.closest?.('[data-clean-adjust-frame]'); if(adj){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();window.openFrameAdjustModal(adj.dataset.cleanAdjustFrame);return;}
    if(e.target.closest?.('#saveFrameAdjust')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();window.saveFrameAdjustment();return;}
    if(e.target.closest?.('#resetFrameAdjust')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();fillControls({x:0,y:0,scale:1,rotate:0});return;}
    if(e.target.closest?.('#closeFrameAdjust')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();closeModal();return;}
  },true);
  document.addEventListener('input',e=>{if(['adjustX','adjustY','adjustScale','adjustRotate'].includes(e.target?.id))updateModal();},true);
  let drag=false,sx=0,sy=0,ox=0,oy=0;
  document.addEventListener('pointerdown',e=>{const box=e.target.closest?.('#frameAdjustModal.dlinky-clean-adjust #adjustPreview'); if(!box)return; e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); drag=true; sx=e.clientX; sy=e.clientY; ox=Number(q('#adjustX')?.value||0); oy=Number(q('#adjustY')?.value||0);},true);
  document.addEventListener('pointermove',e=>{if(!drag)return; e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); if(q('#adjustX'))q('#adjustX').value=Math.max(-80,Math.min(80,ox+e.clientX-sx)); if(q('#adjustY'))q('#adjustY').value=Math.max(-80,Math.min(80,oy+e.clientY-sy)); updateModal();},true);
  document.addEventListener('pointerup',e=>{if(drag){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();} drag=false;},true);
  setTimeout(()=>{ensure();window.renderInventory();applyProfile();},400);
})();


/* =========================================================
   DLINKY GLOBAL FIREBASE — MOLDURAS/SELOS/PRESENTES ONLINE
   Adicionado sem remover nada do código original.
   Faz o Admin salvar catálogo global no Firestore para aparecer para todos.
   ========================================================= */
(function(){
  'use strict';
  if(window.__DLINKY_GLOBAL_FIREBASE_CATALOG__) return;
  window.__DLINKY_GLOBAL_FIREBASE_CATALOG__ = true;

  const firebaseConfig = {
    apiKey: "AIzaSyCPmjhOSXXNaVXXXdrAK9Y77fqxCoLv7Wo",
    authDomain: "dlinky.firebaseapp.com",
    projectId: "dlinky",
    storageBucket: "dlinky.firebasestorage.app",
    messagingSenderId: "856690547155",
    appId: "1:856690547155:web:6444b8a4be23ee5a6d7726"
  };

  const KEYS = {
    frames: 'dlinkyCustomFrames',
    framesOld: 'dlinkyFrames',
    selos: 'dlinkyCleanAdminSelosCatalog',
    gifts: 'dlinkyAdminGifts',
    grants: 'dlinkyAdminGrants'
  };

  let syncingFromCloud = false;
  let saveTimer = null;

  function log(){ try{ console.log.apply(console, ['[Dlinky Global]'].concat([].slice.call(arguments))); }catch(e){} }
  function readJSON(key, fallback){ try{ const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }catch(e){ return fallback; } }
  function writeJSON(key, value){ try{ localStorage.setItem(key, JSON.stringify(value)); }catch(e){} }
  function arr(v){ return Array.isArray(v) ? v : []; }
  function cleanUrl(v){ return String(v || '').trim(); }
  function hash(v){ let h=0; String(v||'').split('').forEach(ch=>{ h=((h<<5)-h+ch.charCodeAt(0))|0; }); return Math.abs(h).toString(36); }
  function cleanSlug(v){ return String(v||'item').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'').slice(0,60) || 'item'; }

  function notify(msg){
    try{ if(typeof toast === 'function') return toast(msg); }catch(e){}
    log(msg);
  }

  function normalizeFrame(f){
    if(!f) return null;
    const url = cleanUrl(f.url || f.frameUrl || f.image || f.src);
    if(!url) return null;
    const name = String(f.name || f.title || 'Moldura').trim() || 'Moldura';
    const price = Number(String(f.price || f.basePrice || (f.prices && f.prices['3 dias']) || 20).replace(/[^0-9.,-]/g,'').replace(',','.')) || 20;
    const prices = Object.assign({}, f.prices || {});
    prices['3 dias'] = Number(prices['3 dias'] || price) || price;
    prices['7 dias'] = Number(prices['7 dias'] || Math.round(price * 1.5));
    prices['15 dias'] = Number(prices['15 dias'] || Math.round(price * 2));
    prices['Permanente'] = Number(prices['Permanente'] || Math.round(price * 3));
    return {
      id: String(f.id || 'frame_' + hash(url)),
      name,
      desc: String(f.desc || f.description || '').trim(),
      price,
      prices,
      url,
      type: 'frame',
      updatedAtLocal: f.updatedAtLocal || Date.now()
    };
  }

  function normalizeSelo(s){
    if(!s) return null;
    const url = cleanUrl(s.url || s.img || s.image || s.src);
    if(!url) return null;
    const name = String(s.name || s.nome || 'Selo').trim() || 'Selo';
    return {
      id: String(s.id || s.seloId || 'selo_' + cleanSlug(name) + '_' + hash(url)),
      name,
      desc: String(s.desc || s.description || '').trim(),
      price: Number(s.price || s.preco || 120) || 120,
      url,
      type: 'selo',
      size: Number(s.size || s.tamanho || 32) || 32,
      updatedAtLocal: s.updatedAtLocal || Date.now()
    };
  }

  function uniqueByUrl(list, normalizer){
    const map = new Map();
    arr(list).forEach(item=>{
      const clean = normalizer(item);
      if(!clean) return;
      map.set(clean.url.toLowerCase(), clean);
    });
    return Array.from(map.values());
  }

  function getLocalCatalogs(){
    const frames = uniqueByUrl([
      ...arr(readJSON(KEYS.frames, [])),
      ...arr(readJSON(KEYS.framesOld, []))
    ], normalizeFrame);

    const selos = uniqueByUrl(readJSON(KEYS.selos, []), normalizeSelo);
    const gifts = arr(readJSON(KEYS.gifts, []));
    const grants = arr(readJSON(KEYS.grants, []));

    return { frames, selos, gifts, grants };
  }

  function setLocalCatalogs(data){
    syncingFromCloud = true;
    try{
      const frames = uniqueByUrl(data && data.frames, normalizeFrame);
      const selos = uniqueByUrl(data && data.selos, normalizeSelo);
      const gifts = arr(data && data.gifts);
      const grants = arr(data && data.grants);

      writeJSON(KEYS.frames, frames);
      writeJSON(KEYS.framesOld, frames);
      writeJSON(KEYS.selos, selos);
      writeJSON(KEYS.gifts, gifts);
      writeJSON(KEYS.grants, grants);
    }finally{
      setTimeout(()=>{ syncingFromCloud = false; }, 120);
    }

    refreshScreens();
  }

  function refreshScreens(){
    setTimeout(()=>{
      try{ if(typeof renderAdminList === 'function') renderAdminList(); }catch(e){}
      try{ if(typeof renderAdminSelos === 'function') renderAdminSelos(); }catch(e){}
      try{ if(typeof renderShop === 'function') renderShop(); }catch(e){}
      try{ if(typeof renderInventory === 'function') renderInventory(); }catch(e){}
      try{ if(typeof renderDash === 'function') renderDash(); }catch(e){}
    }, 80);
  }

  function readyFirebase(){
    return !!(window.firebase && firebase.apps && firebase.firestore);
  }

  function initFirebase(){
    if(!readyFirebase()) return false;
    try{ if(!firebase.apps.length) firebase.initializeApp(firebaseConfig); }catch(e){}
    return true;
  }

  function catalogRef(){
    if(!initFirebase()) return null;
    return firebase.firestore().collection('dlinky_global').doc('catalogs');
  }

  async function uploadCatalogNow(reason){
    if(syncingFromCloud) return;
    const ref = catalogRef();
    if(!ref) return;
    const data = getLocalCatalogs();
    try{
      await ref.set(Object.assign({}, data, {
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedBy: (firebase.auth && firebase.auth().currentUser && firebase.auth().currentUser.email) || 'local',
        reason: reason || 'local-change'
      }), { merge: true });
      log('catálogo salvo online');
    }catch(e){
      console.warn('[Dlinky Global] erro ao salvar online:', e);
    }
  }

  function scheduleUpload(reason){
    if(syncingFromCloud) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(()=>uploadCatalogNow(reason), 650);
  }

  function patchLocalStorage(){
    if(window.__DLINKY_GLOBAL_FIREBASE_STORAGE_PATCH__) return;
    window.__DLINKY_GLOBAL_FIREBASE_STORAGE_PATCH__ = true;
    const originalSetItem = localStorage.setItem.bind(localStorage);
    const originalRemoveItem = localStorage.removeItem.bind(localStorage);

    localStorage.setItem = function(key, value){
      const result = originalSetItem(key, value);
      if(!syncingFromCloud && Object.values(KEYS).includes(key)){
        scheduleUpload('set-' + key);
      }
      return result;
    };

    localStorage.removeItem = function(key){
      const result = originalRemoveItem(key);
      if(!syncingFromCloud && Object.values(KEYS).includes(key)){
        scheduleUpload('remove-' + key);
      }
      return result;
    };
  }

  function startSnapshot(){
    const ref = catalogRef();
    if(!ref) return false;

    try{
      ref.onSnapshot(async snap=>{
        if(snap.exists){
          setLocalCatalogs(snap.data() || {});
          log('catálogo carregado online');
        }else{
          await uploadCatalogNow('first-create');
        }
      }, err=>console.warn('[Dlinky Global] snapshot erro:', err));
      return true;
    }catch(e){
      console.warn('[Dlinky Global] snapshot falhou:', e);
      return false;
    }
  }

  function boot(){
    patchLocalStorage();

    let tries = 0;
    const timer = setInterval(()=>{
      tries++;
      if(startSnapshot()){
        clearInterval(timer);
        setTimeout(()=>uploadCatalogNow('boot-sync'), 1200);
      }
      if(tries > 30){
        clearInterval(timer);
        console.warn('[Dlinky Global] Firebase não iniciou. Verifique se os scripts firebase estão no index.html.');
      }
    }, 500);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

})();

/* ===== DLINKY FIX FINAL — salvar nome livre + música sem apagar/bugar ===== */
(function(){
  if(window.__dlinkyFixNomeLivreMusica) return;
  window.__dlinkyFixNomeLivreMusica = true;

  const USER_KEY = 'dlinkyUser';

  function q(s,r=document){ return r.querySelector(s); }
  function readUser(){
    try{return JSON.parse(localStorage.getItem(USER_KEY)||'{}')}catch(e){return {}}
  }
  function cleanSlugSafe(v){
    return String(v||'usuario').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9_-]/g,'').slice(0,30)||'usuario';
  }
  function writeUser(u){
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    try{
      if(typeof user !== 'undefined' && user){
        Object.keys(user).forEach(k=>delete user[k]);
        Object.assign(user,u);
      }
    }catch(e){}
    try{
      if(window.user){
        Object.keys(window.user).forEach(k=>delete window.user[k]);
        Object.assign(window.user,u);
      }
    }catch(e){}
  }
  function currentUid(){
    try{return window.firebase && firebase.auth && firebase.auth().currentUser && firebase.auth().currentUser.uid}catch(e){return null}
  }
  async function saveOnline(u){
    try{
      if(!window.firebase || !firebase.firestore || !currentUid()) return;
      const uid=currentUid();
      const payload={...u,uid,email:(firebase.auth().currentUser.email||u.email||'').toLowerCase().trim(),updatedAt:firebase.firestore.FieldValue.serverTimestamp()};
      await firebase.firestore().collection('users').doc(uid).set(payload,{merge:true});
      if(payload.slug){
        await firebase.firestore().collection('profiles').doc(payload.slug).set({
          uid:payload.uid||uid,
          name:payload.name||'Usuário',
          slug:payload.slug,
          email:payload.email||'',
          bio:payload.bio||'',
          avatar:payload.avatar||'',
          banner:payload.banner||'',
          bg:payload.bg||'',
          video:payload.video||'',
          frame:payload.frame||'',
          music:payload.music||'',
          welcome:payload.welcome||'',
          color:payload.color||'#a855f7',
          particles:payload.particles!==false,
          particleType:payload.particleType||'snow',
          verified:!!payload.verified,
          tags:Array.isArray(payload.tags)?payload.tags:[],
          links:Array.isArray(payload.links)?payload.links:[],
          socials:Array.isArray(payload.socials)?payload.socials:[],
          embeds:Array.isArray(payload.embeds)?payload.embeds:[],
          decoration:payload.decoration||'',
          updatedAt:firebase.firestore.FieldValue.serverTimestamp()
        },{merge:true});
      }
    }catch(err){console.warn('Dlinky salvar conta Firebase:',err)}
  }
  function saveAccountManual(ev){
    const btn = ev && ev.target && ev.target.closest && ev.target.closest('#saveAccount');
    if(!btn) return;
    ev.preventDefault();
    ev.stopPropagation();
    ev.stopImmediatePropagation();

    const old=readUser();
    const name=(q('#cfgName')?.value||'').trim() || old.name || 'Usuário';
    const slug=cleanSlugSafe(q('#cfgSlug')?.value || old.slug || name);
    const bio=q('#cfgBio')?.value ?? old.bio ?? '';
    const music=(q('#cfgMusic')?.value||'').trim();
    const welcome=(q('#cfgWelcome')?.value||'').trim() || 'Clique aqui';

    const merged={...old,name,slug,bio,music,welcome};
    writeUser(merged);
    window.__dlinkyManualAccountSaved={until:Date.now()+6000,data:merged};

    try{ if(typeof renderDash==='function') renderDash(); }catch(e){}
    try{ if(typeof toast==='function') toast('Salvo com sucesso!'); }catch(e){}

    saveOnline(merged);
    setTimeout(()=>{writeUser({...readUser(),...merged}); saveOnline({...readUser(),...merged});},800);
    setTimeout(()=>{writeUser({...readUser(),...merged}); saveOnline({...readUser(),...merged});},2200);
  }

  document.addEventListener('click', saveAccountManual, true);

  const oldRenderDash = window.renderDash || (typeof renderDash==='function'?renderDash:null);
  if(typeof oldRenderDash==='function' && !oldRenderDash.__nomeLivrePatch){
    const patched=function(){
      const r=oldRenderDash.apply(this,arguments);
      const recent=window.__dlinkyManualAccountSaved;
      if(recent && Date.now()<recent.until && recent.data){
        const d=recent.data;
        if(q('#cfgName') && document.activeElement!==q('#cfgName')) q('#cfgName').value=d.name||'';
        if(q('#cfgSlug') && document.activeElement!==q('#cfgSlug')) q('#cfgSlug').value=d.slug||'';
        if(q('#cfgBio') && document.activeElement!==q('#cfgBio')) q('#cfgBio').value=d.bio||'';
        if(q('#cfgMusic') && document.activeElement!==q('#cfgMusic')) q('#cfgMusic').value=d.music||'';
        if(q('#cfgWelcome') && document.activeElement!==q('#cfgWelcome')) q('#cfgWelcome').value=d.welcome||'Clique aqui';
      }
      return r;
    };
    patched.__nomeLivrePatch=true;
    window.renderDash=patched;
    try{renderDash=patched}catch(e){}
  }

  // Música: não recarrega o áudio se a URL não mudou e não deixa render apagar o src do nada.
  const oldRenderProfile = window.renderProfile || (typeof renderProfile==='function'?renderProfile:null);
  if(typeof oldRenderProfile==='function' && !oldRenderProfile.__musicPatch){
    const patchedProfile=function(){
      const beforeMusic=(readUser().music||'').trim();
      const audioBefore=q('#profileAudio');
      const oldSrc=audioBefore?audioBefore.getAttribute('src'):'';
      const r=oldRenderProfile.apply(this,arguments);
      const audio=q('#profileAudio');
      const music=(readUser().music||beforeMusic||'').trim();
      if(audio){
        if(music){
          if((audio.getAttribute('src')||'')!==music){
            audio.src=music;
            audio.load();
          }
        }else if(oldSrc){
          audio.removeAttribute('src');
        }
      }
      return r;
    };
    patchedProfile.__musicPatch=true;
    window.renderProfile=patchedProfile;
    try{renderProfile=patchedProfile}catch(e){}
  }
})();

/* ===== DLINKY FIX 18/05 — entrada do perfil sempre volta + nome/link livre + logo/HUD visíveis ===== */
(function(){
  if(window.__DLINKY_FIX_ENTRADA_LINK_LOGO_1805__) return;
  window.__DLINKY_FIX_ENTRADA_LINK_LOGO_1805__ = true;

  const USER_KEY = 'dlinkyUser';
  const PREF_KEY = 'dlinkyPreferredAccount';
  const q = (s,r=document)=>r.querySelector(s);
  const qa = (s,r=document)=>Array.from(r.querySelectorAll(s));

  function readJSON(key, fallback){ try{ const raw=localStorage.getItem(key); return raw?JSON.parse(raw):fallback; }catch(e){ return fallback; } }
  function writeJSON(key, value){ try{ localStorage.setItem(key, JSON.stringify(value)); }catch(e){} }
  function cleanSlug(v){ return String(v||'usuario').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9_-]/g,'').slice(0,30)||'usuario'; }
  function localUser(){ return readJSON(USER_KEY, {}); }
  function syncUser(u){
    writeJSON(USER_KEY,u);
    try{ if(typeof user!=='undefined' && user){ Object.keys(user).forEach(k=>delete user[k]); Object.assign(user,u); } }catch(e){}
    try{ if(window.user){ Object.keys(window.user).forEach(k=>delete window.user[k]); Object.assign(window.user,u); } }catch(e){}
  }
  function saveOnline(u){
    try{
      if(!window.firebase || !firebase.auth || !firebase.firestore || !firebase.auth().currentUser) return;
      const fb=firebase.auth().currentUser;
      const db=firebase.firestore();
      const data=Object.assign({},u,{uid:fb.uid,email:(fb.email||u.email||'').toLowerCase().trim(),updatedAt:firebase.firestore.FieldValue.serverTimestamp()});
      db.collection('users').doc(fb.uid).set(data,{merge:true});
      if(data.slug){
        db.collection('profiles').doc(data.slug).set({
          uid:fb.uid,name:data.name||'Usuário',slug:data.slug,email:data.email||'',bio:data.bio||'',avatar:data.avatar||'',banner:data.banner||'',bg:data.bg||'',video:data.video||'',frame:data.frame||'',music:data.music||'',welcome:data.welcome||'Clique aqui',color:data.color||'#a855f7',particleType:data.particleType||'snow',particles:data.particles!==false,verified:!!data.verified,links:Array.isArray(data.links)?data.links:[],socials:Array.isArray(data.socials)?data.socials:[],tags:Array.isArray(data.tags)?data.tags:[],embeds:Array.isArray(data.embeds)?data.embeds:[],decoration:data.decoration||'',updatedAt:firebase.firestore.FieldValue.serverTimestamp()
        },{merge:true});
      }
    }catch(e){ console.warn('Dlinky saveOnline final:',e); }
  }
  function applyPreferred(forceSave){
    const pref=readJSON(PREF_KEY,null);
    if(!pref) return null;
    const cur=localUser();
    const merged=Object.assign({},cur);
    let changed=false;
    if(pref.name && merged.name!==pref.name){ merged.name=pref.name; changed=true; }
    if(pref.slug && merged.slug!==pref.slug){ merged.slug=pref.slug; changed=true; }
    if(pref.bio!==undefined && merged.bio!==pref.bio){ merged.bio=pref.bio; changed=true; }
    if(pref.music!==undefined && merged.music!==pref.music){ merged.music=pref.music; changed=true; }
    if(pref.welcome && merged.welcome!==pref.welcome){ merged.welcome=pref.welcome; changed=true; }
    if(changed || forceSave){ syncUser(merged); saveOnline(merged); }
    return merged;
  }

  // Salvar conta: agora nome E link ficam exatamente do jeito que você digitar.
  document.addEventListener('click', function(ev){
    const btn=ev.target && ev.target.closest && ev.target.closest('#saveAccount');
    if(!btn) return;
    ev.preventDefault(); ev.stopPropagation(); ev.stopImmediatePropagation();
    const old=localUser();
    const name=(q('#cfgName')?.value||'').trim() || old.name || 'Usuário';
    const slug=cleanSlug(q('#cfgSlug')?.value || old.slug || name);
    const bio=q('#cfgBio')?.value ?? old.bio ?? '';
    const music=(q('#cfgMusic')?.value||'').trim();
    const welcome=(q('#cfgWelcome')?.value||'').trim() || 'Clique aqui';
    const merged=Object.assign({},old,{name,slug,bio,music,welcome});
    writeJSON(PREF_KEY,{name,slug,bio,music,welcome,updatedAt:Date.now()});
    syncUser(merged);
    try{ if(typeof renderDash==='function') renderDash(); }catch(e){}
    try{ if(typeof toast==='function') toast('Salvo com sucesso!'); }catch(e){}
    saveOnline(merged);
    setTimeout(()=>applyPreferred(true),700);
    setTimeout(()=>applyPreferred(true),2200);
    setTimeout(()=>applyPreferred(true),5000);
  }, true);

  // Se o Firebase tentar voltar para nome/link antigo do e-mail, força o que você salvou manualmente.
  const oldSetItem=localStorage.setItem.bind(localStorage);
  localStorage.setItem=function(key,value){
    const result=oldSetItem(key,value);
    if(key===USER_KEY){ setTimeout(()=>applyPreferred(false),30); }
    return result;
  };

  // Render do painel sem apagar campo enquanto digita, e mantendo nome/link preferidos.
  const oldRenderDash = window.renderDash || (typeof renderDash==='function'?renderDash:null);
  if(typeof oldRenderDash==='function'){
    const patchedDash=function(){
      applyPreferred(false);
      const r=oldRenderDash.apply(this,arguments);
      const pref=readJSON(PREF_KEY,null);
      if(pref){
        if(q('#cfgName') && document.activeElement!==q('#cfgName')) q('#cfgName').value=pref.name||'';
        if(q('#cfgSlug') && document.activeElement!==q('#cfgSlug')) q('#cfgSlug').value=pref.slug||'';
        if(q('#cfgBio') && document.activeElement!==q('#cfgBio')) q('#cfgBio').value=pref.bio||'';
        if(q('#cfgMusic') && document.activeElement!==q('#cfgMusic')) q('#cfgMusic').value=pref.music||'';
        if(q('#cfgWelcome') && document.activeElement!==q('#cfgWelcome')) q('#cfgWelcome').value=pref.welcome||'Clique aqui';
      }
      return r;
    };
    window.renderDash=patchedDash;
    try{ renderDash=patchedDash; }catch(e){}
  }

  function clearEntryMemory(){
    try{
      Object.keys(sessionStorage).forEach(k=>{ if(k.indexOf('dlinky_entry_ok_')===0) sessionStorage.removeItem(k); });
    }catch(e){}
    window.__dlinkyForceEntryOverlay=true;
  }
  function resetProfileMedia(){
    const a=q('#profileAudio'); if(a){ try{a.pause();a.currentTime=0;}catch(e){} }
  }

  // Ao clicar em Ver Perfil, sempre volta a tela "Clique aqui" para a música tocar de novo.
  document.addEventListener('click',function(e){
    if(e.target.closest('#viewProfile') || e.target.closest('#viewProfile2') || e.target.closest('[data-goto="profile"]')){
      clearEntryMemory(); resetProfileMedia();
    }
    if(e.target.closest('#backToDash')){
      clearEntryMemory(); resetProfileMedia();
    }
  },true);

  const oldRenderProfile = window.renderProfile || (typeof renderProfile==='function'?renderProfile:null);
  if(typeof oldRenderProfile==='function'){
    const patchedProfile=function(){
      applyPreferred(false);
      const entering=!!window.__dlinkyForceEntryOverlay;
      if(entering) clearEntryMemory();
      const r=oldRenderProfile.apply(this,arguments);
      const u=localUser();
      const overlay=q('#entryOverlay');
      const audio=q('#profileAudio');
      if(audio){
        const music=String(u.music||'').trim();
        if(music && (audio.getAttribute('src')||'')!==music){ audio.src=music; audio.load(); }
      }
      if(entering && overlay){
        overlay.classList.remove('hidden');
        resetProfileMedia();
      }
      if(q('#profileName')) q('#profileName').textContent=u.name||'Usuário';
      if(q('#profileSlug2')) q('#profileSlug2').textContent='@'+(u.slug||'usuario');
      return r;
    };
    window.renderProfile=patchedProfile;
    try{ renderProfile=patchedProfile; }catch(e){}
  }

  // Quando clica na tela inicial do perfil, libera entrada e toca música atual.
  document.addEventListener('click',function(e){
    if(e.target.closest('#entryOverlay')){
      window.__dlinkyForceEntryOverlay=false;
      const u=localUser();
      const a=q('#profileAudio');
      if(a && u.music){
        if((a.getAttribute('src')||'')!==u.music){ a.src=u.music; a.load(); }
        setTimeout(()=>a.play().catch(()=>{}),80);
      }
    }
  },true);

  // Garante logo/brand e HUD visíveis de novo.
  function injectVisualFix(){
    if(q('#dlinkyLogoHudVisualFix')) return;
    const st=document.createElement('style');
    st.id='dlinkyLogoHudVisualFix';
    st.textContent=`
      .topbar .brand,.brand{display:flex!important;align-items:center!important;gap:10px!important;visibility:visible!important;opacity:1!important;}
      .brand strong{display:inline!important;visibility:visible!important;opacity:1!important;}
      .brand-icon{display:grid!important;place-items:center!important;visibility:visible!important;opacity:1!important;}
      #dlinkyProfileHudPlayer,.dlinky-profile-hud-player,.madeby,#soundBtn{visibility:visible!important;opacity:1!important;}
      body.is-profile #dlinkyProfileHudPlayer, body.public-profile #dlinkyProfileHudPlayer{display:flex!important;}
      .profile-meta,.profile-links,.profile-socials{visibility:visible!important;opacity:1!important;}
    `;
    document.head.appendChild(st);
  }
  function ensureBrand(){
    qa('.brand').forEach(b=>{
      if(!b.querySelector('.brand-icon')) b.insertAdjacentHTML('afterbegin','<span class="brand-icon">D</span>');
      if(!b.querySelector('strong')) b.insertAdjacentHTML('beforeend','<strong>Dlinky</strong>');
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>{injectVisualFix();ensureBrand();applyPreferred(false);});
  else {injectVisualFix();ensureBrand();applyPreferred(false);}
  setInterval(()=>{applyPreferred(false); ensureBrand();},2500);
})();

/* ===== FIX FINAL: mostrar "Feito por Dlinky" no Ver Perfil sem mexer no resto ===== */
(function(){
  function q(s,r){return (r||document).querySelector(s)}
  function isProfile(){
    var h=location.hash||'';
    return h==='#/profile' || document.body.classList.contains('is-profile') || document.querySelector('#profile.page.active');
  }
  function ensureMadeBy(){
    var profile=q('#profile');
    if(!profile) return;
    var made=q('.madeby', profile) || q('.madeby');
    if(!made){
      made=document.createElement('div');
      made.className='madeby';
      made.textContent='💜 Feito por Dlinky';
      profile.insertBefore(made, profile.firstChild);
    }
    made.textContent=made.textContent.trim() || '💜 Feito por Dlinky';
    if(isProfile()){
      made.style.setProperty('display','block','important');
      made.style.setProperty('visibility','visible','important');
      made.style.setProperty('opacity','1','important');
    }
  }
  function injectStyle(){
    if(q('#dlinkyMadeByFinalFix')) return;
    var st=document.createElement('style');
    st.id='dlinkyMadeByFinalFix';
    st.textContent='body.is-profile .madeby,#profile.page.active .madeby{display:block!important;visibility:visible!important;opacity:1!important;position:fixed!important;right:18px!important;top:16px!important;z-index:999999!important;color:#fff!important;font-weight:800!important;text-shadow:0 0 12px rgba(168,85,247,.8)!important;pointer-events:none!important}.madeby{display:block!important}';
    document.head.appendChild(st);
  }
  function run(){injectStyle();ensureMadeBy();}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
  window.addEventListener('hashchange',function(){setTimeout(run,50);setTimeout(run,400);});
  document.addEventListener('click',function(e){if(e.target.closest('#viewProfile')||e.target.closest('#viewProfile2')||e.target.closest('[data-goto="profile"]')){setTimeout(run,100);setTimeout(run,700);}},true);
})();


/* ===== DLINKY HOTFIX LIMPO — RAIZ NORMAL + /slug PERFIL + CADASTRO ===== */
(function(){
  if(window.__dlinkyRootSlugRegisterCleanFix) return;
  window.__dlinkyRootSlugRegisterCleanFix = true;

  const USER_KEY = "dlinkyUser";
  const ACCOUNTS_KEY = "dlinkyAccounts_v5";
  const ADMIN_EMAIL = "jailtonsilas48@gmail.com";

  function q(s,r=document){ return r.querySelector(s); }
  function qa(s,r=document){ return Array.from(r.querySelectorAll(s)); }
  function readJSON(k,f){ try{ return JSON.parse(localStorage.getItem(k) || JSON.stringify(f)); }catch(e){ return f; } }
  function writeJSON(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
  function aviso(t){ try{ if(typeof toast === "function") return toast(t); }catch(e){} alert(t); }
  function clean(v){ return String(v||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9_-]/g,"").slice(0,30) || "usuario"; }
  function pageOff(){ qa(".page").forEach(p=>p.classList.remove("active")); }
  function getCurrent(){ return readJSON(USER_KEY, {}); }
  function saveCurrent(u){
    const old = getCurrent();
    const merged = Object.assign({}, old, u || {});
    // nome e slug digitados pelo usuário sempre vencem; nunca força nome do e-mail
    if(u && u.name) merged.name = u.name;
    if(u && u.slug) merged.slug = clean(u.slug);
    writeJSON(USER_KEY, merged);
    try{ window.user = Object.assign(window.user || {}, merged); }catch(e){}
    return merged;
  }
  function blankUser(email,name,slug){
    const base = (typeof defaultUser === "object" && defaultUser) ? defaultUser : {};
    return Object.assign({}, base, {
      uid: "local_" + Date.now(),
      email: String(email||"").toLowerCase().trim(),
      name: String(name||"Usuário").trim() || "Usuário",
      slug: clean(slug || name || "usuario"),
      bio: "",
      views: 0,
      frame: "",
      decoration: "none",
      inventory: [],
      purchases: [],
      history: ["Conta criada no Dlinky"]
    });
  }

  function firebaseReady(){ return !!(window.firebase && firebase.apps && firebase.apps.length && firebase.auth && firebase.firestore); }
  async function saveUserOnline(u){
    try{
      if(firebaseReady() && firebase.auth().currentUser){
        await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).set(u,{merge:true});
      }
    }catch(e){}
    try{
      const all = readJSON(ACCOUNTS_KEY,{});
      if(u.email) all[String(u.email).toLowerCase().trim()] = u;
      if(u.slug) all["slug:" + clean(u.slug)] = u;
      writeJSON(ACCOUNTS_KEY, all);
    }catch(e){}
  }

  async function cadastrar(ev){
    if(ev){ ev.preventDefault(); ev.stopPropagation(); ev.stopImmediatePropagation(); }
    const name = (q("#regName")?.value || "").trim();
    const slugField = (q("#regSlug")?.value || "").trim();
    const email = (q("#regEmail")?.value || "").trim().toLowerCase();
    const pass = q("#regPass")?.value || "";
    const pass2 = q("#regPass2")?.value || "";
    if(!name) return aviso("Digite seu nome.");
    if(!email) return aviso("Digite seu e-mail.");
    if(!pass || pass.length < 6) return aviso("A senha precisa ter pelo menos 6 caracteres.");
    if(pass !== pass2) return aviso("As senhas não conferem.");

    let u = blankUser(email, name, slugField || name);
    try{
      if(firebaseReady()){
        const cred = await firebase.auth().createUserWithEmailAndPassword(email, pass);
        u.uid = cred.user.uid;
        await firebase.firestore().collection("users").doc(cred.user.uid).set(u,{merge:true});
      }
    }catch(err){
      const code = String(err && err.code || "");
      if(code.includes("email-already-in-use")) return aviso("Esse e-mail já tem conta. Faça login.");
      if(code.includes("weak-password")) return aviso("Senha fraca. Use pelo menos 6 caracteres.");
      if(code.includes("operation-not-allowed")) return aviso("Ative Email/Senha no Firebase Authentication.");
      return aviso("Erro ao registrar: " + (err.message || "tente novamente"));
    }
    u = saveCurrent(u);
    await saveUserOnline(u);
    aviso("Conta criada com sucesso!");
    location.hash = "#/dashboard";
    setTimeout(()=>{ try{ if(typeof renderDash === "function") renderDash(); }catch(e){} },80);
  }

  async function entrar(ev){
    if(ev){ ev.preventDefault(); ev.stopPropagation(); ev.stopImmediatePropagation(); }
    const email = (q("#loginEmail")?.value || "").trim().toLowerCase();
    const pass = q("#loginPass")?.value || "";
    if(!email) return aviso("Digite seu e-mail.");
    if(!pass) return aviso("Digite sua senha.");
    let u = null;
    try{
      if(firebaseReady()){
        const cred = await firebase.auth().signInWithEmailAndPassword(email, pass);
        const snap = await firebase.firestore().collection("users").doc(cred.user.uid).get();
        u = Object.assign(blankUser(email,email.split("@")[0],email.split("@")[0]), snap.exists ? snap.data() : {}, {uid:cred.user.uid,email});
      }
    }catch(err){
      const all = readJSON(ACCOUNTS_KEY,{});
      u = all[email] || null;
      if(!u) return aviso("Conta não encontrada ou senha incorreta.");
    }
    saveCurrent(u);
    aviso("Login efetuado");
    location.hash = "#/dashboard";
    setTimeout(()=>{ try{ if(typeof renderDash === "function") renderDash(); }catch(e){} },80);
  }

  function patchForms(){
    const reg = q("#registerForm");
    if(reg && !reg.__dlinkyCadastroRootFix){
      reg.__dlinkyCadastroRootFix = true;
      reg.addEventListener("submit", cadastrar, true);
      const btn = reg.querySelector('button[type="submit"],button:not([type])');
      if(btn && !btn.__dlinkyCadastroRootFix){ btn.__dlinkyCadastroRootFix = true; btn.addEventListener("click", function(e){ cadastrar(e); }, true); }
    }
    const log = q("#loginForm");
    if(log && !log.__dlinkyLoginRootFix){
      log.__dlinkyLoginRootFix = true;
      log.addEventListener("submit", entrar, true);
      const btn = log.querySelector('button[type="submit"],button:not([type])');
      if(btn && !btn.__dlinkyLoginRootFix){ btn.__dlinkyLoginRootFix = true; btn.addEventListener("click", function(e){ entrar(e); }, true); }
    }
  }

  function currentPathSlug(){
    // IMPORTANTE: raiz / NÃO abre perfil. Só /algumslug abre perfil público.
    const raw = String(location.pathname || "").replace(/^\/+|\/+$/g,"").split("/")[0] || "";
    if(!raw) return "";
    const slug = clean(raw);
    const blocked = new Set(["login","register","dashboard","assets","premium","community","admin","store","index.html"]);
    return blocked.has(slug) ? "" : slug;
  }

  async function findPublicUser(slug){
    slug = clean(slug);
    let found = null;
    try{
      if(firebaseReady()){
        const snap = await firebase.firestore().collection("users").where("slug","==",slug).limit(1).get();
        if(!snap.empty) found = Object.assign({}, snap.docs[0].data(), {uid:snap.docs[0].id});
      }
    }catch(e){}
    if(!found){
      const all = readJSON(ACCOUNTS_KEY,{});
      found = all["slug:"+slug] || Object.values(all).find(x=>x && clean(x.slug)===slug) || null;
    }
    if(!found && clean((window.user||{}).slug) === slug) found = window.user;
    return found;
  }

  async function openPathProfileOnly(){
    const slug = currentPathSlug();
    if(!slug) return false;
    const found = await findPublicUser(slug);
    if(found){ saveCurrent(found); }
    else { saveCurrent(Object.assign(blankUser("", slug, slug), {name: slug, slug})); }
    pageOff();
    q("#profile")?.classList.add("active");
    try{ if(typeof renderProfile === "function") renderProfile(); }catch(e){}
    return true;
  }

  const oldRoute = window.route;
  window.route = route = function(){
    const slug = currentPathSlug();
    if(slug){ openPathProfileOnly(); return; }
    if(typeof oldRoute === "function") return oldRoute();
  };

  document.addEventListener("DOMContentLoaded",()=>{ patchForms(); openPathProfileOnly(); });
  window.addEventListener("load",()=>{ patchForms(); openPathProfileOnly(); });
  window.addEventListener("hashchange",()=>{ patchForms(); });
  setTimeout(patchForms,300);
  setTimeout(patchForms,1200);
  setTimeout(()=>{ if(!currentPathSlug() && (!location.hash || location.hash==="#")){ try{ location.hash="#/"; route(); }catch(e){} } },200);
})();

/* ===== DLINKY HOTFIX — Customização salva nome/bio de verdade ===== */
(function(){
  if(window.__DLINKY_FIX_CUSTOM_NOME_BIO_1805__) return;
  window.__DLINKY_FIX_CUSTOM_NOME_BIO_1805__ = true;

  const USER_KEY = 'dlinkyUser';
  const PREF_KEY = 'dlinkyPreferredAccount';
  const DRAFT_KEY = 'dlinkyCustomDraft_v1';
  const q = (s,r=document)=>r.querySelector(s);

  function readJSON(k,f){ try{ const raw=localStorage.getItem(k); return raw?JSON.parse(raw):f; }catch(e){ return f; } }
  function writeJSON(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
  function cleanSlug(v){ return String(v||'usuario').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9_-]/g,'').slice(0,30)||'usuario'; }
  function readUser(){ return readJSON(USER_KEY,{}); }
  function syncUser(patch){
    const old = readUser();
    const merged = Object.assign({}, old, patch||{});
    if(patch && patch.slug) merged.slug = cleanSlug(patch.slug);
    writeJSON(USER_KEY, merged);
    try{ if(typeof user !== 'undefined' && user){ Object.keys(user).forEach(k=>delete user[k]); Object.assign(user, merged); } }catch(e){}
    try{ if(window.user){ Object.keys(window.user).forEach(k=>delete window.user[k]); Object.assign(window.user, merged); } }catch(e){}
    return merged;
  }
  function saveOnline(u){
    try{
      if(!window.firebase || !firebase.auth || !firebase.firestore || !firebase.auth().currentUser) return;
      const fb = firebase.auth().currentUser;
      const db = firebase.firestore();
      const data = Object.assign({}, u, {
        uid: fb.uid,
        email: (fb.email || u.email || '').toLowerCase().trim(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      db.collection('users').doc(fb.uid).set(data,{merge:true});
      if(data.slug){
        db.collection('profiles').doc(cleanSlug(data.slug)).set({
          uid: fb.uid,
          name: data.name || 'Usuário',
          slug: cleanSlug(data.slug),
          email: data.email || '',
          bio: data.bio || '',
          avatar: data.avatar || '',
          banner: data.banner || '',
          bg: data.bg || '',
          video: data.video || '',
          frame: data.frame || '',
          music: data.music || '',
          welcome: data.welcome || 'Clique aqui',
          color: data.color || '#a855f7',
          particleType: data.particleType || 'snow',
          particles: data.particles !== false,
          verified: !!data.verified,
          links: Array.isArray(data.links) ? data.links : [],
          socials: Array.isArray(data.socials) ? data.socials : [],
          tags: Array.isArray(data.tags) ? data.tags : [],
          embeds: Array.isArray(data.embeds) ? data.embeds : [],
          decoration: data.decoration || '',
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        },{merge:true});
      }
    }catch(e){ console.warn('Dlinky custom save online:', e); }
  }
  function setValueSafe(id,val){
    const el=q(id); if(!el) return;
    if(document.activeElement === el) return;
    el.value = val || '';
  }
  function captureDraft(){
    const draft = readJSON(DRAFT_KEY,{});
    if(q('#customName')) draft.name = q('#customName').value;
    if(q('#customBio')) draft.bio = q('#customBio').value;
    if(q('#customBgFx')) draft.bgFx = q('#customBgFx').value;
    writeJSON(DRAFT_KEY,draft);
  }
  function applyFieldsFromUser(){
    const u = readUser();
    const draft = readJSON(DRAFT_KEY,{});
    const name = (draft.name && draft.name !== 'Usuário') ? draft.name : (u.name || '');
    const bio = (draft.bio !== undefined) ? draft.bio : (u.bio || '');
    setValueSafe('#customName', name);
    setValueSafe('#customBio', bio);
    if(q('#customBgFx') && document.activeElement !== q('#customBgFx')) q('#customBgFx').value = draft.bgFx || u.bgFx || 'none';
  }

  document.addEventListener('input', function(e){
    if(e.target && (e.target.id === 'customName' || e.target.id === 'customBio')) captureDraft();
  }, true);
  document.addEventListener('change', function(e){
    if(e.target && e.target.id === 'customBgFx') captureDraft();
  }, true);

  function saveCustom(ev){
    const btn = ev && ev.target && ev.target.closest && ev.target.closest('#saveCustom,#saveCustomFinal,#saveCustomFinal2,#saveCustomFinalReal');
    if(!btn) return;
    ev.preventDefault();
    ev.stopPropagation();
    ev.stopImmediatePropagation();

    const old = readUser();
    const draft = readJSON(DRAFT_KEY,{});
    const nameInput = q('#customName');
    const bioInput = q('#customBio');
    const fxInput = q('#customBgFx');

    const name = (nameInput ? nameInput.value : draft.name || old.name || 'Usuário').trim() || old.name || 'Usuário';
    const bio = bioInput ? bioInput.value : (draft.bio !== undefined ? draft.bio : old.bio || '');
    const bgFx = fxInput ? fxInput.value : (draft.bgFx || old.bgFx || 'none');

    const merged = syncUser({ name, bio, bgFx });
    const pref = readJSON(PREF_KEY,{});
    writeJSON(PREF_KEY, Object.assign({}, pref, { name, bio, updatedAt: Date.now() }));
    writeJSON(DRAFT_KEY, { name, bio, bgFx });

    setValueSafe('#cfgName', name);
    setValueSafe('#cfgBio', bio);
    setValueSafe('#customName', name);
    setValueSafe('#customBio', bio);

    try{ if(typeof renderDash === 'function') renderDash(); }catch(e){}
    try{ if(typeof renderProfile === 'function' && (location.hash === '#/profile' || document.querySelector('#profile.active'))) renderProfile(); }catch(e){}
    try{ if(typeof toast === 'function') toast('Customização salva!'); }catch(e){}
    saveOnline(merged);

    setTimeout(function(){ const u=syncUser({name,bio,bgFx}); saveOnline(u); applyFieldsFromUser(); }, 800);
    setTimeout(function(){ const u=syncUser({name,bio,bgFx}); saveOnline(u); applyFieldsFromUser(); }, 2200);
  }
  document.addEventListener('click', saveCustom, true);

  const oldRenderDash = window.renderDash || (typeof renderDash === 'function' ? renderDash : null);
  if(typeof oldRenderDash === 'function' && !oldRenderDash.__customNomeBioFix){
    const patched = function(){
      const r = oldRenderDash.apply(this, arguments);
      applyFieldsFromUser();
      return r;
    };
    patched.__customNomeBioFix = true;
    window.renderDash = patched;
    try{ renderDash = patched; }catch(e){}
  }
  const oldOpenTab = window.openTab || (typeof openTab === 'function' ? openTab : null);
  if(typeof oldOpenTab === 'function' && !oldOpenTab.__customNomeBioFix){
    const patchedOpen = function(id){
      const r = oldOpenTab.apply(this, arguments);
      if(id === 'custom') setTimeout(applyFieldsFromUser,80);
      return r;
    };
    patchedOpen.__customNomeBioFix = true;
    window.openTab = patchedOpen;
    try{ openTab = patchedOpen; }catch(e){}
  }
  window.addEventListener('hashchange',()=>setTimeout(applyFieldsFromUser,120));
  setTimeout(applyFieldsFromUser,300);
})();

/* ===== DLINKY HOTFIX FINAL — trava anti-timer nos campos + bio no perfil ===== */
(function(){
  if(window.__DLINKY_FIX_TIMER_CAMPOS_BIO_1805__) return;
  window.__DLINKY_FIX_TIMER_CAMPOS_BIO_1805__ = true;

  const USER_KEY = 'dlinkyUser';
  const DRAFT_KEY = 'dlinkyLiveDraft_Final_v3';
  const q = (s,r=document)=>r.querySelector(s);

  function readJSON(k,f){ try{ const raw=localStorage.getItem(k); return raw?JSON.parse(raw):f; }catch(e){ return f; } }
  function writeJSON(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
  function cleanSlug(v){ return String(v||'usuario').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9_-]/g,'').slice(0,30)||'usuario'; }
  function getUser(){ return readJSON(USER_KEY,{}); }
  function setGlobalUser(u){
    try{ if(typeof user !== 'undefined' && user){ Object.keys(user).forEach(k=>delete user[k]); Object.assign(user,u); } }catch(e){}
    try{ window.user = Object.assign(window.user||{}, u); }catch(e){}
  }
  function saveUserLocal(patch){
    const old = getUser();
    const merged = Object.assign({}, old, patch||{});
    if(merged.slug) merged.slug = cleanSlug(merged.slug);
    writeJSON(USER_KEY, merged);
    setGlobalUser(merged);
    return merged;
  }
  function saveOnline(u){
    try{
      if(!window.firebase || !firebase.auth || !firebase.firestore || !firebase.auth().currentUser) return;
      const fb = firebase.auth().currentUser;
      const db = firebase.firestore();
      const data = Object.assign({}, u, {
        uid: fb.uid,
        email: (fb.email || u.email || '').toLowerCase().trim(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      db.collection('users').doc(fb.uid).set(data,{merge:true});
      if(data.slug){
        db.collection('profiles').doc(cleanSlug(data.slug)).set({
          uid: fb.uid,
          name: data.name || 'Usuário',
          slug: cleanSlug(data.slug),
          email: data.email || '',
          bio: data.bio || '',
          avatar: data.avatar || '',
          banner: data.banner || '',
          bg: data.bg || '',
          video: data.video || '',
          frame: data.frame || '',
          music: data.music || '',
          welcome: data.welcome || 'Clique aqui',
          color: data.color || '#a855f7',
          particleType: data.particleType || 'snow',
          particles: data.particles !== false,
          verified: !!data.verified,
          links: Array.isArray(data.links) ? data.links : [],
          socials: Array.isArray(data.socials) ? data.socials : [],
          tags: Array.isArray(data.tags) ? data.tags : [],
          embeds: Array.isArray(data.embeds) ? data.embeds : [],
          decoration: data.decoration || '',
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        },{merge:true});
      }
    }catch(e){ console.warn('Dlinky save online:', e); }
  }

  const map = {
    cfgName:'name', cfgSlug:'slug', cfgBio:'bio', cfgMusic:'music', cfgWelcome:'welcome',
    cfgAvatar:'avatar', cfgBanner:'banner', cfgBg:'bg', cfgVideo:'video', cfgFrame:'frame',
    customName:'name', customBio:'bio', customBgFx:'bgFx',
    uploadAvatar:'avatar', uploadBg:'bg', uploadMusic:'music', uploadCursor:'cursor'
  };

  function rememberField(el){
    if(!el || !map[el.id]) return;
    const key = map[el.id];
    const draft = readJSON(DRAFT_KEY,{});
    draft[key] = el.value;
    draft.updatedAt = Date.now();
    writeJSON(DRAFT_KEY,draft);

    const patch = {};
    patch[key] = key === 'slug' ? cleanSlug(el.value) : el.value;
    const u = saveUserLocal(patch);
    if(key === 'name' || key === 'slug' || key === 'bio' || key === 'music' || key === 'welcome'){
      clearTimeout(window.__dlinkyOnlineSaveTimerFinal);
      window.__dlinkyOnlineSaveTimerFinal = setTimeout(()=>saveOnline(u),900);
    }
  }

  document.addEventListener('input', e=>rememberField(e.target), true);
  document.addEventListener('change', e=>rememberField(e.target), true);

  function safeSet(id,val){
    const el = q('#'+id);
    if(!el) return;
    if(document.activeElement === el) return;
    const draft = readJSON(DRAFT_KEY,{});
    const key = map[id];
    const use = draft[key] !== undefined ? draft[key] : val;
    el.value = use || '';
  }

  function restoreFields(){
    const u = getUser();
    safeSet('cfgName', u.name || '');
    safeSet('cfgSlug', u.slug || '');
    safeSet('cfgBio', u.bio || '');
    safeSet('cfgMusic', u.music || '');
    safeSet('cfgWelcome', u.welcome || 'Clique aqui');
    safeSet('cfgAvatar', u.avatar || '');
    safeSet('cfgBanner', u.banner || '');
    safeSet('cfgBg', u.bg || '');
    safeSet('cfgVideo', u.video || '');
    safeSet('cfgFrame', u.frame || '');
    safeSet('customName', u.name || '');
    safeSet('customBio', u.bio || '');
    if(q('#customBgFx') && document.activeElement !== q('#customBgFx')) q('#customBgFx').value = u.bgFx || 'none';
  }

  function saveAccountNow(ev){
    const btn = ev.target && ev.target.closest && ev.target.closest('#saveAccount,#saveCustom,#saveCustomFinal,#saveCustomFinal2,#saveCustomFinalReal');
    if(!btn) return;
    ev.preventDefault();
    ev.stopPropagation();
    ev.stopImmediatePropagation();

    const current = getUser();
    const patch = {};
    if(q('#cfgName')) patch.name = q('#cfgName').value.trim() || current.name || 'Usuário';
    if(q('#cfgSlug')) patch.slug = cleanSlug(q('#cfgSlug').value || current.slug || patch.name || 'usuario');
    if(q('#cfgBio')) patch.bio = q('#cfgBio').value;
    if(q('#cfgMusic')) patch.music = q('#cfgMusic').value.trim();
    if(q('#cfgWelcome')) patch.welcome = q('#cfgWelcome').value.trim() || 'Clique aqui';
    if(q('#customName')) patch.name = q('#customName').value.trim() || patch.name || current.name || 'Usuário';
    if(q('#customBio')) patch.bio = q('#customBio').value;
    if(q('#customBgFx')) patch.bgFx = q('#customBgFx').value;

    const u = saveUserLocal(patch);
    writeJSON(DRAFT_KEY,Object.assign(readJSON(DRAFT_KEY,{}), patch, {updatedAt:Date.now()}));
    saveOnline(u);
    restoreFields();
    try{ if(typeof renderDash === 'function') setTimeout(renderDash,0); }catch(e){}
    try{ if(typeof toast === 'function') toast('Salvo com sucesso!'); }catch(e){}
  }
  document.addEventListener('click', saveAccountNow, true);
  document.addEventListener('submit', function(e){
    if(e.target && (e.target.id === 'registerForm' || e.target.id === 'loginForm')) return;
    if(e.target && e.target.closest && e.target.closest('#tab-account,#tab-custom')) saveAccountNow(e);
  }, true);

  const oldRenderDash = window.renderDash || (typeof renderDash === 'function' ? renderDash : null);
  if(typeof oldRenderDash === 'function' && !oldRenderDash.__dlinkyTimerFixFinal){
    const patched = function(){
      const r = oldRenderDash.apply(this, arguments);
      restoreFields();
      return r;
    };
    patched.__dlinkyTimerFixFinal = true;
    window.renderDash = patched;
    try{ renderDash = patched; }catch(e){}
  }

  const oldRenderProfile = window.renderProfile || (typeof renderProfile === 'function' ? renderProfile : null);
  if(typeof oldRenderProfile === 'function' && !oldRenderProfile.__dlinkyBioFixFinal){
    const patchedProfile = function(){
      const r = oldRenderProfile.apply(this, arguments);
      const u = getUser();
      const nameEl = q('#profileName');
      const slugEl = q('#profileSlug2');
      const bioEl = q('#profileBio');
      if(nameEl) nameEl.textContent = u.name || 'Usuário';
      if(slugEl) slugEl.textContent = '@' + (u.slug || 'usuario');
      if(bioEl){
        bioEl.textContent = u.bio || '';
        bioEl.style.display = u.bio ? 'block' : 'none';
        bioEl.style.visibility = 'visible';
        bioEl.style.opacity = '1';
      }
      return r;
    };
    patchedProfile.__dlinkyBioFixFinal = true;
    window.renderProfile = patchedProfile;
    try{ renderProfile = patchedProfile; }catch(e){}
  }

  window.addEventListener('hashchange',()=>setTimeout(restoreFields,80));
  document.addEventListener('click',()=>setTimeout(restoreFields,120),true);
  setInterval(()=>{ if(q('#tab-account.active') || q('#tab-custom.active')) restoreFields(); },700);
  setTimeout(restoreFields,200);
  setTimeout(restoreFields,1000);
})();

/* ===== DLINKY HOTFIX — BIO sempre aparece e salva no perfil ===== */
(function(){
  if(window.__DLINKY_FIX_BIO_APARECER_1805__) return;
  window.__DLINKY_FIX_BIO_APARECER_1805__ = true;

  const USER_KEY = 'dlinkyUser';
  const DRAFT_KEYS = ['dlinkyLiveDraft_Final_v3','dlinkyCustomDraft_v1','dlinkyPreferredAccount'];
  const q = (s,r=document)=>r.querySelector(s);
  const cleanSlug = v => String(v||'usuario').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9_-]/g,'').slice(0,30)||'usuario';
  function readJSON(k,f){try{const raw=localStorage.getItem(k);return raw?JSON.parse(raw):f;}catch(e){return f;}}
  function writeJSON(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
  function getUser(){return readJSON(USER_KEY,{});}
  function setUser(patch){
    const old=getUser();
    const merged=Object.assign({},old,patch||{});
    if(merged.slug) merged.slug=cleanSlug(merged.slug);
    writeJSON(USER_KEY,merged);
    try{if(typeof user!=='undefined'&&user){Object.keys(user).forEach(k=>delete user[k]);Object.assign(user,merged);}}catch(e){}
    try{window.user=Object.assign(window.user||{},merged);}catch(e){}
    return merged;
  }
  function draftBio(){
    for(const k of DRAFT_KEYS){
      const d=readJSON(k,{});
      if(typeof d.bio==='string' && d.bio.trim()) return d.bio;
    }
    return '';
  }
  function bestBio(){
    const active = q('#cfgBio') || q('#customBio');
    if(active && active.value && active.value.trim()) return active.value;
    const u=getUser();
    return (u.bio && String(u.bio).trim()) ? u.bio : draftBio();
  }
  function bestName(){
    const u=getUser();
    return (u.name && u.name !== 'Usuário') ? u.name : ((q('#cfgName')&&q('#cfgName').value.trim()) || (q('#customName')&&q('#customName').value.trim()) || 'Usuário');
  }
  function bestSlug(){
    const u=getUser();
    return cleanSlug(u.slug || (q('#cfgSlug')&&q('#cfgSlug').value) || bestName());
  }
  function saveOnline(u){
    try{
      if(!window.firebase || !firebase.auth || !firebase.firestore || !firebase.auth().currentUser) return;
      const fb=firebase.auth().currentUser;
      const db=firebase.firestore();
      const data=Object.assign({},u,{uid:fb.uid,email:(fb.email||u.email||'').toLowerCase().trim(),updatedAt:firebase.firestore.FieldValue.serverTimestamp()});
      db.collection('users').doc(fb.uid).set(data,{merge:true});
      const slug=cleanSlug(data.slug||'');
      if(slug){
        db.collection('profiles').doc(slug).set({
          uid:fb.uid,
          name:data.name||'Usuário',
          slug,
          email:data.email||'',
          bio:data.bio||'',
          avatar:data.avatar||'',
          banner:data.banner||'',
          bg:data.bg||'',
          video:data.video||'',
          frame:data.frame||'',
          frameUrl:data.frameUrl||data.frame||'',
          activeFrameId:data.activeFrameId||'',
          frameAdjustments:data.frameAdjustments||{},
          music:data.music||'',
          welcome:data.welcome||'Clique aqui',
          color:data.color||'#a855f7',
          particleType:data.particleType||'snow',
          particles:data.particles!==false,
          verified:!!data.verified,
          links:Array.isArray(data.links)?data.links:[],
          socials:Array.isArray(data.socials)?data.socials:[],
          tags:Array.isArray(data.tags)?data.tags:[],
          embeds:Array.isArray(data.embeds)?data.embeds:[],
          decoration:data.decoration||'',
          updatedAt:firebase.firestore.FieldValue.serverTimestamp()
        },{merge:true});
      }
    }catch(e){console.warn('Dlinky bio save online:',e);}
  }
  function paintBio(){
    const bio=bestBio();
    const bioEl=q('#profileBio');
    if(bioEl){
      bioEl.textContent=bio || '';
      bioEl.style.setProperty('display','block','important');
      bioEl.style.setProperty('visibility','visible','important');
      bioEl.style.setProperty('opacity','1','important');
      bioEl.style.setProperty('min-height', bio ? '18px' : '0px','important');
      bioEl.style.setProperty('margin','8px 0 14px','important');
      bioEl.style.setProperty('color','var(--profileBioColor, #fff)','important');
      bioEl.style.setProperty('font-size','16px','important');
      bioEl.style.setProperty('font-weight','600','important');
      bioEl.classList.add('dlinky-bio-forced');
    }
  }
  function commitFromFields(){
    const patch={};
    const b1=q('#cfgBio'), b2=q('#customBio');
    const n1=q('#cfgName'), n2=q('#customName'), s1=q('#cfgSlug');
    if(n1 && n1.value.trim()) patch.name=n1.value.trim();
    if(n2 && n2.value.trim()) patch.name=n2.value.trim();
    if(s1 && s1.value.trim()) patch.slug=cleanSlug(s1.value);
    if(b1) patch.bio=b1.value;
    if(b2) patch.bio=b2.value;
    if(q('#cfgMusic')) patch.music=q('#cfgMusic').value.trim();
    if(q('#cfgWelcome')) patch.welcome=q('#cfgWelcome').value.trim()||'Clique aqui';
    const u=setUser(patch);
    for(const k of DRAFT_KEYS){
      const d=readJSON(k,{});
      if(patch.bio!==undefined) d.bio=patch.bio;
      if(patch.name!==undefined) d.name=patch.name;
      if(patch.slug!==undefined) d.slug=patch.slug;
      d.updatedAt=Date.now();
      writeJSON(k,d);
    }
    clearTimeout(window.__dlinkyBioOnlineTimer);
    window.__dlinkyBioOnlineTimer=setTimeout(()=>saveOnline(u),500);
    return u;
  }

  document.addEventListener('input',function(e){
    if(e.target && ['cfgBio','customBio','cfgName','customName','cfgSlug'].includes(e.target.id)){
      commitFromFields();
      if(q('#profile.active')) paintBio();
    }
  },true);

  document.addEventListener('click',function(e){
    const btn=e.target && e.target.closest && e.target.closest('#saveAccount,#saveCustom,#saveCustomFinal,#saveCustomFinal2,#saveCustomFinalReal');
    if(!btn) return;
    setTimeout(function(){ const u=commitFromFields(); saveOnline(u); paintBio(); try{if(typeof toast==='function')toast('Salvo com sucesso!');}catch(err){} },0);
  },true);

  const oldRenderProfile=window.renderProfile || (typeof renderProfile==='function'?renderProfile:null);
  if(typeof oldRenderProfile==='function' && !oldRenderProfile.__bioAparecerFix){
    const patched=function(){
      const r=oldRenderProfile.apply(this,arguments);
      const u=getUser();
      if(q('#profileName')) q('#profileName').textContent=u.name||bestName();
      if(q('#profileSlug2')) q('#profileSlug2').textContent='@'+(u.slug||bestSlug());
      paintBio();
      setTimeout(paintBio,80);
      setTimeout(paintBio,400);
      return r;
    };
    patched.__bioAparecerFix=true;
    window.renderProfile=patched;
    try{renderProfile=patched;}catch(e){}
  }

  window.addEventListener('hashchange',()=>setTimeout(paintBio,200));
  setTimeout(paintBio,300);
  setTimeout(paintBio,1200);
})();

/* ===== DLINKY PATCH DEFINITIVO — SOMENTE LOJA SEM PISCAR/RESETAR =====
   Corrige apenas a loja:
   - Recarga/Molduras/Efeitos/Outros ficam na aba certa.
   - A duração da moldura não volta mais para 3 dias.
   - Se algum script antigo tentar redesenhar a loja, este patch restaura a aba correta.
   - Não mexe em perfil, avatar, música, login, cadastro nem renderProfile.
*/
(function(){
  if(window.__dlinkyStoreStableFinalV10) return;
  window.__dlinkyStoreStableFinalV10 = true;

  const MODE_KEY = 'dlinky_loja_aba_fixa_final';
  const DUR_KEY = 'dlinky_moldura_duracao_fixa_final';
  const USER_KEY = 'dlinkyUser';
  const FRAME_KEYS = ['dlinkyCustomFrames','dlinkyFrames','dlinkyShopFrames','dlinkyGlobalFrames','dlinkyCleanFrames'];
  const SELO_KEYS = ['dlinkyCleanAdminSelosCatalog','dlinkyCustomSelos','dlinkyAdminSelos','dlinkySelos','dlinkyInsignias','dlinkyBadges'];
  const COINS = [
    ['345 Linkwuans','R$ 30,00',345],
    ['650 Linkwuans','R$ 50,00',650],
    ['1450 Linkwuans','R$ 100,00',1450],
    ['3300 Linkwuans','R$ 200,00',3300]
  ];
  const EFFECTS = [
    ['Neon no Nome','180 Linkwuans','neonName'],
    ['Nome Brilhante','220 Linkwuans','shineName'],
    ['Nome Colorido','240 Linkwuans','rainbowName'],
    ['Ocultar Views','150 Linkwuans','hideViews']
  ];
  const DURATIONS = ['3 dias','7 dias','15 dias','Permanente'];

  let rendering = false;
  let lastMode = normMode(localStorage.getItem(MODE_KEY) || 'coins');
  let restoreTimer = null;

  function q(s,r=document){return r.querySelector(s)}
  function qa(s,r=document){return Array.from(r.querySelectorAll(s))}
  function esc(v){return String(v ?? '').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function readJSON(k,f){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}}
  function writeJSON(k,v){localStorage.setItem(k,JSON.stringify(v))}
  function toastMsg(t){try{if(typeof window.toast==='function')return window.toast(t)}catch(e){}}
  function storeRoot(){return q('#tab-store')}
  function shopGrid(){const s=storeRoot();return s?q('#shopGrid',s):q('#shopGrid')}
  function normMode(m){
    m=String(m||'').toLowerCase();
    if(m.includes('frame')||m.includes('mold')) return 'frames';
    if(m.includes('effect')||m.includes('efe')) return 'effects';
    if(m.includes('other')||m.includes('out')||m.includes('selo')||m.includes('insign')) return 'other';
    return 'coins';
  }
  function setMode(m){lastMode=normMode(m);localStorage.setItem(MODE_KEY,lastMode);return lastMode}
  function getMode(){return normMode(lastMode || localStorage.getItem(MODE_KEY) || 'coins')}
  function getUser(){
    const saved=readJSON(USER_KEY,{});
    try{if(window.user&&typeof window.user==='object')return Object.assign(window.user,saved)}catch(e){}
    return saved;
  }
  function saveUser(u){
    writeJSON(USER_KEY,u||{});
    try{if(window.user&&typeof window.user==='object')Object.assign(window.user,u||{})}catch(e){}
  }
  function firstUrl(o){return String(o?.url||o?.img||o?.image||o?.src||o?.frame||o?.frameUrl||o?.value||'').trim()}
  function priceNumber(v){const m=String(v||'40').match(/\d+/);return m?Number(m[0]):40}
  function durationMap(){return readJSON(DUR_KEY,{})}
  function saveDuration(id,dur){const map=durationMap();map[id]=DURATIONS.includes(dur)?dur:'3 dias';writeJSON(DUR_KEY,map)}
  function getDuration(id){const map=durationMap();return DURATIONS.includes(map[id])?map[id]:'3 dias'}
  function priceFor(frame,dur){ return priceNumber(frame.price); }
  function getAvatar(){
    return String((window.__dlinkyGetBestAvatar&&window.__dlinkyGetBestAvatar())||'').trim();
  }
  function getFrames(){
    let arr=[];
    FRAME_KEYS.forEach(k=>{const v=readJSON(k,[]);if(Array.isArray(v))arr=arr.concat(v)});
    const u=getUser();
    if(Array.isArray(u.inventory)){
      u.inventory.forEach(it=>{
        const url=firstUrl(it);
        const txt=String([it.type,it.kind,it.name,it.title,it.value].filter(Boolean).join(' ')).toLowerCase();
        if(url&&(txt.includes('frame')||txt.includes('moldura'))){
          arr.push({name:it.name||'Moldura',desc:it.desc||'Espinhos.',price:it.price||'40 Linkwuans',url,prices:it.prices||null,id:it.id||url});
        }
      });
    }
    const seen=new Set();
    return arr.map((f,i)=>{
      const url=firstUrl(f);
      return {name:f.name||f.nome||f.title||'Moldura',desc:f.desc||f.descricao||f.description||'Espinhos.',price:f.price||f.preco||f.valor||'40 Linkwuans',url,prices:f.prices||f.precos||null,id:String(f.id||url||('frame_'+i))};
    }).filter(f=>f.url).filter(f=>{const k=(f.url+'|'+f.name).toLowerCase();if(seen.has(k))return false;seen.add(k);return true});
  }
  function getSelos(){
    let arr=[];
    SELO_KEYS.forEach(k=>{const v=readJSON(k,[]);if(Array.isArray(v))arr=arr.concat(v)});
    const seen=new Set();
    return arr.map((s,i)=>({name:s.name||s.nome||s.title||'Selo',desc:s.desc||s.descricao||'',price:s.price||s.preco||'0 Linkwuans',url:firstUrl(s),id:String(s.id||s.url||('selo_'+i))})).filter(s=>{const k=(s.id+'|'+s.url+'|'+s.name).toLowerCase();if(seen.has(k))return false;seen.add(k);return true});
  }
  function setActive(m){
    const s=storeRoot(); if(!s)return;
    const labels={coins:'Recarga',frames:'Molduras',effects:'Efeitos',other:'Outros'};
    qa('.shop-tabs [data-shop-tab], .asset-tabs [data-shop-tab]',s).forEach(btn=>{
      const bm=normMode(btn.dataset.shopTab||btn.textContent);
      btn.dataset.shopTab=bm;
      if(labels[bm])btn.textContent=labels[bm];
      btn.classList.toggle('active',bm===m);
    });
  }
  function renderCoins(g){
    g.className='asset-grid';
    g.innerHTML=COINS.map(x=>`<div class="asset-card"><div class="asset-preview shop-preview">◈</div><div class="asset-body"><b>${x[0]}</b><small>${x[1]}</small><button class="btn primary small" type="button" data-loja-coin="${x[2]}">Comprar</button></div></div>`).join('');
  }
  function renderFrames(g){
    const frames=getFrames();
    const av=getAvatar();
    window.__dlinkyVisibleFrames=frames.map((f,i)=>[f.name,f.price,'custom-'+i,f.desc,'Disponível',f.url,f.prices||null,f.id]);
    g.className='asset-grid frames-shop-grid';
    if(!frames.length){g.innerHTML='<div class="panel"><h2>Nenhuma moldura cadastrada</h2><p>Cadastre uma moldura real no Admin para aparecer aqui.</p></div>';return;}
    g.innerHTML=frames.map((f,i)=>{
      const d=getDuration(f.id);
      const p=priceFor(f,d);
      return `<div class="frame-shop-card premium-frame custom-only-frame" data-frame-card="${i}" data-frame-id="${esc(f.id)}" data-base-price="${priceNumber(f.price)}">
        <div class="frame-shop-preview real-frame-preview" style="position:relative;display:grid;place-items:center;overflow:hidden;min-height:170px;background:#09080d;border-radius:10px;">
          <div class="frame-avatar-demo zyo-person-demo" style="width:92px;height:92px;border-radius:50%;background:${av?`url('${esc(av)}') center/cover no-repeat`:'#dbe1ea'};position:absolute;z-index:1;"></div>
          <img class="frame-img big" src="${esc(f.url)}" alt="${esc(f.name)}" style="position:absolute;z-index:2;width:145px;height:145px;object-fit:contain;pointer-events:none;">
        </div>
        <div class="frame-info clean-info"><b>${esc(f.name)}</b><small>${esc(f.desc)}</small></div>
        <div class="frame-price">Preço: <b data-price-label="${i}">${p} Linkwuans</b></div>
        <select class="frame-duration" data-frame-duration="${i}" data-frame-id="${esc(f.id)}">${DURATIONS.map(x=>`<option value="${x}" ${x===d?'selected':''}>${x}</option>`).join('')}</select>
        <div class="frame-actions"><button class="btn primary small" type="button" data-confirm-frame="${i}">Comprar</button></div>
      </div>`;
    }).join('');
  }
  function renderEffects(g){
    g.className='asset-grid';
    g.innerHTML=EFFECTS.map((x,i)=>`<div class="asset-card"><div class="asset-preview shop-preview">✦</div><div class="asset-body"><b>${esc(x[0])}</b><small>${esc(x[1])}</small><button class="btn primary small" type="button" data-loja-effect="${i}">Comprar</button></div></div>`).join('');
  }
  function renderSelos(g){
    const selos=getSelos();
    g.className='asset-grid';
    if(!selos.length){g.innerHTML='<div class="panel"><h2>Nenhum selo cadastrado</h2><p>Cadastre selos no Admin Selos para aparecer aqui.</p></div>';return;}
    g.innerHTML=selos.map(s=>`<div class="asset-card"><div class="asset-preview shop-preview">${s.url?`<img src="${esc(s.url)}" alt="${esc(s.name)}" style="max-width:90px;max-height:90px;object-fit:contain">`:'✦'}</div><div class="asset-body"><b>${esc(s.name)}</b><small>${esc(s.price)}</small><button class="btn primary small" type="button" data-loja-selo="${esc(s.id)}">Comprar</button></div></div>`).join('');
  }
  function renderStore(m){
    const g=shopGrid(); if(!g)return;
    m=setMode(m||getMode());
    rendering=true;
    setActive(m);
    if(m==='frames')renderFrames(g);
    else if(m==='effects')renderEffects(g);
    else if(m==='other')renderSelos(g);
    else renderCoins(g);
    requestAnimationFrame(()=>{rendering=false});
  }
  function scheduleRestore(){
    clearTimeout(restoreTimer);
    restoreTimer=setTimeout(()=>{
      const s=storeRoot();
      if(s&&s.classList.contains('active')) renderStore(getMode());
    },40);
  }

  window.addEventListener('pointerdown',function(e){
    const tab=e.target&&e.target.closest&&e.target.closest('#tab-store .shop-tabs [data-shop-tab], #tab-store .asset-tabs [data-shop-tab]');
    if(!tab)return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    renderStore(tab.dataset.shopTab||tab.textContent);
  },true);

  window.addEventListener('click',function(e){
    const tab=e.target&&e.target.closest&&e.target.closest('#tab-store .shop-tabs [data-shop-tab], #tab-store .asset-tabs [data-shop-tab]');
    if(tab){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();renderStore(tab.dataset.shopTab||tab.textContent);return;}
    const coin=e.target&&e.target.closest&&e.target.closest('[data-loja-coin]');
    if(coin){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const v=Number(coin.dataset.lojaCoin||0);if(window.dlinkyOpenPixRecharge)window.dlinkyOpenPixRecharge(v);else{const u=getUser();u.coins=Number(u.coins||0)+v;saveUser(u);toastMsg('Linkwuans adicionados.')}return;}
    const eff=e.target&&e.target.closest&&e.target.closest('[data-loja-effect]');
    if(eff){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const it=EFFECTS[Number(eff.dataset.lojaEffect)||0];const u=getUser();u.inventory=Array.isArray(u.inventory)?u.inventory:[];u.inventory.unshift({type:'effects',name:it[0],value:it[2]});u[it[2]]=true;saveUser(u);toastMsg('Efeito adicionado!');return;}
    const selo=e.target&&e.target.closest&&e.target.closest('[data-loja-selo]');
    if(selo){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const u=getUser();u.selosOwned=Array.isArray(u.selosOwned)?u.selosOwned:[];if(!u.selosOwned.includes(selo.dataset.lojaSelo))u.selosOwned.push(selo.dataset.lojaSelo);u.activeSelo=selo.dataset.lojaSelo;saveUser(u);toastMsg('Selo comprado!');return;}
  },true);

  window.addEventListener('input',function(e){
    const sel=e.target&&e.target.closest&&e.target.closest('#tab-store [data-frame-duration]');
    if(!sel)return;
    const id=sel.dataset.frameId||String(sel.dataset.frameDuration||0);
    saveDuration(id,sel.value);
    const frames=getFrames();
    const idx=Number(sel.dataset.frameDuration||0);
    const f=frames[idx];
    if(f){const lab=q(`[data-price-label="${idx}"]`,storeRoot()); if(lab)lab.textContent=priceFor(f,sel.value)+' Linkwuans';}
  },true);

  window.addEventListener('change',function(e){
    const sel=e.target&&e.target.closest&&e.target.closest('#tab-store [data-frame-duration]');
    if(!sel)return;
    e.stopPropagation();
    const id=sel.dataset.frameId||String(sel.dataset.frameDuration||0);
    saveDuration(id,sel.value);
    const frames=getFrames();
    const idx=Number(sel.dataset.frameDuration||0);
    const f=frames[idx];
    if(f){const lab=q(`[data-price-label="${idx}"]`,storeRoot()); if(lab)lab.textContent=priceFor(f,sel.value)+' Linkwuans';}
  },true);

  const oldOpen=window.openTab||(typeof openTab==='function'?openTab:null);
  if(typeof oldOpen==='function'){
    const patched=function(id){const r=oldOpen.apply(this,arguments); if(id==='store')setTimeout(()=>renderStore(getMode()),20); return r;};
    window.openTab=patched; try{openTab=patched}catch(e){}
  }
  window.renderShop=function(){return renderStore(getMode())};
  try{renderShop=window.renderShop}catch(e){}

  const mo=new MutationObserver(function(){
    if(rendering)return;
    const s=storeRoot();
    if(!s||!s.classList.contains('active'))return;
    const active=s.querySelector('.shop-tabs [data-shop-tab].active, .asset-tabs [data-shop-tab].active');
    const activeMode=active?normMode(active.dataset.shopTab||active.textContent):getMode();
    if(activeMode!==getMode()) scheduleRestore();
    if(getMode()==='frames'){
      const sel=s.querySelector('[data-frame-duration]');
      if(sel){const id=sel.dataset.frameId||String(sel.dataset.frameDuration||0); if(sel.value!==getDuration(id)) scheduleRestore();}
    }
  });
  function observe(){const s=storeRoot(); if(s)mo.observe(s,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe,{once:true});else observe();

  window.addEventListener('hashchange',()=>setTimeout(()=>{if(storeRoot()?.classList.contains('active'))renderStore(getMode())},80));
  setTimeout(()=>{if(storeRoot()?.classList.contains('active'))renderStore(getMode())},120);
})();


/* ===== FIX FINAL SOMENTE LOJA: preço não aumenta + avatar real no preview ===== */
(function(){
  const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  function num(v){const m=String(v||'40').match(/\d+/);return m?Number(m[0]):40}
  function frames(){
    try{return JSON.parse(localStorage.getItem('dlinkyCustomFrames')||'[]')}catch(e){return []}
  }
  function avatar(){return (window.__dlinkyGetBestAvatar&&window.__dlinkyGetBestAvatar())||''}
  function apply(){
    const store=q('#tab-store'); if(!store||!store.classList.contains('active'))return;
    const av=avatar();
    if(av){
      qa('.frame-avatar-demo,.real-inv-avatar,.zyo-person-demo',store).forEach(el=>{
        el.style.backgroundImage='url("'+av.replace(/"/g,'%22')+'")';
        el.style.backgroundSize='cover';
        el.style.backgroundPosition='center';
        el.style.backgroundColor='transparent';
      });
    }
    const arr=frames();
    qa('[data-price-label],[data-v3-price]',store).forEach((el,i)=>{
      const card=el.closest('[data-frame-card]');
      const idx=Number(card?.dataset?.frameCard ?? i);
      const f=arr[idx];
      const p=num(f?.price||f?.prices?.['3 dias']||el.textContent||40);
      el.textContent=p+' Linkwuans';
    });
  }
  document.addEventListener('change',e=>{if(e.target.closest&&e.target.closest('#tab-store [data-frame-duration],#tab-store [data-v3-duration]'))setTimeout(apply,0)},true);
  document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#tab-store .shop-tabs button,#tab-store [data-shop-tab]'))setTimeout(apply,80)},true);
  const oldRS=window.renderShop;
  if(typeof oldRS==='function'&&!oldRS.__dlinkyPriceAvatarFix){
    const patched=function(){const r=oldRS.apply(this,arguments);setTimeout(apply,0);setTimeout(apply,80);return r};
    patched.__dlinkyPriceAvatarFix=true; window.renderShop=patched; try{renderShop=patched}catch(e){}
  }
  setTimeout(apply,200);
})();


/* ===== DLINKY FIX CIRÚRGICO FINAL — AVATAR REAL NA PREVIEW DA MOLDURA =====
   Só mexe na imagem/avatar dentro dos cards de Molduras da Loja.
   Não altera abas, duração, preço, música, perfil, admin, inventário ou compra.
*/
(function(){
  if(window.__dlinkyAvatarPreviewMolduraFinal) return;
  window.__dlinkyAvatarPreviewMolduraFinal = true;

  function q(s,r=document){return r.querySelector(s)}
  function qa(s,r=document){return Array.from(r.querySelectorAll(s))}

  function cleanUrl(v){
    v = String(v || '').trim();
    if(!v || v === 'none') return '';
    const m = v.match(/url\(["']?(.+?)["']?\)/i);
    if(m) v = m[1];
    return v.replace(/^['"]|['"]$/g,'').trim();
  }

  function readUser(){
    try{
      const saved = JSON.parse(localStorage.getItem('dlinkyUser') || '{}');
      if(typeof user === 'object' && user){ return Object.assign({}, saved, user); }
      return saved;
    }catch(e){
      try{ if(typeof user === 'object' && user) return user; }catch(err){}
      return {};
    }
  }

  function fromElement(sel){
    const el = q(sel);
    if(!el) return '';
    if(el.tagName === 'IMG') return cleanUrl(el.getAttribute('src'));
    return cleanUrl(el.style.backgroundImage || getComputedStyle(el).backgroundImage);
  }

  function bestAvatar(){
    const u = readUser();
    const candidates = [
      u.avatar,
      u.photo,
      u.photoURL,
      u.avatarUrl,
      localStorage.getItem('dlinky_avatar_clean_'+(u.email||u.slug||'local')),
      localStorage.getItem('dlinkyAvatarPreserve_'+(u.email||u.slug||'local')),
      fromElement('#dashAvatar'),
      fromElement('#sideAvatar'),
      fromElement('#profileAvatar'),
      fromElement('.profile-avatar'),
      fromElement('.avatar')
    ];
    for(const c of candidates){
      const v = cleanUrl(c);
      if(v && !/placeholder|default-avatar|usuario|user-icon/i.test(v)) return v;
      if(v && /^https?:\/\//i.test(v)) return v;
    }
    return cleanUrl(u.avatar || candidates.find(Boolean) || '');
  }

  function paintAvatarPreview(){
    const store = q('#tab-store');
    if(!store) return;
    const av = bestAvatar();
    if(!av) return;

    // Mantém salvo para próximos renders sem mexer nos outros dados.
    try{
      const u = readUser();
      if(u && !u.avatar){ u.avatar = av; localStorage.setItem('dlinkyUser', JSON.stringify(u)); }
      localStorage.setItem('dlinky_avatar_clean_'+(u.email||u.slug||'local'), av);
    }catch(e){}

    const targets = qa('.frame-avatar-demo,.zyo-person-demo,.real-inv-avatar,.inv-avatar-preview', store);
    targets.forEach(el=>{
      el.style.setProperty('background-image', 'url("'+av.replace(/"/g,'%22')+'")', 'important');
      el.style.setProperty('background-size', 'cover', 'important');
      el.style.setProperty('background-position', 'center', 'important');
      el.style.setProperty('background-repeat', 'no-repeat', 'important');
      el.style.setProperty('background-color', 'transparent', 'important');
      el.style.setProperty('display', 'block', 'important');
      el.style.setProperty('visibility', 'visible', 'important');
      el.style.setProperty('opacity', '1', 'important');
    });

    // Caso algum card tenha perdido o elemento do avatar, recria somente dentro da preview da moldura.
    qa('.frame-shop-preview,.real-frame-preview,.inv-preview', store).forEach(box=>{
      const hasFrame = q('.frame-img,.real-inv-frame,.inv-frame-preview,img', box);
      if(!hasFrame) return;
      let avatarEl = q('.frame-avatar-demo,.zyo-person-demo,.real-inv-avatar,.inv-avatar-preview', box);
      if(!avatarEl){
        avatarEl = document.createElement('div');
        avatarEl.className = 'frame-avatar-demo zyo-person-demo';
        box.insertBefore(avatarEl, box.firstChild);
      }
      avatarEl.style.cssText += ';position:absolute!important;left:50%!important;top:50%!important;width:92px!important;height:92px!important;border-radius:50%!important;transform:translate(-50%,-50%)!important;z-index:1!important;background:url("'+av.replace(/"/g,'%22')+'") center/cover no-repeat!important;';
      box.style.setProperty('position','relative','important');
      box.style.setProperty('overflow','hidden','important');
      const img = q('.frame-img,.real-inv-frame,.inv-frame-preview,img', box);
      if(img){
        img.style.setProperty('position','absolute','important');
        img.style.setProperty('left','50%','important');
        img.style.setProperty('top','50%','important');
        img.style.setProperty('transform','translate(-50%,-50%)','important');
        img.style.setProperty('z-index','2','important');
        img.style.setProperty('object-fit','contain','important');
        img.style.setProperty('pointer-events','none','important');
      }
    });
  }

  // Reaplica após renders antigos da loja sem alterar o render da loja.
  const oldRenderShop = window.renderShop;
  if(typeof oldRenderShop === 'function' && !oldRenderShop.__dlinkyAvatarPreviewOnly){
    const patched = function(){
      const r = oldRenderShop.apply(this, arguments);
      requestAnimationFrame(paintAvatarPreview);
      setTimeout(paintAvatarPreview, 80);
      return r;
    };
    patched.__dlinkyAvatarPreviewOnly = true;
    window.renderShop = patched;
    try{ renderShop = patched; }catch(e){}
  }

  document.addEventListener('click', function(e){
    if(e.target && e.target.closest && e.target.closest('#tab-store .shop-tabs button,#tab-store [data-shop-tab],#tab-store [data-frame-duration]')){
      setTimeout(paintAvatarPreview, 30);
      setTimeout(paintAvatarPreview, 180);
    }
  }, true);

  document.addEventListener('change', function(e){
    if(e.target && e.target.closest && e.target.closest('#tab-store [data-frame-duration],#tab-store [data-v3-duration]')){
      setTimeout(paintAvatarPreview, 30);
      setTimeout(paintAvatarPreview, 180);
    }
  }, true);

  const mo = new MutationObserver(function(){
    const store = q('#tab-store');
    if(store && store.classList.contains('active')) requestAnimationFrame(paintAvatarPreview);
  });
  function startObserve(){ const store=q('#tab-store'); if(store) mo.observe(store,{childList:true,subtree:true}); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startObserve, {once:true}); else startObserve();

  setTimeout(paintAvatarPreview, 100);
  setTimeout(paintAvatarPreview, 500);
  setTimeout(paintAvatarPreview, 1200);
})();


/* ===== FIX CIRÚRGICO: botão Comprar do modal de moldura clicável =====
   Só corrige o clique do #confirmFrameBuy quando o modal antigo usa dataset.
   Não mexe em loja, avatar, música, duração nem preço.
*/
(function(){
  if(window.__dlinkyModalComprarAcessivelFix) return;
  window.__dlinkyModalComprarAcessivelFix = true;

  function q(s,r=document){return r.querySelector(s)}
  function getTextNumber(s){const m=String(s||'').match(/\d+/);return m?Number(m[0]):0}
  function readUser(){
    try{ if(typeof user==='object' && user) return user; }catch(e){}
    try{return JSON.parse(localStorage.getItem('dlinkyUser')||'{}')}catch(e){return {}}
  }
  function saveUserSafe(u){
    try{ if(typeof user==='object' && user) Object.assign(user,u); }catch(e){}
    localStorage.setItem('dlinkyUser', JSON.stringify(u));
    try{ if(typeof renderDash==='function') renderDash(); }catch(e){}
    try{ if(typeof renderInventory==='function') renderInventory(); }catch(e){}
    try{ if(typeof applyProfileFrame==='function') applyProfileFrame(); }catch(e){}
  }
  function toastSafe(msg){try{ if(typeof toast==='function') toast(msg); }catch(e){} }
  function closeModal(){
    const m=q('#frameBuyModal');
    if(m){m.classList.remove('show');m.style.display='none';}
  }
  function itemFromModal(){
    const m=q('#frameBuyModal');
    const idx=Number(m?.dataset?.idx||0);
    const list=window.__dlinkyVisibleFrames||[];
    let it=list[idx];
    const name=q('#frameBuyName')?.textContent?.trim()||'Moldura';
    const img=q('#frameBuyImg')?.getAttribute('src')||'';
    if(Array.isArray(it)) return {name:it[0]||name,url:it[5]||img};
    if(it && typeof it==='object') return {name:it.name||name,url:it.url||it.frameUrl||img,id:it.id};
    return {name,url:img};
  }

  window.__dlinkyForceFrameBuyFromModal = function(){
    const m=q('#frameBuyModal');
    if(!m || !m.classList.contains('show')) return;

    const item=itemFromModal();
    const duration=(m.dataset.duration||q('#frameBuyDuration')?.textContent||'3 dias').trim();
    const price=Number(m.dataset.price||getTextNumber(q('#frameBuyPrice')?.textContent)||0);
    const u=readUser();
    u.coins=Number(u.coins||u.linkwuans||0);
    u.linkwuans=u.coins;
    u.inventory=Array.isArray(u.inventory)?u.inventory:[];
    u.purchases=Array.isArray(u.purchases)?u.purchases:[];

    if(price>0 && u.coins < price){
      closeModal();
      toastSafe('Saldo insuficiente em Linkwuans.');
      return;
    }

    if(price>0) u.coins -= price;
    u.linkwuans = u.coins;
    const url=item.url||'';
    const invItem={
      id:item.id||('frame_'+Date.now()),
      type:'frames',kind:'frame',source:'admin',
      name:item.name||'Moldura',
      url:url,frameUrl:url,value:'custom-frame',
      duration:duration,
      price:price+' Linkwuans',
      boughtAt:Date.now(),date:Date.now()
    };
    if(url){
      u.inventory=u.inventory.filter(x=>String(x.url||x.frameUrl||'')!==String(url));
      u.inventory.unshift(invItem);
      u.frame=url;
      u.frameUrl=url;
      u.frameName=invItem.name;
      u.decoration='none';
    }
    u.__hasPurchasedFrame=true;
    u.__hasPurchasedItem=true;
    u.__cleanNewAccount=false;
    u.purchases.unshift({id:Date.now(),method:'Linkwuans',status:'Aprovado',value:price+' Linkwuans',date:new Date().toLocaleDateString('pt-BR')});
    saveUserSafe(u);
    closeModal();
    toastSafe('Moldura comprada e salva no inventário!');
  };

  const st=document.createElement('style');
  st.textContent='#frameBuyModal.show{pointer-events:auto!important;z-index:999999!important}#frameBuyModal.show *{pointer-events:auto!important}#confirmFrameBuy{pointer-events:auto!important;cursor:pointer!important;opacity:1!important;visibility:visible!important}';
  document.head.appendChild(st);
})();



/* ===== FIX FINAL CONTAS: cada email separado, loja/admin global, sem mudar molduras ===== */
(function(){
  if(window.__dlinkyAccountsFinalSafe) return;
  window.__dlinkyAccountsFinalSafe = true;

  const q = (s,r=document)=>r.querySelector(s);
  const qa = (s,r=document)=>Array.from(r.querySelectorAll(s));

  function normEmail(v){
    return String(v || "").trim().toLowerCase();
  }

  function cleanSlug2(v){
    return (v || "usuario")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g,"")
      .replace(/[^a-z0-9_-]/g,"")
      .slice(0,30) || "usuario";
  }

  function read(k, fb){
    try{
      const raw = localStorage.getItem(k);
      if(!raw) return fb;
      return JSON.parse(raw);
    }catch(e){
      return fb;
    }
  }

  function write(k, v){
    localStorage.setItem(k, JSON.stringify(v));
    try{ if(window.dlinkyCloudSaveNow) window.dlinkyCloudSaveNow(); }catch(e){}
  }

  function accKey(email){
    return "dlinkyAccount_" + normEmail(email);
  }

  function saveGlobalUserCache(u){
    write("dlinkyUser", u);
  }

  function makeBlankAccount(data){
    const email = normEmail(data.email);
    const slug = cleanSlug2(data.slug || (email ? email.split("@")[0] : "usuario"));
    return {
      name: data.name || slug,
      slug,
      email,

      bio:"",
      avatar:"",
      banner:"",
      bg:"",
      video:"",
      frame:"",
      music:"",
      welcome:"Clique aqui",
      color:"#a855f7",
      particles:true,
      particleType:"snow",
      verified:false,
      hideViews:false,
      template:"default",
      decoration:"none",
      views:0,

      coins:0,
      inventory:[],
      purchases:[],
      embeds:[],
      tags:[],
      links:[],
      socials:[],

      opacity:100,
      blur:0,
      layout:"card",
      center:"no",
      cursor:"",
      cardColor:"#06030b",
      textColor:"#ffffff",
      bioColor:"#eeeeee",
      bgFx:"none",

      history:["Conta criada no Dlinky"]
    };
  }

  function saveCurrentAccount(){
    if(!window.user || !user.email) return;
    const email = normEmail(user.email);
    write(accKey(email), user);
    localStorage.setItem("dlinkyCurrentEmail", email);
    saveGlobalUserCache(user);
  }

  function migrateCurrentIfNeeded(){
    const current = read("dlinkyUser", null);
    if(current && current.email){
      const email = normEmail(current.email);
      if(!read(accKey(email), null)){
        write(accKey(email), current);
      }
      localStorage.setItem("dlinkyCurrentEmail", email);
      return current;
    }
    return null;
  }

  function loadAccount(email){
    email = normEmail(email);
    if(!email) return null;

    let acc = read(accKey(email), null);

    // Proteção pro seu perfil antigo: se o dlinkyUser atual for desse email, migra ele em vez de zerar.
    const global = read("dlinkyUser", null);
    if(!acc && global && normEmail(global.email) === email){
      acc = global;
      write(accKey(email), acc);
    }

    if(!acc){
      acc = makeBlankAccount({email});
      write(accKey(email), acc);
    }

    window.user = acc;
    try{ user = acc; }catch(e){}

    localStorage.setItem("dlinkyCurrentEmail", email);
    saveGlobalUserCache(acc);

    setTimeout(()=>{ try{ renderDash(); }catch(e){} }, 80);
    return acc;
  }

  // Ao abrir o site, preserva a conta que já estava logada.
  const migrated = migrateCurrentIfNeeded();
  const currentEmail = normEmail(localStorage.getItem("dlinkyCurrentEmail") || (migrated && migrated.email) || "");
  if(currentEmail){
    const acc = read(accKey(currentEmail), null);
    if(acc){
      window.user = acc;
      try{ user = acc; }catch(e){}
      saveGlobalUserCache(acc);
      setTimeout(()=>{ try{ renderDash(); }catch(e){} }, 100);
    }
  }

  // Troca saveUser para salvar dentro da conta atual, não global misturado.
  window.saveUser = function(){
    saveCurrentAccount();
    try{ renderDash(); }catch(e){}
    try{ toast("Salvo com sucesso!"); }catch(e){}
  };
  try{ saveUser = window.saveUser; }catch(e){}

  window.addHistory = function(t){
    if(!user.history) user.history = [];
    user.history = [
      `${new Date().toLocaleString("pt-BR")} — ${t}`,
      ...user.history
    ].slice(0,20);
    saveCurrentAccount();
  };
  try{ addHistory = window.addHistory; }catch(e){}

  // Registro: conta nova vem limpa. Loja/admin/molduras continuam globais.
  const reg = q("#registerForm");
  if(reg){
    reg.onsubmit = function(e){
      e.preventDefault();

      const p1 = q("#regPass")?.value || "";
      const p2 = q("#regPass2")?.value || "";
      if(p1 !== p2){
        try{ toast("As senhas não conferem"); }catch(err){}
        return;
      }

      const email = normEmail(q("#regEmail")?.value || "");
      if(!email){
        try{ toast("Digite seu e-mail."); }catch(err){}
        return;
      }

      let acc = read(accKey(email), null);

      if(!acc){
        acc = makeBlankAccount({
          name: q("#regName")?.value?.trim() || "",
          slug: q("#regSlug")?.value?.trim() || "",
          email
        });
        write(accKey(email), acc);
      }

      window.user = acc;
      try{ user = acc; }catch(err){}

      localStorage.setItem("dlinkyCurrentEmail", email);
      saveGlobalUserCache(acc);

      location.hash = "#/dashboard";
      setTimeout(()=>{ try{ renderDash(); }catch(err){} }, 100);
    };
  }

  // Login: entra na conta daquele email. Se nunca existiu, cria limpa.
  const login = q("#loginForm");
  if(login){
    login.onsubmit = function(e){
      e.preventDefault();

      const email = normEmail(q("#loginEmail")?.value || "");
      if(!email){
        try{ toast("Digite seu e-mail."); }catch(err){}
        return;
      }

      loadAccount(email);

      location.hash = "#/dashboard";
      setTimeout(()=>{ try{ renderDash(); }catch(err){} }, 100);
    };
  }

  // Sair: só desloga da conta atual, não apaga loja/admin/molduras.
  setTimeout(()=>{
    const logout = q("#logoutBtn");
    if(logout){
      logout.onclick = function(){
        localStorage.removeItem("dlinkyCurrentEmail");
        localStorage.removeItem("dlinkyUser");
        try{ if(window.dlinkyCloudSaveNow) window.dlinkyCloudSaveNow(); }catch(e){}
        location.hash = "#/";
      };
    }
  },300);

  // Corrige bug: abrir perfil por link não pode trocar o slug da conta logada.
  const oldRoute = window.route || (typeof route === "function" ? route : null);
  window.route = function(){
    const pathSlug = window.__dlinkyDirectProfileSlug || "";
    const h = location.hash || (pathSlug ? "#/" + pathSlug : "#/");

    qa(".page").forEach(p=>p.classList.remove("active"));

    if((h === "#/" || h === "#") && !pathSlug){
      q("#landing")?.classList.add("active");
      return;
    }

    if(h === "#/register"){
      q("#auth")?.classList.add("active");
      if(q("#registerForm")) q("#registerForm").style.display = "block";
      if(q("#loginForm")) q("#loginForm").style.display = "none";
      return;
    }

    if(h === "#/login"){
      q("#auth")?.classList.add("active");
      if(q("#registerForm")) q("#registerForm").style.display = "none";
      if(q("#loginForm")) q("#loginForm").style.display = "block";
      return;
    }

    if(h === "#/dashboard"){
      q("#dashboard")?.classList.add("active");
      try{ renderDash(); }catch(e){}
      return;
    }

    if(h === "#/profile" || h === "#/" + (user && user.slug) || (pathSlug && h === "#/" + pathSlug)){
      q("#profile")?.classList.add("active");
      // NÃO muda user.slug aqui.
      try{ renderProfile(); }catch(e){}
      return;
    }

    if(oldRoute){
      try{ return oldRoute(); }catch(e){}
    }
  };
  try{ route = window.route; }catch(e){}
  window.removeEventListener("hashchange", oldRoute);
  window.addEventListener("hashchange", window.route);

  window.dlinkyAccountDebug = function(){
    const email = normEmail(localStorage.getItem("dlinkyCurrentEmail") || "");
    console.log("email atual:", email);
    console.log("conta atual:", read(accKey(email), null));
    console.log("molduras globais:", read("dlinkyCustomFrames", []));
  };
})();
