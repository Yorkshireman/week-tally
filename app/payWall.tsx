import * as Haptics from 'expo-haptics';
import { DismissButton } from '@/components/payWallScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useGlobalStyles } from '@/hooks';
import { ReactNode, useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

enum PlanType {
  trial = 'trial',
  yearly = 'yearly'
}

const Feature = ({ text }: { text: string }) => {
  return (
    <View style={{ alignItems: 'flex-start', flexDirection: 'row', gap: 10 }}>
      <Ionicons name='checkmark-circle' size={24} color='blue' />
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
  const backgroundColor = checked ? '#EBF8FF' : '#fff';
  const borderColor = checked ? 'blue' : '#A0AEC0';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        alignItems: 'center',
        backgroundColor,
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
      {planType === PlanType.yearly && (
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
        color={checked ? 'blue' : '#A0AEC0'}
      />
    </TouchableOpacity>
  );
};

const TryForFreeButton = ({ selectedPlan }: { selectedPlan: PlanType }) => {
  return (
    <View style={{ alignSelf: 'stretch', gap: 20 }}>
      <TouchableOpacity
        onPress={() => {}}
        style={{
          ...styles.tryForFreeButton,
          backgroundColor: 'blue'
        }}
      >
        <Text style={{ ...styles.tryForFreeButtonText, color: 'white' }}>
          {selectedPlan === PlanType.trial ? 'Try for Free' : 'Unlock Now'}
        </Text>
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
  const globalStyles = useGlobalStyles();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(PlanType.trial);

  const toggleSwitch = () => {
    if (selectedPlan === PlanType.trial) {
      setSelectedPlan(PlanType.yearly);
    } else {
      setSelectedPlan(PlanType.trial);
    }
  };

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
              backgroundColor: '#EDF2F7',
              borderRadius: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 18,
              paddingVertical: 12
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
              Free Trial Enabled
            </Text>
            <Switch
              trackColor={{ true: '#00ff00' }}
              onValueChange={toggleSwitch}
              value={selectedPlan === PlanType.trial}
            />
          </View>
        </View>
      </View>
      <TryForFreeButton selectedPlan={selectedPlan} />
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
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
