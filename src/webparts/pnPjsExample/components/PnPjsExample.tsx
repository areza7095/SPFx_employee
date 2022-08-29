import * as React from 'react';
import styles from './PnPjsExample.module.scss';
import { IPnPjsExampleProps } from './IPnPjsExampleProps';

// import interfaces
import { IFileEmployee, IResponseEmployee } from "./interfaces";


// import pnp
import { Caching } from "@pnp/queryable";
import { getSP } from "../pnpjsConfig";
import { SPFI, spfi } from "@pnp/sp";


//import antd
import { Card, Col, Row } from 'antd';
import Meta from 'antd/lib/card/Meta';
import "antd/dist/antd.css";



export interface IAsyncAwaitPnPJsProps {
  description: string;
}

export interface IIPnPjsExampleState {
  itemsEmployee: IFileEmployee[];
  errors: string[];
}

export default class PnPjsExample extends React.Component<IPnPjsExampleProps, IIPnPjsExampleState> {
  private listEmployee = "list_employee";
  private _sp: SPFI;

  constructor(props: IPnPjsExampleProps) {
    super(props);
    // set initial state
    this.state = {
      itemsEmployee: [],
      errors: []
    };
    this._sp = getSP();
  }

  public componentDidMount(): void {
    this._listEmployee();
  }

  public render(): React.ReactElement<IAsyncAwaitPnPJsProps> {

    // get url tenant
    var tenantUrl = window.location.protocol + "//" + window.location.host;
    // console.log('tenant url', tenantUrl)
    try {

      return (
        <>
        <Row>
        {this.state.itemsEmployee.map((item, idx) => {
            return (
              <Col span={8}>
                <Card
                      hoverable
                      style={{ width: 180 }}
                      cover={<img alt="example" src={tenantUrl + item.img_employee} key={idx} />} 
                      className='cardProfile'
                    >
                      <Meta title={item.name} description={item.employee_id} />
                    </Card>
              </Col>
            );
          })}
        </Row>
        </>
      );
    } catch (err) {
      console.log(err);
    }
    return null;
  }

 private _listEmployee = async (): Promise<void> => {
    try {
      // do PnP JS query, some notes:
      //   - .expand() method will retrive Item.File item but only Length property
      //   - .get() always returns a promise
      //   - await resolves proimises making your code act syncronous, ergo Promise<IResponseItem[]> becomes IResponse[]

      //Extending our sp object to include caching behavior, this modification will add caching to the sp object itself
      //this._sp.using(Caching("session"));

      //Creating a new sp object to include caching behavior. This way our original object is unchanged.
      const spCache = spfi(this._sp).using(Caching({ store: "session" }));

      const response: IResponseEmployee[] = await spCache.web.lists
        .getByTitle(this.listEmployee)
        .items
        .select("ID", "id_employee", "name", "address", "img_employee", "email", "no_hp", "gender", "birth_date", "place_of_birth" )()

      console.log('respone employee: ', response)

      // .expand()();
      // use map to convert IResponseItem[] into our internal object IFile[]
      const itemsEmployee: IFileEmployee[] = response.map((item: IResponseEmployee) => {
        // console.log('image url', JSON.parse(item.img_employee)['serverRelativeUrl'])
        // console.log(item.img_employee) //null
        return {
          employee_id: item.id_employee,
          name: item.name,
          address: item.address,
          img_employee: JSON.parse(item.img_employee)['serverRelativeUrl'],
        };

      });

      // Add the items to the state
      this.setState({ itemsEmployee });
    } catch (err) {
      console.log('error: ', err)
    }
  }

}
