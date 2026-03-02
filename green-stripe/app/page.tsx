"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../modules/auth/authService";

/**
 * Root Router Page
 * Handles initial redirection based on authentication state.
 */
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        // Check current session
        const { session } = await authService.getSession();

        if (session) {
          router.replace("/user/dashboard");
        } else {
          router.replace("/auth/login");
        }
      } catch (error) {
        console.error("Auth check failed", error);
        router.replace("/auth/login");
      }
    }

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f1f8f4]">
      <div className="w-12 h-12 border-4 border-[#4caf50] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-[#1b5e20] font-medium font-sans">Initializing GreenStripe...</p>
    </div>
  );
}
