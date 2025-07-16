import React from 'react';
import { useResponsive } from '../../hooks/useBreakpoint';

const ResponsiveContainer = ({ 
  children, 
  mobilePadding = '12px',
  tabletPadding = '16px', 
  desktopPadding = '24px',
  style = {},
  ...props 
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  const getPadding = () => {
    if (isMobile) return mobilePadding;
    if (isTablet) return tabletPadding;
    return desktopPadding;
  };

  return (
    <div 
      style={{ 
        padding: getPadding(),
        width: '100%',
        maxWidth: isDesktop ? '1200px' : '100%',
        margin: '0 auto',
        ...style 
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;