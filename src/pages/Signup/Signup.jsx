import { useState } from 'react';
import './Signup.css';
import useFirebaseFetch from '../../hooks/useFirebaseFetch';
import { useDispatch } from 'react-redux';
import { signUpAcion } from '../../redux/authActions';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [photo, setPhoto] = useState(null);
    const [photoError, setPhotoError] = useState('');
    const { loading, error, fetchData } = useFirebaseFetch();
    const dispatch = useDispatch();

    const changePhotoHandler = e => {
        const photoFile = e.target.files[0];

        if (!photoFile || !photoFile.type.includes('image')) {
            setPhotoError('Please select an image!');
            return;
        }

        if (photoFile.size > 100000) {
            setPhotoError('Image file size must be less than 100kb!');
            return;
        }

        setPhotoError('');
        setPhoto(photoFile);
    };

    const handleSubmit = e => {
        e.preventDefault();

        if (loading) return;

        dispatch(
            signUpAcion(
                fetchData,
                () => {
                    setEmail('');
                    setPassword('');
                    setDisplayName('');
                    setPhoto(null);
                },
                email,
                password,
                displayName,
                photo
            )
        );
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <h2>Sign up</h2>
            <label>
                <span>Email:</span>
                <input
                    required
                    type="email"
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="new-password"
                    value={email}
                />
            </label>
            <label>
                <span>Password:</span>
                <input
                    required
                    type="password"
                    minLength="6"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                />
            </label>
            <label>
                <span>Display name:</span>
                <input
                    required
                    type="text"
                    onChange={e => setDisplayName(e.target.value)}
                    value={displayName}
                />
            </label>
            <label>
                <span>Profile thumbnail:</span>
                <input
                    className="file-input"
                    required
                    type="file"
                    onChange={changePhotoHandler}
                />
                {photoError && <div className="error">{photoError}</div>}
            </label>
            <button className="btn">
                {loading ? 'Loading...' : 'Sign up'}
            </button>
            {error && <div className="error">{error.message}</div>}
        </form>
    );
}
