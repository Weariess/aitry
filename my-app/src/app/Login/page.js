"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";

// import PocketBase from "pocketbase"
// const pb = new PocketBase('http://57.128.223.203:8090');
import pb from "@/lib/pb";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Reset error message

    try {
      const authData = await pb.collection("users").authWithPassword(email, password);
      console.log("User logged in:", authData);
      pb.authStore.save(authData.token, authData.record);

      alert("Login successful!");
      router.push("/Quiz"); 

    } catch (err) {
      //console.error("Login failed:", err);
      setError("Invalid username or password");
    }
  };


    return(
        <div className="m-0 w-full h-screen bg-cover bg-center bg-white flex flex-row">

            <main className="w-[40%] h-screen bg-zinc-700 flex flex-col justify-center pb-[5%]" >
            

            <form onSubmit={handleLogin} className="flex items-center flex-col space-y-6">
            <h1 className="text-white font-mono font-bold text-2xl">SIGN IN</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}

            <Input
            className="text-white w-[55%] bg-button-grey"
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />

            <Input
            className="text-white w-[55%] bg-button-grey"
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            minLength="8"
            onChange={(e) => setPassword(e.target.value)}
            required
            />

            <Button type="submit" className="bg-button-grey hover:bg-zinc-800 w-[30%] border border-white cursor-pointer">Login</Button>
            </form>

            </main>

            <aside className="w-[60%] h-screen flex flex-col pl-3">
            </aside>

            <div className="absolute bottom-[5%] left-[5%]">
              <Button className="bg-zinc-600 hover:bg-zinc-800 cursor-pointer"><Link href="/">Sign up</Link></Button>
            </div>
           
        </div>
    )
}