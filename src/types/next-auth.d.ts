import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";

interface User {
    id: string;
    name: string;
}

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: User;
        error: string;
    }
}

//     interface Account {
//         accessToken: string;
//         refreshToken: string;
//         expiresAt: number;
//     }

//     interface Token {
//         accessToken: string;
//         refreshToken: string;
//         expiresAt: number;
//     }
// }

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        accessToken: string;
        refreshToken: string;
        expiresAt: number;
        user: User;
        error?: string;
    }
}
