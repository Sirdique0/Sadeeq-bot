const SUPABASE_URL='https://hipzrtvrgjdeldfyudbc.supabase.co';
const SUPABASE_KEY='sb_publishable_NKHdv4Mza99fjiMBPk8C9A_bxcYmsmD';
const client=supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true}});
const $=id=>document.getElementById(id);
const sidebar=$('sidebar'),backdrop=$('backdrop'),menu=$('menu'),logout=$('logout');
const page=document.body.dataset.page||document.querySelector('.topbar h1')?.textContent||'Home';
function closeMenu(){sidebar?.classList.remove('open');backdrop?.classList.remove('show')}
menu?.addEventListener('click',()=>{sidebar?.classList.add('open');backdrop?.classList.add('show')});
backdrop?.addEventListener('click',closeMenu);
logout?.addEventListener('click',async()=>{logout.disabled=true;await client.auth.signOut();location.href='./auth.html#login'});
document.querySelectorAll('.nav-item').forEach(item=>item.classList.toggle('active',item.dataset.page===page));
const power=$('power'),mode=$('mode'),powerLabel=$('power-label'),modeLabel=$('mode-label'),modeBadge=$('mode-badge'),state=$('workspace-state'),message=$('home-message'),form=$('home-form'),send=$('send');
function renderControls(){if(!power||!mode)return;const p=power.checked,m=mode.checked;if(powerLabel)powerLabel.textContent=p?'System operational':'All bots temporarily disabled';if(modeLabel)modeLabel.textContent=m?'Prompt Mode':'Chat Mode';if(modeBadge)modeBadge.textContent=m?'PROMPT MODE':'CHAT MODE';if(state)state.textContent=m?'Controlled instruction execution is active.':'Normal conversational interaction is active.';if(message)message.placeholder=m?'Enter a controlled system instruction…':'Message Sadeeq AI…'}
async function loadControls(){if(!power||!mode)return false;const{data,error}=await client.from('sadeeq_system_controls').select('power_on,prompt_mode').eq('id',true).maybeSingle();if(error||!data)return false;power.checked=data.power_on;mode.checked=data.prompt_mode;renderControls();return true}
let saving=false;
async function saveControls(){if(!power||!mode||saving)return;saving=true;power.disabled=true;mode.disabled=true;const{data,error}=await client.rpc('sadeeq_set_system_controls',{p_power_on:power.checked,p_prompt_mode:mode.checked});if(error||!data){await loadControls();alert('Unable to save system controls. No change was applied.')}else renderControls();power.disabled=false;mode.disabled=false;saving=false}
power?.addEventListener('change',saveControls);mode?.addEventListener('change',saveControls);
form?.addEventListener('submit',e=>{e.preventDefault();const text=message?.value.trim();if(!text||send?.disabled||!power.checked)return;const empty=document.querySelector('.chat-empty');if(empty)empty.style.display='none';const row=document.createElement('div');row.className='home-message-placeholder';row.textContent=mode.checked?'Prompt received. Execution will be connected to the controlled command layer in its dedicated level.':'Chat input received. AI runtime will be connected in its dedicated level.';document.getElementById('chat-board')?.appendChild(row);message.value=''});
(async()=>{const{data}=await client.auth.getSession();if(!data.session){location.replace('./auth.html#login');return}const{data:owner}=await client.from('sadeeq_owner_accounts').select('user_id').eq('user_id',data.session.user.id).maybeSingle();if(!owner){await client.auth.signOut();location.replace('./auth.html#login');return}await loadControls();renderControls()})();