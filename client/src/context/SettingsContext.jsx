import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    brandName: 'Varsha Rider',
    tagline: 'Well of Death',
    heroHeadline: 'Well of Death',
    heroSubheadline: '',
    riderTitle: 'Master Centrifugal Wall Stunt Specialist',
    heroVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    heroImageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80',
    aboutBio:
      'Welcome to the world of Varsha Rider — where courage meets passion and every ride is a test of skill, balance, and fearless determination. Since 2016, I have been pursuing my passion for Well of Death (Maut Ka Kuan) riding, a thrilling and traditional Indian stunt performance that demands extraordinary focus, precision, and confidence.',
    statsYearsExperience: 14,
    statsArenaShows: 650,
    statsWallIncline: '88°',
    statsSafetyRecord: '100% Zero Severe Injury',
    trainingFee: 4999,
    contactEmail: 'contact@najurider.com',
    contactPhone: '+91 7488405975',
    contactWhatsApp: '+917488405975',
    headquartersAddress: 'Kusaiya, Giridih, Jharkhand',
    socialLinks: {
      instagram: 'https://www.instagram.com/naju_rider_18/',
      youtube: 'https://youtube.com/@najurider',
      facebook: 'https://www.facebook.com/najurider18',
    },
    razorpayKeyId: 'rzp_test_WODLiveDemoKey',
    isRazorpayLive: false,
    testimonials: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await apiClient.get('/settings');
      if (res?.settings) {
        setSettings(res.settings);
      }
    } catch (err) {
      console.warn('Could not fetch settings, using defaults:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
