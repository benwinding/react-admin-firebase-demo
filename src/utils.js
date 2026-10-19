function getRecordField(record, field) {
  if (record) {
    return record[field];
  } else {
    console.trace();
    alert("連線逾期。");
    window.location.reload();
    return null;
  }
}

export { getRecordField };
