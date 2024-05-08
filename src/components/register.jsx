"use client";
import SaveUser from "@/functions/saveuser";
import "./register.css";
import { useState } from "react";
import Link from "next/link";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";

export default function RegForm() {
  const [emailerror, setemailerror] = useState("");
  const [confirmerror, setconfirmerror] = useState("");
  const [passreqerror, setpassreqerror] = useState("");
  const [loading, setloading] = useState("");

  async function Loadset(status) {
    setloading(status);
  }

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handlesubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    await Loadset(true);
    //recaptcha code
    if (!executeRecaptcha) {
      console.log("Recaptcha not loaded");
    }
    const gRecaptchaToken = await executeRecaptcha("inquirySubmit");

    const response = await axios({
      method: "post",
      url: "/api/recaptchasubmit",
      data: {
        gRecaptchaToken,
      },
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    });

    if (response?.data?.success === true) {
      console.log(`Success with score: ${response?.data?.score}`);
      //setSubmit("ReCaptcha Verified and Form Submitted!");
    } else {
      console.log(`Failure with score: ${response?.data?.score}`);
      //  setSubmit("Failed to verify recaptcha! You must be a robot!");
    }

    //recaptcha end

    const result = await SaveUser(formData);
    try {
      setemailerror(result.emailerror);
      setconfirmerror(result.confirmerror);
      setpassreqerror(result.passreqerror);
    } catch (e) {}

    await Loadset(false);
  };

  function seterrors() {
    setemailerror("");
  }

  return (
    <div className="md:w-7/12 m-auto mt-10 mb-10 border-2 p-5 md:pr-20 md:pl-20 regist-form-wrapper">
      <h1 className="font-khand text-6xl text-center">Register</h1>
      <form onSubmit={handlesubmit} className="text-2xl font-khand font-light">
        <div className="form-field">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            onChange={seterrors}
          />
          <p className="text-red-700">{emailerror}</p>
        </div>
        <div className="form-field">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
          <p className="text-red-700">{passreqerror}</p>
        </div>
        <div className="form-field">
          <label htmlFor="confirm_password">Confirm Password:</label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            required
          />
          <p className="text-red-700">{confirmerror}</p>
        </div>
        <div className="form-field grid sm:grid-cols-12 ">
          <div className="sm:col-span-8 col-span-12 flex self-center">
            <p>
              Already have an account? <Link href="../login">Login</Link>
            </p>
          </div>
          <div className="sm:col-span-4 col-span-12 justify-end flex">
            {loading ? (
              <div>
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-yellow-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-2xl text-yellow-600">Saving....</p>
              </div>
            ) : (
              <input type="submit" value="Submit" />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
