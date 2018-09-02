import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/Rx";

@Injectable()
export class BarSelectionService {
    private currentSelectionObject:BehaviorSubject<any>= new BehaviorSubject<any>({});
    public currentSelectedMode:string="None";
    watchCurrentSelectionObject$= this.currentSelectionObject.asObservable();



    constructor() {}

    setCurrentSelectionObject(currentSelectionObj: any){
        this.currentSelectionObject.next(currentSelectionObj);
    }
}
