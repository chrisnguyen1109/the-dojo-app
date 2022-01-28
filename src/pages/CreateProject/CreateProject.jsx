import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CreateForm from '../../components/CreateForm/CreateForm';
import { createProject } from '../../firebase/firebaseActions';
import useFirebaseFetch from '../../hooks/useFirebaseFetch';
import { userAuthSelector } from '../../redux/authSelectors';

export default function CreateProject() {
    const { loading, error, fetchData, setError } = useFirebaseFetch();
    const currentUser = useSelector(userAuthSelector);
    const navigate = useNavigate();

    const userCreated = {
        id: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
    };

    const createProjectHandler = project => {
        fetchData(createProject({ ...project, userCreated }), res => {
            if (!res.id) {
                setError(new Error('Some thing went wrong!'));
                return;
            }
            toast.success('Create project successfully 😊');
            navigate('/', { replace: true });
        });
    };

    return (
        <CreateForm
            userId={currentUser.uid}
            loading={loading}
            error={error}
            setError={setError}
            onCreateProject={createProjectHandler}
        />
    );
}
