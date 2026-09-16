"use strict";

/*
	CATEGORIES SEGONS L'IMC
		IMC < 16		Infrapès sever
16   <= IMC < 17		Infrapès
17   <= IMC < 18.5		Infrapès lleu
18.5 <= IMC < 25		Pes normal
25   <= IMC < 30		Sobrepès
30   <= IMC < 35		Obesitat lleu
35   <= IMC < 40		Obesitat
		IMC >= 40		Obesitat severa
*/

/**
 * Calcular l'IMC (Índex de Massa Corporal) a partir del pes i l'altura.
 * 
 * @param pes		Pes en Kg
 * @param altura	Altura en cm
 * @return 			IMC-Categoria: "24,3-Pes normal"
 *					L'IMC s'ha de mostrar amb un decimal i format local
 * 
 *					Exemples:
 *					80 Kg i 180 cm --> "24,7-Pes normal"
 *					81 Kg i 180 cm --> "25,0-Sobrepès"
 *					90 Kg i 173 cm --> "30,1-Obesitat lleu"
 */
function imc(pes:string, altura:string) : string {
	let pesoNum = parseFloat(pes);
	let alturaNum = parseFloat(altura);

	alturaNum = alturaNum / 100;
	
	let imcNum = (pesoNum/alturaNum)
	
	if (imcNum < 16) {
		return imcNum.toFixed(2) +"-"+ "Delgadez severa";
	} else if (imcNum < 17) {
		return imcNum.toFixed(2) +"-"+ "Delgadez moderada";
	} else if (imcNum < 18.5) {
		return imcNum.toFixed(2) +"-"+ "Delgadez leve";
	} else if (imcNum < 25) {
		return imcNum.toFixed(2) +"-"+ "Peso normal";
	} else if (imcNum < 30) {
		return imcNum.toFixed(2) +"-"+ "Sobrepeso";
	} else if (imcNum < 35) {
		return imcNum.toFixed(2) +"-"+ "Obesidad grado I";
	} else if (imcNum < 40) {
		return imcNum.toFixed(2) +"-"+ "Obesidad grado II";
	} else {
		return imcNum.toFixed(2) +"-"+ "Obesidad grado III";
	}
	
	
}



/**
 * Convertir unitats de longitud.
 * 
 * @param valor	Longitud a convertir
 * @param uni1	Unitats de la longitud (mm, cm, dm, m, Dm, Hm, Km)
 * @param uni2	A quines unitats s'ha de convertir (mm, cm, dm, m, Dm, Hm, Km)
 * @return 		Longitud convertida amb 4 dígits significatius
 * 
 * 						Exemples:
 * 						12.4 Dm --> 124.0 m
 * 						12.4 Km --> 1.240e+4 m
 */
function convertidor(valor:string, uni1:string, uni2:string) : string {

	return "";
}
