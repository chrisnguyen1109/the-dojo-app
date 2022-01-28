import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../Avatar/Avatar';

export default function ProjectItem({ project }) {
    return (
        <Link to={`/project/${project.id}`}>
            <h4>{project.name}</h4>
            <p>Due by {project.dueDate.toDate().toDateString()}</p>
            <div className="assigned-to">
                <p>
                    <strong>Assigned to:</strong>
                </p>
                <ul>
                    {project.assignedUsers.map(user => (
                        <li key={user.photoURL}>
                            <Avatar src={user.photoURL} />
                        </li>
                    ))}
                </ul>
            </div>
        </Link>
    );
}
