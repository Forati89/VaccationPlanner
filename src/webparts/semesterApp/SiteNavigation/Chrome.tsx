import * as React from 'react';
import MenuBar from '../SiteNavigation/MenuBar';

const chrome = (props:any) => (
    <div>
        <div>Here is where the top nav will be</div>
        <MenuBar />
        <main>
            {props.children}
        </main>
    </div>
);

export default chrome;