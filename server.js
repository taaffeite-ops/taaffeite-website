import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/enquire', async (req, res) => {
  const {
    fullName,
    email,
    phone,
    proposedDate,
    celebrationType,
    guestCount,
    location
  } = req.body;

  // Validation
  const requiredFields = {
    fullName,
    email,
    phone,
    proposedDate,
    celebrationType,
    guestCount,
    location
  };

  const missingFields = [];
  for (const [key, value] of Object.entries(requiredFields)) {
    if (value === undefined || value === null || String(value).trim() === '') {
      missingFields.push(key);
    }
  }

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: 'Bad Request',
      message: `The following required fields are missing or empty: ${missingFields.join(', ')}`
    });
  }

  console.log('New Enquiry Received:', {
    fullName,
    email,
    phone,
    proposedDate,
    celebrationType,
    guestCount,
    location,
    receivedAt: new Date().toISOString()
  });

  const emailApiKey = process.env.EMAIL_API_KEY;
  const notificationEmail = process.env.NOTIFICATION_EMAIL;
  const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';

  if (!emailApiKey || !notificationEmail) {
    console.error('Email API key or notification email is not configured in environment variables.');
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Email configuration is missing on the server.'
    });
  }

  try {
    const emailHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7f6f3; padding: 40px 20px; color: #333333; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); border: 1px solid #e5dfd5;">
          <!-- Header -->
          <div style="background-color: #1a1a1a; color: #ffffff; padding: 30px 40px; text-align: center; border-bottom: 3px solid #c5a059;">
            <h3 style="margin: 0; font-size: 20px; font-weight: 300; letter-spacing: 1.5px; text-transform: uppercase; color: #c5a059;">🚨 New Celebration Enquiry Recieved!</h3>
            <p style="margin: 5px 0 0 0; font-size: 13px; color: #a6a6a6; letter-spacing: 0.5px;">Taaffeite Events Planning Questionnaire</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px;">
            <p style="font-size: 15px; color: #555555; margin-bottom: 25px; margin-top: 0;">You have received a new luxury celebration inquiry. Here are the details of the submission:</p>
            
            <div style="border: 1px solid #f0eae1; border-radius: 6px; overflow: hidden;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #f0eae1;">
                  <td style="padding: 14px 20px; font-size: 13px; font-weight: bold; color: #8c8375; text-transform: uppercase; letter-spacing: 1px; width: 35%; background-color: #fcfbfa;">Name</td>
                  <td style="padding: 14px 20px; font-size: 15px; color: #1a1a1a; width: 65%; font-weight: bold;">${fullName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f0eae1;">
                  <td style="padding: 14px 20px; font-size: 13px; font-weight: bold; color: #8c8375; text-transform: uppercase; letter-spacing: 1px; background-color: #fcfbfa;">Email</td>
                  <td style="padding: 14px 20px; font-size: 15px; color: #c5a059;"><a href="mailto:${email}" style="color: #c5a059; text-decoration: none; font-weight: 500;">${email}</a></td>
                </tr>
                <tr style="border-bottom: 1px solid #f0eae1;">
                  <td style="padding: 14px 20px; font-size: 13px; font-weight: bold; color: #8c8375; text-transform: uppercase; letter-spacing: 1px; background-color: #fcfbfa;">Phone/WhatsApp</td>
                  <td style="padding: 14px 20px; font-size: 15px; color: #1a1a1a;">${phone}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f0eae1;">
                  <td style="padding: 14px 20px; font-size: 13px; font-weight: bold; color: #8c8375; text-transform: uppercase; letter-spacing: 1px; background-color: #fcfbfa;">Proposed Date</td>
                  <td style="padding: 14px 20px; font-size: 15px; color: #1a1a1a;">${proposedDate}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f0eae1;">
                  <td style="padding: 14px 20px; font-size: 13px; font-weight: bold; color: #8c8375; text-transform: uppercase; letter-spacing: 1px; background-color: #fcfbfa;">Event Type</td>
                  <td style="padding: 14px 20px; font-size: 15px; color: #1a1a1a;">${celebrationType}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f0eae1;">
                  <td style="padding: 14px 20px; font-size: 13px; font-weight: bold; color: #8c8375; text-transform: uppercase; letter-spacing: 1px; background-color: #fcfbfa;">Guest Count</td>
                  <td style="padding: 14px 20px; font-size: 15px; color: #1a1a1a;">${guestCount}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 20px; font-size: 13px; font-weight: bold; color: #8c8375; text-transform: uppercase; letter-spacing: 1px; background-color: #fcfbfa;">Location/City</td>
                  <td style="padding: 14px 20px; font-size: 15px; color: #1a1a1a;">${location}</td>
                </tr>
              </table>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #fcfbfa; padding: 20px 40px; text-align: center; border-top: 1px solid #f0eae1; font-size: 12px; color: #a6a6a6;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Taaffeite Events. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${emailApiKey}`,
        'User-Agent': 'taaffeite-events-app/1.0'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [notificationEmail],
        subject: `🚨 New Celebration Enquiry Recieved! - ${fullName}`,
        html: emailHtml
      })
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || `Resend API error: ${response.statusText}`);
    }

    console.log('Enquiry email sent successfully:', responseData);

    return res.status(200).json({
      success: true,
      message: 'Enquiry received and email sent successfully.'
    });
  } catch (error) {
    console.error('Error dispatching enquiry email:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to dispatch email. Please try again later.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
