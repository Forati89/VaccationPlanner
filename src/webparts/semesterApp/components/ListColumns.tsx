import * as React from 'react';
import { createListItems, IExampleItem } from '@uifabric/example-data';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { DetailsList, DetailsListLayoutMode, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import IListItems from './IListItems';
import { sp } from '@pnp/sp';
import { PrimaryButton } from 'office-ui-fabric-react';
import {IColumnProps} from './IColumnProps'

export interface IListColumnsState {
  sortedItems: IListItems[];
  values: IListItems;
  userPerson: any[];
}

export class ListColumns extends React.Component<IColumnProps, IListColumnsState> {
  private _columns: IColumn[];
  private _listName: string;
  constructor(props: IColumnProps, state: IListColumnsState) {
    super(props);

    this.state = {
      sortedItems: [],
      values: {Id: 1, Title: '', VacStartDate: null, VacEndDate: null, UserPerson: '', Status: '', Officer: ''},
      userPerson: []

    };

    this._columns = [
        { key: '1', name: 'Notering', fieldName: 'Title', minWidth: 75, maxWidth: 75, isResizable: true },
        { key: '2', name: 'Semester Start', fieldName: 'VacStartDate', minWidth: 75, maxWidth: 75, isResizable: true,
          onRender: (item: IListItems) => (<span>{ new Date(item.VacStartDate).toISOString().slice(0, 10) }</span>) },
        { key: '3', name: 'Semester Slut', fieldName: 'VacEndDate', minWidth: 75, maxWidth: 75, isResizable: true,
          onRender: (item: IListItems) => (<span>{ new Date(item.VacEndDate).toISOString().slice(0, 10) }</span>)},
        { key: '4', name: 'Personal', fieldName: 'UserPerson', minWidth: 75, maxWidth: 75, isResizable: true,
          onRender: (item: IListItems) => (<span>{ item.UserPerson[0].Title }</span>) },
        { key: '5', name: 'Ansöknings Status', fieldName: 'Status', minWidth: 110, maxWidth: 110, isResizable: true },
        { key: '6', name: 'Handläggare', fieldName: 'Officer', minWidth: 85, maxWidth: 85, isResizable: true,
          onRender: (item: IListItems) => (<span>{ item.Officer[0].Title }</span>) },
        { key: '7', name: 'Ändra', minWidth: 75, maxWidth: 75, isResizable: true, onRender: ()=>this.changeButton(this.state.values.Id) },
      ];
    this._listName = "SemesterApp";  
  }
  public componentWillMount(){
    this.getUser(this.state.values.Id);
  }

  public render() {
    const { sortedItems } = this.state;
    return (
       <div>
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
      <PrimaryButton text="Visa Planerade Semester" onClick={()=>this.getListItems(this.props.UserPersonId)} />
      </div> 
    );
  }
  
  private changeButton = (Id: number) => {
    return(
      <button onClick={()=>alert(Id)}>Ändra</button>
    )
  }
  private getListItems = (userId?: number, officerId?: any) => {
    sp.web.lists.getByTitle(this._listName).items
    .select('*','Officer/Title','UserPerson/Title').expand('Officer', 'UserPerson')
    .filter(`UserPerson eq ${userId}`)
    .get().then((res: IListItems[]) => { console.log('list Items', res, 'this props listcolumn', this.props.UserPersonTitle)
        this.setState(({sortedItems: res})
    )})}

    // `('${10}',UserPersonId) or substringof('${encodeURIComponent(officerId)}',OfficerId)`

  private getUser = (Id: number) => {
    sp.web.lists.getByTitle("SemesterApp").items
   .getById(Id)
   .select("UserPerson", "UserPerson/EMail", "UserPerson/ID", "UserPerson/Title").expand("UserPerson").get().then(items => { console.log('userPerson items', items)
     this.setState({userPerson: items});
     });
   }


//   private readUserItems = () => {
//     let data = Array.prototype.concat(this.state.getEMail);
//       data.map(res => { console.log(res);
//        this.setState({EMail: [res][0].Author.EMail, userTitle: [res][0].Author.Title});
//     });
//   }

//   private getUser = (Id: number) => {
//      sp.web.lists.getByTitle("MarketPlaceList").items
//     .getById(Id)
//     .select("Author", "Author/EMail", "Author/ID", "Author/Title").expand("Author").get().then(items => {
//       this.setState({getEMail: items});
//       });
//     }



//   private addValues = (): void => {
//     sp.web.lists.getByTitle('SemesterApp').items.add(
//     this.state.values
//     );
//   }

//   private _onColumnClick = (event: React.MouseEvent<HTMLElement>, column: IColumn): void => {
//     const columns  = this._columns;
//     let { sortedItems } = this.state;
//     let isSortedDescending = column.isSortedDescending;

//     // If we've sorted this column, flip it.
//     if (column.isSorted) {
//       isSortedDescending = !isSortedDescending;
//     }

//     // Sort the items.
//     sortedItems = _copyAndSort(sortedItems, column.fieldName!, isSortedDescending);

//     // Reset the items and columns to match the state.
//     // this.setState({
//     //   sortedItems: sortedItems,
//     //   columns: columns.map(col => {
//     //     col.isSorted = col.key === column.key;

//     //     if (col.isSorted) {
//     //       col.isSortedDescending = isSortedDescending;
//     //     }

//     //     return col;
//     //   })
//     // });
//   };

//   private _onColumnHeaderContextMenu(column: IColumn | undefined, ev: React.MouseEvent<HTMLElement> | undefined): void {
//     console.log(`column ${column!.key} contextmenu opened.`);
//   }

//   private _onItemInvoked(item: any, index: number | undefined): void {
//     alert(`Item ${item.name} at index ${index} has been invoked.`);
//   }
// }

// // function _buildColumns(items: IColumn[]): IColumn[] {
// //   const columns = buildColumns(items);

// //   const thumbnailColumn = columns.filter(column => column.name === 'thumbnail')[0];

// //   // Special case one column's definition.
// //   thumbnailColumn.name = '';
// //   thumbnailColumn.maxWidth = 50;

// //   return columns;
// // }

// function _renderItemColumn(item: IExampleItem, index: number, column: IColumn) {
//   const fieldContent = item[column.fieldName as keyof IExampleItem] as string;

//   switch (column.key) {
//     case 'thumbnail':
//       return <Image src={fieldContent} width={50} height={50} imageFit={ImageFit.cover} />;

//     case 'name':
//       return <Link href="#">{fieldContent}</Link>;

//     case 'color':
//       return (
//         <span data-selection-disabled={true} className={mergeStyles({ color: fieldContent, height: '100%', display: 'block' })}>
//           {fieldContent}
//         </span>
//       );

//     default:
//       return <span>{fieldContent}</span>;
//   }
}

// function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
//   const key = columnKey as keyof T;
//   return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));

// }
