import { Expression } from "../../Abstract/Expression"
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Retorno } from "../../Utils/Retorno";
import { Error } from "../../Utils/Error";
import { Generator } from "../../Generator/Generator";
import { Types } from "../../Utils/Type";

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
            const size = generator.saveTemps(enviorement); //Guardo temporales
            this.params.forEach((param)=>{
                paramsValues.push(param.compile(enviorement));
            })
            //TODO comprobar parametros correctos
            const temp = generator.newTemporal(); generator.freeTemp(temp);
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
            generator.recoverTemps(enviorement,size);
            generator.addTemp(temp);

            if (symFunc.type.type != Types.BOOLEAN) return new Retorno(temp,true,symFunc.type);

            const retorno = new Retorno('', false, symFunc.type);
            this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
            this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
            generator.addIf(temp, '1', '==', this.trueLabel);
            generator.addGoto(this.falseLabel);
            retorno.trueLabel = this.trueLabel;
            retorno.falseLabel = this.falseLabel;
            return retorno;
        }
        else{

        }
        throw new Error(this.line,this.column,'Semantico','Funcion no implementada');
    }
}