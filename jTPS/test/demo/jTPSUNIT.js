//import jTPS_Transaction from './src/jtps/jTPS_js'
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
        for (var i = 0; i <= this.mostRecentTransaction; i++) {
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

class jTPS_Unit_Tests extends AddToNum_Transaction {

    constructor() {
        super();
        
    }   

        isequal(a,b){
            if(a===b){
                return true
            }
            else{
                return false
            }

        }

        isfalse(a){
            if(a ===true){
                return false;
            }
            else{
                return true;
            }
        }

        istrue(a){
            if(a ===true){
                return true;
            }
            else{
                return false;
            }
        }

        testAdd() {
        // WE'LL JUST USE A SIMPLE NUM FOR TESTING

        var tps = new jTPS();
        var num = new Num();
        

        this.isequal(num.getNum(),0);

        document.getElementById("init").innerHTML = this.isequal(num.getNum(),0);

        
        // ADD 5 TRANSACTION
        tps.addTransaction(new AddToNum_Transaction(num, 5));
        // assert.equal(5, num.getNum());
        this.isequal(num.getNum(),5);
        document.getElementById("add_five").innerHTML += this.isequal(num.getNum(),5)+" "  ;

        // assert.equal(1, tps.getSize());
        this.isequal(tps.getSize(),1);
        document.getElementById("add_five").innerHTML += this.isequal(tps.getSize(),1)+" " ;

        // assert.equal(0, tps.getRedoSize());
        this.isequal(tps.getRedoSize(),0);
        document.getElementById("add_five").innerHTML += this.isequal(tps.getRedoSize(),0) +" ";


        // assert.equal(1, tps.getUndoSize());
        this.isequal(tps.getUndoSize(),1);
        document.getElementById("add_five").innerHTML += this.isequal(tps.getUndoSize(),1) +" ";


        // // ADD 10 TRANSACTION
        // tps.addTransaction(new AddToNum_Transaction(num, 10));
        tps.addTransaction(new AddToNum_Transaction(num, 10));

        // Assert.assertEquals(15, num.getNum());
        this.isequal(num.getNum(),15);
        document.getElementById("add10").innerHTML += this.isequal(num.getNum(),15) +" ";


        // Assert.assertEquals(2, tps.getSize());
        this.isequal(tps.getSize(),2);
        document.getElementById("add10").innerHTML += this.isequal(tps.getSize(),2) +" ";

        // Assert.assertEquals(0, tps.getRedoSize());
        this.isequal(tps.getRedoSize(),0);
        document.getElementById("add10").innerHTML += this.isequal(tps.getRedoSize(),0) +" ";


        // Assert.assertEquals(2, tps.getUndoSize());
        this.isequal(tps.getUndoSize(),2);
        document.getElementById("add10").innerHTML += this.isequal(tps.getUndoSize(),2) +" ";


        
        // // ADD 15 TRANSACTION
        tps.addTransaction(new AddToNum_Transaction(num, 20));

        // tps.addTransaction(new AddToNum_Transaction(num, 20));
        
        // Assert.assertEquals(35, num.getNum());
        this.isequal(num.getNum(),35);
        document.getElementById("add15").innerHTML += this.isequal(num.getNum(),35) +" ";

        // Assert.assertEquals(3, tps.getSize());
        this.isequal(tps.getSize(),3);
        document.getElementById("add15").innerHTML += this.isequal(tps.getSize(),3) +" ";

        // Assert.assertEquals(0, tps.getRedoSize());
        this.isequal(tps.getRedoSize(),0);
        document.getElementById("add15").innerHTML += this.isequal(tps.getRedoSize(),0) +" ";

        // Assert.assertEquals(3, tps.getUndoSize());
        this.isequal(tps.getUndoSize(),3);
        document.getElementById("add15").innerHTML += this.isequal(tps.getUndoSize(),3) +" ";

    }

    testAndMask() {
        var tps = new jTPS();
        var num = new Num();

        document.getElementById("initmask").innerHTML = this.isequal(num.getNum(),0);

        
        tps.addTransaction(new AddToNum_Transaction(num, 12));
        tps.addTransaction(new AndMask_Transaction(num, num.getNum(), 4));

        document.getElementById("add_five_maskand").innerHTML += this.isequal(num.getNum(),4) +" ";
        document.getElementById("add_five_maskand").innerHTML += this.isequal(tps.getSize(),2) +" ";


         // Assert.assertEquals(12, num.getNum());
        // Assert.assertEquals(2, tps.getSize());
        // Assert.assertEquals(1, tps.getRedoSize());
        // Assert.assertEquals(1, tps.getUndoSize());

        
        tps.undoTransaction();
        document.getElementById("add_five_maskand").innerHTML += this.isequal(num.getNum(),12) +" ";
        document.getElementById("add_five_maskand").innerHTML += this.isequal(tps.getSize(),2) +" ";
        document.getElementById("add_five_maskand").innerHTML += this.isequal(tps.getRedoSize(),1) +" ";
        document.getElementById("add_five_maskand").innerHTML += this.isequal(tps.getUndoSize(),1) +" ";

       
    }

    testUndo(){
        var tps = new jTPS();
        var num = new Num();

        // Assert.assertEquals(num.getNum(), 0);
        // Assert.assertFalse(tps.hasTransactionToUndo());
        // Assert.assertFalse(tps.hasTransactionToRedo());
        document.getElementById("inittestUndo").innerHTML += this.isequal(num.getNum(),0)+" ";
        document.getElementById("inittestUndo").innerHTML += this.isfalse(tps.hasTransactionToUndo())+" ";
        document.getElementById("inittestUndo").innerHTML += this.isfalse(tps.hasTransactionToRedo())+" ";

        // ADD 3 TRANSACTIONS (5, 10, and 15)
        tps.addTransaction(new AddToNum_Transaction(num, 5));
        tps.addTransaction(new AddToNum_Transaction(num, 10));
        tps.addTransaction(new AddToNum_Transaction(num, 20));

        // Assert.assertTrue(tps.hasTransactionToUndo());
        // Assert.assertFalse(tps.hasTransactionToRedo());
        // Assert.assertEquals(35, num.getNum());
        // Assert.assertTrue(tps.hasTransactionToUndo());
        // Assert.assertEquals(3, tps.getSize());
        // Assert.assertEquals(0, tps.getRedoSize());
        // Assert.assertEquals(3, tps.getUndoSize());

        document.getElementById("testaddthree").innerHTML += this.istrue(tps.hasTransactionToUndo())+" ";
        document.getElementById("testaddthree").innerHTML += this.isfalse(tps.hasTransactionToRedo())+" ";
        document.getElementById("testaddthree").innerHTML += this.isequal(35, num.getNum())+" ";
        document.getElementById("testaddthree").innerHTML += this.istrue(tps.hasTransactionToUndo())+" ";
        document.getElementById("testaddthree").innerHTML += this.isequal(3, tps.getSize())+" ";
        document.getElementById("testaddthree").innerHTML += this.isequal(0, tps.getRedoSize())+" ";
        document.getElementById("testaddthree").innerHTML += this.isequal(3, tps.getUndoSize())+" ";


        // UNDO A TRANSACTION
        tps.undoTransaction();


        // Assert.assertTrue(tps.hasTransactionToUndo());
        // Assert.assertTrue(tps.hasTransactionToRedo());
        // Assert.assertEquals(15, num.getNum());
        // Assert.assertEquals(3, tps.getSize());
        // Assert.assertEquals(1, tps.getRedoSize());
        // Assert.assertEquals(2, tps.getUndoSize());

        document.getElementById("testUNDOaTRANSACTION").innerHTML += this.istrue(tps.hasTransactionToUndo())+" ";
        document.getElementById("testUNDOaTRANSACTION").innerHTML += this.istrue(tps.hasTransactionToRedo())+" ";
        document.getElementById("testUNDOaTRANSACTION").innerHTML += this.isequal(15, num.getNum())+" ";
        document.getElementById("testUNDOaTRANSACTION").innerHTML += this.isequal(3, tps.getSize())+" ";
        document.getElementById("testUNDOaTRANSACTION").innerHTML += this.isequal(1, tps.getRedoSize())+" ";
        document.getElementById("testUNDOaTRANSACTION").innerHTML += this.isequal(2, tps.getUndoSize())+" ";


        // UNDO ANOTHER
        tps.undoTransaction();

        // Assert.assertTrue(tps.hasTransactionToUndo());
        // Assert.assertTrue(tps.hasTransactionToRedo());
        // Assert.assertEquals(5, num.getNum());
        // Assert.assertEquals(3, tps.getSize());
        // Assert.assertEquals(2, tps.getRedoSize());
        // Assert.assertEquals(1, tps.getUndoSize());

        document.getElementById("testUNDO_ANOTHER").innerHTML += this.istrue(tps.hasTransactionToUndo())+" ";
        document.getElementById("testUNDO_ANOTHER").innerHTML += this.istrue(tps.hasTransactionToRedo())+" ";
        document.getElementById("testUNDO_ANOTHER").innerHTML += this.isequal(5, num.getNum())+" ";
        document.getElementById("testUNDO_ANOTHER").innerHTML += this.isequal(3, tps.getSize())+" ";
        document.getElementById("testUNDO_ANOTHER").innerHTML += this.isequal(2, tps.getRedoSize())+" ";
        document.getElementById("testUNDO_ANOTHER").innerHTML += this.isequal(1, tps.getUndoSize())+" ";

       // AND ANOTHER
       tps.undoTransaction();
    //    Assert.assertFalse(tps.hasTransactionToUndo());
    //    Assert.assertTrue(tps.hasTransactionToRedo());
    //    Assert.assertEquals(0, num.getNum());
    //    Assert.assertEquals(3, tps.getSize());
    //    Assert.assertEquals(3, tps.getRedoSize());
    //    Assert.assertEquals(0, tps.getUndoSize());
       
        document.getElementById("testAND_ANOTHER").innerHTML += this.isfalse(tps.hasTransactionToUndo())+" ";
        document.getElementById("testAND_ANOTHER").innerHTML += this.istrue(tps.hasTransactionToRedo())+" ";
        document.getElementById("testAND_ANOTHER").innerHTML += this.isequal(0, num.getNum())+" ";
        document.getElementById("testAND_ANOTHER").innerHTML += this.isequal(3, tps.getSize())+" ";
        document.getElementById("testAND_ANOTHER").innerHTML += this.isequal(3, tps.getRedoSize())+" ";
        document.getElementById("testAND_ANOTHER").innerHTML += this.isequal(0, tps.getUndoSize())+" ";

         // WE HAVE NO MORE TO UNDO SO THIS SHOULD DO NOTHING
         tps.undoTransaction();


        //  Assert.assertFalse(tps.hasTransactionToUndo());
        //  Assert.assertTrue(tps.hasTransactionToRedo());
        //  Assert.assertEquals(0, num.getNum());
        //  Assert.assertEquals(3, tps.getSize());
        //  Assert.assertEquals(3, tps.getRedoSize());
        //  Assert.assertEquals(0, tps.getUndoSize());

        document.getElementById("testNO_more_undo").innerHTML += this.isfalse(tps.hasTransactionToUndo())+" ";
        document.getElementById("testNO_more_undo").innerHTML += this.istrue(tps.hasTransactionToRedo())+" ";
        document.getElementById("testNO_more_undo").innerHTML += this.isequal(0, num.getNum())+" ";
        document.getElementById("testNO_more_undo").innerHTML += this.isequal(3, tps.getSize())+" ";
        document.getElementById("testNO_more_undo").innerHTML += this.isequal(3, tps.getRedoSize())+" ";
        document.getElementById("testNO_more_undo").innerHTML += this.isequal(0, tps.getUndoSize())+" ";


    }

    testRedo() {
        var tps = new jTPS();
        var num = new Num();
        document.getElementById("testtestRedo_init").innerHTML += this.isequal(num.getNum(),0)+" ";

        tps.addTransaction(new AddToNum_Transaction(num, 5));
        tps.addTransaction(new AddToNum_Transaction(num, 10));
        tps.addTransaction(new AddToNum_Transaction(num, 20));

        // Assert.assertTrue(tps.hasTransactionToUndo());
        // Assert.assertFalse(tps.hasTransactionToRedo());
        // Assert.assertEquals(35, num.getNum());
        // Assert.assertEquals(3, tps.getSize());
        // Assert.assertEquals(0, tps.getRedoSize());
        // Assert.assertEquals(3, tps.getUndoSize());


        document.getElementById("testtestRedo_addthree").innerHTML += this.istrue(tps.hasTransactionToUndo())+" ";
        document.getElementById("testtestRedo_addthree").innerHTML += this.isfalse(tps.hasTransactionToRedo())+" ";
        document.getElementById("testtestRedo_addthree").innerHTML += this.isequal(35, num.getNum())+" ";
        document.getElementById("testtestRedo_addthree").innerHTML += this.isequal(3, tps.getSize())+" ";
        document.getElementById("testtestRedo_addthree").innerHTML += this.isequal(0, tps.getRedoSize())+" ";
        document.getElementById("testtestRedo_addthree").innerHTML += this.isequal(3, tps.getUndoSize())+" ";


         // UNDO A TRANSACTION AND THEN REDO IT
         tps.undoTransaction();
         tps.doTransaction();

         

        //  Assert.assertTrue(tps.hasTransactionToUndo());
        //  Assert.assertFalse(tps.hasTransactionToRedo());
        //  Assert.assertEquals(35, num.getNum());
        //  Assert.assertEquals(3, tps.getSize());
        //  Assert.assertEquals(0, tps.getRedoSize());
        //  Assert.assertEquals(3, tps.getUndoSize());

         document.getElementById("testtestUndothenredo").innerHTML += this.istrue(tps.hasTransactionToUndo())+" ";
         document.getElementById("testtestUndothenredo").innerHTML += this.isfalse(tps.hasTransactionToRedo())+" ";
         document.getElementById("testtestUndothenredo").innerHTML += this.isequal(35, num.getNum())+" ";
         document.getElementById("testtestUndothenredo").innerHTML += this.isequal(3, tps.getSize())+" ";
         document.getElementById("testtestUndothenredo").innerHTML += this.isequal(0, tps.getRedoSize())+" ";
         document.getElementById("testtestUndothenredo").innerHTML += this.isequal(3, tps.getUndoSize())+" ";
 

        // UNDO TWO TRANSACTIONS AND THEN REDO THEM
        tps.undoTransaction();
        tps.undoTransaction();
        tps.doTransaction();
        tps.doTransaction();


        // Assert.assertTrue(tps.hasTransactionToUndo());
        // Assert.assertFalse(tps.hasTransactionToRedo());
        // Assert.assertEquals(35, num.getNum());
        // Assert.assertEquals(3, tps.getSize());
        // Assert.assertEquals(0, tps.getRedoSize());
        // Assert.assertEquals(3, tps.getUndoSize());

        document.getElementById("testtestUndothenredothem").innerHTML += this.istrue(tps.hasTransactionToUndo())+" ";
        document.getElementById("testtestUndothenredothem").innerHTML += this.isfalse(tps.hasTransactionToRedo())+" ";
        document.getElementById("testtestUndothenredothem").innerHTML += this.isequal(35, num.getNum())+" ";
        document.getElementById("testtestUndothenredothem").innerHTML += this.isequal(3, tps.getSize())+" ";
        document.getElementById("testtestUndothenredothem").innerHTML += this.isequal(0, tps.getRedoSize())+" ";
        document.getElementById("testtestUndothenredothem").innerHTML += this.isequal(3, tps.getUndoSize())+" ";

        // UNDO ALL THREE TRANSACTIONS AND REDO THEM
        tps.undoTransaction();
        tps.undoTransaction();
        tps.undoTransaction();
        tps.doTransaction();
        tps.doTransaction();
        tps.doTransaction();

        // Assert.assertTrue(tps.hasTransactionToUndo());
        // Assert.assertFalse(tps.hasTransactionToRedo());
        // Assert.assertEquals(35, num.getNum());
        // Assert.assertEquals(3, tps.getSize());
        // Assert.assertEquals(0, tps.getRedoSize());
        // Assert.assertEquals(3, tps.getUndoSize());

        document.getElementById("testtestUndoAllthenredothem").innerHTML += this.istrue(tps.hasTransactionToUndo())+" ";
        document.getElementById("testtestUndoAllthenredothem").innerHTML += this.isfalse(tps.hasTransactionToRedo())+" ";
        document.getElementById("testtestUndoAllthenredothem").innerHTML += this.isequal(35, num.getNum())+" ";
        document.getElementById("testtestUndoAllthenredothem").innerHTML += this.isequal(3, tps.getSize())+" ";
        document.getElementById("testtestUndoAllthenredothem").innerHTML += this.isequal(0, tps.getRedoSize())+" ";
        document.getElementById("testtestUndoAllthenredothem").innerHTML += this.isequal(3, tps.getUndoSize())+" ";



        // UNDO THREE TRANSACTIONS AND REDO TWO
        tps.undoTransaction();
        tps.undoTransaction();
        tps.undoTransaction();
        tps.doTransaction();
        tps.doTransaction();


        // Assert.assertTrue(tps.hasTransactionToUndo());
        // Assert.assertTrue(tps.hasTransactionToRedo());
        // Assert.assertEquals(15, num.getNum());
        // Assert.assertEquals(3, tps.getSize());
        // Assert.assertEquals(1, tps.getRedoSize());
        // Assert.assertEquals(2, tps.getUndoSize());
        document.getElementById("testtestUndothreethenredotwo").innerHTML += this.istrue(tps.hasTransactionToUndo())+" ";
        document.getElementById("testtestUndothreethenredotwo").innerHTML += this.istrue(tps.hasTransactionToRedo())+" ";
        document.getElementById("testtestUndothreethenredotwo").innerHTML += this.isequal(15, num.getNum())+" ";
        document.getElementById("testtestUndothreethenredotwo").innerHTML += this.isequal(3, tps.getSize())+" ";
        document.getElementById("testtestUndothreethenredotwo").innerHTML += this.isequal(1, tps.getRedoSize())+" ";
        document.getElementById("testtestUndothreethenredotwo").innerHTML += this.isequal(2, tps.getUndoSize())+" ";

        // UNDO ALL THREE TRANSACTIONS AND REDO FOUR, WHICH
        // SHOULD NOT PRODUCE AN ERROR BUT THE LAST
        // REDO SHOULD DO NOTHING
        tps.undoTransaction();
        tps.undoTransaction();
        tps.undoTransaction();
        tps.doTransaction();
        tps.doTransaction();
        tps.doTransaction();
        tps.doTransaction();

        // Assert.assertTrue(tps.hasTransactionToUndo());
        // Assert.assertFalse(tps.hasTransactionToRedo());
        // Assert.assertEquals(35, num.getNum());
        // Assert.assertEquals(3, tps.getSize());
        // Assert.assertEquals(0, tps.getRedoSize());
        // Assert.assertEquals(3, tps.getUndoSize());

        document.getElementById("testtestUndothreethenredofour").innerHTML += this.istrue(tps.hasTransactionToUndo())+" ";
        document.getElementById("testtestUndothreethenredofour").innerHTML += this.isfalse(tps.hasTransactionToRedo())+" ";
        document.getElementById("testtestUndothreethenredofour").innerHTML += this.isequal(35, num.getNum())+" ";
        document.getElementById("testtestUndothreethenredofour").innerHTML += this.isequal(3, tps.getSize())+" ";
        document.getElementById("testtestUndothreethenredofour").innerHTML += this.isequal(0, tps.getRedoSize())+" ";
        document.getElementById("testtestUndothreethenredofour").innerHTML += this.isequal(3, tps.getUndoSize())+" ";

    }

    testClear() {

        var tps = new jTPS();
        var num = new Num();
        document.getElementById("testClear_init").innerHTML += this.isequal(num.getNum(),0)+" ";

         // ADD 3 TRANSACTIONS (5, 10, and 15)
         tps.addTransaction(new AddToNum_Transaction(num, 5));
         tps.addTransaction(new AddToNum_Transaction(num, 10));
         tps.addTransaction(new AddToNum_Transaction(num, 20));

         
        //  Assert.assertEquals(35, num.getNum());
        //  Assert.assertEquals(3, tps.getSize());
        //  Assert.assertEquals(0, tps.getRedoSize());
        //  Assert.assertEquals(3, tps.getUndoSize());

        document.getElementById("testClear_Dothree").innerHTML += this.isequal(35, num.getNum())+" ";
        document.getElementById("testClear_Dothree").innerHTML += this.isequal(3, tps.getSize())+" ";
        document.getElementById("testClear_Dothree").innerHTML += this.isequal(0, tps.getRedoSize())+" ";
        document.getElementById("testClear_Dothree").innerHTML += this.isequal(3, tps.getUndoSize())+" ";

        // CLEAR ALL THE TRANSACTIONS
        tps.clearAllTransactions();

        // Assert.assertEquals(35, num.getNum());
        // Assert.assertEquals(0, tps.getSize());
        // Assert.assertEquals(0, tps.getRedoSize());
        // Assert.assertEquals(0, tps.getUndoSize());

        document.getElementById("testClear_all").innerHTML += this.isequal(35, num.getNum())+" ";
        document.getElementById("testClear_all").innerHTML += this.isequal(0, tps.getSize())+" ";
        document.getElementById("testClear_all").innerHTML += this.isequal(0, tps.getRedoSize())+" ";
        document.getElementById("testClear_all").innerHTML += this.isequal(0, tps.getUndoSize())+" ";

        // ADD 3 TRANSACTIONS (5, 10, and 15)
        tps.addTransaction(new AddToNum_Transaction(num, 5));
        tps.addTransaction(new AddToNum_Transaction(num, 10));
        tps.addTransaction(new AddToNum_Transaction(num, 20));

        // Assert.assertEquals(70, num.getNum());
        // Assert.assertEquals(3, tps.getSize());
        // Assert.assertEquals(0, tps.getRedoSize());
        // Assert.assertEquals(3, tps.getUndoSize());

        document.getElementById("testClear_addthree").innerHTML += this.isequal(70, num.getNum())+" ";
        document.getElementById("testClear_addthree").innerHTML += this.isequal(3, tps.getSize())+" ";
        document.getElementById("testClear_addthree").innerHTML += this.isequal(0, tps.getRedoSize())+" ";
        document.getElementById("testClear_addthree").innerHTML += this.isequal(3, tps.getUndoSize())+" ";

        // CLEAR THEM ALL OUT AGAIN
        tps.clearAllTransactions();

        // Assert.assertEquals(70, num.getNum());
        // Assert.assertEquals(0, tps.getSize());
        // Assert.assertEquals(0, tps.getRedoSize());
        // Assert.assertEquals(0, tps.getUndoSize());
        
        document.getElementById("testClear_all_agian").innerHTML += this.isequal(70, num.getNum())+" ";
        document.getElementById("testClear_all_agian").innerHTML += this.isequal(0, tps.getSize())+" ";
        document.getElementById("testClear_all_agian").innerHTML += this.isequal(0, tps.getRedoSize())+" ";
        document.getElementById("testClear_all_agian").innerHTML += this.isequal(0, tps.getUndoSize())+" ";

        // ADD 3 TRANSACTIONS (5, 10, and 15)
        tps.addTransaction(new AddToNum_Transaction(num, 5));
        tps.addTransaction(new AddToNum_Transaction(num, 10));
        tps.addTransaction(new AddToNum_Transaction(num, 20));

        // Assert.assertEquals(105, num.getNum());
        // Assert.assertEquals(3, tps.getSize());
        // Assert.assertEquals(0, tps.getRedoSize());
        // Assert.assertEquals(3, tps.getUndoSize());

        document.getElementById("testClear_addthreeagain").innerHTML += this.isequal(105, num.getNum())+" ";
        document.getElementById("testClear_addthreeagain").innerHTML += this.isequal(3, tps.getSize())+" ";
        document.getElementById("testClear_addthreeagain").innerHTML += this.isequal(0, tps.getRedoSize())+" ";
        document.getElementById("testClear_addthreeagain").innerHTML += this.isequal(3, tps.getUndoSize())+" ";

        
    }


    testOrMask() {
        var tps = new jTPS();
        var num = new Num();

        document.getElementById("initormask").innerHTML = this.isequal(num.getNum(),0);

        
        tps.addTransaction(new AddToNum_Transaction(num, 12));
        tps.addTransaction(new OrMask_Transaction(num, num.getNum(), 4));

        document.getElementById("add_five_ormaskand").innerHTML += this.isequal(num.getNum(),12) +" ";
        document.getElementById("add_five_ormaskand").innerHTML += this.isequal(tps.getSize(),2) +" ";


         // Assert.assertEquals(12, num.getNum());
        // Assert.assertEquals(2, tps.getSize());
        // Assert.assertEquals(1, tps.getRedoSize());
        // Assert.assertEquals(1, tps.getUndoSize());

        
        tps.undoTransaction();
        document.getElementById("add_five_ormaskand").innerHTML += this.isequal(num.getNum(),12) +" ";
        document.getElementById("add_five_ormaskand").innerHTML += this.isequal(tps.getSize(),2) +" ";
        document.getElementById("add_five_ormaskand").innerHTML += this.isequal(tps.getRedoSize(),1) +" ";
        document.getElementById("add_five_ormaskand").innerHTML += this.isequal(tps.getUndoSize(),1) +" ";

       
    }


}

var myClass = new jTPS_Unit_Tests();
console.log(myClass.testAdd())
console.log(myClass.testAndMask())
console.log(myClass.testUndo())
console.log(myClass.testRedo())
console.log(myClass.testClear())
console.log(myClass.testOrMask())







export default jTPS_Unit_Tests;