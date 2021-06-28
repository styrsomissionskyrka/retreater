import { Fragment, useState } from 'react';

import { Button, Dialog, Form, toast } from 'components';
import { getNewFileHandle, verifyPermission, writeFile, supportsFileSystemAPI } from 'lib/utils/files';

interface ExportRetreatOrdersProps {
  retreatId: string;
}

export const ExportRetreatOrders: React.FC<ExportRetreatOrdersProps> = ({ retreatId }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [confirmedOnly, setCOnfirmedOnly] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  let action = '/api/retreats/export';
  let href = `${action}?${new URLSearchParams({
    retreatId,
    confirmedOnly: confirmedOnly ? 'true' : 'false',
  }).toString()}`;

  const downloadCSV = async (): Promise<void> => {
    let result = await fetch(href).then((r) => r.text());
    let fileHandle = await getNewFileHandle();
    await verifyPermission(fileHandle, true);
    await writeFile(fileHandle, result);
  };

  const exportRetreatOrders: React.FormEventHandler<HTMLFormElement> = async (event) => {
    if (!supportsFileSystemAPI()) return;

    event.preventDefault();
    setIsSubmitting(true);

    try {
      await toast.promise(downloadCSV(), {
        loading: '...',
        success: 'Bokningar exporterad.',
        error: 'Kunde inte exportera bokningar.',
      });
    } catch (error) {
      // void
    } finally {
      setShowDialog(false);
      setIsSubmitting(false);
    }
  };

  return (
    <Fragment>
      <Button onClick={() => setShowDialog(true)}>Exportera</Button>
      <Dialog isOpen={showDialog} onDismiss={() => setShowDialog(false)}>
        <form
          method="GET"
          action={action}
          className="w-full flex items-center justify-between"
          onSubmit={exportRetreatOrders}
        >
          <input type="hidden" name="retreatId" value={retreatId} />
          <Form.Checkbox
            name="confirmedOnly"
            label="Bara konfirmerade"
            value="true"
            checked={confirmedOnly}
            onChange={(e) => setCOnfirmedOnly(e.target.checked)}
          />
          <Form.Submit size="small" variant="outline" isSubmitting={isSubmitting}>
            Exportera
          </Form.Submit>
        </form>
      </Dialog>
    </Fragment>
  );
};
