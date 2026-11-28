
export const exportCSV = (transactions, fileName = "transactions") => {
  if (!transactions || transactions.length === 0) {
    alert("No transactions found to export");
    return;
  }

  const headers = [
    "Title",
    "Category",
    "Date",
    "Amount",
    "Type",
    "Description",
  ];

  const escapeCSV = (value) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;

  const rows = transactions.map((item) => {
    const date = item.date
      ? new Date(item.date).toISOString().slice(0, 10)
      : "";

    return [
      item.title,
      item.category,
      date,
      item.amount,
      item.type,
      item.description,
    ];
  });

  const csvContent = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => row.map(escapeCSV).join(",")),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${fileName}.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};
