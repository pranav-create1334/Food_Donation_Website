import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth';
import DonationStatusPill from '../components/DonationStatusPill';
import { getDonations } from '../lib/api';
import { donationImageOrFallback } from '../lib/media';
import type { Donation } from '../types';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const refresh = async () => {
    if (!token) {
      return;
    }
    setFetching(true);
    try {
      const data = await getDonations(token);
      setDonations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [token]);

  const totals = useMemo(() => {
    return {
      all: donations.length,
      requested: donations.filter((item) => item.status === 'REQUESTED').length,
      transit: donations.filter((item) => item.status === 'ON_THE_WAY').length,
      received: donations.filter((item) => item.status === 'RECEIVED').length,
    };
  }, [donations]);

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Admin Monitoring Dashboard</h2>
        <button type="button" className="btn btn-light" onClick={refresh}>
          Refresh
        </button>
      </div>
      {error && <p className="error-text">{error}</p>}
      <div className="stats-row">
        <div className="stat-box">
          <strong>{totals.all}</strong>
          <span>Total</span>
        </div>
        <div className="stat-box">
          <strong>{totals.requested}</strong>
          <span>Requested</span>
        </div>
        <div className="stat-box">
          <strong>{totals.transit}</strong>
          <span>On The Way</span>
        </div>
        <div className="stat-box">
          <strong>{totals.received}</strong>
          <span>Received</span>
        </div>
      </div>
      {fetching ? (
        <p>Loading donations...</p>
      ) : donations.length === 0 ? (
        <p>No donations found.</p>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Donor</th>
                <th>Volunteer</th>
                <th>Pickup Address</th>
                <th>City</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation.id}>
                  <td>{donation.id}</td>
                  <td>
                    <img
                      className="table-thumb"
                      src={donationImageOrFallback(donation.imageUrl)}
                      alt="Donation"
                    />
                  </td>
                  <td>{donation.donorUsername}</td>
                  <td>{donation.assignedVolunteerUsername ?? '-'}</td>
                  <td>{donation.pickupAddress}</td>
                  <td>{donation.city || '-'}</td>
                  <td>{donation.contactNumber || '-'}</td>
                  <td>
                    <DonationStatusPill status={donation.status} />
                  </td>
                  <td>{new Date(donation.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
