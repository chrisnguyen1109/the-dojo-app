import './Sidebar.css';
import Avatar from '../Avatar/Avatar';
import { useSelector } from 'react-redux';
import { userAuthSelector } from '../../redux/authSelectors';
import { NavLink } from 'react-router-dom';
import dashboardIconSvg from '../../assets/dashboard_icon.svg';
import addIconSvg from '../../assets/add_icon.svg';

export default function Sidebar() {
    const user = useSelector(userAuthSelector);

    const activeClass = ({ isActive }) => {
        return isActive ? 'active' : '';
    };

    return (
        <div className="sidebar">
            <div className="sidebar-content">
                <div className="user">
                    <Avatar src={user.photoURL} />
                    <p>Hey {user.displayName}</p>
                </div>
                <nav className="links">
                    <ul>
                        <li>
                            <NavLink className={activeClass} to="/">
                                <img
                                    src={dashboardIconSvg}
                                    alt="dashboard icon"
                                />
                                <span>Dashboard</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className={activeClass} to="/create">
                                <img src={addIconSvg} alt="add project icon" />
                                <span>New Project</span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}
