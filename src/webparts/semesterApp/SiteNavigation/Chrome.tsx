import * as React from 'react';
import MenuBar from '../SiteNavigation/MenuBar';
import style from './Styles/Chrome.module.scss';

const chrome = (props:any) => (
    <div className={style.main}>
        <h1>Semester Planer App, Välkommen</h1>
        <MenuBar />
        <main>
            {props.children}
        </main>
    </div>
);

export default chrome;