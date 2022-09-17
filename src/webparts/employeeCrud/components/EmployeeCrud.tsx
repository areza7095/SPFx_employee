import * as React from 'react';
import styles from './EmployeeCrud.module.scss';
import { IEmployeeCrudProps } from './IEmployeeCrudProps';
import { escape } from '@microsoft/sp-lodash-subset';

//custom css
import './global.css'

// ANTD
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Popconfirm, Row, Select, Space } from 'antd';
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
import { IFileEmployee, IResponseEmployee, IDetailsListCompactExampleItem, IEditEmployee, IResponseEditEmployee } from "./Interface";


// import pnp
import { Caching } from "@pnp/queryable";
import { getSP } from "../pnpjsConfig";
import { SPFI, spfi } from "@pnp/sp";
import { PrimaryButton } from 'office-ui-fabric-react';
import { IItem, IItemAddResult } from '@pnp/sp/items';
import { createBatch } from '@pnp/sp/batching';

const exampleChildClass = mergeStyles({
  display: 'block',
  marginBottom: '10px',
});

export interface IAsyncAwaitPnPJsProps {
  description: string;
}

export interface IEmployeeCrudState {
  itemsEmployee: IFileEmployee[];
  visible: boolean;
  editVisible: boolean;
  errors: string[];
  items: IDetailsListCompactExampleItem[];
  itemEdit: IEditEmployee[];
  selectionDetails: string;
  valueGender: string[];
  valueEditGender: string[];
  itemID: number;
  // employee_id_Edit: number;
  // itemEmployeeID: number,
  // itemName: string,
  // itemAddress: string,
  // itemEmail: string,
  // itemNoHP: string,
  // itemGender: string,
  // itemBirthDate: string,
  // itemPlaceOfBirth: string,
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
      onSelectionChanged: () => this.setState({
        selectionDetails: this._getSelectionDetails()
      }),
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
      {
        key: 'email',
        name: 'Email',
        fieldName: 'email',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true
      },
      {
        key: 'address',
        name: 'Address',
        fieldName: 'address',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true
      },
      {
        key: 'no_hp',
        name: 'Call Number',
        fieldName: 'no_hp',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true
      },
      {
        key: 'gender',
        name: 'Gender',
        fieldName: 'gender',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true
      },
      {
        key: 'birth_date',
        name: 'Birth Date',
        fieldName: 'birth_date',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
        onRender: test => {
          return <span>{moment(test.birth_date).format('DD MMM YYYY')}</span>
        }
      },
      {
        key: 'place_of_birth',
        name: 'Place Of Birth',
        fieldName: 'place_of_birth',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true
      },
    ];

    this.state = {
      visible: false,
      editVisible: false,
      itemsEmployee: [],
      errors: [],
      items: this._allItems,
      itemEdit: [],
      selectionDetails: this._getSelectionDetails(),
      valueGender: [],
      valueEditGender: [],
      itemID: 0,
      // employee_id_Edit: 0,
      // itemName: [],
      // itemAddress: [],
      // itemEmail: [],
      // itemNoHP: 0,
      // itemGender: [],
      // itemBirthDate: [],
      // itemPlaceOfBirth: [],

    };

    this._sp = getSP();
  }



  public componentDidMount(): void {
    // read all file sizes from Documents library
    this._listEmployee();
    this._getSelectionDetails();

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

    // Close Edit Drawer
    const onCloseEdit = () => {
      this.setState({
        editVisible: false
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

    const confirm = () =>
      new Promise(resolve => {
        setTimeout(() => resolve(null), 3000);
      });


    return (
      <>
        <Button type="primary" onClick={showDrawer} style={{ marginRight: 10 }} id='addBtn'>
          add Employee
        </Button>

        <Popconfirm title="are you sure want remove this employee?" onConfirm={this._deleteItem}>
          <Button type="primary" danger onClick={confirm} id='removeBtn' >remove Employee</Button>
        </Popconfirm>

        <Button type="primary" onClick={this._showUpdateItem} style={{ marginLeft: 10 }} id='editBtn'>
          edit Employee
        </Button>


        {/* add employee */}
        <Drawer
          title="Employee Add Form"
          width={720}
          onClose={onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
          destroyOnClose={true}
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
                  <Input placeholder="Please enter id employee" id='id_employee' />
                </Form.Item>
              </Col>


              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
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
                  <Input placeholder="Please enter name" id='name' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="callnumb"
                  label="Call Number"
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
                  label="Gender"
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
                    getPopupContainer={trigger => trigger.parentElement!}
                    id='birth_date'
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
                  label="Address"
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

        {/* edit employee */}
        <Drawer
          title="Employee Edit Form"
          width={720}
          onClose={onCloseEdit}
          visible={this.state.editVisible}
          bodyStyle={{ paddingBottom: 80 }}
          destroyOnClose={true}
          extra={
            <Space>
              <Button onClick={onCloseEdit}>Cancel</Button>

              <Button onClick={this._updateItem} type="primary">
                Submit
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true, message: 'Please enter Name' }]}
                >
                  <Input placeholder="Please enter id_employee"
                    id='name_Edit' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, message: 'Please enter email' }]}
                >
                  <Input
                    style={{ width: '100%' }}
                    // addonAfter=".com"
                    placeholder="Please enter email"
                    id='email_Edit'
                  />
                </Form.Item>
              </Col>

            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="callnumb"
                  label="Call Number"
                  rules={[{ required: true, message: 'Please enter call number' }]}
                >
                  <Input
                    style={{ width: '100%' }}
                    addonBefore="+62"
                    placeholder="Please enter call number"
                    id='call_number_Edit'
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[{ required: true, message: 'Please select an gender' }]}

                >
                  <Select placeholder="Please select an gender" onChange={handleGender} id='gender_edit'>
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="place_of_birth"
                  label="Place Of Birth"
                  rules={[{ required: true, message: 'Please enter the Birth Place' }]}
                >
                  <Input
                    style={{ width: '100%' }}
                    placeholder="Please enter the Birth Place"
                    id='place_of_birth_Edit'
                  />
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
                    getPopupContainer={trigger => trigger.parentElement!}
                    id='birth_date_Edit'
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="address"
                  label="Address"
                  rules={[
                    {
                      required: true,
                      message: 'please enter ur address',
                    },
                  ]}
                >
                  <Input.TextArea rows={4} placeholder="please enter ur address"
                    id='address_Edit' />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>

        <div>
          <div className={exampleChildClass}>{selectionDetails}</div>
          {/* <Announced message={selectionDetails} /> */}
          {/* <TextField
            className={exampleChildClass}
            label="Filter by name:"
            onChange={this._onFilter}
            styles={textFieldStyles}
          /> */}
          {/* <Announced message={`Number of items after filter applied: ${items.length}.`} /> */}
          <MarqueeSelection selection={this._selection}>
            <DetailsList
              compact={true}
              items={items}
              columns={this._columns}
              setKey="set"
              layoutMode={DetailsListLayoutMode.justified}
              selection={this._selection}
              selectionMode={SelectionMode.multiple}
              selectionPreservedOnEmptyClick={true}
            // onItemInvoked={this._onItemInvoked}
            // ariaLabelForSelectionColumn="Toggle selection"
            // ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            // checkButtonAriaLabel="select row"
            />
          </MarqueeSelection>
        </div>
      </>
    );
  }

  //method for show list data
  private _listEmployee = async (): Promise<void> => {
    try {
      const spCache = spfi(this._sp);

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
          ID: item.ID,
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

  // method to use pnp objects and create new item
  private async createNewItem() {
    const spCache = spfi(this._sp);

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

    //get data after deleted
    this._listEmployee()

    //close drawer
    this.setState({ visible: false })
  }

  //method for delete item
  private _deleteItem = async (): Promise<void> => {
    const spCache = spfi(this._sp);

    const list = spCache.web.lists
      .getByTitle(this.listEmployee);

    await list.items.getById(this.state.itemID).recycle();

    //get data after deleted
    this._listEmployee()
  }

  private _showUpdateItem = async (): Promise<void> => {
    try {
      const spCache = spfi(this._sp);

      const response: IResponseEmployee[] = await spCache.web.lists
        .getByTitle(this.listEmployee)
        .items
        .select("ID", "id_employee", "name", "address", "img_employee", "email", "no_hp", "gender", "birth_date", "place_of_birth")
        .filter(`ID eq ${this.state.itemID}`)();

      // .expand()();
      // use map to convert IResponseItem[] into our internal object IFile[]
      const itemEdit: IEditEmployee[] = response.map((item: IResponseEditEmployee) => {
        return {

          ID: item.ID,
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
      console.log("item edit ", itemEdit)
      // Add the items to the state
      this.setState({ itemEdit });
    } catch (err) {
      console.log('error: ', err)
    }

    //Open Edit Drawer
    this.setState({ editVisible: true })

    //loop interface data for show to drawer
    const employeeList = this.state.itemEdit
    employeeList.map((item) => {
      // const employeeId = (document.getElementById('id_employee_Edit') as HTMLInputElement).value = `${item.employee_id}`
      // console.log(employeeId)

      const name = (document.getElementById('name_Edit') as HTMLInputElement).value = `${item.name}`
      console.log(name)

      const address = (document.getElementById('address_Edit') as HTMLInputElement).value = `${item.address}`
      console.log(address)

      const email = (document.getElementById('email_Edit') as HTMLInputElement).value = `${item.email}`
      console.log(email)

      const no_hp = (document.getElementById('call_number_Edit') as HTMLInputElement).value = `${item.no_hp}`
      console.log(no_hp)

      // const gender = (document.getElementById('gender_Edit') as HTMLInputElement).value = `${this.state.valueGender}`
      // console.log(gender)

      const birth_date = (document.getElementById('birth_date_Edit') as HTMLInputElement).value = `${item.birth_date}`
      console.log(birth_date)

      const place_of_birth = (document.getElementById('place_of_birth_Edit') as HTMLInputElement).value = `${item.place_of_birth}`
      console.log(place_of_birth)


    })



  }

  private _updateItem = async (): Promise<void> => {
    const spCache = spfi(this._sp);

    console.log("Update item function")

    // get input type form
    const name = (document.getElementById('name_Edit') as HTMLInputElement).value;
    console.log(name)

    const email = (document.getElementById('email_Edit') as HTMLInputElement).value;
    console.log(email)

    // const idEmployee = (document.getElementById('id_employee_Edit') as HTMLInputElement).value;
    // console.log(idEmployee)

    const callNumber = (document.getElementById('call_number_Edit') as HTMLInputElement).value;
    console.log(callNumber)

    const birth_date = (document.getElementById('birth_date_Edit') as HTMLInputElement).value;
    console.log(birth_date)

    const address = (document.getElementById('address_Edit') as HTMLInputElement).value;
    console.log(address)

    const placeOfBirth = (document.getElementById('place_of_birth_Edit') as HTMLInputElement).value;
    console.log(placeOfBirth)

    const list = spCache.web.lists
      .getByTitle(this.listEmployee);

    const i = await list.items
      .getById(this.state.itemID)
      .update({
        name: name,
        address: address,
        email: email,
        no_hp: callNumber,
      });

    console.log("update item ", i);

    //get data after deleted
    this._listEmployee()

    //close drawer
    this.setState({ editVisible: false })
  }

  private _getSelectionDetails(): any {
    // validation button disable
    const selectionCount = this._selection.getSelectedCount();

    //test
    const getSelectionCount = this._selection.getSelection();
    console.log('getselection', getSelectionCount)


    const addBtn = document.getElementById('addBtn') as HTMLInputElement | null;
    const removeBtn = document.getElementById('removeBtn') as HTMLInputElement | null;
    const editBtn = document.getElementById('editBtn') as HTMLInputElement | null;

    if (selectionCount == 1) {
      addBtn?.setAttribute('disabled', '');
      removeBtn?.removeAttribute('disabled');
      editBtn?.removeAttribute('disabled');
    }

    else if (selectionCount == 2) {
      addBtn?.setAttribute('disabled', '');
      removeBtn?.removeAttribute('disabled');
      editBtn?.setAttribute('disabled', '');
    }

    else {
      addBtn?.removeAttribute('disabled');
      removeBtn?.setAttribute('disabled', '');
      editBtn?.setAttribute('disabled', '');
    }

 

    switch (selectionCount) {
      case 0:
        return '';
      case 1:
        return (this.setState(
          {
            itemID: (this._selection.getSelection()[0] as IDetailsListCompactExampleItem).ID,
          }, () => console.log('console state', this.state) 

        ));


      default:
        return;
    }

    

  }

  // private _onFilter = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string): void => {
  //   this.setState({
  //     items: text ? this._allItems.filter(i => i.name.toLowerCase().indexOf(text) > -1) : this._allItems,
  //   });
  // };

  // private _onItemInvoked(item: IDetailsListCompactExampleItem): any {
  //   alert(`Item invoked: ${item.ID}`);
  // }


}

