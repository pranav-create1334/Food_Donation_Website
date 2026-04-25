import { useEffect, useState } from 'react';
import { useAuth } from '../auth';
import DonationStatusPill from '../components/DonationStatusPill';
import { getDonations, updateDonationStatus } from '../lib/api';
import { donationImageOrFallback } from '../lib/media';
import type { Donation } from '../types';

export default function VolunteerDashboard() {
  const { token, user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [passcodes, setPasscodes] = useState<Record<number, string>>({});
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(true);

  const refresh = async () => {
    if (!token) {
      return;
    }
    setFetching(true);
    try {
      const data = await getDonations(token);
      setDonations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load volunteer queue');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [token]);

  const markOnTheWay = async (donationId: number) => {
    if (!token) {
      return;
    }
    setLoadingId(donationId);
    setError('');
    try {
      await updateDonationStatus(donationId, { status: 'ON_THE_WAY' }, token);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update status');
    } finally {
      setLoadingId(null);
    }
  };

  const markReceived = async (donationId: number) => {
    if (!token) {
      return;
    }
    setLoadingId(donationId);
    setError('');
    try {
      await updateDonationStatus(donationId, { status: 'RECEIVED', passcode: passcodes[donationId] ?? '' }, token);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to verify passcode');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Volunteer Pickup Queue</h2>
        <button type="button" className="btn btn-light" onClick={refresh}>
          Refresh
        </button>
      </div>
      <p className="helper-text">Signed in as {user?.username}. Move donations from requested to received using donor passcode.</p>
      {error && <p className="error-text">{error}</p>}
      {fetching ? (
        <p>Loading queue...</p>
      ) : donations.length === 0 ? (
        <p>No active pickups right now.</p>
      ) : (
        <div className="list">
          {donations.map((donation) => {
            const canReceive =
              donation.status === 'ON_THE_WAY' &&
              (donation.assignedVolunteerId === null || donation.assignedVolunteerId === user?.id);
            return (
              <article key={donation.id} className="list-item volunteer-item">
                <img
                  className="donation-thumb"
                  src={donationImageOrFallback(donation.imageUrl)}
                  alt="Donation food"
                />
                <div>
                  <h3>{donation.pickupAddress}</h3>
                  <p>{donation.foodDescription || 'No food details provided.'}</p>
                  <small>Donor: {donation.donorUsername}</small>
                </div>
                <div className="action-column">
                  <DonationStatusPill status={donation.status} />
                  {donation.status === 'REQUESTED' && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => markOnTheWay(donation.id)}
                      disabled={loadingId === donation.id}
                    >
                      {loadingId === donation.id ? 'Updating...' : 'On The Way'}
                    </button>
                  )}
                  {canReceive && (
                    <div className="inline-control">
                      <input
                        placeholder="Passcode"
                        value={passcodes[donation.id] ?? ''}
                        onChange={(e) => setPasscodes({ ...passcodes, [donation.id]: e.target.value })}
                      />
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => markReceived(donation.id)}
                        disabled={loadingId === donation.id}
                      >
                        {loadingId === donation.id ? 'Verifying...' : 'Received'}
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
