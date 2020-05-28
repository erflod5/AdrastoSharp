import { Enviorement } from "./Compiler/SymbolTable/Enviorement";
import { Instruction } from "./Compiler/Abstract/Instruction";
import { Generator } from "./Compiler/Generator/Generator";
import { FunctionSt } from "./Compiler/Instruction/Functions/FunctionSt";

const fs = require('fs');
const parser = require('./Grammar/grammar');

try{
    const entrada = fs.readFileSync('./src/entrada.txt');
    let ast = parser.parse(entrada.toString());
    let env = new Enviorement(null);
    
    //Primera pasada, solo funciones y structs pendientes
    ast.forEach( (element : Instruction) => {
        if(element instanceof FunctionSt)
            element.compile(env);
    });

    //Segunda pasada ejecuta todo
    ast.forEach( (element : Instruction) => {
        element.compile(env);
    });
     
    let code = Generator.getInstance().getCode();
    fs.writeFile('salida.txt',code,(err: any)=>{
        if(err){
            console.log("No se pudo guardar el archivo");
        }
    });
}
catch(err){
    console.log(err);
} 