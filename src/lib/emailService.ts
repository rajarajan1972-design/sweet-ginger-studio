import nodemailer from 'nodemailer';
import { OrderRecord } from '@/types/design';

interface SendEmailParams {
  type: 'confirmation' | 'status_update';
  order: OrderRecord;
  newStatus?: OrderRecord['status'];
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  simulated: boolean;
  to: string;
  subject: string;
  previewSnippet?: string;
}

/**
 * Generate formatted HTML email template for Sweet Ginger Apparel & Ginger Prints Jaipur
 */
export function generateEmailHtml(params: SendEmailParams): { subject: string; html: string } {
  const { type, order, newStatus } = params;
  const statusToDisplay = newStatus || order.status;

  const statusDescriptions: Record<OrderRecord['status'], { title: string; desc: string; color: string }> = {
    received: {
      title: 'Order Confirmed & Received',
      desc: 'Your custom design order has entered the Ginger Prints Jaipur manufacturing queue.',
      color: '#2563eb',
    },
    in_production: {
      title: 'Order In Production 🧵',
      desc: 'Your garments are currently on the press! Pre-press checks, DTF printing, and embroidery stitch runs are active.',
      color: '#d97706',
    },
    printed: {
      title: 'Garments Printed & Quality Inspected ✨',
      desc: 'Your custom blank run has been cured, inspected for print accuracy, and folded.',
      color: '#9333ea',
    },
    shipped: {
      title: 'Dispatched & On The Way 🚚',
      desc: 'Your order has been sealed and dispatched from our Jaipur facility. Courier tracking details are enclosed.',
      color: '#059669',
    },
  };

  const currentStatusInfo = statusDescriptions[statusToDisplay] || statusDescriptions.received;

  const isConfirmation = type === 'confirmation';
  const subject = isConfirmation
    ? `Order Confirmed: ${order.orderNumber} - Sweet Ginger Custom Apparel Studio`
    : `Order Update [${currentStatusInfo.title}]: ${order.orderNumber}`;

  // Build size breakdown rows
  const sizeRows = Object.entries(order.sizeBreakdown)
    .filter(([_, count]) => count > 0)
    .map(
      ([size, count]) => `
      <tr style="border-bottom: 1px solid #f3f4f6;">
        <td style="padding: 10px 14px; font-weight: 600; color: #1f2937;">Size ${size}</td>
        <td style="padding: 10px 14px; text-align: right; color: #4b5563; font-family: monospace;">${count} pcs</td>
      </tr>
    `
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #171717; padding: 32px 36px; text-align: left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: #f59e0b; color: #171717; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 6px; margin-bottom: 8px;">
                      Ginger Prints Jaipur
                    </span>
                    <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">
                      Sweet Ginger Fashions
                    </h1>
                    <p style="color: #a3a3a3; font-size: 13px; margin: 4px 0 0 0;">
                      Jaipur Apparel Co. • Order Fulfillment Hub
                    </p>
                  </td>
                  <td align="right" style="vertical-align: top;">
                    <span style="font-family: monospace; font-size: 13px; color: #f59e0b; font-weight: bold; background-color: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); padding: 6px 12px; border-radius: 8px;">
                      ${order.orderNumber}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Notification Status Box -->
          <tr>
            <td style="padding: 28px 36px 16px 36px;">
              <div style="background-color: ${currentStatusInfo.color}10; border-left: 4px solid ${currentStatusInfo.color}; padding: 16px 20px; border-radius: 10px; margin-bottom: 24px;">
                <h2 style="font-size: 16px; font-weight: 700; color: ${currentStatusInfo.color}; margin: 0 0 4px 0;">
                  ${currentStatusInfo.title}
                </h2>
                <p style="font-size: 13px; color: #4b5563; margin: 0; line-height: 1.5;">
                  ${currentStatusInfo.desc}
                </p>
              </div>

              <p style="font-size: 14px; color: #374151; margin: 0 0 16px 0; line-height: 1.6;">
                Dear <strong>${order.customerName}</strong>,
                <br>
                ${
                  isConfirmation
                    ? `Thank you for choosing Sweet Ginger. Your order for <strong>${order.totalQuantity} custom pieces</strong> has been received by our Jaipur factory staff. Below is your detailed production breakdown and invoice receipt.`
                    : `We are pleased to inform you that your custom garment order <strong>${order.orderNumber}</strong> has been updated to <strong>${currentStatusInfo.title}</strong>.`
                }
              </p>
            </td>
          </tr>

          <!-- Garment & Design Specs Table -->
          <tr>
            <td style="padding: 0 36px 24px 36px;">
              <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; color: #6b7280; margin: 0 0 12px 0;">
                Production Specifications
              </h3>
              
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; margin-bottom: 20px;">
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 12px 16px; font-size: 13px; color: #6b7280; width: 40%;">Garment Model:</td>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #111827;">${order.productName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 12px 16px; font-size: 13px; color: #6b7280;">Garment Color:</td>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #111827;">
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${order.colorHex}; border: 1px solid #9ca3af; margin-right: 6px;"></span>
                    ${order.colorName}
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 12px 16px; font-size: 13px; color: #6b7280;">Customization Method:</td>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #b45309; text-transform: uppercase;">${order.printMethod}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 12px 16px; font-size: 13px; color: #6b7280;">Active Print Sides:</td>
                  <td style="padding: 12px 16px; font-size: 13px; color: #374151;">
                    ${order.frontLayers.length > 0 ? `Front (${order.frontLayers.length} layers)` : 'No Front'} • 
                    ${order.backLayers.length > 0 ? `Back (${order.backLayers.length} layers)` : 'No Back'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; font-size: 13px; color: #6b7280;">Order Vertical:</td>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #111827; text-transform: uppercase;">
                    ${order.orderType === 'b2b' ? 'B2B Wholesale Matrix' : 'B2C Single Retail'}
                  </td>
                </tr>
              </table>

              <!-- Size Breakdown Table -->
              <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; color: #6b7280; margin: 16px 0 10px 0;">
                Size & Quantity Breakdown
              </h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #e5e7eb; border-radius: 10px; font-size: 13px; overflow: hidden;">
                ${sizeRows || `
                  <tr>
                    <td style="padding: 10px 14px; color: #374151;">Standard Custom Size</td>
                    <td style="padding: 10px 14px; text-align: right; font-family: monospace;">${order.totalQuantity} pcs</td>
                  </tr>
                `}
              </table>
            </td>
          </tr>

          <!-- Financial Invoice Summary -->
          <tr>
            <td style="padding: 0 36px 32px 36px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #171717; color: #ffffff; border-radius: 14px; padding: 20px 24px;">
                <tr>
                  <td style="font-size: 13px; color: #9ca3af; padding-bottom: 8px;">Order Quantity:</td>
                  <td style="font-size: 13px; color: #f3f4f6; text-align: right; padding-bottom: 8px; font-family: monospace;">${order.totalQuantity} Units</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #9ca3af; padding-bottom: 8px;">Unit Effective Rate:</td>
                  <td style="font-size: 13px; color: #f3f4f6; text-align: right; padding-bottom: 8px; font-family: monospace;">₹${order.unitPrice.toFixed(2)} / pc</td>
                </tr>
                ${
                  order.discountPercent && order.discountPercent > 0
                    ? `
                <tr>
                  <td style="font-size: 13px; color: #34d399; padding-bottom: 8px;">Bulk Tier Savings (${order.discountPercent}% Off):</td>
                  <td style="font-size: 13px; color: #34d399; text-align: right; padding-bottom: 8px; font-family: monospace;">Applied</td>
                </tr>
                `
                    : ''
                }
                <tr style="border-top: 1px solid #374151;">
                  <td style="font-size: 16px; font-weight: 800; color: #ffffff; padding-top: 12px;">Total Paid:</td>
                  <td style="font-size: 20px; font-weight: 800; color: #f59e0b; text-align: right; padding-top: 12px; font-family: monospace;">₹${order.totalPrice.toFixed(2)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Help / Factory Direct Footer -->
          <tr>
            <td style="background-color: #f3f4f6; padding: 24px 36px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; line-height: 1.5;">
              <p style="margin: 0 0 8px 0; font-weight: 600; color: #374151;">
                Sweet Ginger Fashions • Ginger Prints Jaipur Unit
              </p>
              <p style="margin: 0 0 8px 0;">
                Have a question regarding pre-press files or physical sample proofs? Reach out directly to founder Shankar Hemrajani at <a href="mailto:shankar@sweetginger.in" style="color: #d97706; text-decoration: underline;">shankar@sweetginger.in</a> or WhatsApp support.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 11px;">
                Generated automatically by Sweet Ginger Custom Design System • Jaipur, Rajasthan, India
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return { subject, html };
}

/**
 * Dispatches an email using configured SMTP transporter, or logs simulated receipt if no SMTP configured.
 */
export async function sendOrderEmail(params: SendEmailParams): Promise<EmailResult> {
  const { order } = params;
  const recipientEmail = order.customerEmail || 'customer@sweetginger.in';
  const { subject, html } = generateEmailHtml(params);

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || 'orders@sweetginger.in';

  // Check if live SMTP configuration is provided
  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: `"Sweet Ginger Jaipur" <${smtpFrom}>`,
        to: recipientEmail,
        subject,
        html,
      });

      console.log(`[EmailService] Live email dispatched to ${recipientEmail} for order ${order.orderNumber}. Message ID: ${info.messageId}`);

      return {
        success: true,
        messageId: info.messageId,
        simulated: false,
        to: recipientEmail,
        subject,
      };
    } catch (err: unknown) {
      console.error('[EmailService] SMTP Send error, falling back to recorded dispatch:', err);
    }
  }

  // Development / Simulation Mode: Log delivery details cleanly
  console.log(`[EmailService - DEV/SIMULATED DISPATCH]`);
  console.log(`  To: ${recipientEmail}`);
  console.log(`  Subject: ${subject}`);
  console.log(`  Order: ${order.orderNumber} (${order.productName}, ${order.totalQuantity} pcs, ₹${order.totalPrice})`);
  console.log(`  Status: ${params.newStatus || order.status}`);

  return {
    success: true,
    messageId: `sim-${Date.now()}-${order.id}`,
    simulated: true,
    to: recipientEmail,
    subject,
    previewSnippet: `Dispatched notification for ${order.orderNumber} to ${recipientEmail}`,
  };
}
