<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('app');
});

use App\Http\Controllers\UserController ;
Route::resource('/users', UserController::class);

use App\Http\Controllers\TypeController ;
Route::resource('/types', TypeController::class);

use App\Http\Controllers\TypeAnalyseController;
Route::resource('/type_analyses', TypeAnalyseController::class);
// Route::middleware('web')->group(function () {
//     Route::post('/login', [AuthController::class, 'login']);
// });



Route::get('/curl-test', function () {
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, "https://api.pusher.com/");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    $output = curl_exec($ch);
    $error = curl_error($ch);

    curl_close($ch);

    return $error ?: 'Success';
});

// Route::get('/google-test', function () {
    // $ch = curl_init("https://www.google.com");
    // curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    // curl_setopt($ch, CURLOPT_CAINFO, "C:/wamp64/bin/php/php8.2.18/cacert.pem"); // Manually set cert path
    // $result = curl_exec($ch);
    // $error = curl_error($ch);
    // curl_close($ch);
    // return $error ?: 'Google loaded successfully!';
  // Disable SSL verification temporarily

// });
use GuzzleHttp\Client;

Route::get('/pusher-test', function () {
    $appId = '1936023';
    $authKey = '984c1f808654acf1bb8f';
    $appSecret = 'a86bf12e437d031662ea';
    $authTimestamp = time();
    $authVersion = '1.0';

    $body = json_encode([
        'name' => 'my-event',
        'channels' => ['my-channel'],
        'data' => json_encode(['message' => 'Hello, World!']),
    ]);

    $bodyMd5 = md5($body);

    $queryParams = http_build_query([
        'auth_key' => $authKey,
        'auth_timestamp' => $authTimestamp,
        'auth_version' => $authVersion,
        'body_md5' => $bodyMd5,
    ]);

    $stringToSign = "POST\n/apps/{$appId}/events\n{$queryParams}";

    $authSignature = hash_hmac('sha256', $stringToSign, $appSecret);

    $url = "https://api-mt1.pusher.com/apps/{$appId}/events?$queryParams&auth_signature=$authSignature";

    $client = new Client();

    $response = $client->post($url, [
        'headers' => ['Content-Type' => 'application/json'],
        'body' => $body,
        'verify' => false, // REMOVE THIS IN PRODUCTION
    ]);

    return dd($response);
});


Route::get('/ssl-test', function () {
    $path = ini_get('curl.cainfo');
    return [
        'path_exists' => file_exists($path),
        'path' => $path,
        'readable' => is_readable($path),
        'realpath' => realpath($path),
    ];
});
use Illuminate\Support\Facades\Http;

Route::get('/test-ssl', function () {
    $response = Http::withOptions(['verify' => false])->get('https://api.pusherapp.com/');
    return $response->body();
});

Route::get('/verify-test', function () {
    $response = Http::get('https://api.pusherapp.com/');
    return $response->body();
});
Route::get('/phpinfo', function () {
    phpinfo();
});
