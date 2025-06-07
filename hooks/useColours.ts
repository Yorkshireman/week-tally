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
    tabBar: {
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: '#fff',
      tabBarStyle: {
        backgroundColor: primitiveNeutral[700],
        borderTopColor: semanticNeutral[300]
      }
    },
    text: {
      color: '#fff'
    }
  },
  light: {
    page: {
      backgroundColor: '#fff'
    },
    tabBar: {
      tabBarActiveTintColor: primitivePrimary[900],
      tabBarInactiveTintColor: primitivePrimary[700],
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopColor: semanticNeutral[300]
      }
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
