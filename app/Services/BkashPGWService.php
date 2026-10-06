<?php

namespace App\Services;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BkashPGWService
{
    protected string $baseUrl;
    protected ?string $appKey;
    protected ?string $appSecret;
    protected ?string $username;
    protected ?string $password;
    protected bool $enabled;

    public function __construct()
    {
        $this->enabled = (string) SiteSetting::get('bkash_enabled', '0') === '1';
        $mode = SiteSetting::get('bkash_mode', 'sandbox');
        
        $configuredBaseUrl = SiteSetting::get('bkash_base_url');
        if (!empty($configuredBaseUrl)) {
            $this->baseUrl = rtrim($configuredBaseUrl, '/');
        } else {
            $this->baseUrl = $mode === 'live' 
                ? 'https://tokenized.pay.bka.sh/v1.2.0-beta' 
                : 'https://tokenized.sandbox.bka.sh/v1.2.0-beta';
        }

        $this->appKey = SiteSetting::get('bkash_app_key');
        $this->appSecret = SiteSetting::get('bkash_app_secret');
        $this->username = SiteSetting::get('bkash_username');
        $this->password = SiteSetting::get('bkash_password');
    }

    /**
     * Check if merchant credentials are configured.
     */
    public function isConfigured(): bool
    {
        return !empty($this->appKey) 
            && !empty($this->appSecret) 
            && !empty($this->username) 
            && !empty($this->password);
    }

    /**
     * Check if bKash PGW is enabled in settings.
     */
    public function isEnabled(): bool
    {
        return $this->enabled && $this->isConfigured();
    }

    /**
     * Grant / Refresh bKash token.
     */
    public function grantToken(): ?string
    {
        if (!$this->isConfigured()) {
            return null;
        }

        $cacheKey = 'bkash_pgw_token_' . md5($this->appKey);
        if ($cachedToken = Cache::get($cacheKey)) {
            return $cachedToken;
        }

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'username' => $this->username,
                'password' => $this->password,
            ])->post("{$this->baseUrl}/tokenized/checkout/token/grant", [
                'app_key' => $this->appKey,
                'app_secret' => $this->appSecret,
            ]);

            $data = $response->json();

            if ($response->successful() && !empty($data['id_token'])) {
                $expiresIn = (int) ($data['expires_in'] ?? 3600);
                Cache::put($cacheKey, $data['id_token'], max(60, $expiresIn - 120));
                return $data['id_token'];
            }

            Log::error('bKash grant token error', [
                'status' => $response->status(),
                'response' => $data,
            ]);
            return null;
        } catch (\Throwable $e) {
            Log::error('bKash grant token exception: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Create bKash Payment.
     */
    public function createPayment(float $amount, string $invoiceNumber, string $callbackUrl, string $payerRef = 'Client'): array
    {
        $token = $this->grantToken();
        if (!$token) {
            return [
                'success' => false,
                'message' => 'Failed to obtain authorization token from bKash. Please verify merchant credentials in Admin Settings.',
            ];
        }

        try {
            $formattedAmount = number_format($amount, 2, '.', '');
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'authorization' => $token,
                'x-app-key' => $this->appKey,
            ])->post("{$this->baseUrl}/tokenized/checkout/create", [
                'mode' => '0011',
                'payerReference' => substr($payerRef, 0, 20),
                'callbackURL' => $callbackUrl,
                'amount' => $formattedAmount,
                'currency' => 'BDT',
                'intent' => 'sale',
                'merchantInvoiceNumber' => $invoiceNumber,
            ]);

            $data = $response->json();

            if ($response->successful() && isset($data['statusCode']) && $data['statusCode'] === '0000') {
                return [
                    'success' => true,
                    'paymentID' => $data['paymentID'],
                    'bkashURL' => $data['bkashURL'],
                    'data' => $data,
                ];
            }

            $errMsg = $data['statusMessage'] ?? $data['message'] ?? 'Could not initiate bKash payment.';
            Log::error('bKash create payment failed', ['response' => $data]);
            return [
                'success' => false,
                'message' => $errMsg,
            ];
        } catch (\Throwable $e) {
            Log::error('bKash create payment exception: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'bKash gateway connection failed: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Execute bKash Payment after callback.
     */
    public function executePayment(string $paymentId): array
    {
        $token = $this->grantToken();
        if (!$token) {
            return [
                'success' => false,
                'message' => 'Failed to authorize with bKash API during execution.',
            ];
        }

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'authorization' => $token,
                'x-app-key' => $this->appKey,
            ])->post("{$this->baseUrl}/tokenized/checkout/execute", [
                'paymentID' => $paymentId,
            ]);

            $data = $response->json();

            if ($response->successful() 
                && isset($data['statusCode']) 
                && $data['statusCode'] === '0000' 
                && ($data['transactionStatus'] ?? '') === 'Completed') {
                return [
                    'success' => true,
                    'trxID' => $data['trxID'] ?? $paymentId,
                    'amount' => (float) ($data['amount'] ?? 0),
                    'paymentID' => $data['paymentID'] ?? $paymentId,
                    'customerMsisdn' => $data['customerMsisdn'] ?? null,
                    'data' => $data,
                ];
            }

            $errMsg = $data['statusMessage'] ?? 'Payment execution was not completed or was cancelled.';
            Log::error('bKash execute payment failed', ['response' => $data]);
            return [
                'success' => false,
                'message' => $errMsg,
                'data' => $data,
            ];
        } catch (\Throwable $e) {
            Log::error('bKash execute payment exception: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Execution error: ' . $e->getMessage(),
            ];
        }
    }
}
