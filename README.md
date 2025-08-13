# YouTube Transcriber App
Deze app zet automatisch YouTube-video’s om naar tekst.

## Functies
- Haalt audio uit YouTube-video's
- Zet audio om naar tekst met automatische taalherkenning (Whisper)
- Resultaat wordt getoond in een bewerkbare tekstweergave
- Download als TXT, DOCX of PDF

## Installatie
1. Clone deze repo
2. Installeer dependencies: `npm install`
3. Zorg dat [ffmpeg](https://ffmpeg.org/) geïnstalleerd is
4. Zorg voor een geldige OpenAI API key in `OPENAI_API_KEY`
5. Start de app: `npm run dev`

## Gebruik
1. Voer de YouTube-link in het veld in
2. Klik op **Transcribeer**
3. Bewerk de tekst indien nodig en download in het gewenste formaat

## Licentie
MIT License
