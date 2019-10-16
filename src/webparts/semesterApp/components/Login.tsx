import * as React from 'react';
import { SiteUserProps } from '@pnp/sp/src/siteusers';
import{ListColumns} from './ListColumns';



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
    console.log('props render', this.props.users[0]);
    const {Id, Email, IsSiteAdmin, Title} = this.props.users[0];
    let admin = ()=> {
      if(IsSiteAdmin === true)
      {return <p style={{fontWeight: 'bold'}}>Ja du är Admin!</p>;}
      else return(<p style={{fontWeight: 'bold'}}>Nej, det har du inte!</p>);
    };
    return (
        <div className="loginMap">
            <h2>Välkommen {Title}</h2>
            <p>Ditt Id nummer är: {<p style={{fontWeight: 'bold'}}>{Id}</p>}</p>
            <p>Ditt mejl adress: {<p style={{fontWeight: 'bold'}}>{Email}</p>}</p>
            <p>Har du admin rättigheter? {admin()}</p>
            <ListColumns isAdmin={this.props.isAdmin} UserPersonTitle={Title} UserPersonId={Id}/>
        </div>
    );
  }

}
