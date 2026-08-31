<?php

namespace App\Services;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmsService
{
    /**
     * Send an SMS to a phone number.
     *
     * @param string $to Recipient phone number (e.g. 017XXXXXXXX or +88017XXXXXXXX)
     * @param string $message Text message content
     * @return array ['success' => bool, 'message' => string]
     */
    public static function send(string $to, string $message): array
    {
        $enabled = SiteSetting::get('sms_enabled', '0') === '1';
        if (!$enabled) {
            return [
                'success' => false,
                'message' => 'SMS Gateway is disabled in Site Settings. Please enable it first.'
            ];
        }

        $provider = SiteSetting::get('sms_provider', 'bulksmsbd');
        $apiKey = SiteSetting::get('sms_api_key', '');
        $apiSecret = SiteSetting::get('sms_api_secret', '');
        $senderId = SiteSetting::get('sms_sender_id', 'IT SOLUTIONS');
        $apiUrl = SiteSetting::get('sms_api_url', '');

        if (empty($apiKey) && !in_array($provider, ['custom'])) {
            return [
                'success' => false,
                'message' => 'SMS Gateway API Key / Token is missing in Site Settings.'
            ];
        }

        // Clean local Bangladeshi number (e.g., 01712345678 or 8801712345678)
        $cleanPhone = preg_replace('/[^0-9+]/', '', $to);
        $localPhone = $cleanPhone;
        $intlPhone = $cleanPhone;

        if (str_starts_with($cleanPhone, '+880')) {
            $localPhone = '0' . substr($cleanPhone, 4);
            $intlPhone = substr($cleanPhone, 1);
        } elseif (str_starts_with($cleanPhone, '880')) {
            $localPhone = '0' . substr($cleanPhone, 3);
            $intlPhone = $cleanPhone;
        } elseif (str_starts_with($cleanPhone, '01')) {
            $localPhone = $cleanPhone;
            $intlPhone = '88' . $cleanPhone;
        }

        try {
            switch ($provider) {
                case 'bulksmsbd':
                    // BulkSMS BD Standard API Endpoint
                    $url = 'http://bulksmsbd.net/api/smsapi';
                    $response = Http::timeout(10)->post($url, [
                        'api_key' => $apiKey,
                        'type' => 'text',
                        'number' => $localPhone,
                        'senderid' => $senderId,
                        'message' => $message,
                    ]);
                    $body = $response->body();
                    $data = json_decode($body, true);
                    $success = isset($data['response_code']) && in_array($data['response_code'], [202, 200, 1000]);
                    return [
                        'success' => $success || $response->successful(),
                        'message' => $data['success_message'] ?? ($data['error_message'] ?? 'BulkSMS BD: ' . $body)
                    ];

                case 'greenweb':
                    // Greenweb BD Gateway
                    $url = 'http://api.greenweb.com.bd/api.php';
                    $response = Http::timeout(10)->get($url, [
                        'token' => $apiKey,
                        'to' => $localPhone,
                        'message' => $message,
                    ]);
                    $body = $response->body();
                    $success = str_contains(strtolower($body), 'ok') || str_contains($body, '100');
                    return [
                        'success' => $success,
                        'message' => 'Greenweb BD: ' . $body
                    ];

                case 'alphasms':
                    // Alpha SMS (sms.net.bd)
                    $url = 'https://api.sms.net.bd/sendsms';
                    $response = Http::timeout(10)->post($url, [
                        'api_key' => $apiKey,
                        'msg' => $message,
                        'to' => $localPhone,
                        'sender_id' => $senderId,
                    ]);
                    $body = $response->body();
                    $data = json_decode($body, true);
                    return [
                        'success' => isset($data['error']) && $data['error'] == 0,
                        'message' => $data['msg'] ?? 'AlphaSMS: ' . $body
                    ];

                case 'mimsms':
                    // MIM SMS BD v2 API (https://apidoc.mimsms.com/)
                    $userName = !empty($apiSecret) ? trim($apiSecret) : SiteSetting::get('contact_email', '');
                    if (empty($userName)) {
                        return [
                            'success' => false,
                            'message' => 'MIM SMS requires your MiMSMS login email address (userName). Please enter it in the API Secret / Username field in SMS Settings.'
                        ];
                    }

                    $url = 'https://api.mimsms.com/api/V2/SMS';
                    $payload = [
                        'apiKey' => trim($apiKey),
                        'userName' => trim($userName),
                        'senderName' => trim($senderId),
                        'transactionType' => 'T',
                        'mobileNumber' => $intlPhone,
                        'message' => $message,
                        'campaignName' => 'null',
                    ];

                    $response = Http::timeout(12)
                        ->withHeaders([
                            'Content-Type' => 'application/json',
                            'Accept' => 'application/json',
                        ])
                        ->post($url, $payload);

                    $body = $response->body();
                    $data = json_decode($body, true);

                    if (is_array($data)) {
                        $statusCode = $data['statusCode'] ?? ($data['code'] ?? null);
                        $status = strtolower((string)($data['status'] ?? ''));
                        $responseResult = $data['responseResult'] ?? ($data['message'] ?? '');

                        $isOk = ($statusCode == '200' || $statusCode == 200 || $status === 'success' || str_contains(strtolower($responseResult), 'successful'));

                        if ($isOk) {
                            $trxId = $data['trxnId'] ?? '';
                            return [
                                'success' => true,
                                'message' => 'MIM SMS: ' . ($responseResult ?: 'SMS sent successfully!') . ($trxId ? " (Trx ID: {$trxId})" : '')
                            ];
                        }

                        $errorDetail = '';
                        if (!empty($data['error_Data']) && is_array($data['error_Data'])) {
                            $errList = [];
                            foreach ($data['error_Data'] as $err) {
                                if (is_array($err) && !empty($err['error'])) {
                                    $errList[] = $err['error'];
                                } elseif (is_string($err)) {
                                    $errList[] = $err;
                                }
                            }
                            if (!empty($errList)) {
                                $errorDetail = ' (' . implode(', ', $errList) . ')';
                            }
                        }

                        return [
                            'success' => false,
                            'message' => 'MIM SMS: ' . ($responseResult ?: 'Failed') . $errorDetail . ($status ? " [Status: {$status}]" : '')
                        ];
                    }

                    return [
                        'success' => $response->successful(),
                        'message' => 'MIM SMS: ' . $body
                    ];

                case 'sslwireless':
                    // SSL Wireless SMSPlus
                    $url = 'https://smsplus.sslwireless.com/api/v3/send-sms';
                    $response = Http::timeout(10)->post($url, [
                        'api_token' => $apiKey,
                        'sid' => $senderId,
                        'msisdn' => $intlPhone,
                        'sms' => $message,
                        'csms_id' => uniqid(),
                    ]);
                    return [
                        'success' => $response->successful(),
                        'message' => 'SSL Wireless: ' . $response->body()
                    ];

                case 'twilio':
                    // Twilio Global SMS
                    $accountSid = $apiKey;
                    $authToken = $apiSecret;
                    $twilioUrl = "https://api.twilio.com/2010-04-01/Accounts/{$accountSid}/Messages.json";
                    $response = Http::timeout(10)->withBasicAuth($accountSid, $authToken)->asForm()->post($twilioUrl, [
                        'From' => $senderId,
                        'To' => '+' . $intlPhone,
                        'Body' => $message,
                    ]);
                    return [
                        'success' => $response->successful(),
                        'message' => $response->successful() ? 'Twilio SMS sent successfully.' : 'Twilio: ' . $response->body()
                    ];

                case 'custom':
                    if (empty($apiUrl)) {
                        return ['success' => false, 'message' => 'Custom SMS API URL is empty in settings.'];
                    }
                    $finalUrl = str_replace(
                        ['{phone}', '{to}', '{number}', '{message}', '{msg}', '{apikey}', '{api_key}', '{senderid}', '{sender_id}'],
                        [urlencode($localPhone), urlencode($localPhone), urlencode($localPhone), urlencode($message), urlencode($message), urlencode($apiKey), urlencode($apiKey), urlencode($senderId), urlencode($senderId)],
                        $apiUrl
                    );
                    $response = Http::timeout(10)->get($finalUrl);
                    return [
                        'success' => $response->successful(),
                        'message' => 'Custom Gateway: ' . $response->body()
                    ];

                default:
                    return ['success' => false, 'message' => "Unknown SMS Provider: {$provider}"];
            }
        } catch (\Throwable $e) {
            Log::error('SMS Dispatch Error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'SMS Gateway Exception: ' . $e->getMessage()
            ];
        }
    }
}
