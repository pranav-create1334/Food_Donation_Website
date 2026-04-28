import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../auth';
import DonationStatusPill from '../components/DonationStatusPill';
import { createDonation, getDonations } from '../lib/api';
import { donationImageOrFallback } from '../lib/media';
import type { CreateDonationPayload, Donation } from '../types';

const MAX_UPLOAD_SIZE_BYTES = 2 * 1024 * 1024;

function generatePasscode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

const EMPTY_FORM: CreateDonationPayload = {
  pickupAddress: '',
  city: '',
  contactNumber: '',
  foodDescription: '',
  imageUrl: '',
  passcode: generatePasscode(),
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Unable to read selected image'));
    reader.readAsDataURL(file);
  });
}

export default function DonorDashboard() {
  const { token } = useAuth();
  const [form, setForm] = useState<CreateDonationPayload>(EMPTY_FORM);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageName, setSelectedImageName] = useState('');
  const [fileInputKey, setFileInputKey] = useState(0);

  const refresh = async () => {
    if (!token) {
      return;
    }
    setFetching(true);
    try {
      const data = await getDonations(token);
      setDonations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load donations');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [token]);

  const handleImageSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedImageName('');
      setForm((prev) => ({ ...prev, imageUrl: '' }));
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      setSelectedImageName('');
      setForm((prev) => ({ ...prev, imageUrl: '' }));
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      setError('Image is too large. Please upload up to 2MB');
      setSelectedImageName('');
      setForm((prev) => ({ ...prev, imageUrl: '' }));
      return;
    }

    setError('');
    setSelectedImageName(file.name);
    try {
      const imageDataUrl = await fileToDataUrl(file);
      setForm((prev) => ({ ...prev, imageUrl: imageDataUrl }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
      setSelectedImageName('');
      setForm((prev) => ({ ...prev, imageUrl: '' }));
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      return;
    }
    if (!form.imageUrl) {
      setError('Food image is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Trim all string fields before submitting
      const trimmedForm = {
        pickupAddress: form.pickupAddress.trim(),
        city: form.city.trim(),
        contactNumber: form.contactNumber.trim(),
        foodDescription: form.foodDescription.trim(),
        imageUrl: form.imageUrl,
        passcode: form.passcode.trim(),
      };
      await createDonation(trimmedForm, token);
      setForm({
        pickupAddress: '',
        city: '',
        contactNumber: '',
        foodDescription: '',
        imageUrl: '',
        passcode: generatePasscode(),
      });
      setSelectedImageName('');
      setFileInputKey((prev) => prev + 1);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create donation');
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const requested = donations.filter((item) => item.status === 'REQUESTED').length;
    const transit = donations.filter((item) => item.status === 'ON_THE_WAY').length;
    const received = donations.filter((item) => item.status === 'RECEIVED').length;
    return { requested, transit, received };
  }, [donations]);

  return (
    <section className="dashboard-grid donor-grid">
      <div className="panel">
        <h2>Create Donation</h2>
        <form className="form-grid" onSubmit={submit}>
          <label>
            Pickup Address
            <input
              value={form.pickupAddress}
              onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
              required
            />
          </label>

          <label>
            City
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="e.g. Pune"
              required
            />
          </label>

          <label>
            Contact Number
            <input
              type="tel"
              value={form.contactNumber}
              onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
              placeholder="e.g. 9876543210"
              pattern="[+]?[0-9]{7,15}"
              required
            />
          </label>

          <label>
            Food Details
            <textarea
              value={form.foodDescription}
              onChange={(e) => setForm({ ...form, foodDescription: e.target.value })}
              rows={3}
              required
            />
          </label>

          <label>
            Food Image
            <input
              key={fileInputKey}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              required
            />
          </label>
          {selectedImageName && <p className="helper-text">Selected image: {selectedImageName}</p>}
          {form.imageUrl && (
            <img className="upload-preview" src={form.imageUrl} alt="Selected donation preview" />
          )}

          <label>
            Passcode
            <div className="inline-control">
              <input
                value={form.passcode}
                onChange={(e) => setForm({ ...form, passcode: e.target.value.trim() })}
                pattern="[0-9]{4,8}"
                required
              />
              <button
                type="button"
                className="btn btn-light"
                onClick={() => setForm({ ...form, passcode: generatePasscode() })}
              >
                Generate
              </button>
            </div>
          </label>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Donation'}
          </button>
        </form>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>My Donations</h2>
          <button type="button" className="btn btn-light" onClick={refresh}>
            Refresh
          </button>
        </div>
        <div className="stats-row">
          <div className="stat-box">
            <strong>{stats.requested}</strong>
            <span>Requested</span>
          </div>
          <div className="stat-box">
            <strong>{stats.transit}</strong>
            <span>On The Way</span>
          </div>
          <div className="stat-box">
            <strong>{stats.received}</strong>
            <span>Received</span>
          </div>
        </div>
        {fetching ? (
          <p>Loading donations...</p>
        ) : donations.length === 0 ? (
          <p>No donations yet.</p>
        ) : (
          <div className="list">
            {donations.map((donation) => (
              <article key={donation.id} className="list-item">
                <img
                  className="donation-thumb"
                  src={donationImageOrFallback(donation.imageUrl)}
                  alt="Donation food"
                />
                <div>
                  <h3>{donation.pickupAddress}</h3>
                  <small>City: {donation.city || '-'}</small>
                  <p>{donation.foodDescription || 'No food details provided.'}</p>
                  <small>Contact: {donation.contactNumber || '-'}</small>
                  <small>Created: {new Date(donation.createdAt).toLocaleString()}</small>
                </div>
                <DonationStatusPill status={donation.status} />
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
