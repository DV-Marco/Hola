const { forEach } = require('async');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var nombres = [];

var nombre = "";

rl.question('Nombre: ', async (res)=>{
    nombre = await res;

    nombres.push(nombre);

    
    
    rl.close();

})