import React from 'react';
import {Pie } from '@ant-design/charts';

function Chart({ sortedTransactionsProp }) {
    // const data = sortedTransactionsProp.map((item) => {
    //     return { date: item.date, amount: item.amount }
    // })

    // const spendingData = sortedTransactionsProp.filter(
    //     (trasaction)=>{if(trasaction.type === "expense"){
    //         return{
    //             tag: trasaction.tag,
    //             amount: trasaction.amount
    //         }
    //     }}
    // )
    const spendingData = sortedTransactionsProp
  .filter(transaction => transaction.type === "expense")
  .map(transaction => ({
    tag: transaction.tag,
    amount: transaction.amount
  }));


    // let finalSpendings = spendingData.reduce((acc, obj)=>{
    //     let key = obj.tag;
    //     if(!acc[key]){
    //         acc[key]={ tag: obj.tag, amount: obj.amount };
    //     }else{
    //         acc[key].amount +=obj.amount;
    //     }
    //     return acc;
    // },{});

    let newSpendings=[
        {tag:"food", amount:0},
        {tag:"education", amount:0},
        {tag:"office", amount:0},   
    ];
    spendingData.forEach((item)=>{
        if(item.tag==="food"){
            newSpendings[0].amount+=item.amount
        }
        else if(item.tag==="education"){
            newSpendings[1].amount+=item.amount
        }else{
            newSpendings[2].amount+=item.amount

        }
    })

    // const config = {
    //     data: data,
    //     width: 800,
    //     height: 400,
    //     autoFit: false,
    //     xField: 'date',
    //     yField: 'amount',
    //     point: {
    //         size: 5,
    //         shape: "diamond"
    //     },
    //     label: {
    //         style: {
    //             fill: "#aaa"
    //         }
    //     }
    // };
    const spendingConfig = {
        data: newSpendings,
        width: 800,
        height: 400,
        // autoFit: false,
        angleField: 'amount',
        colorField: 'tag',
    };
    // let chart;
    // let pieChart;
    return (
        <>
            <div className='charts-wrapper'>
                {/* <div>
                    <h2>Your Analytics</h2>

                <Line {...config} onReady={(chartInstance) => (chart = chartInstance)} />
                </div> */}
                <div>
                    <h2>Your Spendings</h2>
                    {/* <Pie {...spendingConfig} onReady={(chartInstance) => (pieChart = chartInstance)}/> */}
                    <Pie {...spendingConfig}/>

                {/* <Line {...config} onReady={(chartInstance) => (chart = chartInstance)} /> */}
                </div>
            </div>
        </>
    )
}

export default Chart