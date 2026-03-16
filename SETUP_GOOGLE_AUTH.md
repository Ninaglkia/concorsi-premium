# Google OAuth Setup — Concorsi Premium

Step-by-step guide to enable Google login for this project.

---

## 1. Create a Google Cloud Project

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Click the project dropdown at the top left and select **Nuovo progetto**
3. Name it `concorsi-premium` (or any name you prefer)
4. Click **Crea**

---

## 2. Enable the Google OAuth API

1. From the left sidebar, go to **API e servizi > Libreria**
2. Search for **Google+ API** or **Google Identity**
3. Click **Abilita**

---

## 3. Configure the OAuth Consent Screen

1. Go to **API e servizi > Schermata consenso OAuth**
2. Select **Esterno** (External) and click **Crea**
3. Fill in the required fields:
   - **Nome app**: Concorsi Premium
   - **Email assistenza utente**: your email
   - **Informazioni di contatto sviluppatore**: your email
4. Click **Salva e continua** through the remaining steps (scopes, test users)
5. If in test mode, add your email as a test user under **Utenti di test**

---

## 4. Create OAuth 2.0 Credentials

1. Go to **API e servizi > Credenziali**
2. Click **Crea credenziali > ID client OAuth 2.0**
3. Set **Tipo di applicazione** to **Applicazione web**
4. Set **Nome** to `Concorsi Premium Web`
5. Under **URI di reindirizzamento autorizzati**, add:
   ```
   https://aqxrgpyufwzeqdpbuxdo.supabase.co/auth/v1/callback
   ```
   For local development, also add:
   ```
   http://localhost:3000/auth/callback
   ```
6. Click **Crea**
7. Copy the **Client ID** and **Client Secret** — you will need them in the next step

---

## 5. Enable Google Provider in Supabase

1. Open the [Supabase Dashboard](https://supabase.com/dashboard/project/aqxrgpyufwzeqdpbuxdo)
2. Go to **Authentication > Providers**
3. Find **Google** in the list and toggle it **On**
4. Paste the **Client ID** and **Client Secret** from the previous step
5. The **Callback URL (for OAuth)** shown in the Supabase panel should match what you set in step 4.5
6. Click **Save**

---

## 6. Enable Email/Password Auth (if not already enabled)

1. In the Supabase Dashboard, go to **Authentication > Providers**
2. Find **Email** in the list — toggle it **On**
3. Optionally enable **Confirm email** to require email verification on signup
4. Click **Save**

---

## 7. Add Environment Variables

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=https://aqxrgpyufwzeqdpbuxdo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

These are already configured in this project.

---

## 8. Test the Flow

### Google OAuth
1. Start the dev server: `npm run dev`
2. Navigate to [http://localhost:3000/auth/login](http://localhost:3000/auth/login)
3. Click **Continua con Google**
4. Complete the Google consent screen
5. You should be redirected to `/profilo`

### Email/Password
1. Navigate to [http://localhost:3000/auth/login](http://localhost:3000/auth/login)
2. Switch to **Registrati**, enter an email and password (min 6 characters)
3. Click **Crea account**
4. Check your email for a confirmation link (if email confirmation is enabled)
5. After confirming, log in with **Accedi**

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `redirect_uri_mismatch` | Make sure the redirect URI in Google Cloud exactly matches what Supabase shows |
| User stuck on login | Check that the Google OAuth app is not in test mode, or add the user as a test user |
| Email not received | Check Supabase > Authentication > Logs for email delivery errors |
| `Error 400: redirect_uri_mismatch` on localhost | Add `http://localhost:3000/auth/callback` to the authorized redirect URIs in Google Cloud |
