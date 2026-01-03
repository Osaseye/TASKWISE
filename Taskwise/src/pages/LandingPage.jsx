import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import VisualDemo from '../components/landing/VisualDemo';
import Features from '../components/landing/Features';
import PWASection from '../components/landing/PWASection';
import MobileShowcase from '../components/landing/MobileShowcase';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="bg-background-dark font-display text-white antialiased selection:bg-primary selection:text-background-dark"
    >
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <Navbar />
        <Hero />
        <VisualDemo />
        <Features />
        <PWASection />
        <MobileShowcase />
        <CTA /> 
        <Footer />
      </div>
    </motion.div>
  );
};

export default LandingPage;
