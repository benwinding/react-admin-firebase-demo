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

// Fields the list views add to records for display only (see App.jsx); they
// must not be written back to Firestore.
const displayOnlyFields = ["rowIndex", "sorted", "children"];

function withoutDisplayFields(data) {
  const copy = { ...data };
  displayOnlyFields.forEach((field) => delete copy[field]);
  return copy;
}

export { withoutDisplayFields };
