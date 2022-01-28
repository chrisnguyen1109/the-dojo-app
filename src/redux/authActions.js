import {
    signup,
    signin,
    signout,
    signinProvider,
} from '../firebase/firebaseActions';
import { login, logout } from './authSlice';
import { auth } from '../firebase/config';

const getUerInfor = () => {
    const {
        uid,
        email,
        displayName,
        apiKey,
        photoURL,
        stsTokenManager: { accessToken, refreshToken, expirationTime },
    } = auth.currentUser;

    return {
        uid,
        email,
        displayName,
        photoURL,
        apiKey,
        accessToken,
        refreshToken,
        expirationTime,
    };
};

export const signUpAcion = (signUpFetch, cb, ...userData) => {
    return dispatch => {
        signUpFetch(signup(...userData), () => {
            cb();
            dispatch(login(getUerInfor()));
        });
    };
};

export const signInAcion = (signInFetch, cb, ...userData) => {
    return dispatch => {
        signInFetch(signin(...userData), res => {
            cb(res);

            dispatch(login(getUerInfor()));
        });
    };
};

export const signInProviderAcion = (signInFetch, cb, provider) => {
    return dispatch => {
        signInFetch(signinProvider(provider), res => {
            cb(res);

            dispatch(login(getUerInfor()));
        });
    };
};

export const signOutAction = (signOutFetch, uid) => {
    return dispatch => {
        signOutFetch(signout(uid), () => {
            dispatch(logout());
        });
    };
};
