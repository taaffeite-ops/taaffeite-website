import React from 'react';
import { Link } from 'react-router-dom';

export const Services: React.FC = () => {
  const serviceCategories = [
    {
      id: 'planning',
      title: 'Wedding Planning & Coordination',
      items: [
        'End-to-end wedding planning',
        'Wedding day coordination',
        'Timeline & schedule management',
        'Family coordination',
        'Vendor management',
        'Guest flow management'
      ]
    },
    {
      id: 'decor',
      title: 'Décor & Styling',
      items: [
        'Wedding décor conceptualization',
        'Stage & mandap styling',
        'Floral coordination',
        'Entrance & venue styling',
        'Lighting & ambience planning',
        'Table setups & styling details'
      ]
    },
    {
      id: 'pre-wedding',
      title: 'Pre-Wedding Celebrations',
      items: [
        'Mehendi planning & styling',
        'Haldi setup & coordination',
        'Engagement ceremonies',
        'Sangeet planning',
        'Bridal shower & intimate events'
      ]
    },
    {
      id: 'hospitality',
      title: 'Hospitality & Guest Experience',
      items: [
        'Guest management',
        'Welcome experiences',
        'Room hampers & gifting',
        'RSVP coordination',
        'Hospitality desk management',
        'Artist & guest assistance'
      ]
    },
    {
      id: 'production',
      title: 'Entertainment & Production',
      items: [
        'Artist coordination',
        'Sound & light coordination',
        'DJ & entertainment management',
        'Dance floor & performance setup',
        'Technical production support'
      ]
    },
    {
      id: 'logistics',
      title: 'Logistics & Execution',
      items: [
        'Venue layout planning',
        'Seating plans',
        'Entry & movement management',
        'Transportation coordination',
        'On-ground execution team',
        'Vendor supervision'
      ]
    },
    {
      id: 'essentials',
      title: 'Wedding Essentials',
      items: [
        'Invitations & stationery coordination',
        'Bridal entry concepts',
        'Couple styling coordination',
        'Wedding favors & gifting',
        'Ritual setup coordination'
      ]
    },
    {
      id: 'bespoke',
      title: 'Bespoke Celebrations',
      items: [
        'Intimate weddings',
        'Destination weddings',
        'Luxury receptions',
        'Private celebrations',
        'Birthday & milestone events',
        'Custom-designed event experiences'
      ]
    }
  ];

  return (
    <div className="services-page-container">
      {/* PAGE BANNER */}
      <section className="page-banner">
        <h1>Our Services</h1>
        <div className="page-banner-diamond"></div>
        <p>Expertly curated, beautifully executed celebrations</p>
      </section>

      {/* SERVICES CONTENT SECTION */}
      <section className="services-list-section">
        <div className="services-grid-list">
          {serviceCategories.map((category) => (
            <div key={category.id} className="service-card reveal-on-scroll" id={category.id}>
              <h3>{category.title}</h3>
              <ul className="service-items-list">
                {category.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Disclaimers / Footnotes */}
        <div className="catering-disclaimer reveal-on-scroll">
          <p>
            <strong>Note on Catering:</strong> Taaffeite currently does not undertake catering services directly, but coordinates seamlessly with premium catering partners chosen by the client to maintain absolute culinary alignment and event flow.
          </p>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="cta-section reveal-on-scroll">
        <div className="cta-container">
          <h2 className="cta-title">Let's craft your milestone event.</h2>
          <Link to="/enquire" className="btn-luxury">Enquire with us</Link>
        </div>
      </section>
    </div>
  );
};
