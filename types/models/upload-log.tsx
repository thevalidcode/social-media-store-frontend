export interface UploadLog {
  url: string;
  id: number;
  storeScopedId: number;
  filename: string;
  mimetype: string;
  collection: string;
  timestamp: Date;
  uid: string;
  size: number;
  storeId: number;
}
