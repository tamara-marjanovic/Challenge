import { api, LightningElement, track, wire } from 'lwc';
import getOneProduct from "@salesforce/apex/Manager.getOneProduct";
import getTwoProducts from "@salesforce/apex/Manager.getTwoProducts";
import buyProduct from "@salesforce/apex/Manager.buyProduct";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Detail extends LightningElement {

    @track
    showCompare=false;
    @api
    list;
    @api
    idDetail;
    @track
    product;
    @track
    error;
    value;
    @track
    show=false;
    @track
    id1;
    @track
    id2;
    @track
    id3;

    connectedCallback() {   
        this.refresh();
    }

    refresh(){
        getOneProduct({idDetail: this.idDetail}).then(result =>{
            this.product = JSON.parse(result);
            this.show=true;
        }).catch(error=>{
            console.log(error);
        });
    }

    onBuy(){
        var list=[];
        list.push(this.idDetail);

        if(this.product.Quantity__c>0){
            buyProduct({ids: list}).then(result =>{
                var mes='This product is placed in the cart';
                this.product=JSON.parse(result);
                if(list.length>0){
                    const evt = new ShowToastEvent({
                        title: 'Buying product',
                        message: mes,
                        variant: 'success',
                    });
                    this.dispatchEvent(evt);
                }  
                this.refresh();
            }).catch(error=>{
                console.log(error);
            });
        }
        else {
            var mes='This product is no longer in stock';
            const evt = new ShowToastEvent({
                title: 'Buying product',
                message: mes,
                variant: 'error',
            });
            this.dispatchEvent(evt);
        }
        
    }

    handleBack(){
        this.dispatchEvent(new CustomEvent("goback"));
    }

    handleGoBack2(){
        this.refresh();
        this.showCompare=false;
    }

    onShowCompare(){
        getTwoProducts({idDetail: this.idDetail}).then(result =>{
            var rez = JSON.parse(result);
            this.id1=this.idDetail;
            if(rez.length>=2){
            this.id2=rez[0].Id;
            this.id3=rez[1].Id;
            this.showCompare=true;
            }
        }).catch(error=>{
            console.log(error);
        });
    }
}