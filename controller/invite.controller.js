import nodemailer from "nodemailer";

// Controller to handle invite by email
export const inviteByEmail = async (req, res) => {
  const { email, link } = req.body;
  console.log(link, email)

  if (!email || !link) {
    return res
      .status(400)
      .json({ error: "Email and Invite Link are required." });
  }

  try {
    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email service
      auth: {
        user: process.env.EMAIL_ID, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: email,
      subject: "You’re Invited to Join a Live Stream Room",
      text: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    </head/>
    <body>
            <p>Hello,</p>

<p>You have been invited to join a live stream room.</p>

<p>
  Click the link below to join:
  <br />
  <a href=${link}>Join Live Stream Room</a>
</p>

<p>See you there!</p>
<p>— The YourApp Team</p>
</body>
</html>
`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Invitation email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send invitation email." });
  }
};
