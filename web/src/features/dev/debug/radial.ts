import { debugData } from '../../../utils/debugData';
import { radialMenuItems } from '../../../utils/radialMenuItems';

export const debugRadial = () => {
  debugData([
    {
      action: 'openRadialMenu',
      data: radialMenuItems,
    },
  ]);
};
