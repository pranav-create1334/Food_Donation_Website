import { Link } from 'react-router-dom';

const FEATURED_DONATIONS = [
  {
    title: 'Fresh Meals Pack',
    area: 'Indiranagar, Bengaluru',
    meals: 'Serves 25',
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Bakery Evening Batch',
    area: 'Koramangala, Bengaluru',
    meals: 'Serves 18',
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Vegetable & Rice Bowls',
    area: 'HSR Layout, Bengaluru',
    meals: 'Serves 30',
    image:
      'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1000&q=80',
  },
];

const IMPACT_STATS = [
  { label: 'Meals Shared', value: '2' },
  { label: 'Partner NGOs', value: '0' },
  { label: 'Volunteer Pickups', value: '1' },
  { label: 'Cities Active', value: '1' },
];

const PROCESS_STEPS = [
  {
    title: 'Donor Posts Food',
    text: 'Upload details, pickup location, and one-time passcode in under 1 minute.',
  },
  {
    title: 'Volunteer Claims Pickup',
    text: 'Nearby volunteers move the donation to On The Way and coordinate collection.',
  },
  {
    title: 'Passcode Verification',
    text: 'At handoff, passcode confirmation ensures secure donation closure.',
  },
];

export default function Landing() {
  return (
    <section className="landing-extended">
      <div className="landing">
        <div className="hero-left">
          <div className="live-pill">LIVE: 24 ACTIVE DONATIONS NEARBY</div>
          <h1>
            Ending Waste,
            <br />
            <span>Sharing Surplus.</span>
          </h1>
          <p>
            Annapurna connects fresh surplus food to those who need it most. Donors, volunteers, and NGOs work
            together in one secure flow.
          </p>
          <div className="cta-row">
            <Link to="/login?role=DONOR" className="btn btn-primary btn-large">
              New Donation
            </Link>
            <Link to="/login?role=VOLUNTEER" className="btn btn-light btn-large">
              Browse Feed
            </Link>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-image">
            <img
              src="https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Food donation box"
              onError={(event) => {
                event.currentTarget.src =
                  'https://images.unsplash.com/photo-1488459711635-0c00488aeaf3?auto=format&fit=crop&w=1200&q=80';
              }}
            />
          </div>
          <div className="transit-card">
            <small>ORDER #8821</small>
            <strong>Meals in Transit to NGO</strong>
          </div>
        </div>
      </div>

      <section id="impact" className="impact-strip panel">
        {IMPACT_STATS.map((stat) => (
          <div className="impact-item" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section id="donations" className="content-band">
        <div className="section-head">
          <h2>Active Food Donations</h2>
          <p>Real donation-style cards with clear visual details for pickup planning.</p>
        </div>
        <div className="featured-grid">
          {FEATURED_DONATIONS.map((card) => (
            <article className="featured-card" key={card.title}>
              <img src={card.image} alt={card.title} />
              <div className="featured-body">
                <h3>{card.title}</h3>
                <p>{card.area}</p>
                <small>{card.meals}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="pickups" className="content-band split-band">
        <div className="process-panel panel">
          <h2>How Pickup Flow Works</h2>
          <div className="process-list">
            {PROCESS_STEPS.map((step, index) => (
              <article key={step.title} className="process-item">
                <span>{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="secondary-image panel">
          <img
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80"
            alt="Volunteer delivering donated food"
          />
        </div>
      </section>

      <section className="content-band cta-band panel">
        <h2>Ready to contribute today?</h2>
        <p>Choose your role and continue with the same secure workflow we already configured in this app.</p>
        <div className="cta-row">
          <Link to="/login?role=DONOR" className="btn btn-primary">
            Donor Login
          </Link>
          <Link to="/login?role=VOLUNTEER" className="btn btn-light">
            Volunteer Login
          </Link>
          <Link to="/login?role=ADMIN" className="btn btn-light">
            Admin Login
          </Link>
        </div>
      </section>
    </section>
  );
}
