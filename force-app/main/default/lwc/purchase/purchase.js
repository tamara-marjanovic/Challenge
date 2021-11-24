import { LightningElement, api, track, wire } from 'lwc';
import getAllPurchases from "@salesforce/apex/Manager.getAllPurchases";
import finalBuy from "@salesforce/apex/Manager.finalBuy";
import empty from "@salesforce/apex/Manager.empty";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Purchase extends LightningElement {

    @track
    lista;
    @track
    error;
    @track 
    total=0;

    connectedCallback() {   
        this.refresh();
    }

    refresh(){
        getAllPurchases({}).then(result =>{
            this.lista = JSON.parse(result);
            this.total=0;
            for(var i=0; i<this.lista.length; i++)
                if(this.lista[i].Price__c!=undefined && this.lista[i].Num__c!=undefined)
                    this.total+=this.lista[i].Price__c*this.lista[i].Num__c;
            this.error = undefined;
        }).catch(error=>{
            console.log(error);
        });
    }
    
    onBuy(){

        finalBuy().then(result =>{
            this.lista=JSON.parse(result);
            this.total=0;
            for(var i=0; i<this.lista.length; i++)
                if(this.lista[i].Price__c!=undefined  && this.lista[i].Num__c!=undefined)
                this.total+=this.lista[i].Price__c*this.lista[i].Num__c;
        }).catch(error=>{
            console.log(error);
        });
    }

    onEmpty(){

        empty().then(result =>{
            this.lista=JSON.parse(result);
            this.total=0;
        }).catch(error=>{
            console.log(error);
        });
    }

}