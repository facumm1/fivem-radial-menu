import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../components/LibIcon';

export const ItemContent: React.FC<{ isSelected: boolean; icon: string }> = ({ isSelected, icon }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* <div
        style={{
          height: '7.5px',
          width: '7.5px',
          backgroundColor: '#FFF',
          borderRadius: '50%',
          marginRight: '2.5px',
          opacity: isSelected ? 1 : 0,
        }}
      /> */}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          //backgroundColor: isSelected ? 'rgba(128, 128, 128, 0.25)' : 'transparent',
          backgroundColor: 'transparent',
          padding: '10px',
        }}
      >
        <LibIcon
          style={{ color: `rgba(255, 255, 255, ${isSelected ? 1 : 0.6})` }}
          icon={icon as IconProp}
          width={20}
          height={20}
          fixedWidth
        />
      </div>
    </div>
  );
};
