# Manual de Markdown

## Encapçalaments

Els encapçalaments s'utilitzen amb `#`:

# Encapçalament 1
## Encapçalament 2
### Encapçalament 3
#### Encapçalament 4
##### Encapçalament 5
###### Encapçalament 6

---

## Llistes

### Llista desordenada

- Element 1
- Element 2
  - Subelement 2.1
  - Subelement 2.2
- Element 3

### Llista ordenada

1. Primer element
2. Segon element
   1. Subelement 2.1
   2. Subelement 2.2
3. Tercer element

---

## Taules

| Columna 1 | Columna 2 | Columna 3 |
|-----------|-----------|-----------|
| Dada 1    | Dada 2    | Dada 3    |
| Dada 4    | Dada 5    | Dada 6    |
| Dada 7    | Dada 8    | Dada 9    |

---

## Imatges

Sintaxi: `![Text alternatiu](URL)`

![Logo](https://www.montesdevalsain.es/images/Comun1_a.jpg)

---

## Enllaços

Sintaxi: `[Text de l'enllaç](URL)`

[Manual MD](https://www.google.com)

[Enllaç a una secció](#encapçalaments)

---

## Negrita i Cursiva

- **Negrita** s'utilitza amb `**text**`
- *Cursiva* s'utilitza amb `*text*`
- ***Negrita i cursiva*** s'utilitza amb `***text***`

---

## Caixes d'informació

> [!TIP]
> Això és una caixa de consell. 

> [!WARNING]
> Això és una caixa d'avís. 



> [!NOTE]
> Això és una caixa de nota. 

> [!CAUTION]
> Això és una caixa de precaució. 

---

## Cita en bloc

> Aquesta és una cita en bloc. 
---

## Codi

### Codi inline

Utilitza `console.log("Hola");` per imprimir a la consola.

### Bloc de codi

```javascript
function hola() {
  console.log("Hola, món!");
}
```

---

## Línia separadora

La pots crear amb `---`, `***` o `___`
