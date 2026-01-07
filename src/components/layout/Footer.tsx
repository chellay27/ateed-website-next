import Link from "next/link";
import Image from "next/image";

const socialLinks = [
  { href: "https://www.facebook.com/AteedTech/", label: "Facebook", icon: "facebook" },
  { href: "https://www.linkedin.com/company/ateedtech", label: "LinkedIn", icon: "linkedin" },
  { href: "https://www.youtube.com/@AteedTech", label: "YouTube", icon: "youtube" },
  { href: "https://www.instagram.com/ateedtech/", label: "Instagram", icon: "instagram" },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Ateed Tech"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-semibold">Ateed Tech</span>
            </div>
            <p className="text-gray-400 max-w-xs">
              Custom Software to Empower Your Future.
            </p>
            <p className="text-gray-400">Boynton Beach, Florida</p>

            {/* Social Links */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-gray-400 text-sm">Follow Us:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <span className="sr-only">{social.label}</span>
                  {/* Replace with actual icons */}
                  <span className="w-5 h-5 block">{social.icon[0].toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4 text-right">
            <Link
              href="/contact"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Contact Us
            </Link>
            <p className="text-gray-400">
              or Call us on:{" "}
              <a href="tel:+15614628333" className="text-blue-400 hover:text-blue-300">
                +1 (561) 46-Ateed (28333)
              </a>
            </p>
            <Link
              href="/privacy-policy"
              className="text-gray-400 hover:text-white text-sm block"
            >
              Privacy Policy
            </Link>
            <p className="text-gray-500 text-sm">
              Copyright © 2019, 2025 Ateed Tech LLC.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
