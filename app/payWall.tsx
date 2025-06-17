import * as Haptics from 'expo-haptics';
import { DismissButton } from '@/components/payWallScreen';
import { globalStyles } from '@/styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ReactNode, useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

enum PlanType {
  yearly = 'yearly',
  trial = 'trial'
}

const Feature = ({ text }: { text: string }) => {
  return (
    <View style={{ alignItems: 'flex-start', flexDirection: 'row', gap: 10 }}>
      <Ionicons name='checkmark-circle' size={24} color='#00BCB9' />
      <Text style={{ fontSize: 18 }}>{text}</Text>
    </View>
  );
};

const PlanContainer = ({
  checked,
  children,
  onPress,
  planType
}: {
  checked: boolean;
  children: ReactNode;
  onPress: () => void;
  planType?: PlanType;
}) => {
  const borderColor = checked ? '#2D3748' : '#A0AEC0';
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        alignItems: 'center',
        borderColor,
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingVertical: 10
      }}
    >
      <View>{children}</View>
      {planType === 'yearly' && (
        <View
          style={{
            backgroundColor: '#E30000',
            borderRadius: 5,
            marginRight: -8,
            paddingHorizontal: 10,
            paddingVertical: 10
          }}
        >
          <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>SAVE 90%</Text>
        </View>
      )}
      <Ionicons
        name={checked ? 'checkmark-circle' : 'ellipse-outline'}
        size={32}
        color={checked ? '#2078C9' : '#A0AEC0'}
      />
    </TouchableOpacity>
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
          size={24}
          style={{ ...styles.tryForFreeButtonIcon, color: 'white' }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default function PayWall() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(PlanType.trial);

  return (
    <View style={styles.page}>
      <DismissButton pageStyles={styles.page} />
      <View style={globalStyles.content}>
        <Text style={{ fontSize: 32, marginBottom: 32, textAlign: 'center' }}>
          Unlock Premium Access
        </Text>
        <View style={styles.featuresContainer}>
          <Feature text={'Track as many Things as you like'} />
          <Feature text={'Toggle tracking on/off for individual Things anytime you like'} />
          <Feature text={'Amend totals for previous weeks if you make a mistake'} />
        </View>
        <View style={{ alignSelf: 'stretch', gap: 10 }}>
          <PlanContainer
            checked={selectedPlan === PlanType.yearly}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedPlan(PlanType.yearly);
            }}
            planType={PlanType.yearly}
          >
            <View>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Yearly Plan</Text>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 5 }}>
                <Text
                  style={{ color: '#718096', fontSize: 18, textDecorationLine: 'line-through' }}
                >
                  $103.48
                </Text>
                <Text style={{ fontSize: 18 }}>$10.99 per year</Text>
              </View>
            </View>
          </PlanContainer>
          <PlanContainer
            checked={selectedPlan === PlanType.trial}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedPlan(PlanType.trial);
            }}
          >
            <View>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>7-Day Trial</Text>
              <Text style={{ fontSize: 18 }}>then $1.99 per week</Text>
            </View>
          </PlanContainer>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#F7FAFC',
              borderRadius: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 18,
              paddingVertical: 10
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
              Free Trial Enabled
            </Text>
            <Switch
              trackColor={{ true: '#00ff00' }}
              // thumbColor={selectedPlan === PlanType.trial ? '#fff' : 'grey'}
              // ios_backgroundColor={'green'}
              value={selectedPlan === PlanType.trial}
            />
          </View>
        </View>
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
  featuresContainer: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    gap: 18,
    marginBottom: 48,
    paddingRight: 48
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
    borderRadius: 8,
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
