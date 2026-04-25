// src/app/(main)/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}


export default function MainLayout({ children }: MainLayoutProps) {
  const { isLoading } = useAuth();
  const pathname      = usePathname();



  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

 

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-[56px] sm:pt-[64px] lg:pt-[112px]">
        {children}
      </main>

      <Footer />
    </div>
  );
}