'use client'
import { NextUIProvider } from "@nextui-org/react";
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainPage from "@/components/homepage/mainpage";



export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (result.ok) {
      router.push('/dashboard'); // Redirect to the dashboard or a protected page
    } else {
      alert('Login failed');
    }
  };



  return (
    <NextUIProvider>

      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <MainPage />
      </main>

    </NextUIProvider>
  );
}
