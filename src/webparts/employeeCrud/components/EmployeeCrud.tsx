import * as React from 'react';
import styles from './EmployeeCrud.module.scss';
import { IEmployeeCrudProps } from './IEmployeeCrudProps';
import { escape } from '@microsoft/sp-lodash-subset';

//custom css
import './global.css'

// ANTD
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from 'antd';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import "antd/dist/antd.css";

// FLUENT UI
import { ITextFieldStyles, TextField } from '@fluentui/react/lib/TextField';
import { Toggle } from '@fluentui/react/lib/Toggle';
import { Announced } from '@fluentui/react/lib/Announced';
import { DetailsList, DetailsListLayoutMode, Selection, SelectionMode, IColumn } from '@fluentui/react/lib/DetailsList';
import { MarqueeSelection } from '@fluentui/react/lib/MarqueeSelection';
import { mergeStyles, mergeStyleSets } from '@fluentui/react/lib/Styling';
import { TooltipHost } from '@fluentui/react';


// EXT RESOURCE
import * as moment from 'moment';



// import interfaces
import { IFileEmployee, IResponseEmployee, IDetailsListCompactExampleItem } from "./Interface";


// import pnp
import { Caching } from "@pnp/queryable";
import { getSP } from "../pnpjsConfig";
import { SPFI, spfi } from "@pnp/sp";
import { PrimaryButton } from 'office-ui-fabric-react';
import { IItemAddResult } from '@pnp/sp/items';

const exampleChildClass = mergeStyles({
  display: 'block',
  marginBottom: '10px',
});

const textFieldStyles: Partial<ITextFieldStyles> = { root: { maxWidth: '300px' } };

export interface IAsyncAwaitPnPJsProps {
  description: string;
}

export interface IEmployeeCrudState {
  itemsEmployee: IFileEmployee[];
  visible: boolean;
  errors: string[];
  items: IDetailsListCompactExampleItem[];
  selectionDetails: string;
  valueGender: string[];
}

export default class EmployeeCrud extends React.Component<IEmployeeCrudProps, IEmployeeCrudState> {

  private listEmployee = "list_employee";
  private _sp: SPFI;

  private _selection: Selection;
  private _allItems: IFileEmployee[];
  private _columns: IColumn[];



  constructor(props: IEmployeeCrudProps) {
    super(props);
    // set initial state
    this._selection = new Selection({
      onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() }),
    });

    this._allItems = [];    

    this._columns = [
      {
        key: 'name',
        name: 'Name', 
        fieldName: 'name', 
        minWidth: 100, 
        maxWidth: 200, 
        isResizable: true
      },
      { key: 'email', 
      name: 'Email', 
      fieldName: 'email', 
      minWidth: 100, 
      maxWidth: 200, 
      isResizable: true 
    },
      { key: 'address', 
      name: 'Address', 
      fieldName: 'address', 
      minWidth: 100, 
      maxWidth: 200, 
      isResizable: true 
    },
      { key: 'no_hp', 
      name: 'Call Number', 
      fieldName: 'no_hp', 
      minWidth: 100, 
      maxWidth: 200, 
      isResizable: true 
    },
      { key: 'gender', 
      name: 'Gender', 
      fieldName: 'gender', 
      minWidth: 100, 
      maxWidth: 200, 
      isResizable: true 
    },
      { key: 'birth_date', 
      name: 'Birth Date', 
      fieldName: 'birth_date', 
      minWidth: 100, 
      maxWidth: 200, 
      isResizable: true 
    },
      { key: 'place_of_birth', 
      name: 'Place Of Birth', 
      fieldName: 'place_of_birth',
      minWidth: 100, 
      maxWidth: 200, 
      isResizable: true },
    ];

    this.state = {
      visible: false,
      itemsEmployee: [],
      errors: [],
      items: this._allItems,
      selectionDetails: this._getSelectionDetails(),
      valueGender: [],
    };


    this._sp = getSP();
  }



  public componentDidMount(): void {
    // read all file sizes from Documents library
    this._listEmployee();

  }

  public render(): React.ReactElement<IEmployeeCrudProps> {
    const { items, selectionDetails, } = this.state;


    // ANTD
    const { Option } = Select;

    // ANTD
    const showDrawer = () => {
      this.setState({
        visible: true,
      });
    };
    const onClose = () => {
      this.setState({
        visible: false,
      });
    };

    const handleGender = (value) => {
      console.log('gender : ', value)
      this.setState({
        valueGender: value,
      });
    };


    return (
      <>
        <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
          add Employee
        </Button>
        <Drawer
          title="Create a new account"
          width={720}
          onClose={onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
          extra={
            <Space>
              <Button onClick={onClose}>Cancel</Button>
              <Button onClick={() => this.createNewItem()} type="primary">
                Submit
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="id_employee"
                  label="ID Employee"
                  rules={[{ required: true, message: 'Please enter id employee' }]}
                >
                  <Input placeholder="Please enter id_employee" id='id_employee' />
                </Form.Item>
              </Col>


              <Col span={12}>
                <Form.Item
                  name="email"
                  label="email"
                  rules={[{ required: true, message: 'Please enter email' }]}
                >
                  <Input
                    style={{ width: '100%' }}
                    // addonAfter=".com"
                    placeholder="Please enter email"
                    id='email'
                  />
                </Form.Item>
              </Col>

            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true, message: 'Please enter Name' }]}
                >
                  <Input placeholder="Please enter id_employee" id='name' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="callnumb"
                  label="number"
                  rules={[{ required: true, message: 'Please enter call number' }]}
                >
                  <Input
                    style={{ width: '100%' }}
                    addonBefore="+62"
                    placeholder="Please enter call number"
                    id='call_number'
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="gender"
                  label="gender"
                  rules={[{ required: true, message: 'Please select an gender' }]}

                >
                  <Select placeholder="Please select an gender" onChange={handleGender}>
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="birth_date"
                  label="Birth Date"
                  rules={[{ required: true, message: 'Please choose the place of ur Birth ' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    getPopupContainer={trigger => trigger.parentElement!} id='birth_date'
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="place_of_birth"
                  label="Place Of Birth"
                  rules={[{ required: true, message: 'Please enter the Birth Place' }]}
                >
                  <Input
                    style={{ width: '100%' }}
                    placeholder="Please enter the Birth Place"
                    id='place_of_birth'
                  />
                </Form.Item>
              </Col>
            </Row>



            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="address"
                  label="address"
                  rules={[
                    {
                      required: true,
                      message: 'please enter ur address',
                    },
                  ]}
                >
                  <Input.TextArea rows={4} placeholder="please enter ur address" id='address' />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>

        <div>
          <div className={exampleChildClass}>{selectionDetails}</div>
          <Announced message={selectionDetails} />
          {/* <TextField
            className={exampleChildClass}
            label="Filter by name:"
            onChange={this._onFilter}
            styles={textFieldStyles}
          /> */}
          <Announced message={`Number of items after filter applied: ${items.length}.`} />
          <MarqueeSelection selection={this._selection}>
            <DetailsList
              compact={true}
              items={items}
              columns={this._columns}
              setKey="set"
              layoutMode={DetailsListLayoutMode.justified}
              selection={this._selection}
              selectionPreservedOnEmptyClick={true}
              onItemInvoked={this._onItemInvoked}
              ariaLabelForSelectionColumn="Toggle selection"
              ariaLabelForSelectAllCheckbox="Toggle selection for all items"
              checkButtonAriaLabel="select row"
            />
          </MarqueeSelection>
        </div>
      </>
    );
  }

  // method to use pnp objects and create new item
  private async createNewItem() {
    const spCache = spfi(this._sp).using(Caching({ store: "session" }));

    // get input type form
    const name = (document.getElementById('name') as HTMLInputElement).value;
    console.log(name)

    const email = (document.getElementById('email') as HTMLInputElement).value;
    console.log(email)

    const idEmployee = (document.getElementById('id_employee') as HTMLInputElement).value;
    console.log(idEmployee)

    const callNumber = (document.getElementById('call_number') as HTMLInputElement).value;
    console.log(callNumber)

    

    const birth_date = (document.getElementById('birth_date') as HTMLInputElement).value;
    console.log(birth_date)

    const address = (document.getElementById('address') as HTMLInputElement).value;
    console.log(address)

    const placeOfBirth = (document.getElementById('place_of_birth') as HTMLInputElement).value;
    console.log(placeOfBirth)

    const iar: IItemAddResult = await spCache.web.lists
      .getByTitle(this.listEmployee)
      .items
      .add({
        id_employee: idEmployee,
        name: name,
        address: address,
        email: email,
        no_hp: callNumber,
        gender: this.state.valueGender,
        birth_date: birth_date,
        place_of_birth: placeOfBirth
      });
    console.log(iar);
    // this.setState({ showmessageBar: true, message: "Item Added Sucessfully", itemID: iar.data.Id });
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
        .select("ID", "id_employee", "name", "address", "img_employee", "email", "no_hp", "gender", "birth_date", "place_of_birth")()
      console.log("Respone List Employee : ", response)
      // .expand()();
      // use map to convert IResponseItem[] into our internal object IFile[]
      const items: IFileEmployee[] = response.map((item: IResponseEmployee) => {


        // console.log('image url', JSON.pFarse(item.img_employee)['serverRelativeUrl'])
        return {
          employee_id: item.id_employee,
          name: item.name,
          address: item.address,
          // img_employee: JSON.parse(item.img_employee)['serverRelativeUrl'],
          email: item.email,
          no_hp: item.no_hp,
          gender: item.gender,
          birth_date: item.birth_date,
          place_of_birth: item.place_of_birth,

        };

      });

      // Add the items to the state
      this.setState({ items });
    } catch (err) {
      console.log('error: ', err)
    }
  }

  private _getSelectionDetails(): string {
    const selectionCount = this._selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        return 'No items selected';
      case 1:
        return '1 item selected: ' + (this._selection.getSelection()[0] as IDetailsListCompactExampleItem).name;
      default:
        return `${selectionCount} items selected`;
    }
  }

  private _onFilter = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string): void => {
    this.setState({
      items: text ? this._allItems.filter(i => i.name.toLowerCase().indexOf(text) > -1) : this._allItems,
    });
  };

  private _onItemInvoked(item: IDetailsListCompactExampleItem): void {
    alert(`Item invoked: ${item.name}`);
  }
}
