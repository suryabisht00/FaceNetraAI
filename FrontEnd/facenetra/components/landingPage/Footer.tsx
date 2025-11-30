import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-20">
      <div className="max-w-7xl mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 text-primary">
              <div className="size-8">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-poppins font-bold text-white">FaceNetra</h3>
            </div>
            <p className="text-sm text-[#E5E7EB] leading-relaxed max-w-xs">
              Connecting the world through cutting-edge face recognition technology.
            </p>
            <div className="flex gap-3 mt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary hover:scale-110 flex items-center justify-center transition-all group">
                <svg className="w-5 h-5 text-[#E5E7EB] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary hover:scale-110 flex items-center justify-center transition-all group">
                <svg className="w-5 h-5 text-[#E5E7EB] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary hover:scale-110 flex items-center justify-center transition-all group">
                <svg className="w-5 h-5 text-[#E5E7EB] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121L8.08 13.768l-2.94-.924c-.64-.203-.654-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-bold mb-5 text-base">Product</h4>
            <ul className="space-y-3 text-sm text-[#E5E7EB]">
              <li><a href="#" className="hover:text-primary hover:translate-x-1 inline-block transition-all">Features</a></li>
              <li><a href="#" className="hover:text-primary hover:translate-x-1 inline-block transition-all">How it Works</a></li>
              <li><a href="#" className="hover:text-primary hover:translate-x-1 inline-block transition-all">Pricing</a></li>
              <li><a href="#" className="hover:text-primary hover:translate-x-1 inline-block transition-all">Security</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-5 text-base">Company</h4>
            <ul className="space-y-3 text-sm text-[#E5E7EB]">
              <li><a href="#" className="hover:text-primary hover:translate-x-1 inline-block transition-all">About Us</a></li>
              <li><a href="#" className="hover:text-primary hover:translate-x-1 inline-block transition-all">Blog</a></li>
              <li><a href="#" className="hover:text-primary hover:translate-x-1 inline-block transition-all">Careers</a></li>
              <li><a href="#" className="hover:text-primary hover:translate-x-1 inline-block transition-all">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-5 text-base">Legal</h4>
            <ul className="space-y-3 text-sm text-[#E5E7EB]">
              <li><a href="#" className="hover:text-primary hover:translate-x-1 inline-block transition-all">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary hover:translate-x-1 inline-block transition-all">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary hover:translate-x-1 inline-block transition-all">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-primary hover:translate-x-1 inline-block transition-all">GDPR</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#E5E7EB]/60 text-sm">
            © 2024 FaceNetraAI. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-[#E5E7EB]">
            <a href="#" className="hover:text-primary transition-colors">English</a>
            <span className="text-white/20">•</span>
            <a href="#" className="hover:text-primary transition-colors">Help Center</a>
            <span className="text-white/20">•</span>
            <a href="#" className="hover:text-primary transition-colors">Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
