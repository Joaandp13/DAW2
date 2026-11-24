# Guía paso a paso: Hybridauth con GitHub en NF1

Guía para añadir login social con **GitHub** al proyecto NF1 usando [Hybridauth 3](https://hybridauth.github.io/). De momento solo se configura GitHub.

## Resumen

| Elemento | Valor |
|---|---|
| Proveedor | GitHub |
| Librería | `hybridauth/hybridauth` (Composer) |
| URL local | `http://localhost/NF1/` |
| Callback | `http://localhost/NF1/oauth_callback.php` |

> Ajusta `http://localhost/NF1/` si tu proyecto se sirve en otra ruta o puerto.

---

## 1. Prerrequisitos

- PHP 8.x con extensiones `curl`, `openssl`, `mbstring`, `json`, `session`.
- Composer instalado: `composer --version`.
- XAMPP/Apache y MySQL arrancados.
- Proyecto NF1 funcionando en local.

---

## 2. Crear la OAuth App en GitHub

1. Entra en GitHub > **Settings**.
2. Abajo del menú lateral: **Developer settings**.
3. **OAuth Apps** > **New OAuth App** (o *Register a new application*).
4. Rellena el formulario:

   | Campo | Valor |
   |---|---|
   | **Application name** | `NF1 Local` (o el nombre que quieras) |
   | **Homepage URL** | `http://localhost/NF1/` |
   | **Application description** | Opcional |
   | **Authorization callback URL** | `http://localhost/NF1/oauth_callback.php` |

5. Pulsa **Register application**.
6. Copia el **Client ID**.
7. Pulsa **Generate a new client secret** y copia el **Client Secret**.

> Guarda el Client Secret en un lugar seguro. No lo subas al repositorio.

---

## 3. Instalar Hybridauth con Composer

En la raíz del proyecto NF1:

```bash
cd C:\GitHub\DAW2\BACKEND\XAMPP\htdocs\NF1
composer require hybridauth/hybridauth
```

Esto crea/actualiza:

- `composer.json`
- `composer.lock`
- `vendor/` (contiene Hybridauth y el autoload)

Para cargarlo en PHP:

```php
require_once __DIR__ . '/vendor/autoload.php';
```

---

## 4. Configuración de Hybridauth

Crea `config/hybridauth.php`. **No pongas secretos reales directamente si vas a subir el repo**.

### Opción recomendada: leer variables de entorno

```php
<?php
// config/hybridauth.php
return [
    'callback' => 'http://localhost/NF1/oauth_callback.php',
    'providers' => [
        'GitHub' => [
            'enabled' => true,
            'keys' => [
                'id' => getenv('GITHUB_CLIENT_ID') ?: '',
                'secret' => getenv('GITHUB_CLIENT_SECRET') ?: '',
            ],
            'scope' => 'user:email',
        ],
    ],
];
```

### Opción local rápida (no commitear)

Si quieres probar rápido, puedes crear `config/hybridauth.local.php` con los valores reales y cargarlo desde `config/hybridauth.php`, pero **añádelo a `.gitignore`**:

```php
<?php
// config/hybridauth.php
$local = __DIR__ . '/hybridauth.local.php';
if (is_file($local)) {
    return require $local;
}

return [
    'callback' => 'http://localhost/NF1/oauth_callback.php',
    'providers' => [
        'GitHub' => [
            'enabled' => true,
            'keys' => [
                'id' => getenv('GITHUB_CLIENT_ID') ?: '',
                'secret' => getenv('GITHUB_CLIENT_SECRET') ?: '',
            ],
            'scope' => 'user:email',
        ],
    ],
];
```

```php
<?php
// config/hybridauth.local.php  (NO COMMITEAR)
return [
    'callback' => 'http://localhost/NF1/oauth_callback.php',
    'providers' => [
        'GitHub' => [
            'enabled' => true,
            'keys' => [
                'id' => 'TU_CLIENT_ID',
                'secret' => 'TU_CLIENT_SECRET',
            ],
            'scope' => 'user:email',
        ],
    ],
];
```

---

## 5. Migración de base de datos

Los usuarios OAuth no tienen contraseña local. También necesitamos guardar el proveedor y el identificador del usuario en GitHub.

Ejecuta este SQL en `backend_joan_diaz` (phpMyAdmin o cliente MySQL):

```sql
USE backend_joan_diaz;

ALTER TABLE usuaris
  MODIFY password VARCHAR(255) NULL;

ALTER TABLE usuaris
  ADD COLUMN IF NOT EXISTS oauth_provider VARCHAR(50) NULL AFTER admin,
  ADD COLUMN IF NOT EXISTS oauth_uid VARCHAR(191) NULL AFTER oauth_provider;

-- Evita duplicar la misma cuenta social
ALTER TABLE usuaris
  ADD UNIQUE KEY IF NOT EXISTS usuaris_oauth_uniq (oauth_provider, oauth_uid);
```

> Si tu MySQL/MariaDB no soporta `ADD COLUMN IF NOT EXISTS` o `ADD UNIQUE KEY IF NOT EXISTS` en tu versión, comprueba antes con `SHOW COLUMNS FROM usuaris;` y `SHOW INDEX FROM usuaris;`.

Después, añade esta migración también a:

- `config/backend_joan_diaz.sql` (esquema principal)
- `config/alter_backend_joan_diaz.sql` (migración idempotente)

---

## 6. Actualizar el modelo de usuarios

En `Model/users.model.php`, añade métodos para buscar/crear/vincular usuarios OAuth.

```php
/** Busca un usuario por proveedor OAuth y UID del proveedor. */
public function buscarPerOAuth(string $provider, string $providerUid): array|false
{
    $stmt = $this->db->prepare(
        'SELECT id, usermail, username, admin
         FROM usuaris
         WHERE oauth_provider = :provider AND oauth_uid = :uid
         LIMIT 1'
    );
    $stmt->execute(['provider' => $provider, 'uid' => $providerUid]);
    return $stmt->fetch();
}

/** Crea un usuario procedente de OAuth (sin contraseña local). */
public function registrarOAuth(string $email, string $username, string $provider, string $providerUid): int
{
    $stmt = $this->db->prepare(
        'INSERT INTO usuaris (usermail, username, password, admin, oauth_provider, oauth_uid)
         VALUES (:usermail, :username, NULL, 0, :provider, :uid)'
    );
    $stmt->execute([
        'usermail' => $email,
        'username' => $username,
        'provider' => $provider,
        'uid' => $providerUid,
    ]);
    return (int) $this->db->lastInsertId();
}

/** Vincula una cuenta OAuth a un usuario existente. */
public function vincularOAuth(int $id, string $provider, string $providerUid): void
{
    $stmt = $this->db->prepare(
        'UPDATE usuaris
         SET oauth_provider = :provider, oauth_uid = :uid
         WHERE id = :id'
    );
    $stmt->execute(['provider' => $provider, 'uid' => $providerUid, 'id' => $id]);
}
```

> Comprueba que ya existen `buscarPerEmail()` y `buscarPerUsername()`. Si no, añádelos también porque se usan para evitar colisiones.

---

## 7. Crear el endpoint de inicio OAuth

Crea `oauth.php` en la raíz de NF1. Este archivo inicia la autenticación con GitHub.

```php
<?php
/**
 * Inicia el flujo OAuth con un proveedor soportado (de momento, GitHub).
 */
require_once __DIR__ . '/core/auth.php';
require_once __DIR__ . '/vendor/autoload.php';

iniciarSessio();

$proveidorsPermesos = ['GitHub'];
$provider = (string) ($_GET['provider'] ?? '');

if (!in_array($provider, $proveidorsPermesos, true)) {
    posarFlash('error', 'Proveïdor OAuth no vàlid.');
    header('Location: login.php');
    exit;
}

$config = require __DIR__ . '/config/hybridauth.php';

try {
    $hybridauth = new Hybridauth\Hybridauth($config);
    $hybridauth->authenticate($provider); // Redirige a GitHub
    // Hybridauth normalmente redirige; si vuelve aquí, enviamos al callback.
    header('Location: oauth_callback.php?provider=' . rawurlencode($provider));
    exit;
} catch (Throwable $e) {
    error_log('OAuth start error: ' . $e->getMessage());
    posarFlash('error', 'No s\'ha pogut iniciar la sessió amb ' . $provider . '.');
    header('Location: login.php');
    exit;
}
```

---

## 8. Crear el callback OAuth

Crea `oauth_callback.php` en la raíz de NF1. GitHub redirigirá aquí después de autorizar.

```php
<?php
/**
 * Callback OAuth: recibe la respuesta de GitHub, crea/vincula el usuario
 * y abre la sesión local de NF1.
 */
require_once __DIR__ . '/core/auth.php';
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/Model/users.model.php';

iniciarSessio();

$proveidorsPermesos = ['GitHub'];
$provider = (string) ($_GET['provider'] ?? $_SESSION['HYBRIDAUTH::STORAGE::LAST_PROVIDER'] ?? 'GitHub');

if (!in_array($provider, $proveidorsPermesos, true)) {
    posarFlash('error', 'Proveïdor OAuth no vàlid.');
    header('Location: login.php');
    exit;
}

$config = require __DIR__ . '/config/hybridauth.php';

try {
    $hybridauth = new Hybridauth\Hybridauth($config);
    $adapter = $hybridauth->authenticate($provider);
    $profile = $adapter->getUserProfile();
    $adapter->disconnect();

    $uid = trim((string) ($profile->identifier ?? ''));
    $email = trim((string) ($profile->email ?? ''));
    $display = trim((string) ($profile->displayName ?? ''));
    $nickname = trim((string) ($profile->username ?? $profile->displayName ?? ''));

    if ($uid === '') {
        posarFlash('error', 'GitHub no ha retornat un identificador d\'usuari vàlid.');
        header('Location: login.php');
        exit;
    }

    // GitHub puede no devolver email público; en ese caso hay que decidir política.
    if ($email === '') {
        posarFlash('error', 'GitHub no ha retornat el correu. Revisa la configuració de privacitat del teu compte de GitHub.');
        header('Location: login.php');
        exit;
    }

    $users = new Users();

    // 1) ¿Ya existe este usuario OAuth?
    $usuari = $users->buscarPerOAuth($provider, $uid);

    if ($usuari === false) {
        // 2) Si el email ya existe, vinculamos la cuenta OAuth a ese usuario.
        // Revisa esta política si quieres exigir verificación adicional.
        $existentPerEmail = $users->buscarPerEmail($email);

        if ($existentPerEmail !== false) {
            $users->vincularOAuth((int) $existentPerEmail['id'], $provider, $uid);
            $usuari = $users->buscarPerOAuth($provider, $uid);
        } else {
            // 3) Crear usuario nuevo con username único
            $base = preg_replace('/[^a-zA-Z0-9_]/', '', $nickname !== '' ? $nickname : $display);
            if ($base === '') {
                $base = strstr($email, '@', true) ?: 'github_user';
            }
            $base = substr($base, 0, 40);
            $username = $base;
            $i = 1;
            while ($users->buscarPerUsername($username) !== false) {
                $sufix = (string) $i++;
                $username = substr($base, 0, 50 - strlen($sufix)) . $sufix;
            }

            $nouId = $users->registrarOAuth($email, $username, $provider, $uid);
            $usuari = [
                'id' => $nouId,
                'username' => $username,
                'admin' => 0,
            ];
        }
    }

    iniciarSessioUsuari(
        (int) $usuari['id'],
        (string) $usuari['username'],
        (int) ($usuari['admin'] ?? 0),
        false
    );

    posarFlash('ok', 'Sessió iniciada amb GitHub.');
    header('Location: index.php');
    exit;

} catch (Throwable $e) {
    error_log('OAuth callback error: ' . $e->getMessage());
    posarFlash('error', 'Error en autenticar amb GitHub.');
    header('Location: login.php');
    exit;
}
```

### Nota sobre el email de GitHub

GitHub puede no devolver el email si el usuario lo tiene privado. El scope `user:email` ayuda, pero no garantiza un email público en el perfil. Si te pasa, opciones:

- Pedir al usuario que haga público un email en GitHub, o
- Usar la API de GitHub para obtener emails (Hybridauth puede exponerlos según adapter/config), o
- Pedir un email adicional en un paso intermedio.

Para una práctica, la validación simple con mensaje claro suele ser suficiente.

---

## 9. Añadir el botón de GitHub en el login

En `view/Users/login.php`, añade un botón/enlace dentro del formulario o debajo del botón de acceso:

```html
<a href="oauth.php?provider=GitHub"
   class="w-full mt-3 bg-[#24292e] text-white font-lilita tracking-wider py-2.5 rounded-btn border border-[#444c56] shadow-btn hover:brightness-110 transition text-[15px] flex items-center justify-center gap-2">
    <!-- icono GitHub opcional -->
    Continuar con GitHub
</a>
```

Ajusta las clases Tailwind al estilo actual de la vista. El importante es el `href="oauth.php?provider=GitHub"`.

---

## 10. Proteger secretos y vendor

Añade a `.gitignore` (crea el archivo si no existe en NF1, o usa el del repo):

```gitignore
/vendor/
/config/hybridauth.local.php
.env
```

Si ya existe `.gitignore`, simplemente añade esas líneas.

---

## 11. Comprobar el flujo completo

### Checklist

- [ ] `composer require hybridauth/hybridauth` ejecutado.
- [ ] OAuth App creada en GitHub con callback `http://localhost/NF1/oauth_callback.php`.
- [ ] `config/hybridauth.php` configurado con Client ID/Secret.
- [ ] Migración BD aplicada (`oauth_provider`, `oauth_uid`, `password` NULL).
- [ ] Métodos OAuth añadidos en `Model/users.model.php`.
- [ ] `oauth.php` y `oauth_callback.php` creados.
- [ ] Botón “Continuar con GitHub” visible en `login.php`.
- [ ] `config/hybridauth.local.php` y `vendor/` ignorados por git.

### Prueba manual

1. Abre `http://localhost/NF1/login.php`.
2. Pulsa **Continuar con GitHub**.
3. Autoriza la app en GitHub.
4. Deberías volver a NF1, ver el flash de sesión iniciada y estar logueado.
5. Repite el login: debe entrar con el mismo usuario, no crear uno nuevo.
6. Comprueba en BD:

```sql
SELECT id, usermail, username, admin, oauth_provider, oauth_uid
FROM usuaris
WHERE oauth_provider = 'GitHub';
```

---

## 12. Problemas comunes

| Problema | Causa probable | Solución |
|---|---|---|
| `Redirect URI mismatch` | La callback en GitHub no coincide exactamente | Revisa que sea exactamente `http://localhost/NF1/oauth_callback.php` |
| No vuelve el email | Email privado en GitHub | Haz público un email o implementa lectura de emails vía API |
| `Class Hybridauth\Hybridauth not found` | Falta autoload de Composer | Añade `require_once __DIR__ . '/vendor/autoload.php';` |
| Error SQL al insertar usuario OAuth | `password` sigue siendo NOT NULL | Aplica la migración `MODIFY password VARCHAR(255) NULL` |
| Usuario duplicado | No se comprueba email/username | Usa `buscarPerEmail`, `buscarPerUsername` y la UNIQUE `(oauth_provider, oauth_uid)` |
| Secrets en git | Config local commiteada | Mueve secrets a `hybridauth.local.php` o env vars y añade a `.gitignore` |

---

## 13. Siguientes pasos (cuando quieras añadir más proveedores)

- Añadir `Google`, `Discord`, etc. en `config/hybridauth.php`.
- Incluir el proveedor en la whitelist de `oauth.php` y `oauth_callback.php`.
- Añadir botón en la vista de login.
- Considerar una tabla `user_social` si quieres permitir varios proveedores vinculados a la misma cuenta NF1.