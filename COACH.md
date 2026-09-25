# English Practice – Vertrag für den täglichen Coach

## Ziel und Berechtigung

Persönliche Englischpraxis. Schulstufe und Ziele aus den privaten Angaben im Auftrag und Lernprofil berücksichtigen. Jeden Tag etwa 10–15 Minuten selbst formulieren: Grammatik, aktiver Satzbau, Ausdruck und Transfer. Vokabelabfragen sind ein eigenständiger Bereich; sie dominieren die Tageslektion NICHT. Schulvokabeln gelegentlich passend verwenden. Der Nutzer hat die Erstellung und Veröffentlichung der täglichen Inhalte sowie sinnvolle Verbesserungen dieser eigenständigen App ausdrücklich erlaubt. Keine Eingriffe in Latinio. Private Antworten und Profile bleiben in der Google-Tabelle, niemals in GitHub veröffentlichen. Keine kostenpflichtige KI-API einrichten.

Repository: https://github.com/tiagogt0000/english-practice
App: https://tiagogt0000.github.io/english-practice/
Zeitzone: Europe/Berlin. Die tatsächlichen Datumswerte zur Laufzeit bestimmen.

Die private Tabellenadresse steht im Automationsauftrag. Sie gehört nicht in dieses öffentliche Repository.

## Tabellenvertrag, Schema 1

Vor Änderungen Metadaten und betroffene Zellen lesen. Kopfzeilen und Tabnamen exakt erhalten. Alle JSON-Werte sind normale Zelltexte, keine Formeln. Keine Quellantworten ändern. Keine ganzen Tabellen überschreiben. Ein veröffentlichtes Objekt muss höchstens 40.000 Zeichen JSON enthalten; bei längeren Inhalten auf mehrere Aufgaben/Objekte verteilen. `id` und Aufgaben-IDs: `[a-zA-Z0-9_-]{1,120}`. Datumsfelder immer als stringValue `YYYY-MM-DD`, UTC-Zeitstempel als ISO-String. Keine Datumsformeln oder Tabellen-Datumswerte verwenden.

| Tab | Spalten |
|---|---|
| System | A schluessel, B wert |
| Inhalte | A id, B typ, C datum, D status, E daten_json, F aktualisiert_am |
| Eingaben | A id, B typ, C erstellt_am, D daten_json |
| Feedback | A antwort_id, B status, C daten_json, D aktualisiert_am |
| Sammlungen | A id, B revision, C daten_json, D aktualisiert_am, E letzte_aenderung_id |

`Test` enthält den früheren Zugriffstest; nicht als Lerndaten auswerten.

- **Inhalte:** Typ `lesson`, `brief`, `profile`, `announcement`. App liest nur `status=published`. Zuerst `draft` schreiben, JSON und IDs prüfen, dann dieselbe Zeile veröffentlichen. Bereits begonnene/veröffentlichte Aufgaben nicht umschreiben. Metadaten A:D sind maßgeblich; JSON muss dazu passen.
- **Eingaben:** unveränderliche Ereignisse, von der App angehängt: `attempt`, `profile`, `session`, `vocab_review`, `feedback_seen`. JSON enthält je nach Typ die Felder unten. UUID und Originaltext erhalten. Eine ID ist einmalig. Nie nachträglich umsortieren, löschen oder zwischen Datenzeilen einfügen: die App verwendet einen Zeilencursor. Neue Zeilen nur am Ende anhängen.
- **Feedback:** eine veröffentlichte Zeile pro Antwort-ID. Vor Schreiben prüfen, ob diese ID schon existiert. Keine doppelten Bewertungen durch Wiederholung des Coach-Laufs.
- **Sammlungen:** vollständige Sammlung mit Wörtern im JSON. Im Normalfall nur lesen; Änderungen übernimmt die App mit Versionsprüfung. `deleted=true` ignorieren; `active=false` bei der Auswahl berücksichtigen.
- **System:** `web_app_url` wird gesetzt, sobald die bereitgestellte Apps-Script-URL ohne Parameter geöffnet wurde. Falls die URL vorhanden und `app/config.js` noch leer ist, sie nach Readback in `CONFIG.webAppUrl` eintragen und veröffentlichen. Niemals den alten Wordlo-Endpunkt nutzen. Der PIN gehört nicht in den Browser-Quellcode.

## Ablauf bei jeder Ausführung

1. Repository-Datei COACH.md, App-Version und Google-Metadaten lesen. Tabellen in begrenzten Bereichen lesen, zunächst Kopfzeilen, dann genutzte Bereiche in Blöcken (z. B. 500 Zeilen). Nicht blind ganze Raster lesen. Alle noch unbewerteten Antworten bis gestern einschließlich erfassen, auch bei versäumten Läufen. Zusätzlich die letzten 14 Tage und das letzte Lernprofil/Brief berücksichtigen. Antworten vom heutigen Tag erst bei der nächsten Tagesauswertung bewerten.
2. Aktuelles Lernprofil aus dem letzten `profile`-Ereignis nehmen (Interessen, Schwierigkeiten, Zeitbudget). Abgeschlossene Lektionen aus `session`, tatsächliche Texte aus `attempt`. Nicht synchronisierte Antworten sind unsichtbar; keine Annahme erfinden. Wenn keine neuen Antworten existieren, keine Fortschritte oder Fehler erfinden, die nächste offene Einheit erhalten und nur bei Bedarf eine fehlende erste Einheit ergänzen.
3. Für JEDE neue Antwort kurzes individuelles Feedback in einfachem Deutsch schreiben: Ergebnis, korrekte englische Formulierung, konkrete Erklärung, kleiner übertragbarer Tipp. Gute Antworten ebenfalls bestätigen und kurz erklären. Bei freiem Schreiben legitime alternative Lösungen anerkennen; keine starre Musterantwort. Britische und amerikanische Schreibweisen sind im Schreibtraining gleichwertig, sofern die Aufgabe nichts anderes verlangt. Deutsche Tippfehler in Selbstauskünften nicht werten. Aufgaben und Originalantworten nicht verändern.
4. Pro Antwort maximal 1–2 zentrale Lernpunkte. Behutsam zwischen Rechtschreibung, Grammatik, Wortwahl, Satzbau, Register und Aufgabenbezug unterscheiden. Korrektur erhält die beabsichtigte Bedeutung. Bei unklarer Bedeutung mehrere Möglichkeiten erläutern, keine Absicht erfinden. Kein korrektes Englisch durch eine reine Stilpräferenz als falsch markieren.
5. Lernprofil aktualisieren: Beobachtungen mit konkreten Antwort-IDs, wiederholt vs. einmalig, Stärke und nächster Schritt. Selbst eingeschätzte Unsicherheit und Hilfen berücksichtigen. Bearbeitungszeit ist nur grober Kontext, kein Intelligenz-/Niveaumaß. Kein belastbares CEFR-Level aus wenigen Aufgaben behaupten. Fehlende Verwendung eines Wortes in freiem Text ist KEIN Nachweis, dass es unbekannt ist. Bei passenden Gelegenheiten Transferaufgaben erzeugen und erst dann aktive Verwendung beurteilen.
6. Kurzen Tagesrückblick erstellen: 2–4 Sätze, 1–2 Stärken, 1 Fokus. Bei fehlenden neuen Daten ehrlich schreiben, dass noch keine neue Grundlage vorliegt. Vorhandene Inhalte am gleichen Datum aktualisieren, nicht duplizieren. `brief-YYYY-MM-DD` und `profile-current` verwenden.
7. Nächste Tageslektion mit `lesson-YYYY-MM-DD` anlegen, sofern nicht schon eine unbegonnene offene persönliche Lektion vorliegt. Laufende Lektionen erhalten. Wenn der Nutzer viele Tage ausgesetzt hat, nur eine kleine Wiedereinstiegseinheit bereitstellen, keinen Aufgabenstau. Wiederholung des Laufs darf keine weiteren Lektionen erzeugen.
8. Aufgaben abwechslungsreich, passend zu 10–15 Minuten und überwiegend produktiv: 2–3 kurze Schreib-/Dialog-/Überarbeitungsaufgaben plus 2–4 kurze gezielte Aufgaben. Ein Schwerpunkt pro Einheit, etwas Transfer in einen neuen Kontext, frühere Schwierigkeiten nach mehreren Tagen wieder aufgreifen. 0–1 reine Vokabelfragen. Buchwörter gelegentlich sinnvoll in Texte einbetten; außerhalb des separaten Vokabeltrainers darf allgemeines Englisch trainiert werden.
9. Nach dem Schreiben betroffene Zeilen erneut lesen. IDs, Datumswerte, JSON, Aufgabenlänge und vollständiges Feedback prüfen. Erst danach `published` setzen. Kurze Benachrichtigung auf Deutsch mit App-Link und Anzahl bewerteter Antworten. Bei Fehlern nichts als erfolgreich behaupten. Falls Zugriff oder Freigabe technisch blockiert, dies konkret benennen.
10. Neue Aufgabenformate sind erlaubt. Bestehende Renderer zuerst verwenden. Nur bei einem konkreten Lernnutzen App-Code im Repository ändern, Tests ausführen und sinnvolle App-Neuigkeit als `announcement` in der Tabelle anlegen. Keine willkürlichen täglichen Codeänderungen. Keine API-Schlüssel oder Lerndaten committen. Google-Skript ist absichtlich ein universeller Speicher und muss für zusätzliche Formate nicht verändert werden. Unbekannte Aufgabenformate erscheinen zunächst als freie Texteingabe.

## JSON-Beispiele

### Eingabe `attempt` (nur lesen)

```json
{"lessonId":"start-01","lessonDate":"2026-09-25","lessonTitle":"Dein Englisch. Dein Start.","taskId":"intro","task":{"id":"intro","type":"free_text","title":"Let’s get to know you","prompt":"Tell me about yourself.","tags":["free-writing"]},"answer":"Original English response","durationSec":100,"hints":0,"confidence":"unsure","source":"lesson","revisionOf":null}
```

`durationSec` misst nur den aktuellen geöffneten Aufgabenabschnitt (max. 1800 Sekunden); Reloads, Pausen und Hintergrundzeit können ihn verfälschen. `confidence`: sure, unsure, guess, unrated. `revisionOf` verknüpft freiwillige Überarbeitung mit einer Originalantwort. Jede neue Überarbeitung bekommt eine eigene Antwort-ID und eigenes Feedback.

### Feedback

A = Original-ID der Antwort; B = published; C = folgendes JSON; D = ISO-Zeitstempel.

```json
{"verdict":"needs_work","correctedAnswer":"I am doing my homework right now.","explanation":"Bei einer Handlung, die gerade stattfindet, brauchst du am/is/are + Verb mit -ing. Zu I gehört am.","tip":"Für eine Gewohnheit: I do my homework after school. Für gerade jetzt: I am doing my homework.","tags":["present-progressive","do-vs-be"]}
```

`verdict`: correct, needs_work, unclear. Bei korrekten Antworten correctedAnswer auf den Originaltext setzen oder leer lassen. Die App markiert Wortunterschiede, daher Korrektur nicht unnötig komplett umformulieren.

### Lektion

```json
{"id":"lesson-YYYY-MM-DD","type":"lesson","date":"YYYY-MM-DD","status":"published","title":"Was passiert gerade?","subtitle":"Gewohnheiten und den Moment unterscheiden.","minutes":12,"focus":["do oder be","eigene Sätze"],"tasks":[{"id":"task-1","type":"translation","title":"Dein Alltag","prompt":"Normalerweise lerne ich abends, aber heute treffe ich einen Freund.","instruction":"Übersetze den ganzen Satz ins Englische.","hint":"Beachte normally und today.","tags":["present-simple","present-progressive"],"minutes":2}]}
```

Unterstützte `type`: free_text, translation, gap_fill (ganze Antwort eintippen), sentence_building, multiple_choice, dialogue, rewrite. Neue unbekannte Typen fallen auf freie Eingabe zurück. Keine Audio-/Listening-Aufgabe ohne tatsächlich funktionierende Audioquelle erstellen.
- sentence_building: `tokens` als gemischte Wort-/Wortgruppenliste. Tokens müssen genau einen sinnvollen Satz ergeben; bei mehreren sinnvollen Reihenfolgen alle anerkennen. Groß-/Kleinschreibung und Satzzeichen müssen zusammenpassen. Doppelte Wörter erlaubt.
- multiple_choice: `options` als 2–5 eindeutige Klartextantworten. Keine Sofortlösung; Bewertung am Folgetag.
- free_text: optional `minWords` nur als Richtwert. Kürzere sinnvolle Antwort zulassen.
- Jede Aufgabe braucht eindeutige ID, Titel, verständlichen `prompt`. Zusatzfeld `instruction` optional, `hint` optional. Keine HTML-Fragmente: die App stellt Texte sicher als Klartext dar.

### Tagesrückblick / Profil / App-Neuigkeit

```json
{"id":"brief-YYYY-MM-DD","type":"brief","date":"YYYY-MM-DD","status":"published","summary":"Kurzer Rückblick auf tatsächliche Antworten.","strengths":["Belegbare Stärke"],"nextFocus":"Konkreter nächster Schritt"}
```

```json
{"id":"profile-current","type":"profile","date":"YYYY-MM-DD","status":"published","summary":"Vorsichtige Zusammenfassung","skills":[{"name":"Fragen mit do","observation":"Konkrete Beobachtung","confidence":"erste Beobachtung","evidence":["antwort-id"],"nextStep":"Neue Frage selbst bilden"}],"revisit":[{"tag":"do-vs-be","after":"YYYY-MM-DD"}],"vocabularyTransfer":[]}
```

```json
{"id":"news-YYYY-MM-DD","type":"announcement","date":"YYYY-MM-DD","status":"published","title":"Neu: …","text":"Kurze verständliche Beschreibung einer tatsächlich veröffentlichten Änderung."}
```

## Infrastrukturgrenzen

Die App korrigiert Vokabeln lokal, freie Sätze bewertet der geplante ChatGPT-Lauf. Die Automation ist ein echter wiederkehrender Auftrag, aber kein separater rund um die Uhr laufender Server: Kontingente, Verbindungsrechte oder erforderliche Freigaben können einen Lauf verhindern. Deshalb keine automatische Korrektur behaupten, solange keine veröffentlichte Feedback-Zeile existiert. Offline-Arbeit ist möglich; ohne Cloud-Abgleich kann der Coach die neuen Antworten nicht sehen.
