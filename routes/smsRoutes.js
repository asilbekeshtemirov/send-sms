const express = require('express');
const router = express.Router();
const eskizService = require('../services/eskizService');
const { getTemplate, getAvailableLanguages, getLanguageName } = require('../config/languageTemplates');

/**
 * @swagger
 * /api/sms/send:
 *   post:
 *     summary: Bitta raqamga SMS yuborish
 *     description: Tanlangan til kursi uchun reklama SMS yuborish
 *     tags: [SMS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendSMSRequest'
 *           example:
 *             phone: "998901234567"
 *             language: "rus"
 *     responses:
 *       200:
 *         description: SMS muvaffaqiyatli yuborildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "SMS muvaffaqiyatli yuborildi"
 *                 data:
 *                   type: object
 *                   properties:
 *                     phone:
 *                       type: string
 *                       example: "998901234567"
 *                     language:
 *                       type: string
 *                       example: "RUS TILI"
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/send', async (req, res) => {
    try {
        const { phone, language } = req.body;

        // Validation
        if (!phone) {
            return res.status(400).json({
                success: false,
                error: 'Phone number is required',
                message: 'Telefon raqam kiritilmagan'
            });
        }

        if (!language || language.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Language is required',
                message: 'Til kiritilmagan'
            });
        }

        // Phone number format validation (998XXXXXXXXX)
        const phoneRegex = /^998\d{9}$/;
        const cleanPhone = phone.toString().replace(/\D/g, '');

        if (!phoneRegex.test(cleanPhone)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid phone number format',
                message: 'Telefon raqam formati noto\'g\'ri. Format: 998XXXXXXXXX',
                example: '998901234567'
            });
        }

        // Get SMS template for ANY language (no validation, accepts everything)
        const messageTemplate = getTemplate(language);

        // Send SMS
        const result = await eskizService.sendSMS(cleanPhone, messageTemplate);

        if (result.success) {
            return res.status(200).json({
                success: true,
                message: 'SMS muvaffaqiyatli yuborildi',
                data: {
                    phone: cleanPhone,
                    language: getLanguageName(language),
                    timestamp: new Date().toISOString()
                }
            });
        } else {
            return res.status(500).json({
                success: false,
                error: result.error,
                message: 'SMS yuborishda xatolik yuz berdi'
            });
        }

    } catch (error) {
        console.error('Error in /api/sms/send:', error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Server xatosi'
        });
    }
});

/**
 * @swagger
 * /api/sms/send-batch:
 *   post:
 *     summary: Ko'p raqamlarga SMS yuborish
 *     description: Bir nechta telefon raqamlariga bir vaqtda SMS yuborish
 *     tags: [SMS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendBatchSMSRequest'
 *           example:
 *             phones: ["998901234567", "998912345678", "998923456789"]
 *             language: "rus"
 *     responses:
 *       200:
 *         description: Batch SMS yuborildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Jami: 3, Yuborildi: 3, Xatolik: 0"
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 3
 *                     successCount:
 *                       type: integer
 *                       example: 3
 *                     failCount:
 *                       type: integer
 *                       example: 0
 *                     results:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           phone:
 *                             type: string
 *                           success:
 *                             type: boolean
 *                           error:
 *                             type: string
 *                             nullable: true
 *                     language:
 *                       type: string
 *                       example: "RUS TILI"
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/send-batch', async (req, res) => {
    try {
        const { phones, language } = req.body;

        // Validation
        if (!phones || !Array.isArray(phones) || phones.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Phones array is required',
                message: 'Telefon raqamlar ro\'yxati kiritilmagan'
            });
        }

        if (!language || language.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Language is required',
                message: 'Til kiritilmagan'
            });
        }

        // Get SMS template for ANY language (no validation, accepts everything)
        const messageTemplate = getTemplate(language);

        const phoneRegex = /^998\d{9}$/;
        const results = [];
        let successCount = 0;
        let failCount = 0;

        // Send SMS to each phone number
        for (const phone of phones) {
            const cleanPhone = phone.toString().replace(/\D/g, '');

            if (!phoneRegex.test(cleanPhone)) {
                results.push({
                    phone: phone,
                    success: false,
                    error: 'Invalid phone number format'
                });
                failCount++;
                continue;
            }

            const result = await eskizService.sendSMS(cleanPhone, messageTemplate);

            results.push({
                phone: cleanPhone,
                success: result.success,
                error: result.success ? null : result.error
            });

            if (result.success) {
                successCount++;
            } else {
                failCount++;
            }

            // Add small delay between requests to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        return res.status(200).json({
            success: true,
            message: `Jami: ${phones.length}, Yuborildi: ${successCount}, Xatolik: ${failCount}`,
            data: {
                total: phones.length,
                successCount,
                failCount,
                results,
                language: getLanguageName(language),
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error in /api/sms/send-batch:', error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Server xatosi'
        });
    }
});

/**
 * @swagger
 * /api/sms/languages:
 *   get:
 *     summary: Barcha mavjud tillarni ko'rish
 *     description: Qo'llab-quvvatlanadigan barcha til kurslari ro'yxatini olish
 *     tags: [Languages]
 *     responses:
 *       200:
 *         description: Tillar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Language'
 *                 count:
 *                   type: integer
 *                   example: 10
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/languages', (req, res) => {
    try {
        const languages = getAvailableLanguages();
        const languageList = languages.map(lang => ({
            code: lang,
            name: getLanguageName(lang)
        }));

        return res.status(200).json({
            success: true,
            data: languageList,
            count: languages.length
        });
    } catch (error) {
        console.error('Error in /api/sms/languages:', error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Server xatosi'
        });
    }
});

/**
 * @swagger
 * /api/sms/template/{language}:
 *   get:
 *     summary: Til shablonini ko'rish
 *     description: Tanlangan til uchun SMS shablon matnini olish
 *     tags: [Languages]
 *     parameters:
 *       - in: path
 *         name: language
 *         required: true
 *         schema:
 *           type: string
 *           enum: [rus, ingliz, turk, koreys, nemis, fransuz, xitoy, ispan, arab, yapon]
 *         description: Til kodi
 *         example: rus
 *     responses:
 *       200:
 *         description: Shablon matni
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Template'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/template/:language', (req, res) => {
    try {
        const { language } = req.params;

        if (!language || language.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Language parameter is required',
                message: 'Til kiritilmagan'
            });
        }

        // Accept ANY language, no validation
        const template = getTemplate(language);

        return res.status(200).json({
            success: true,
            data: {
                language: getLanguageName(language),
                code: language,
                template: template
            }
        });
    } catch (error) {
        console.error('Error in /api/sms/template:', error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Server xatosi'
        });
    }
});

/**
 * @swagger
 * /api/sms/balance:
 *   get:
 *     summary: Balansni tekshirish
 *     description: Eskiz.uz hisobidagi balansni ko'rish
 *     tags: [Balance]
 *     responses:
 *       200:
 *         description: Balans ma'lumotlari
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Eskiz.uz balans ma'lumotlari
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/balance', async (req, res) => {
    try {
        const balance = await eskizService.getBalance();
        return res.status(200).json({
            success: true,
            data: balance
        });
    } catch (error) {
        console.error('Error in /api/sms/balance:', error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Balansni olishda xatolik'
        });
    }
});

module.exports = router;
