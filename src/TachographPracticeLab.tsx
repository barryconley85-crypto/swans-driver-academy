import {useMemo,useState} from 'react';
import {Calculator,Clock3,CheckCircle2,RotateCcw,AlertTriangle,ArrowRight} from 'lucide-react';

const fmt=(mins:number)=>{const h=Math.floor(mins/60),m=mins%60;return h+'h '+String(m).padStart(2,'0')+'m'};
export default function TachographPracticeLab(){
 const [weeklyRest,setWeeklyRest]=useState(33);
 const [compSubmitted,setCompSubmitted]=useState(false);
 const compensation=45-weeklyRest;
 const [weekOne,setWeekOne]=useState(48);
 const [weekTwo,setWeekTwo]=useState(44);
 const weeklyTotal=weekOne+weekTwo;
 const [breakChoice,setBreakChoice]=useState('20+25');
 const [breakChecked,setBreakChecked]=useState(false);
 const [scenario,setScenario]=useState(0);
 const [scenarioAnswer,setScenarioAnswer]=useState<number|null>(null);
 const [scenarioChecked,setScenarioChecked]=useState(false);
 const scenarioSet=[
  {title:'The delayed school return',body:'You have driven for 2 hours 15 minutes. You stop for 20 minutes, then drive another 2 hours 15 minutes. The next stop is 30 minutes away. Is the driving-break requirement satisfied?',options:['Yes, the two pauses add up to 45 minutes','No, the 20-minute first part does not meet the 15-minute then 30-minute split pattern','Yes, any pause resets the driving time'],best:1,explain:'The split must be at least 15 minutes followed by at least 30 minutes, taken within the 4½-hour driving period. A 20 + 25 split is not qualifying.'},
  {title:'The 10-hour extension',body:'You have already used two 10-hour driving days in this fixed week. The duty planner asks you to complete another 10 hours tomorrow. Can you?',options:['Yes, if the weekly total stays below 56 hours','No, the 10-hour extension is permitted no more than twice in a fixed week','Yes, if you take an 11-hour rest'],best:1,explain:'Under assimilated rules, the normal daily driving limit is 9 hours. It can be extended to 10 hours no more than twice in a fixed week.'},
  {title:'The two-week total',body:'You drove 48 hours last fixed week. The proposed plan is 44 hours this week. Is the plan compliant with the fortnightly driving limit?',options:['Yes, both weeks are individually below 56 hours','No, 48 + 44 = 92 hours, above the 90-hour two-week maximum','Yes, because the 10-hour extension covers the difference'],best:1,explain:'The weekly limit and two-week limit both apply. A compliant weekly total can still cause a fortnightly breach.'}
 ];
 const current=scenarioSet[scenario];
 const weeklyStatus=weeklyTotal>90?'Above 90-hour limit':weekOne>56||weekTwo>56?'One fixed week exceeds 56 hours':'Within these two driving limits';
 const weeklyGood=weeklyTotal<=90&&weekOne<=56&&weekTwo<=56;
 const splitGood=breakChoice==='15+30'||breakChoice==='30+15'?breakChoice==='15+30':false;
 return <section className="tacho-practice-lab">
  <div className="practice-lab-head"><span>DRIVER PRACTICE STUDIO</span><h3>Work it out, don't just read it</h3><p>Use these exercises to practise the calculations and decisions you will make when checking a coach duty.</p></div>
  <div className="practice-lab-card">
   <div className="practice-lab-title"><Calculator size={18}/><div><b>1. Weekly rest compensation calculator</b><small>Calculate the missing rest and how it must be taken</small></div></div>
   <label className="practice-field-label">Weekly rest actually taken <b>{fmt(weeklyRest*60)}</b></label>
   <input aria-label="Weekly rest actually taken in hours" type="range" min="24" max="44" step="1" value={weeklyRest} onChange={e=>{setWeeklyRest(Number(e.target.value));setCompSubmitted(false)}}/>
   <div className="practice-range-labels"><span>24 hours</span><span>45 hours regular rest</span></div>
   <div className="practice-math"><div><small>Regular weekly rest</small><b>45h 00m</b></div><div><small>Rest taken</small><b>{fmt(weeklyRest*60)}</b></div><div className="practice-answer"><small>Compensation owed</small><b>{fmt(compensation*60)}</b></div></div>
   <button className="practice-action" onClick={()=>setCompSubmitted(true)}>SHOW HOW TO TAKE IT <ArrowRight size={15}/></button>
   {compSubmitted&&<div className="practice-explanation"><CheckCircle2 size={17}/><div><b>{fmt(compensation*60)} compensation</b><p>Take the full {fmt(compensation*60)} as one continuous block. Attach it to another rest period of at least 9 hours, and take it by the end of the third week following the week in which the reduction occurred. The operator should record the reduction and plan the deadline.</p></div></div>}
   <div className="practice-example-pills"><button onClick={()=>{setWeeklyRest(33);setCompSubmitted(true)}}>Example: 33h rest</button><button onClick={()=>{setWeeklyRest(31);setCompSubmitted(true)}}>Example: 31h rest</button><button onClick={()=>{setWeeklyRest(24);setCompSubmitted(true)}}>Example: 24h rest</button></div>
  </div>
  <div className="practice-lab-card">
   <div className="practice-lab-title"><Clock3 size={18}/><div><b>2. Two-week driving limits</b><small>Change the figures and see how the totals interact</small></div></div>
   <div className="practice-input-grid"><label>Week 1 driving hours<input type="number" min="0" max="70" value={weekOne} onChange={e=>setWeekOne(Math.max(0,Number(e.target.value)))}/></label><label>Week 2 driving hours<input type="number" min="0" max="70" value={weekTwo} onChange={e=>setWeekTwo(Math.max(0,Number(e.target.value)))}/></label></div>
   <div className={'practice-status '+(weeklyGood?'good':'warning')}><b>{weeklyTotal} hours combined</b><span>{weeklyStatus}</span></div>
   <p className="practice-small-note">Check both limits separately: no more than 56 hours in either fixed week, and no more than 90 hours across the two consecutive fixed weeks.</p>
   <div className="practice-example-pills"><button onClick={()=>{setWeekOne(48);setWeekTwo(42)}}>Compliant example, 48 + 42</button><button onClick={()=>{setWeekOne(48);setWeekTwo(44)}}>Breach example, 48 + 44</button></div>
  </div>
  <div className="practice-lab-card">
   <div className="practice-lab-title"><CheckCircle2 size={18}/><div><b>3. Is your split break valid?</b><small>Choose the sequence, then check the legal pattern</small></div></div>
   <p className="practice-question">You need to split the 45-minute driving break. Which sequence qualifies?</p>
   <div className="practice-option-list">{[{v:'20+25',t:'20 minutes, then 25 minutes'},{v:'30+15',t:'30 minutes, then 15 minutes'},{v:'15+30',t:'15 minutes, then 30 minutes'},{v:'10+35',t:'10 minutes, then 35 minutes'}].map(o=><button key={o.v} className={breakChoice===o.v?'selected':''} onClick={()=>{setBreakChoice(o.v);setBreakChecked(false)}}>{o.t}</button>)}</div>
   <button className="practice-action" onClick={()=>setBreakChecked(true)}>CHECK THE BREAK</button>
   {breakChecked&&<div className={'practice-explanation '+(splitGood?'is-correct':'is-wrong')}><b>{splitGood?'Correct sequence':'That sequence does not qualify'}</b><p>The required split is at least 15 minutes followed by at least 30 minutes, completed within the 4½-hour driving period. The order matters.</p></div>}
  </div>
  <div className="practice-lab-card">
   <div className="practice-lab-title"><AlertTriangle size={18}/><div><b>4. Real-duty decision scenarios</b><small>Choose what you would do on the road</small></div></div>
   <div className="practice-scenario-progress">SCENARIO {scenario+1} OF {scenarioSet.length}</div>
   <h4>{current.title}</h4><p className="practice-question">{current.body}</p>
   <div className="practice-option-list">{current.options.map((o,i)=><button key={o} className={scenarioAnswer===i?'selected':''} onClick={()=>{setScenarioAnswer(i);setScenarioChecked(false)}}>{o}</button>)}</div>
   <button className="practice-action" disabled={scenarioAnswer===null} onClick={()=>setScenarioChecked(true)}>CHECK MY DECISION</button>
   {scenarioChecked&&<div className={'practice-explanation '+(scenarioAnswer===current.best?'is-correct':'is-wrong')}><b>{scenarioAnswer===current.best?'Correct decision':'Review the rule'}</b><p>{current.explain}</p></div>}
   <div className="practice-scenario-controls"><button disabled={scenario===0} onClick={()=>{setScenario(v=>v-1);setScenarioAnswer(null);setScenarioChecked(false)}}>Previous scenario</button><button disabled={scenario===scenarioSet.length-1} onClick={()=>{setScenario(v=>v+1);setScenarioAnswer(null);setScenarioChecked(false)}}>Next scenario <ArrowRight size={14}/></button></div>
  </div>
 </section>
}
