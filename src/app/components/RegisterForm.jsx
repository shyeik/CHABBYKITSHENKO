"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import Link from "next/link";
import { useRouter } from "next/navigation";

gsap.registerPlugin(Draggable);

function RegisterForm() {
  const burgerRef = useRef(null);
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setError("All fields are necessary");
      return;
    }

    try {
      const resUserExists = await fetch("api/userExists", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        setError("User already exists.");
        return;
      }

      const res = await fetch(`api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        router.push("/");
      } else {
        console.log("User registration Failed.");
      }
    } catch (error) {
      console.log("Error while User registrating.");
    }
  };

  useEffect(() => {
    const el = burgerRef.current;

    gsap.to(el, {
      scale: 1.1,
      duration: 1,
      ease: "bounce.inOut",
      repeat: -1,
      yoyo: true,
    });
  }, []);

  return (
    <div>
      <div className="flex flex-grow:1 items-center  justify-center h-screen">
        <div className="my-20 bg-gray-200 w-200 h-200 rounded-4xl ">
          <h1 className="pt-20 text-center font-bold text-5xl mt-10">
            Register
          </h1>
          <p className="m-2 text-center font-extralight italic">
            Already have account?
            <Link href="/" className="underline mx-2">
              Log in
            </Link>
          </p>
          {error && (
            <div className="flex justify-center items-center my-5 mx-3 text-red-500">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="mt-5">
            <div className="flex justify-center items-center  mr-36">
              <span className="font-mono">Username</span>
            </div>
            <div className="flex justify-center items-center">
              <input
                onChange={(e) => setName(e.target.value)}
                className="bg-white border-white border focus:border-amber-400 focus:outline-none drop-shadow-lg  py-2 px-6 rounded-2xl"
                type="text"
                placeholder="Enter your username"
              ></input>
            </div>
            <div className="flex justify-center items-center mt-3 mr-45">
              <span className="font-mono">Email</span>
            </div>
            <div className="flex justify-center items-center">
              <input
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-white border focus:border-amber-400 focus:outline-none drop-shadow-lg  py-2 px-6 rounded-2xl"
                type="email"
                placeholder="Enter your email"
              ></input>
            </div>
            <div className="flex justify-center items-center mt-3 mr-37">
              <span className="font-mono">Password</span>
            </div>
            <div className="flex justify-center items-center">
              <input
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white border-white border focus:border-amber-400 focus:outline-none drop-shadow-lg py-2 px-6 rounded-2xl"
                type="password"
                placeholder="Enter your password"
              ></input>
            </div>

            <div className="flex justify-center  items-center ">
              <button className="border-2 border-[#FBFFFF] hover:bg-white  py-2 px-4 mt-14 w-80 rounded-2xl font-semibold text-[#FBFFFF] hover:text-amber-300 text-2xl">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
