import { useColorScheme } from 'react-native';

const primitiveError = {
  400: '#F56565',
  500: '#D93939'
};

const primitiveNeutral = {
  300: '#CBD5E0',
  700: '#2D3748'
};

const primitivePrimary = {
  700: '#005958',
  900: '#00302F'
};

const styles = {
  dark: {
    button: {
      primary: {
        backgroundColor: primitiveNeutral[700],
        borderColor: '#fff',
        color: '#fff'
      },
      secondary: {
        backgroundColor: primitiveNeutral[700],
        borderColor: '#fff',
        color: '#fff'
      },
      warning: {
        backgroundColor: primitiveError[500],
        color: '#fff'
      }
    },
    divider: {
      backgroundColor: primitiveNeutral[300]
    },
    error: {
      ...primitiveError
    },
    iconButton: {
      borderColor: '#fff',
      color: '#fff'
    },
    page: {
      backgroundColor: primitiveNeutral[700]
    },
    tabBar: {
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: '#fff',
      tabBarStyle: {
        backgroundColor: primitiveNeutral[700],
        borderTopColor: primitiveNeutral[300]
      }
    },
    text: {
      color: '#fff'
    }
  },
  light: {
    button: {
      primary: {
        backgroundColor: primitivePrimary[700],
        borderColor: primitivePrimary[700],
        color: '#fff'
      },
      secondary: {
        backgroundColor: '#fff',
        borderColor: primitiveNeutral[700],
        color: primitiveNeutral[700]
      },
      warning: {
        backgroundColor: primitiveError[500],
        color: '#fff'
      }
    },
    divider: {
      backgroundColor: primitiveNeutral[300]
    },
    error: {
      ...primitiveError
    },
    iconButton: {
      borderColor: primitiveNeutral[700],
      color: primitivePrimary[900]
    },
    page: {
      backgroundColor: '#fff'
    },
    tabBar: {
      tabBarActiveTintColor: primitivePrimary[900],
      tabBarInactiveTintColor: primitivePrimary[700],
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopColor: primitiveNeutral[300]
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
