# Mates en práctica · 1.º de ESO

Web estática en español, adaptada a iPad, con dos temas:

- **Distributiva y factor común:** 16 ejercicios, teoría resumida, pistas y corrección.
- **Números primos:** explicación en cuatro pasos con preguntas de comprensión; 8 ejercicios de clasificación, 4 de selección del menor divisor primo y los 8 apartados del ejercicio 52.

## Números primos: método y contenido

Sigue las divisiones sucesivas en columna de la página del libro SM y del cuaderno aportados: número y cocientes a la izquierda, divisores primos a la derecha, hasta llegar a 1. Después se agrupan los factores iguales en potencias. Se añade el recuento de divisores mediante el producto de los exponentes incrementados en 1, como en el cuaderno.

El ejercicio 52 utiliza 54, 84, 96, 154, 256, 495, 729 y 1024, en ese orden. La columna admite cualquier divisor primo exacto y recomienda comenzar por el menor. En el nivel de preparación se pide explícitamente el menor divisor primo.

Se refuerzan las diferencias entre divisor, primo y compuesto; que 1 no es primo ni compuesto; que 2 es el único primo par; y que ser impar o no dividirse por 2, 3 y 5 no basta para ser primo (ejemplo: 49). Se explica cuándo se puede terminar la búsqueda de divisores primos.

Se corrige expresamente la confusión que aparece en el apartado 96 del cuaderno: 3 · 4 · 8 es un producto correcto, pero 4 y 8 son compuestos. La descomposición en primos es 2⁵ · 3, y el número de divisores es 12. El 1 es un divisor, pero nunca un factor primo.

Las fotos originales del libro y del cuaderno no forman parte de los archivos públicos.

## Guardado del progreso

Se utiliza localStorage, sin cuentas ni envío de respuestas a un servidor. El avance se conserva en el mismo navegador y dispositivo. Borrar los datos del sitio lo elimina; en modo privado puede desaparecer al terminar la sesión. Si el almacenamiento está bloqueado, la web avisa.

Los temas tienen claves independientes:

- Distributiva: `mates-en-practica:malena:v1`. Se conserva el código y el formato anterior.
- Primos: `mates-en-practica:malena:primos:v1`. Se guardan el paso de teoría, las comprobaciones, el nivel, el ejercicio seleccionado, las respuestas, cada división aceptada, los exponentes y los aciertos.

La restauración valida las respuestas y los pasos. Reiniciar un tema no borra el avance del otro. En primos los ejercicios tienen identificadores por tipo y número, para no perder el avance al añadir nuevos ejercicios.

## Probar y publicar

Abre `index.html` o sirve esta carpeta con cualquier servidor estático. No hay instalación ni compilación. Requiere un navegador actual (Safari 15.4 o posterior para el diálogo de confirmación).

En GitHub Pages, publica la rama `main` y la carpeta `/(root)`. La web está en https://bindomable.github.io/Propiedad/ y el nuevo tema en https://bindomable.github.io/Propiedad/primos.html.

## Comprobaciones

Con Node.js, sin bibliotecas adicionales:

```
node tests/prime-math.test.cjs
node tests/prime-storage.test.cjs
```

Las pruebas verifican los ocho resultados del libro, la cantidad de divisores mediante recuento exhaustivo, divisiones alternativas, rechazo de factores compuestos, restauración y aislamiento del almacenamiento. La comprobación en navegador recorre los 20 ejercicios y verifica recarga, reinicio y continuidad del tema anterior.

## M.C.D. y M.C.M.

`mcd-mcm.html` añade un tercer tema independiente, con explicación en cuatro pasos,
descomposición en columna, comparación de exponentes y 16 ejercicios con corrección.
`common-math.js` calcula la selección de factores; `common.js` gestiona la práctica.
La clave `mates-en-practica:malena:mcd-mcm:v1` guarda el avance sin modificar las
claves existentes de distributiva o números primos. No se incluye un reinicio global.

Prueba adicional: `node tests/common.test.cjs`.
