import * as React from 'react';
import { SiteUserProps } from '@pnp/sp/src/siteusers';
import{ListColumns} from './ListColumns'



export interface ILoginProps {
    users: SiteUserProps[];
    isAdmin: boolean;
}


export default class Login extends React.PureComponent<ILoginProps> {
   constructor(props: ILoginProps)
   {
       super(props);

   }
    

   public componenWillMount(){
    console.log('props currentUser didMount',this.props.users);
   }

  public componentDidUpdate(){
    console.log('props currentUser didUpdate',this.props.users[0].Id);
  }
  public componentDidCatch(error, info){
    console.log('error in login', error, info);
    
  }
  

  public render(): React.ReactElement<ILoginProps> {
    console.log('props render', this.props.users[0])
    const {Id, Email, IsSiteAdmin, Title} = this.props.users[0]
    return (
        <div className="loginMap">
            <h2>Välkommen {Title}</h2>
            <p>{Id}</p>
            <p>{Email}</p>
            <p>{IsSiteAdmin.toString()}</p>
            <ListColumns isAdmin={this.props.isAdmin} UserPersonTitle={Title} UserPersonId={Id}/>
        </div>
    );
  }

}
