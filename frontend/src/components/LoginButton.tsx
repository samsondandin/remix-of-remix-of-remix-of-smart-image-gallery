import { useState, useEffect } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut, User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { LogIn, LogOut } from 'lucide-react';

export function LoginButton() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = auth.onAuthStateChanged((u) => {
            setUser(u);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            toast.success("Welcome back!");
        } catch (error: any) {
            console.error("Login failed:", error);
            toast.error("Login failed: " + error.message);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.info("Logged out");
        } catch (error: any) {
            toast.error("Logout failed");
        }
    };

    if (user) {
        return (
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    {user.photoURL && <img src={user.photoURL} className="w-8 h-8 rounded-full border border-gray-200" alt="Avatar" />}
                    <span className="text-sm hidden sm:inline-block font-medium">{user.displayName}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">Guest Mode (Local)</span>
            <Button variant="default" size="sm" onClick={handleLogin}>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
            </Button>
        </div>
    );
}
