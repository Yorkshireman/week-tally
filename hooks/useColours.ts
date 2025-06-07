import { useColorScheme } from 'react-native';

const primitiveNeutral = {
  700: '#2D3748'
};

const primitivePrimary = {
  700: '#005958',
  900: '#00302F'
};

const semanticNeutral = {
  300: '#CBD5E0'
};

const styles = {
  dark: {
    page: {
      backgroundColor: primitiveNeutral[700]
    },
    tabs: {
      active: '#fff',
      borderColor: semanticNeutral[300],
      inactive: primitivePrimary[700]
    },
    text: {
      color: '#fff'
    }
  },
  light: {
    page: {
      backgroundColor: '#fff'
    },
    tabs: {
      active: primitivePrimary[900],
      borderColor: semanticNeutral[300],
      inactive: primitivePrimary[700]
    },
    text: {
      color: primitiveNeutral[700]
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
