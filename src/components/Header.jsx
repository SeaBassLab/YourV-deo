import React from 'react';
import { Link } from 'react-router-dom'
import '../assets/styles/components/Header.scss'
import Logo from '../assets/statics/logo-platzi-video-BW2.png'
import userIcon from '../assets/statics/user-icon.png'


const Header = () => {
    return (
        <header className="header">

        <Link to="/">
            <img className="header__img" src={Logo} alt="User" />
        </Link>       
        <div className="header__menu">
            <div className="header__menu--profile">
                <img className="header__menu--img" src={userIcon} alt="image icon"/>
                <p>Perfil</p>
            </div>
            <ul>
                <li><Link to="/">Cuenta</Link></li>
                <li><Link to="/login">Iniciar Seción</Link></li>

            </ul>
        </div>
    </header>
    )
}

export default Header;