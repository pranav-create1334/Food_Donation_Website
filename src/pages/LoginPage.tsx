import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth';
import type { Role } from '../types';
import { homePathForRole } from '../components/ProtectedRoute';

const ROLES: Role[] = ['DONOR', 'VOLUNTEER', 'ADMIN'];

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const roleFromQuery = searchParams.get('role');
  const initialRole = ROLES.includes(roleFromQuery as Role) ? (roleFromQuery as Role) : 'DONOR';
  const [role, setRole] = useState<Role>(initialRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setRole(initialRole);
  }, [initialRole]);

  if (user) {
    return <Navigate to={homePathForRole(user.role)} replace />;
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      let authenticatedRole: Role;
      if (mode === 'signin') {
        const signedInUser = await login(username, password);
        authenticatedRole = signedInUser.role;
      } else {
        const registeredUser = await register(username, password, role);
        authenticatedRole = registeredUser.role;
      }
      navigate(homePathForRole(authenticatedRole), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-layout">
      <div className="panel auth-panel">
        <div className="auth-mode-toggle">
          <button
            type="button"
            className={mode === 'signin' ? 'active' : ''}
            onClick={() => setMode('signin')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={submit} className="form-grid">
          <p className="helper-text">Selected role: {role}</p>
          <label>
            Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {mode === 'signup' && (
            <label>
              Role
              <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
                {ROLES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          )}
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </section>
  );
}
