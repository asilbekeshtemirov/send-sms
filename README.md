# SMS Reklama API - Til Kurslari

Bu Node.js backend Eskiz.uz SMS API orqali til o'quv kurslari uchun reklama SMS yuborish uchun mo'ljallangan.

## O'rnatish

### 1. Bog'liqliklarni o'rnatish
```bash
npm install
```

### 2. Environment o'zgaruvchilarini sozlash
`.env` faylini tahrirlang va o'z ma'lumotlaringizni kiriting:

```env
ESKIZ_EMAIL=your-email@example.com
ESKIZ_PASSWORD=your-password
ESKIZ_API_URL=https://notify.eskiz.uz/api
PORT=3000
NODE_ENV=development
```

### 3. Serverni ishga tushirish

**Production rejimi:**
```bash
npm start
```

**Development rejimi (avtomatik restart):**
```bash
npm run start:dev
# yoki
npm run dev
```

Server `http://localhost:3000` manzilida ishga tushadi.

> **Development rejimi:** Kodda o'zgarish bo'lganda server avtomatik qayta ishga tushadi (nodemon)

## API Dokumentatsiya

### Swagger UI (Interaktiv)
Barcha API endpointlarini ko'rish va test qilish uchun:
- **URL**: http://localhost:3000/api-docs
- **Features**:
  - Barcha endpointlarni ko'rish
  - To'g'ridan-to'g'ri brauzerdan test qilish
  - Request/Response namunaviy ko'rinishi
  - Schema va validatsiya qoidalari

### Swagger JSON
OpenAPI 3.0 formatida API spetsifikatsiyasi:
- **URL**: http://localhost:3000/api-docs.json

## API Endpoints

### 1. Bitta raqamga SMS yuborish
**POST** `/api/sms/send`

**Request Body:**
```json
{
  "phone": "998901234567",
  "language": "rus"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "SMS muvaffaqiyatli yuborildi",
  "data": {
    "phone": "998901234567",
    "language": "RUS TILI",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Ko'p raqamlarga SMS yuborish
**POST** `/api/sms/send-batch`

**Request Body:**
```json
{
  "phones": ["998901234567", "998912345678", "998923456789"],
  "language": "ingliz"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Jami: 3, Yuborildi: 3, Xatolik: 0",
  "data": {
    "total": 3,
    "successCount": 3,
    "failCount": 0,
    "results": [
      {
        "phone": "998901234567",
        "success": true,
        "error": null
      }
    ],
    "language": "INGLIZ TILI",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. Mavjud tillarni ko'rish
**GET** `/api/sms/languages`

**Response:**
```json
{
  "success": true,
  "data": [
    { "code": "rus", "name": "RUS TILI" },
    { "code": "ingliz", "name": "INGLIZ TILI" },
    { "code": "turk", "name": "TURK TILI" },
    { "code": "koreys", "name": "KOREYS TILI" },
    { "code": "nemis", "name": "NEMIS TILI" },
    { "code": "fransuz", "name": "FRANSUZ TILI" },
    { "code": "xitoy", "name": "XITOY TILI" },
    { "code": "ispan", "name": "ISPAN TILI" },
    { "code": "arab", "name": "ARAB TILI" },
    { "code": "yapon", "name": "YAPON TILI" }
  ],
  "count": 10
}
```

### 4. Til shablonini ko'rish
**GET** `/api/sms/template/:language`

**Example:** `/api/sms/template/rus`

**Response:**
```json
{
  "success": true,
  "data": {
    "language": "RUS TILI",
    "code": "rus",
    "template": "RUS TILI KURSLARI!\n\nRUS TILIni mukammal o'rganing!..."
  }
}
```

### 5. Balansni tekshirish
**GET** `/api/sms/balance`

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": 1000,
    "...": "..."
  }
}
```

## Mavjud Tillar

- `rus` - Rus tili
- `ingliz` - Ingliz tili
- `turk` - Turk tili
- `koreys` - Koreys tili
- `nemis` - Nemis tili
- `fransuz` - Fransuz tili
- `xitoy` - Xitoy tili
- `ispan` - Ispan tili
- `arab` - Arab tili
- `yapon` - Yapon tili

## SMS Shablon

Barcha tillar uchun **universal shablon** ishlatiladi. Faqat til nomi o'zgaradi:

```
[TIL NOMI] KURSLARI!

[TIL NOMI]ni mukammal o'rganing!
Malakali o'qituvchilar
Zamonaviy dastur
Sertifikat

Ro'yxatdan o'tish: +998 XX XXX XX XX
Chegirmalar mavjud!

Biz bilan ishlang - muvaffaqiyatga erishing!
```

### Shablonni o'zgartirish

Agar siz SMS shablonini o'zgartirmoqchi bo'lsangiz, `config/languageTemplates.js` faylida `createUniversalTemplate` funksiyasini tahrirlang.

## Postman bilan Test qilish

### 1. Bitta SMS yuborish
```
POST http://localhost:3000/api/sms/send
Content-Type: application/json

{
  "phone": "998901234567",
  "language": "rus"
}
```

### 2. Ko'p SMS yuborish
```
POST http://localhost:3000/api/sms/send-batch
Content-Type: application/json

{
  "phones": ["998901234567", "998912345678"],
  "language": "ingliz"
}
```

## Xatoliklarni Bartaraf Qilish

### SMS yuborilmayapti?

1. `.env` faylda Eskiz.uz hisobi ma'lumotlari to'g'ri ekanligini tekshiring
2. Internet ulanishingizni tekshiring
3. Eskiz.uz hisobingizda mablag' borligini tekshiring
4. Server loglarini ko'rib chiqing

### Token xatosi?

Token avtomatik yangilanadi. Agar muammo davom etsa:
- Eskiz.uz hisobingizga kirib ko'ring
- Parol to'g'riligini tekshiring
- Yangi parol oling va `.env` faylda yangilang

## Loyiha Struktura

```
send-sms/
├── config/
│   └── languageTemplates.js   # Til shablonlari
├── routes/
│   └── smsRoutes.js           # API yo'nalishlari
├── services/
│   └── eskizService.js        # Eskiz.uz integratsiya
├── .env                       # Muhit o'zgaruvchilari
├── .env.example              # Muhit o'zgaruvchilari misol
├── .gitignore                # Git ignore fayli
├── index.js                  # Asosiy server fayli
├── package.json              # NPM konfiguratsiya
└── README.md                 # Hujjatlar
```

## Texnologiyalar

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Axios** - HTTP client
- **Dotenv** - Environment variables
- **Eskiz.uz API** - SMS gateway

## Litsenziya

ISC

## Muallif

Til o'quv kurslari uchun SMS reklama tizimi
