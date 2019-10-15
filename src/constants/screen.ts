export const screenSize = {
  xsOnly: 575,
  smDown: 767,
  mdDown: 991,
  lgDown: 1199,
  smUp: 576,
  mdUp: 768,
  lgUp: 992,
  xlUp: 1200,
  vMdDown: 800,
  vMdUp: 801,
  responsiveTableMobileDown: 640,
  responsiveTableDesktopUp: 641,
};

export const screenQuery = {
  xsOnly: `(max-width: ${screenSize.xsOnly}px)`,
  smDown: `(max-width: ${screenSize.smDown}px)`,
  mdDown: `(max-width: ${screenSize.mdDown}px)`,
  lgDown: `(max-width: ${screenSize.lgDown}px)`,
  smUp: `(min-width: ${screenSize.smUp}px)`,
  mdUp: `(min-width: ${screenSize.mdUp}px)`,
  lgUp: `(min-width: ${screenSize.lgUp}px)`,
  xlUp: `(min-width: ${screenSize.xlUp}px)`,
  vMdDown: `(max-height: ${screenSize.vMdDown}px)`,
  vMdUp: `(min-height: ${screenSize.vMdUp}px)`,
  responsiveTableDesktop: `(min-width: ${screenSize.responsiveTableDesktopUp}px)`,
  responsiveTableMobile: `(max-width: ${screenSize.responsiveTableMobileDown}px)`,
};
