import { useState } from 'react';
import ProjectFilter from '../../components/ProjectFilter/ProjectFilter';
import ProjectList from '../../components/ProjectList/ProjectList';
import { getFilterProjects } from '../../firebase/firebaseActions';
import useFirebaseRealTime from '../../hooks/useFirebaseRealTime';
import './Dashboard.css';

export default function Dashboard() {
    const [filter, setFilter] = useState('all');
    const {
        loading,
        data: filterProject,
        error,
    } = useFirebaseRealTime(() => getFilterProjects(filter), filter);

    const changeFilterHandler = selectedFilter => setFilter(selectedFilter);

    return (
        <div>
            <h2 className="page-title">Dashboard</h2>
            <ProjectFilter onChangeFilter={changeFilterHandler} />
            {loading && <p>Loading...</p>}
            {error && <p className="box-error">{error.message}</p>}
            {!error && filterProject && (
                <ProjectList projects={filterProject} />
            )}
        </div>
    );
}
