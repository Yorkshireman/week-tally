import { useColorScheme } from 'react-native';

const styles = {
  dark: {
    page: {
      backgroundColor: '#2D3748'
    },
    text: {
      color: '#fff'
    }
  },
  light: {
    page: {
      backgroundColor: '#fff'
    },
    text: {
      color: '#2D3748'
    }
  }
};

export const useColours = () => {
  const colorScheme = useColorScheme();

  if (colorScheme === 'dark') {
    return styles.dark;
  }

  return styles.light;
};
