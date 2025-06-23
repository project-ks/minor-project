import React, { useEffect, useState, useCallback, useMemo } from 'react'
import Header from '../components/Header'
import Cards from '../components/Cards'
// import { Modal } from 'antd';
import AddExpenseModal from '../components/Modals/addExpense';
import AddIncomeModal from '../components/Modals/addIncome';
import { auth, db, doc } from '../firebase';
import { toast } from 'react-toastify';
import { addDoc, collection, getDocs, query, deleteDoc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
// import moment from "moment";
import TransactionTable from '../components/TransactionTable';
import Chart from '../components/Charts';
import NoTransactions from '../components/NoTransaction';


function Dashboard() {

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [editTransaction, setEditTransaction] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  }

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  }

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  }
  const handleIncomeCancel = () => {
    console.log("income cancle");
    setIsIncomeModalVisible(false);
  }

  const onFinish = async (values, type) => {
    const transactionData = {
      type: type,
      date: values.date.format("YYYY-MM-DD"), // use "YYYY-MM-DD" to be consistent
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };

    try {
      if (isEditMode && editTransaction) {
        const transactionRef = doc(db, `users/${user.uid}/transactions`, editTransaction.id);
        await updateDoc(transactionRef, {
          ...transactionData,
          updatedAt: new Date(),
        });
        toast.success("Transaction updated!");
        console.log("Transaction updated:", transactionData);
        // After updateDoc(...)
        setTransactions((prev) =>
          prev.map((txn) =>
            txn.id === editTransaction.id
              ? { ...txn, ...transactionData, updatedAt: new Date() }
              : txn
          )
        );

      } else {
        await addTransaction({
          ...transactionData,
          createdAt: new Date(),
        });
        toast.success("Transaction added!");
      }
    } catch (err) {
      console.error("Error saving transaction:", err);
      toast.error("Something went wrong while saving");
    }

    // Reset state
    setIsEditMode(false);
    setEditTransaction(null);
    setIsExpenseModalVisible(false);
    setIsIncomeModalVisible(false);
  };




  // this function will create a transaction doc
  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if (!many)
        toast.success("Transaction Added!");
      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many)
        toast.error("Couldn't add transaction");

    }
  }

  async function deleteTransaction(transactionId) {
    if (!user || !transactionId) {
      console.error("Missing user or transaction ID");
      toast.error("Invalid transaction ID or user");
      return;
    }

    try {
      const transactionRef = doc(db, `users/${user.uid}/transactions/${transactionId}`);
      await deleteDoc(transactionRef);

      // Optimistically update local state
      setTransactions((prev) => prev.filter((txn) => txn.id !== transactionId));

      console.log("Transaction deleted successfully!");
      toast.success("Transaction Deleted!");
    } catch (e) {
      console.error("Error deleting transaction:", e);
      toast.error("Couldn't delete transaction");
    }
  }


  async function updateTransaction(transactionId) {
    if (!user || !transactionId) {
      console.error("Missing user or transaction ID");
      toast.error("Invalid transaction");
      return;
    }

    const transaction = transactions.find(txn => txn.id === transactionId);

    if (!transaction) {
      console.error("Transaction not found for ID:", transactionId);
      toast.error("Transaction not found");
      return;
    }

    // Log for debugging
    console.log("Editing transaction:", transaction);

    // Set state for modal form prefill
    setEditTransaction(transaction);
    setIsEditMode(true);

    // Show the appropriate modal
    if (transaction.type === "expense") {
      showExpenseModal();
      console.log("Expense modal opened");
    } else if (transaction.type === "income") {
      showIncomeModal();
      console.log("Income modal opened");
    } else {
      console.error("Invalid transaction type:", transaction.type);
      toast.error("Transaction type is invalid");
    }
  }

  // useEffect(() => {
  //   //get all docs from a collection
  //   fetchTransactions();
  // }, [user]);

  // useEffect(() => {
  //   //calculate balance everytime when transaction is done
  //   calculateBalance();
  // }, [transactions])


  // const calculateBalance = () => {
  //   let incomeTotal = 0;
  //   let expensesTotal = 0;

  //   transactions.forEach((transaction) => {
  //     if (transaction.type === "income") {
  //       incomeTotal += transaction.amount;
  //     } else {
  //       expensesTotal += transaction.amount;
  //     }
  //   });

  //   setIncome(incomeTotal);
  //   setExpense(expensesTotal);
  //   setTotalBalance(incomeTotal - expensesTotal);
  // };


  const calculateBalance = useCallback(() => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  }, [transactions]);

 useEffect(() => {
    //calculate balance everytime when transaction is done
    calculateBalance();
  }, [calculateBalance])

  // async function fetchTransactions() {
  //   setLoading(true);
  //   if (user) {
  //     const q = query(collection(db, `users/${user.uid}/transactions`));
  //     const querySnapshot = await getDocs(q);
  //     let transactionsArray = [];
  //     querySnapshot.forEach((doc) => {
  //       // doc.data() is never undefined for query doc snapshots
  //       // doc.data will get the data in object from which we will push it in the array
  //       transactionsArray.push({id: doc.id, ...doc.data()});
  //     });
  //     setTransactions(transactionsArray);
  //     console.log("array: ", transactionsArray);

  //     toast.success("Transactions Fetched!");
  //   }
  //   setLoading(false);
  // }

  // let sortedTransactions=transactions.sort((a,b)=>{
  //   return new Date(a.date) - new Date(b.date)
  // })

  // Wrap fetchTransactions with useCallback to avoid recreating function every render
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        transactionsArray.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(transactionsArray);
      console.log("array: ", transactionsArray);

      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }, [user]);

  // Use useMemo to avoid mutating the original transactions array with sort
  const sortedTransactions = useMemo(() => {
    if (!transactions) return [];
    // Create a shallow copy before sorting to avoid mutating state directly
    return [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactions]);

    useEffect(() => {
    //get all docs from a collection
    fetchTransactions();
  }, [fetchTransactions]);


  return (
    <>
      <div>
        <Header />
        {loading ? <p>Loading...</p>
          : <>
            <Cards
              income={income}
              expense={expense}
              totalBalance={totalBalance}
              showExpenseModal={showExpenseModal}
              showIncomeModal={showIncomeModal}
            />
            {transactions.length !== 0 ? <Chart sortedTransactionsProp={sortedTransactions} /> : <NoTransactions />}
            <AddExpenseModal isExpenseModalVisible={isExpenseModalVisible} handleExpenseCancel={handleExpenseCancel} onFinish={onFinish} updateTransaction={editTransaction} isEditMode={isEditMode} />

            <AddIncomeModal isIncomeModalVisible={isIncomeModalVisible} handleIncomeCancel={handleIncomeCancel} onFinish={onFinish} updateTransaction={editTransaction} isEditMode={isEditMode} />

            <TransactionTable transactions={transactions} addTransaction={addTransaction} fetchTransactions={fetchTransactions} deleteTransaction={deleteTransaction} updateTransaction={updateTransaction} />

          </>}
      </div>
    </>
  )
}

export default Dashboard