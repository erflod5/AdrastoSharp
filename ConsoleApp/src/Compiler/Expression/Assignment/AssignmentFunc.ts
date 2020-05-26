import { Expression } from "../../Abstract/Expression"
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Error } from "../../Utils/Error";
import { Generator } from "../../Generator/Generator";

export class AssignmentFunc extends Expression{
    private id: string;
    private anterior: Expression | null;
    private params: Array<Expression>;

    constructor(id: string, params: Array<Expression>, anterrior: Expression | null,line : number, column: number){
        super(line,column);
        this.id = id;
        this.anterior = anterrior;
        this.params = params;
    }

    compile(enviorement: Enviorement) : Retorno{
        if(this.anterior == null){
            const symFunc = enviorement.searchFunc(this.id);
            if(symFunc == null)
                throw new Error(this.line,this.column,'Semantico',`No se encontro la funcion: ${this.id}`);
            const paramsValues = new Array<Retorno>();
            const generator = Generator.getInstance();
            this.params.forEach((param)=>{
                paramsValues.push(param.compile(enviorement));
            })
            //TODO comprobar parametros correctos
            //TODO guardado de temporales
            const temp = generator.newTemporal();
            //Paso de parametros en cambio simulado
            if(paramsValues.length != 0){
                generator.addExpression(temp,'p',enviorement.size + 1,'+'); //+1 porque la posicion 0 es para el retorno;
                paramsValues.forEach((value,index)=>{
                    //TODO paso de parametros booleanos
                    generator.addSetStack(temp,value.getValue());
                    if(index != paramsValues.length - 1)
                        generator.addExpression(temp,temp,'1','+');
                });    
            }

            generator.addNextEnv(enviorement.size);
            generator.addCall(symFunc.uniqueId);
            generator.addGetStack(temp,'p');
            generator.addAntEnv(enviorement.size);
    
            //TODO recuperacion de temporales
            return new Retorno(temp,true,symFunc.type);
        }
        else{

        }
        throw new Error(this.line,this.column,'Semantico','Funcion no implementada');
    }
}