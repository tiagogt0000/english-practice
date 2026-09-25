import {STARTER,RESERVE,LW2} from './seed.js';
export const KEY='english-practice.v1';
export const uid=()=>crypto.randomUUID();
export const today=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Berlin'}).format(new Date());
export const stamp=()=>new Date().toISOString();
export const blank=()=>({schema:1,events:[],pending:[],contents:[],feedback:[],collections:[{...structuredClone(LW2),revision:1}],collectionOps:[],cursor:0,drafts:{},connection:{url:'',pin:''},lastSync:null,onboarded:false});
export function read(){const s=localStorage.getItem(KEY);if(!s)return blank();let d;try{d=JSON.parse(s)}catch{throw Error('Die gespeicherten Daten sind beschädigt. Bitte exportiere den Browser-Speicher, bevor du ihn zurücksetzt.');}if(d.schema!==1)throw Error('Diese Datenversion kann nicht geöffnet werden.');return {...blank(),...d};}
export const write=d=>{localStorage.setItem(KEY,JSON.stringify(d));return d};
export async function change(fn){const go=()=>{const d=read();fn(d);write(d);return d};return navigator.locks?navigator.locks.request(KEY,go):go();}
export async function addEvent(type,data,id=uid()){return change(d=>{if(d.events.some(e=>e.id===id))return;const e={id,type,at:stamp(),data};d.events.push(e);d.pending.push(id)});}
export async function saveCollection(collection){if(JSON.stringify(collection).length>40000)throw Error('Diese Sammlung ist zu groß. Bitte auf mehrere Sammlungen aufteilen.');return change(d=>{const old=d.collections.find(c=>c.id===collection.id);const op=d.collectionOps.find(o=>o.id===collection.id);const value={...collection,revision:old?.revision||0};d.collections=d.collections.filter(c=>c.id!==value.id).concat(value);d.collectionOps=d.collectionOps.filter(c=>c.id!==value.id).concat({id:value.id,opId:uid(),baseRevision:op?.baseRevision??old?.revision??0,value});});}
export function learner(d){return [...d.events].filter(e=>e.type==='profile').sort((a,b)=>a.at.localeCompare(b.at)).at(-1)?.data||{};}
export function attempts(d,lessonId){return d.events.filter(e=>e.type==='attempt'&&(!lessonId||e.data.lessonId===lessonId));}
export function lessons(d){const map=new Map([[STARTER.id,STARTER]]);for(const c of d.contents)if(c.type==='lesson'&&c.status==='published'&&c.date<=today()&&Array.isArray(c.tasks)&&c.tasks.length)map.set(c.id,c);return [...map.values()].sort((a,b)=>b.date.localeCompare(a.date));}
export function nextLesson(d){const list=lessons(d);return list.find(l=>!d.events.some(e=>e.type==='session'&&e.data.lessonId===l.id))||null;}
export function reserves(d){return RESERVE.map(l=>({...l,id:l.id+'-'+today(),date:today()}));}
export function progress(d){const days=new Set(d.events.filter(e=>e.type==='attempt').map(e=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Berlin'}).format(new Date(e.at))));return {days:days.size,answers:attempts(d).length,words:attempts(d).reduce((n,e)=>n+e.data.answer.trim().split(/\s+/).filter(Boolean).length,0),reviewed:d.feedback.length};}
export function mergeSync(d,r,sentOps){
 if(r.app!=='english-practice'||r.schema!==1||!Array.isArray(r.events)||!Array.isArray(r.accepted)||!Number.isInteger(r.cursor)||r.cursor<d.cursor)throw Error('Unerwartete Google-Antwort. Lokale Daten bleiben erhalten.');
 const es=new Map(d.events.map(e=>[e.id,e]));r.events.forEach(e=>es.set(e.id,e));d.events=[...es.values()];d.pending=d.pending.filter(id=>!r.accepted.includes(id));
 for(const ack of r.collectionAccepted||[]){const pending=d.collectionOps.find(o=>o.id===ack.id);if(pending?.opId===ack.opId)d.collectionOps=d.collectionOps.filter(o=>o.id!==ack.id);else if(pending&&sentOps.some(o=>o.opId===ack.opId))pending.baseRevision=ack.revision;}
 const dirty=new Set(d.collectionOps.map(o=>o.id));const collections=new Map(d.collections.map(c=>[c.id,c]));for(const c of r.collections||[])if(!dirty.has(c.id))collections.set(c.id,c);d.collections=[...collections.values()];d.contents=r.contents;d.feedback=r.feedback;d.cursor=r.cursor;d.lastSync=stamp();return d;
}
export function cleanLesson(l){if(!l||l.type!=='lesson'||!Array.isArray(l.tasks)||!l.tasks.length||l.tasks.length>30||!l.id)throw Error('Ungültige Lektion.');const ids=new Set();for(const t of l.tasks){if(!t.id||ids.has(t.id)||typeof t.prompt!=='string')throw Error('Aufgaben brauchen eindeutige IDs und eine Frage.');ids.add(t.id);}return l;}
