import { useState } from 'react';
import { useParams } from 'react-router-dom';
import ProjectComment from '../../components/ProjectComment/ProjectComment';
import ProjectSummary from '../../components/ProjectSummary/ProjectSummary';
import { getProjectDetail } from '../../firebase/firebaseActions';
import useDocumentRealTime from '../../hooks/useDocumentRealTime';
import './ProjectDetail.css';

export default function ProjectDetail() {
    const { projectId } = useParams();
    const {
        loading,
        data: project,
        error,
    } = useDocumentRealTime(() => getProjectDetail(projectId));

    if (loading) return <div>Loading...</div>;

    if (error) return <div className="box-error">{error.message}</div>;

    return (
        <div className="project-details">
            {project && <ProjectSummary project={project} />}
            {project && <ProjectComment project={project} />}
        </div>
    );
}
