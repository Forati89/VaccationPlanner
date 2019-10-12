import * as React from 'react';
import IListItems from './IListItems';
import { sp } from '@pnp/sp';
import { PrimaryButton, Stack, TextField, DayOfWeek, IDatePickerStrings, DatePicker } from 'office-ui-fabric-react';
import {IColumnProps} from './IColumnProps'
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker"; 
import {ListColumns} from './ListColumns'

export interface IVacState {
  values: IListItems;
  userPerson: any;
  firstDayOfWeek?: DayOfWeek;
}

export interface IVacProps {
    context: any;
    peoplePicker: any;
    UserPersonID: number;
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
  




export class AddVac extends React.Component<IVacProps, IVacState> {
  private _listName: string;
  constructor(props: IVacProps, state: IVacState) {
    super(props);

    this.state = {
      values: {Id: 1, Title: '', VacStartDate: null, VacEndDate: null, UserPerson: '', Status: '', Officer: ''},
      userPerson: [],
      firstDayOfWeek: DayOfWeek.Monday

    };

    this._listName = "SemesterApp";  
  }
  public componentDidMount(){
  }

  public render() {
    const { } = this.state;

    return (
       <div>
        <Stack horizontal tokens={{ childrenGap: 20 }} styles={{ root: { width: 700 } }}>
            <TextField label="Notering:" underlined />
            <DatePicker
            firstDayOfWeek={this.state.firstDayOfWeek}
            strings={DayPickerStrings}
            showWeekNumbers={true}
            firstWeekOfYear={1}
            showMonthPickerAsOverlay={true}
            placeholder="Välj start datum"
            ariaLabel="Select a date"
            />
            <DatePicker
            firstDayOfWeek={this.state.firstDayOfWeek}
            strings={DayPickerStrings}
            showWeekNumbers={true}
            firstWeekOfYear={1}
            showMonthPickerAsOverlay={true}
            placeholder="Välj slut datum"
            ariaLabel="Select a date"
            />
        </Stack>
        <br/>
        <div>
            <PeoplePicker    
                context={this.props.context}    
                titleText="Välj din handläggare"    
                personSelectionLimit={3}    
                groupName={""} // Leave this blank in case you want to filter from all users    
                showtooltip={true}    
                isRequired={true}    
                disabled={false}    
                ensureUser={true}    
                selectedItems={this._getPeoplePickerItems}    
                showHiddenInUI={false}    
                principalTypes={[PrincipalType.User]}    
                resolveDelay={1000}
            /> 
            <br/>
            <PrimaryButton>Lägg Till</PrimaryButton>
        </div>
        <div>
            <ListColumns UserPersonId={this.props.UserPersonID}/>
        </div>
      </div> 
    );
  }

  private _getPeoplePickerItems = (items: any) => {  
    console.log('Items:', items);  
  }

//   private getListItems = () => {
//     sp.web.lists.getByTitle(this._listName).items
//     .select('*','Officer/Title','UserPerson/Title').expand('Officer', 'UserPerson').get().then((res: IListItems[]) => { console.log('list Items', res, 'this props listcolumn', this.props.UserPersonTitle)
//         this.setState(({sortedItems: res})
//     )})}


}
