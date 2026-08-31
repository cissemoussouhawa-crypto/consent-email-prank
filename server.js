// Node.js + Express backend برای ارسال ایمیل با nodemailer
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
app.use(helmet());
app.use(express.json());
// در تولید، مقدار origin را قفل کنید به دامنهٔ خود
app.use(cors({ origin: true }));

// محدودیت سرعت ساده: حداکثر 30 درخواست در 15 دقیقه از یک آی‌پی
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'زیادی درخواست فرستاده‌اید؛ لطفاً بعدا دوباره تلاش کنید.' }
});
app.use(limiter);

// سرو کردن فایل‌های استاتیک فرانت‌اند
app.use(express.static('public'));

let transporter = null;
let usingEthereal = false;

async function initTransporter() {
  if (transporter) return;

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: (process.env.SMTP_SECURE === 'true'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    usingEthereal = false;
    try {
      await transporter.verify();
      console.log('SMTP transporter آماده است');
    } catch (err) {
      console.warn('هشدار: اتصال SMTP برقرار نشد — هنگام ارسال ممکن است خطا رخ دهد.', err.message);
    }
  } else {
    // fallback to Ethereal for testing (no real email sent)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    usingEthereal = true;
    console.log('استفاده از حساب Ethereal برای تست:', testAccount.user);
  }
}

app.post('/send', async (req, res) => {
  try {
    const { name, email, message, consent } = req.body;

    // اعتبارسنجی ساده
    if (!consent) return res.status(400).json({ error: 'رضایت لازم است.' });
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'پیام نمی‌تواند خالی باشد.' });
    }
    if (message.length > 5000) return res.status(400).json({ error: 'پیام خیلی طولانی است.' });

    const recipient = process.env.RECIPIENT_EMAIL;
    if (!recipient) return res.status(500).json({ error: 'آدرس گیرنده تنظیم نشده است.' });

    await initTransporter();

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@example.com',
      to: recipient,
      subject: `پیام از ${name && name.trim() ? name.trim() : 'فرستندهٔ ناشناس'}`,
      text: `فرستنده: ${name || 'ناشناس'}\nایمیل اعلام‌شده: ${email || 'ندارد'}\n\nپیام:\n${message}`
    };

    const info = await transporter.sendMail(mailOptions);

    if (usingEthereal) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      return res.json({ ok: true, previewUrl });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('send error:', err);
    return res.status(500).json({ error: 'ارسال ایمیل شکست خورد.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server running on port', port));
