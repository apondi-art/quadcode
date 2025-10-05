import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Mail, Cloud, Database, TrendingUp } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gradient-to-b from-muted/30 to-muted/50">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">

          {/* Brand Section */}
          <div className="space-y-4 lg:col-span-4">
            <div className="flex items-center gap-2">
              <Cloud className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold">QUADCODE</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Historical weather probabilities for any location, any day. Powered by NASA EarthData.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Database className="h-3 w-3" />
              <span>NASA MERRA-2 & GPM IMERG</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 lg:col-span-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Quick Links</h4>
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
              >
                <span className="group-hover:translate-x-1 transition-transform">Home</span>
              </Link>
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
              >
                <span className="group-hover:translate-x-1 transition-transform">About</span>
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
              >
                <span className="group-hover:translate-x-1 transition-transform">Contact</span>
              </Link>
            </nav>
          </div>

          {/* Features */}
          <div className="space-y-4 lg:col-span-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Features</h4>
            <div className="flex flex-col space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3 w-3 text-primary" />
                <span>Trend Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Cloud className="h-3 w-3 text-primary" />
                <span>Weather Forecasts</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="h-3 w-3 text-primary" />
                <span>Historical Data</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4 lg:col-span-2">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Contact</h4>
            <div className="space-y-3">
              <a
                href="mailto:support@quadcode.com"
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
              >
                <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>support@quadcode.com</span>
              </a>
              <p className="text-sm text-muted-foreground">
                Kisumu, Kenya<br />
                East Africa
              </p>
            </div>
          </div>

        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} QUADCODE. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a
              href="mailto:support@quadcode.com"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}