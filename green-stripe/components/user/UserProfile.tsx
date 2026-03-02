import { userService } from "../../modules/user/userService";

interface UserProfileProps {
    userId: string;
}

export function UserProfile({ userId }: UserProfileProps) {
    // This is a UI component for the user module
    return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl">
                G
            </div>
            <div>
                <h3 className="font-semibold text-slate-800">User Profile</h3>
                <p className="text-sm text-slate-500">ID: {userId}</p>
            </div>
        </div>
    );
}
