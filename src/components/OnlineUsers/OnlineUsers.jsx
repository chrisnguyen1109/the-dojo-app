import useFirebaseRealTime from '../../hooks/useFirebaseRealTime';
import './OnlineUsers.css';
import { getOnlineUsers } from '../../firebase/firebaseActions';
import UserItem from '../UserItem/UserItem';
import { useSelector } from 'react-redux';
import { userAuthSelector } from '../../redux/authSelectors';

export default function OnlineUsers() {
    const {
        loading,
        data: availableUsers,
        error,
    } = useFirebaseRealTime(getOnlineUsers);

    const { uid } = useSelector(userAuthSelector);

    const usersExceptMeList = () => {
        return availableUsers
            .filter(user => user.id !== uid)
            .map(user => <UserItem key={user.id} user={user} />);
    };

    return (
        <div className="user-list">
            <h2>All Users</h2>
            {loading && <p>Loading users...</p>}
            {error && <p className="error">{error.message}</p>}
            {availableUsers && usersExceptMeList()}
            {availableUsers && availableUsers.length === 1 && (
                <p>No users available!</p>
            )}
        </div>
    );
}
