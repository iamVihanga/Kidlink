import {
  SendSmtpEmail,
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys
} from "@getbrevo/brevo";

import env from "@api/env";

// Initialize Brevo client
const apiInstance = new TransactionalEmailsApi();
apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, env.BREVO_API_KEY);

export interface EmailTemplate {
  to: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  senderName?: string;
  senderEmail?: string;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  templateId?: number;
  templateParams?: Record<string, unknown>;
  senderName?: string;
  senderEmail?: string;
}

class EmailService {
  private defaultSender = {
    name: env.EMAIL_FROM_NAME || "Kidlink",
    email: env.EMAIL_FROM_ADDRESS || "noreply@kidlink.com"
  };

  /**
   * Send a transactional email using Brevo
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const sendSmtpEmail: SendSmtpEmail = {
        to: [{ email: options.to }],
        sender: {
          name: options.senderName || this.defaultSender.name,
          email: options.senderEmail || this.defaultSender.email
        },
        subject: options.subject,
        ...(options.html && { htmlContent: options.html }),
        ...(options.text && { textContent: options.text }),
        ...(options.templateId && { templateId: options.templateId }),
        ...(options.templateParams && { params: options.templateParams })
      };

      // Enable sandbox mode in development
      if (env.NODE_ENV === "development" || env.EMAIL_SANDBOX_MODE) {
        sendSmtpEmail.tags = ["sandbox"];
        console.log("📧 Email would be sent (sandbox mode):", {
          to: options.to,
          subject: options.subject,
          template: options.templateId || "custom"
        });

        // In sandbox mode, still call the API but it won't actually send
        // Comment out the line below if you want to completely skip API calls in development
        // return true;
      }

      const result = await apiInstance.sendTransacEmail(sendSmtpEmail);

      console.log("📧 Email sent successfully:", {
        messageId: result.body.messageId,
        to: options.to,
        subject: options.subject
      });

      return true;
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      return false;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    to: string,
    resetUrl: string,
    token: string
  ): Promise<boolean> {
    const html = this.getPasswordResetTemplate(resetUrl);
    const text = `Reset your password by clicking this link: ${resetUrl}\n\nToken: ${token}\n\nIf you didn't request this, please ignore this email.`;

    return this.sendEmail({
      to,
      subject: "Reset Your Password - Kidlink",
      html,
      text
    });
  }

  /**
   * Send email verification email
   */
  async sendEmailVerificationEmail(
    to: string,
    verificationUrl: string,
    token: string
  ): Promise<boolean> {
    const html = this.getEmailVerificationTemplate(verificationUrl);
    const text = `Verify your email address by clicking this link: ${verificationUrl}\n\nToken: ${token}\n\nIf you didn't create an account, please ignore this email.`;

    return this.sendEmail({
      to,
      subject: "Verify Your Email Address - Kidlink",
      html,
      text
    });
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(to: string, userName: string): Promise<boolean> {
    const html = this.getWelcomeTemplate(userName);
    const text = `Welcome to Kidlink, ${userName}!\n\nWe're excited to have you on board. Start exploring all the features we have to offer.`;

    return this.sendEmail({
      to,
      subject: "Welcome to Kidlink! 🎉",
      html,
      text
    });
  }

  /**
   * Password reset email template
   */
  private getPasswordResetTemplate(resetUrl: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #007bff; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button {
            display: inline-block;
            background: #007bff;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Reset Your Password</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>You recently requested to reset your password for your Kidlink account. Click the button below to reset it:</p>
            <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Kidlink. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Email verification template
   */
  private getEmailVerificationTemplate(verificationUrl: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #28a745; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button {
            display: inline-block;
            background: #28a745;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Verify Your Email</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>Thanks for joining Kidlink! Please verify your email address by clicking the button below:</p>
            <p style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email</a>
            </p>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #28a745;">${verificationUrl}</p>
            <p>This link will expire in 24 hours for security reasons.</p>
            <p>If you didn't create an account, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Kidlink. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Welcome email template
   */
  private getWelcomeTemplate(userName: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Kidlink</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #6f42c1; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button {
            display: inline-block;
            background: #6f42c1;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Kidlink! 🎉</h1>
        </div>
        <div class="content">
            <p>Hello ${userName},</p>
            <p>Welcome to Kidlink! We're excited to have you join our community.</p>
            <p>You can now start exploring our platform and all its features. If you have any questions, don't hesitate to reach out to our support team.</p>
            <p style="text-align: center;">
                <a href="${env.CLIENT_APP_URL}" class="button">Get Started</a>
            </p>
            <p>Thank you for choosing Kidlink!</p>
            <p>Best regards,<br>The Kidlink Team</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Kidlink. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
  }
}

// Export singleton instance
export const emailService = new EmailService();
export default emailService;
