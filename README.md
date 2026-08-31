# consent-email-prank

نمونهٔ دمو برای ارسال پیام با رضایت. این پروژه برای تست طراحی شده و از Ethereal به‌عنوان fallback استفاده می‌کند اگر تنظیمات SMTP واقعی فراهم نشده باشد.

نکات مهم:
- هر پیامی که ارسال می‌شود باید با رضایت فرستنده باشد.
- از ارسال اطلاعات حساس (پسورد، شماره کارت، ...) خودداری کنید.

فایل‌ها:
- public/index.html — فرم فرانت‌اند
- server.js — بک‌اند Node.js/Express
- .env.example — نمونهٔ متغیرهای محیطی

اجرای محلی:
1. نصب وابستگی‌ها:
   ```bash
   npm install
   ```
2. کپی فایل محیطی و ویرایش مقادیر (اختیاری):
   ```bash
   cp .env.example .env
   # ویرایش .env برای تنظیم RECIPIENT_EMAIL و در صورت نیاز تنظیمات SMTP
   ```
3. اجرای برنامه:
   ```bash
   npm start
   ```
4. باز کردن در مرورگر: http://localhost:3000

تست ایمیل بدون SMTP واقعی:
- اگر متغیرهای SMTP تنظیم نشده باشند، برنامه از Ethereal برای تست استفاده می‌کند و لینک پیش‌نمایش ایمیل در پاسخ API برگردانده می‌شود.

استقرار (Render.com):
1. به https://render.com بروید و با GitHub خود متصل شوید.
2. یک Web Service جدید بسازید، ریپوی GitHub را انتخاب کنید و Branch = main
3. Environment: Node
4. در Settings > Environment Variables مقادیر زیر را اضافه کنید (اگر می‌خواهید ایمیل واقعی ارسال شود):
   - RECIPIENT_EMAIL = cissemoussouhawa@gmail.com
   - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE (در صورت استفاده از سرویس SMTP)
5. Deploy کنید.

قوانین و اخلاق:
- قبل از استفاده برای شوخی مطمئن شوید تمامی طرف‌ها آگاه و موافق‌اند.
- از جمع‌آوری اطلاعات حساس یا استفادهٔ فریب‌آمیز خودداری کنید.
