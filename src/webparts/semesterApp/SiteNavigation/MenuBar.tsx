import * as React from 'react';
import NavigationItems from './NavigationItems';
import Logo from './Logo';
import styles from './Styles/MenuBar.module.scss';

const menuBar = () => {
    return (
        <header className={styles.MenuBar}>
            <Logo  />
            <nav>
                <NavigationItems /> 
            </nav>
            <hr />
        </header>
    );
};

export default menuBar;