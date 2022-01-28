import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import templeSvg from '../../assets/temple.svg';
import useFirebaseFetch from '../../hooks/useFirebaseFetch';
import { signOutAction } from '../../redux/authActions';
import { userAuthSelector } from '../../redux/authSelectors';
import './Navbar.css';

export default function Navbar() {
    const { loading, error, fetchData } = useFirebaseFetch();
    const dispatch = useDispatch();
    const user = useSelector(userAuthSelector);

    const logoutHandler = () => {
        if (!user) return;

        if (loading) return;

        dispatch(signOutAction(fetchData, user.uid));
    };

    const activeClass = ({ isActive }) => {
        return isActive ? 'active' : '';
    };

    return (
        <nav className="navbar">
            <ul>
                <li className="logo">
                    <img src={templeSvg} alt="dojo logo" />
                    <Link to="/">The Dojo</Link>
                </li>
                {!user && (
                    <>
                        <li>
                            <NavLink className={activeClass} to="/signin">
                                Login
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className={activeClass} to="/signup">
                                Signup
                            </NavLink>
                        </li>
                    </>
                )}

                {user && (
                    <li>
                        <button className="btn" onClick={logoutHandler}>
                            {loading ? 'Logging out...' : 'Logout'}
                        </button>
                        {error && <div className="error">{error.message}</div>}
                    </li>
                )}
            </ul>
        </nav>
    );
}
