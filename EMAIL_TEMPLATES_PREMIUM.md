# Templates d'Emails Premium pour Supabase

Ces templates sont conçus pour être élégants, professionnels et en parfaite adéquation avec l'image de marque de **ДРОВА ПРЕМИУМ**. Ils utilisent des codes à 6 chiffres (OTP) comme demandé.

---

## 🏗️ Structure de base (HTML/CSS)
*Copiez ce bloc HTML dans chaque section correspondante de Supabase Auth.*

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Playfair Display', serif; background-color: #faf7f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #e8d9cc; }
    .header { background: linear-gradient(135deg, #5e4032 0%, #793410 100%); padding: 40px; text-align: center; }
    .logo { color: #ffffff; font-size: 24px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; }
    .content { padding: 40px; color: #5e4032; line-height: 1.6; text-align: center; }
    .code-container { margin: 30px 0; padding: 20px; background-color: #fef7ed; border: 2px dashed #f2800c; border-radius: 12px; }
    .otp-code { font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #793410; margin: 0; }
    .footer { padding: 30px; text-align: center; font-size: 12px; color: #8c5d42; background-color: #f4ede6; }
    .info { font-style: italic; font-size: 14px; margin-top: 20px; color: #a9734d; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">ДРОВА ПРЕМИУМ</div>
    </div>
    <div class="content">
      {{ CONTENT }}
    </div>
    <div class="footer">
      &copy; 2026 ДРОВА ПРЕМИУМ. Все права защищены.<br>
      Премиальное качество дров и материалов для отопления.
    </div>
  </div>
</body>
</html>
```

---

## 1. Confirmation d'inscription (Confirm signup)

**Sujet :** 🔑 Добро пожаловать! Ваш код подтверждения

**Corps :**
*(Remplacez `{{ CONTENT }}` dans la structure ci-dessus par ceci)*

```html
<h1 style="font-size: 28px; margin-bottom: 20px;">Добро пожаловать в ДРОВА ПРЕМИУМ</h1>
<p>Благодарим вас за регистрацию. Для завершения создания учетной записи, пожалуйста, введите следующий код подтверждения на нашем сайте:</p>

<div class="code-container">
  <p class="otp-code">{{ .Token }}</p>
</div>

<p class="info">Этот код действителен в течение 24 часов. Если вы не создавали аккаунт, просто проигнорируйте это письмо.</p>
```

---

## 2. Réinitialisation de mot de passe (Reset password)

**Sujet :** 🛡️ Восстановление доступа к вашему аккаунту

**Corps :**
*(Remplacez `{{ CONTENT }}` dans la structure ci-dessus par ceci)*

```html
<h1 style="font-size: 28px; margin-bottom: 20px;">Запрос на смену пароля</h1>
<p>Мы получили запрос на сброс пароля для вашего аккаунта. Используйте этот секретный код для установки нового пароля:</p>

<div class="code-container">
  <p class="otp-code">{{ .Token }}</p>
</div>

<p class="info">Если вы не запрашивали смену пароля, ваш аккаунт в безопасности, никаких действий не требуется.</p>
```

---

## 3. Changement d'adresse email (Change email address)

**Sujet :** 📧 Подтверждение изменения адреса почты

**Corps :**
*(Remplacez `{{ CONTENT }}` dans la structure ci-dessus par ceci)*

```html
<h1 style="font-size: 28px; margin-bottom: 20px;">Изменение адреса почты</h1>
<p>Вы начали процесс изменения почтового адреса. Для подтверждения этого действия введите код ниже:</p>

<div class="code-container">
  <p class="otp-code">{{ .Token }}</p>
</div>

<p class="info">Никто, кроме вас, не должен иметь доступа к этому коду.</p>
```

---

## 4. Invitation (Invite user)

**Sujet :** 🪵 Вас пригласили в ДРОВА ПРЕМИУМ

**Corps :**
*(Remplacez `{{ CONTENT }}` dans la structure ci-dessus par ceci)*

```html
<h1 style="font-size: 28px; margin-bottom: 20px;">Вы приглашены!</h1>
<p>Вас пригласили присоединиться к эксклюзивному сервису ДРОВА ПРЕМИУМ. Используйте код подтверждения ниже, чтобы активировать свой доступ:</p>

<div class="code-container">
  <p class="otp-code">{{ .Token }}</p>
</div>

<p>Мы будем рады видеть вас среди наших клиентов.</p>
```
