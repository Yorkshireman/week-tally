import { useColorScheme } from 'react-native';

/* eslint-disable sort-keys */
const primitiveError = {
  400: '#F56565',
  500: '#D93939'
};

const primitiveInfo = {
  50: '#F0FEFD',
  100: '#C8F9F6',
  200: '#85EEEB',
  300: '#1BD9D5',
  400: '#00BCB9',
  500: '#00A5A2',
  600: '#156F6D',
  700: '#005958',
  800: '#004746',
  900: '#00302F'
};

const primitiveNeutral = {
  50: '#F7FAFC',
  100: '#EDF2F7',
  200: '#E2E8F0',
  300: '#CBD5E0',
  400: '#A0AEC0',
  500: '#718096',
  600: '#4A5568',
  700: '#2D3748'
};

const primitivePrimary = {
  50: '#F0FEFD',
  300: '#1BD9D5',
  400: '#00BCB9',
  600: '#156F6D',
  700: '#005958',
  900: '#00302F'
};
/* eslint-enable sort-keys */

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
    header: {
      headerStyle: {
        backgroundColor: primitiveNeutral[700]
      },
      headerTintColor: '#fff'
    },
    iconButton: {
      borderColor: '#fff',
      color: '#fff'
    },
    page: {
      backgroundColor: primitiveNeutral[700]
    },
    primitiveError,
    primitiveInfo,
    primitiveNeutral,
    primitivePrimary,
    settingsScreen: {
      section: {
        backgroundColor: primitiveNeutral[500]
      }
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
    header: {
      headerStyle: {
        backgroundColor: '#fff'
      },
      headerTintColor: primitivePrimary[900]
    },
    iconButton: {
      borderColor: primitiveNeutral[700],
      color: primitivePrimary[900]
    },
    page: {
      backgroundColor: primitiveNeutral[50]
    },
    primitiveError,
    primitiveInfo,
    primitiveNeutral,
    primitivePrimary,
    settingsScreen: {
      section: {
        backgroundColor: '#fff'
      }
    },
    tabBar: {
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: '#fff',
      tabBarStyle: {
        backgroundColor: primitivePrimary[600],
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
