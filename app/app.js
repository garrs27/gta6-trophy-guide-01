'use strict';
(() => {
 const trophies=window.TROPHIES?.trophies||[]; const meta=window.TROPHIES?.meta||{};
 const key='leonida-trophy-run-v1', checksKey='leonida-checklist-v1';
 const state=JSON.parse(localStorage.getItem(key)||'{"earned":[],"revealed":[]}');
 const checkState=JSON.parse(localStorage.getItem(checksKey)||'{}');
 const $=s=>document.querySelector(s), cards=$('#cards'); let activeGrade='';
 const url=new URL(location.href), view=url.searchParams.get('view'), focus=url.searchParams.get('trophy');
 if(view)document.body.classList.add('view-'+view); if(focus)document.body.classList.add('view-trophy');
 if(url.searchParams.get('spoilers')==='off')$('#spoilers').checked=false;
 const cat=$('#category'); (meta.categories||[]).forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c.replaceAll('-',' ');cat.append(o)});
 if(url.searchParams.has('grade'))activeGrade=url.searchParams.get('grade'); if(url.searchParams.has('category'))cat.value=url.searchParams.get('category');
 if(url.searchParams.get('missable')==='1')$('#missable-only').checked=true;
 function save(){localStorage.setItem(key,JSON.stringify(state));update()}
 function hidden(t){return t.hidden&&!state.earned.includes(t.id)&&!state.revealed.includes(t.id)&&$('#spoilers').checked}
 function render(){const q=$('#search').value.toLowerCase(), status=$('#status').value, category=cat.value;
  let list=trophies.filter(t=>(!q||[t.name,t.official_description,t.guide,t.category].join(' ').toLowerCase().includes(q))&&(!activeGrade||t.grade===activeGrade)&&(!category||t.category===category)&&(!status||t.status===status)&&(!$('#hide-earned').checked||!state.earned.includes(t.id))&&(!$('#missable-only').checked||t.missable)&&(!focus||t.id===focus));
  cards.innerHTML=''; $('#empty').hidden=!!list.length; $('#result-count').textContent=`${list.length} TROPH${list.length===1?'Y':'IES'}`;
  list.forEach(t=>{const card=document.createElement('article');card.className='trophy-card'+(state.earned.includes(t.id)?' earned':'')+(focus===t.id?' spotlight':'');card.dataset.id=t.id;
   const title=hidden(t)?'Hidden trophy':t.name;const desc=hidden(t)?'Hidden trophy description. Turn spoilers on or reveal this entry.':t.official_description;
   const guide=hidden(t)?'This trophy is spoiler protected. Reveal it to read the guide.':t.guide;
   card.innerHTML=`<div class="card-top"><span class="grade-icon ${t.grade}">${({platinum:'♛',gold:'◆',silver:'◇',bronze:'●'})[t.grade]}</span><div class="card-tags"><span class="tag ${t.status}">${t.status}</span>${t.missable?'<span class="tag unconfirmed">missable</span>':''}<span class="tag">${t.category}</span></div></div><h3>${esc(title)}</h3>${hidden(t)?'<button class="reveal">Reveal trophy</button>':''}<p class="description">${esc(desc)}</p><p class="guide">${esc(guide)}</p><div class="card-bottom"><small>${t.grade.toUpperCase()} · ${t.gamerscore}G · ${t.sources.join(' / ')}</small><label><input type="checkbox" ${state.earned.includes(t.id)?'checked':''}> Earned</label></div>`;
   card.querySelector('.reveal')?.addEventListener('click',()=>{state.revealed.push(t.id);save()});card.querySelector('input').addEventListener('change',e=>{state.earned=state.earned.filter(id=>id!==t.id);if(e.target.checked)state.earned.push(t.id);save()});cards.append(card);
  }); update();
 }
 function update(){const n=state.earned.length,p=Math.round(n/55*100);$('#progress-count').textContent=`${n}/55`;$('#progress-sub').textContent=`${p}% complete`;$('#progress-title').textContent=n===55?'LEONIDA LEGEND':n?'RUN IN PROGRESS':'YOUR RUN STARTS HERE';$('.ring').style.setProperty('--progress',`${p*3.6}deg`)}
 function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
 $('#search').addEventListener('input',render);cat.addEventListener('change',render);$('#status').addEventListener('change',render);$('#hide-earned').addEventListener('change',render);$('#missable-only').addEventListener('change',render);$('#spoilers').addEventListener('change',render);
 $('#grades').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;activeGrade=b.dataset.grade;$('#grades').querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));render()});
 $('#export').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({version:1,game:meta.game,earned:state.earned,checklist:checkState},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='leonida-trophy-run.json';a.click();URL.revokeObjectURL(a.href)});
 $('#import-file').addEventListener('change',async e=>{try{const x=JSON.parse(await e.target.files[0].text());if(!Array.isArray(x.earned))throw Error();state.earned=x.earned.filter(id=>trophies.some(t=>t.id===id));Object.assign(checkState,x.checklist||{});localStorage.setItem(checksKey,JSON.stringify(checkState));save();document.querySelectorAll('[data-check]').forEach(c=>c.checked=!!checkState[c.dataset.check])}catch{alert('That run file is not valid.')}e.target.value=''});
 document.querySelectorAll('[data-check]').forEach(c=>{c.checked=!!checkState[c.dataset.check];c.addEventListener('change',()=>{checkState[c.dataset.check]=c.checked;localStorage.setItem(checksKey,JSON.stringify(checkState))})});
 render();
})();
