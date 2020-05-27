import { Param } from "../Utils/Param";

export class SymbolStruct{
    identifier : string;
    size : number;
    attributes : Array<Param>;

    constructor(identifier: string, size: number,attributs: Array<Param>){
        this.identifier = identifier;
        this.size = size;
        this.attributes = attributs;
    }

    getAttribute(id: string) : {index : number, value: Param | null}{
        for(let i = 0; i < this.attributes.length; i++){
            const value = this.attributes[i];
            if(value.id == id){
                return {index: i,value : value};
            }
        }
        return {index: -1,value : null};
    }
}