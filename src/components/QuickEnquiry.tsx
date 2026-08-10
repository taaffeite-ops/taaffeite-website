import React, { useState } from 'react';
import { useRevealAnimation } from '../hooks/useRevealAnimation';

export const QuickEnquiry = React.memo(React.forwardRef<HTMLElement, {}>((_, ref) => {
  useRevealAnimation();

  // Quick Enquiry Form States
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [enquiryPhoneFocused, setEnquiryPhoneFocused] = useState(false);
  const [enquiryError, setEnquiryError] = useState<string | null>(null);
  const [enquiryData, setEnquiryData] = useState({
    fullName: '',
    email: '',
    phone: '',
    proposedDate: '',
    celebrationType: 'Wedding Planning',
    guestCount: '',
    location: ''
  });
  const [enquiryOtherDetail, setEnquiryOtherDetail] = useState('');

  const handleEnquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const keyMap: Record<string, string> = {
      'quick-name': 'fullName',
      'quick-email': 'email',
      'quick-phone': 'phone',
      'quick-date': 'proposedDate',
      'quick-type': 'celebrationType',
      'quick-guests': 'guestCount',
      'quick-location': 'location'
    };

    const field = keyMap[id];
    if (field) {
      if (field === 'phone') {
        let digits = value.replace(/\D/g, '');
        if (digits.length === 12 && digits.startsWith('91')) {
          digits = digits.slice(2);
        } else if (digits.length === 11 && digits.startsWith('0')) {
          digits = digits.slice(1);
        }
        digits = digits.slice(0, 10);
        setEnquiryData(prev => ({ ...prev, [field]: digits }));
      } else {
        setEnquiryData(prev => ({ ...prev, [field]: value }));
      }
    }
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnquirySubmitting(true);
    setEnquiryError(null);

    const { fullName, email, phone, proposedDate, celebrationType, guestCount, location } = enquiryData;
    if (!fullName || !email || !phone || !proposedDate || !celebrationType || !guestCount || !location) {
      setEnquiryError('Please fill in all required fields.');
      setEnquirySubmitting(false);
      return;
    }

    if (celebrationType === 'Other' && !enquiryOtherDetail.trim()) {
      setEnquiryError('Please specify your celebration type.');
      setEnquirySubmitting(false);
      return;
    }

    if (phone.length !== 10) {
      setEnquiryError('Please enter a valid 10-digit phone number.');
      setEnquirySubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/enquire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName,
          email,
          phone: `+91 ${phone}`,
          proposedDate,
          celebrationType: celebrationType === 'Other' ? `Other: ${enquiryOtherDetail}` : celebrationType,
          guestCount: Number(guestCount),
          location
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong. Please try again.');
      }

      setEnquirySubmitted(true);
    } catch (err: any) {
      console.error('Error submitting enquiry form:', err);
      setEnquiryError(err.message || 'Failed to submit form. Please check your connection and try again.');
    } finally {
      setEnquirySubmitting(false);
    }
  };

  return (
    <section className="quick-enquiry-section" ref={ref}>
      <div className="quick-enquiry-container">
        <div className="quick-enquiry-header reveal-up">
          <span className="intro-title">Quick Enquiry</span>
          <h2>Tell Us About Your Celebration</h2>
          <p>Share the initial details of your vision, and we will get back to you within 24 hours.</p>
        </div>

        {!enquirySubmitted ? (
          <form className="quick-enquiry-form reveal-fade" onSubmit={handleEnquirySubmit}>
            {enquiryError && (
              <div className="quick-enquiry-error">
                <span>⚠️</span> {enquiryError}
              </div>
            )}

            {/* Row 1: Name and Email */}
            <div className="form-row two-cols">
              <div className="form-group">
                <label htmlFor="quick-name">Your Full Name *</label>
                <input
                  type="text"
                  id="quick-name"
                  required
                  disabled={enquirySubmitting}
                  placeholder="e.g. Eleanor Vance"
                  value={enquiryData.fullName}
                  onChange={handleEnquiryChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="quick-email">Email Address *</label>
                <input
                  type="email"
                  id="quick-email"
                  required
                  disabled={enquirySubmitting}
                  placeholder="e.g. eleanor@example.com"
                  value={enquiryData.email}
                  onChange={handleEnquiryChange}
                />
              </div>
            </div>

            {/* Row 2: Phone and Proposed Date */}
            <div className="form-row two-cols">
              <div className="form-group">
                <label htmlFor="quick-phone">Phone / WhatsApp Number *</label>
                <div className={`phone-input-wrapper ${enquiryPhoneFocused ? 'focused' : ''}`}>
                  <span className="phone-prefix">+91</span>
                  <input
                    type="tel"
                    id="quick-phone"
                    required
                    disabled={enquirySubmitting}
                    placeholder="98765 43210"
                    value={enquiryData.phone}
                    onChange={handleEnquiryChange}
                    onFocus={() => setEnquiryPhoneFocused(true)}
                    onBlur={() => setEnquiryPhoneFocused(false)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="quick-date">Proposed Date *</label>
                <input
                  type="date"
                  id="quick-date"
                  required
                  disabled={enquirySubmitting}
                  value={enquiryData.proposedDate}
                  onChange={handleEnquiryChange}
                />
              </div>
            </div>

            {/* Row 3: Celebration Type and Guest Count */}
            <div className="form-row two-cols">
              <div className="form-group">
                <label htmlFor="quick-type">Celebration Type *</label>
                <select
                  id="quick-type"
                  required
                  disabled={enquirySubmitting}
                  value={enquiryData.celebrationType}
                  onChange={handleEnquiryChange}
                >
                  <option value="Wedding Planning">Wedding Celebration</option>
                  <option value="Pre-Wedding Celebration">Pre-Wedding (Sangeet, Haldi, Mehendi)</option>
                  <option value="Milestone Birthday">Milestone Birthday / Party</option>
                  <option value="Bespoke Private Event">Bespoke Private Event</option>
                  <option value="Destination Celebration">Destination Wedding / Celebration</option>
                  <option value="Other">Others</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="quick-guests">Estimated Guest Count *</label>
                <input
                  type="number"
                  id="quick-guests"
                  required
                  disabled={enquirySubmitting}
                  min="1"
                  placeholder="e.g. 150"
                  value={enquiryData.guestCount}
                  onChange={handleEnquiryChange}
                />
              </div>
            </div>

            {/* Row 4: Specify Celebration Type (Conditional) */}
            <div className={`conditional-form-row ${enquiryData.celebrationType === 'Other' ? 'show' : ''}`}>
              <div className="form-group">
                <label htmlFor="quick-other-detail">Specify Celebration Type *</label>
                <input
                  type="text"
                  id="quick-other-detail"
                  required={enquiryData.celebrationType === 'Other'}
                  disabled={enquirySubmitting}
                  placeholder="e.g. Corporate Anniversary Gala, Proposal, Baby Shower"
                  value={enquiryOtherDetail}
                  onChange={(e) => setEnquiryOtherDetail(e.target.value)}
                />
              </div>
            </div>

            {/* Row 5: Proposed Location */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quick-location">Proposed Location / City *</label>
                <input
                  type="text"
                  id="quick-location"
                  required
                  disabled={enquirySubmitting}
                  placeholder="e.g. Bangalore, India"
                  value={enquiryData.location}
                  onChange={handleEnquiryChange}
                />
              </div>
            </div>

            <button type="submit" className="btn-form-submit" disabled={enquirySubmitting}>
              {enquirySubmitting ? 'Sending Request...' : 'Send Inquiry'}
            </button>
          </form>
        ) : (
          <div className="quick-enquiry-success">
            <h3>Thank You, {enquiryData.fullName}</h3>
            <p>
              Your inquiry for the <strong>{enquiryData.celebrationType === 'Other' ? enquiryOtherDetail : enquiryData.celebrationType}</strong> on <strong>{enquiryData.proposedDate}</strong> has been received successfully.
              Our luxury planning directors will connect with you via email or WhatsApp within 24 hours.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}));

QuickEnquiry.displayName = 'QuickEnquiry';
