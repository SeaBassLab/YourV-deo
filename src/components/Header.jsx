import React from 'react';
import '../assets/styles/components/Header.scss'
import Logo from '../assets/statics/logo-platzi-video-BW2.png'
import userIcon from '../assets/statics/user-icon.png'


const Header = () => {
    return (
        <header className="header">
        <img className="header__img" src={Logo} alt="User" />
        <div className="header__menu">
            <div className="header__menu--profile">
                <img className="header__menu--img" src={userIcon} alt="image icon"/>
                <p>Perfil</p>
            </div>
            <ul>
                <li><a href="iniciar-secion.html">Cuenta</a></li>
                <li><a href="/">Cerrar Seción</a></li>

            </ul>
        </div>
    </header>
    )
}

export default Header;