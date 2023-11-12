# BloggHell

BloggHell er en enkel bloggapplikasjon som lar brukere lese, like og kommentere på innlegg, mens administratorer kan opprette, redigere og slette innlegg/Kommentarer.

- **Brukere**

  - Les innlegg
  - Like innlegg
  - Legg til kommentarer

- **Administratorer**

  - Logg Inn med Brukernavn og Passord (admin.json)
  - Opprett innlegg
  - Rediger innlegg
  - Slett innlegg
  - Administrer kommentarer

## Installasjon

1. Klone repositoriet: `git clone [https://github.com/TommyS-NO/BloggHell.git]`
2. Naviger til prosjektmappen: `cd BloggHell`
3. Installer avhengigheter: `npm install`
4. Start serveren: `npm start`
5. Åpne nettleseren og gå til `http://localhost:8080`

### Endepunkter:

- **GET** `http://localhost:8080/api/blogginnlegg`: Hent alle innlegg
- **GET** `http://localhost:8080/api/admin/blogginnlegg/:id`: Hent 1 Innlegg
- **POST** `http://localhost:8080/api/admin/blogginnlegg`: Opprett et nytt innlegg
- **PUT** `http://localhost:8080/api/admin/blogginnlegg/:id`: Oppdater
- **DELETE** `http://localhost:8080/api/admin/blogginnlegg/:id`: Slett et innlegg
