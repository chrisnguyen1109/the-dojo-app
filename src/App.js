import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import { auth } from './firebase/config';
import Dashboard from './pages/Dashboard/Dashboard';
import Signin from './pages/Signin/Signin';
import Signup from './pages/Signup/Signup';
import { authSelector } from './redux/authSelectors';
import { login } from './redux/authSlice';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Sidebar from './components/Sidebar/Sidebar';
import CreateProject from './pages/CreateProject/CreateProject';
import OnlineUsers from './components/OnlineUsers/OnlineUsers';
import ProjectDetail from './pages/ProjectDetail/ProjectDetail';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const { currentUser, isAuthReady } = useSelector(authSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => {
            let loginUser = null;

            if (user) {
                loginUser = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    apiKey: user.apiKey,
                    accessToken: user.stsTokenManager.accessToken,
                    refreshToken: user.stsTokenManager.refreshToken,
                    expirationTime: user.stsTokenManager.expirationTime,
                };
            }

            dispatch(login(loginUser));

            unsub();
        });
    }, []);

    return (
        <div className="App">
            {isAuthReady && (
                <>
                    <ToastContainer />
                    {currentUser && <Sidebar />}
                    <div className="container">
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<PrivateRoute />}>
                                <Route path="/" element={<Dashboard />} />
                            </Route>
                            <Route path="/create" element={<PrivateRoute />}>
                                <Route
                                    path="/create"
                                    element={<CreateProject />}
                                />
                            </Route>
                            <Route
                                path="/project/:projectId"
                                element={<PrivateRoute />}
                            >
                                <Route
                                    path="/project/:projectId"
                                    element={<ProjectDetail />}
                                />
                            </Route>

                            <Route
                                path="/signin"
                                element={
                                    currentUser ? (
                                        <Navigate to="/" />
                                    ) : (
                                        <Signin />
                                    )
                                }
                            />
                            <Route
                                path="/signup"
                                element={
                                    currentUser ? (
                                        <Navigate to="/" />
                                    ) : (
                                        <Signup />
                                    )
                                }
                            />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </div>
                    {currentUser && <OnlineUsers />}
                </>
            )}
        </div>
    );
}

export default App;
