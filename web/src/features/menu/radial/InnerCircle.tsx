import { Box } from '@mantine/core';
import { RefObject } from 'react';

export const InnerCircle = ({
  menuDescription,
  innerMenuRef,
  customCursorRef,
}: {
  menuDescription: { title: string; page: number; totalPages: number };
  innerMenuRef: RefObject<HTMLDivElement>;
  customCursorRef: RefObject<HTMLDivElement>;
}) => {
  const { title, page, totalPages } = menuDescription;

  return (
    <Box
      ref={innerMenuRef}
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        width: 270,
        height: 270,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '5px solid #FFF',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid #FFF',
          borderRadius: '50%',
          width: 210,
          height: 210,
          fontFamily: 'Roboto Condensed, sans-serif',
          position: 'relative',
        }}
      >
        <p style={{ color: '#776D6C', fontWeight: 700, fontSize: '12px' }}>RADIALMENU</p>
        <p style={{ color: '#f55b5b', fontWeight: 700, fontSize: '20px' }}>{menuDescription.title}</p>
        <p style={{ color: '#FFF', fontWeight: 500, fontSize: '12px' }}>
          {totalPages > 1 ? `${page}/${totalPages} PAGE` : ''}
        </p>

        <div
          ref={customCursorRef}
          style={{
            position: 'absolute',
            width: '15px',
            height: '15px',
            backgroundColor: '#f55b5b',
            transform: 'rotate(0deg)',
            clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
          }}
        />
      </Box>
    </Box>
  );
};
