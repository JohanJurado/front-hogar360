export interface TableColumn {
  key: string;
  title: string;
  type?: 'text' | 'date' | 'id' | 'price' | 'action';
  prefix?: string;
  isActive?: boolean| null;
  orderAsc?: boolean | null;
  orderBy?: string;
  icon?: string;
}