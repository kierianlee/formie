import { deleteSubmission } from "@/actions/delete-submission";

interface DeleteFormButtonProps {
  submissionId: string;
}

function DeleteSubmissionButton({ submissionId }: DeleteFormButtonProps) {
  const deleteSubmissionWithId = deleteSubmission.bind(null, submissionId);

  return (
    <form action={deleteSubmissionWithId}>
      <button type="submit" className="text-red-400">
        Delete
      </button>
    </form>
  );
}

export default DeleteSubmissionButton;
