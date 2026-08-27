const SUPABASE_URL='https://hipzrtvrgjdeldfyudbc.supabase.co';
const SUPABASE_KEY='sb_publishable_NKHdv4Mza99fjiMBPk8C9A_bxcYmsmD';
const client=supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true}});
const $=id=>document.getElementById(id);
const sidebar=$('sidebar'),backdrop=$('backdrop'),menu=$('menu'),logout=$('logout');
const homeWorkspace=document.querySelector('.home-workspace');
const main=document.querySelector('.main');
const pageTitle=document.querySelector('.topbar h1');
const pageEyebrow=document.querySelector('.topbar .eyebrow');
const navItems=[...document.querySelectorAll('.nav-item')];
const pageDescriptions={
  'Bots':'Create, configure and manage your production bots.',
  'All Bots':'Search, filter and inspect every bot in the system.',
  'Instructions':'Manage bot-specific instructions without affecting other bots.',
  'Webs Joined':'Manage websites connected to your bots.',
  'API Bot Usage':'Inspect real request and response usage by bot and website.',
  'Audit Logs':'Review owner actions and important system events.',
  'Sadeeq AI':'Owner generation workspace for creative and AI outputs.',
  'API Keys':'Securely manage AI provider configurations and credentials.',
  'Account & Security':'Manage owner identity, password, PIN and security controls.'
};
const pageIds={Bots:'bots','All Bots':'all-bots',Instructions:'instructions','Webs Joined':'webs-joined','API Bot Usage':'usage','Audit Logs':'audit','Sadeeq AI':'sadeeq-ai','API Keys':'api-keys','Account & Security':'security'};
let sectionWorkspace;
function closeMenu(){sidebar?.classList.remove('open');backdrop?.classList.remove('show')}
menu?.addEventListener('click',()=>{sidebar.classList.add('open');backdrop.classList.add('show')});
backdrop?.addEventListener('click',closeMenu);
logout?.addEventListener('click',async()=>{logout.disabled=true;await client.auth.signOut();location.href='./auth.html#login'});
function ensureSectionWorkspace(){
  if(sectionWorkspace)return sectionWorkspace;
  sectionWorkspace=document.createElement('section');
  sectionWorkspace.className='section-workspace';
  sectionWorkspace.innerHTML='<div class="section-card"><span class="badge">OWNER MODULE</span><div class="section-icon">✦</div><h2 id="section-heading"></h2><p id="section-description"></p><div class="section-status"><span class="status-dot"></span><span>Module ready for its dedicated implementation level</span></div></div>';
  main.appendChild(sectionWorkspace);
  return sectionWorkspace;
}
function routePage(name,updateHash=true){
  const isHome=name==='Home';
  navItems.forEach(n=>n.classList.toggle('active',n.dataset.page===name));
  pageTitle.textContent=name;
  pageEyebrow.textContent=isHome?'CONTROL CENTER':'OWNER MODULE';
  if(isHome){homeWorkspace.style.display='flex';if(sectionWorkspace)sectionWorkspace.style.display='none'}
  else{
    homeWorkspace.style.display='none';
    const view=ensureSectionWorkspace();
    view.style.display='flex';
    view.querySelector('#section-heading').textContent=name;
    view.querySelector('#section-description').textContent=pageDescriptions[name]||'Owner-controlled workspace.';
  }
  closeMenu();
  if(updateHash)history.replaceState(null,'','#'+(isHome?'home':pageIds[name]||name.toLowerCase().replace(/\s+/g,'-')));
}
navItems.forEach(item=>item.addEventListener('click',e=>{e.preventDefault();routePage(item.dataset.page)}));
window.addEventListener('hashchange',()=>{const hash=location.hash.slice(1);const item=navItems.find(n=>(n.dataset.page==='Home'?'home':pageIds[n.dataset.page])===hash);routePage(item?item.dataset.page:'Home',false)});
const power=$('power'),mode=$('mode'),powerLabel=$('power-label'),modeLabel=$('mode-label'),modeBadge=$('mode-badge'),state=$('workspace-state'),message=$('home-message'),form=$('home-form'),send=$('send');
function renderControls(){const p=power.checked,m=mode.checked;powerLabel.textContent=p?'System operational':'All bots temporarily disabled';modeLabel.textContent=m?'Prompt Mode':'Chat Mode';modeBadge.textContent=m?'PROMPT MODE':'CHAT MODE';state.textContent=m?'Controlled instruction execution is active.':'Normal conversational interaction is active.';message.placeholder=m?'Enter a controlled system instruction…':'Message Sadeeq AI…'}
async function loadControls(){const{data,error}=await client.from('sadeeq_system_controls').select('power_on,prompt_mode').eq('id',true).maybeSingle();if(error||!data)return false;power.checked=data.power_on;mode.checked=data.prompt_mode;renderControls();return true}
let saving=false;
async function saveControls(){if(saving)return;saving=true;power.disabled=true;mode.disabled=true;const{data,error}=await client.rpc('sadeeq_set_system_controls',{p_power_on:power.checked,p_prompt_mode:mode.checked});if(error||!data){await loadControls();alert('Unable to save system controls. No change was applied.')}else renderControls();power.disabled=false;mode.disabled=false;saving=false}
power?.addEventListener('change',saveControls);mode?.addEventListener('change',saveControls);
form?.addEventListener('submit',e=>{e.preventDefault();const text=message.value.trim();if(!text||send.disabled||!power.checked)return;const row=document.createElement('div');row.className='home-message-placeholder';row.textContent=mode.checked?'Prompt received. Execution will be connected to the controlled command layer in its dedicated level.':'Chat input received. AI runtime will be connected in its dedicated level.';document.getElementById('chat-board').appendChild(row);message.value=''});
(async()=>{const{data}=await client.auth.getSession();if(!data.session){location.replace('./auth.html#login');return}const{data:owner}=await client.from('sadeeq_owner_accounts').select('user_id').eq('user_id',data.session.user.id).maybeSingle();if(!owner){await client.auth.signOut();location.replace('./auth.html#login');return}await loadControls();renderControls();const hash=location.hash.slice(1);const item=navItems.find(n=>(n.dataset.page==='Home'?'home':pageIds[n.dataset.page])===hash);routePage(item?item.dataset.page:'Home',false)})();
