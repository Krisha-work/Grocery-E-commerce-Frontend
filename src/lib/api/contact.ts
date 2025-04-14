// services/contactService.ts
import apiClient from "./apiHelper";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

interface ContactListResponse {
  submissions: ContactSubmission[];
  total: number;
  page: number;
  limit: number;
}

interface CreateContactParams {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFilterParams {
  status?: 'pending' | 'in_progress' | 'resolved';
  page?: number;
  limit?: number;
}

interface UpdateStatusParams {
  status: 'pending' | 'in_progress' | 'resolved';
}

export const ContactService = {
  submitContactForm: async (data: CreateContactParams): Promise<ContactSubmission> => {
    return apiClient.post("/contact", data);
  },

  getContactSubmissions: async (params: ContactFilterParams = {}): Promise<ContactListResponse> => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    return apiClient.get(`/contact?${queryParams.toString()}`);
  },

  updateContactStatus: async (id: string, status: UpdateStatusParams): Promise<ContactSubmission> => {
    return apiClient.put(`/contact/${id}/status`, status);
  },

  deleteContactSubmission: async (id: string): Promise<void> => {
    return apiClient.delete(`/contact/${id}`);
  },
};

export type { 
  ContactSubmission, 
  ContactListResponse, 
  CreateContactParams, 
  ContactFilterParams, 
  UpdateStatusParams 
};