# Tuga's App — Login Page

A login page UI built for an Internship Technical & Creative Assessment, matching the
supplied design and implementing the required functionality: form validation, Google
sign-in via Firebase Authentication, and deployment on Firebase Hosting.

## Live Demo

- Firebase Hosting: `<add your hosted link here>`
- GitHub Repository: `<add your repo link here>`

## Stack

- **React 19** + **TypeScript**, bundled with **Vite**
- **Material UI (MUI) 9** — theme-driven styling, no ad-hoc CSS
- **Firebase Authentication** (Google provider) + **Firebase Hosting**
- **React Router** for page navigation

## Pages

| Route              | Page                | Purpose                                                        |
| ------------------ | -------------------- | ---------------------------------------------------------------- |
| `/`                 | Login                | Email/password validation, Google sign-in                      |
| `/register`         | Register             | Name/email/password validation, Google sign-in                 |
| `/forgot-password`  | Forgot Password      | Email validation, simulated "reset link sent" confirmation      |
| `/token`            | Token                | Shows the signed-in user's profile and Google access token      |

There is no backend authentication logic for email/password forms — per the brief,
only client-side validation is required. Google sign-in is fully functional through
Firebase.

## Folder Structure

```
src/
  assets/       Illustration images (login.png, register.png, etc.)
  components/   Shared UI pieces (if any extracted later)
  firebase/     config.ts (Firebase app init), auth helpers
  pages/        LoginPage, RegisterPage, ForgotPasswordPage, TokenPage
  theme/        theme.ts — palette, typography, component overrides
  utils/        Shared validation helpers
public/
  illustration.svg   Fallback/reference illustration
```

## Running Locally

```bash
npm install
cp .env.example .env     # fill in your Firebase web app values
npm run dev
```

## Firebase Setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Add a **Web app** to the project (Project settings → Your apps → `</>`).
3. Copy the generated config values into `.env`:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
4. Go to **Build → Authentication** in the sidebar and click **Get started** if you
   haven't initialized Authentication for this project yet.
5. Under **Sign-in method**, enable **Google** and set a project support email.
6. Under **Settings → Authorized domains**, confirm `localhost` is listed for local
   development, and add your Firebase Hosting domain once deployed.

## Deploying to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting     # public dir: dist, single-page app: yes
npm run build
firebase deploy --only hosting
```

`firebase.json` is preconfigured to serve `dist` and rewrite all routes to
`index.html`, which client-side routes like `/token` need on a direct page load or
refresh.

## Implementation Notes

- **Validation** — email format and password length are validated on blur and on
  submit for all forms; errors are shown inline under each field.
- **Google sign-in** — uses `signInWithPopup`. The OAuth access token is only
  available on the credential returned at sign-in time, so it's cached in
  `sessionStorage` and read by the `/token` page. `/token` redirects back to `/` if
  there is no active session, so it can't be opened cold.
- **Apple / Facebook buttons** — shown in the UI to match the design, but disabled.
  Wiring them up requires a paid Apple Developer account (Apple) and a separate
  Facebook Developer app + OAuth setup (Facebook), which were out of scope for this
  assessment since only Google sign-in was required.
- **Theming** — all colors, typography, and MUI component overrides live in
  `src/theme/theme.ts`, so the visual system can be adjusted from a single file
  rather than scattered inline styles.

## Environment Variables

See `.env.example` for the required keys. `.env` is git-ignored and should never be
committed — Firebase web API keys are safe to expose client-side (access control is
enforced through Firebase Security Rules, not key secrecy), but keeping `.env` local
is still good practice.
