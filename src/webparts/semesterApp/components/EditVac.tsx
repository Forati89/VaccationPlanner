import * as React from 'react';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton } from 'office-ui-fabric-react';

export interface IEditVacState{
    closeDialog: boolean;
}

export interface IEditVacProps{
    hideEdit: ()=> void;
}

export class EditVac extends React.Component<IEditVacProps,IEditVacState> {
    constructor(props)
    {
        super(props);
        this.state={
            closeDialog: false,
        }
    }

    public render() {
        return(
        <Dialog
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
            <DialogFooter>
            <DefaultButton onClick={this.CloseDialog} text="Avbryt" />
            </DialogFooter>
          </Dialog>)
    }

    private CloseDialog = () => {
        this.props.hideEdit();    
        return(
        this.setState({closeDialog: !this.state.closeDialog}))
    }
}