import { LightningElement, api, track, wire } from 'lwc';
import getAllProducts from "@salesforce/apex/Manager.getAllProducts";
import buyProducts from "@salesforce/apex/Manager.buyProducts";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ViewList extends LightningElement {

    @track
    showDetail=false;
    @track
    showCompare=false;
    @track
    lista;
    @track
    error;
    @track
    idDetail;
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
        getAllProducts({}).then(result =>{
            this.lista = JSON.parse(result);
            this.error = undefined;
        }).catch(error=>{
            console.log(error);
        });
    }

    onBuy(){
        var list=[];
        var l=this.template.querySelectorAll('.checkboxc');
        for(var i=0; i<l.length; i++)
        {
            if(l[i].checked){
                list.push(l[i].dataset.id);
                l[i].checked=false;
            }
        }

        buyProducts({ids: list}).then(result =>{
            var mes='Selected product is placed in the cart'
            if(list.length>1)
                mes='Selected products are placed in the cart';
            this.lista=JSON.parse(result);
            if(list.length>0){
                const evt = new ShowToastEvent({
                    title: 'Buying products',
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

    onShowDetail(event){
        this.idDetail=event.target.dataset.id;
        this.showDetail=true;
    }

    onShowCompare(event){
        var list=[];
        var l=this.template.querySelectorAll('.checkboxc');
        for(var i=0; i<l.length; i++)
        {
            if(l[i].checked){
                list.push(l[i].dataset.id);
                //l[i].checked=false;
            }
        }

        if(list.length==3){
            this.id1=list[0];
            this.id2=list[1];
            this.id3=list[2];
            this.showCompare=true;
        }
        else {
            var mes='Select three products';
            const evt = new ShowToastEvent({
                title: 'Comparing three products',
                message: mes,
                variant: 'error',
            });
            this.dispatchEvent(evt);
        }
    }

    handleGoBack2(){
        this.refresh();
        this.showCompare=false;
    }

    handleGoBack(){
        this.refresh();
        this.showDetail=false;
    }
}