import * as React from 'react';
import styles from './EmployeeDetail.module.scss';
import { IEmployeeDetailProps } from './IEmployeeDetailProps';

//custom css
import './global.css'


// import interfaces
import { IFile, IResponseItem, IFilePendidikan, IResponseItemPendidikan, IResponseItemPekerjaan, IFilePekerjaan } from "./Interface";

// import pnp
import { Caching } from "@pnp/queryable";
import { getSP } from "../pnpjsConfig";
import { SPFI, spfi } from "@pnp/sp";


//import antd
import { Card, Col, Row, Descriptions, Avatar, Tabs } from 'antd';
import Meta from 'antd/lib/card/Meta';
import "antd/dist/antd.css";


//ext resource
import styled from 'styled-components';
import * as moment from 'moment';



export interface IAsyncAwaitPnPJsProps {
  description: string;
}

export interface IEmployeeDetailState {
  items: IFile[];
  itemsPendidikan: IFilePendidikan[];
  itemsPekerjaan: IFilePekerjaan[];
  errors: string[];
}



export default class EmployeeDetail extends React.Component<IEmployeeDetailProps, IEmployeeDetailState> {
  private LOG_SOURCE = "🅿PnPjsExample";
  private LIBRARY_NAME_1 = "Daftar_karyawan";
  private LIBRARY_NAME_2 = "riwayat_pendidikan";
  private LIBRARY_NAME_3 = "riwayat_pekerjaan";
  private _sp: SPFI;

  //filtering ID
  private testID = 6;

  constructor(props: IEmployeeDetailProps) {
    super(props);
    // set initial state
    this.state = {
      items: [],
      itemsPendidikan: [],
      itemsPekerjaan: [],
      errors: []
    };
    this._sp = getSP();
  }

  public componentDidMount(): void {
    // read all file sizes from Documents library
    this._daftarKaryawan();
    this._riwayatPendidikan();
    this._riwayatPekerjaan();
  }

  public render(): React.ReactElement<IAsyncAwaitPnPJsProps> {

    // get url tenant
    var tenantUrl = window.location.protocol + "//" + window.location.host;

    const onChange = (key: string) => {
      console.log(key);
    };
    const { TabPane } = Tabs;

    try {
      return (
        <>
          {this.state.items.map((item, idx,) => {
            return (
              <Row>
                <Col span={8} >
                  <Card
                    hoverable
                    style={{ width: 160 }}
                    cover={<img alt="img" src={tenantUrl + item.Image} key={idx} />}
                  >
                    <Meta title={item.Nama} description={item.employee_id} />


                  </Card>
                </Col>
                <Col span={16}  >
                  <Tabs defaultActiveKey="1" onChange={onChange} >
                    <TabPane tab="Data Diri" key="1">

                      <table className='table-Diri'>
                        <tr >
                          <th>
                            NAMA
                          </th>
                          <td>
                            {item.Nama}
                          </td>
                        </tr>

                        <tr>
                          <th>
                            JENIS KELAMIN
                          </th>
                          <td>
                            {item.jenis_kelamin}
                          </td>
                        </tr>

                        <tr>
                          <th>
                            TANGGAL LAHIR
                          </th>
                          <td>
                            {moment(item.tanggal_lahir).format("MMM D YYYY")}
                          </td>
                        </tr>

                        <tr>
                          <th>
                            TEMPAT LAHIR
                          </th>
                          <td>
                            {item.tempat_lahir}
                          </td>
                        </tr>

                        <tr>
                          <th>
                            ALAMAT
                          </th>
                          <td>
                            {item.alamat_lengkap}
                          </td>
                        </tr>

                        <tr>
                          <th>
                            NO TELEPON
                          </th>
                          <td>
                            {item.no_hp}
                          </td>
                        </tr>

                        <tr>
                          <th>
                            ALAMAT EMAIL
                          </th>
                          <td>
                            {item.Email}
                          </td>
                        </tr>
                      </table>
                    </TabPane>
                    {this.state.itemsPendidikan.map((item, idx,) => {
                      return (
                        <TabPane tab="Riwayat Pendidikan" key="2">
                          <table className='styled-table'>
                            <thead>
                              <tr>
                                <th>JENJANG PENDIDIKAN</th>
                                <th>NAMA SEKOLAH</th>
                                <th>TAHUN MASUK</th>
                                <th>TAHUN LULUS</th>

                              </tr>
                            </thead>
                            <tbody>
                              <tr className='active-row'>
                                <td>{item.jenjang_pendidikan}</td>
                                <td>{item.nama_sekolah}</td>
                                <td>{item.tahun_masuk}</td>
                                <td>{item.tahun_lulus}</td>
                              </tr>
                            </tbody>
                          </table>


                        </TabPane>
                      );
                    })}
                    {this.state.itemsPekerjaan.map((item, idx,) => {
                      return (

                        <TabPane tab="Riwayat Pekerjaan" key="3">
                          <table className='styled-table'>
                            <thead>
                              <tr>
                                <th>NAMA INSTANSI</th>
                                <th>POSISI</th>
                                <th>PERIODE</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className='active-row'>
                                <td>{item.nama_instansi}</td>
                                <td>{item.posisi}</td>
                                <td>{item.periode}</td>
                              </tr>
                            </tbody>
                          </table>
                        </TabPane>

                      );
                    })}

                  </Tabs>
                </Col>
              </Row>


            );
          })
          }


        </>
      );
    } catch (err) {
      console.log(err);
    }
    return null;
  }

  private _daftarKaryawan = async (): Promise<void> => {
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
        .getByTitle(this.LIBRARY_NAME_1)
        .items
        .select("ID", "id_employee", "Nama", "Title", "img_employee", "email", "no_hp", "alamat_lengkap", "jenis_kelamin", "tanggal_lahir", "tempat_lahir")
        .filter(`ID eq ${this.testID}`)();
      console.log('respone', response)

      // .expand()();
      // use map to convert IResponseItem[] into our internal object IFile[]
      const items: IFile[] = response.map((item: IResponseItem) => {


        // console.log('image url', JSON.pFarse(item.img_employee)['serverRelativeUrl'])
        return {
          ID: item.ID,
          employee_id: item.id_employee,
          Nama: item.Nama,
          Alamat: item.Title,
          Image: JSON.parse(item.img_employee)['serverRelativeUrl'],
          Email: item.email,
          no_hp: item.no_hp,
          alamat_lengkap: item.alamat_lengkap,
          tempat_lahir: item.tempat_lahir,
          jenis_kelamin: item.jenis_kelamin,
          tanggal_lahir: item.tanggal_lahir,

        };

      });

      // Add the items to the state
      this.setState({ items });
    } catch (err) {
      console.log('error: ', err)
    }
  }

  private _riwayatPendidikan = async (): Promise<void> => {
    try {
      // do PnP JS query, some notes:
      //   - .expand() method will retrive Item.File item but only Length property
      //   - .get() always returns a promise
      //   - await resolves proimises making your code act syncronous, ergo Promise<IResponseItem[]> becomes IResponse[]

      //Extending our sp object to include caching behavior, this modification will add caching to the sp object itself
      //this._sp.using(Caching("session"));

      //Creating a new sp object to include caching behavior. This way our original object is unchanged.
      const spCache = spfi(this._sp).using(Caching({ store: "session" }));

      const response: IResponseItemPendidikan[] = await spCache.web.lists
        .getByTitle(this.LIBRARY_NAME_2)
        .items
        .select("id_employeeId", "jenjang_pendidikan", "nama_sekolah", "tahun_masuk", "tahun_lulus")
        .filter(`id_employeeId eq ${this.testID}`)();
      console.log('respone pendidikan: ', response)

      // .expand()();
      // use map to convert IResponseItem[] into our internal object IFile[]
      const itemsPendidikan: IFilePendidikan[] = response.map((item: IResponseItemPendidikan) => {


        // console.log('image url', JSON.pFarse(item.img_employee)['serverRelativeUrl'])
        return {
          id_employeeId: item.id_employeeId,
          jenjang_pendidikan: item.jenjang_pendidikan,
          nama_sekolah: item.nama_sekolah,
          tahun_masuk: item.tahun_masuk,
          tahun_lulus: item.tahun_lulus
        };

      });

      // Add the items to the state
      this.setState({ itemsPendidikan });
    } catch (err) {
      console.log('error: ', err)
    }
  }

  private _riwayatPekerjaan = async (): Promise<void> => {
    try {
      // do PnP JS query, some notes:
      //   - .expand() method will retrive Item.File item but only Length property
      //   - .get() always returns a promise
      //   - await resolves proimises making your code act syncronous, ergo Promise<IResponseItem[]> becomes IResponse[]

      //Extending our sp object to include caching behavior, this modification will add caching to the sp object itself
      //this._sp.using(Caching("session"));

      //Creating a new sp object to include caching behavior. This way our original object is unchanged.
      const spCache = spfi(this._sp).using(Caching({ store: "session" }));

      const response: IResponseItemPekerjaan[] = await spCache.web.lists
        .getByTitle(this.LIBRARY_NAME_3)
        .items
        .select("id_employeeId", "nama_instansi", "posisi", "periode")
        .filter(`id_employeeId eq ${this.testID}`)();
      console.log('respone pekerjaan: ', response)

      // .expand()();
      // use map to convert IResponseItem[] into our internal object IFile[]
      const itemsPekerjaan: IFilePekerjaan[] = response.map((item: IResponseItemPekerjaan) => {


        // console.log('image url', JSON.pFarse(item.img_employee)['serverRelativeUrl'])
        return {
          nama_instansi: item.nama_instansi,
          posisi: item.posisi,
          periode: item.periode,
          id_employeeId: item.id_employeeId
        };

      });

      // Add the items to the state
      this.setState({ itemsPekerjaan });
    } catch (err) {
      console.log('error: ', err)
    }
  }
}