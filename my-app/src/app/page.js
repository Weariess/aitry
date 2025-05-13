"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import pb from "@/lib/pb";


export default function Register() {


    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        passwordConfirm: "", 
      });
    
      const [message, setMessage] = useState("");
      const router = useRouter();
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const newUser = await pb.collection("users").create({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            passwordConfirm: formData.passwordConfirm,
          });
    
          setMessage("Registration successful! You can now log in.");
          setFormData({ username: "", email: "", password: "", passwordConfirm: "" });

          setTimeout(() => {
            router.push("/Login");
          }, 1000); 

        } catch (error) {
          setMessage("Registration failed: " + error.message);
        }
      };

    return(
        <div className="m-0 w-full h-screen bg-cover bg-center bg-white flex flex-row">

            <main className="w-[40%] h-screen bg-zinc-700 flex flex-col justify-center" >
            

            <form onSubmit={handleSubmit} className="flex items-center flex-col space-y-5">
            <h1 className="text-white font-mono font-bold text-2xl">WELCOME</h1>
            <Input
            className="text-white w-[65%] bg-button-grey"
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            />

            <Input
            className="text-white w-[65%] bg-button-grey"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            />
            <Input
            className="text-white w-[65%] bg-button-grey"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            minLength="8"
            onChange={handleChange}
            required
            />
            <Input
            className="text-white w-[65%] bg-button-grey"
            type="password"
            name="passwordConfirm"
            placeholder="Confirm Password"
            value={formData.passwordConfirm}
            minLength="8"
            onChange={handleChange}
            required
            />
            <Button type="submit" className="bg-button-grey hover:bg-zinc-800 w-[35%] border border-white">Register</Button>
            </form>

            </main>

            <aside className="w-[60%] h-screen flex flex-col pl-3">
                <h1 className="text-white text-9xl italic">Growth</h1>
                <h1 className="text-white text-9xl italic">Progress Improvement</h1>
            </aside>

            <div className="absolute bottom-[5%] left-[5%]">
              <Button className="bg-zinc-600 hover:bg-zinc-800"><Link href="/Login">Sign in</Link></Button>
            </div>
           
        </div>
    )
}