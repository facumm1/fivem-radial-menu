import { Fragment, useEffect, useRef, useState } from 'react';
import { Box, createStyles } from '@mantine/core';

import ScaleFade from '../../../transitions/ScaleFade';
import { useLocales } from '../../../providers/LocaleProvider';
import { InnerCircle } from './InnerCircle';
import { Menu, MenuItem, SubMenu } from '../../../radial-menu';
import SubmenuItem from '../../../radial-menu/components/SubmenuItem';
import HoverSubmenu from '../../../radial-menu/components/HoverSubmenu';
import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { ItemContent } from './ItemContent';
import { isEnvBrowser } from '../../../utils/misc';
import { debugRadial } from '../../dev/debug/radial';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

const newDimension = 400 * 1.1025;

const RadialMenu: React.FC = () => {
  const { classes } = useStyles();
  const { locale } = useLocales();
  const [visible, setVisible] = useState(false);

  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState<string>('');

  const [activeSubmenu, setActiveSubmenu] = useState({ index: undefined, data: [] });
  const [activeSubmenu2, setActiveSubmenu2] = useState({ index: undefined, data: [] });

  const [menuDescription, setMenuDescription] = useState({ title: 'SELECT ITEM', page: 1, totalPages: 1 });

  const sendItemToLua = async (itemSelected: string) => {
    try {
      const response = await fetch('https://radial-menu/sendItemSelected', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: itemSelected }),
      });

      const data = await response.json();

      console.log('Response from Lua:', data);
    } catch (error) {
      console.error('Error sending string to Lua:', error);
    }
  };

  const itemClicked = async () => {
    try {
      const response = await fetch('https://radial-menu/sendItemClicked', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
    } catch (error) {
      console.error('Error sending to Lua:', error);
    }
  };

  useNuiEvent('openRadialMenu', (data) => {
    setMenuItems(data);

    setVisible(true);
  });

  useNuiEvent('closeRadialMenu', () => {
    sendItemToLua(selectedItem);

    setSelectedItem('');
    setMenuDescription({ title: 'SELECT ITEM', page: 1, totalPages: 1 });

    setVisible(false);
  });

  /* Logic for inner cursor */
  const customCursorRef = useRef<HTMLDivElement>(null);
  const innerMenuRef = useRef<HTMLDivElement>(null);

  const menuCursor = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = innerMenuRef.current?.getBoundingClientRect();
    const centerX = (rect?.left ?? 0) + (rect?.width ?? 0) / 2;
    const centerY = (rect?.top ?? 0) + (rect?.height ?? 0) / 2;

    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;

    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    if (angle < 0) {
      angle += 360;
    }

    const radius = (rect?.width ?? 0) / 2.4;
    const cursorX = radius * Math.cos((angle * Math.PI) / 180);
    const cursorY = radius * Math.sin((angle * Math.PI) / 180);

    if (customCursorRef.current) {
      customCursorRef.current.style.transform = `translate(${cursorX}px, ${cursorY}px) rotate(${angle}deg)`;
    }
  };

  /* Debug in browser */
  useEffect(() => {
    if (isEnvBrowser()) {
      debugRadial();
      setVisible(true);
    }
  }, []);

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible}>
          {/* Outer circle */}
          <Box
            onMouseMove={(event) => menuCursor(event)}
            sx={{
              overflow: 'visible',
              width: `${newDimension}px`,
              height: `${newDimension}px`,
              transform: 'rotate(90)',
            }}
          >
            <Box
              sx={{
                width: `calc(${newDimension}px)`,
                height: `calc(${newDimension}px)`,
                background:
                  'radial-gradient(circle at center, rgba(36, 16, 17, 1), rgba(36, 16, 17, 0.9) 50%, rgba(0, 0, 0, 0.9) 100%)',
                boxShadow: '0px 0px 40px 0px #FFF',
                borderRadius: '50%',
              }}
            >
              {/* General menu */}
              {menuItems.length > 1 && (
                <Menu
                  centerX={220}
                  centerY={220}
                  innerRadius={135}
                  outerRadius={225}
                  show={true}
                  animation={['fade', 'scale']}
                  animationTimeout={150}
                  drawBackground
                  style={{ zIndex: 30 }}
                >
                  {menuItems.map((item, index) => {
                    const isSelected = selectedItem === item.label;
                    const hasSubmenu = Object.keys(item).includes('submenu');
                    let totalPages = 1;

                    if (hasSubmenu) {
                      totalPages = 2;

                      item.submenu.forEach((subItem) => {
                        const hasAnotherSubmenu = Object.keys(subItem).includes('submenu');

                        if (hasAnotherSubmenu) totalPages = 3;
                      });
                    }

                    return (
                      <MenuItem
                        style={{ backgroundColor: 'rgba(128, 128, 128, 0.25)' }}
                        onItemClick={itemClicked}
                        onMouseOver={() => {
                          setSelectedItem(item.label);
                          setMenuDescription(() => ({ title: item.label, totalPages, page: 1 }));

                          if (hasSubmenu) {
                            setActiveSubmenu({ index: index, data: item.submenu });

                            return;
                          }

                          setActiveSubmenu({ index: undefined, data: [] });
                          setActiveSubmenu2({ index: undefined, data: [] });
                        }}
                        onMouseLeave={() => {
                          setSelectedItem('');
                          setActiveSubmenu2({ index: undefined, data: [] });
                        }}
                        data={item.label}
                        key={item.label}
                      >
                        <ItemContent isSelected={isSelected} icon={item.icon} />
                      </MenuItem>
                    );
                  })}
                </Menu>
              )}

              {/* Submenu 1 */}
              {activeSubmenu.index !== undefined && (
                <HoverSubmenu
                  baseMenuItems={menuItems.length}
                  indexPos={activeSubmenu.index}
                  centerX={220}
                  centerY={220}
                  innerRadius={135 + 95}
                  outerRadius={225 + 80}
                  show={true}
                  animation={['fade', 'scale']}
                  animationTimeout={150}
                  drawBackground
                  style={{ zIndex: 20 }}
                >
                  {activeSubmenu.data.map((item, index) => {
                    const isSelected = selectedItem === item.label;
                    const hasSubmenu = Object.keys(item).includes('submenu');

                    return (
                      <SubmenuItem
                        onItemClick={itemClicked}
                        onMouseEnter={() => {
                          setSelectedItem(item.label);

                          setMenuDescription((prev) => ({ ...prev, title: item.label, page: 2 }));

                          if (hasSubmenu) {
                            setActiveSubmenu2({ index: index, data: item.submenu });
                            return;
                          }

                          setActiveSubmenu2({ index: undefined, data: [] });
                        }}
                        onMouseLeave={() => {
                          setSelectedItem('');

                          if (activeSubmenu2.index !== undefined) {
                            return;
                          }

                          setActiveSubmenu2({ index: undefined, data: [] });
                        }}
                        data={item.label}
                        key={item.label}
                      >
                        <ItemContent isSelected={isSelected} icon={item.icon} />
                      </SubmenuItem>
                    );
                  })}
                </HoverSubmenu>
              )}

              {/* Submenu 2 */}
              {activeSubmenu2.index !== undefined && (
                <HoverSubmenu
                  baseMenuItems={menuItems.length}
                  indexPos={activeSubmenu.index}
                  centerX={220}
                  centerY={220}
                  innerRadius={135 + 175}
                  outerRadius={225 + 160}
                  show={true}
                  animation={['fade', 'scale']}
                  animationTimeout={150}
                  drawBackground
                  style={{ zIndex: 10 }}
                >
                  {activeSubmenu2.data.map((item, index) => {
                    const isSelected = selectedItem === item.label;
                    const hasSubmenu = Object.keys(item).includes('submenu');

                    return (
                      <SubmenuItem
                        onItemClick={itemClicked}
                        onMouseEnter={() => {
                          setSelectedItem(item.label);
                          setMenuDescription((prev) => ({ ...prev, title: item.label, page: 3 }));

                          if (hasSubmenu) {
                            setActiveSubmenu2({ index: index, data: item.submenu });
                            return;
                          }
                        }}
                        onMouseLeave={() => {
                          setSelectedItem('');
                        }}
                        data={item.label}
                        key={item.label}
                      >
                        <ItemContent isSelected={isSelected} icon={item.icon} />
                      </SubmenuItem>
                    );
                  })}
                </HoverSubmenu>
              )}
            </Box>
          </Box>

          <InnerCircle
            menuDescription={menuDescription}
            innerMenuRef={innerMenuRef}
            customCursorRef={customCursorRef}
          />
        </ScaleFade>
      </Box>
    </>
  );
};

export default RadialMenu;
