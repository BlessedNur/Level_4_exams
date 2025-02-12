"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, MapPin, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: "Home", href: "/" },
    {
      name: "Dining",
      href: "#",
      children: [
        { name: "Menu", href: "/menu" },
        { name: "Wine List", href: "/wine" },
        { name: "Private Dining", href: "/private-dining" },
      ],
    },
    { name: "Reservations", href: "/reservations" },
    // { name: "Events", href: "/events" },
    // { name: "About", href: "/about" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href, children = null) => {
    if (href === "#" && children) {
      return children.some((child) => child.href === pathname);
    }
    return pathname === href;
  };

  const isChildActive = (href) => pathname === href;

  return (
    <>
      {/* Top Bar */}

      {pathname == "/" && (
        <div
          className={`hidden bg-amber-400 lg:block w-full transition-all duration-300 ${
            scrolled ? "h-0 opacity-0" : "h-10 opacity-100"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-10 text-sm text-black/90">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>123 Luxury Avenue, New York</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/gift-cards"
                  className={`transition-colors ${
                    pathname === "/gift-cards"
                      ? "text-black"
                      : "hover:text-black"
                  }`}
                >
                  Gift Cards
                </Link>
                <Link
                  href="/careers"
                  className={`transition-colors ${
                    pathname === "/careers" ? "text-black" : "hover:text-black"
                  }`}
                >
                  Careers
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Main Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/98 backdrop-blur-md shadow-md"
            : "bg-gradient-to-b from-black/50 to-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <span
                className={`text-2xl font-light tracking-wider ${
                  scrolled ? "text-gray-900" : "text-white"
                } transition-colors duration-300`}
              >
                L'ESSENCE
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className={`px-3 py-2 text-sm font-light tracking-wider transition-colors duration-300 flex items-center
                      ${
                        scrolled
                          ? isActive(item.href, item.children)
                            ? "text-amber-600"
                            : "text-gray-700 hover:text-amber-600"
                          : isActive(item.href, item.children)
                          ? "text-amber-400"
                          : "text-white hover:text-amber-400"
                      }`}
                  >
                    {item.name}
                    {item.children && (
                      <ChevronDown className="ml-1 w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.children && (
                    <div className="absolute left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <div className="py-2 bg-white rounded-md shadow-xl">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`block px-4 py-2 text-sm 
                              ${
                                isChildActive(child.href)
                                  ? "text-amber-600 bg-amber-50"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-amber-600"
                              }`}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* CTA Button */}
              <Link
                href="/reservations"
                className={`px-6 py-2 text-sm font-light tracking-wider transition-all duration-300 
                  ${
                    scrolled
                      ? pathname === "/reservations"
                        ? "bg-amber-700 text-white"
                        : "bg-amber-600 hover:bg-amber-400 text-white"
                      : pathname === "/reservations"
                      ? "bg-white/20 text-white border border-white"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/30"
                  }`}
              >
                Reserve a Table
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-md ${
                scrolled ? "text-gray-600" : "text-white"
              }`}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <div
            className={`px-4 pt-2 pb-3 space-y-1 ${
              scrolled ? "bg-white" : "bg-black/90"
            }`}
          >
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={`block px-3 py-2 text-base font-light
                    ${
                      scrolled
                        ? isActive(item.href, item.children)
                          ? "text-amber-300"
                          : "text-gray-700 hover:text-amber-600"
                        : isActive(item.href, item.children)
                        ? "text-amber-400"
                        : "text-white hover:text-amber-400"
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
                {item.children && (
                  <div className="pl-4 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={`block px-3 py-2 text-sm
                          ${
                            scrolled
                              ? isChildActive(child.href)
                                ? "text-amber-400"
                                : "text-gray-500 hover:text-amber-600"
                              : isChildActive(child.href)
                              ? "text-amber-400"
                              : "text-white/80 hover:text-amber-400"
                          }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/reservations"
              className={`block px-3 py-2 text-base font-light
                ${
                  scrolled
                    ? pathname === "/reservations"
                      ? "text-amber-400"
                      : "text-amber-600 hover:text-amber-700"
                    : pathname === "/reservations"
                    ? "text-amber-300"
                    : "text-amber-300 hover:text-amber-300"
                }`}
              onClick={() => setIsOpen(false)}
            >
              Reserve a Table
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
