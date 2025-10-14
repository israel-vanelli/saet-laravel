<?php

use App\Services\Slack\SlackEventService;
use App\Services\Slack\SlackService;
use GuzzleHttp\Exception\BadResponseException;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Symfony\Component\Console\Output\ConsoleOutput;

if (!function_exists('isEnvDevelopment')) {
    /**
     * Is Env Staging
     * 
     * Returns wether or not current environment is staging
     * 
     * @return bool
     */
    function isEnvDevelopment()
    {
        return app()->environment() == "development";
    }
}

if (!function_exists('line')) {
    function line($string, $style = 'info')
    {
        $output = new ConsoleOutput();

        $styled = "<$style>  $string</$style>";

        $output->writeln($styled);
    }
}

if (!function_exists('isEnvLocal')) {
    /**
     * Is Env Local
     * 
     * Returns whether or not current environment is local, by checking if it's different than production
     * 
     * @return bool
     */
    function isEnvLocal()
    {
        return in_array(app()->environment(), ["local"]);
    }
}

if (!function_exists('isEnvTesting')) {
    /**
     * Is Env Testing
     * 
     * Returns whether or not current environment is testing
     * 
     * @return bool
     */
    function isEnvTesting()
    {
        return in_array(app()->environment(), ["testing"]);
    }
}

if (!function_exists('isEnvProduction')) {
    /**
     * Is Env Production
     * 
     * Returns wether or not current environment is production
     * 
     * @return bool
     */
    function isEnvProduction()
    {
        return app()->environment() == "production";
    }
}

if (!function_exists("logError")) {
    function logError($message, array $context = [], $tags = [])
    {
        $context = array_merge([
            'telescopable' => true,
            'telescope_tags' => $tags
        ], $context);

        app('log')->error($message, $context);
    }
}

if (!function_exists("logInfo")) {
    function logInfo($message, array $context = [], $tags = [])
    {
        $context = array_merge([
            'telescopable' => true,
            'telescope_tags' => $tags
        ], $context);

        app('log')->info($message, $context);
    }
}

if (!function_exists('getMimeFromBinary')) {
    function getMimeFromBinary($binary_content, $extension_only = false)
    {
        $finfo = new finfo(FILEINFO_MIME_TYPE);

        $mime = $finfo->buffer($binary_content);

        return $extension_only ? explode('/', $mime)[1] : $mime;
    }
}

if (!function_exists('user')) {
    /**
     * Get the currently authenticated user.
     * 
     * @param string|null $guard
     * 
     * @return \App\Models\User|null|\Illuminate\Contracts\Auth\Authenticatable
     */
    function user($guard = null)
    {
        return auth($guard)->user();
    }
}

if (!function_exists('humanFileSize')) {

    /**
     * Convert bytes to human readable file size
     * 
     * @param int $bytes
     * @param int $dec
     * 
     * @return string
     * 
     * @see https://stackoverflow.com/a/23888858
     */
    function humanFileSize($bytes, $dec = 2)
    {
        $bytes ??= 0;

        $size   = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        $factor = floor((strlen($bytes) - 1) / 3);
        if ($factor == 0) $dec = 0;

        return sprintf("%.{$dec}f %s", $bytes / (1024 ** $factor), $size[$factor]);
    }
}

if (!function_exists('removePrefix')) {
    function removePrefix($string, $prefix)
    {
        return str($string)->removePrefix($prefix)->toString();
    }
}

if (!function_exists('removeSuffix')) {
    function removeSuffix($string, $suffix)
    {
        return str($string)->removeSuffix($suffix)->toString();
    }
}

if (!function_exists('urlQueryParams')) {
    function urlQueryParams($url, $param = null)
    {
        $parts = parse_url($url);

        parse_str($parts['query'] ?? "", $query);

        return $param ? ($query[$param] ?? null) : $query;
    }
}

if (!function_exists('addQueryParamsToUrl')) {
    function addQueryParamsToUrl($url, $params)
    {
        $url_params = urlQueryParams($url);

        $parsed_url = parse_url($url);

        $scheme = $parsed_url["scheme"];
        $host = $parsed_url["host"];
        $path = $parsed_url["path"];

        $params = array_merge($url_params, $params);

        $query_string = http_build_query($params);

        if ($query_string != "") {
            $query_string = "?$query_string";
        }

        $new_url = "{$scheme}://{$host}{$path}{$query_string}";

        return $new_url;
    }
}

if (!function_exists('isJson')) {
    function isJson($value)
    {
        json_decode($value);
        return json_last_error() === JSON_ERROR_NONE;
    }
}

if (!function_exists('apiCall')) {
    /**
     * Makes API call to an endpoint.
     *
     * @param string $endpoint - Endpoint to be called.
     * @param string $method - Request method (case insensitive)
     * @param array $body - HTTP body
     * @param array $headers - HTTP extra headers (case insensitive)
     * @param array $params - URL query params
     * @param boolean $http_errors - Decides if HTTP exceptions are thrown
     * @param boolean $debug - Informs if apiCall should print request description
     * @return Illuminate\Http\Client\Response
     * @throws \GuzzleHttp\Exception\ClientException
     */
    function apiCall($endpoint, $method = 'GET', $body = [], $headers = [], $params = [], $http_errors = true, $debug = false, $verify = null)
    {
        $default_options = [
            'method' => 'GET',
            'body' => [],
            'headers' => [
                'accept' => 'application/json',
                'content-type' => 'application/json'
            ],
            'params' => []
        ];

        // Force lowercase headers
        $headers = collect($headers)->mapWithKeys(function ($value, $key) {
            return [strtolower($key) => $value];
        })->toArray();

        // Merge options
        $method = $method ?? $default_options['method'];
        $body = is_array($body) ? array_merge($default_options['body'], $body) : $body;
        $headers = array_merge($default_options['headers'], $headers);
        $params = array_merge($default_options['params'], $params);

        $method = strtoupper($method);

        $available_methods = ['HEAD', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
        if (!in_array($method, $available_methods)) {
            $methods_string = implode(', ', $available_methods);
            throw new Exception("Method is not in the available methods (try one of: $methods_string)");
        }

        $max_memory = 1024 * 1024 * 100; // 100MB is kept in memory until it's written to disk, at the /tmp directory

        $guzzleOptions = [
            'headers' => $headers,
            'verify' => is_null($verify) ? app()->environment('production') : boolval($verify), // Don't require SSL certificate if env is local
        ];

        if (Str::startsWith(($headers['content-type'] ?? ''), 'application/json') && !in_array($method, ['GET'])) {
            $guzzleOptions['json'] = $body;
        } else if (!in_array($method, ['GET'])) {
            $guzzleOptions['body'] = $body;
        }

        if ($http_errors) {
            $guzzleOptions['http_errors'] = true;
        }

        if ($params) {
            $endpoint = addQueryParamsToUrl($endpoint, $params);
        }

        $user = user();

        if ($user) {
            $user = $user->toArray();
        }

        $tags = [];

        if ($user) {
            try {
                $tags[] = "Auth:{$user['id']}";
            } catch (\Throwable $th) {
            }
        }

        try {
            $max_memory = 1024 * 1024 * 100; // 100MB is kept in memory until it's written to disk, at the /tmp directory

            // The sink is set in this line because the loggers can not contain a closure inside the contexts,
            // so in order to prevent having to use "unset($guzzleOptions['sink'])" after the request,
            // the sink is set here, and the loggers will not have the sink in the context.
            $http_response = Http::send($method, $endpoint, array_merge($guzzleOptions, [
                'sink' => fopen("php://temp/maxmemory:{$max_memory}", 'r+'),
            ]));

            $code = $http_response->status();
            $response_body = $http_response->body();

            if ($http_response->failed()) {
                logError("apiCall Failed with Status Code: {$code} - " . str($endpoint)->limit(100), [
                    'user' => $user,
                    'method' => $method,
                    'endpoint' => $endpoint,
                    'guzzle_options' => $guzzleOptions,
                    'response_content' => isJson($response_body) ? json_decode($response_body, true) : $response_body
                ], $tags);
            }

            if ($debug) {
                logInfo("apiCall Debug - " . str($endpoint)->limit(100), [
                    'user' => $user,
                    'method' => $method,
                    'endpoint' => $endpoint,
                    'guzzle_options' => $guzzleOptions,
                    'response_content' => isJson($response_body) ? json_decode($response_body, true) : $response_body
                ], $tags);
            }

            return $http_response;
        } catch (BadResponseException $exception) {
            $code = $exception->getCode();
            $response_body = $exception->getResponse()?->getBody()?->getContents();

            logError("apiCall Failed with Status Code: {$code}. Exception message: " . $exception->getMessage(), [
                'user' => $user,
                'method' => $method,
                'endpoint' => $endpoint,
                'guzzle_options' => $guzzleOptions,
                'response_content' => isJson($response_body) ? json_decode($response_body, true) : $response_body
            ], $tags);

            throw $exception;
        } catch (\Throwable $th) {

            logError("apiCall Failed with Exception: " . $th->getMessage(), [
                'user' => $user,
                'method' => $method,
                'endpoint' => $endpoint,
                'guzzle_options' => $guzzleOptions,
            ], $tags);

            throw $th;
        }
    }
}
