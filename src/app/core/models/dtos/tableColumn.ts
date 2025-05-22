export interface TableColumn {
  key: string;
  title: string;
  type?: 'text' | 'date' | 'id';
  prefix?: string;
  isActive?: boolean| null;
  orderAsc?: boolean | null;
  orderBy?: string;
}