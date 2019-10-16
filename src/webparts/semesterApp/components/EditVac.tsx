import * as React from 'react';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton, Stack, Label, DatePicker, TextField, IDatePickerStrings, DayOfWeek, Button } from 'office-ui-fabric-react';
import IListItems from './IListItems';
import { sp } from '@pnp/sp';
import style from './Styles/EditVac.module.scss';

export interface IEditVacState{
    closeDialog: boolean;
    firstDayOfWeek?: DayOfWeek;
    DPStartMsg: string;
    DPEndMsg: string;
    values: IListItems;
    validationMsg: string;
}

export interface IEditVacProps{
    hideEdit: ()=> void;
    itemId: number;
    itemStatus: string;
    itemSDate: any;
    itemEDate: any;
    userPersonID: number;
    refreshList: Function;
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
    private _listName: string;
    constructor(props)
    {
        super(props);
        this.state={
            validationMsg: '',
            closeDialog: false,
            firstDayOfWeek: DayOfWeek.Monday,
            DPStartMsg: this.props.itemSDate,
            DPEndMsg: this.props.itemEDate,
            values: {Id: 1, Title: '', VacStartDate: null, VacEndDate: null, UserPerson: '', Status: '', Officer: null},
        };
        this._listName = "SemesterApp";  

    }

    public render() {
        if(this.props.itemStatus === 'Avslagen' || this.props.itemStatus === 'Beviljad')
        {
            return (
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
                <h2>Din ansökning är: {this.props.itemStatus} och kan därmed inte ändras </h2>
            </Dialog>);
        }
        else
        return(
        <Dialog
            styles={{ main: { width: 700 } }}
            hidden={this.state.closeDialog}
            onDismiss={this.CloseDialog}
            containerClassName={style.textDialog}
            dialogContentProps={{
              type: DialogType.largeHeader,
              title: 'Ändra Semester',
            }}
            modalProps={{
              isBlocking: false,
              styles: { main: { maxWidth: 900 } }
            }}>
            <div>   
              <h2>Din ansökan är: {this.props.itemStatus}</h2>
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
              if(this.compareDates2(this.state.values.VacStartDate,newDate) === true) return;
              (newDate.setHours(0, -newDate.getTimezoneOffset(), 0, 0) , this.setState(prevState => ({
              DPEndMsg: newDate.toLocaleDateString().slice(0, 10),
              values:{
            ...prevState.values,
              VacEndDate: newDate.toISOString()
              }  
              })));}}
            />
            <div><Label>Slutar: {this.state.DPEndMsg}</Label></div>
            {<h3 style={{color: 'blue'}}>{this.state.validationMsg}</h3>}
            </div>
            <DialogFooter>
            <Button onClick={()=>this.updateValues()} text="Spara Ändringar" />
            <Button onClick={()=>this.deleteItem(this.props.itemId)} text="Tabort Semester" />
            <DefaultButton onClick={this.CloseDialog} text="Avbryt" />
            </DialogFooter>
          </Dialog>);
    }
    private _onChangeTitle = (ev: React.FormEvent<HTMLInputElement>, newValue?: any) => {
        
      this.setState( prevState => ({
         values:{
        ...prevState.values,
          Title: newValue
      }  
      }));
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
    private deleteItem = (Id: number): void => {
        let list = sp.web.lists.getByTitle(this._listName);

          list.items.getById(Id).delete().then(_ => {});
          this.CloseDialog();
    }

    private CloseDialog = () => {
        this.props.hideEdit();    
        return(
        this.setState({closeDialog: !this.state.closeDialog}));
    }
    private updateValues = (): void => {

      if(this.state.values.VacEndDate === null || this.state.values.VacStartDate === null)
      {return alert("inorder to submit fill all fields");}
      else
      {
        sp.web.lists.getByTitle(this._listName).items
        .select("VacStartDate", "VacEndDate")
        .filter(`UserPerson eq ${this.props.userPersonID} and VacStartDate ge datetime'${this.state.values.VacStartDate}'
         and VacEndDate ge datetime'${this.state.values.VacEndDate}'`).get()
        .then((result)=>{
          if(result.length > 0)
          {
          return(alert('Ops! du har redan planerad semester för denna period.'));
          }
          else {
                let list = sp.web.lists.getByTitle(this._listName);
                list.items.getById(this.props.itemId).update({
                Title: this.state.values.Title,
                VacStartDate: this.state.values.VacStartDate,
                VacEndDate: this.state.values.VacEndDate
        
                });
                this.CloseDialog();
            }
            
            });
          }
    }
            
            

        
}