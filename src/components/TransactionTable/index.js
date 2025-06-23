import { Radio, Select, Space, Table } from 'antd';
import React, { useState } from 'react'
import searchImg from '../../assets/search.svg'
import Papa from 'papaparse';
import { toast } from 'react-toastify';
import './style.css';
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
const { Option } = Select;

function TransactionTable({ transactions, addTransaction, fetchTransactions, deleteTransaction, updateTransaction }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
        <Space size="large">

          <p className='link' onClick={() => deleteTransaction(record.id)}><DeleteTwoTone twoToneColor="#f55a42"/></p>
          <p className='link' onClick={()=> updateTransaction(record.id)} ><EditTwoTone twoToneColor="#4ee65d"/></p>
        </Space>
        </>
      ),
    }
  ];

  let filteredTransactions = transactions.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) && item.type.includes(typeFilter));

  let sortedTransactions = filteredTransactions.sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  function exportToCsv() {
    var csv = Papa.unparse({
      fields: ["name", "amount", "tag", "type", "date"],
      data: transactions
    });

    // to download file, we need to create a Blob, just like below
    const blob = new Blob([csv], { type: "text/csv; charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  function importFromCsv(event) {
    event.preventDefault();
    try {
      Papa.parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          console.log("Result>>>>>", results);

          // Now results.data is an array of objects representing your CSV rows
          for (const transaction of results.data) {
            // Write each transaction to Firebase, you can use the addTransaction function here
            console.log("Transactions", transaction);
            const newTransaction = {
              ...transaction,
              amount: parseFloat(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }
        },
      });
      toast.success("All Transactions Added");
      fetchTransactions();
      event.target.files = null;
    } catch (e) {
      toast.error(e.message);
    }
  }
  return (
    <div
      style={{
        width: "96%",
        padding: "0rem 2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div className="input-flex">
          <img src={searchImg} width="16" alt='search-image' />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={"Search by Name"}
          />
        </div>
        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>
      <div className="my-table">
        {/* upper part of the table includes buttons and filter */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          <h2>My Transactions</h2>

          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              width: "400px",
            }}
          >
            <button className="btn"
              onClick={exportToCsv}
            >
              Export to CSV
            </button>
            <label for="file-csv" className="btn btn-blue">
              Import from CSV
            </label>
            <input
              onChange={importFromCsv}
              id="file-csv"
              type="file"
              accept=".csv"
              required
              style={{ display: "none" }}
            />
          </div>
        </div>

        <Table className='table' dataSource={sortedTransactions} columns={columns} />;
      </div>
    </div>
  )
}

export default TransactionTable