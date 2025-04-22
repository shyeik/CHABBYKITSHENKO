"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

gsap.registerPlugin(Draggable);

function LoginForm() {
  const burgerRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid Credentials");
        return;
      }

      router.replace("dashboard");
    } catch (error) {
      console.log("erro", error);
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
      <div className="flex flex-wrap  items-center justify-center h-screen">
        <div className=" pt-20 sm:pt-40 xl:pt-5 bg-gray-200 w-200 h-200 rounded-4xl ">
          <h1 className=" text-center font-bold text-amber-400 text-5xl my-10">
            Log In to pay{" "}
          </h1>
          <h2 className=" text-center text font-bold text-5xl mt-20">Log in</h2>
          <p className="m-2 text-center font-extralight italic">
            Don't have account yet?{" "}
            <Link href="register" className="underline ">
              Register
            </Link>
          </p>
          {error && (
            <div className="flex justify-center  items-center my-5 mx-3 text-red-500">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="mt-5">
            <div className="flex justify-center items-center mr-44">
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

            <div className="flex justify-center items-center mt-3 mr-36">
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

            <div className="flex justify-center items-center ">
              <button className="border-2 border-[#FBFFFF] hover:bg-white my-10 py-2 px-28 rounded-2xl font-semibold text-[#FBFFFF] hover:text-amber-300 text-2xl">
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
