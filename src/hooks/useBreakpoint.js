import { useState, useEffect } from 'react';
import { Grid } from 'antd';

const { useBreakpoint } = Grid;

export const useResponsive = () => {
  const screens = useBreakpoint();
  
  return {
    isMobile: !screens.md, // xs, sm
    isTablet: screens.md && !screens.lg, // md
    isDesktop: screens.lg, // lg, xl, xxl
    isSmallMobile: !screens.sm, // xs only
    screens
  };
};

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};