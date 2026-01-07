# Templates d'Emails Ultra-Premium "ДРОВА ПРЕМИУМ"

Voici les templates complets, prêts à être copiés-collés directement dans les champs de configuration de Supabase Auth. Chaque template est auto-suffisant et conçu pour être **sublime** et **prestigieux**.

---

## 1. Confirmation d'inscription (Confirm signup)

**Sujet :** 🪵 Добро пожаловать в ДРОВА ПРЕМИУМ | Ваш код активации

**Corps HTML :**
```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Добро пожаловать</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap');
    body { background-color: #fdfaf7; margin: 0; padding: 0; font-family: 'Inter', Helvetica, Arial, sans-serif; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #fdfaf7; padding-bottom: 60px; }
    .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(94, 64, 50, 0.08); border: 1px solid #e8d9cc; margin-top: 40px; }
    .header { background: linear-gradient(135deg, #4a2f23 0%, #2d1810 100%); padding: 60px 40px; text-align: center; }
    .logo { color: #fbd9a5; font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; margin: 0; }
    .content { padding: 50px 40px; text-align: center; color: #4a2f23; }
    h1 { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; margin-bottom: 24px; color: #2d1810; }
    p { font-size: 16px; line-height: 1.6; color: #6b4f3f; margin-bottom: 32px; }
    .otp-section { background-color: #faf3eb; border: 2px solid #fbd9a5; border-radius: 20px; padding: 40px 20px; margin: 40px 0; }
    .otp-label { font-size: 12px; font-weight: 700; color: #bc4d0a; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; display: block; }
    .otp-code { font-family: 'Inter', sans-serif; font-size: 48px; font-weight: 800; color: #2d1810; letter-spacing: 16px; margin-left: 16px; }
    .footer { padding: 40px; text-align: center; font-size: 13px; color: #a9734d; border-top: 1px solid #f4ede6; }
    .footer-links { margin-top: 20px; }
    .footer-links a { color: #bc4d0a; text-decoration: none; margin: 0 10px; font-weight: 600; }
  </style>
</head>
<body>
  <center class="wrapper">
    <div class="main">
      <div class="header">
        <h1 class="logo">ДРОВА ПРЕМИУМ</h1>
      </div>
      <div class="content">
        <h1>Добро пожаловать в круг избранных</h1>
        <p>Благодарим вас за выбор нашего сервиса. Мы ценим качество и традиции, поэтому предлагаем вам только лучшее топливо для вашего домашнего очага.</p>
        <p>Чтобы подтвердить ваше намерение и активировать аккаунт, пожалуйста, используйте этот защищенный код:</p>
        
        <div class="otp-section">
          <span class="otp-label">Ваш код подтверждения</span>
          <div class="otp-code">{{ .Token }}</div>
        </div>
        
        <p style="font-size: 14px; opacity: 0.8;">Если вы не запрашивали этот код, просто проигнорируйте это письмо. Ваши данные в безопасности.</p>
      </div>
      <div class="footer">
        <p>ДРОВА ПРЕМИУМ — Премиальное качество для вашего уюта</p>
        <div class="footer-links">
          <a href="#">Наш каталог</a> • <a href="#">Доставка</a> • <a href="#">Контакты</a>
        </div>
        <p style="margin-top: 30px; font-size: 11px; opacity: 0.6;">© 2026 Wood Premium Ltd. Все права защищены.</p>
      </div>
    </div>
  </center>
</body>
</html>
```

---

## 2. Réinitialisation de mot de passe (Reset password)

**Sujet :** 🛡️ Восстановление доступа к аккаунту | ДРОВА ПРЕМИУМ

**Corps HTML :**
```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Сброс пароля</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap');
    body { background-color: #fdfaf7; margin: 0; padding: 0; font-family: 'Inter', Helvetica, Arial, sans-serif; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #fdfaf7; padding-bottom: 60px; }
    .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(94, 64, 50, 0.08); border: 1px solid #e8d9cc; margin-top: 40px; }
    .header { background: linear-gradient(135deg, #793410 0%, #4a2f23 100%); padding: 60px 40px; text-align: center; }
    .logo { color: #fbd9a5; font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; margin: 0; }
    .content { padding: 50px 40px; text-align: center; color: #4a2f23; }
    h1 { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; margin-bottom: 24px; color: #2d1810; }
    p { font-size: 16px; line-height: 1.6; color: #6b4f3f; margin-bottom: 32px; }
    .otp-section { background-color: #faf3eb; border: 2px solid #fbd9a5; border-radius: 20px; padding: 40px 20px; margin: 40px 0; }
    .otp-label { font-size: 12px; font-weight: 700; color: #bc4d0a; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; display: block; }
    .otp-code { font-family: 'Inter', sans-serif; font-size: 48px; font-weight: 800; color: #2d1810; letter-spacing: 16px; margin-left: 16px; }
    .footer { padding: 40px; text-align: center; font-size: 13px; color: #a9734d; border-top: 1px solid #f4ede6; }
    .footer-links { margin-top: 20px; }
    .footer-links a { color: #bc4d0a; text-decoration: none; margin: 0 10px; font-weight: 600; }
  </style>
</head>
<body>
  <center class="wrapper">
    <div class="main">
      <div class="header">
        <h1 class="logo">ДРОВА ПРЕМИУМ</h1>
      </div>
      <div class="content">
        <h1>Сброс вашего пароля</h1>
        <p>Мы получили запрос на восстановление доступа к вашему аккаунту. Безопасность ваших данных является нашим главным приоритетом.</p>
        <p>Чтобы установить новый пароль, пожалуйста, введите этот 6-значный код на странице восстановления:</p>
        
        <div class="otp-section">
          <span class="otp-label">Код восстановления</span>
          <div class="otp-code">{{ .Token }}</div>
        </div>
        
        <p style="font-size: 14px; color: #bc4d0a; font-weight: 600;">Никому не сообщайте этот код!</p>
      </div>
      <div class="footer">
        <p>ДРОВА ПРЕМИУМ — Эстетика и тепло в каждом заказе</p>
        <div class="footer-links">
          <a href="#">Личный кабинет</a> • <a href="#">Заказы</a> • <a href="#">Помощь</a>
        </div>
      </div>
    </div>
  </center>
</body>
</html>
```

---

## 3. Changement d'adresse email (Change email address)

**Sujet :** 📧 Изменение учетных данных | ДРОВА ПРЕМИУМ

**Corps HTML :**
```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Смена почты</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap');
    body { background-color: #fdfaf7; margin: 0; padding: 0; font-family: 'Inter', Helvetica, Arial, sans-serif; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #fdfaf7; padding-bottom: 60px; }
    .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(94, 64, 50, 0.08); border: 1px solid #e8d9cc; margin-top: 40px; }
    .header { background-color: #4a2f23; padding: 60px 40px; text-align: center; }
    .logo { color: #fbd9a5; font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; margin: 0; }
    .content { padding: 50px 40px; text-align: center; color: #4a2f23; }
    h1 { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; margin-bottom: 24px; color: #2d1810; }
    .otp-section { background-color: #faf3eb; border: 2px solid #fbd9a5; border-radius: 20px; padding: 40px 20px; margin: 40px 0; }
    .otp-code { font-family: 'Inter', sans-serif; font-size: 48px; font-weight: 800; color: #2d1810; letter-spacing: 16px; margin-left: 16px; }
    .footer { padding: 40px; text-align: center; font-size: 13px; color: #a9734d; border-top: 1px solid #f4ede6; }
  </style>
</head>
<body>
  <center class="wrapper">
    <div class="main">
      <div class="header">
        <h1 class="logo">ДРОВА ПРЕМИУМ</h1>
      </div>
      <div class="content">
        <h1>Смена вашей почты</h1>
        <p>Вы инициировали смену основного адреса электронной почты для вашего аккаунта.</p>
        <p>Введите секретный код подтверждения ниже, чтобы завершить обновление:</p>
        
        <div class="otp-section">
          <div class="otp-code">{{ .Token }}</div>
        </div>
      </div>
      <div class="footer">
        <p>ДРОВА ПРЕМИУМ — Всегда на связи</p>
      </div>
    </div>
  </center>
</body>
</html>
```
