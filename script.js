'use strict';

/* DLINKY LEVE — Firebase Auth + Firestore, sem localStorage, sem loops pesados */
const firebaseConfig = {
  apiKey: "AIzaSyBQDC8YM_6tJKyF2irGmOiW8NYHeJkHdFI",
  authDomain: "dlinky-45df5.firebaseapp.com",
  projectId: "dlinky-45df5",
  storageBucket: "dlinky-45df5.firebasestorage.app",
  messagingSenderId: "329520494601",
  appId: "1:329520494601:web:d6f27af06c8d872121a0d8"
};

if (window.firebase && !firebase.apps.length) firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

const icons = {
  Instagram:'fa-brands fa-instagram', TikTok:'fa-brands fa-tiktok', Discord:'fa-brands fa-discord',
  YouTube:'fa-brands fa-youtube', Spotify:'fa-brands fa-spotify', WhatsApp:'fa-brands fa-whatsapp',
  Twitch:'fa-brands fa-twitch', Steam:'fa-brands fa-steam', Github:'fa-brands fa-github',
  Roblox:'fa-solid fa-square', Telegram:'fa-brands fa-telegram', X:'fa-brands fa-x-twitter'
};

const presetUrls = {
  bg1:'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1600&q=80',
  bg2:'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=1600&q=80',
  bg3:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
  banner1:'https://i.pinimg.com/originals/e6/67/64/e66764a7ae6b33bd2bab3ef8a19ca3b5.gif',
  banner2:'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
};

const defaultUser = {
  uid:'', name:'Usuário', slug:'usuario', email:'', bio:'', avatar:'', banner:'', bg:'', video:'', frame:'',
  music:'', welcome:'Clique aqui', color:'#a855f7', particles:false, particleType:'none', verified:false,
  hideViews:false, template:'default', decoration:'none', views:0, links:[], socials:[], embeds:[], tags:[], history:['Conta criada no Dlinky']
};

let user = {...defaultUser};
let currentAuthUser = null;
let assetMode = 'backgrounds';
let routeToken = 0;

window.user = user;

function cleanSlug(v){
  return String(v || 'usuario').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9_-]/g,'').slice(0,30) || 'usuario';
}
function escapeHtml(s=''){
  return String(s).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
}
function safeUrl(u=''){
  u = String(u || '').trim();
  return /^https?:\/\//i.test(u) ? u : '#';
}
function toast(t){
  const el = $('#toast');
  if(!el) return alert(t);
  el.textContent = t;
  el.className = 'show';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(()=>{ el.className=''; }, 2200);
}
function mergeUser(data){
  user = {...defaultUser, ...(data || {})};
  user.slug = cleanSlug(user.slug);
  user.links = Array.isArray(user.links) ? user.links : [];
  user.socials = Array.isArray(user.socials) ? user.socials : [];
  user.history = Array.isArray(user.history) ? user.history : [];
  window.user = user;
  return user;
}
function publicData(u){
  const copy = {...u};
  delete copy.password;
  return copy;
}
async function loadUserByUid(uid){
  if(!uid) return mergeUser(defaultUser);
  const snap = await db.collection('users').doc(uid).get();
  if(snap.exists) return mergeUser(snap.data());
  return mergeUser({...defaultUser, uid, email:(auth.currentUser?.email || '').toLowerCase()});
}
async function loadProfileBySlug(slug){
  slug = cleanSlug(slug);
  const snap = await db.collection('profiles').doc(slug).get();
  if(snap.exists) return mergeUser(snap.data());
  return mergeUser({...defaultUser, slug});
}
async function saveUser(message='Salvo com sucesso!'){
  if(!currentAuthUser){ toast('Faça login para salvar.'); return; }
  user.uid = currentAuthUser.uid;
  user.email = (currentAuthUser.email || user.email || '').toLowerCase().trim();
  user.slug = cleanSlug(user.slug);
  user.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
  await db.collection('users').doc(currentAuthUser.uid).set(publicData(user), {merge:true});
  await db.collection('profiles').doc(user.slug).set(publicData(user), {merge:true});
  renderDash();
  if($('#profile')?.classList.contains('active')) renderProfile();
  if(message) toast(message);
}
function addHistory(t){
  user.history = [`${new Date().toLocaleString('pt-BR')} — ${t}`, ...(user.history || [])].slice(0,30);
}

function setBg(el, url){
  if(!el) return;
  url = String(url || '').trim();
  if(el.tagName === 'IMG'){
    if(url){ el.src = url; el.style.display='block'; }
    else { el.removeAttribute('src'); el.style.display='none'; }
    return;
  }
  el.style.backgroundImage = url ? `url("${url.replace(/"/g, '%22')}")` : '';
  el.style.backgroundSize = 'cover';
  el.style.backgroundPosition = 'center';
  el.style.backgroundRepeat = 'no-repeat';
}
function setInput(id, value){
  const el = $(id);
  if(!el || document.activeElement === el) return;
  if(el.type === 'checkbox') el.checked = !!value;
  else el.value = value || '';
}

function hideAllPages(){ $$('.page').forEach(p=>p.classList.remove('active')); }
function showPage(id){ hideAllPages(); $(id)?.classList.add('active'); }
function getPathSlug(){
  const p = (location.pathname || '/').replace(/^\/+/, '').split('/')[0];
  const reserved = ['', 'index.html', 'login', 'register', 'dashboard', 'assets', 'premium', 'community'];
  return reserved.includes(p.toLowerCase()) ? '' : decodeURIComponent(p).toLowerCase();
}
async function route(){
  const token = ++routeToken;
  const pathSlug = getPathSlug();
  const h = location.hash || (pathSlug ? '#/'+pathSlug : '#/');
  if(h === '#/' || h === '#') { showPage('#landing'); return; }
  if(h === '#/register') { showPage('#auth'); $('#registerForm')&&( $('#registerForm').style.display='block'); $('#loginForm')&&($('#loginForm').style.display='none'); return; }
  if(h === '#/login') { showPage('#auth'); $('#registerForm')&&( $('#registerForm').style.display='none'); $('#loginForm')&&($('#loginForm').style.display='block'); return; }
  if(h === '#/dashboard') { showPage('#dashboard'); renderDash(); return; }
  if(h === '#/assets') { simple('Linky Assets','Área de backgrounds, banners e decorações.'); return; }
  if(h === '#/premium') { simple('Premium Dlinky','Área premium em construção.'); return; }

  const slug = pathSlug || h.replace(/^#\//,'');
  showPage('#profile');
  await loadProfileBySlug(slug);
  if(token !== routeToken) return;
  renderProfile();
}
function simple(t,p){ showPage('#simple'); $('#simpleTitle')&&($('#simpleTitle').textContent=t); $('#simpleText')&&($('#simpleText').textContent=p); }
window.addEventListener('hashchange', route);

function openTab(id){
  $$('.dash-tab').forEach(x=>x.classList.remove('active'));
  $('#tab-'+id)?.classList.add('active');
  $$('.side-link').forEach(x=>x.classList.toggle('active', x.dataset.tab === id));
  $('.sidebar')?.classList.remove('open');
  if(id === 'links') renderLinksEditor();
  if(id === 'socials') renderSocialEditor();
  if(id === 'assets') renderAssets();
  if(id === 'history') renderHistory();
}
window.openTab = openTab;

function renderDash(){
  document.documentElement.style.setProperty('--neon', user.color || '#a855f7');
  $('#sideName') && ($('#sideName').textContent = user.name || 'Usuário');
  $('#sideUrl') && ($('#sideUrl').textContent = 'dlinky/' + (user.slug || 'usuario'));
  $('#dashName') && ($('#dashName').textContent = user.name || 'Usuário');
  $('#dashSlug') && ($('#dashSlug').textContent = '@' + (user.slug || 'usuario'));
  $('#viewsCount') && ($('#viewsCount').textContent = user.views || 0);
  setBg($('#dashAvatar'), user.avatar);
  setBg($('#sideAvatar'), user.avatar);
  setInput('#cfgName', user.name);
  setInput('#cfgSlug', user.slug);
  setInput('#cfgBio', user.bio);
  setInput('#cfgMusic', user.music);
  setInput('#cfgWelcome', user.welcome || 'Clique aqui');
  setInput('#cfgAvatar', user.avatar);
  setInput('#cfgBanner', user.banner);
  setInput('#cfgBg', user.bg);
  setInput('#cfgVideo', user.video);
  setInput('#cfgFrame', user.frame);
  setInput('#cfgColor', user.color || '#a855f7');
  setInput('#cfgParticleType', user.particleType || 'none');
  setInput('#cfgTemplate', user.template || 'default');
  setInput('#cfgDecoration', user.decoration || 'none');
  setInput('#cfgVerified', user.verified);
  setInput('#cfgHideViews', user.hideViews);
  renderHistory();
}
function renderHistory(){
  const h = $('#historyList');
  if(h) h.innerHTML = (user.history || []).map(x=>`<li>${escapeHtml(x)}</li>`).join('') || '<li>Nenhum histórico ainda.</li>';
}

function renderProfile(){
  document.documentElement.style.setProperty('--neon', user.color || '#a855f7');
  $('#welcomeText') && ($('#welcomeText').textContent = user.welcome || 'Clique aqui');
  $('#entryOverlay')?.classList.add('hidden');
  $('#profileName') && ($('#profileName').textContent = user.name || 'Usuário');
  $('#profileSlug2') && ($('#profileSlug2').textContent = '@' + (user.slug || 'usuario'));
  $('#profileBio') && ($('#profileBio').textContent = user.bio || '');
  $('#verifiedBadge') && ($('#verifiedBadge').style.display = user.verified ? 'inline' : 'none');
  $('#profileViews') && ($('#profileViews').style.display = user.hideViews ? 'none' : 'inline-block');
  $('#profileViews') && ($('#profileViews').textContent = `👁 ${user.views || 0} views`);

  // Avatar fixo: só lê user.avatar. Nada de fallback antigo, nada de timer apagando.
  setBg($('#profileAvatar'), user.avatar);
  setBg($('#profileBanner'), user.banner);
  setBg($('#profileBg'), user.bg);

  const vid = $('#profileVideo');
  if(vid){
    vid.classList.remove('show');
    vid.removeAttribute('src');
    if(user.video){ vid.src = user.video; vid.load(); vid.classList.add('show'); vid.play().catch(()=>{}); }
  }
  const frame = $('#profileFrame');
  if(frame){ frame.src = user.frame || ''; frame.style.display = user.frame ? 'block' : 'none'; }
  const deco = $('#avatarDecoration');
  if(deco) deco.className = 'avatar-decoration ' + (user.decoration || 'none');

  const links = $('#profileLinks');
  if(links) links.innerHTML = (user.links || []).map(l => `<a target="_blank" rel="noopener" href="${safeUrl(l.url)}">${escapeHtml(l.name || 'Link')}</a>`).join('');

  const socials = $('#profileSocials');
  if(socials) socials.innerHTML = (user.socials || []).filter(s=>s.on).map(s => {
    const name = String(s.name || 'link');
    const cls = icons[name] || 'fa-solid fa-link';
    return `<a class="social-icon brand-${name.toLowerCase().replace(/[^a-z0-9]/g,'')}" target="_blank" rel="noopener" title="${escapeHtml(name)}" href="${safeUrl(s.url)}"><i class="${cls}"></i></a>`;
  }).join('');

  const audio = $('#profileAudio');
  if(audio && audio.getAttribute('src') !== (user.music || '')){ audio.src = user.music || ''; if(user.music) audio.load(); }
  createProfileParticles(user.particleType || 'none');
}
window.renderProfile = renderProfile;
window.renderDash = renderDash;

function createProfileParticles(type){
  const layer = $('#profileParticleLayer');
  if(!layer) return;
  layer.innerHTML = '';
  if(type === 'none' || !user.particles) return;
  const char = {snow:'✽', stars:'✦', hearts:'❤', embers:'•', bubbles:''}[type] || '✽';
  const cls = {snow:'snow', stars:'star', hearts:'heart', embers:'ember', bubbles:'bubble'}[type] || 'star';
  const count = 16;
  for(let i=0;i<count;i++){
    const s = document.createElement('span');
    s.className = 'fx ' + cls;
    s.textContent = char;
    s.style.left = Math.random()*100 + '%';
    s.style.animationDuration = (8+Math.random()*12) + 's';
    s.style.animationDelay = (-Math.random()*12) + 's';
    s.style.fontSize = (12+Math.random()*12) + 'px';
    layer.appendChild(s);
  }
}

function renderLinksEditor(){
  const box = $('#linksEditor'); if(!box) return;
  box.innerHTML = '';
  (user.links || []).forEach((l,i)=>{
    box.insertAdjacentHTML('beforeend', `<div class="link-row"><input value="${escapeHtml(l.name || '')}" data-link-name="${i}" placeholder="Nome"><input value="${escapeHtml(l.url || '')}" data-link-url="${i}" placeholder="https://"><button class="delete" type="button" data-del-link="${i}">×</button></div>`);
  });
}
function renderSocialEditor(){
  const box = $('#socialEditor'); if(!box) return;
  const list = user.socials && user.socials.length ? user.socials : [];
  user.socials = list;
  box.innerHTML = '';
  list.forEach((s,i)=>{
    box.insertAdjacentHTML('beforeend', `<div class="social-row"><select data-social-name="${i}">${Object.keys(icons).map(n=>`<option ${n===s.name?'selected':''}>${n}</option>`).join('')}</select><input data-social-url="${i}" value="${escapeHtml(s.url || '')}" placeholder="https://"><label class="check"><input type="checkbox" data-social-on="${i}" ${s.on?'checked':''}> Ativo</label><button class="delete" type="button" data-del-social="${i}">×</button></div>`);
  });
}
const assets = {
  backgrounds:[['Nebula Roxa', presetUrls.bg2, false], ['Noite Azul', presetUrls.bg1, false], ['Floresta Dark', presetUrls.bg3, false]],
  banners:[['Anime banner', presetUrls.banner1, false], ['Estrelas banner', presetUrls.banner2, false]],
  decorations:[['Anel roxo','purple-ring',false], ['Anel vermelho','red-ring',false], ['Brilhos','sparkle-frame',false], ['Órbita','orbit-frame',false]],
  music:[['Cole seu .mp3','',false]]
};
function renderAssets(){
  const grid = $('#assetGrid'); if(!grid) return;
  grid.innerHTML = '';
  (assets[assetMode] || []).forEach((a,idx)=>{
    const prev = String(a[1]||'').startsWith('http') ? `style="background-image:url('${a[1]}')"` : '';
    grid.insertAdjacentHTML('beforeend', `<div class="asset-card"><div class="asset-preview" ${prev}>${!prev?'<span style="display:grid;place-items:center;height:100%;font-size:36px">✦</span>':''}</div><div class="asset-body"><b>${escapeHtml(a[0])}</b><small>Grátis</small><button class="btn primary small" type="button" data-use-asset="${idx}">Usar</button></div></div>`);
  });
}

function bindEvents(){
  document.addEventListener('click', async e => {
    const goto = e.target.closest('[data-goto]');
    if(goto){ location.hash = '#/' + goto.dataset.goto; return; }
    const tab = e.target.closest('[data-tab]');
    if(tab){ openTab(tab.dataset.tab); return; }
    const ac = e.target.closest('[data-action]');
    if(ac){
      if(ac.dataset.action === 'openSide') $('.sidebar')?.classList.add('open');
      if(ac.dataset.action === 'closeSide') $('.sidebar')?.classList.remove('open');
      if(ac.dataset.action === 'collapseSide') $('#sidebar')?.classList.toggle('collapsed');
      if(ac.dataset.action === 'toggleTheme') document.body.classList.toggle('light');
      return;
    }
    if(e.target.dataset.delLink !== undefined){
      user.links.splice(Number(e.target.dataset.delLink),1); renderLinksEditor(); return;
    }
    if(e.target.dataset.delSocial !== undefined){
      user.socials.splice(Number(e.target.dataset.delSocial),1); renderSocialEditor(); return;
    }
    if(e.target.dataset.assetTab){
      assetMode = e.target.dataset.assetTab;
      $$('.asset-tabs button').forEach(b=>b.classList.toggle('active', b.dataset.assetTab === assetMode));
      renderAssets(); return;
    }
    if(e.target.dataset.useAsset !== undefined){
      const a = (assets[assetMode] || [])[Number(e.target.dataset.useAsset)];
      if(!a) return;
      if(assetMode === 'backgrounds') user.bg = a[1];
      if(assetMode === 'banners') user.banner = a[1];
      if(assetMode === 'decorations') user.decoration = a[1];
      if(assetMode === 'music') user.music = a[1];
      addHistory('Asset aplicado: ' + a[0]);
      await saveUser('Asset salvo!');
      return;
    }
  });

  $('#registerForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    if($('#regPass').value !== $('#regPass2').value) return toast('As senhas não conferem');
    try{
      const cred = await auth.createUserWithEmailAndPassword($('#regEmail').value.trim(), $('#regPass').value);
      currentAuthUser = cred.user;
      mergeUser({...defaultUser, uid:cred.user.uid, name:$('#regName').value.trim() || 'Usuário', slug:cleanSlug($('#regSlug').value), email:cred.user.email});
      addHistory('Conta registrada');
      await saveUser('Conta criada!');
      location.hash = '#/dashboard';
    }catch(err){ toast('Erro ao registrar: ' + err.message); }
  });
  $('#loginForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    try{
      const cred = await auth.signInWithEmailAndPassword($('#loginEmail').value.trim(), $('#loginPass').value);
      currentAuthUser = cred.user;
      await loadUserByUid(cred.user.uid);
      renderDash();
      location.hash = '#/dashboard';
      toast('Login efetuado!');
    }catch(err){ toast('Erro no login: ' + err.message); }
  });
  $('#logoutBtn')?.addEventListener('click', async ()=>{ await auth.signOut(); mergeUser(defaultUser); location.hash='#/'; });
  $('#viewProfile')?.addEventListener('click', ()=>{ location.hash = '#/' + user.slug; });
  $('#viewProfile2')?.addEventListener('click', ()=>{ location.hash = '#/' + user.slug; });
  $('#backToDash')?.addEventListener('click', ()=>{ location.hash = '#/dashboard'; });
  $('#soundBtn')?.addEventListener('click', ()=>{ const a=$('#profileAudio'); if(!a || !user.music) return toast('Nenhuma música configurada'); a.paused ? a.play().catch(()=>{}) : a.pause(); });

  $('#saveAccount')?.addEventListener('click', async ()=>{
    user.name = $('#cfgName').value.trim() || user.name;
    user.slug = cleanSlug($('#cfgSlug').value);
    user.bio = $('#cfgBio').value;
    user.music = $('#cfgMusic').value.trim();
    user.welcome = $('#cfgWelcome').value.trim() || 'Clique aqui';
    addHistory('Configurações da conta alteradas');
    await saveUser();
  });
  $('#saveImages')?.addEventListener('click', async ()=>{
    // Salva exatamente o que estiver nos inputs. Se apagar o input, apaga no perfil também.
    user.avatar = $('#cfgAvatar').value.trim();
    user.banner = $('#cfgBanner').value.trim();
    user.bg = $('#cfgBg').value.trim();
    user.video = $('#cfgVideo').value.trim();
    user.frame = $('#cfgFrame').value.trim();
    addHistory('Imagens/fundos alterados');
    await saveUser('Imagens salvas!');
  });
  $('#saveTheme')?.addEventListener('click', async ()=>{
    user.color = $('#cfgColor').value || '#a855f7';
    user.particleType = $('#cfgParticleType').value || 'none';
    user.particles = user.particleType !== 'none';
    user.template = $('#cfgTemplate').value || 'default';
    user.decoration = $('#cfgDecoration').value || 'none';
    user.verified = !!$('#cfgVerified').checked;
    user.hideViews = !!$('#cfgHideViews').checked;
    addHistory('Tema/efeitos alterados');
    await saveUser();
  });
  $('#addLink')?.addEventListener('click', ()=>{ user.links.push({name:'Novo link', url:'https://'}); renderLinksEditor(); });
  $('#saveLinks')?.addEventListener('click', async ()=>{
    user.links = $$('.link-row').map(r => ({
      name: $('[data-link-name]', r)?.value.trim() || '',
      url: $('[data-link-url]', r)?.value.trim() || ''
    })).filter(x => x.name || x.url);
    addHistory('Links alterados');
    await saveUser('Links salvos!');
  });
  $('#addSocial')?.addEventListener('click', ()=>{ user.socials.push({name:'Instagram', url:'https://instagram.com/', on:true}); renderSocialEditor(); });
  $('#saveSocials')?.addEventListener('click', async ()=>{
    user.socials = $$('.social-row').map(r => ({
      name: $('[data-social-name]', r)?.value || 'Instagram',
      url: $('[data-social-url]', r)?.value.trim() || '',
      on: !!$('[data-social-on]', r)?.checked
    }));
    addHistory('Ícones sociais alterados');
    await saveUser('Ícones sociais salvos!');
  });
}

function startDashboardParticles(){
  const canvas = $('#particlesCanvas'); if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let dots = [];
  function resize(){
    canvas.width = innerWidth; canvas.height = innerHeight;
    dots = Array.from({length:14},()=>({x:Math.random()*canvas.width, y:Math.random()*canvas.height, r:Math.random()*1.8+1, v:Math.random()*0.35+0.1}));
  }
  addEventListener('resize', resize); resize();
  function anim(){
    if(!document.hidden && !$('#profile')?.classList.contains('active')){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = 'rgba(168,85,247,.65)';
      dots.forEach(d=>{ d.y+=d.v; if(d.y>canvas.height)d.y=-5; ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,Math.PI*2); ctx.fill(); });
    }
    requestAnimationFrame(anim);
  }
  requestAnimationFrame(anim);
}

auth.onAuthStateChanged(async fbUser => {
  currentAuthUser = fbUser || null;
  if(fbUser){
    await loadUserByUid(fbUser.uid);
    renderDash();
  }
  route();
});

document.addEventListener('DOMContentLoaded', ()=>{
  bindEvents();
  renderDash();
  startDashboardParticles();
  route();
});
