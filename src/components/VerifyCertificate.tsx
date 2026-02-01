import { useState } from 'react';
import { Upload, CheckCircle, XCircle, Hash, Calendar, Building2, User, FileText, Loader2 } from 'lucide-react';

interface VerificationResult {
  status: 'valid' | 'invalid' | 'not-found';
  certificateId?: string;
  studentName?: string;
  institution?: string;
  degree?: string;
  issueDate?: string;
  blockchainHash?: string;
  blockNumber?: string;
  timestamp?: string;
}

export function VerifyCertificate() {
  const [file, setFile] = useState<File | null>(null);
  const [certificateId, setCertificateId] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const mockVerify = async (): Promise<VerificationResult> => {
    // Simulate blockchain verification delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock verification logic
    const mockCertificates: Record<string, VerificationResult> = {
      'CERT-2024-001': {
        status: 'valid',
        certificateId: 'CERT-2024-001',
        studentName: 'John Smith',
        institution: 'Stanford University',
        degree: 'Bachelor of Science in Computer Science',
        issueDate: '2024-05-15',
        blockchainHash: '0x8a4f5e9c2b1d3a7e6f4c8b9d2e5a7f3c1b8e4d6a9c2f5e8b1d4a7c3e6f9b2d5a',
        blockNumber: '18472934',
        timestamp: '2024-05-15T14:30:00Z',
      },
      'CERT-2024-002': {
        status: 'valid',
        certificateId: 'CERT-2024-002',
        studentName: 'Sarah Johnson',
        institution: 'MIT',
        degree: 'Master of Science in Artificial Intelligence',
        issueDate: '2024-06-20',
        blockchainHash: '0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c',
        blockNumber: '18523456',
        timestamp: '2024-06-20T16:45:00Z',
      },
    };

    // Check file name or certificate ID
    if (file) {
      const fileName = file.name.toLowerCase();
      if (fileName.includes('cert-2024-001') || fileName.includes('stanford')) {
        return mockCertificates['CERT-2024-001'];
      } else if (fileName.includes('cert-2024-002') || fileName.includes('mit')) {
        return mockCertificates['CERT-2024-002'];
      }
    }

    if (certificateId && mockCertificates[certificateId]) {
      return mockCertificates[certificateId];
    }

    // Random validation for demo
    if (Math.random() > 0.3) {
      return mockCertificates['CERT-2024-001'];
    }

    return {
      status: 'invalid',
    };
  };

  const handleVerify = async () => {
    if (!file && !certificateId) {
      return;
    }

    setVerifying(true);
    const verificationResult = await mockVerify();
    setResult(verificationResult);
    setVerifying(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Verify Academic Certificate
        </h1>
        <p className="text-lg text-gray-600">
          Upload a certificate or enter its ID to verify authenticity using blockchain technology.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
        {/* Upload Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Certificate (PDF, JPG, PNG)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="size-12 text-gray-400 mb-3" />
              <span className="text-sm text-gray-600 mb-1">
                {file ? file.name : 'Click to upload or drag and drop'}
              </span>
              <span className="text-xs text-gray-500">
                PDF, JPG, PNG up to 10MB
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Certificate ID Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Certificate ID
          </label>
          <input
            type="text"
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
            placeholder="e.g., CERT-2024-001"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-2 text-xs text-gray-500">
            Try: CERT-2024-001 or CERT-2024-002 for demo
          </p>
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={(!file && !certificateId) || verifying}
          className="w-full py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {verifying ? (
            <>
              <Loader2 className="size-5 mr-2 animate-spin" />
              Verifying on Blockchain...
            </>
          ) : (
            'Verify Certificate'
          )}
        </button>
      </div>

      {/* Verification Result */}
      {result && (
        <div className={`bg-white rounded-2xl shadow-xl p-6 sm:p-8 border-2 ${
          result.status === 'valid' 
            ? 'border-green-500' 
            : 'border-red-500'
        }`}>
          <div className="flex items-center mb-6">
            {result.status === 'valid' ? (
              <>
                <CheckCircle className="size-12 text-green-500 mr-4" />
                <div>
                  <h2 className="text-2xl font-bold text-green-700">Certificate Verified</h2>
                  <p className="text-gray-600">This certificate is authentic and registered on the blockchain.</p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="size-12 text-red-500 mr-4" />
                <div>
                  <h2 className="text-2xl font-bold text-red-700">Verification Failed</h2>
                  <p className="text-gray-600">This certificate could not be verified or does not exist in our blockchain records.</p>
                </div>
              </>
            )}
          </div>

          {result.status === 'valid' && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-semibold text-lg mb-4">Certificate Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <FileText className="size-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Certificate ID</p>
                    <p className="font-medium">{result.certificateId}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <User className="size-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Student Name</p>
                    <p className="font-medium">{result.studentName}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Building2 className="size-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Institution</p>
                    <p className="font-medium">{result.institution}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="size-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Issue Date</p>
                    <p className="font-medium">{result.issueDate}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start mt-4">
                <FileText className="size-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Degree</p>
                  <p className="font-medium">{result.degree}</p>
                </div>
              </div>

              <div className="border-t pt-4 mt-6">
                <h4 className="font-semibold mb-3">Blockchain Information</h4>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Hash className="size-5 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500">Transaction Hash</p>
                      <p className="font-mono text-sm break-all">{result.blockchainHash}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Block Number</p>
                      <p className="font-medium">{result.blockNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Timestamp</p>
                      <p className="font-medium">{new Date(result.timestamp!).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
