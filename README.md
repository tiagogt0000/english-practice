# English Practice

Eigenständige Englisch-Lern-App für tägliche Schreibpraxis und persönliches Feedback am Folgetag.

- **App:** https://tiagogt0000.github.io/english-practice/
- **Fertiger Apps-Script-Code:** [google/Code.gs](google/Code.gs)
- **Täglicher Coach und Datenformat:** [COACH.md](COACH.md)

## Einmalige Google-Einrichtung

1. Die bereits angelegte Google-Tabelle öffnen → **Erweiterungen → Apps Script**.
2. Inhalt von **Code.gs** vollständig durch [google/Code.gs](google/Code.gs) ersetzen. Keine zweite HTML-Datei nötig.
3. Speichern, Funktion **setupEnglish** ausführen, Google-Zugriff erlauben, eigenen Zugangscode festlegen .
4. **Bereitstellen → Neue Bereitstellung → Web-App**. Ausführen als **Ich**, Zugriff **Jeder**.
5. Web-App-URL öffnen und **App verbinden** anklicken. Die App übernimmt die URL. Einmal den Zugangscode eingeben.
6. In der App muss **Mit Google synchronisiert** erscheinen. Eine Antwort abgeben und prüfen, ob in **Eingaben** eine neue Zeile steht.

Der Zugangscode wird im Skript nur als Hash gespeichert. Er ist eine einfache Zugangssperre für diese persönliche App, keine Mehrbenutzeranmeldung. Keine alten Wordlo-Verbindungsdaten verwenden. Die Google-Tabelle muss nicht öffentlich freigegeben werden. Geräte speichern PIN und Entwürfe im eigenen Browserspeicher. Keine kostenpflichtige KI-API.

Sobald die Web-App erstmals geöffnet wurde, steht ihre URL im Tab System. Der tägliche Coach kann sie in `app/config.js` eintragen, damit weitere Geräte die Verbindung direkt finden. Alternativ die URL einmal im Chat schicken.

## Enthalten

- 10–15 Minuten Schreiben: freie Texte, kurze Übersetzungen, Lücken, Satzbausteine, Dialoge, Überarbeitungen und Multiple Choice.
- Erste Standortbestimmung und zwei freiwillige vorbereitete Einheiten.
- Individuelles Feedback je Antwort, Wortänderungen, Erklärungen, Tipps, freiwilliges erneutes Formulieren.
- Eigene Ziele, Interessen und Zeitbudget, Tagesrückblick und vorsichtiges Lernprofil.
- Eigener Vokabeltrainer mit Sammlungen, Auffrisch-Sammlungen, Suche, Bearbeitung, JSON-Import und -Export.
- Deutsch ↔ Englisch oder gewichteter Mix; eine oder alle Bedeutungen; UK/US-Zuordnung anhand hinterlegter Daten.
- Deutsche Tippfehler tolerant und manuell korrigierbar; englische Schreibweise streng. Browserattribute fordern passende Autokorrektur an; die tatsächliche Umsetzung hängt von Tastatur/Browser ab.
- Sammlung LW2 aus den 25 Vokabeln auf den zwei im Chat sichtbaren Buchfotos. Klammerzusätze, Lautschrift und rechte Hilfsspalte ausgelassen. Weitere nicht sichtbare Fotos wurden nicht ergänzt.
- Lokale Entwürfe, Offline-Speicherung nach dem ersten Besuch, Cloud-Abgleich mit Wiederholschutz und Konfliktanzeige, Datensicherungen.

## Technisch

Plain HTML, CSS und JavaScript-Module, keine Build-Abhängigkeiten. Die HTML lädt lokale Module im selben Repository. Google Apps Script stellt eine iframe-Brücke bereit; `google.script.run` übernimmt Serveraufrufe ohne unsichere no-cors-Schreibbestätigungen. Erfolgreiches Speichern wird erst nach Serverbestätigung angezeigt. Das Skript speichert generische Aufgaben- und Feedbackdaten; neue didaktische Formate brauchen keine Skriptänderung.

Ereignisse sind unveränderlich und tragen eindeutige IDs. Wiederholte Übertragung ist idempotent. Sammlungen nutzen Revisionen und eine Änderungs-ID. Konflikte werden angezeigt; beide Fassungen lassen sich behalten. Kursinhalte und Feedback werden ausschließlich vom Coach über die Google-Verbindung geschrieben. Der Browser kann sie nur lesen.

**Wichtig für Betrieb:** Zeilen in Eingaben nicht löschen oder umsortieren. Bei großen Datenmengen später eine versionierte Archivierung ergänzen; derzeit werden Tabellen auf dem Server vollständig gelesen, die Ereignisse in 500er-Blöcken übertragen. Beschädigte JSON-Einträge werden nicht still übersprungen. In der App sind ausstehende Synchronisierung und fehlendes Feedback sichtbar.

## Testen

```sh
npm test
python3 -m http.server 8766
```

Tests prüfen Tippfehlerregeln, Varianten, Datenzusammenführung während laufender Synchronisierung, Authentifizierung, Wiederholschutz, Konflikte und Pagination. Der zusätzliche Browser-Abnahmelauf prüft die komplette erste Lektion, Entwürfe nach Reload, Sammlungen und mobilen Umbruch. Ein echter Google-Ende-zu-Ende-Test benötigt die vom Kontoinhaber bereitgestellte Web-App.

## GitHub Pages

Repository → Settings → Pages → Build and deployment → Deploy from a branch → main / (root) → Save. Statische Assets liegen direkt im Repository; `.nojekyll` ist vorhanden. Bei Änderungen Service-Worker-Cache-Version anheben, wenn Dateistruktur oder Datenvertrag betroffen sind. Keine privaten Antworten, PINs oder Lernprofile committen.

Offizielle Referenzen: [Google Web-Apps](https://developers.google.com/apps-script/guides/web), [google.script.run](https://developers.google.com/apps-script/guides/html/communication), [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
