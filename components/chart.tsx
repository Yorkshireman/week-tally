import * as Haptics from 'expo-haptics';
import { buildStartOfWeekDate } from '@/utils';
import { format } from 'date-fns';
import { useFont } from '@shopify/react-native-skia';
import { useState } from 'react';
import { Area, CartesianChart } from 'victory-native';
import { ChartDataItem, ChartScale, ThingWithLogEntriesCount } from '@/types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColours, useFetchAndSetChartData } from '@/hooks';

const ScaleSelector = ({
  scale,
  selectedScale,
  setSelectedScale
}: {
  scale: ChartScale;
  selectedScale: ChartScale;
  setSelectedScale: React.Dispatch<React.SetStateAction<ChartScale>>;
}) => {
  const {
    chart: { scaleSelectorSelected },
    page,
    text: { color }
  } = useColours();

  const _styles =
    scale === selectedScale
      ? {
          ...styles.scaleSelector,
          backgroundColor: scaleSelectorSelected.backgroundColor,
          borderWidth: 1
        }
      : { ...styles.scaleSelector, borderColor: page.backgroundColor };

  return (
    <TouchableOpacity
      onPress={() => {
        setSelectedScale(scale);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
      style={_styles}
    >
      <Text style={{ color }}>{scale}</Text>
    </TouchableOpacity>
  );
};

export const Chart = ({
  selectedThingId,
  totals
}: {
  selectedThingId: string;
  totals?: ThingWithLogEntriesCount[];
}) => {
  const {
    chart: { areaColour, lineColor },
    text: { color }
  } = useColours();
  const [chartData, setChartData] = useState<ChartDataItem[] | null>(null);
  const font = useFont(require('../assets/fonts/inter-medium.ttf'), 12);
  const [selectedScale, setSelectedScale] = useState<ChartScale>(ChartScale.FOUR_WEEKS);
  useFetchAndSetChartData({
    selectedScale,
    selectedThingId,
    setChartData,
    totals
  });

  if (!chartData || chartData.length === 0) return null;

  const now = new Date();
  const weekOffset = -chartData[chartData.length - 1].week;
  const firstWeekMonday = buildStartOfWeekDate(now, weekOffset);
  const xAxisText = format(firstWeekMonday, "EEEE do MMMM ''yy");

  const maxTotal = Math.max(...chartData.map(({ total }) => total), 0);
  const tickValues = Array.from({ length: maxTotal + 1 }, (_, i) => i);

  return (
    <View style={{ height: 190 }}>
      <CartesianChart
        data={chartData}
        domain={{ y: [0, maxTotal + 0.1] }}
        yAxis={[
          {
            font,
            labelColor: color,
            lineColor,
            tickValues
          }
        ]}
        xKey='week'
        yKeys={['total']}
      >
        {({ chartBounds, points }) => (
          <Area
            animate={{ duration: 300, type: 'timing' }}
            color={areaColour}
            curveType='linear'
            opacity={0.5}
            points={points.total}
            y0={chartBounds.bottom}
          />
        )}
      </CartesianChart>
      <Text style={{ ...styles.xAxisText, color }}>From {xAxisText}</Text>
      <View style={styles.scaleSelectorsContainer}>
        {Object.values(ChartScale).map(scale => (
          <ScaleSelector
            key={scale}
            scale={scale}
            selectedScale={selectedScale}
            setSelectedScale={setSelectedScale}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scaleSelector: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 8
  },
  scaleSelectorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  xAxisText: {
    bottom: 10,
    fontSize: 12,
    position: 'relative',
    textAlign: 'center'
  }
});
