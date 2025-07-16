import { useLocalStorageSSR } from './use-local-storage-ssr';

interface User {
  id: string;
  name: string;
  createdAt: string;
}

export function useUserStorage() {
  const [currentUser, setCurrentUser, isCurrentUserLoaded] = useLocalStorageSSR<User | null>('currentUser', null);

  const generateUserId = () => {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const clearCurrentUserData = () => {
    if (!currentUser) return;

    const userKeys = [
      `cashflow_transactions_${currentUser.id}`,
      `cashflow_budgets_${currentUser.id}`,
      `cashflow_financial_goals_${currentUser.id}`,
    ];

    userKeys.forEach(key => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    });
  };

  const createUser = (name: string) => {
    if (currentUser) {
      clearCurrentUserData();
    }

    const newUser: User = {
      id: generateUserId(),
      name,
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(newUser);
    return newUser;
  };

  const switchUser = (userId: string) => {
    console.warn('User switching is not supported in one device, one user mode');
  };

  const deleteUser = (userId: string) => {
    if (currentUser?.id === userId) {
      clearCurrentUserData();
      setCurrentUser(null);
    }
  };

  const getUserStorageKey = (baseKey: string) => {
    return currentUser ? `${baseKey}_${currentUser.id}` : baseKey;
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  return {
    currentUser,
    createUser,
    switchUser,
    deleteUser,
    logoutUser,
    getUserStorageKey,
    isCurrentUserLoaded,
  };
}
