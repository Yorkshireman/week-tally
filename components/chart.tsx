import * as Haptics from 'expo-haptics';
import { format } from 'date-fns';
import { useFont } from '@shopify/react-native-skia';
import { useSQLiteContext } from 'expo-sqlite';
import { Area, CartesianChart } from 'victory-native';
import { buildStartOfWeekDate, setDbSettingsChartScale } from '@/utils';
import {
  ChartCurveType,
  ChartDataItem,
  ChartScale,
  ChartSize,
  ThingWithLogEntriesCount
} from '@/types';
import { Dispatch, SetStateAction, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColours, useFetchAndSetChartData, useFetchAndSetChartSettings } from '@/hooks';

const ScaleSelector = ({
  scale,
  selectedScale,
  setSelectedScale
}: {
  scale: ChartScale;
  selectedScale: ChartScale;
  setSelectedScale: Dispatch<SetStateAction<ChartScale | undefined>>;
}) => {
  const db = useSQLiteContext();
  const {
    chart: { scaleSelectorSelected },
    page,
    text: { color }
  } = useColours();

  const scaleOptionStyles =
    scale === selectedScale
      ? {
          ...styles.scaleSelector,
          backgroundColor: scaleSelectorSelected.backgroundColor,
          borderWidth: 1
        }
      : { ...styles.scaleSelector, borderColor: page.backgroundColor };

  return (
    <TouchableOpacity
      onPress={async () => {
        setSelectedScale(scale);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await setDbSettingsChartScale(db, scale);
      }}
      style={scaleOptionStyles}
    >
      <Text style={{ color }}>{scale}</Text>
    </TouchableOpacity>
  );
};

export const Chart = ({
  thingId,
  totals
}: {
  thingId: string;
  totals?: ThingWithLogEntriesCount[];
}) => {
  const {
    chart: { areaColour, lineColor, xAxisTickLabel },
    text: { color }
  } = useColours();
  const [chartSize, setChartSize] = useState<ChartSize>();
  const [curveType, setCurveType] = useState<ChartCurveType>();
  const font = useFont(require('../assets/fonts/inter-medium.ttf'), 12);
  const [selectedScale, setSelectedScale] = useState<ChartScale>();
  useFetchAndSetChartSettings({ setChartSize, setCurveType, setSelectedScale });
  const chartData = useFetchAndSetChartData({
    selectedScale,
    thingId,
    totals
  });

  if (!chartData || !chartSize || !curveType || !selectedScale || chartData.length === 0)
    return null;

  const height =
    chartSize === ChartSize.SMALL
      ? 170
      : chartSize === ChartSize.MEDIUM
      ? 200
      : chartSize === ChartSize.LARGE
      ? 280
      : 200;

  const now = new Date();
  const weekOffset = -chartData[chartData.length - 1].week;
  const firstWeekMonday = buildStartOfWeekDate(now, weekOffset);
  const firstWeekLabel = format(firstWeekMonday, "EE do MMM ''yy");

  const highestTotal = Math.max(...chartData.map(({ total }) => total), 0);
  const tickValues = Array.from({ length: highestTotal + 1 }, (_, i) => i);

  const middleIndex = Math.floor(chartData.length / 2);
  const middleWeek = chartData[middleIndex]?.week;
  const middleWeekStartDate = buildStartOfWeekDate(now, -middleWeek);
  const middleWeekSunday = new Date(middleWeekStartDate);
  middleWeekSunday.setDate(middleWeekSunday.getDate() + 6);
  const middleWeekLabel = format(middleWeekSunday, "do MMM ''yy");

  const nowLabel = format(now, "EE do MMM ''yy");

  return (
    <View style={{ height }}>
      <CartesianChart
        data={chartData}
        domain={{ y: [0, highestTotal + 0.1] }}
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
            curveType={curveType}
            opacity={0.5}
            points={points.total}
            y0={chartBounds.bottom}
          />
        )}
      </CartesianChart>
      <View style={styles.xAxisTickLabelsWrapper}>
        <Text style={{ ...styles.xAxisTickLabels, ...xAxisTickLabel }}>{firstWeekLabel}</Text>
        {selectedScale !== ChartScale.FOUR_WEEKS && chartData.length > 4 && (
          <Text style={{ ...styles.xAxisTickLabels, ...xAxisTickLabel }}>{middleWeekLabel}</Text>
        )}
        <Text style={{ ...styles.xAxisTickLabels, ...xAxisTickLabel }}>{nowLabel}</Text>
      </View>
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
  xAxisTickLabels: {
    fontSize: 12
  },
  xAxisTickLabelsWrapper: {
    bottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative'
  }
});
