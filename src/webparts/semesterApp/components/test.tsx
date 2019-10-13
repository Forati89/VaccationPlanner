
class DatePickerComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            date1: null,
            date2: null,
        };
    }
  
    public render() {
        return (
            <div>
                <span>Datepicker without onSelectDate callback:</span>
                <Fabric.DatePicker required={true} value={this.state.date1} onSelectDate={newDate => {console.log(newDate); this.setState({date1: newDate})}}/>
          
                <span>Datepicker with onSelectDate callback:</span>
                <Fabric.DatePicker value={this.state.date2} required={true} onSelectDate={newDate => {console.log(newDate); this.setState({date2: newDate})}} />
         
            </div>
        );
    }
}


ReactDOM.render(
    <DatePickerComponent />,
    document.getElementById('content')
);