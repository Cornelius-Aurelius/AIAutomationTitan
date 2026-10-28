(function(){'use strict';
  const $=id=>document.getElementById(id);const form=$('workflow-form');const result=$('result-content');const empty=$('empty-state');
  const menu=$('site-nav'), toggle=document.querySelector('.menu-toggle');let last=null;
  function setMenu(open){menu.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');}
  toggle.addEventListener('click',()=>setMenu(toggle.getAttribute('aria-expanded')!=='true'));
  menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setMenu(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open')){setMenu(false);toggle.focus();}});
  $('reduction').addEventListener('input',()=>{$('reduction-output').textContent=$('reduction').value+'%';});
  form.addEventListener('reset',()=>{last=null;result.hidden=true;empty.hidden=false;$('form-error').hidden=true;$('export-feedback').textContent='';setTimeout(()=>{$('reduction-output').textContent='30%';},0);});
  form.addEventListener('submit',ev=>{ev.preventDefault();$('form-error').hidden=true;const fd=new FormData(form);try{
    const a=TitanCore.assess(Object.fromEntries(fd.entries()));last=a;
    $('result-name').textContent=a.name+' · '+a.dept;
    $('hours-saved').textContent=TitanCore.formatHours(a.scenarioHours);
    $('value-saved').textContent=TitanCore.formatGBP(a.scenarioValue);
    $('assumptions').textContent=`Based on ${a.hours} combined team hours/week × 52 weeks × your ${a.reduction}% assumption, at your illustrative ${TitanCore.formatGBP(a.rate)}/hour. Not verified savings.`;
    $('approach').textContent=a.approach;
    $('success').textContent=a.outcome;
    const checks=$('checks');checks.replaceChildren();a.checks.forEach(s=>{const li=document.createElement('li');li.textContent=s;checks.appendChild(li);});
    $('export-feedback').textContent='';empty.hidden=true;result.hidden=false;$('assessment').focus({preventScroll:true});$('assessment').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  }catch(err){last=null;$('form-error').textContent=err.message||'Check the inputs.';$('form-error').hidden=false;result.hidden=true;empty.hidden=false;}});
  $('download-brief').addEventListener('click',()=>{if(!last)return;const blob=new Blob([TitanCore.brief(last)],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='titan-workflow-brief.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);$('export-feedback').textContent='Your brief has been downloaded to this device.';});
  $('copy-brief').addEventListener('click',async()=>{if(!last)return;try{await navigator.clipboard.writeText(TitanCore.brief(last));$('export-feedback').textContent='Project brief copied.';}catch{$('export-feedback').textContent='Clipboard not available. Use Download project brief instead.';}});
})();
