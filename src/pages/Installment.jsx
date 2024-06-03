import React, { useState } from "react";
import { Table, Input, Button, Space, Select } from "antd";

const installmentData = [
  {
    key: "1",
    installmentNumber: 1,
    dueDate: "2024-06-15",
    amount: "₹500",
    status: "Pending",
  },
  {
    key: "2",
    installmentNumber: 2,
    dueDate: "2024-07-15",
    amount: "₹500",
    status: "Pending",
  },
  {
    key: "3",
    installmentNumber: 3,
    dueDate: "2024-08-15",
    amount: "₹500",
    status: "Pending",
  },
  {
    key: "4",
    installmentNumber: 4,
    dueDate: "2024-09-15",
    amount: "₹500",
    status: "Success",
  },
];

const InstallmentTable = () => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const clearFilters = () => {
    setFilteredInfo({});
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => {
      const handleSelectChange = (value) => {
        setSelectedKeys(value ? [value] : []);
        confirm();
      };

      return (
        <div style={{ padding: 8 }}>
          {dataIndex === "status" ? (
            <Select
              value={selectedKeys[0]}
              onChange={handleSelectChange}
              style={{ width: "100%", marginBottom: 8, display: "block" }}
            >
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Paid">Paid</Select.Option>
            </Select>
          ) : (
            <Input
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={confirm}
              style={{ marginBottom: 8, display: "block" }}
            />
          )}
          <Space>
            <Button
              type="primary"
              onClick={confirm}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      );
    },
    filterIcon: (filtered) => (
      <i
        className="fas fa-filter"
        style={{ color: filtered ? "#1890ff" : undefined }}
      />
    ),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => document.getElementById("search-input").select(), 100);
      }
    },
  });

  const columns = [
    {
      title: "Installment Number",
      dataIndex: "installmentNumber",
      key: "installmentNumber",
      sorter: (a, b) => a.installmentNumber - b.installmentNumber,
      sortOrder:
        sortedInfo.columnKey === "installmentNumber" && sortedInfo.order,
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
      sortOrder: sortedInfo.columnKey === "dueDate" && sortedInfo.order,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) =>
        parseInt(a.amount.slice(1)) - parseInt(b.amount.slice(1)),
      sortOrder: sortedInfo.columnKey === "amount" && sortedInfo.order,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Paid", value: "Paid" },
      ],
      filteredValue: filteredInfo.status || null,
      onFilter: (value, record) => record.status.includes(value),
      ...getColumnSearchProps("status"),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={clearFilters}>Clear filters</Button>
        <Button onClick={clearAll}>Clear filters and sorters</Button>
      </Space>
      <Table
        columns={columns}
        dataSource={installmentData}
        onChange={handleChange}
        pagination={false}
        bordered
      />
    </div>
  );
};

export default InstallmentTable;
