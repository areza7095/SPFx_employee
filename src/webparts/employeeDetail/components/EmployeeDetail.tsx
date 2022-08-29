import * as React from 'react';
import styles from './EmployeeDetail.module.scss';
import { IEmployeeDetailProps } from './IEmployeeDetailProps';

//custom css
import './global.css'


// import interfaces
import { IFileEmployee, IResponseEmployee, IFileEducation, IResponseItemEducation, IResponseItemExperiences, IFileExperiences } from "./Interface";

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
  itemsEmployee: IFileEmployee[];
  itemsEducation: IFileEducation[];
  itemsExperiences: IFileExperiences[];
  errors: string[];
}



export default class EmployeeDetail extends React.Component<IEmployeeDetailProps, IEmployeeDetailState> {
  private listEmployee = "list_employee";
  private educationalBackground = "educational_background";
  private jobExperiences = "job_experiences";
  private _sp: SPFI;

  //filtering ID
  private testID = 2;
  private testID_ = 471242;

  constructor(props: IEmployeeDetailProps) {
    super(props);
    // set initial state
    this.state = {
      itemsEmployee: [],
      itemsEducation: [],
      itemsExperiences: [],
      errors: []
    };
    this._sp = getSP();
  }

  public componentDidMount(): void {
    // read all file sizes from Documents library
    this._listEmployee();
    this._educationalBackground();
    this._jobExperiences();
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
          {this.state.itemsEmployee.map((item, idx,) => {
            return (
              <Row className='cardProfile'>
                <Col span={8} style={{marginTop: 100}}>
                  <Card
                    hoverable
                    style={{ width: 160 }}
                    cover={<img alt="img" src={tenantUrl + item.img_employee} key={idx} />}
                  >
                    <Meta title={item.name} description={item.employee_id} />


                  </Card>
                </Col>

                <Col span={16}  >
                  <Tabs defaultActiveKey="1" onChange={onChange} >
                    <TabPane tab="Personal Data" key="1">

                      <table className='table-Diri'>
                        <tr >
                          <th>
                            NAME
                          </th>
                          <td>
                            {item.name}
                          </td>
                        </tr>

                        <tr>
                          <th>
                            GENDER
                          </th>
                          <td>
                            {item.gender}
                          </td>
                        </tr>

                        <tr>
                          <th>
                            BIRTH DATE
                          </th>
                          <td>
                            {moment(item.birth_date).format("MMMM D YYYY")}
                          </td>
                        </tr>

                        <tr>
                          <th>
                          BIRTH PLACE
                          </th>
                          <td>
                            {item.place_of_birth}
                          </td>
                        </tr>

                        <tr>
                          <th>
                            ADDRESS
                          </th>
                          <td>
                            {item.address}
                          </td>
                        </tr>

                        <tr>
                          <th>
                            CALL NUMBER
                          </th>
                          <td>
                            {item.no_hp}
                          </td>
                        </tr>

                        <tr>
                          <th>
                            EMAIL
                          </th>
                          <td>
                            {item.email}
                          </td>
                        </tr>
                      </table>
                    </TabPane>

                    <TabPane tab="Educational Stage" key="2">
                      <table className='styled-table'>
                        <thead>
                          <tr>
                            <th>EDUCATIONAL STAGE</th>
                            <th>SCHOOL NAME</th>
                            <th>YEAR OF ENTRY</th>
                            <th>GRADUATION YEAR</th>

                          </tr>
                        </thead>
                        <tbody>
                          {this.state.itemsEducation.map((item, idx,) => {
                            return (
                              <tr className='active-row'>
                                <td>{item.educational_stage}</td>
                                <td>{item.school_name}</td>
                                <td>{item.year_of_entry}</td>
                                <td>{item.graduation_year}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>



                    </TabPane>

                    <TabPane tab="Job Experiences" key="3">
                      <table className='styled-table'>
                        <thead>
                          <tr>
                            <th>AGENCY NAME</th>
                            <th>POSITION</th>
                            <th>PERIOD</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.itemsExperiences.map((item, idx,) => {
                            return (
                              <tr className='active-row'>
                                <td>{item.agency_name}</td>
                                <td>{item.position}</td>
                                <td>{item.period}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </TabPane>

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
        .select("ID", "id_employee", "name", "address", "img_employee", "email", "no_hp", "gender", "birth_date", "place_of_birth" )
        .filter(`ID eq ${this.testID}`)();
      console.log('respone employee: ', response)

      // .expand()();
      // use map to convert IResponseItem[] into our internal object IFile[]
      const itemsEmployee: IFileEmployee[] = response.map((item: IResponseEmployee) => {


        // console.log('image url', JSON.pFarse(item.img_employee)['serverRelativeUrl'])
        return {
          ID: item.ID,
          employee_id: item.id_employee,
          name: item.name,
          address: item.address,
          img_employee: JSON.parse(item.img_employee)['serverRelativeUrl'],
          email: item.email,
          no_hp: item.no_hp,
          gender: item.gender,
          birth_date: item.birth_date,
          place_of_birth: item.place_of_birth,

        };

      });

      // Add the items to the state
      this.setState({ itemsEmployee });
    } catch (err) {
      console.log('error: ', err)
    }
  }

  private _educationalBackground = async (): Promise<void> => {
    try {
      // do PnP JS query, some notes:
      //   - .expand() method will retrive Item.File item but only Length property
      //   - .get() always returns a promise
      //   - await resolves proimises making your code act syncronous, ergo Promise<IResponseItem[]> becomes IResponse[]

      //Extending our sp object to include caching behavior, this modification will add caching to the sp object itself
      //this._sp.using(Caching("session"));

      //Creating a new sp object to include caching behavior. This way our original object is unchanged.
      const spCache = spfi(this._sp).using(Caching({ store: "session" }));

      const response: IResponseItemEducation[] = await spCache.web.lists
        .getByTitle(this.educationalBackground)
        .items
        .select("name/id_employee", "educational_stage", "school_name", "year_of_entry", "graduation_year")
        .expand("name")
        .filter(`name/id_employee eq ${this.testID_}`)();
        // .select(")
      console.log('respone pendidikan: ', response)

      // .expand()();
      // use map to convert IResponseItem[] into our internal object IFile[]
      const itemsEducation: IFileEducation[] = response.map((item: IResponseItemEducation) => {


        // console.log('image url', JSON.pFarse(item.img_employee)['serverRelativeUrl'])
        return {
          id_employeeId: item.id_employeeId,
          educational_stage: item.educational_stage,
          school_name: item.school_name,
          year_of_entry: item.year_of_entry,
          graduation_year: item.graduation_year
        };

      });

      // Add the items to the state
      this.setState({ itemsEducation });
    } catch (err) {
      console.log('error: ', err)
    }
  }

  private _jobExperiences = async (): Promise<void> => {
    try {
      // do PnP JS query, some notes:
      //   - .expand() method will retrive Item.File item but only Length property
      //   - .get() always returns a promise
      //   - await resolves proimises making your code act syncronous, ergo Promise<IResponseItem[]> becomes IResponse[]

      //Extending our sp object to include caching behavior, this modification will add caching to the sp object itself
      //this._sp.using(Caching("session"));

      //Creating a new sp object to include caching behavior. This way our original object is unchanged.
      const spCache = spfi(this._sp).using(Caching({ store: "session" }));

      const response: IResponseItemExperiences[] = await spCache.web.lists
        .getByTitle(this.jobExperiences)
        .items()
        console.log(response)
      //   .select("id_employeeId", "nama_instansi", "posisi", "periode")
      //   .filter(`id_employeeId eq ${this.testID}`)();
      // console.log('respone pekerjaan: ', response)

      // .expand()();
      // use map to convert IResponseItem[] into our internal object IFile[]
      const itemsExperiences: IFileExperiences[] = response.map((item: IResponseItemExperiences) => {


        // console.log('image url', JSON.pFarse(item.img_employee)['serverRelativeUrl'])
        return {
          agency_name: item.agency_name,
          position: item.position,
          period: item.period,
          id_employeeId: item.id_employeeId
        };

      });

      // Add the items to the state
      this.setState({ itemsExperiences });
    } catch (err) {
      console.log('error: ', err)
    }
  }
}