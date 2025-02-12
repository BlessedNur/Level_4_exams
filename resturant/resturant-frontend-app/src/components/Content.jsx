import Link from "next/link";
import {
  Star,
  Clock,
  Users,
  ChefHat,
  Award,
  Wine,
  ArrowRight,
} from "lucide-react";

export default function Content() {
  return (
    <div className="relative">
      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-light text-gray-900 sm:text-4xl">
              The Art of Fine Dining
            </h2>
            <div className="mt-4 flex justify-center items-center gap-2">
              <div className="w-12 h-px bg-amber-500/50" />
              <p className="text-lg text-gray-600 font-light">
                Where every detail matters
              </p>
              <div className="w-12 h-px bg-amber-500/50" />
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="relative p-8 bg-white border border-gray-100 hover:border-amber-200 transition-colors duration-300">
                  <div className="absolute -top-5 left-8">
                    <div className="inline-flex items-center justify-center p-3 bg-amber-500 shadow-lg">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-gray-900">
                    {feature.name}
                  </h3>
                  <p className="mt-4 text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Preview Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <p className="text-amber-600 font-medium tracking-wider">
                  OUR MENU
                </p>
                <h2 className="mt-2 text-3xl font-light text-gray-900 sm:text-4xl">
                  Curated Seasonal Specialties
                </h2>
              </div>

              <div className="space-y-6">
                {menuItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-dashed border-gray-200 pb-4"
                  >
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.description}
                      </p>
                    </div>
                    <p className="text-amber-600 font-medium">{item.price}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/menu"
                className="group inline-flex items-center text-amber-600 font-medium"
              >
                View Complete Menu
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] relative">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
                  alt="Signature dish"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-8 shadow-xl">
                <div className="flex items-center gap-4">
                  <Award className="w-12 h-12 text-amber-500" />
                  <div>
                    <p className="text-gray-900 font-medium">Award Winning</p>
                    <p className="text-sm text-gray-500">
                      Michelin Star Restaurant
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-light text-amber-400">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reservation CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-light">Reserve Your Table</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Join us for an unforgettable dining experience. Reservations
            recommended for dinner service.
          </p>
          <div className="mt-8">
            <Link
              href="/reservations"
              className="inline-flex items-center justify-center px-8 py-4 text-base bg-amber-500 text-white hover:bg-amber-600 transition-all duration-300"
            >
              Make a Reservation
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    name: "Culinary Excellence",
    description:
      "Our master chefs craft each dish with precision and passion, using only the finest seasonal ingredients sourced from local producers.",
    icon: ChefHat,
  },
  {
    name: "Curated Wine Selection",
    description:
      "An extensive collection of premium wines carefully selected by our sommeliers to perfectly complement your dining experience.",
    icon: Wine,
  },
  {
    name: "Elegant Atmosphere",
    description:
      "Immerse yourself in our thoughtfully designed space where modern luxury meets timeless sophistication.",
    icon: Star,
  },
  {
    name: "Private Dining",
    description:
      "Exclusive spaces available for intimate gatherings and special celebrations, complete with personalized service.",
    icon: Users,
  },
  {
    name: "Award-Winning Service",
    description:
      "Our dedicated team ensures every visit is memorable with attentive, professional, and gracious service.",
    icon: Award,
  },
  {
    name: "Extended Hours",
    description:
      "Open late to accommodate your schedule, perfect for after-theatre dining or special occasions.",
    icon: Clock,
  },
];

const menuItems = [
  {
    name: "Pan-Seared Duck Breast",
    description: "Cherry gastrique, parsnip purée, wild mushrooms",
    price: "$42",
  },
  {
    name: "Lobster Thermidor",
    description: "Brandy cream sauce, gruyère, duchess potatoes",
    price: "$58",
  },
  {
    name: "Wagyu Beef Tenderloin",
    description: "Truffle butter, roasted bone marrow, seasonal vegetables",
    price: "$65",
  },
  {
    name: "Wild Caught Sea Bass",
    description: "Saffron beurre blanc, fennel confit, herbs",
    price: "$48",
  },
];

const stats = [
  { value: "15+", label: "Years of Excellence" },
  { value: "3", label: "Michelin Stars" },
  { value: "1,000+", label: "Wine Selections" },
  { value: "25,000+", label: "Happy Guests" },
];
