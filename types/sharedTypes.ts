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

export type Thing = {
  id: string;
  title: string;
};
