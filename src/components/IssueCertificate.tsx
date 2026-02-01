import { useState } from 'react';
import { Building2, User, FileText, Calendar, Award, CheckCircle, Loader2, Lock, Eye, EyeOff, Upload } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface IssuedCertificate {
  certificateId: string;
  blockchainHash: string;
  transactionId: string;
  blockHeight: string;
  timestamp: string;
}

export function IssueCertificate() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [formData, setFormData] = useState({
    institutionName: '',
    studentName: '',
    universityId: '',
    degree: '',
    major: '',
    generalGrade: '',
    issueDate: '',
    graduationDate: '',
  });

  const [issuing, setIssuing] = useState(false);
  const [issued, setIssued] = useState<IssuedCertificate | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);

  // Mock admin credentials (in production, this would be handled by backend)
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'admin123';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);

    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      setLoginError('Invalid username or password');
    }

    setLoggingIn(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setCertificateFile(file);
      } else {
        alert('Please upload a PDF file only');
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!certificateFile) {
      alert('Please upload the certificate PDF file');
      return;
    }
    
    setIssuing(true);

    try {
      // Call backend API to store certificate in database
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4ce262a1/certificates/issue`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            ...formData,
            fileName: certificateFile.name,
            fileSize: certificateFile.size,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(`Error issuing certificate: ${result.error || 'Unknown error'}`);
        setIssuing(false);
        return;
      }

      // Successfully issued
      setIssued({
        certificateId: result.certificate.certificateId,
        blockchainHash: result.certificate.blockchainHash,
        transactionId: result.certificate.transactionId,
        blockHeight: result.certificate.blockHeight.toString(),
        timestamp: result.certificate.timestamp,
      });

    } catch (error) {
      console.error('Error issuing certificate:', error);
      alert('Failed to issue certificate. Please try again.');
    } finally {
      setIssuing(false);
    }
  };

  const handleReset = () => {
    setFormData({
      institutionName: '',
      studentName: '',
      universityId: '',
      degree: '',
      major: '',
      generalGrade: '',
      issueDate: '',
      graduationDate: '',
    });
    setIssued(null);
    setCertificateFile(null);
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
              <Lock className="size-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Administrator Login
            </h2>
            <p className="text-gray-600">
              Please sign in to issue academic certificates
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">{loginError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loggingIn ? (
                <>
                  <Loader2 className="size-5 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <Lock className="size-5 mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Certificate Issue Form (after authentication)
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Issue Academic Certificate
        </h1>
        <p className="text-lg text-gray-600">
          Upload certificate PDF and enter student information to register on Hyperledger Fabric blockchain
        </p>
      </div>

      {!issued ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="space-y-6">
            {/* CERTIFICATE UPLOAD - AT TOP */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg mr-3">
                  <Upload className="size-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Upload Certificate (PDF Only) *
                  </h3>
                  <p className="text-sm text-gray-600">
                    Upload the official certificate document
                  </p>
                </div>
              </div>

              <div className="border-2 border-dashed border-blue-400 bg-white rounded-lg p-6 text-center hover:border-blue-600 hover:bg-blue-50 transition-all">
                <input
                  type="file"
                  id="certificate-upload"
                  className="hidden"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  required
                />
                <label
                  htmlFor="certificate-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  {certificateFile ? (
                    <>
                      <FileText className="size-12 text-blue-600 mb-3" />
                      <span className="text-sm text-blue-600 font-medium mb-1">
                        {certificateFile.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({(certificateFile.size / 1024).toFixed(2)} KB)
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="size-12 text-gray-400 mb-3" />
                      <span className="text-sm text-gray-600 font-medium mb-1">
                        Click to upload certificate PDF
                      </span>
                      <span className="text-xs text-gray-500">
                        PDF files only, up to 10MB
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Institution Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Building2 className="size-5 mr-2 text-blue-600" />
                Institution Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution Name *
                  </label>
                  <input
                    type="text"
                    name="institutionName"
                    value={formData.institutionName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Stanford University"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <User className="size-5 mr-2 text-blue-600" />
                Student Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    University ID Number *
                  </label>
                  <input
                    type="text"
                    name="universityId"
                    value={formData.universityId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., STU-2024-12345"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    The unique student identification number from your institution
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Award className="size-5 mr-2 text-blue-600" />
                Academic Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Degree Type *
                  </label>
                  <select
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Degree</option>
                    <option value="Bachelor">Bachelor's Degree</option>
                    <option value="Master">Master's Degree</option>
                    <option value="PhD">Doctoral Degree (PhD)</option>
                    <option value="Associate">Associate Degree</option>
                    <option value="Diploma">Diploma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Major/Field of Study *
                  </label>
                  <input
                    type="text"
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    General Grade *
                  </label>
                  <select
                    name="generalGrade"
                    value={formData.generalGrade}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Grade</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Graduation Date *
                  </label>
                  <input
                    type="date"
                    name="graduationDate"
                    value={formData.graduationDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="size-5 mr-2 text-blue-600" />
                Issuance Details
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Date *
                </label>
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={issuing}
              className="flex-1 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {issuing ? (
                <>
                  <Loader2 className="size-5 mr-2 animate-spin" />
                  Registering on Hyperledger Fabric...
                </>
              ) : (
                <>
                  <FileText className="size-5 mr-2" />
                  Issue Certificate
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Reset Form
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-green-500">
          <div className="text-center mb-8">
            <CheckCircle className="size-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mb-2">
              Certificate Issued Successfully!
            </h2>
            <p className="text-gray-600">
              The certificate has been registered on Hyperledger Fabric and is now verifiable.
            </p>
          </div>

          <div className="space-y-4 border-t pt-6">
            <h3 className="font-semibold text-lg mb-4">Hyperledger Fabric Registration Details</h3>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <FileText className="size-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Certificate ID</p>
                  <p className="font-bold text-lg text-blue-900">{issued.certificateId}</p>
                  <p className="text-xs text-gray-500 mt-1">Share this ID with the student for verification purposes</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg space-y-3">
              <div>
                <p className="text-sm text-gray-600">Blockchain Network</p>
                <p className="font-semibold text-gray-900">Hyperledger Fabric</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Transaction ID</p>
                <p className="font-mono text-sm text-gray-900">{issued.transactionId}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-600">Block Height</p>
                  <p className="font-medium text-gray-900">{issued.blockHeight}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Timestamp</p>
                  <p className="font-medium text-gray-900">{new Date(issued.timestamp).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Certificate Hash (SHA-256)</p>
                <p className="font-mono text-xs break-all text-gray-700 bg-white p-2 rounded">{issued.blockchainHash}</p>
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <h4 className="font-semibold mb-3">Certificate Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Student Name</p>
                  <p className="font-medium">{formData.studentName}</p>
                </div>
                <div>
                  <p className="text-gray-600">University ID</p>
                  <p className="font-medium">{formData.universityId}</p>
                </div>
                <div>
                  <p className="text-gray-600">Institution</p>
                  <p className="font-medium">{formData.institutionName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Degree</p>
                  <p className="font-medium">{formData.degree} in {formData.major}</p>
                </div>
                <div>
                  <p className="text-gray-600">General Grade</p>
                  <p className="font-medium">{formData.generalGrade}</p>
                </div>
                <div>
                  <p className="text-gray-600">Graduation Date</p>
                  <p className="font-medium">{formData.graduationDate}</p>
                </div>
                <div>
                  <p className="text-gray-600">Certificate File</p>
                  <p className="font-medium">{certificateFile?.name}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleReset}
              className="flex-1 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Issue Another Certificate
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Print Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}