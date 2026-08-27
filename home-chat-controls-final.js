(()=>{
  const $=id=>document.getElementById(id);
  function setup(){
    if(document.body.dataset.page!=='Home')return;
    const board=$('chat-board'),form=$('home-form'),input=$('home-message'),send=$('send'),power=$('power');
    if(!board||!form||!input||!send||!power)return;
    const panes=()=>[board.querySelector('#chat-board'),board.querySelector('#prompt-board')].filter(Boolean);
    const ensurePaneTools=()=>{
      board.querySelectorAll('.mode-pane').forEach(p=>{
        if(p.querySelector('.board-toolbar'))return;
        const bar=document.createElement('div');bar.className='board-toolbar';
        const trash=document.createElement('button');trash.type='button';trash.className='board-trash';trash.textContent='🗑';trash.title='Clear this conversation';trash.setAttribute('aria-label','Clear this conversation');
        trash.addEventListener('click',()=>{
          if(p.id==='chat-board'){
            p.innerHTML='<div class="chat-empty"><div class="orb">✦</div><span class="badge">CHAT MODE</span><h3>Ready when you are.</h3><p>Normal conversational interaction is active.</p></div>';
            p.dataset.ready='1';
          }else{
            p.innerHTML='<div class="prompt-head"><span class="badge">PROMPT MODE</span><b>BOT CONTROL</b></div><p class="prompt-note"><strong>Controlled owner access.</strong> Existing bots can be changed, reset, disabled, suspended or deleted. Bot creation is not allowed here. If the target is unclear, nothing is changed.</p>';
            p.dataset.ready='1';
          }
          window.scrollTo?.(0,0);
        });
        bar.appendChild(trash);p.insertBefore(bar,p.firstChild);
      });
    };
    const syncPower=()=>{
      const on=power.checked;
      input.disabled=!on;
      send.disabled=!on;
      const label=$('power-label');if(label)label.textContent=on?'System operational':'System Power is OFF';
      form.classList.toggle('system-off',!on);
    };
    const observer=new MutationObserver(ensurePaneTools);observer.observe(board,{childList:true,subtree:true});
    ensurePaneTools();syncPower();power.addEventListener('change',()=>setTimeout(syncPower,0));
    window.addEventListener('sdq-home-power-sync',syncPower);
    window.addEventListener('beforeunload',()=>observer.disconnect(),{once:true});
    window.addEventListener('submit',e=>{
      if(e.target!==form||power.checked)return;
      e.preventDefault();e.stopImmediatePropagation();
    },true);
  }
  document.addEventListener('DOMContentLoaded',setup);
})();
