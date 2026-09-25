/** English Practice 1.0 — diese komplette Datei in Code.gs einfügen. */
const EP = { app:'english-practice', schema:1, origin:'https://tiagogt0000.github.io', appUrl:'https://tiagogt0000.github.io/english-practice/' };
const HEADERS = {
 System:['schluessel','wert'],
 Inhalte:['id','typ','datum','status','daten_json','aktualisiert_am'],
 Eingaben:['id','typ','erstellt_am','daten_json'],
 Feedback:['antwort_id','status','daten_json','aktualisiert_am'],
 Sammlungen:['id','revision','daten_json','aktualisiert_am','letzte_aenderung_id']
};
function onOpen(){SpreadsheetApp.getUi().createMenu('English Practice').addItem('Einrichten','setupEnglish').addToUi();}
function setupEnglish(){
 const book=SpreadsheetApp.getActiveSpreadsheet(),props=PropertiesService.getScriptProperties();if(!book)throw Error('Bitte das Skript über Erweiterungen → Apps Script in deiner Google-Tabelle öffnen.');props.setProperty('EP_SHEET_ID',book.getId());
 Object.keys(HEADERS).forEach(name=>{let s=book.getSheetByName(name);if(!s)s=book.insertSheet(name);if(!s.getLastRow()){s.getRange(1,1,1,HEADERS[name].length).setValues([HEADERS[name]]);s.setFrozenRows(1);s.getRange(1,1,1,HEADERS[name].length).setFontWeight('bold').setBackground('#eeeeee');}checkHeaders_(s,name);});
 if(!props.getProperty('EP_PIN_HASH')){const ui=SpreadsheetApp.getUi(),r=ui.prompt('Zugangscode festlegen','Gib deinen gewünschten Code ein. Diesen Code brauchst du einmal pro Gerät.',ui.ButtonSet.OK_CANCEL);if(r.getSelectedButton()!==ui.Button.OK)return;const pin=r.getResponseText().trim();if(pin.length<4)throw Error('Bitte mindestens 4 Zeichen verwenden.');props.setProperty('EP_PIN_HASH',hash_(pin));}
 system_(book,'schema','1');system_(book,'app',EP.app);SpreadsheetApp.getUi().alert('Fertig. Jetzt: Bereitstellen → Neue Bereitstellung → Web-App. Ausführen als: Ich. Zugriff: Jeder. Danach die Web-App-URL öffnen und auf „App verbinden“ klicken.');
}
function doGet(e){
 const channel=String(e&&e.parameter&&e.parameter.channel||'');
 if(!PropertiesService.getScriptProperties().getProperty('EP_PIN_HASH'))return HtmlService.createHtmlOutput('Bitte zuerst setupEnglish ausführen.');
 if(!channel){const url=ScriptApp.getService().getUrl();system_(SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('EP_SHEET_ID')),'web_app_url',url);return HtmlService.createHtmlOutput('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font:18px system-ui;background:#f5f3eb;color:#183c32;max-width:560px;margin:10vh auto;padding:25px;line-height:1.6}a{display:inline-block;background:#245b48;color:white;padding:14px 24px;border-radius:12px;text-decoration:none}</style><h1>English Practice ist bereit.</h1><p>Die Verbindung wird automatisch in deiner App gespeichert. Dort gibst du nur noch deinen Zugangscode ein.</p><a target="_top" href="'+EP.appUrl+'#connect='+encodeURIComponent(url)+'">App verbinden →</a>').setTitle('English Practice verbinden');}
 if(!/^[\w-]{20,80}$/.test(channel))return HtmlService.createHtmlOutput('Ungültige Verbindung.');
 const html='<!doctype html><meta charset="utf-8"><script>const channel='+JSON.stringify(channel)+',origin='+JSON.stringify(EP.origin)+';window.addEventListener("message",function(e){if(e.origin!==origin||e.source!==window.top)return;const m=e.data;if(!m||m.type!=="ep-request"||m.channel!==channel||typeof m.id!=="string")return;function reply(result,error){window.top.postMessage({type:"ep-response",channel:channel,id:m.id,result:result,error:error},origin)}google.script.run.withSuccessHandler(function(r){reply(r,null)}).withFailureHandler(function(e){reply(null,e.message||"Google-Fehler")}).englishApi(m.request)});window.top.postMessage({type:"ep-ready",channel:channel},origin);<\/script>';
 return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL).setTitle('English Practice Cloud');
}
function englishApi(r){
 if(!r||r.app!==EP.app||typeof r.pin!=='string'||r.pin.length>200)throw Error('Ungültige Anfrage.');
 const expected=PropertiesService.getScriptProperties().getProperty('EP_PIN_HASH');if(!expected||hash_(r.pin)!==expected)throw Error('Der Zugangscode stimmt nicht.');
 if(r.action==='check')return {app:EP.app,schema:1,sheetId:PropertiesService.getScriptProperties().getProperty('EP_SHEET_ID'),sheetUrl:'https://docs.google.com/spreadsheets/d/'+PropertiesService.getScriptProperties().getProperty('EP_SHEET_ID')+'/edit'};
 if(r.action!=='sync')throw Error('Unbekannte Aktion.');
 if(!Number.isInteger(r.since)||r.since<0||!Array.isArray(r.events)||r.events.length>100||!Array.isArray(r.collections)||r.collections.length>20)throw Error('Ungültiges Datenpaket.');
 r.events.forEach(validateEvent_);r.collections.forEach(validateCollection_);
 const lock=LockService.getScriptLock();if(!lock.tryLock(20000))throw Error('Ein anderes Gerät speichert gerade. Bitte erneut versuchen.');
 try{
 const book=SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('EP_SHEET_ID'));Object.keys(HEADERS).forEach(n=>checkHeaders_(book.getSheetByName(n),n));
 const es=book.getSheetByName('Eingaben'),stored=rows_(es,4);if(r.since>stored.length)throw Error('Der Tabellenstand ist älter als dein Gerät. Bitte keine Tabellenzeilen löschen.');
 const known=new Map(stored.map(row=>[row[0],row]));const added=[],accepted=[];
 r.events.forEach(e=>{const row=[e.id,e.type,e.at,JSON.stringify(e.data)];const prev=known.get(e.id);if(prev&&JSON.stringify(prev.map(String))!==JSON.stringify(row))throw Error('Doppelte Kennung mit verschiedenen Daten.');if(!prev){added.push(row);known.set(e.id,row);}accepted.push(e.id);});
 if(added.length){es.getRange(es.getLastRow()+1,1,added.length,4).setValues(added);stored.push(...added);}
 const cs=book.getSheetByName('Sammlungen'),cr=rows_(cs,5),conflicts=[],collectionAccepted=[];
 r.collections.forEach(op=>{const index=cr.findIndex(row=>row[0]===op.id),prev=index<0?null:cr[index],revision=prev?Number(prev[1]):0;
 if(prev&&prev[4]===op.opId){collectionAccepted.push({id:op.id,opId:op.opId,revision});return;}
 if(revision!==op.baseRevision){conflicts.push({id:op.id,cloud:JSON.parse(prev[2]),revision});return;}
 const next=revision+1,value=Object.assign({},op.value,{revision:next}),row=[op.id,next,JSON.stringify(value),new Date().toISOString(),op.opId];
 if(index<0){cs.getRange(cs.getLastRow()+1,1,1,5).setValues([row]);cr.push(row);}else{cs.getRange(index+2,1,1,5).setValues([row]);cr[index]=row;}
 collectionAccepted.push({id:op.id,opId:op.opId,revision:next});});
 SpreadsheetApp.flush();const cursor=Math.min(r.since+500,stored.length);
 return {app:EP.app,schema:1,cursor,more:cursor<stored.length,accepted,collectionAccepted,conflicts,
 events:stored.slice(r.since,cursor).map(row=>({id:String(row[0]),type:String(row[1]),at:String(row[2]),data:JSON.parse(row[3])})),
 collections:cr.map(row=>Object.assign(JSON.parse(row[2]),{id:row[0],revision:Number(row[1])})),
 contents:rows_(book.getSheetByName('Inhalte'),6).filter(row=>row[3]==='published').map(row=>Object.assign(JSON.parse(row[4]),{id:String(row[0]),type:String(row[1]),date:String(row[2]),status:String(row[3])})),
 feedback:rows_(book.getSheetByName('Feedback'),4).filter(row=>row[1]==='published').map(row=>Object.assign(JSON.parse(row[2]),{attemptId:String(row[0]),reviewedAt:String(row[3])}))};
 }finally{lock.releaseLock();}
}
function rows_(s,n){if(s.getLastRow()<2)return [];return s.getRange(2,1,s.getLastRow()-1,n).getValues().filter(r=>r[0]!=='');}
function checkHeaders_(s,name){if(!s||JSON.stringify(s.getRange(1,1,1,HEADERS[name].length).getValues()[0])!==JSON.stringify(HEADERS[name]))throw Error('Tabellenstruktur fehlt oder wurde verändert: '+name+'. Bitte setupEnglish ausführen bzw. Kopfzeilen prüfen.');}
function id_(s){return typeof s==='string'&&/^[a-zA-Z0-9_-]{1,120}$/.test(s)&&!['__proto__','prototype','constructor'].includes(s);}
function validateEvent_(e){if(!e||!id_(e.id)||!['attempt','profile','session','vocab_review','feedback_seen'].includes(e.type)||typeof e.at!=='string'||!/^\d{4}-\d\d-\d\dT/.test(e.at)||!Number.isFinite(Date.parse(e.at))||!e.data||typeof e.data!=='object'||Array.isArray(e.data)||JSON.stringify(e.data).length>40000)throw Error('Ungültiger Lerneintrag.');if(e.type==='attempt'&&(!id_(e.data.lessonId)||!id_(e.data.taskId)||typeof e.data.answer!=='string'||e.data.answer.length>8000))throw Error('Ungültige Antwort.');}
function validateCollection_(o){if(!o||!id_(o.id)||!id_(o.opId)||!Number.isInteger(o.baseRevision)||o.baseRevision<0||!o.value||o.value.id!==o.id||typeof o.value.name!=='string'||o.value.name.length>100||!Array.isArray(o.value.words)||JSON.stringify(o.value).length>40000)throw Error('Ungültige Sammlung.');}
function hash_(s){return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,s,Utilities.Charset.UTF_8).map(b=>('0'+((b+256)%256).toString(16)).slice(-2)).join('');}
function system_(book,key,value){const s=book.getSheetByName('System');if(!s)return;const rows=rows_(s,2),i=rows.findIndex(r=>r[0]===key);s.getRange(i<0?s.getLastRow()+1:i+2,1,1,2).setValues([[key,value]]);}
