import React from 'react';
import NavBar from './NavBar';
import Seo from './Seo';
import AmbientAudioToggle from './AmbientAudioToggle';

type Props = { children: React.ReactNode };

// Layout wraps every page: navbar and site chrome
export default function Layout({ children }: Props) {
  return (
    <>
      <Seo />
      <div className="min-h-screen bg-gradient-to-b from-black via-[#041022] to-[#071024] text-white">
        <NavBar />
        <div>{children}</div>
        <AmbientAudioToggle />
      </div>
    </>
  );
}
