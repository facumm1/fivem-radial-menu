import React from 'react';
import { MenuContext, MenuContextType } from './MenuContext';
import { MenuItemProps } from './types';
import { cx, getInnerArc, getObjectDimensions, getRingSectionPath } from './util';

const SubmenuItem = ({
  __angleStep,
  __index,
  __parentMenuId,
  data: propsData,
  onItemClick,
  ...props
}: MenuItemProps) => {
  const { data } = React.useContext(MenuContext) as MenuContextType;
  const { innerRadius, outerRadius, middleRadius, deltaRadius, activeMenuId } = data;
  const [active, setActive] = React.useState(false);
  const angleStep = __angleStep as number;
  const index = __index as number;
  const parentMenuId = __parentMenuId as string;

  const { objectX, objectY, objectWidth, objectHeight } = React.useMemo(
    () => getObjectDimensions(deltaRadius, angleStep, middleRadius, index, outerRadius),
    [deltaRadius, angleStep, middleRadius, index, outerRadius]
  );

  if (parentMenuId !== activeMenuId) {
    return <></>;
  }

  return data.drawBackground ? (
    <g
      style={{ width: '50px' }}
      {...props}
      onMouseEnter={(e) => {
        props.onMouseEnter?.(e);
        setActive(true);
      }}
      onMouseLeave={(e) => {
        props.onMouseLeave?.(e);
        setActive(false);
      }}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onItemClick?.(event, index, propsData);
      }}
    >
      <defs>
        <filter id="white-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="white" flood-opacity="0.5" />
        </filter>
      </defs>

      {/* Background color */}
      <path
        d={getRingSectionPath(index * angleStep, (index + 1) * angleStep, innerRadius, outerRadius)}
        className={cx('subbase', { active })}
      />
      {/* Inner border  */}
      <path
        style={{
          stroke: 'white',
          strokeWidth: 3,
        }}
        d={getInnerArc(index * angleStep, (index + 1) * angleStep, innerRadius, outerRadius)}
        className={cx('base', { active })}
      />

      <path
        style={{
          stroke: 'rgba(36, 16, 17, 0.7)',
          strokeWidth: 5,
        }}
        d={getRingSectionPath(index * angleStep, (index + 1) * angleStep, outerRadius, outerRadius)}
        className={cx('base', { active })}
        filter="url(#drop-shadow)"
      />
      <foreignObject x={objectX} y={objectY} width={objectWidth} height={objectHeight}>
        <div className={cx('content', { active })}>{props.children}</div>
      </foreignObject>
    </g>
  ) : (
    <g {...props}>
      <foreignObject
        x={objectX}
        y={objectY}
        width={objectWidth}
        height={objectHeight}
        onMouseEnter={(e) => {
          props.onMouseEnter?.(e);
          setActive(true);
        }}
        onMouseLeave={(e) => {
          props.onMouseLeave?.(e);
          setActive(false);
        }}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onItemClick?.(event, index, propsData);
        }}
      >
        <div className={cx('content', { active })}>{props.children}</div>
      </foreignObject>
    </g>
  );
};

export default SubmenuItem;
