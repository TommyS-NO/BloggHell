# BloggHell

BloggHell er en enkel bloggapplikasjon som lar brukere lese, like og kommentere på innlegg, mens administratorer kan opprette, redigere og slette innlegg/Kommentarer.

## NB:

//////////////////////////////////////////////////////

- OPPRETT en .env fil for innlogging av Admin Rollen.
-
- ADMIN_USERNAME= Admin
- ADMIN_PASSWORD=\***\*\*\*\***
- SESSION_SECRET=SECRET_KEY

- **Brukere**:

  - Les innlegg
  - Like innlegg
  - Legg til kommentarer

- **Administratorer**:
  - Opprett innlegg
  - Rediger innlegg
  - Slett innlegg
  - Administrer kommentarer

## Installasjon

1. Klone repositoriet: `git clone [https://github.com/TommyS-NO/BloggHell.git]`
2. Naviger til prosjektmappen: `cd BloggHell`
3. Installer avhengigheter: `npm install`
4. Start serveren: `npm start`
5. Åpne nettleseren og gå til `http://localhost:3234`

### Endepunkter:

- **GET** `/posts`: Hent alle innlegg
- **POST** `/admin/create-post`: Opprett et nytt innlegg
- **PUT** `/admin/update-post/:id`: Oppdater et eksisterende innlegg
- **DELETE** `/admin/delete-post/:id`: Slett et innlegg
