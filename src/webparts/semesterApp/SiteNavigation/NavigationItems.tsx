import * as React from 'react';
import NavigationItem from './NavigationItem';
import styles from './Styles/NavigationItems.module.scss';

const navigationItems = () => (
    <ul className={styles.NavigationItems}>
        <NavigationItem url='/' >Home</NavigationItem>
        <NavigationItem url='/about'>About</NavigationItem>
        <NavigationItem url='/vaccation-planer'>Planera Semester</NavigationItem>
    </ul>
);

export default navigationItems;