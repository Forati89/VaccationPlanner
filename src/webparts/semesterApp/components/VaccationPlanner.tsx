import * as React from 'react';
import {AddVac} from './AddVac';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { sp } from '@pnp/sp';
import { ISemesterAppProps } from './ISemesterAppProps';

export interface IVacPlannerProps {
  context: WebPartContext;
  userPersonID: number;
  isAdmin: boolean;
  userEmail: string;

}
export interface IVacPlannerState {  
  addUsers: string[];  
} 

export default class VaccationPlaner extends React.Component<ISemesterAppProps, IVacPlannerState> {

  private _listName: string;
  
  constructor(props)
  {
    super(props);
    this.state={
      addUsers: []
    };
    this._listName = "SemesterApp";  
  }
  public render(): React.ReactElement<IVacPlannerProps> {
    return (
        <div>
            <AddVac
             isAdmin={this.props.isAdmin}
             userEmail={this.props.userEmail}
             context={this.props.context}
             peoplePicker={this._getPeoplePickerItems}
             UserPersonID={this.props.userPersonID}
            />
        </div>
    );
  }

  public componentWillMount()
  {
    console.log('VaccationPlaner', this.props.userPersonID);
  }

  private addSelectedUsers = (): void => {    
    sp.web.lists.getByTitle(this._listName).items.add({  
      Officer: {   
          results: this.state.addUsers  
      }  
    }).then(i => {  
        console.log(i);  
    });  
  }  

  private _getPeoplePickerItems = (items: any) => {  
    console.log('Items:', items);  
  }

}
