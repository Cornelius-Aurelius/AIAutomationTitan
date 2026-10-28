/* Titan AI Automation planning calculations. Rule-based, without external services. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.TitanCore=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const ESCAPE=/[\u0000-\u001f\u007f]/g;
  function clean(value,max=600){return String(value??'').replace(ESCAPE,' ').replace(/\s+/g,' ').trim().slice(0,max);}
  function numeric(value,min,max,label){const v=Number(value);if(!Number.isFinite(v)||v<min||v>max)throw new RangeError(`${label} must be between ${min} and ${max}.`);return v;}
  function assess(raw){
    const name=clean(raw.workflowName,100);if(!name)throw new Error('Enter a workflow name to generate an assessment.');
    const dept=clean(raw.department,50)||'Operations';
    const hours=numeric(raw.hours,1,10000,'Weekly team hours');
    const rate=numeric(raw.hourly===undefined||raw.hourly===''?0:raw.hourly,0,1000,'Hourly cost');
    const reduction=numeric(raw.reduction,5,80,'Time-reduction assumption');
    const sensitivity=['low','moderate','high'].includes(raw.sensitivity)?raw.sensitivity:'moderate';
    const actionType=['draft','update','external'].includes(raw.actionType)?raw.actionType:'update';
    const annualHours=hours*52;
    const scenarioHours=annualHours*reduction/100;
    const scenarioValue=scenarioHours*rate;
    const checks=['Document current steps, ownership and exception cases.','Measure a baseline and test the process with representative data.','Keep logs, monitoring and a rollback or stop procedure.','Check actual integration, licence, operational and maintenance costs before calculating ROI.'];
    if(sensitivity==='moderate')checks.unshift('Confirm internal access controls, data retention and authorised users.');
    if(sensitivity==='high')checks.unshift('Require privacy/security review, strict data minimisation and documented access controls before any pilot.');
    if(actionType==='update')checks.unshift('Add approval and validation gates before modifying business records.');
    if(actionType==='external')checks.unshift('Require explicit human approval before external sends or irreversible changes.');
    const approach=actionType==='draft'?'Start with a read-only assistant or drafting prototype. Have a designated owner verify outputs before anything is acted on.':actionType==='external'?'Pilot a narrow, monitored workflow with mandatory human approval before any external message or system change.':'Prototype one repeatable internal task, using access-limited integrations and a review step before records are changed.';
    const success=clean(raw.outcome,400)||'Define a measurable target such as time per case, error rate, completion speed and reviewer effort; compare it with the baseline after a bounded pilot.';
    return {name,dept,bottleneck:clean(raw.bottleneck,600),outcome:success,hours,rate,reduction,sensitivity,actionType,annualHours,scenarioHours,scenarioValue,approach,checks};
  }
  function formatHours(v){return new Intl.NumberFormat('en-GB',{maximumFractionDigits:1}).format(v)+'h';}
  function formatGBP(v){return new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(v);}
  function brief(a){if(!a||!a.name)throw new Error('Run an assessment first.');return [
    'TITAN AI AUTOMATION — WORKFLOW PLANNING BRIEF',
    'Original project by Cornelius Aurelius | https://corneliusaurelius.com/',
    '',`Workflow: ${a.name}`,`Team: ${a.dept}`,`Current bottleneck: ${a.bottleneck||'Not specified'}`,`Intended outcome: ${a.outcome}`,
    '', 'ILLUSTRATIVE SCENARIO — NOT A PROMISE OR ROI PROJECTION',
    `Current combined team time: ${a.hours} hours/week`, `User assumed reduction: ${a.reduction}%`,
    `Potentially freed time: ${formatHours(a.scenarioHours)}/year (52-week arithmetic)`,
    `User assumed hourly value: ${formatGBP(a.rate)}`, `Illustrative annual time value: ${formatGBP(a.scenarioValue)}`,
    'Excludes implementation, maintenance, subscription, quality and change-management costs.',
    '', `Data sensitivity: ${a.sensitivity}`, `Action type: ${a.actionType}`, 'Suggested approach:',a.approach,
    '', 'CONTROL CHECKLIST:',...a.checks.map(s=>'- '+s),
    '', 'This file is a planning exercise only. No workflow was executed and no project enquiry was submitted.'
  ].join('\n');}
  return Object.freeze({clean,numeric,assess,formatHours,formatGBP,brief});
});
