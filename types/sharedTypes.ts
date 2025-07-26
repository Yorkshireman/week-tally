export type ChartDataItem = {
  total: number;
  week: number;
};

export enum ChartScale {
  FOUR_WEEKS = '4W',
  TWELVE_WEEKS = '12W',
  TWENTY_FOUR_WEEKS = '24W',
  FIFTY_TWO_WEEKS = '52W',
  MAX = 'Max'
}

export type LogEntry = {
  id: string;
  thingId: string;
  timestamp: string;
};

export type NotificationDataType = {
  thingId: string;
};

export type Setting = {
  key: string;
  value: string;
};

export type ShowChartSetting = {
  key: 'showChart';
  value: 'true' | 'false';
};

export type Thing = {
  createdAt: string;
  currentlyTracking: number;
  id: string;
  title: string;
  updatedAt: string;
};
