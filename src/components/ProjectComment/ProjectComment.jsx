import { formatDistanceToNow } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { updateProjectComment } from '../../firebase/firebaseActions';
import useFirebaseFetch from '../../hooks/useFirebaseFetch';
import { userAuthSelector } from '../../redux/authSelectors';
import Avatar from '../Avatar/Avatar';

export default function ProjectComment({ project }) {
    const [newComment, setNewComment] = useState('');
    const { loading, error, fetchData } = useFirebaseFetch();
    const currentUser = useSelector(userAuthSelector);

    const commentSubmitHandler = e => {
        e.preventDefault();

        if (loading) return;

        const data = {
            id: Date.now(),
            userComment: {
                id: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
            },
            content: newComment,
            createdAt: Timestamp.fromDate(new Date()),
        };

        fetchData(
            updateProjectComment(project.id, [data, ...project.comments]),
            () => {
                setNewComment('');
            }
        );
    };

    return (
        <div className="project-comments">
            <h4>Project Comments</h4>

            <ul>
                {project.comments.length > 0 &&
                    project.comments.map(comment => (
                        <li key={comment.id}>
                            <div className="comment-author">
                                <Avatar src={comment.userComment.photoURL} />
                                <p>{comment.userComment.displayName}</p>
                            </div>
                            <div className="comment-date">
                                <p>
                                    {formatDistanceToNow(
                                        comment.createdAt.toDate(),
                                        { addSuffix: true }
                                    )}
                                </p>
                            </div>
                            <div className="comment-content">
                                <p>{comment.content}</p>
                            </div>
                        </li>
                    ))}
            </ul>

            <form className="add-comment" onSubmit={commentSubmitHandler}>
                <label>
                    <span>Add new comment:</span>
                    <textarea
                        onChange={e => setNewComment(e.target.value)}
                        value={newComment}
                        required
                    ></textarea>
                </label>
                <button className="btn">
                    {loading ? 'Loading...' : 'Add Comment'}
                </button>
                {error && <p className="error">{error.message}</p>}
            </form>
        </div>
    );
}
