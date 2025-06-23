import React, { useEffect } from "react";
import { Button, Modal, Form, Input, DatePicker, Select } from "antd";
import moment from "moment";

function AddExpenseModal({ isExpenseModalVisible, handleExpenseCancel, onFinish, updateTransaction, isEditMode }) {
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
  }, [isEditMode, updateTransaction,form]);
  return (
    <Modal
      style={{ fontWeight: 600 }}
      title={isEditMode ? "Edit Expense" : "Add Expense"}
      open={isExpenseModalVisible}
      onCancel={handleExpenseCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onFinish(values, "expense", isEditMode ? updateTransaction.id : null);
          form.resetFields();
        }}
      >
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Source"
          name="name"
          rules={[
            {
              required: true, message: "Please input the name of the transaction!",
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
            { required: true, message: "Please input the expense amount!" },
          ]}
        >
          <Input type="number" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Date"
          name="date"
          rules={[
            { required: true, message: "Please select the expense date!" },
          ]}
        >
          <DatePicker className="custom-input" format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          label="Tag"
          name="tag"
          style={{ fontWeight: 600 }}
          rules={[{ required: true, message: "Please select a tag!" }]}
        >
          <Select className="select-input-2">
            <Select.Option value="food">Food</Select.Option>
            <Select.Option value="education">Education</Select.Option>
            <Select.Option value="office">Office</Select.Option>
            {/* Add more tags here */}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button onClick={handleExpenseCancel} className="btn btn-blue" type="primary" htmlType="submit">
            {isEditMode ? "Edit Expense" : "Add Expense"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddExpenseModal;