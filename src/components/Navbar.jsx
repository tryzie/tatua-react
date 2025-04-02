import { NavLink } from 'react-router-dom';
import logo from '../images/tatua-logo.svg';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="logo">
                <img src={logo} alt="Tatua Logo" />
                <span>Tatua</span>
            </div>
            <ul className="nav-links">
                <li>
                    <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
                        Raise Ticket
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/tickets" className={({ isActive }) => (isActive ? 'active' : '')}>
                        Tickets List
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;