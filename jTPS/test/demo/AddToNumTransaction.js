'use strict'

import jTPS_Transaction from '../../src/jtps/jTPS_js.js'

class AddToNum_Transaction extends jTPS_Transaction {
    

    constructor(initNum,  initAmountToAdd) {
        super();
        this.num = initNum;
        this.amountToAdd = initAmountToAdd;
    }   

     

    doTransaction() {
        var oldNum = this.num.getNum();
        var newNum = oldNum + this.amountToAdd;
        this.num.setNum(newNum);
    }

     undoTransaction() {
        var oldNum = this.num.getNum();
        var newNum = oldNum - this.amountToAdd;
        this.num.setNum(newNum);
    }

    getNum(){
        return this.num;
    }

    setNum(n){
        this.num = n;
    }
     toString() {
        return "Add " + this.amountToAdd;
    }

}
export default AddToNum_Transaction;