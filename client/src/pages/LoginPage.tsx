import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';

export function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userStatus = await apiClient.checkUserStatus((e.target as any).email.value);
    
    // navigate('/report');
  };

  return (
    <div className="page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
}
