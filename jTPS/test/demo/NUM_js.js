'use strict'

import jTPS_Transaction from '../../src/jtps/jTPS_js.js'

class Num extends jTPS_Transaction {

    constructor() {
        this.num = 0;
    }   
     setNum( initNum) {
        num = initNum;
    }

      getNum() {
        return num;
    }

     andMask( mask) {
        num = num & mask;
    }

     orMask( mask) {
        num = num | mask;
    }
}
export default Num;