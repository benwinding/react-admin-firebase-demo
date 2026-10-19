import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button, CreateBase, Form, SaveButton } from "react-admin";
import IconContentAdd from "@mui/icons-material/Add";
import IconCancel from "@mui/icons-material/Cancel";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

// Creates a record in a dialog and selects it in the parent form's `source` input.
function QuickCreateButton({
  resource,
  title,
  ariaLabel,
  source,
  onChange,
  children,
}) {
  const [showDialog, setShowDialog] = useState(false);
  const { setValue } = useFormContext();

  const handleClick = () => {
    setShowDialog(true);
  };

  const handleCloseClick = () => {
    setShowDialog(false);
  };

  const onSuccess = (data) => {
    setShowDialog(false);
    // Update the parent form to target the newly created record
    // Updating the ReferenceInput key will force it to reload the available records
    setValue(source, data.id, { shouldDirty: true });
    onChange();
  };

  return (
    <>
      <Button onClick={handleClick} label="ra.action.create">
        <IconContentAdd />
      </Button>

      <Dialog
        fullWidth
        open={showDialog}
        onClose={handleCloseClick}
        aria-label={ariaLabel}
      >
        <DialogTitle>{title}</DialogTitle>

        <CreateBase
          resource={resource}
          redirect={false}
          mutationOptions={{ onSuccess }}
        >
          <Form>
            <DialogContent>{children}</DialogContent>
            <DialogActions>
              <Button label="ra.action.cancel" onClick={handleCloseClick}>
                <IconCancel />
              </Button>
              <SaveButton />
            </DialogActions>
          </Form>
        </CreateBase>
      </Dialog>
    </>
  );
}

export default QuickCreateButton;
