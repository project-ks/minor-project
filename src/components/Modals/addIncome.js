import React, { useEffect } from "react";
import "../../../src/index.css";
import {Button, Modal, Form, Input, DatePicker, Select} from "antd";
import moment from "moment";

function AddIncomeModal({isIncomeModalVisible, handleIncomeCancel, onFinish, updateTransaction, isEditMode}) {
  const [form] = Form.useForm();
  useEffect(() => {
      if (isEditMode && updateTransaction) {
        form.setFieldsValue({
          ...updateTransaction,
          date: updateTransaction.date ? moment(updateTransaction.date) : null,
        });
      } else {
        form.resetFields();
      }
    }, [form, isEditMode, updateTransaction]);
  return (
    <Modal
      style={{ fontWeight: 600 }}
      title={isEditMode ? "Edit Income" : "Add Income"}
      open={isIncomeModalVisible}
      onCancel={handleIncomeCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onFinish(values, "income", isEditMode ? updateTransaction.id : null);
          form.resetFields();
        }}
      >
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Source"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the name of the transaction!",
            },
          ]}
        >
          <Input type="text" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Amount"
          name="amount"
          rules={[
            { required: true, message: "Please input the income amount!" },
          ]}
        >
          <Input type="number" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Date"
          name="date"
          rules={[
            { required: true, message: "Please select the income date!" },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Tag"
          name="tag"
          rules={[{ required: true, message: "Please select a tag!" }]}
        >
          <Select className="select-input-2">
            <Select.Option value="salary">Salary</Select.Option>
            <Select.Option value="freelance">Freelance</Select.Option>
            <Select.Option value="investment">Investment</Select.Option>
            {/* Add more tags here */}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button onClick={handleIncomeCancel} className="btn btn-blue" type="primary" htmlType="submit">
           {isEditMode ? "Edit Income" : "Add Income"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddIncomeModal;