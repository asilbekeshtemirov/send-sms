const axios = require('axios');
require('dotenv').config();

class EskizService {
    constructor() {
        this.baseURL = process.env.ESKIZ_API_URL;
        this.email = process.env.ESKIZ_EMAIL;
        this.password = process.env.ESKIZ_PASSWORD;
        this.token = null;
        this.tokenExpiresAt = null;
    }

    /**
     * Login to Eskiz.uz and get authentication token
     */
    async login() {
        try {
            const response = await axios.post(`${this.baseURL}/auth/login`, {
                email: this.email,
                password: this.password
            });

            if (response.data && response.data.data && response.data.data.token) {
                this.token = response.data.data.token;
                // Token expires in 30 days, set expiry to 29 days from now
                this.tokenExpiresAt = Date.now() + (29 * 24 * 60 * 60 * 1000);
                console.log('✅ Successfully logged in to Eskiz.uz');
                return this.token;
            } else {
                throw new Error('Invalid response from Eskiz.uz login');
            }
        } catch (error) {
            console.error('❌ Eskiz.uz login error:', error.response?.data || error.message);
            throw new Error('Failed to login to Eskiz.uz: ' + (error.response?.data?.message || error.message));
        }
    }

    /**
     * Check if token is valid and not expired
     */
    isTokenValid() {
        return this.token && this.tokenExpiresAt && Date.now() < this.tokenExpiresAt;
    }

    /**
     * Get valid token (login if necessary)
     */
    async getValidToken() {
        if (!this.isTokenValid()) {
            await this.login();
        }
        return this.token;
    }

    /**
     * Send SMS to a single phone number
     * @param {string} phone - Phone number in format 998XXXXXXXXX
     * @param {string} message - SMS message text
     */
    async sendSMS(phone, message) {
        try {
            const token = await this.getValidToken();

            const response = await axios.post(
                `${this.baseURL}/message/sms/send`,
                {
                    mobile_phone: phone,
                    message: message,
                    from: '4546', // Default from number
                    callback_url: null
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Log full response for debugging
            console.log('📨 Eskiz.uz Response:', JSON.stringify(response.data, null, 2));

            // Check if SMS was successfully sent or queued
            // Eskiz.uz returns status: "success" when message is accepted
            if (response.data && (response.data.status === 'success' || response.data.status === 'waiting')) {
                console.log(`✅ SMS sent successfully to ${phone}`);
                return {
                    success: true,
                    data: response.data,
                    message: 'SMS sent successfully'
                };
            } else if (response.status === 200 && response.data) {
                // If we got a 200 response with data, consider it successful
                console.log(`✅ SMS accepted by Eskiz.uz for ${phone}`);
                return {
                    success: true,
                    data: response.data,
                    message: 'SMS sent successfully'
                };
            } else {
                console.error('⚠️ Unexpected response:', response.data);
                throw new Error('Failed to send SMS');
            }
        } catch (error) {
            console.error('❌ Error sending SMS:', error.response?.data || error.message);

            // If unauthorized, try to refresh token and retry once
            if (error.response?.status === 401) {
                console.log('🔄 Token expired, refreshing...');
                this.token = null;
                try {
                    const token = await this.getValidToken();
                    const retryResponse = await axios.post(
                        `${this.baseURL}/message/sms/send`,
                        {
                            mobile_phone: phone,
                            message: message,
                            from: '4546',
                            callback_url: null
                        },
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );

                    console.log('📨 Eskiz.uz Retry Response:', JSON.stringify(retryResponse.data, null, 2));

                    if (retryResponse.data && (retryResponse.data.status === 'success' || retryResponse.data.status === 'waiting')) {
                        console.log(`✅ SMS sent successfully to ${phone} (after retry)`);
                        return {
                            success: true,
                            data: retryResponse.data,
                            message: 'SMS sent successfully'
                        };
                    } else if (retryResponse.status === 200 && retryResponse.data) {
                        console.log(`✅ SMS accepted by Eskiz.uz for ${phone} (after retry)`);
                        return {
                            success: true,
                            data: retryResponse.data,
                            message: 'SMS sent successfully'
                        };
                    }
                } catch (retryError) {
                    console.error('❌ Retry failed:', retryError.response?.data || retryError.message);
                }
            }

            return {
                success: false,
                error: error.response?.data || error.message,
                message: 'Failed to send SMS'
            };
        }
    }

    /**
     * Get account balance
     */
    async getBalance() {
        try {
            const token = await this.getValidToken();

            const response = await axios.get(
                `${this.baseURL}/user/get-limit`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error('❌ Error getting balance:', error.response?.data || error.message);
            throw error;
        }
    }
}

// Export singleton instance
module.exports = new EskizService();
