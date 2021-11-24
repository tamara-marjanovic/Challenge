import { LightningElement, api, wire, track } from 'lwc';

export default class Compare extends LightningElement {
    
    @api
    id1;
    @api
    id2;
    @api
    id3;
    
    handleBack(){
        this.dispatchEvent(new CustomEvent("goback"));
    }
}