import { LoginForm } from "../components/auth/LoginForm";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e6f7eb] to-[#c1ecd0] p-4 font-sans text-slate-800">
      <LoginForm />
    </div>
  );
}
