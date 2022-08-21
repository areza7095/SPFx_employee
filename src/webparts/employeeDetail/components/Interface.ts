// create File item to work with it internally
export interface IFile {
    ID: number;
    employee_id: number;
    Nama: string;
    Image: string;
    Alamat: string;
    Email: string;
    no_hp: string;
    alamat_lengkap: string;
    jenis_kelamin: string;
    tanggal_lahir: string;
    tempat_lahir: string;
  }
  

  
  // create PnP JS response interface for Item
  export interface IResponseItem {
    ID: number;
    id_employee: number;
    Nama: string;
    Title: string;
    img_employee: string;
    email: string;
    no_hp: string;
    alamat_lengkap: string;
    jenis_kelamin: string;
    tanggal_lahir: string;
    tempat_lahir: string;
  }

  // create File item to work with it internally
  export interface IFilePekerjaan {
    nama_instansi: string;
    posisi: string;
    periode: string;
    id_employeeId: number;
  }
  
  
  
  // create PnP JS response interface for Item
  export interface IResponseItemPekerjaan {
    nama_instansi: string;
    posisi: string;
    periode: string;
    id_employeeId: number;
  }


  // create File item to work with it internally
export interface IFilePendidikan {
  id_employeeId: string;
  jenjang_pendidikan: string;
  nama_sekolah: string;
  tahun_masuk: number;
  tahun_lulus: number;
}



// create PnP JS response interface for Item
export interface IResponseItemPendidikan {
  id_employeeId: string;
  jenjang_pendidikan: string;
  nama_sekolah: string;
  tahun_masuk: number;
  tahun_lulus: number;
}
