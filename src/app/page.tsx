'use client';
import { useState } from 'react';
import Preloader from '@/components/Preloader';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import MarqueeStrip from '@/components/MarqueeStrip';
import PartnersSection from '@/components/PartnersSection';
import GearSection from '@/components/GearSection';
import SongRequestSection from '@/components/SongRequestSection';
import BookingSection from '@/components/BookingSection';
import MerchSection from '@/components/MerchSection';
import GameSection from '@/components/GameSection';
import MixesSection from '@/components/MixesSection';
import Footer from '@/components/Footer';
import CursorGlow from '@/components/CursorGlow';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <Preloader onDone={() => setLoaded(true)} />}
      <CursorGlow />
      <Navbar />
      <main>
        <HeroSection />
        <PartnersSection />
        <MarqueeStrip />
        <GearSection />
        <SongRequestSection />
        <BookingSection />
        <MerchSection />
        <GameSection />
        <MixesSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
