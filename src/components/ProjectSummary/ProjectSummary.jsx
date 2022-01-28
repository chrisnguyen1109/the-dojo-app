import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteProject } from '../../firebase/firebaseActions';
import useFirebaseFetch from '../../hooks/useFirebaseFetch';
import { userAuthSelector } from '../../redux/authSelectors';
import Avatar from '../Avatar/Avatar';

export default function ProjectSummary({ project }) {
    const { uid } = useSelector(userAuthSelector);
    const { loading, error, fetchData } = useFirebaseFetch();
    const navigate = useNavigate();

    const markCompleteHandler = () => {
        if (loading) return;

        fetchData(deleteProject(project.id), () => {
            navigate('/', { replace: true });
        });
    };

    return (
        <div>
            <div className="project-summary">
                <h2 className="page-title">{project.name}</h2>
                <p className="due-date">
                    Project due by {project.dueDate.toDate().toDateString()}
                </p>
                <div className="assigned-user">
                    Assigned by
                    <strong>{project.userCreated.displayName}</strong>
                    <Avatar src={project.userCreated.photoURL} />
                </div>
                <p className="details">{project.details}</p>
                <h4>Project assigned to:</h4>
                <div className="assigned-users">
                    {project.assignedUsers.map(user => (
                        <div key={user.id}>
                            <Avatar src={user.photoURL} />
                        </div>
                    ))}
                </div>
            </div>
            {uid === project.userCreated.id && (
                <>
                    <button className="btn" onClick={markCompleteHandler}>
                        {loading ? 'Loading...' : 'Mark as Complete'}
                    </button>
                    {error && <p className="error">{error.message}</p>}
                </>
            )}
        </div>
    );
}
