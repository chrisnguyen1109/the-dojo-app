import ProjectItem from '../ProjectItem/ProjectItem';
import './ProjectList.css';

export default function ProjectList({ projects }) {
    if (projects.length === 0) {
        return <p className="box-notify">No projects yet!</p>;
    }

    return (
        <div className="project-list">
            {projects.map(project => (
                <ProjectItem key={project.id} project={project} />
            ))}
        </div>
    );
}
