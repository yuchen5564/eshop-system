import React from 'react';
import { useResponsive } from '../../hooks/useBreakpoint';
import Header from '../Header';
import MobileHeader from '../mobile/MobileHeader';

const ResponsiveHeader = (props) => {
  const { isMobile } = useResponsive();
  
  if (isMobile) {
    return <MobileHeader {...props} />;
  }
  
  return <Header {...props} />;
};

export default ResponsiveHeader;