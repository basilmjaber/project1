import { projectId, publicAnonKey } from './supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4ce262a1`;

export interface SignupData {
  email: string;
  password: string;
  institutionName: string;
  country?: string;
  institutionType?: string;
}

export interface IssueCertificateData {
  studentName: string;
  degree: string;
  major: string;
  gpa?: string;
  issueDate: string;
  graduationDate: string;
}

export interface VerifyCertificateData {
  certificateId?: string;
  certificateData?: any;
}

class ApiClient {
  private getHeaders(includeAuth = false, token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else if (!includeAuth) {
      headers['Authorization'] = `Bearer ${publicAnonKey}`;
    }

    return headers;
  }

  async signup(data: SignupData) {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error('Signup error:', result);
      throw new Error(result.error || 'Signup failed');
    }
    return result;
  }

  async getCurrentUser(token: string) {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: this.getHeaders(true, token),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error('Get user error:', result);
      throw new Error(result.error || 'Failed to get user');
    }
    return result;
  }

  async issueCertificate(token: string, data: IssueCertificateData) {
    const response = await fetch(`${BASE_URL}/certificates/issue`, {
      method: 'POST',
      headers: this.getHeaders(true, token),
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error('Issue certificate error:', result);
      throw new Error(result.error || 'Failed to issue certificate');
    }
    return result;
  }

  async verifyCertificate(data: VerifyCertificateData) {
    const response = await fetch(`${BASE_URL}/certificates/verify`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error('Verify certificate error:', result);
      throw new Error(result.error || 'Failed to verify certificate');
    }
    return result;
  }

  async listCertificates(token: string) {
    const response = await fetch(`${BASE_URL}/certificates/list`, {
      method: 'GET',
      headers: this.getHeaders(true, token),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error('List certificates error:', result);
      throw new Error(result.error || 'Failed to list certificates');
    }
    return result;
  }
}

export const api = new ApiClient();
