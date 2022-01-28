import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from 'firebase/auth';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    setDoc,
    Timestamp,
    updateDoc,
    where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import db, { auth, storage } from './config';

export const signup = async (email, password, displayName, photo) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    if (!res) {
        throw new Error('Could not complete signup!');
    }

    const storageRef = ref(storage, `avatar/${res.user.uid}/${photo.name}`);

    const img = await uploadBytes(storageRef, photo);

    if (!img) {
        throw new Error('Upload photo error!');
    }

    const imgUrl = await getDownloadURL(img.ref);

    return Promise.all([
        updateProfile(res.user, { displayName, photoURL: imgUrl }),
        setDoc(doc(db, 'users', res.user.uid), {
            email,
            displayName,
            photoURL: imgUrl,
            online: true,
        }),
    ]);
};

export const signin = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);

    if (!res) {
        throw new Error('Could not complete signin!');
    }

    const onlineUser = await getDoc(doc(db, 'users', res.user.uid));

    if (!onlineUser.exists()) {
        throw new Error('Could not find this user!');
    }

    if (onlineUser.data().online) {
        throw new Error('This user already logged in!');
    }

    return updateDoc(doc(db, 'users', res.user.uid), {
        online: true,
    });
};

export const signinProvider = async provider => {
    const res = await signInWithPopup(auth, provider);

    if (!res) {
        throw new Error('Could not complete signup!');
    }

    const onlineUser = await getDoc(doc(db, 'users', res.user.uid));

    if (onlineUser.data()?.online) {
        throw new Error('This user already logged in!');
    }

    return setDoc(doc(db, 'users', res.user.uid), {
        email: res.user.email,
        displayName: res.user.displayName,
        photoURL: res.user.photoURL,
        online: true,
    });
};

export const signout = async uid => {
    await updateDoc(doc(db, 'users', uid), {
        online: false,
    });

    return signOut(auth);
};

export const getOnlineUsers = () => {
    return collection(db, 'users');
};

export const createProject = project => {
    return addDoc(collection(db, 'projects'), {
        ...project,
        createdAt: Timestamp.fromDate(new Date()),
    });
};

export const getFilterProjects = category => {
    if (category === 'all') {
        return query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    }

    if (category === 'mine') {
        return query(
            collection(db, 'projects'),
            where('assignedUsersId', 'array-contains', auth.currentUser.uid),
            orderBy('createdAt', 'desc')
        );
    }

    return query(
        collection(db, 'projects'),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
    );
};

export const getProjectDetail = projectId => {
    return doc(db, 'projects', projectId);
};

export const updateProjectComment = (projectId, comments) => {
    return updateDoc(doc(db, 'projects', projectId), {
        comments,
    });
};

export const deleteProject = projectId => {
    return deleteDoc(doc(db, 'projects', projectId));
};
