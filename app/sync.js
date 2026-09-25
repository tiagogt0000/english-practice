import {CONFIG} from './config.js';
import {read,change,mergeSync,uid} from './model.js';
export class Bridge {
 constructor(url,pin){this.url=url;this.pin=pin;this.waiting=new Map();}
 connect(){if(this.promise)return this.promise;this.promise=new Promise((resolve,reject)=>{
 const channel=uid();this.channel=channel;
 this.listener=e=>{const m=e.data;if(!m||m.channel!==channel||!/^https:\/\/[\w.-]+\.googleusercontent\.com$/.test(e.origin))return;
 if(m.type==='ep-ready'&&!this.target){this.target=e.source;this.origin=e.origin;clearTimeout(this.timer);resolve();}
 if(e.source!==this.target||e.origin!==this.origin)return;
 if(m.type==='ep-response'){const c=this.waiting.get(m.id);if(c){clearTimeout(c.timer);this.waiting.delete(m.id);m.error?c.reject(Error(m.error)):c.resolve(m.result);}}};
 window.addEventListener('message',this.listener);this.frame=document.createElement('iframe');this.frame.hidden=true;this.frame.title='Google-Synchronisierung';const u=new URL(this.url);u.searchParams.set('channel',channel);this.frame.src=u.href;this.frame.referrerPolicy='no-referrer';
 this.timer=setTimeout(()=>{reject(Error('Google antwortet nicht. Prüfe die Bereitstellung: Zugriff „Jeder“. Deine Antworten bleiben lokal gespeichert.'));this.destroy()},20000);document.body.append(this.frame);
 });return this.promise;}
 async request(payload){await this.connect();return new Promise((resolve,reject)=>{const id=uid(),timer=setTimeout(()=>{this.waiting.delete(id);reject(Error('Keine Speicherbestätigung von Google. Bitte erneut synchronisieren.'))},45000);this.waiting.set(id,{resolve,reject,timer});this.target.postMessage({type:'ep-request',channel:this.channel,id,request:{...payload,app:CONFIG.app,pin:this.pin}},this.origin);});}
 destroy(){clearTimeout(this.timer);window.removeEventListener('message',this.listener);this.frame?.remove();for(const c of this.waiting.values()){clearTimeout(c.timer);c.reject(Error('Verbindung beendet.'))}this.waiting.clear();this.promise=null;this.target=null;}
}
export class Sync extends EventTarget {
 constructor(){super();this.status='local';this.message='Auf diesem Gerät';this.conflicts=[];window.addEventListener('online',()=>this.run());}
 set(status,message){this.status=status;this.message=message;this.dispatchEvent(new Event('change'));}
 schedule(){clearTimeout(this.timer);this.timer=setTimeout(()=>this.run(),1200);}
 async configure(url,pin){if(!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(url))throw Error('Bitte die Google-Web-App-Adresse mit /exec am Ende verwenden.');if(!pin.trim())throw Error('Bitte deinen Zugangscode eingeben.');if(this.flight)await this.flight;const b=new Bridge(url,pin);let meta;try{const r=await b.request({action:'check'});meta=r;if(r.app!==CONFIG.app||(read().connection.sheetId&&r.sheetId!==read().connection.sheetId))throw Error('Diese Bereitstellung gehört zu einer anderen App oder Tabelle.');}catch(e){b.destroy();throw e;}this.bridge?.destroy();this.bridge=b;await change(d=>{d.connection={url,pin,sheetId:meta.sheetId,sheetUrl:meta.sheetUrl};});await this.run();}
 run(){if(this.flight)return this.flight;this.flight=this.perform().finally(()=>this.flight=null);return this.flight;}
 async perform(){const d=read(),url=d.connection.url||CONFIG.webAppUrl,pin=d.connection.pin;if(!url||!pin){this.set('local','Auf diesem Gerät');return;}if(!navigator.onLine){this.set('offline','Offline · lokal gespeichert');return;}
 try{this.set('syncing','Wird synchronisiert …');if(!this.bridge||this.bridge.url!==url||this.bridge.pin!==pin){this.bridge?.destroy();this.bridge=new Bridge(url,pin)}
 for(let i=0;i<30;i++){const current=read(),sentOps=current.collectionOps.slice(0,20),events=current.events.filter(e=>current.pending.includes(e.id)).slice(0,100);
 const r=await this.bridge.request({action:'sync',since:current.cursor,events,collections:sentOps});await change(doc=>mergeSync(doc,r,sentOps));this.conflicts=r.conflicts||[];
 if(this.conflicts.length){this.set('conflict','Sammlung auf zwei Geräten geändert');return;}
 if(!r.more&&!read().pending.length&&!read().collectionOps.length){this.set('synced','Mit Google synchronisiert');return;}}
 this.set('syncing','Weitere Daten werden geladen …');this.schedule();
 }catch(e){this.bridge?.destroy();this.bridge=null;this.set('error',e.message);}}
}
