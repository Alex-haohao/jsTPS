'use strict'

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

  export default jTPS;