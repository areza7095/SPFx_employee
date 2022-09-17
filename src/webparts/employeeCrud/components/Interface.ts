export interface IDetailsListCompactExampleItem {
  ID: number;
  employee_id: number;
  name: string;
  address: string;
  email: string;
  no_hp: string;
  gender: string;
  birth_date: string;
  place_of_birth: string;
}

// create File item to work with it internally
export interface IEditEmployee {
  ID: number;

  employee_id: number;
  name: string;
  address: string;
  email: string;
  no_hp: string;
  gender: string;
  birth_date: string;
  place_of_birth: string;
}



// create PnP JS response interface for Item
export interface IResponseEditEmployee {
  ID: number;
  id_employee: number;
  name: string;
  address: string;
  email: string;
  no_hp: string;
  gender: string;
  birth_date: string;
  place_of_birth: string;
}


// create File item to work with it internally
export interface IFileEmployee {
  ID: number;

  employee_id: number;
  name: string;
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
  address: string;
  email: string;
  no_hp: string;
  gender: string;
  birth_date: string;
  place_of_birth: string;
}

export interface IAddEmployee {
  // ID: number;
  id_employee: number;
  name: string;
  // img_employee: string;
  address: string;
  email: string;
  no_hp: string;
  gender: string;
  // birth_date: string;
  place_of_birth: string;
}

