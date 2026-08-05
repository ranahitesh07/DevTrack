import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Rocket } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await register(username, email, password);

      navigate("/login");
    } catch {
      setError("Unable to create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black px-4">
      <Card className="w-full max-w-md rounded-2xl border-0 shadow-2xl">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex justify-center">
            <Rocket className="h-12 w-12 text-blue-500" />
          </div>

          <CardTitle className="text-center text-4xl font-extrabold tracking-tight">
            DevTrack
          </CardTitle>

          <p className="mt-1 text-center text-sm text-muted-foreground">
            Create your account
          </p>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Username</Label>

              <Input
                id="username"
                placeholder="Choose a username"
                className="h-12 text-base transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="h-12 text-base transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                className="h-12 text-base transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>

            {error && (
              <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full cursor-pointer text-base font-semibold transition-all duration-300 hover:scale-[1.02]"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-500 transition-colors duration-300 hover:text-blue-400 hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}