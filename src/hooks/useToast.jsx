import { useState, useCallback } from 'react';

export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 3000);
    }, []);

    const Toast = () => (
        <>
            {toasts.map(toast => (
                <div key={toast.id} className={`toast ${toast.type}`}>
                    {toast.message}
                </div>
            ))}
        </>
    );

    return { showToast, Toast };
};
