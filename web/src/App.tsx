import { MantineProvider } from '@mantine/core';
import { useConfig } from './providers/ConfigProvider';
import RadialMenu from './features/menu/radial';
import { theme } from './theme';

const App: React.FC = () => {
  const { config } = useConfig();

  return (
    <MantineProvider withNormalizeCSS withGlobalStyles theme={{ ...theme, ...config }}>
      <RadialMenu />
    </MantineProvider>
  );
};

export default App;
