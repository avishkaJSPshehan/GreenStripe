import { supabase } from "../../lib/supabase";

export const authService = {
    // LOGIN with Email and Password
    login: async (credentials: any) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password
        });

        if (error) {
            console.error("Supabase login error:", error.message);
            return { user: null, error: error.message };
        }

        return { user: data.user, error: null };
    },

    // SIGNUP with Email, Password AND Custom Username
    signUp: async (credentials: any) => {
        const { data, error } = await supabase.auth.signUp({
            email: credentials.email,
            password: credentials.password,
            options: {
                data: {
                    username: credentials.username, // This goes into the 'profiles' via our SQL Trigger
                }
            }
        });

        if (error) {
            console.error("Supabase signup error:", error.message);
            return { user: null, error: error.message };
        }

        return { user: data.user, error: null };
    },

    logout: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("Logout error:", error.message);
    },

    getSession: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return { session };
    },

    // FETCH CUSTOM USER PROFILE from our public.profiles table
    getProfile: async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error("Error fetching profile:", error.message);
            return { profile: null, error: error.message };
        }
        return { profile: data, error: null };
    }
};
