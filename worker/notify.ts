import { call } from "./functions.ts";

export type SendEmailRequest = {
  // Recipient email addresses
  to: string[] | string;
  // CC recipient email addresses
  cc?: string[] | string;
  // BCC recipient email addresses
  bcc?: string[] | string;
  // Email address for replies
  replyTo?: string;
  // Display name for sender (defaults to "Hiphops Notification")
  senderName?: string;
  // Email subject
  subject?: string;
  // Plain text content of the email. One or both of `content` or `htmlContent` must be set
  content?: string;
  // HTML content of the email. One or both of `content` or `htmlContent` must be set
  htmlContent?: string;
  // Unix timestamp set in the future, used to schedule the email for future sending.
  sendAt?: number;
  // File attachments to add to the email
  attachments?: EmailAttachment[];
};

export type EmailAttachment = {
  // The content of the attachment as a string
  content: string;
  // The MIME type of the attachment e.g. "application/pdf". If unset, Hiphops will attempt to detect the type automatically based on the extension in the filename, falling back to "text/plain" otherwise.
  type: string;
  // The name to give the file attachment
  filename: string;
};

/**
 * Send an email using the Hiphops notify service.
 * Note: All recipients and/or domains must be allow-listed via support before sending
 */
export const sendEmail = async (email: SendEmailRequest) => {
  email.to = typeof email.to === "string" ? [email.to] : email.to;
  email.cc = typeof email.cc === "string" ? [email.cc] : email.cc;
  email.bcc = typeof email.bcc === "string" ? [email.bcc] : email.bcc;

  return await call("hiphops.notify.email", email);
};
