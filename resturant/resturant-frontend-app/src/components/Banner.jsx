import Link from "next/link";
import React from "react";
import { ChevronRight } from "lucide-react";

function Banner() {
  return (
    <div className="relative min-h-[80vh] flex items-center">
      {/* Background with overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-black/40"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2074&auto=format&fit=crop')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />
        {/* Sophisticated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />

        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 w-1/3 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
          <div className="absolute right-0 bottom-0 w-1/3 h-px bg-gradient-to-l from-transparent via-amber-500/50 to-transparent" />
        </div>
      </div>

      {/* Content */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="max-w-3xl space-y-8">
          {/* Subtle decorative line */}
          <div className="w-24 h-px bg-amber-500/50" />

          <div className="space-y-4">
            <p className="text-amber-400 tracking-wider uppercase text-sm font-light">
              Welcome to L'essence
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-light text-white leading-tight">
              Where Culinary
              <span className="block mt-2 font-normal text-amber-300">
                Art Meets Passion
              </span>
            </h1>
          </div>

          <p className="mt-6 text-lg md:text-xl text-gray-300 leading-relaxed font-light">
            Journey through an extraordinary symphony of flavors, where each
            dish tells a story of tradition, innovation, and excellence.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-6">
            <Link
              href="/reservations"
              className="group inline-flex items-center justify-center px-8 py-4 text-base bg-amber-500 text-white hover:bg-amber-600 transition-all duration-300"
            >
              <span>Reserve Your Experience</span>
              <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/menu"
              className="group inline-flex items-center justify-center px-8 py-4 text-base border border-white/20 text-white hover:bg-white/10 transition-all duration-300"
            >
              <span>Discover Our Menu</span>
              <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Additional decorative elements */}
          <div className="absolute bottom-12 right-12 hidden lg:block">
            <div className="flex items-center gap-4 text-white/80">
              <div className="w-12 h-px bg-white/20" />
              <p className="text-sm tracking-wider">
                MICHELIN STARRED RESTAURANT
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
