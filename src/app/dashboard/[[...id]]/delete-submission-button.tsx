import { deleteSubmission } from "@/actions/delete-submission";
import { useState } from "react";
import toast from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";

interface DeleteFormButtonProps {
  submissionId: string;
}

function DeleteSubmissionButton({ submissionId }: DeleteFormButtonProps) {
  const deleteSubmissionWithId = deleteSubmission.bind(null, submissionId);
  const [submitting, setSubmitting] = useState(false);

  return (
    <button
      type="submit"
      className="flex items-center gap-4 text-red-400"
      onClick={async () => {
        setSubmitting(true);
        try {
          await deleteSubmissionWithId();
          toast.success("Submission deleted");
        } catch (err) {
          toast.error("Couldn't delete submission");
        }
        setSubmitting(false);
      }}
    >
      <span>Delete</span>
      {submitting && (
        <TailSpin
          height="20"
          width="20"
          color="#4fa94d"
          ariaLabel="tail-spin-loading"
          radius="1"
        />
      )}
    </button>
  );
}

export default DeleteSubmissionButton;
