interface ListDataItemType {
  id: string;
  title: string;
}

export interface ListItemProps {
  id: string;
  setListData: React.Dispatch<React.SetStateAction<ListDataItemType[]>>;
  title: string;
}
