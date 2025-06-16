import { DismissButton } from '@/components/payWallScreen';
import { globalStyles } from '@/styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { normaliseFontSize } from '@/utils';
import { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Feature = ({ text }: { text: string }) => {
  return (
    <View style={{ alignItems: 'flex-start', flexDirection: 'row', gap: 10 }}>
      <Ionicons name='checkmark-circle' size={24} color='#00BCB9' />
      <Text style={{ fontSize: 18 }}>{text}</Text>
    </View>
  );
};

const PlanContainer = ({ children }: { children: ReactNode }) => {
  return (
    <View
      style={{
        alignItems: 'center',
        alignSelf: 'stretch',
        borderColor: 'black',
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 10,
        padding: 20
      }}
    >
      {children}
    </View>
  );
};

const TryForFreeButton = () => {
  return (
    <View style={{ alignSelf: 'stretch', gap: 20 }}>
      <TouchableOpacity
        onPress={() => {}}
        style={{
          ...styles.tryForFreeButton,
          backgroundColor: '#2078C9'
        }}
      >
        <Text style={{ ...styles.tryForFreeButtonText, color: 'white' }}>Try for Free</Text>
        <Ionicons
          name='chevron-forward'
          size={normaliseFontSize(20)}
          style={{ ...styles.tryForFreeButtonIcon, color: 'white' }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default function PayWall() {
  return (
    <View style={styles.page}>
      <DismissButton pageStyles={styles.page} />
      <View style={globalStyles.content}>
        <Text style={{ fontSize: 32, marginBottom: 32, textAlign: 'center' }}>
          Unlock Premium Access
        </Text>
        <View
          style={{
            alignSelf: 'stretch',
            flexDirection: 'column',
            gap: 18,
            marginBottom: 72,
            paddingRight: 10
          }}
        >
          <Feature text={'Track as many Things as you like'} />
          <Feature text={'Toggle tracking on/off for individual Things anytime you like'} />
          <Feature text={'Amend statistics for previous weeks if you make a mistake'} />
        </View>
        <PlanContainer>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Premium Plan</Text>
          <Text style={{ fontSize: 18, color: '#666' }}>$4.99/month</Text>
        </PlanContainer>
      </View>
      <TryForFreeButton />
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 15
  },
  backButtonText: {
    fontSize: 18,
    textAlign: 'center'
  },
  page: {
    backgroundColor: 'white',
    flex: 1,
    paddingBottom: 48,
    paddingHorizontal: 24,
    paddingTop: 72
  },
  tryForFreeButton: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 18
  },
  tryForFreeButtonIcon: {
    marginLeft: 5
  },
  tryForFreeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
