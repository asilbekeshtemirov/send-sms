# Swagger API Dokumentatsiya

## Swagger UI ga kirish

Swagger interaktiv dokumentatsiyani brauzerda ochish:

```
http://localhost:3000/api-docs
```

## Swagger bilan ishlash

### 1. Endpointlarni ko'rish

Swagger UI ochilganda, quyidagi bo'limlar ko'rinadi:
- **SMS** - SMS yuborish operatsiyalari
- **Languages** - Til va shablon operatsiyalari
- **Balance** - Balans tekshirish
- **Health** - Server holati

### 2. Endpoint test qilish

Har bir endpointni test qilish uchun:

1. Kerakli endpointni bosing
2. "Try it out" tugmasini bosing
3. Request parametrlarini kiriting
4. "Execute" tugmasini bosing
5. Response natijasini ko'ring

### 3. Request Body namunasi

Swagger UI avtomatik ravishda to'g'ri request body namunasini ko'rsatadi:

**Bitta SMS yuborish:**
```json
{
  "phone": "998901234567",
  "language": "rus"
}
```

**Ko'p SMS yuborish:**
```json
{
  "phones": ["998901234567", "998912345678"],
  "language": "ingliz"
}
```

### 4. Validatsiya qoidalari

Swagger documentatsiyada quyidagi validatsiya qoidalari ko'rsatilgan:

**Phone number:**
- Format: `998XXXXXXXXX`
- Pattern: `^998\\d{9}$`
- Example: `998901234567`

**Language:**
- Type: `enum`
- Allowed values: `rus`, `ingliz`, `turk`, `koreys`, `nemis`, `fransuz`, `xitoy`, `ispan`, `arab`, `yapon`

### 5. Response kodlari

Swagger har bir endpoint uchun mumkin bo'lgan response kodlarini ko'rsatadi:
- `200` - Muvaffaqiyatli
- `400` - Noto'g'ri so'rov
- `404` - Topilmadi
- `500` - Server xatosi

## OpenAPI JSON

Agar siz API spetsifikatsiyasini JSON formatida olmoqchi bo'lsangiz:

```
http://localhost:3000/api-docs.json
```

Bu fayl quyidagi dasturlar bilan ishlash uchun ishlatilishi mumkin:
- Postman (Import collection)
- Insomnia
- API testing tools
- Code generators

## Swagger UI Features

### Schema va Models

Swagger UI da "Schemas" bo'limida barcha data modellar ko'rsatilgan:
- `SendSMSRequest` - Bitta SMS yuborish request
- `SendBatchSMSRequest` - Ko'p SMS yuborish request
- `SuccessResponse` - Muvaffaqiyatli response
- `ErrorResponse` - Xato response
- `Language` - Til obyekti
- `Template` - Shablon obyekti

### Try it out

Har bir endpoint uchun "Try it out" funksiyasi mavjud:
1. Request parametrlarini kiriting
2. Execute bosing
3. Real-time response oling
4. Request URL va headers ko'ring

### Authorization

Bu API da authentication yo'q, chunki backend Eskiz.uz bilan integratsiya qilingan.
Foydalanuvchilar to'g'ridan-to'g'ri API'ga so'rov yuborishi mumkin.

## Swagger Export

### Postman ga import qilish

1. Swagger JSON ni yuklab oling: http://localhost:3000/api-docs.json
2. Postman ochig
3. File -> Import
4. JSON faylni tanlang
5. Import tugmasini bosing

### Code generation

OpenAPI spetsifikatsiyasidan kod generatsiya qilish uchun:

```bash
# JavaScript/TypeScript
npx openapi-generator-cli generate -i http://localhost:3000/api-docs.json -g javascript -o ./client

# Python
npx openapi-generator-cli generate -i http://localhost:3000/api-docs.json -g python -o ./client

# Java
npx openapi-generator-cli generate -i http://localhost:3000/api-docs.json -g java -o ./client
```

## Misollar

### Swagger UI da SMS yuborish

1. Brauzerni oching: http://localhost:3000/api-docs
2. **SMS** bo'limini bosing
3. `POST /api/sms/send` endpointini toping
4. "Try it out" tugmasini bosing
5. Request body ga quyidagilarni kiriting:
```json
{
  "phone": "998901234567",
  "language": "rus"
}
```
6. "Execute" tugmasini bosing
7. Response natijasini ko'ring

### Tillarni ko'rish

1. **Languages** bo'limini bosing
2. `GET /api/sms/languages` endpointini toping
3. "Try it out" tugmasini bosing
4. "Execute" tugmasini bosing
5. Barcha tillar ro'yxatini ko'ring

### Shablon ko'rish

1. **Languages** bo'limini bosing
2. `GET /api/sms/template/{language}` endpointini toping
3. "Try it out" tugmasini bosing
4. `language` parametriga `rus` kiriting
5. "Execute" tugmasini bosing
6. Rus tili shablonini ko'ring

## Production deployment

Production muhitda Swagger UI ni o'chirish uchun:

1. `.env` faylda yangi o'zgaruvchi qo'shing:
```env
ENABLE_SWAGGER=false
```

2. `index.js` faylni yangilang:
```javascript
// Swagger Documentation
if (process.env.ENABLE_SWAGGER !== 'false') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
```

## Xulosa

Swagger UI sizga quyidagilarni beradi:
- ✅ Interaktiv API dokumentatsiya
- ✅ Real-time testing
- ✅ Schema va validatsiya qoidalari
- ✅ Code generation imkoniyati
- ✅ Postman/Insomnia import
- ✅ Professional ko'rinish

**Swagger UI URL**: http://localhost:3000/api-docs
