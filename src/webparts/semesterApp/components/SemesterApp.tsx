import * as React from 'react';
import styles from './Styles/SemesterApp.module.scss';
import { ISemesterAppProps } from './ISemesterAppProps';
import IListItems from './IListItems';
import Chrome from '../SiteNavigation/chrome';
import { HashRouter, BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './Login';
import VaccationPlanner from './VaccationPlanner';
import { sp } from '@pnp/sp';
import { SiteUserProps, CurrentUser } from '@pnp/sp/src/siteusers';

export interface ISemesterAppState {
  listItems: IListItems[];
  userItems: any;
  userPerson: any;
}

export default class SemesterApp extends React.Component<ISemesterAppProps, ISemesterAppState> {
  constructor(props: ISemesterAppProps, state: ISemesterAppState)
  {
    super(props);
    this.state = {
      listItems: [],
      userItems: [{Id: null, Title: '', IsSiteAdmin: true, Email: ''}],
      userPerson: []
    };


  }

  public componentWillMount()
  {
    this.getSPCUData();
  }

  private getSPCUData(): void {

    sp.web.currentUser.get().then((r: SiteUserProps) => {
       console.log('currentUser', r);
       this.setState({
         userItems: [r]
        });
      });  
  }


  public render(): React.ReactElement<ISemesterAppProps> {
    const admin = ()=> {
      console.log('is addmin true?', this.state.userItems[0].IsSiteAdmin);
      if(this.state.userItems[0].IsSiteAdmin === false)
      {
        return(<Route path="/vaccation-planer" component={VaccationPlanner}  />);
      }
      else return null;
    };


    return (
      <div className={styles.container}>
      <HashRouter>
        <Chrome>
          <Switch>
            {<Route path="/vaccation-planer" render={()=>this.state.userItems[0].IsSiteAdmin === false &&
              <VaccationPlanner
                isAdmin={this.state.userItems[0].IsSiteAdmin}
                context={this.props.context}
                userPersonID={this.state.userItems[0].Id}
                userEmail={this.state.userItems[0].Email}
              />}
                
            />}
            <Route path="/" render={()=> <Login isAdmin={this.state.userItems[0].IsSiteAdmin} users={this.state.userItems}/>}  />
            <Route render={() => <h1>Page Not found</h1>} />
          </Switch>
        </Chrome>
      </HashRouter>
      </div>
    );
  }
}
