
export class SymbolStruct{
    type : any;
    identifier : string;
    position : number;

    constructor(type: any, identifier: string, position: number){
        this.type = type;
        this.identifier = identifier;
        this.position = position;
    }
}