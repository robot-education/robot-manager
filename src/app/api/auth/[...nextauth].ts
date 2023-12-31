import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: JWT, account: any) {
    try {
        const url =
            "https://oauth.onshape.com/token?" +
            new URLSearchParams({
                // client_id: process.env.ONSHAPE_CLIENT_ID!,
                client_secret: process.env.ONSHAPE_CLIENT_SECRET!,
                refresh_token: token.refreshToken,
                code: account.code
            });
        const response = await fetch(url, {
            method: "POST"
            // headers: {
            //     "Content-Type": "content/json"
            // },
        });
        const newTokens = await response.json();
        if (!response.ok) {
            throw newTokens;
        }
        return {
            ...token,
            accessToken: newTokens.access_token,
            expiresAt: Date.now() + newTokens.expires_in,
            refreshToken: newTokens.refresh_token // ?? token.refreshToken // Fall back to old refresh token
        };
    } catch (error) {
        console.log(error);
        return {
            ...token,
            error: "RefreshAccessTokenError"
        };
    }
}

const handler = NextAuth({
    pages: {
        error: "/grant-denied"
    },
    providers: [
        {
            id: "onshape",
            name: "Onshape",
            type: "oauth",
            authorization: "https://oauth.onshape.com/oauth/authorize",
            // May need to add code param?
            token: "https://oauth.onshape.com/oauth/token",
            userinfo: "https://cad.onshape.com/api/v6/users/sessioninfo",
            profile: (profile) => ({ id: profile.id, name: profile.name })
        }
    ],
    callbacks: {
        jwt: async ({ token, user, account }) => {
            // initial sign in
            if (account && user) {
                return {
                    accessToken: account.access_token!,
                    expiresAt: account.expires_at! * 1000,
                    refreshToken: account.refresh_token!,
                    user
                };
            } else if (Date.now() + 100 * 1000 < token.expiresAt) {
                return token;
            }
            // error should redirect to /grant-denied

            return refreshAccessToken(token, account);
        }
    }
});

export { handler as GET, handler as POST };
