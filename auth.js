const SUPABASE_URL='https://hipzrtvrgjdeldfyudbc.supabase.co';
const SUPABASE_KEY='sb_publishable_NKHdv4Mza99fjiMBPk8C9A_bxcYmsmD';
const client=supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const $=id=>document.getElementById(id);
const loginForm=$('login-form'),signupForm=$('signup-form'),statusBox=$('status');
const loginSwitch=$('show-login'),signupSwitch=$('show-signup');
function status(message,type=''){statusBox.textContent=message;statusBox.className='status '+type}
function showLogin(){loginForm.classList.remove('hidden');signupForm.classList.add('hidden');loginSwitch.classList.add('hidden');signupSwitch.classList.remove('hidden');$('title').textContent='Login';$('subtitle').textContent='This area is restricted to the system owner.'}
function showSignup(){loginForm.classList.add('hidden');signupForm.classList.remove('hidden');loginSwitch.classList.remove('hidden');signupSwitch.classList.add('hidden');$('title').textContent='Initial Owner Signup';$('subtitle').textContent='This account can be created only once.'}
function setSignupAvailability(available){signupSwitch.classList.toggle('hidden',!available);if(!available&&location.hash==='#signup')showLogin()}
async function ownerSignupAvailable(){const {data,error}=await client.rpc('sadeeq_owner_signup_available');if(error)return false;return data===true}
async function goOwnerGate(){const {data}=await client.auth.getSession();if(!data.session){showLogin();return}window.location.href='./dashboard.html'}
loginSwitch.onclick=showLogin;
signupSwitch.onclick=showSignup;
loginForm.addEventListener('submit',async e=>{e.preventDefault();const btn=loginForm.querySelector('button');btn.disabled=true;status('Signing in...');const email=$('email').value.trim();const {data,error}=await client.auth.signInWithPassword({email,password:$('password').value});if(error||!data.session){status('Login failed. Check your email and password.','error');btn.disabled=false;return}await goOwnerGate()});
signupForm.addEventListener('submit',async e=>{e.preventDefault();const email=$('signup-email').value.trim();const password=$('signup-password').value;const confirm=$('signup-confirm').value;if(password.length<8){status('Password must be at least 8 characters.','error');return}if(password!==confirm){status('Passwords do not match.','error');return}const btn=signupForm.querySelector('button');btn.disabled=true;status('Creating the initial owner account...');if(!(await ownerSignupAvailable())){status('Initial Owner Signup is already closed.','error');setSignupAvailability(false);btn.disabled=false;return}const {data,error}=await client.auth.signUp({email,password});if(error){status(error.message,'error');btn.disabled=false;return}if(data.session){status('Owner account created successfully.','ok');setTimeout(()=>goOwnerGate(),500)}else{status('Account created. Confirm your email, then use Login.','ok');showLogin()}btn.disabled=false});
(async()=>{const available=await ownerSignupAvailable();setSignupAvailability(available);if(location.hash==='#signup'&&available)showSignup();else showLogin()})();
