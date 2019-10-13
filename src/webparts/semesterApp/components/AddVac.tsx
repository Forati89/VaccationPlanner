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
    isAdmin: boolean;
    userEmail: string;
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
      values: {Id: 1, Title: '', VacStartDate: null, VacEndDate: null, UserPerson: '', Status: '', Officer: null},
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
            <TextField label="Notering:" underlined onChange={this._onChangeTitle}/>
            <DatePicker
            firstDayOfWeek={this.state.firstDayOfWeek}
            strings={DayPickerStrings}
            showWeekNumbers={true}
            firstWeekOfYear={1}
            showMonthPickerAsOverlay={true}
            placeholder="Välj start datum"
            ariaLabel="Select a date"
            onSelectDate={newDate => {console.log('newStartDate', newDate); this.setState(prevState => ({
              values:{
            ...prevState.values,
              VacStartDate: newDate
              }  
              }))}}
            />
            <DatePicker
            firstDayOfWeek={this.state.firstDayOfWeek}
            strings={DayPickerStrings}
            showWeekNumbers={true}
            firstWeekOfYear={1}
            showMonthPickerAsOverlay={true}
            placeholder="Välj slut datum"
            ariaLabel="Select a date"
            onSelectDate={newDate => {console.log('newEndDate',newDate); this.setState(prevState => ({
              values:{
            ...prevState.values,
              VacEndDate: newDate
              }  
              }))}}
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
                selectedItems={this._getPeoplePickerOfficer}    
                showHiddenInUI={false}    
                principalTypes={[PrincipalType.User]}    
                resolveDelay={1000}
            /> 
            <br/>
            <PrimaryButton onClick={this.SubmitData}>Lägg Till</PrimaryButton>
        </div>
        <div>
            <ListColumns UserPersonId={this.props.UserPersonID} isAdmin={this.props.isAdmin}/>
        </div>
      </div> 
    );
  }


  private _getPeoplePickerOfficer = (items: any) => {

    const process = () =>{
      if(items.length === 0)
      {
        this.setOfficerId(10);

      }  
      else
      {
        this.setOfficerId(items[0].id)
      }
    }
    try{
      process();
      console.log('addvac admin ID', this.state.values.Title, this.state.values.VacStartDate, this.state.values.VacEndDate)

    }catch(error){
      alert(error);
    }
    return process;
}

  private setOfficerId = (value: any) => {
    this.setState( prevState => ({
      values:{
    ...prevState.values,
      Officer: value
  }  
  }));

  }
  private _onChangeTitle = (ev: React.FormEvent<HTMLInputElement>, newValue?: any) => {
        
    this.setState( prevState => ({
       values:{
      ...prevState.values,
        Title: newValue
    }  
    }));
  }

  private SubmitData = ()=>{

    if(this.state.values.Officer === null || this.state.values.VacEndDate === null || this.state.values.VacStartDate === null)
    {return alert("inorder to submit fill all fields")}
    else
    {
      return(
      sp.web.lists.getByTitle(this._listName).items.add({
      Title: this.state.values.Title,
      VacStartDate: this.state.values.VacStartDate,
      VacEndDate: this.state.values.VacEndDate,
      UserPersonId:{
        results: [this.props.UserPersonID]
      },
      OfficerId:{
        results: [this.state.values.Officer]
      },
      Status: 'Skapad',
    })
    )}}
}
