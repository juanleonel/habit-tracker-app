import { useEffect, useState } from 'react';
import * as Font from 'expo-font';

export const useVintageFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Vintage-Typewriter': require('../assets/fonts/Vintage-Typewriter.otf')
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  return fontsLoaded;
};
