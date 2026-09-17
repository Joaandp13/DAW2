"use strict";
import { convertidor } from "./functions.js";
function imc(pes, altura) {
    let pesoNum = parseFloat(pes);
    let alturaNum = parseFloat(altura);
    alturaNum = alturaNum / 100;
    let imcNum = (pesoNum / Math.pow(alturaNum, 2));
    if (imcNum < 16) {
        return imcNum.toFixed(2) + "-" + "Delgadez severa";
    }
    else if (imcNum < 17) {
        return imcNum.toFixed(2) + "-" + "Delgadez moderada";
    }
    else if (imcNum < 18.5) {
        return imcNum.toFixed(2) + "-" + "Delgadez leve";
    }
    else if (imcNum < 25) {
        return imcNum.toFixed(2) + "-" + "Peso normal";
    }
    else if (imcNum < 30) {
        return imcNum.toFixed(2) + "-" + "Sobrepeso";
    }
    else if (imcNum < 35) {
        return imcNum.toFixed(2) + "-" + "Obesidad grado I";
    }
    else if (imcNum < 40) {
        return imcNum.toFixed(2) + "-" + "Obesidad grado II";
    }
    else {
        return imcNum.toFixed(2) + "-" + "Obesidad grado III";
    }
}
function _imc() {
    let r = imc(document.getElementById('pes').value, document.getElementById('altura').value);
    if (r != undefined) {
        let v = r.split("-");
        document.getElementById("imc").innerHTML = v[0];
        document.getElementById("categoria").innerHTML = v[1];
    }
}
function _convertidor() {
    let r = convertidor(document.getElementById('m1').value, document.getElementById('cm1').value, document.getElementById('cm2').value);
    if (r != undefined)
        document.getElementById("m2").innerHTML = r;
}
//# sourceMappingURL=Ciencies.js.map