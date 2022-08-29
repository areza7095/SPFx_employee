// create File item to work with it internally
export interface IFileEmployee{
    ID: number;
    employee_id: number;
    name: string;
    img_employee: string;
    address: string;
    email: string;
    no_hp: string;
    gender: string;
    birth_date: string;
    place_of_birth: string;
  }
  

  
  // create PnP JS response interface for Item
  export interface IResponseEmployee {
    ID: number;
    id_employee: number;
    name: string;
    img_employee: string;
    address: string;
    email: string;
    no_hp: string;
    gender: string;
    birth_date: string;
    place_of_birth: string;
  }

  // create File item to work with it internally
  export interface IFileExperiences {
    agency_name: string;
    position: string;
    period: string;
    id_employeeId: number;
  }
  
  
  
  // create PnP JS response interface for Item
  export interface IResponseItemExperiences {
    agency_name: string;
    position: string;
    period: string;
    id_employeeId: number;
  }


  // create File item to work with it internally
export interface IFileEducation {
  id_employeeId: string;
  educational_stage: string;
  school_name: string;
  year_of_entry: number;
  graduation_year: number;
}



// create PnP JS response interface for Item
export interface IResponseItemEducation {
  id_employeeId: string;
  educational_stage: string;
  school_name: string;
  year_of_entry: number;
  graduation_year: number;
}
