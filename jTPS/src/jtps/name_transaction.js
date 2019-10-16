public interface jTPS_Transaction {
    /**
     * This method is called by jTPS when a transaction is executed.
     */
    public void doTransaction();
    
    /**
     * This method is called by jTPS when a transaction is undone.
     */
    public void undoTransaction();
}