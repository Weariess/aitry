"use client"

import Image from "next/image"
import Link from "next/link"
import logo from "/public/images/logo.png"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

// import PocketBase from "pocketbase"
// const pb = new PocketBase('http://57.128.223.203:8090');
import pb from "@/src/lib/pb";

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

      // You don't need to store anything manually — pb.authStore handles session
      alert("Login successful!");
      router.push("/"); // Or wherever you want to redirect after login

    } catch (err) {
      //console.error("Login failed:", err);
      setError("Invalid username or password");
    }
  };


    return(
        <div className="m-0 w-full h-screen bg-cover bg-center bg-white flex flex-row">

            <main className="w-[40%] h-screen bg-black/80 flex flex-col justify-center pb-[5%]" >

            <form onSubmit={handleLogin} className="flex items-center flex-col space-y-6">

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

            <Button type="submit" className="bg-button-grey hover:bg-black w-[30%] border border-white cursor-pointer">Login</Button>
            </form>

            </main>

            <aside className="w-[60%] h-screen flex flex-col pl-3">
                <h1 className="text-white text-9xl italic">Growth</h1>
                <h1 className="text-white text-9xl italic">Progress Improvement</h1>
            </aside>

            <div className="absolute top-[5%] right-[5%]">
              <Button className="bg-custom-blue hover:bg-custom-blue-100 cursor-pointer"><Link href="/">Go back</Link></Button>
            </div>
           
        </div>
    )
}