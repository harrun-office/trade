import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Logo size="md" showText={true} darkBackground={true} className="mb-4" />
            <p className="text-zinc-300 text-sm leading-relaxed">
              A marketplace where every purchase makes a difference. Buy and sell while supporting charities worldwide.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-zinc-400">
                <Mail className="w-4 h-4" />
                <span>support@trade2help.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-zinc-400">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-zinc-100">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-zinc-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="/search" className="text-zinc-300 hover:text-white transition-colors">Browse Products</a></li>
              <li><a href="/charities" className="text-zinc-300 hover:text-white transition-colors">Our Charities</a></li>
              <li><a href="/sell" className="text-zinc-300 hover:text-white transition-colors">Start Selling</a></li>
              <li><a href="/about" className="text-zinc-300 hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-zinc-100">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/help" className="text-zinc-300 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="/safety" className="text-zinc-300 hover:text-white transition-colors">Safety Tips</a></li>
              <li><a href="/policies" className="text-zinc-300 hover:text-white transition-colors">Policies</a></li>
              <li><a href="/contact" className="text-zinc-300 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Impact Stats */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-zinc-100">Our Impact</h3>
            <div className="space-y-3">
              <div>
                <div className="text-2xl font-bold text-amber-400">$2.5M+</div>
                <div className="text-sm text-zinc-400">Donated to Charities</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">150K+</div>
                <div className="text-sm text-zinc-400">Items Sold</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">500+</div>
                <div className="text-sm text-zinc-400">Partner Charities</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-8 pt-8 text-center">
          <p className="text-zinc-400 text-sm">
            © 2025 Trade2Help. All rights reserved. Making commerce compassionate.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;