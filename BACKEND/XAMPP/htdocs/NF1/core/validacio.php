<?php
/**
 * Joan Diaz - Pràctica 04
 *
 * Funcions de validació compartides per registre, login i recuperació.
 */

/** Valida una adreça electrònica. */
function correuValid(string $correu): bool
{
    return filter_var($correu, FILTER_VALIDATE_EMAIL) !== false;
}

/** Valida el nom visible: 3 a 30 caràcters, lletres, números, punt, guió i guió baix. */
function nomUsuariValid(string $nom): bool
{
    return preg_match('/^[A-Za-z0-9._-]{3,30}$/', $nom) === 1;
}

/**
 * Comprova la fortalesa de la contrasenya:
 * almenys 8 caràcters, una minúscula, una majúscula i un número.
 */
function contrasenyaForta(string $contrasenya): bool
{
    return strlen($contrasenya) >= 8
        && preg_match('/[a-z]/', $contrasenya) === 1
        && preg_match('/[A-Z]/', $contrasenya) === 1
        && preg_match('/[0-9]/', $contrasenya) === 1;
}

/** Retorna el missatge d'error d'una contrasenya o null si és prou forta. */
function errorContrasenya(string $contrasenya): ?string
{
    return contrasenyaForta($contrasenya)
        ? null
        : 'La contrasenya ha de tenir almenys 8 caràcters, una majúscula, una minúscula i un número.';
}

/** Neteja un camp de text abans de desar-lo o validar-lo. */
function textNet(mixed $valor): string
{
    return is_string($valor) ? trim($valor) : '';
}
