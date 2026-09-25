export const STARTER = {
 id:'start-01',type:'lesson',date:'2026-09-25',status:'published',
 title:'Dein Englisch. Dein Start.',subtitle:'Eine kleine Standortbestimmung, ganz ohne Notendruck.',minutes:12,
 focus:['Freies Schreiben','Alltag & gerade jetzt','Satzverbindungen'],
 intro:'Schreib so, wie du es gerade kannst. Deine Antworten helfen, passende Übungen für dich zu finden. Die persönliche Rückmeldung kommt nach der nächsten Auswertung.',
 tasks:[
  {id:'intro',type:'free_text',title:'Let’s get to know you',prompt:'Tell me about yourself and one thing you enjoy doing after school. Write 3–4 sentences.',instruction:'Schreib auf Englisch. Es geht um deine eigenen Formulierungen.',minWords:25,hint:'You could start with: After school, I usually …',tags:['free-writing','present-simple'],minutes:2},
  {id:'routine',type:'translation',title:'Gewohnheit oder gerade jetzt?',prompt:'Normalerweise spiele ich nach der Schule Fußball, aber heute lerne ich für einen Test.',instruction:'Übersetze den ganzen Satz ins Englische.',hint:'Achte auf den Unterschied zwischen usually und today.',tags:['present-simple','present-progressive'],minutes:1},
  {id:'question',type:'gap_fill',title:'Eine kleine Frage',prompt:'___ you enjoy English? What ___ you doing right now?',instruction:'Schreibe beide vollständigen Fragen auf Englisch.',hint:'Bei enjoy brauchst du für die Frage ein Hilfsverb. Bei doing ist die Form von be wichtig.',tags:['do-vs-be','questions'],minutes:1},
  {id:'build',type:'sentence_building',title:'Bring den Satz in Form',prompt:'Baue aus den Teilen einen englischen Satz. Tippe die Wörter in der richtigen Reihenfolge an.',tokens:['because','I','English','more confidently','want to','practise','I','speak','every day'],hint:'Beginne mit I practise …; nach because folgt ein zweiter Satzteil.',tags:['word-order','linking'],minutes:1},
  {id:'natural',type:'multiple_choice',title:'Was passt zur Situation?',prompt:'Someone calls you while you are busy with your homework. Which reply fits?',options:['I do my homework every evening.','I am doing my homework right now.','I doing my homework now.'],instruction:'Wähle eine Antwort. Die Erklärung gibt es mit deinem Feedback.',tags:['present-progressive','context'],minutes:1},
  {id:'yesterday',type:'free_text',title:'Yesterday, in your words',prompt:'What did you do yesterday? Write 3–5 sentences. Include something you enjoyed and something you did not enjoy.',minWords:30,hint:'You can use: Yesterday … / After that … / I didn’t …',tags:['past-simple','negation','free-writing'],minutes:3},
  {id:'opinion',type:'dialogue',title:'Deine Meinung zählt',prompt:'A friend says: “Learning English is only useful for school.” Reply in 2–3 sentences. Give your opinion and one reason.',hint:'I think … because … / For example, …',tags:['opinion','linking','transfer'],minutes:2}
 ]
};
export const RESERVE = [
 {id:'reserve-weekend',type:'lesson',date:'',status:'published',reserve:true,title:'A weekend worth telling',subtitle:'Eine vorbereitete Schreibeinheit für zwischendurch.',minutes:10,focus:['Erzählen','Fragen','Meinung'],tasks:[
 {id:'a',type:'free_text',title:'Dein Wochenende',prompt:'Describe your last weekend in 4–6 sentences. Explain what you liked and why.',tags:['past-simple','free-writing'],minWords:40,hint:'First … / Then … / My favourite part was …'},
 {id:'b',type:'rewrite',title:'Mach es klarer',prompt:'I went outside. It was raining. I met a friend. We had fun.',instruction:'Verbinde diese Ideen zu 2–3 abwechslungsreichen Sätzen. Die Bedeutung soll erhalten bleiben.',tags:['linking','rewriting'],hint:'Try although, but or because.'},
 {id:'c',type:'dialogue',title:'Frag nach',prompt:'Your friend says: “I tried something new on Saturday.” Ask three different questions to find out more.',tags:['questions','past-simple'],hint:'Where …? / Who …? / Did you …?'},
 {id:'d',type:'free_text',title:'Nächstes Mal',prompt:'What would you like to do next weekend? Write 3–4 sentences and explain your choice.',tags:['future','opinion'],minWords:25}
 ]},
 {id:'reserve-school',type:'lesson',date:'',status:'published',reserve:true,title:'Your school, your ideas',subtitle:'Eine vorbereitete Schreibeinheit für zwischendurch.',minutes:10,focus:['Beschreiben','Begründen','Satzbau'],tasks:[
 {id:'a',type:'free_text',title:'Ein typischer Tag',prompt:'Describe a typical school day in 4–5 sentences. What do you usually do before and after school?',tags:['present-simple','free-writing'],minWords:35},
 {id:'b',type:'translation',title:'Jetzt gerade',prompt:'Mein Freund wartet gerade auf den Bus. Normalerweise geht er zu Fuß zur Schule.',instruction:'Übersetze beide Sätze ins Englische.',tags:['present-simple','present-progressive']},
 {id:'c',type:'dialogue',title:'Eine Sache ändern',prompt:'Your teacher asks: “If you could change one thing about school, what would it be?” Reply in 3–4 sentences and give a reason.',tags:['opinion','linking'],minWords:25},
 {id:'d',type:'rewrite',title:'Etwas freundlicher',prompt:'Give me your notes. I need them.',instruction:'Formuliere eine höfliche englische Nachricht, in der du nach den Notizen fragst und dich bedankst.',tags:['register','requests']}
 ]}
];
const pairs=[['independent','unabhängig'],['dependency','Schutzgebiet;Kolonie'],['incredible','unglaublich'],['statistics','Statistik'],['populous','bevölkerungsreich;dicht besiedelt'],['billion','Milliarde'],['Hindi','Hindi'],['represent','vertreten;repräsentieren;verkörpern;symbolisieren'],['coastal','Küsten-'],['bush','Busch;Strauch'],['coral','Koralle;Korallen-'],['kangaroo','Känguru'],['the outback','das Hinterland Australiens'],['spider','Spinne'],['humid','feucht;feuchtwarm'],['remote','abgelegen;abgeschieden'],['sandy','sandig'],['stunning','atemberaubend;überwältigend;umwerfend'],['urban','städtisch;Stadt-'],['Aboriginal','Aborigine-'],['camel','Kamel'],['convict','Sträfling;Strafgefangene;Strafgefangener'],['koala','Koala'],['poisonous','giftig'],['territory','Territorium;Revier']];
export const LW2={id:'lw2',name:'LW2',type:'collection',active:true,words:pairs.map(([en,de],i)=>({id:'lw2-'+i,english:[{id:'e-'+i,answers:en==='represent'?['represent','to represent']:[en]}],german:de.split(';').map((s,j)=>({id:'d-'+i+'-'+j,answers:[s]}))})),note:'25 Vokabeln aus den zwei im Chat sichtbaren Buchfotos. Lautschrift, Klammerzusätze und Hilfsspalte wurden ausgelassen.'};
// Geschlechtsvarianten gehören zur selben Bedeutung.
LW2.words.find(w=>w.id==='lw2-21').german=[{id:'d-21-0',answers:['Sträfling']},{id:'d-21-1',answers:['Strafgefangene','Strafgefangener']}];
