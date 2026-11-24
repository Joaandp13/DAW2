# Guía paso a paso: añadir Discord a Hybridauth en NF1

Guía para **actualizar** la implementación existente de Hybridauth (ya tienes GitHub) y añadir **Discord** como segundo proveedor.

## Estado actual (ya lo tienes)

- Hybridauth instalado por Composer.
- `config/hybridauth.php` con GitHub y carga de `.env`.
- `.env` / `.env.example` / `.gitignore`.
- Migración BD OAuth aplicada (`oauth_provider`, `oauth_uid`, `password` NULL).
- Métodos OAuth en `Model/users.model.php`.
- Endpoints `oauth.php` y `oauth_callback.php`.
- Botón de GitHub activo en `view/Users/login.php`.

No hace falta cambiar la base de datos ni el modelo: ya soportan cualquier proveedor.

---

## 1. Crear la aplicación en Discord

1. Entra en [Discord Developer Portal](https://discord.com/developers/applications).
2. Pulsa **New Application**.
3. Pon un nombre, por ejemplo `NF1 Local`, y crea la aplicación.
4. En el menú lateral, entra en **OAuth2**.
5. Copia el **Client ID**.
6. Pulsa **Reset Secret** (o copia el existente si lo ves) y guarda el **Client Secret**.
7. En **Redirects**, pulsa **Add Redirect** y añade exactamente:

   ```text
   http://localhost/NF1/oauth_callback.php
   ```

8. Guarda los cambios (**Save Changes**).

> El redirect debe coincidir exactamente con el `callback` de `config/hybridauth.php`.

---

## 2. Añadir variables al `.env`

Edita `C:\GitHub\DAW2\BACKEND\XAMPP\htdocs\NF1\.env` y añade:

```env
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

DISCORD_CLIENT_ID=tu_discord_client_id
DISCORD_CLIENT_SECRET=tu_discord_client_secret
```

Actualiza también `.env.example`:

```env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
```

---

## 3. Actualizar `config/hybridauth.php`

Añade el proveedor `Discord` dentro de `providers`:

```php
<?php

$autoload = __DIR__ . '/../vendor/autoload.php';
if (is_file($autoload)) {
    require_once $autoload;
}

if (class_exists(Dotenv\Dotenv::class)) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
    $dotenv->safeLoad();
}

return [
    'callback' => 'http://localhost/NF1/oauth_callback.php',
    'providers' => [
        'GitHub' => [
            'enabled' => true,
            'keys' => [
                'id' => $_ENV['GITHUB_CLIENT_ID'] ?? getenv('GITHUB_CLIENT_ID') ?: '',
                'secret' => $_ENV['GITHUB_CLIENT_SECRET'] ?? getenv('GITHUB_CLIENT_SECRET') ?: '',
            ],
            'scope' => 'user:email',
        ],
        'Discord' => [
            'enabled' => true,
            'keys' => [
                'id' => $_ENV['DISCORD_CLIENT_ID'] ?? getenv('DISCORD_CLIENT_ID') ?: '',
                'secret' => $_ENV['DISCORD_CLIENT_SECRET'] ?? getenv('DISCORD_CLIENT_SECRET') ?: '',
            ],
            'scope' => 'identify email',
        ],
    ],
];
```

---

## 4. Actualizar `oauth.php`

Cambia la whitelist y los textos genéricos para aceptar Discord.

### Antes

```php
$proveidorsPermesos = ['GitHub'];
```

### Después

```php
$proveidorsPermesos = ['GitHub', 'Discord'];
```

También puedes actualizar el comentario inicial:

```php
/**
 * Inicia el flujo OAuth con un proveedor soportado.
 */
```

No hace falta tocar la lógica de `authenticate()`; Hybridauth ya recibe `$provider`.

---

## 5. Actualizar `oauth_callback.php`

Este archivo tiene mensajes y valores por defecto hardcodeados a GitHub. Hay que hacerlo genérico.

### 5.1 Whitelist y provider por defecto

Antes:

```php
$proveidorsPermesos = ['GitHub'];
$provider = (string) ($_GET['provider'] ?? $_SESSION['HYBRIDAUTH::STORAGE::LAST_PROVIDER'] ?? 'GitHub');
```

Después:

```php
$proveidorsPermesos = ['GitHub', 'Discord'];
$provider = (string) ($_GET['provider'] ?? $_SESSION['HYBRIDAUTH::STORAGE::LAST_PROVIDER'] ?? '');
```

Si el provider queda vacío o no es válido, el control actual ya redirige con error.

### 5.2 Mensajes de error genéricos

Sustituye los mensajes específicos de GitHub:

Antes:

```php
posarFlash('error', 'GitHub no ha retornat un identificador d\'usuari vàlid.');
```

Después:

```php
posarFlash('error', $provider . ' no ha retornat un identificador d\'usuari vàlid.');
```

Antes:

```php
posarFlash('error', 'GitHub no ha retornat el correu. Revisa la configuració de privacitat del teu compte de GitHub.');
```

Después:

```php
posarFlash('error', $provider . ' no ha retornat el correu. Revisa la configuració de privacitat del teu compte.');
```

### 5.3 Nombre de usuario por defecto

Antes:

```php
$base = strstr($email, '@', true) ?: 'github_user';
```

Después:

```php
$base = strstr($email, '@', true) ?: strtolower($provider) . '_user';
```

### 5.4 Mensajes finales

Antes:

```php
posarFlash('ok', 'Sessió iniciada amb GitHub.');
```

Después:

```php
posarFlash('ok', 'Sessió iniciada amb ' . $provider . '.');
```

Antes:

```php
posarFlash('error', 'Error en autenticar amb GitHub.');
```

Después:

```php
posarFlash('error', 'Error en autenticar amb ' . $provider . '.');
```

### 5.5 Comentario inicial

Antes:

```php
/**
 * Callback OAuth: recibe la respuesta de GitHub, crea/vincula el usuario
 * y abre la sesión local de NF1.
 */
```

Después:

```php
/**
 * Callback OAuth: recibe la respuesta del proveedor, crea/vincula el usuario
 * y abre la sesión local de NF1.
 */
```

---

## 6. Actualizar el botón de Discord en `view/Users/login.php`

Ahora mismo el botón de Discord está desactivado:

```html
<button type="button" disabled aria-label="Inicia sessió amb Discord"
        class="flex-1 h-11 grid place-items-center border border-gold rounded-full opacity-50 cursor-not-allowed">
    <img src="img/icons/discord_logo.svg" alt="" aria-hidden="true" class="w-5 h-5 block">
</button>
```

Cámbialo por un enlace activo, igual que el de GitHub:

```html
<a href="oauth.php?provider=Discord"
   aria-label="Inicia sessió amb Discord"
   class="flex-1 h-11 grid place-items-center border border-gold rounded-full hover:bg-[#343C73] hover:brightness-110 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
    <img src="img/icons/discord_logo.svg" alt="" aria-hidden="true" class="w-5 h-5 block">
</a>
```

---

## 7. Comprobar

### Checklist

- [ ] Aplicación creada en Discord Developer Portal.
- [ ] Redirect `http://localhost/NF1/oauth_callback.php` añadido en Discord OAuth2.
- [ ] `DISCORD_CLIENT_ID` y `DISCORD_CLIENT_SECRET` añadidos en `.env`.
- [ ] `Discord` añadido en `config/hybridauth.php`.
- [ ] `Discord` añadido a la whitelist de `oauth.php`.
- [ ] `oauth_callback.php` actualizado con whitelist y mensajes genéricos.
- [ ] Botón de Discord activo en `view/Users/login.php`.

### Prueba manual

1. Abre `http://localhost/NF1/login.php`.
2. Pulsa **Discord**.
3. Autoriza la aplicación en Discord.
4. Deberías volver a NF1 logueado.
5. Comprueba en BD:

```sql
SELECT id, usermail, username, admin, oauth_provider, oauth_uid
FROM usuaris
WHERE oauth_provider = 'Discord';
```

---

## 8. Problemas comunes

| Problema | Causa probable | Solución |
|---|---|---|
| `Invalid OAuth2 redirect_uri` | El redirect en Discord no coincide | Debe ser exactamente `http://localhost/NF1/oauth_callback.php` |
| No vuelve el email | Falta scope `email` o el usuario no tiene email verificable | Usa scope `identify email`; revisa el email de la cuenta Discord |
| `Proveïdor OAuth no vàlid` | Falta `Discord` en whitelist | Añádelo en `oauth.php` y `oauth_callback.php` |
| Error al iniciar sesión | Client ID/Secret incorrectos o `.env` no cargado | Revisa `.env`, reinicia Apache si hace falta, y comprueba `config/hybridauth.php` |
| Usuario duplicado inesperado | Política de vinculación por email | Revisa la lógica de `buscarPerEmail` + `vincularOAuth` en `oauth_callback.php` |

---

## 9. Nota sobre la BD

No hace falta migración nueva: la tabla `usuaris` ya tiene `oauth_provider` y `oauth_uid`, y la clave única `(oauth_provider, oauth_uid)` permite guardar usuarios de distintos proveedores.

Si en el futuro quieres permitir que **un mismo usuario NF1** vincule varios proveedores (GitHub y Discord a la vez), habrá que pasar a una tabla `user_social` separada. Con el esquema actual, un usuario solo puede tener un proveedor/UID OAuth en esos campos.