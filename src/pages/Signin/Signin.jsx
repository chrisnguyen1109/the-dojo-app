import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { facebookProvider, googleProvider } from '../../firebase/config';
import useFirebaseFetch from '../../hooks/useFirebaseFetch';
import { signInAcion, signInProviderAcion } from '../../redux/authActions';

export default function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loading, error, fetchData } = useFirebaseFetch();
    const {
        loading: loadingFb,
        error: errorFb,
        fetchData: fetchDataFb,
        setError: setErrorFb,
    } = useFirebaseFetch();
    const {
        loading: loadingGg,
        error: errorGg,
        fetchData: fetchDataGg,
        setError: setErrorGg,
    } = useFirebaseFetch();
    const dispatch = useDispatch();

    const loginSubmitHandler = e => {
        e.preventDefault();

        if (loading) return;

        dispatch(
            signInAcion(
                fetchData,
                () => {
                    setEmail('');
                    setPassword('');
                },
                email,
                password
            )
        );
    };

    const handleLoginGg = () => {
        if (loadingGg) return;

        dispatch(
            signInProviderAcion(
                fetchDataGg,
                res => {
                    if (!res) {
                        setErrorGg(
                            new Error('Could not complete signin with google!')
                        );
                        return;
                    }
                },
                googleProvider
            )
        );
    };

    const handleLoginFb = () => {
        if (loading) return;

        dispatch(
            signInProviderAcion(
                fetchDataFb,
                res => {
                    if (!res) {
                        setErrorFb(
                            new Error('Could not complete signin with google!')
                        );
                        return;
                    }
                },
                facebookProvider
            )
        );
    };

    return (
        <form onSubmit={loginSubmitHandler} className="auth-form">
            <h2>Sign in</h2>
            <label>
                <span>Email:</span>
                <input
                    required
                    type="email"
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                    autoComplete="new-password"
                />
            </label>
            <label>
                <span>Password:</span>
                <input
                    required
                    type="password"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                />
            </label>
            <button className="btn">
                {loading ? 'Loading...' : 'Sign in'}
            </button>
            {error && <div className="error">{error.message}</div>}
            <button
                className="btn btn--fb"
                type="button"
                onClick={handleLoginFb}
            >
                {loadingFb ? 'Loading' : 'Sign in with facebook'}
            </button>
            {errorFb && <p className="text-error">{errorFb.message}</p>}
            <button
                className="btn btn--gg"
                type="button"
                onClick={handleLoginGg}
            >
                {loadingGg ? 'Loading' : 'Sign in with google'}
            </button>
            {errorGg && <p className="text-error">{errorGg.message}</p>}
        </form>
    );
}
