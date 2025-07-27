import * as Haptics from 'expo-haptics';
import { format } from 'date-fns';
import { useFont } from '@shopify/react-native-skia';
import { useIsFocused } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { Area, CartesianChart } from 'victory-native';
import {
  buildStartOfWeekDate,
  fetchDbSettingsChartScale,
  fetchDbSettingsChartSize,
  setDbSettingsChartScale,
  setDbSettingsChartSize
} from '@/utils';
import { ChartDataItem, ChartScale, ChartSize, ThingWithLogEntriesCount } from '@/types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColours, useFetchAndSetChartData } from '@/hooks';
import { useEffect, useState } from 'react';

const ScaleSelector = ({
  scale,
  selectedScale,
  setSelectedScale
}: {
  scale: ChartScale;
  selectedScale: ChartScale;
  setSelectedScale: React.Dispatch<React.SetStateAction<ChartScale | null>>;
}) => {
  const db = useSQLiteContext();
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
      onPress={async () => {
        setSelectedScale(scale);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await setDbSettingsChartScale(db, scale);
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
    chart: { areaColour, lineColor, xAxisTickLabel },
    text: { color }
  } = useColours();
  const [chartData, setChartData] = useState<ChartDataItem[] | null>(null);
  const [chartSize, setChartSize] = useState<ChartSize>();
  const db = useSQLiteContext();
  const font = useFont(require('../assets/fonts/inter-medium.ttf'), 12);
  const isFocused = useIsFocused();
  const [selectedScale, setSelectedScale] = useState<ChartScale | null>(null);
  useFetchAndSetChartData({
    selectedScale,
    selectedThingId,
    setChartData,
    totals
  });

  useEffect(() => {
    const fetchChartScale = async () => {
      const scale = await fetchDbSettingsChartScale(db);
      if (scale) {
        setSelectedScale(scale);
      } else {
        setSelectedScale(ChartScale.MAX);
        setDbSettingsChartScale(db, ChartScale.MAX);
      }
    };

    const fetchChartSize = async () => {
      const size = await fetchDbSettingsChartSize(db);
      if (size) {
        setChartSize(size);
      } else {
        setDbSettingsChartSize(db, ChartSize.MEDIUM);
        setChartSize(ChartSize.MEDIUM);
      }
    };

    if (isFocused) {
      fetchChartScale();
      fetchChartSize();
    }
  }, [db, isFocused]);

  if (!chartData || !chartSize || !selectedScale || chartData.length === 0) return null;

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

  const maxTotal = Math.max(...chartData.map(({ total }) => total), 0);
  const tickValues = Array.from({ length: maxTotal + 1 }, (_, i) => i);

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
