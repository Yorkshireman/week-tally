interface ListDataItemType {
  createdAt: string;
  currentlyTracking: number;
  id: string;
  title: string;
  updatedAt: string;
}

export interface ListItemProps {
  id: string;
  setListData: React.Dispatch<React.SetStateAction<ListDataItemType[]>>;
  title: string;
}
