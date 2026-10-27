import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"Crochet_Diariiies" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your OTP for Crochet_Diariiies',
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #FDF2F8; border-radius: 16px; padding: 32px; text-align: center;">
          <h1 style="color: #831843; font-family: 'Playfair Display', serif; margin-bottom: 16px;">Crochet_Diariiies</h1>
          <p style="color: #475569; font-size: 16px;">Your verification code</p>
          <div style="background: white; border-radius: 12px; padding: 24px; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: 700; color: #EC4899; letter-spacing: 8px;">${otp}</span>
          </div>
          <p style="color: #94A3B8; font-size: 14px;">This code expires in 10 minutes</p>
        </div>
      </div>
    `
  });
};

export const sendOrderConfirmationEmail = async (email, order) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 16px; border-bottom: 1px solid #F1F5F9;">
        <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
      </td>
      <td style="padding: 16px; border-bottom: 1px solid #F1F5F9;">
        <p style="margin: 0; color: #1E293B; font-weight: 500;">${item.name}</p>
        <p style="margin: 4px 0 0; color: #94A3B8; font-size: 14px;">Qty: ${item.quantity}</p>
      </td>
      <td style="padding: 16px; border-bottom: 1px solid #F1F5F9; text-align: right; color: #1E293B;">
        ₹${item.price * item.quantity}
      </td>
    </tr>
  `).join('');

  await transporter.sendMail({
    from: `"Crochet_Diariiies" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Order Confirmed - ${order.orderNumber}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #FDF2F8; border-radius: 16px; padding: 32px;">
          <h1 style="color: #831843; font-family: 'Playfair Display', serif; margin-bottom: 8px;">Thank you for your order! 💕</h1>
          <p style="color: #475569;">Your order <strong>${order.orderNumber}</strong> has been confirmed.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <thead>
              <tr style="background: #FCE7F3;">
                <th style="padding: 12px; text-align: left; color: #831843;">Product</th>
                <th style="padding: 12px; text-align: left; color: #831843;">Details</th>
                <th style="padding: 12px; text-align: right; color: #831843;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="background: white; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #475569;">
              <span>Subtotal</span>
              <span>₹${order.subtotal}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #475569;">
              <span>Shipping</span>
              <span>₹${order.shipping}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #475569;">
              <span>Tax</span>
              <span>₹${order.tax}</span>
            </div>
            <hr style="border-color: #F1F5F9;">
            <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #1E293B; font-weight: 600; font-size: 18px;">
              <span>Total</span>
              <span>₹${order.total}</span>
            </div>
          </div>

          <p style="color: #94A3B8; font-size: 14px; text-align: center;">
            Handmade with love, one stitch at a time.
          </p>
        </div>
      </div>
    `
  });
};

export const sendOrderStatusEmail = async (email, order) => {
  const statusMessages = {
    confirmed: 'Your order has been confirmed and is being prepared.',
    processing: 'Your handmade items are being carefully crafted.',
    ready_to_ship: 'Your order is ready and will be shipped soon!',
    shipped: `Your order has been shipped! Tracking: ${order.trackingNumber}`,
    delivered: 'Your order has been delivered. Hope you love it! 💕',
    cancelled: 'Your order has been cancelled.'
  };

  await transporter.sendMail({
    from: `"Crochet_Diariiies" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Order Update - ${order.orderNumber}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #FDF2F8; border-radius: 16px; padding: 32px; text-align: center;">
          <h1 style="color: #831843; font-family: 'Playfair Display', serif;">Order Update</h1>
          <p style="color: #475569;">${statusMessages[order.orderStatus] || 'Your order status has been updated.'}</p>
          <p style="color: #EC4899; font-weight: 600; font-size: 18px; margin: 24px 0;">${order.orderNumber}</p>
          <p style="color: #94A3B8; font-size: 14px;">Handmade with love, one stitch at a time.</p>
        </div>
      </div>
    `
  });
};

export const sendCustomOrderEmail = async (customOrder) => {
  await transporter.sendMail({
    from: `"Crochet_Diariiies" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
    subject: `New Custom Order Request - ${customOrder.name}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #FDF2F8; border-radius: 16px; padding: 32px;">
          <h1 style="color: #831843; font-family: 'Playfair Display', serif;">New Custom Order</h1>
          <p style="color: #475569;"><strong>Name:</strong> ${customOrder.name}</p>
          <p style="color: #475569;"><strong>Phone:</strong> ${customOrder.phone}</p>
          <p style="color: #475569;"><strong>Email:</strong> ${customOrder.email}</p>
          <p style="color: #475569;"><strong>Product Type:</strong> ${customOrder.productType}</p>
          <p style="color: #475569;"><strong>Colors:</strong> ${customOrder.preferredColors.join(', ')}</p>
          <p style="color: #475569;"><strong>Budget:</strong> ₹${customOrder.budget}</p>
          <p style="color: #475569;"><strong>Required By:</strong> ${customOrder.requiredDate ? customOrder.requiredDate.toLocaleDateString() : 'Not specified'}</p>
          <p style="color: #475569;"><strong>Instructions:</strong> ${customOrder.specialInstructions}</p>
        </div>
      </div>
    `
  });
};

export const sendCustomOrderStatusEmail = async (customOrder) => {
  const statusMessages = {
    discussing: 'We\'re discussing your custom order idea!',
    quoted: 'We\'ve sent you a quotation for your custom order.',
    approved: 'Your custom order has been approved and is in production!',
    in_production: 'Your custom piece is being handcrafted with love.',
    completed: 'Your custom order is complete and ready to ship!',
    cancelled: 'Your custom order request has been cancelled.'
  };

  await transporter.sendMail({
    from: `"Crochet_Diariiies" <${process.env.SMTP_USER}>`,
    to: customOrder.email,
    subject: `Custom Order Update - ${customOrder._id}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #FDF2F8; border-radius: 16px; padding: 32px; text-align: center;">
          <h1 style="color: #831843; font-family: 'Playfair Display', serif;">Custom Order Update</h1>
          <p style="color: #475569;">${statusMessages[customOrder.status] || 'Your custom order status has been updated.'}</p>
          ${customOrder.quotation?.amount ? `
            <div style="background: white; border-radius: 12px; padding: 20px; margin: 24px 0;">
              <p style="color: #475569; margin: 0;">Quoted Amount: <strong style="color: #EC4899;">₹${customOrder.quotation.amount}</strong></p>
            </div>
          ` : ''}
          <p style="color: #94A3B8; font-size: 14px;">Handmade with love, one stitch at a time.</p>
        </div>
      </div>
    `
  });
};