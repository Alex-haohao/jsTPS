'use strict'

import jTPS_Transaction from '../../src/jtps/jTPS_js.js'


class jTPS {
    
    constructor() {
        this.transactions = new Array();
        this.mostRecentTransaction = -1;
        this.performingDo = false;
        this.performingUndo = false;
    }   

     isPerformingDo() {
        return this.performingDo;
    }

     isPerformingUndo() {
        return this.performingUndo;
    }

     addTransaction(transaction) {
        // ARE THERE OLD UNDONE TRANSACTIONS ON THE STACK THAT FIRST
        // NEED TO BE CLEARED OUT, i.e. ARE WE BRANCHING?
        if ((this.mostRecentTransaction < 0)|| (this.mostRecentTransaction < (this.transactions.length-1))) {
            for (var i = this.transactions.length-1; i > this.mostRecentTransaction; i--) {
                this.transactions.splice(i, 1);
            }
        }

        // AND NOW ADD THE TRANSACTION
        this.transactions.push(transaction);

        // AND EXECUTE IT
        this.doTransaction();        
    }


     doTransaction() {
        if (this.hasTransactionToRedo()) {
            this.performingDo = true;
            var transaction = this.transactions[this.mostRecentTransaction+1];
            transaction.doTransaction();
            this.mostRecentTransaction++;
            this.performingDo = false;
        }
    }

     peekUndo() {
        if (this.hasTransactionToUndo()) {
            return this.transactions[this.mostRecentTransaction];
        }
        else
            return null;
    }


     peekDo() {
        if (this.hasTransactionToRedo()) {
            return this.transactions[this.mostRecentTransaction+1];
        }
        else
            return null;
    }

     undoTransaction() {
        if (this.hasTransactionToUndo()) {
            this.performingUndo = true;
            var transaction = this.transactions[this.mostRecentTransaction];
            transaction.undoTransaction();
            this.mostRecentTransaction--;
            this.performingUndo = false;
        }
    }

     clearAllTransactions() {
        // REMOVE ALL THE TRANSACTIONS
        this.transactions=[];
        
        // MAKE SURE TO RESET THE LOCATION OF THE
        // TOP OF THE TPS STACK TOO
        this.mostRecentTransaction = -1;        
    }

     getSize() {
        return this.transactions.length;
    }
    

     getRedoSize() {
        return this.getSize() - this.mostRecentTransaction - 1;
    }

     getUndoSize() {
        return this.mostRecentTransaction + 1;
    }
    

    hasTransactionToUndo() {
        return this.mostRecentTransaction >= 0;
    }

     hasTransactionToRedo() {
        return this.mostRecentTransaction < (this.transactions.length-1);
    }

     toString() {
        var text = "--Number of Transactions: " + this.transactions.length + "\n";
        text += "--Current Index on Stack: " + this.mostRecentTransaction + "\n";
        text += "--Current Transaction Stack:\n";
        for (var i = 0; i <= mostRecentTransaction; i++) {
            var jT = this.transactions[i];
            text += "----" + jT.toString() + "\n";
        }
        return text;
    }
    
  }



  class AndMask_Transaction extends jTPS {


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

  
  class AddToNum_Transaction extends jTPS {
    

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

class OrMask_Transaction extends jTPS {

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

class Num extends jTPS {

    constructor() {
        super();
        this.num = 0;
    }   
     setNum( initNum) {
        this.num = initNum;
    }

      getNum() {
        return this.num;
    }

     andMask( mask) {
        this.num = this.num & mask;
    }

     orMask( mask) {
        this.num = this.num | mask;
    }
}

class jTPS_Tester extends jTPS {


    constructor(initNum,  initAmountToAdd) {
        super();
        this.tps = new jTPS();
        this.num = new Num();
        // this.input = readline();
        // this.out = console.log();
    }   

     foo() {
        var keepGoing = true;
        while (keepGoing) {
        console.log("CURRENT jTPS:");
        console.log();
        console.log(this.tps);
        console.log();

        console.log("num is " + this.num.getNum());
        console.log();

        console.log("ENTER A SELECTION");
        console.log("1) Add a Transaction");
        console.log("2) Undo a Transaction");
        console.log("3) Redo a Transaction");
        console.log("4) Clear All Transactions");
        console.log("5) Reset Num and Transactions");
        console.log("-");

        var entry = window.prompt("Enter your number from 1-5 or Q to quit");

        if (entry.startsWith("1")) {
            console.log("\nEnter an amount to add: ");
            entry = window.prompt("Enter an amount to add: ");
            var amountToAdd = parseInt(entry,10);
            var transaction = new AddToNum_Transaction(this.num, amountToAdd);
            this.tps.addTransaction(transaction);
        }  
        // UNDO A TRANSACTION
        else if (entry.startsWith("2")) {
            this.tps.undoTransaction();
        } 
        // REDO A TRANSACTION
        else if (entry.startsWith("3")) {
            this.tps.doTransaction();
        }
        // CLEAR ALL TRANSACTIONS
        else if (entry.startsWith("4")) {
            this.tps.clearAllTransactions();
        }
        // CLEAR ALL TRANSACTIONS AND RESET NUM TO 0
        else if (entry.startsWith("5")) {
            this.tps.clearAllTransactions();
            this.num.setNum(0);
        }
        // QUIT
        else if (entry.startsWith("Q")) {
            keepGoing = false;
        }
        console.log("GOODBYE");
    }
}

}

var a = new jTPS_Tester()
console.log(a.foo())