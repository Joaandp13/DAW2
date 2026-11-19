<?php
/**
 * Joan Diaz - Pràctica 04
 *
 * Funcions de presentació compartides per les vistes de builds.
 * L'element d'un build es dedueix sempre del personatge de la posició 1.
 */

/** Elements vàlids, coincidents amb els fitxers img/icons/*_icon.webp. */
function elementsPermesos(): array
{
    return ['anemo', 'cryo', 'dendro', 'electro', 'geo', 'hydro', 'pyro'];
}

/** Ruta de la icona d'un element. */
function iconaElement(string $element): string
{
    return in_array($element, elementsPermesos(), true)
        ? 'img/icons/' . $element . '_icon.webp'
        : 'img/icons/anemo_icon.webp';
}

/** Etiqueta accessible d'un element. */
function nomElement(string $element): string
{
    return ucfirst($element);
}

/** Rol emmagatzemat a la BDD -> etiqueta visible al disseny. */
function etiquetaRol(string $rol): string
{
    return match ($rol) {
        'main-dps' => 'Main DPS',
        'sub-dps'  => 'Sub DPS',
        'support'  => 'Support',
        default    => $rol,
    };
}

/** DPS enter (142000) -> etiqueta compacta (142K). */
function formatDps(int $dps): string
{
    if ($dps < 1000) {
        return (string) $dps;
    }

    return number_format($dps / 1000, 0, '.', '') . 'K';
}

/** Rols vàlids per al camp ENUM d'articles. */
function rolsPermesos(): array
{
    return ['main-dps', 'sub-dps', 'support'];
}

/** Armes vàlides per al camp ENUM de personatges. */
function armesPermeses(): array
{
    return ['Sword', 'Claymore', 'Polearm', 'Bow', 'Catalyst'];
}
