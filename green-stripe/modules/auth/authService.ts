export const authService = {
    login: async (credentials: any) => {
        // Placeholder for Supabase auth implementation
        console.log("Mock login with:", credentials);
        return { user: { id: "1", role: "authenticated" }, error: null };
    },
    logout: async () => {
        console.log("Logging out...");
    },
    getSession: async () => {
        return { session: null };
    }
};
