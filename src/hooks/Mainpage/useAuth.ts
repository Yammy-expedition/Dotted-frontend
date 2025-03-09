export default function useAuth() {
  const isLoggedIn = () => {
    return !!localStorage.getItem('accessToken');
  };

  return { isLoggedIn };
}
