import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { homePathForRole } from './ProtectedRoute';
import { useAuth } from '../auth';

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  useEffect(() => {
    setAccountMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <header className="site-topbar">
        <Link className="marketing-brand" to={user ? homePathForRole(user.role) : '/'}>
          <span className="brand-badge">H</span>
          <span>HarvestShare</span>
        </Link>

        <nav className="site-nav">
          <a href="/#donations">Donations</a>
          <a href="/#pickups">Pickups</a>
          <a href="/#impact">Impact</a>
        </nav>

        <div className="site-actions">
          <label className="marketing-search">
            <span>Search...</span>
            <input aria-label="Search" />
          </label>

          {!user ? (
            <>
              <Link className="btn btn-primary" to="/login?role=DONOR">
                New Donation
              </Link>
              <div className="account-menu">
                <button
                  type="button"
                  className="account-icon"
                  onClick={() => setAccountMenuOpen((value) => !value)}
                  aria-label="Account options"
                >
                  <span>U</span>
                </button>
                {accountMenuOpen && (
                  <div className="account-dropdown">
                    <Link to="/login?role=DONOR">Donor Login</Link>
                    <Link to="/login?role=VOLUNTEER">Volunteer Login</Link>
                    <Link to="/login?role=ADMIN">Admin Login</Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <span className="user-chip">
                {user.username} ({user.role})
              </span>
              <Link className="btn btn-light" to={homePathForRole(user.role)}>
                Dashboard
              </Link>
              <button type="button" className="link-button" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      </header>

      <main className={`page ${location.pathname === '/' ? 'landing-page' : ''}`}>{children}</main>

      <footer className="site-footer">
        <div className="site-footer-grid">
          <div>
            <h4>HarvestShare</h4>
            <p>Community food donation platform connecting donors, volunteers, and NGOs with secure pickup flow.</p>
          </div>
          <div>
            <h5>Platform</h5>
            <a href="/#donations">Donations</a>
            <a href="/#pickups">Pickup Flow</a>
            <a href="/#impact">Impact</a>
          </div>
          <div>
            <h5>Roles</h5>
            <Link to="/login?role=DONOR">Donor</Link>
            <Link to="/login?role=VOLUNTEER">Volunteer</Link>
            <Link to="/login?role=ADMIN">Admin</Link>
          </div>
          <div>
            <h5>Contact</h5>
            <p>support@harvestshare.org</p>
            <p>+91 98765 43210</p>
          </div>
        </div>
        <p className="copyright">2026 HarvestShare. Reducing waste, one pickup at a time.</p>
      </footer>
    </div>
  );
}

