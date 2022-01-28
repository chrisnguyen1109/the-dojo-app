import { useState } from 'react';

const filterList = [
    'all',
    'mine',
    'development',
    'design',
    'marketing',
    'sales',
];

export default function ProjectFilter({ onChangeFilter }) {
    const [currentFilter, setCurrentFilter] = useState('all');

    const changeFilterHandler = selectedFilter => {
        setCurrentFilter(selectedFilter);
        onChangeFilter(selectedFilter);
    };

    return (
        <div className="project-filter">
            <nav>
                <p>Filter by: </p>
                {filterList.map(filter => (
                    <button
                        key={filter}
                        onClick={() => changeFilterHandler(filter)}
                        className={currentFilter === filter ? 'active' : ''}
                    >
                        {filter}
                    </button>
                ))}
            </nav>
        </div>
    );
}
