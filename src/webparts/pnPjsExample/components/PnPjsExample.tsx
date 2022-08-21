import * as React from 'react';
import styles from './PnPjsExample.module.scss';
import { IPnPjsExampleProps } from './IPnPjsExampleProps';

// import interfaces
import { IFile, IResponseItem } from "./interfaces";

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
  items: IFile[];
  errors: string[];
}

export default class PnPjsExample extends React.Component<IPnPjsExampleProps, IIPnPjsExampleState> {
  private LOG_SOURCE = "🅿PnPjsExample";
  private LIBRARY_NAME = "Daftar_karyawan";
  private _sp: SPFI;

  constructor(props: IPnPjsExampleProps) {
    super(props);
    // set initial state
    this.state = {
      items: [],
      errors: []
    };
    this._sp = getSP();
  }

  public componentDidMount(): void {
    // read all file sizes from Documents library
    this._readAllFilesSize();
  }

  public render(): React.ReactElement<IAsyncAwaitPnPJsProps> {

    // get url tenant
    var tenantUrl = window.location.protocol + "//" + window.location.host;
    // console.log('tenant url', tenantUrl)

    try {

      return (
        <>
        <Row>
        {this.state.items.map((item, idx) => {
            return (
              <Col span={8}>
                <Card
                      hoverable
                      style={{ width: 180 }}
                      cover={<img alt="example" src={tenantUrl + item.Image} key={idx} />}
                    >
                      <Meta title={item.Nama} description={item.ID} />
                    </Card>
              </Col>
            );
          })}
        </Row>
        </>
        
        // <div>
        //   <table width="100%">
        //     <tr>
        //       <td><strong>ID</strong></td>
        //       <td><strong>Nama</strong></td>
        //       <td><strong>Alamat</strong></td>
        //       <td><strong>Foto</strong></td>
        //     </tr>
        //     {this.state.items.map((item, idx) => {
        //       return (
        //         <tr key={idx}>
        //           <td>{item.ID}</td>
        //            <td>{item.Nama}</td>
        //            <td>{item.Alamat}</td>
        //            <td><img src={tenantUrl + item.Image} alt="" className={styles.imgProfile}/></td>
        //         </tr>
        //       );
        //     })}
        //   </table>
        // </div >
      );
    } catch (err) {
      console.log(err);
    }
    return null;
  }

  private _readAllFilesSize = async (): Promise<void> => {
    try {
      // do PnP JS query, some notes:
      //   - .expand() method will retrive Item.File item but only Length property
      //   - .get() always returns a promise
      //   - await resolves proimises making your code act syncronous, ergo Promise<IResponseItem[]> becomes IResponse[]

      //Extending our sp object to include caching behavior, this modification will add caching to the sp object itself
      //this._sp.using(Caching("session"));

      //Creating a new sp object to include caching behavior. This way our original object is unchanged.
      const spCache = spfi(this._sp).using(Caching({ store: "session" }));

      const response: IResponseItem[] = await spCache.web.lists
        .getByTitle(this.LIBRARY_NAME)
        .items
        .select("id_employee", "Nama", "Title", "img_employee")();
      console.log('respone', response)

      // .expand()();
      // use map to convert IResponseItem[] into our internal object IFile[]
      const items: IFile[] = response.map((item: IResponseItem) => {

        // console.log('image url', JSON.parse(item.img_employee)['serverRelativeUrl'])

        return {
          ID: item.id_employee,
          Nama: item.Nama,
          Alamat: item.Title,
          Image: JSON.parse(item.img_employee)['serverRelativeUrl']

        };

      });

      // Add the items to the state
      this.setState({ items });
    } catch (err) {
      console.log('error: ', err)
    }
  }
}
