export const userService = {
    getProfile: async (userId: string) => {
        // Placeholder for fetching user profile
        return {
            id: userId,
            name: "Green Stripe User",
            email: "user@example.com",
            avatar_url: null
        };
    },
    updateProfile: async (userId: string, data: any) => {
        console.log("Updating profile for:", userId, data);
        return { success: true };
    }
};
