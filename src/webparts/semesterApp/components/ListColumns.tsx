import * as React from 'react';
import { DetailsList, DetailsListLayoutMode, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import IListItems from './IListItems';
import { sp } from '@pnp/sp';
import { IDropdownOption, Dropdown, DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react';
import {IColumnProps} from './IColumnProps';
import {EditVac} from './EditVac';
import style from './Styles/ListColumns.module.scss';

export interface IListColumnsState {
  sortedItems: IListItems[];
  values: IListItems;
  userPerson: any[];
  hideMember: boolean;
  hideAdmin: boolean;
  isEditTriggerd: boolean;
  viewItemId: number;
  viewItemStatus: string;
  viewItemSDate: any;
  viewItemEDate: any;
  firstDayOfWeek?: DayOfWeek;
  searchDate: any;
}

const DayPickerStrings: IDatePickerStrings = {
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

  shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

  shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],

  goToToday: 'Go to today',
  prevMonthAriaLabel: 'Go to previous month',
  nextMonthAriaLabel: 'Go to next month',
  prevYearAriaLabel: 'Go to previous year',
  nextYearAriaLabel: 'Go to next year',
  closeButtonAriaLabel: 'Close date picker'
};

export class ListColumns extends React.Component<IColumnProps, IListColumnsState> {
  private _columns: IColumn[];
  private _listName: string;
  private _options: IDropdownOption[];
  constructor(props: IColumnProps, state: IListColumnsState) {
    super(props);

    this.state = {
      sortedItems: [],
      values: {Id: 1, Title: '', VacStartDate: null, VacEndDate: null, UserPerson: '', Status: '', Officer: ''},
      userPerson: [],
      hideAdmin: true,
      hideMember: false,
      isEditTriggerd: false,
      viewItemId: null,
      viewItemStatus: '',
      viewItemSDate: null,
      viewItemEDate: null,
      firstDayOfWeek: DayOfWeek.Monday,
      searchDate: null
      


    };

    this._options = [
      { key: '1', text: 'Behandlas' },
      { key: '2', text: 'Beviljad' },
      { key: '3', text: 'Avslagen' },
      { key: '4', text: 'Skapad' }
      
    ];

    this._columns = [
        { key: '1', name: 'Notering', fieldName: 'Title', minWidth: 75, maxWidth: 75, isResizable: true },
        { key: '2', name: 'Semester Start', fieldName: 'VacStartDate', minWidth: 75, maxWidth: 75, isResizable: true,
          onRender: (item: IListItems) => (<span>{ new Date(item.VacStartDate).toISOString().slice(0, 10) }</span>) },
        { key: '3', name: 'Semester Slut', fieldName: 'VacEndDate', minWidth: 75, maxWidth: 75, isResizable: true,
          onRender: (item: IListItems) => (<span>{ new Date(item.VacEndDate).toISOString().slice(0, 10) }</span>)},
        { key: '4', name: 'Namn', fieldName: 'UserPerson', minWidth: 75, maxWidth: 75, isResizable: true,
          onRender: (item: IListItems) => (<span>{ item.UserPerson[0].Title }</span>) },
        { key: '5', name: 'Ansöknings Status', fieldName: 'Status', minWidth: 110, maxWidth: 110, isResizable: true,
          onRender: (item: IListItems)=> {if(this.props.isAdmin === true)
                          {return(<Dropdown label="Ändra status" defaultSelectedKey={this.choosenCat(item.Status)} options={this._options} className="Status" onChanged={(e: IDropdownOption)=>this._onChangeStatus(e.text, item.Id)}/>);}
                          else{return(item.Status);}}},
        { key: '6', name: 'Handläggare', fieldName: 'Officer', minWidth: 85, maxWidth: 85, isResizable: true,
          onRender: (item: IListItems) => (<span>{ item.Officer[0].Title }</span>) },
        { key: '7', name: 'Ändra', minWidth: 75, maxWidth: 75, isResizable: true,
          onRender: (item: IListItems)=> {if(this.props.isAdmin === true ){return null;}else{return this.changeButton(item.Id, item.Status, item.VacStartDate, item.VacEndDate);}} },
      ];
    this._listName = "SemesterApp";  
  }
  public componentWillMount(){
    this.getUser(this.state.values.Id);
    this.setUserType(this.props.isAdmin);

  }

  public componentDidMount(){
  }

  public render() {
    const { sortedItems } = this.state;
    return (
       <div>
         <br/>
         <div className={style.searchDate} hidden={this.state.hideMember}>
           <h3>Sök på datum:</h3>
         <DatePicker
            firstDayOfWeek={this.state.firstDayOfWeek}
            strings={DayPickerStrings}
            showWeekNumbers={true}
            firstWeekOfYear={1}
            showMonthPickerAsOverlay={true}
            placeholder="Välj start datum"
            ariaLabel="Select a date"
            id="dateStart"
            onSelectDate={newDate => {console.log('newStartDate', newDate); newDate.setHours(0, -newDate.getTimezoneOffset(), 0, 0) , this.setState(({
              searchDate: newDate.toISOString()
              }));}}
            />
            <button hidden={this.state.hideMember} onClick={()=>this.getSearchItems(this.props.UserPersonId)}>Visa</button>
            <br/>
         </div>
         <br/>
      <DetailsList
        items={sortedItems}
        setKey="set"
        columns={this._columns}
        // onRenderItemColumn={_renderItemColumn}
        // onColumnHeaderClick={this._onColumnClick}
        // onItemInvoked={this._onItemInvoked}
        // onColumnHeaderContextMenu={this._onColumnHeaderContextMenu}
        layoutMode={DetailsListLayoutMode.justified}
        ariaLabelForSelectionColumn="Toggle selection"
        ariaLabelForSelectAllCheckbox="Toggle selection for all items"
        checkButtonAriaLabel="Row checkbox"
      />
      <button hidden={this.state.hideMember} onClick={()=>this.getListItems(this.props.UserPersonId)}>Visa Mina planerade Semester</button>
      <button hidden={this.state.hideMember} onClick={()=>this.getListItems(this.props.UserPersonId, true)}>Visa gamla semester</button>
      <button hidden={this.state.hideAdmin}  onClick={()=>this.getOfficerListItems(this.props.UserPersonId)}>Visa Personal:s Planerade Semester</button>
      {this.state.isEditTriggerd && <EditVac
       itemStatus={this.state.viewItemStatus}
       itemId={this.state.viewItemId}
       hideEdit={this.changeEditTriggerd}
       itemSDate={this.state.viewItemSDate.slice(0,10)}
       itemEDate={this.state.viewItemEDate.slice(0,10)}
       userPersonID={this.props.UserPersonId}
       refreshList={()=>this.getListItems(this.props.UserPersonId)}
       />}
      </div> 
    );
  }

  private choosenCat = (cat: string) => {

    let catetgory = this._options.filter(value => value.text === cat);
    let key = catetgory.map(key => { return key.key[0];});

    return key;

}
  
  private changeButton = (Id: number, status: string, startDate: any, endDate: any) => {

      return(
        <button onClick={ ()=> this.setState({isEditTriggerd: !this.state.isEditTriggerd,
          viewItemId: Id,
          viewItemStatus: status,
          viewItemSDate: startDate,
          viewItemEDate: endDate

          })}>Ändra</button>
      );
  }

  private changeEditTriggerd = () => {
    this.setState({isEditTriggerd: false});
  }

  private setUserType = (type: boolean) => {
    console.log('isAdmin??', this.props.isAdmin, this.state.hideAdmin, this.state.hideMember);
    if(type === true)
    {
      this.setState({hideMember: true, hideAdmin: false});
    }
    else
    {
      this.setState({hideMember: false, hideAdmin: true});
    }
  }

  private _onChangeStatus = (newValue: any, id: number) => {
    console.log('onChangeStatus', id, newValue);
    this.setState( prevState => ({
       values:{
      ...prevState.values,
        Status: newValue.text
    }  
    }));
    sp.web.lists.getByTitle(this._listName).
    items.getById(id).update({
      Status: newValue
    });
    this.getOfficerListItems(this.props.UserPersonId);
  }

  private getListItems = (Id: number, checkOldVac?: boolean) => {
    let currentDate = new Date().toISOString();
    let greaterOrLess = 'ge';
    if(checkOldVac === true)
    {greaterOrLess = 'lt';}
    console.log('currentDate', currentDate);
    sp.web.lists.getByTitle(this._listName).items
    .select('*','Officer/Title','UserPerson/Title').expand('Officer', 'UserPerson')
    .filter(`UserPerson eq ${Id} and VacStartDate ${greaterOrLess} datetime'${currentDate}'`)
    .get().then((res: IListItems[]) => { console.log('list Items', res, 'this props listcolumn', this.props.UserPersonTitle);
        this.setState(({sortedItems: res})
    );});}

    private getSearchItems = (Id: number) => {
      let currentDate = this.state.searchDate;
      console.log('currentDate', currentDate);
      sp.web.lists.getByTitle(this._listName).items
      .select('*','Officer/Title','UserPerson/Title').expand('Officer', 'UserPerson')
      .filter(`UserPerson eq ${Id} and VacStartDate ge datetime'${currentDate}'`)
      .get().then((res: IListItems[]) => { console.log('list Items', res, 'this props listcolumn', this.props.UserPersonTitle);
          this.setState(({sortedItems: res})
      );});} 
    
  private getOfficerListItems = (Id?: number) => {
    let currentDate = new Date().toISOString();
    sp.web.lists.getByTitle(this._listName).items
    .select('*','Officer/Title','UserPerson/Title').expand('Officer', 'UserPerson')
    .filter(`Officer eq ${Id} and VacStartDate ge datetime'${currentDate}'`)
    .get().then((res: IListItems[]) => { console.log('list Items', res, 'this props listcolumn', this.props.UserPersonTitle);
          this.setState(({sortedItems: res})
    );});}
    // `('${10}',UserPersonId) or substringof('${encodeURIComponent(officerId)}',OfficerId)`

  private getUser = (Id: number) => {
    sp.web.lists.getByTitle("SemesterApp").items
   .getById(Id)
   .select("UserPerson", "UserPerson/EMail", "UserPerson/ID", "UserPerson/Title").expand("UserPerson").get().then(items => { console.log('userPerson items', items);
     this.setState({userPerson: items});
     });
   }

}


