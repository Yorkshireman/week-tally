import { useColorScheme } from 'react-native';

/* eslint-disable sort-keys */
const primitiveError = {
  50: '#FFF5F5',
  100: '#FED7D7',
  200: '#FEB2B2',
  300: '#FC8181',
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
  700: '#2D3748',
  800: '#1A202C',
  900: '#171923'
};

const primitivePrimary = {
  50: '#F0FEFD',
  300: '#1BD9D5',
  400: '#00BCB9',
  500: '#00A5A2',
  600: '#156F6D',
  700: '#005958',
  800: '#004746',
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
        borderColor: '#fff',
        color: '#fff'
      },
      warning: {
        backgroundColor: primitiveError[500],
        color: '#fff'
      }
    },
    divider: {
      backgroundColor: primitiveNeutral[500]
    },
    error: {
      ...primitiveError
    },
    header: {
      headerStyle: {
        backgroundColor: primitiveNeutral[700],
        borderBottomColor: primitiveNeutral[600],
        borderBottomWidth: 1
      },
      headerTintColor: '#fff'
    },
    iconButton: {
      borderColor: '#fff',
      color: '#fff'
    },
    input: {
      backgroundColor: primitiveNeutral[800],
      borderColor: primitiveNeutral[300],
      color: '#fff',
      placeholderTextColor: primitiveNeutral[500],
      validationErrorText: {
        color: primitiveError[300]
      }
    },
    page: {
      backgroundColor: primitiveNeutral[800]
    },
    primitiveError,
    primitiveInfo,
    primitiveNeutral,
    primitivePrimary,
    settingsScreen: {
      resetApp: { color: primitiveError[200] },
      section: {
        backgroundColor: primitiveNeutral[700]
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
    },
    thingSection: {
      backgroundColor: primitiveNeutral[700]
    },
    thingsTrackedScreen: {
      addButton: {
        color: primitiveNeutral[200]
      },
      infoBoxBackgroundColour: primitiveNeutral[700],
      menuButton: {
        color: '#fff'
      }
    },
    totalsScreen: {
      addButton: {
        color: primitiveNeutral[200]
      }
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
    input: {
      borderColor: primitiveNeutral[700],
      color: primitiveNeutral[700],
      placeholderTextColor: primitiveNeutral[400],
      validationErrorText: {
        color: primitiveError[500]
      }
    },
    page: {
      backgroundColor: primitiveNeutral[50]
    },
    primitiveError,
    primitiveInfo,
    primitiveNeutral,
    primitivePrimary,
    settingsScreen: {
      resetApp: { color: primitiveError[500] },
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
    },
    thingSection: {
      backgroundColor: '#fff'
    },
    thingsTrackedScreen: {
      addButton: {
        color: primitivePrimary[600]
      },
      infoBoxBackgroundColour: primitiveInfo[600],
      menuButton: {
        color: primitivePrimary[900]
      }
    },
    totalsScreen: {
      addButton: {
        color: primitivePrimary[600]
      }
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
