import { ContactService } from "../api/contact";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Submit contact form
const submitContactForm = async (data: ContactFormData) => {
  try {
    const submission = await ContactService.submitContactForm(data);
    return submission;
  } catch (error) {
    console.error('Contact submission error:', error);
    throw error;
  }
};

// Get contact submissions (admin)
const getContactSubmissions = async () => {
  try {
    const { submissions } = await ContactService.getContactSubmissions({
      status: 'pending',
      page: 1,
      limit: 10
    });
    return { submissions };
  } catch (error) {
    console.error('Submissions fetch error:', error);
    throw error;
  }
};

// Update submission status (admin)
const updateSubmissionStatus = async (submissionId: string) => {
  try {
    const updated = await ContactService.updateContactStatus(submissionId, {
      status: 'resolved'
    });
    console.log('Status updated:', updated);
  } catch (error) {
    console.error('Status update error:', error);
  }
};

// Delete submission (admin)
const deleteSubmission = async (submissionId: string) => {
  try {
    await ContactService.deleteContactSubmission(submissionId);
    console.log('Submission deleted successfully');
  } catch (error) {
    console.error('Submission deletion error:', error);
  }
};


export { submitContactForm, getContactSubmissions, updateSubmissionStatus, deleteSubmission };