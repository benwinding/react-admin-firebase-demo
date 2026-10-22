import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import pick from "lodash/pick";
import { Button, CreateBase, Form, SaveButton } from "react-admin";
import IconContentAdd from "@mui/icons-material/Add";
import IconCancel from "@mui/icons-material/Cancel";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

// Creates a record in a dialog and selects it in the parent form's `source` input.
// Only `fields` are saved: react-admin also merges a record passed in the page's
// location state (e.g. `prevs` from 下一步) into every form, this one included.
function QuickCreateButton({
  resource,
  title,
  ariaLabel,
  source,
  fields,
  children,
}) {
  const [showDialog, setShowDialog] = useState(false);
  const { setValue } = useFormContext();
  const queryClient = useQueryClient();

  const handleClick = () => {
    setShowDialog(true);
  };

  const handleCloseClick = () => {
    setShowDialog(false);
  };

  const onSuccess = (data) => {
    setShowDialog(false);
    // reload the reference choices, then select the newly created record
    queryClient.invalidateQueries({ queryKey: [resource] });
    setValue(source, data.id, { shouldDirty: true });
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
          transform={(data) => pick(data, fields)}
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
