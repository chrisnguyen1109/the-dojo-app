import { onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const useDocumentRealTime = (document, ...conditions) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        setLoading(true);

        const unsub = onSnapshot(
            document(),
            res => {
                if (!res.exists()) {
                    setError(new Error('No project found!'));
                } else {
                    setData({ id: res.id, ...res.data() });
                }

                setLoading(false);
            },
            err => {
                console.log(err);
                setError(new Error('Could not fetch the data!'));
                setLoading(false);
            }
        );

        return () => unsub();
    }, [...conditions]);

    return { loading, data, error };
};

export default useDocumentRealTime;
