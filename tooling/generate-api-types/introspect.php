<?php

declare(strict_types=1);

/**
 * Walks every registered v1/* route in a lemonade-backend checkout and dumps
 * a JSON manifest: method, URL, route name, auth guard, and — when the
 * controller method type-hints one — the FormRequest class name plus its
 * rules() as raw token arrays (not baked example values; generate.ts does
 * its own rule -> TypeScript type inference from these).
 *
 * This intentionally lives in lemonade-web, not lemonade-backend: it's the
 * TypeScript-generation pipeline's own input step, pointed at a sibling
 * backend checkout via argv[1], not a tool the backend repo itself needs.
 * See lemonade-backend's postman/generate-manifest.php for the sibling
 * script this is adapted from (same route-walking approach, different
 * output — that one bakes example request bodies for Postman, this one
 * keeps raw rule tokens for type inference).
 *
 * Usage: php introspect.php /path/to/lemonade-backend > manifest.json
 */

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Route;

$backendPath = $argv[1] ?? null;
if (! $backendPath || ! is_dir($backendPath)) {
    fwrite(STDERR, "Usage: php introspect.php /path/to/lemonade-backend\n");
    exit(1);
}
$backendPath = rtrim($backendPath, '/');

require $backendPath . '/vendor/autoload.php';

$app = require $backendPath . '/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

/** Normalizes one field's rule set (string|array, possibly rule objects) into a flat token list. */
function ruleTokens(array $rules): array
{
    $tokens = [];
    foreach ($rules as $rule) {
        if (is_string($rule)) {
            array_push($tokens, ...explode('|', $rule));
        } elseif (is_object($rule)) {
            $tokens[] = lcfirst(class_basename($rule));
        }
    }

    return $tokens;
}

$routes = [];

foreach (Route::getRoutes() as $route) {
    $uri = $route->uri();
    if (! str_starts_with($uri, 'v1/')) {
        continue;
    }

    $methods = array_values(array_diff($route->methods(), ['HEAD']));
    $method = $methods[0] ?? 'GET';

    $guard = null;
    foreach ($route->gatherMiddleware() as $middleware) {
        if (str_contains($middleware, 'admin') && (str_starts_with($middleware, 'auth:') || str_contains($middleware, 'Authenticate:'))) {
            $guard = 'admin';
            break;
        }
        if (str_contains($middleware, 'user') && (str_starts_with($middleware, 'auth:') || str_contains($middleware, 'Authenticate:'))) {
            $guard = 'user';
            break;
        }
    }

    $action = $route->getActionName();
    $formRequestClass = null;
    $fields = null;

    if (str_contains($action, '@')) {
        [$controllerClass, $methodName] = explode('@', $action);
        if (class_exists($controllerClass) && method_exists($controllerClass, $methodName)) {
            try {
                $reflection = new ReflectionMethod($controllerClass, $methodName);
                foreach ($reflection->getParameters() as $param) {
                    $type = $param->getType();
                    if (! $type instanceof ReflectionNamedType || $type->isBuiltin()) {
                        continue;
                    }
                    $paramClass = $type->getName();
                    if (is_subclass_of($paramClass, FormRequest::class)) {
                        $formRequestClass = $paramClass;
                        break;
                    }
                }
            } catch (Throwable) {
                // leave $formRequestClass null
            }
        }
    }

    if ($formRequestClass) {
        try {
            // Deliberately `new`, not app()->make() — resolving through the
            // container triggers ValidatesWhenResolved and throws immediately
            // outside an actual HTTP request. A bare `new` skips that.
            $rules = (new $formRequestClass)->rules();
            $fields = [];
            foreach ($rules as $field => $ruleSet) {
                $ruleSet = is_array($ruleSet) ? $ruleSet : [$ruleSet];
                $fields[$field] = ruleTokens($ruleSet);
            }
        } catch (Throwable) {
            $fields = null;
        }
    }

    $routes[] = [
        'method' => $method,
        'uri' => '/' . $uri,
        'name' => $route->getName(),
        'guard' => $guard,
        'formRequest' => $formRequestClass,
        'fields' => $fields,
    ];
}

usort($routes, fn ($a, $b) => ($a['name'] ?? '') <=> ($b['name'] ?? ''));

echo json_encode($routes, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
