import clsx from 'clsx';
import React from 'react';
import { MenuContext } from './MenuContext';
import { MenuContextData, MenuProps } from './types';
import { cx } from './util';

import './Menu.css';

export const MAIN_MENU_ID = '0';

const initialData: MenuContextData = {
  activeMenuId: MAIN_MENU_ID,
  deltaRadius: 0,
  innerRadius: 0,
  menuHeight: 0,
  menuWidth: 0,
  middleRadius: 0,
  outerRadius: 0,
  drawBackground: true,
};

const HoverSubmenu = ({
  baseMenuItems,
  indexPos,
  centerX,
  centerY,
  innerRadius,
  outerRadius,
  animationTimeout,
  show,
  animateSubMenuChange,
  animation,
  theme,
  drawBackground,
  ...props
}: MenuProps) => {
  const [data, setData] = React.useState<MenuContextData>(initialData);

  if (innerRadius >= outerRadius) {
    throw new Error("RadialMenu's innerRadius must be less than outerRadius");
  }

  const numOfChildren = React.Children.count(props.children);

  /* if (numOfChildren < 2) {
    throw new Error('RadialMenu must have at least 2 children');
  } */

  const angleStep = (2 * Math.PI) / baseMenuItems;
  const middleRadius = (innerRadius + outerRadius) / 2;
  const deltaRadius = outerRadius - innerRadius;
  const menuWidth = outerRadius * 2;
  const menuHeight = menuWidth;

  animationTimeout = React.useMemo(() => animationTimeout || 0, [animationTimeout]);

  const myMenuId = MAIN_MENU_ID;

  React.useEffect(() => {
    setData((prev) => ({
      innerRadius,
      outerRadius,
      middleRadius,
      deltaRadius,
      menuWidth,
      menuHeight,
      activeMenuId: show ? myMenuId : prev.activeMenuId,
      drawBackground: drawBackground ?? true,
    }));
  }, [innerRadius, outerRadius, show, drawBackground]);

  const [transition, setTransition] = React.useState<'closed' | 'closing' | 'opened' | 'opening'>('closed');
  const handleTransition = React.useCallback(() => {
    document.documentElement.style.setProperty('--__reactRadialMenu__animation-delay', `${animationTimeout}ms`);
    if (show) {
      setTransition('opening');
      setTimeout(() => setTransition('opened'), animationTimeout);
    } else {
      setTransition('closing');
      setTimeout(() => setTransition('closed'), animationTimeout);
    }
  }, [show, animationTimeout]);

  const changeMenu = React.useCallback(
    (menuId: string) => {
      if (animateSubMenuChange) {
        handleTransition();
        setTimeout(() => setData((prev) => ({ ...prev, activeMenuId: menuId })), animationTimeout);
      } else {
        setData((prev) => ({ ...prev, activeMenuId: menuId }));
      }
    },
    [handleTransition, animateSubMenuChange]
  );

  React.useEffect(() => {
    handleTransition();
  }, [show, handleTransition]);

  if (transition === 'closed') {
    return <></>;
  }

  const getIndexForSubmenu = (index: number, pairItems: boolean) => {
    if (indexPos === 0) {
      if(pairItems) {
        return index;
      }

      return index;
    }

    if (indexPos > 1) {
      if (pairItems) {
        return index + indexPos - 2;
      }

      return index + indexPos - 1;
    }

    return index;
  };

  return (
    <MenuContext.Provider value={{ data, changeMenu }}>
      <svg
        {...props}
        width={menuWidth}
        height={menuHeight}
        viewBox={`-3 -3 ${menuWidth + 6} ${menuHeight + 6}`}
        style={{
          ...props.style,
          width: `${menuWidth}px`,
          height: `${menuHeight}px`,
          left: `${centerX - outerRadius}px`,
          top: `${centerY - outerRadius}px`,
        }}
        className={clsx(props.className, cx('menu', transition, animation, theme, !data.drawBackground && 'no-bg'))}
      >
        {/* <defs>
          <filter id="drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="4" dy="4" stdDeviation="2" floodOpacity="0" result="blur" />
            <feComponentTransfer in="no-blur">
              <feFuncA type="table" tableValues="0 1" />
            </feComponentTransfer>
            <feDropShadow dx="4" dy="4" stdDeviation="5" floodColor="rgba(255, 255, 255, 1)" />
          </filter>
        </defs> */}

        {React.Children.map(props.children, (child, index) => {
          //const numberOfSubmenuItems = Math.floor(React.Children.count(props.children) / 2);
          const pairItems = React.Children.count(props.children) % 2 === 0;

          if (React.isValidElement(child)) {
            let prop = {
              __index: getIndexForSubmenu(index, pairItems),
              __angleStep: angleStep,
              __parentMenuId: myMenuId,
            };

            return React.cloneElement(child, prop);
          }

          return child;
        })}
      </svg>
    </MenuContext.Provider>
  );
};

export default HoverSubmenu;
