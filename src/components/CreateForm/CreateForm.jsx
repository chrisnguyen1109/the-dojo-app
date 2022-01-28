import { Timestamp } from 'firebase/firestore';
import { useState } from 'react';
import Select from 'react-select';
import { getOnlineUsers } from '../../firebase/firebaseActions';
import useFirebaseRealTime from '../../hooks/useFirebaseRealTime';
import './CreateForm.css';

const categories = [
    { value: 'development', label: 'Development' },
    { value: 'design', label: 'Design' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
];

export default function CreateForm({
    userId,
    loading,
    error,
    setError,
    onCreateProject,
}) {
    const [name, setName] = useState('');
    const [details, setDetails] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [category, setCategory] = useState('');
    const [assignedUsers, setAssignedUsers] = useState([]);

    const { data: allUsers, error: allUsersErr } =
        useFirebaseRealTime(getOnlineUsers);

    const allUsersOptions = allUsers
        ? allUsers
              .filter(user => user.id !== userId)
              .map(user => ({ value: user, label: user.displayName }))
        : [];

    const createProjectHandler = e => {
        e.preventDefault();

        if (loading) return;

        setError(null);

        if (!category) {
            setError(new Error('Please select a project category!'));
            return;
        }

        if (assignedUsers.length === 0) {
            setError(
                new Error('Please assign the project to at least 1 user!')
            );
            return;
        }

        const assignedUsersList = assignedUsers.map(u => {
            const { online: _, ...userData } = u.value;
            return { ...userData };
        });

        const assignedUsersId = assignedUsers.map(u => u.value.id);

        const project = {
            name,
            details,
            dueDate: Timestamp.fromDate(new Date(dueDate)),
            category: category.value,
            assignedUsers: assignedUsersList,
            assignedUsersId,
            comments: [],
        };

        onCreateProject(project);
    };

    return (
        <div className="create-form">
            <h2 className="page-title">Create a new Project</h2>
            <form onSubmit={createProjectHandler}>
                <label>
                    <span>Project name:</span>
                    <input
                        required
                        type="text"
                        onChange={e => setName(e.target.value)}
                        value={name}
                    />
                </label>
                <label>
                    <span>Project Details:</span>
                    <textarea
                        required
                        onChange={e => setDetails(e.target.value)}
                        value={details}
                    ></textarea>
                </label>
                <label>
                    <span>Set due date:</span>
                    <input
                        required
                        type="date"
                        onChange={e => setDueDate(e.target.value)}
                        value={dueDate}
                    />
                </label>
                <label>
                    <span>Project category:</span>
                    <Select
                        onChange={option => setCategory(option)}
                        options={categories}
                    />
                </label>
                <label>
                    <span>Assign to:</span>
                    <Select
                        onChange={option => setAssignedUsers(option)}
                        options={allUsersOptions}
                        isMulti
                    />
                    {allUsersErr && (
                        <p className="error">{allUsersErr.message}</p>
                    )}
                </label>

                <button className="btn">
                    {loading ? 'Loading...' : 'Add Project'}
                </button>
                {error && <p className="error">{error.message}</p>}
            </form>
        </div>
    );
}
