'use client';

import { useState } from 'react';
import { 
  submitContactForm, 
  getContactSubmissions,
  updateSubmissionStatus,
  deleteSubmission
} from '@/src/lib/servicers/contactService';

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [adminView, setAdminView] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await submitContactForm({
        name: formData.name,
        email: formData.email,
        subject: 'Contact Form Submission',
        message: formData.message
      });
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to submit form. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFetchSubmissions = async () => {
    setIsLoadingSubmissions(true);
    try {
      const result = await getContactSubmissions();
      setSubmissions(result.submissions || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch submissions');
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  const handleStatusUpdate = async (id: string) => {
    try {
      await updateSubmissionStatus(id);
      await handleFetchSubmissions();
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    try {
      await deleteSubmission(id);
      await handleFetchSubmissions();
    } catch (err: any) {
      setError(err.message || 'Failed to delete submission');
    }
  };

  return (
    <div className="flex min-h-screen text-black w-full justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Contact Us</h1>
          <p className="mt-2 text-sm text-gray-600">
            Have questions? We'd love to hear from you.
          </p>
        </div>

        {/* Admin toggle */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              setAdminView(!adminView);
              if (!adminView) handleFetchSubmissions();
            }}
            className="text-sm bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            {adminView ? 'User View' : 'Admin View'}
          </button>
        </div>

        {/* Status messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md">
            Thank you for your message! We'll get back to you soon.
          </div>
        )}

        {!adminView ? (
          // User Contact Form
          <div className="mt-8 bg-white text-black py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        ) : (
          // Admin Submission List
          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Contact Submissions</h2>
            
            {isLoadingSubmissions ? (
              <div className="text-center py-8 text-gray-500">Loading submissions...</div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No submissions found</div>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div key={submission.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{submission.name}</h3>
                        <p className="text-sm text-gray-600">{submission.email}</p>
                        <p className="mt-2 text-gray-700">{submission.message}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          submission.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {submission.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={() => handleStatusUpdate(submission.id)}
                        className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200 transition-colors"
                      >
                        Mark as {submission.status === 'pending' ? 'Resolved' : 'Pending'}
                      </button>
                      <button
                        onClick={() => handleDeleteSubmission(submission.id)}
                        className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}