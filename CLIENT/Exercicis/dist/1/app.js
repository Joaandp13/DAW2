function informacio() {
    let array = [];
    array.push("Amplada:" + window.innerWidth);
    array.push("Alçada:" + window.innerHeight);
    array.push("Amplada disponible:" + window.outerWidth);
    array.push("Alçada disponible:" + window.outerHeight);
    return array;
}
let div = document.getElementById('div');
let a = informacio();
a.forEach(element => {
    div?.appendChild(document.createTextNode(element));
});
export {};
//# sourceMappingURL=app.js.map