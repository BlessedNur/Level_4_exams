import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Star,
  ArrowRight,
  Award,
  GlassWater,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-black">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-[url('/footer-texture.png')] opacity-10" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto">
        {/* Pre-Footer Awards Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-16 border-b border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {awards.map((award, index) => (
              <div key={index} className="text-center">
                <award.icon className="w-8 h-8 mx-auto text-amber-400" />
                <h4 className="mt-4 text-white font-light text-sm tracking-wider uppercase">
                  {award.title}
                </h4>
                <p className="mt-2 text-gray-400 text-sm">
                  {award.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <div className="space-y-8">
                <Link href="/" className="inline-block">
                  <div className="flex items-center space-x-3">
                    <GlassWater className="w-8 h-8 text-amber-400" />
                    <span className="text-3xl font-light text-white tracking-wider">
                      L'ESSENCE
                    </span>
                  </div>
                </Link>
                <p className="text-gray-400 leading-relaxed">
                  Experience the epitome of fine dining where culinary artistry
                  meets exceptional service in an atmosphere of understated
                  elegance.
                </p>
                <div className="flex items-center space-x-2">
                  {Array(5)
                    .fill(null)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  <span className="ml-2 text-amber-400">
                    Michelin Guide 2025
                  </span>
                </div>
                <div className="flex space-x-6">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      className="group"
                      aria-label={social.name}
                    >
                      <div
                        className="p-2 rounded-full border border-white/10 transition-all duration-300 
                        group-hover:border-amber-400 group-hover:bg-amber-400/10"
                      >
                        <social.icon className="w-5 h-5 text-gray-400 group-hover:text-amber-400" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h3 className="text-white font-light text-lg tracking-wider mb-8">
                Navigation
              </h3>
              <div className="grid gap-4">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="group flex items-center text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    <ArrowRight
                      className="w-4 h-4 mr-2 opacity-0 -translate-x-4 transition-all duration-300 
                      group-hover:opacity-100 group-hover:translate-x-0"
                    />
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-3">
              <h3 className="text-white font-light text-lg tracking-wider mb-8">
                Contact
              </h3>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="group flex items-start space-x-4">
                    <div
                      className="p-2 rounded-full border border-white/10 transition-all duration-300 
                      group-hover:border-amber-400 group-hover:bg-amber-400/10"
                    >
                      <item.icon className="w-5 h-5 text-gray-400 group-hover:text-amber-400" />
                    </div>
                    <div className="text-gray-400 group-hover:text-amber-400 transition-colors">
                      {item.lines.map((line, i) => (
                        <p key={i} className="leading-relaxed">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hours & Newsletter */}
            <div className="lg:col-span-3">
              <h3 className="text-white font-light text-lg tracking-wider mb-8">
                Hours
              </h3>
              <div className="space-y-4">
                {openingHours.map((day, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-gray-400"
                  >
                    <span className="font-light">{day.days}</span>
                    <span>{day.hours}</span>
                  </div>
                ))}
              </div>

              {/* Newsletter */}
              <div className="mt-12">
                <h3 className="text-white font-light text-lg tracking-wider mb-4">
                  Newsletter
                </h3>
                <p className="text-gray-400 mb-4">
                  Stay updated with our latest offerings and events.
                </p>
                <form className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-gray-500
                      focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-amber-400 text-black hover:bg-amber-300 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="md:flex md:items-center md:justify-between">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} L'essence. All rights reserved.
              </p>
              <div className="mt-4 md:mt-0 flex flex-wrap gap-6">
                {legalLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

const awards = [
  {
    icon: Award,
    title: "Michelin Star",
    description: "Awarded 3 Michelin stars for exceptional cuisine",
  },
  {
    icon: Award,
    title: "Wine Spectator",
    description: "Best of Award of Excellence 2024",
  },
  {
    icon: Award,
    title: "James Beard",
    description: "Outstanding Restaurant 2024",
  },
  {
    icon: Award,
    title: "Forbes",
    description: "5-Star Restaurant Rating",
  },
];

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Youtube", icon: Youtube, href: "#" },
];

const contactInfo = [
  {
    icon: MapPin,
    lines: ["123 Luxury Avenue", "New York, NY 10001"],
  },
  {
    icon: Phone,
    lines: ["+1 (555) 123-4567"],
  },
  {
    icon: Mail,
    lines: ["reservations@lessence.com"],
  },
];

const navigationLinks = [
  { name: "About Us", href: "/about" },
  { name: "Menu", href: "/menu" },
  { name: "Reservations", href: "/reservations" },
  { name: "Private Events", href: "/events" },
  { name: "Gift Cards", href: "/gift-cards" },
  { name: "Contact", href: "/contact" },
];

const openingHours = [
  { days: "Monday - Thursday", hours: "12:00 PM - 10:00 PM" },
  { days: "Friday - Saturday", hours: "12:00 PM - 11:00 PM" },
  { days: "Sunday", hours: "11:00 AM - 9:00 PM" },
];

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Cookie Policy", href: "/cookies" },
  { name: "Accessibility", href: "/accessibility" },
];
