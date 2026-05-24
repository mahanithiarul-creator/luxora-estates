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
      <div className="min-h-screen bg-[#02040a] text-white">
        <div className="pointer-events-none fixed inset-0 z-[-1] bg-[radial-gradient(circle_at_18%_0%,rgba(103,232,249,0.1),transparent_30%),radial-gradient(circle_at_82%_8%,rgba(216,183,106,0.08),transparent_26%),linear-gradient(180deg,#03050b,#02040a)]" />
        <NavBar />
        <div>{children}</div>
        <AmbientAudioToggle />
      </div>
    </>
  );
}
