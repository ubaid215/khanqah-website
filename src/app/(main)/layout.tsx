// src/app/(main)/layout.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex flex-col min-h-screen">
        <Navbar />

        {/* Main content - Fully responsive padding for navbar */}
        <main className="flex-1 pt-[56px] sm:pt-[64px] lg:pt-[112px]">
          {children}
        </main>

        <style jsx>{`
          @media (min-width: 640px) {
            main {
              padding-top: var(--navbar-height-tablet);
            }
          }
          @media (min-width: 1024px) {
            main {
              padding-top: var(--navbar-height-desktop);
            }
          }
        `}</style>
        <Footer />
      </div>
    </div>
  );
}
