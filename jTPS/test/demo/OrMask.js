'use strict'

import jTPS_Transaction from '../../src/jtps/jTPS_js.js'

class OrMask_Transaction extends jTPS_Transaction {

    constructor(initNum,  initIntNum,initMask) {
        super();
        this.num = initNum;
        this.intNum = initIntNum;
        this.mask = initMask;
    }   

    doTransaction() {
        this.num.orMask(this.mask);
    }

    undoTransaction() {
        this.num.setNum(this.intNum);
    }

    toString() {
        return "Or Mask " + this.mask;
    }


}

export default OrMask_Transaction;