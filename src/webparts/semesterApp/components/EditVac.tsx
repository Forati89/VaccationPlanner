import * as React from 'react';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton, Stack, Label, DatePicker, TextField, IDatePickerStrings, DayOfWeek } from 'office-ui-fabric-react';
import IListItems from './IListItems';

export interface IEditVacState{
    closeDialog: boolean;
    firstDayOfWeek?: DayOfWeek;
    DPStartMsg: string;
    DPEndMsg: string;
    values: IListItems;
}

export interface IEditVacProps{
    hideEdit: ()=> void;
    itemId: number;
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

export class EditVac extends React.Component<IEditVacProps,IEditVacState> {
    constructor(props)
    {
        super(props);
        this.state={
            closeDialog: false,
            firstDayOfWeek: DayOfWeek.Monday,
            DPStartMsg: '',
            DPEndMsg: '',
            values: {Id: 1, Title: '', VacStartDate: null, VacEndDate: null, UserPerson: '', Status: '', Officer: null},
        }
    }

    public render() {
        return(
        <Dialog
            styles={{ main: { width: 700 } }}
            hidden={this.state.closeDialog}
            onDismiss={this.CloseDialog}
            dialogContentProps={{
              type: DialogType.largeHeader,
              title: 'Ändra Semester',
            }}
            modalProps={{
              isBlocking: false,
              styles: { main: { minWidth: 900 } }
            }}>
              <h2>Hello i am test dialog</h2>
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
            onSelectDate={newDate => {console.log('newStartDate', newDate);  this.setState(prevState => ({
              DPStartMsg: newDate.toLocaleDateString().slice(0, 10),
              values:{
            ...prevState.values,
              VacStartDate: newDate.toLocaleDateString()
              }  
              }))}}
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
            onSelectDate={newDate => {console.log('newEndDate',newDate);  this.setState(prevState => ({
              DPEndMsg: newDate.toLocaleDateString().slice(0, 10),
              values:{
            ...prevState.values,
              VacEndDate: newDate.toLocaleDateString()
              }  
              }))}}
            />
            <div><Label>Slutar: {this.state.DPEndMsg}</Label></div>
            
            <DialogFooter>
            <DefaultButton onClick={this.CloseDialog} text="Avbryt" />
            </DialogFooter>
          </Dialog>)
    }
    private _onChangeTitle = (ev: React.FormEvent<HTMLInputElement>, newValue?: any) => {
        
      this.setState( prevState => ({
         values:{
        ...prevState.values,
          Title: newValue
      }  
      }));
    }

    private CloseDialog = () => {
        this.props.hideEdit();    
        return(
        this.setState({closeDialog: !this.state.closeDialog}))
    }
}