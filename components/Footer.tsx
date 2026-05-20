import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-20 py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold text-xl neon">LUXORA ESTATES</h4>
            <p className="mt-4 opacity-70">Cinematic real estate experiences for the world's most discerning clients.</p>
          </div>
          <div>
            <h5 className="font-semibold">Company</h5>
            <ul className="mt-3 opacity-80">
              <li>About</li>
              <li>Careers</li>
              <li>Press</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold">Contact</h5>
            <p className="mt-3 opacity-80">hello@luxora.example</p>
          </div>
        </div>
        <div className="mt-12 text-center opacity-60">© {new Date().getFullYear()} Luxora Estates — All rights reserved</div>
      </div>
    </footer>
  );
}
