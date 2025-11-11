# cURL Test Misollari

## 1. Barcha mavjud tillarni ko'rish

```bash
curl -X GET http://localhost:3000/api/sms/languages
```

## 2. Rus tili shablonini ko'rish

```bash
curl -X GET http://localhost:3000/api/sms/template/rus
```

## 3. Bitta raqamga RUS TILI reklamasini yuborish

```bash
curl -X POST http://localhost:3000/api/sms/send \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "998901234567",
    "language": "rus"
  }'
```

## 4. Bitta raqamga INGLIZ TILI reklamasini yuborish

```bash
curl -X POST http://localhost:3000/api/sms/send \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "998912345678",
    "language": "ingliz"
  }'
```

## 5. Bitta raqamga TURK TILI reklamasini yuborish

```bash
curl -X POST http://localhost:3000/api/sms/send \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "998901234567",
    "language": "turk"
  }'
```

## 6. Bitta raqamga KOREYS TILI reklamasini yuborish

```bash
curl -X POST http://localhost:3000/api/sms/send \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "998901234567",
    "language": "koreys"
  }'
```

## 7. Ko'p raqamlarga RUS TILI reklamasini yuborish

```bash
curl -X POST http://localhost:3000/api/sms/send-batch \
  -H "Content-Type: application/json" \
  -d '{
    "phones": [
      "998901234567",
      "998912345678",
      "998923456789"
    ],
    "language": "rus"
  }'
```

## 8. Ko'p raqamlarga INGLIZ TILI reklamasini yuborish

```bash
curl -X POST http://localhost:3000/api/sms/send-batch \
  -H "Content-Type: application/json" \
  -d '{
    "phones": [
      "998901234567",
      "998912345678"
    ],
    "language": "ingliz"
  }'
```

## 9. Balansni tekshirish

```bash
curl -X GET http://localhost:3000/api/sms/balance
```

## 10. Server health check

```bash
curl -X GET http://localhost:3000/health
```

## 11. API ma'lumotlari

```bash
curl -X GET http://localhost:3000/
```

## Windows PowerShell uchun

Agar siz Windows PowerShell ishlatayotgan bo'lsangiz:

```powershell
# Barcha tillarni ko'rish
Invoke-RestMethod -Uri "http://localhost:3000/api/sms/languages" -Method GET

# Bitta raqamga SMS yuborish
$body = @{
    phone = "998901234567"
    language = "rus"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/sms/send" -Method POST -Body $body -ContentType "application/json"
```

## Node.js/JavaScript orqali

```javascript
// fetch API bilan
fetch('http://localhost:3000/api/sms/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    phone: '998901234567',
    language: 'rus'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

## Python orqali

```python
import requests

url = "http://localhost:3000/api/sms/send"
payload = {
    "phone": "998901234567",
    "language": "rus"
}
headers = {
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
```
