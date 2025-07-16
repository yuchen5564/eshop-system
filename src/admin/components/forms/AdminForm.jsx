import React from 'react';
import { Form } from 'antd';

const AdminForm = ({ 
  form,
  onFinish,
  onFinishFailed,
  layout = 'vertical',
  children,
  initialValues,
  ...props 
}) => {
  return (
    <Form
      form={form}
      layout={layout}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={initialValues}
      {...props}
    >
      {children}
    </Form>
  );
};

export default AdminForm;