import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Weather Explorer</h3>
            <p className="text-sm text-muted-foreground">
              Historical weather probabilities for any location, any day. Powered by NASA EarthData.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Product</h4>
            <div className="space-y-3">
              <Link href="/" className="block text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 ease-in-out">
                Home
              </Link>
              <Link href="/about" className="block text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 ease-in-out">
                About
              </Link>
              <Link href="/contact" className="block text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 ease-in-out">
                Contact
              </Link>
            </div>
          </div>


        </div>

        <Separator className="my-8" />

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Weather Explorer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}