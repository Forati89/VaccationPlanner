import * as React from 'react';
import IListItems from './IListItems';
import { sp, Items } from '@pnp/sp';
import { PrimaryButton, Stack, TextField, DayOfWeek, IDatePickerStrings, DatePicker, Label } from 'office-ui-fabric-react';
import {IColumnProps} from './IColumnProps';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker"; 
import {ListColumns} from './ListColumns';
import style from './Styles/AddVac.module.scss';

export interface IVacState {
  values: IListItems;
  userPerson: any;
  firstDayOfWeek?: DayOfWeek;
  DPStartMsg: string;
  DPEndMsg: string;
  validationMsg: string;
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
      firstDayOfWeek: DayOfWeek.Monday,
      DPStartMsg: '',
      DPEndMsg: '',
      validationMsg: ''

    };

    this._listName = "SemesterApp";  
  }
  public componentDidMount(){
  }

  public render() {
    const { } = this.state;

    return (
       <div className={style.body}>
         <h3>LÄGG TILL NY SEMESTER</h3>
        <Stack horizontal tokens={{ childrenGap: 20 }} styles={{ root: { maxWidth: 700 } }}>
            <TextField label="Notering:" underlined onChange={this._onChangeTitle}/>
            <DatePicker
            firstDayOfWeek={this.state.firstDayOfWeek}
            strings={DayPickerStrings}
            showWeekNumbers={true}
            isRequired={true}
            firstWeekOfYear={1}
            showMonthPickerAsOverlay={true}
            placeholder="Välj start datum"
            ariaLabel="Select a date"
            id="dateStart"
            onSelectDate={newDate => {console.log('newStartDate', newDate);
             if(this.compareDates(newDate, this.state.values.VacEndDate) === true) return (newDate.setHours(0, -newDate.getTimezoneOffset(), 0, 0) , this.setState(prevState => ({
              DPStartMsg: newDate.toLocaleDateString().slice(0, 10),
              values:{
            ...prevState.values,
              VacStartDate: newDate.toISOString()
              }  
              })));}}
            />
            <div><Label>Börjar: {this.state.DPStartMsg}</Label></div>
            <DatePicker
            firstDayOfWeek={this.state.firstDayOfWeek}
            strings={DayPickerStrings}
            isRequired={true}
            showWeekNumbers={true}
            firstWeekOfYear={1}
            showMonthPickerAsOverlay={true}
            placeholder="Välj slut datum"
            ariaLabel="Select a date"
            id="dateEnd"
            onSelectDate={newDate => {console.log('newEndDate',newDate);
              if(this.compareDates2(this.state.values.VacStartDate,newDate) === true) return
              (newDate.setHours(0, -newDate.getTimezoneOffset(), 0, 0) , this.setState(prevState => ({
              DPEndMsg: newDate.toLocaleDateString().slice(0, 10),
              values:{
            ...prevState.values,
              VacEndDate: newDate.toISOString()
              }  
              })));}}
            />
            <div><Label>Slutar: {this.state.DPEndMsg}</Label></div>
            
        </Stack>
        <br/>
        <div style={{maxWidth: '40%', textAlign: 'center', margin: '0 auto'}}>
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
            <PrimaryButton onClick={this.SubmitData}>Lägg Till Semester</PrimaryButton>
            <Label style={{color: 'blue'}}>{this.state.validationMsg}</Label>
        </div>
        <div>
            <ListColumns UserPersonId={this.props.UserPersonID} isAdmin={this.props.isAdmin}/>
        </div>
      </div> 
    );
  }
  private compareDates = (date1: any, date2: any): boolean=> {
    if(Date.parse(date1) > Date.parse(date2))
    { 
      this.setState({validationMsg: 'Kolla datum'});
      return false;
     }
    else
    {
      this.setState({validationMsg: 'Datum OK'});
      return true;
    }
  }
  private compareDates2 = (date1: any, date2: any): boolean=> {
    if(Date.parse(date1) < Date.parse(date2))
    { 
      this.setState({validationMsg: 'Datum OK'});
      return false;
     }
    else
    {
      this.setState({validationMsg: 'Kolla datum'});
      return true;
    }
  }


  private _getPeoplePickerOfficer = (items: any) => {

    const process = () =>{
      if(items.length === 0)
      {
        this.setOfficerId(10);

      }  
      else
      {
        this.setOfficerId(items[0].id);
      }
    };
    try{
      process();
      console.log('addvac admin ID', this.state.values.Title, this.state.values.VacStartDate, this.state.values.VacEndDate);

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
    {return alert("inorder to submit fill all fields");}
    else
    {
      let startDate = this.state.values.VacStartDate;
      return(
      sp.web.lists.getByTitle(this._listName).items
      .select("VacStartDate", "VacEndDate")
      .filter(`UserPerson eq ${this.props.UserPersonID} and VacStartDate ge datetime'${this.state.values.VacStartDate}'
       and VacEndDate ge datetime'${this.state.values.VacEndDate}'`).get()
      .then((result)=>{
        if(result.length > 0)
        {
        return(alert('Ops! du har redan planerad semester för denna period.'));
        }
        else {
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
          }
          );
          alert('Semester inlagd');
        }
      })
        // if(result[0].VacStartDate !== this.state.values.VacStartDate)
        // {
        //   sp.web.lists.getByTitle(this._listName).items.add({
        //     Title: this.state.values.Title,
        //     VacStartDate: this.state.values.VacStartDate,
        //     VacEndDate: this.state.values.VacEndDate,
        //     UserPersonId:{
        //       results: [this.props.UserPersonID]
        //     },
        //     OfficerId:{
        //       results: [this.state.values.Officer]
        //     },
        //     Status: 'Skapad',
        //   })
        // }
        // else return (alert('this date already exsists!'))
      );}}

    //   )

    // )}}
}
