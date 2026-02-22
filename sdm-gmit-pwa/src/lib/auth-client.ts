import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_API_URL?.replace('/api', '') || `http://${window.location.hostname}:3000` // the base url of your auth server
})

export const { signIn, signUp, signOut, useSession } = authClient;
