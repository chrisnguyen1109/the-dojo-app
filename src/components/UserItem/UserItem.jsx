import Avatar from '../Avatar/Avatar';

export default function UserItem({ user }) {
    return (
        <div className="user-list-item">
            {user.online && (
                <span className="user-item user-item--online"></span>
            )}
            {!user.online && (
                <span className="user-item user-item--offline"></span>
            )}
            <span title={user.displayName} className="user-display-name">
                {user.displayName}
            </span>
            <Avatar src={user.photoURL} />
        </div>
    );
}
