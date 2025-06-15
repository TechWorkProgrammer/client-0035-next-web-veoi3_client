import React, {createContext, ReactNode, useContext, useState} from 'react';
import Alert from '@/components/common/Alert';

export interface AlertInterface {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    visible: boolean;
}

interface AlertContextType {
    alert: (title: string, message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
    removeAlert: (id: string) => void;
    alerts: AlertInterface[];
}

export const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [alerts, setAlerts] = useState<AlertInterface[]>([]);

    const alert = (
        title: string = 'Opps...',
        message: string,
        type: 'success' | 'error' | 'info' | 'warning' = 'info'
    ) => {
        const id = Date.now().toString();
        setAlerts((prev) => [...prev, {id, title, message, type, visible: true}]);

        setTimeout(() => {
            setAlerts((prev) =>
                prev.map((a) => (a.id === id ? {...a, visible: false} : a))
            );
            setTimeout(() => {
                setAlerts((prev) => prev.filter((a) => a.id !== id));
            }, 500);
        }, 5000);
    };

    const removeAlert = (id: string) => {
        setAlerts((prev) =>
            prev.map((a) => (a.id === id ? {...a, visible: false} : a))
        );
        setTimeout(() => {
            setAlerts((prev) => prev.filter((a) => a.id !== id));
        }, 500);
    };

    return (
        <AlertContext.Provider value={{alert, removeAlert, alerts}}>
            {children}
            <Alert alerts={alerts} removeAlert={removeAlert}/>
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context.alert;
};
