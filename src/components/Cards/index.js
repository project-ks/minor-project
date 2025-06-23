import React from 'react';
import "./style.css";
import { Card, Row } from 'antd';
import Button from '../Button';
function Cards({showExpenseModal, showIncomeModal, income, expense, totalBalance}) {
    return (
        <>
            <Row className="my-row">
                <Card className="my-card">
                    <h2>Current Balance</h2>
                    <p>₹{totalBalance}</p>
                    <Button text="Reset Balance" blue="true" />
                </Card>

                <Card className="my-card">
                    <h2>Total Income</h2>
                    <p>₹{income}</p>
                    <Button text="Add Income" blue="true" onBtnClick={showIncomeModal}/>
                </Card>

                <Card className="my-card">
                    <h2>Add Expenses</h2>
                    <p>₹{expense}</p>
                    <Button text="Add Expense" blue="true" onBtnClick={showExpenseModal}/>
                </Card>
            </Row>
        </>
    )
}

export default Cards