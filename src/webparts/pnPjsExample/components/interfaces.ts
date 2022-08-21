// create File item to work with it internally
export interface IFile {
  ID: number;
  Nama: string;
  Image: string;
  Alamat: string;
}

// create PnP JS response interface for File
export interface IResponseFile {
  Length: number;
}

// create PnP JS response interface for Item
export interface IResponseItem {
  id_employee: number;
  Nama: string;
  Title: string;
  img_employee: string;
}