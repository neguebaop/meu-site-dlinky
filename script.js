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


/* ===== RESET REAL UMA VEZ: LIMPAR MOLDURAS ANTIGAS E DEIXAR ADMIN CADASTRAR DE NOVO ===== */
(function(){
  const RESET_VERSION = "reset_molduras_antigas_real_v1";

  function read(k,fb){
    try{
      const raw = localStorage.getItem(k);
      if(!raw) return fb;
      return JSON.parse(raw);
    }catch(e){return fb}
  }

  function write(k,v){
    localStorage.setItem(k, JSON.stringify(v));
  }

  function resetOldFramesOnce(){
    if(localStorage.getItem("__dlinky_reset_frames_version") === RESET_VERSION) return;

    // Apaga depósitos antigos de moldura.
    [
      "dlinkyCustomFrames_BACKUP",
      "dlinkyFrames",
      "dlinkyFrames_BACKUP",
      "dlinkyFrameVault",
      "dlinkyFrameVault_BACKUP",
      "dlinkyAdminGifts_BACKUP",
      "dlinkyLastGoodFrameUrl",
      "dlinkyEquippedFrame",
      "dlinkySelectedFrame",
      "dlinkyCurrentFrame"
    ].forEach(k => localStorage.removeItem(k));

    // Começa Admin limpo.
    write("dlinkyCustomFrames", []);
    write("dlinkyAdminGifts", []);

    // Limpa só molduras antigas do usuário.
    const u = read("dlinkyUser", {});
    if(u && typeof u === "object"){
      u.inventory = [];
      u.frame = "";
      u.frameUrl = "";
      u.frameName = "";
      u.frameDesc = "";
      u.activeFrameId = "";
      u.equippedFrame = "";
      u.selectedFrame = "";
      u.currentFrame = "";
      u.decoration = "none";
      write("dlinkyUser", u);
      try{
        if(typeof user === "object" && user) Object.assign(user, u);
      }catch(e){}
    }

    localStorage.setItem("__dlinky_reset_frames_version", RESET_VERSION);
  }

  resetOldFramesOnce();

  // Corrige botão/aba da loja sem travar clique.
  document.addEventListener("click", function(e){
    const b = e.target.closest && e.target.closest("#tab-store [data-shop-tab]");
    if(!b) return;

    const mode = b.dataset.shopTab;
    if(!mode) return;

    try{ shopMode = mode; }catch(err){}
    window.shopMode = mode;
  }, true);

  // Garante que o contador não fique 1 depois do reset.
  setTimeout(function(){
    const u = read("dlinkyUser", {});
    if(u && Array.isArray(u.inventory) && u.inventory.length === 0){
      ["invItemsCount","invCountMini"].forEach(id=>{
        const el = document.getElementById(id);
        if(el) el.textContent = "0";
      });
      const grid = document.getElementById("inventoryGrid");
      if(grid) grid.innerHTML = "<p>Você ainda não possui itens no inventário.</p>";
    }
  }, 100);
})();
