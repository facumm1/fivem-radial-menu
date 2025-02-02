### Radial menu
[Preview] - https://streamable.com/aewgxr

- Menues

Menu items minimum quantity is 2
Submenu items minimum quantity is 1
You can use menu and and maximum of 2 submenus (this radial menu accepts a maximum of three circles in total)
Using at least 8-10 items in general menu is recommended, it's not already optimized for few items

The script uses icons from https://fontawesome.com/icons, using fa-solid for example, is not needed, use directly the icon name in property "icon"

Property label is sent to lua once the item is clicked or when you release key and item was hovered

- Installation

Just copy the folder "fivem-radial-menu" to your resources folder
Then add "ensure fivem-radial-menu" to your server.cfg

- Modifying NUI

NUI was made using React.js and Mantine, you can modify code following these steps

1. Open in terminal "cd radial-menu/web" and run "yarn install" or "yarn"
2. Run "yarn start" and it will open menu in browser
3. To test it inside FiveM, you must run "yarn build" in order to update files in web/build directory