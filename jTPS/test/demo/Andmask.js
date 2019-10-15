'use strict'

import jTPS_Transaction from '../../src/jtps/jTPS_js.js'

class AndMask_Transaction extends jTPS_Transaction {


    constructor(initNum, initIntNum, initMask) {
        super();
        this.num = initNum;
        this.intNum = initIntNum;
        this.mask = initMask
    }   
    
    doTransaction() {
        this.num.andMask(this.mask);
    }

    undoTransaction() {
        this.num.setNum(this.intNum);
    }

    toString() {
        return "And Mask " + this.mask;
    }


}
export default AndMask_Transaction;