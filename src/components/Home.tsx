import { Search } from 'lucide-react';
import { useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function Home() {
  const [certificateId, setCertificateId] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleVerify = async () => {
    if (!certificateId) return;

    setVerifying(true);
    setResult(null);

    try {
      // Call backend API to verify certificate
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4ce262a1/certificates/verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            certificateId: certificateId.trim(),
          }),
        }
      );

      const data = await response.json();

      if (data.status === 'valid') {
        setResult({
          status: 'valid',
          ...data.certificate,
        });
      } else {
        setResult({
          status: 'invalid',
          message: data.message || 'Certificate not found',
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      setResult({
        status: 'invalid',
        message: 'Error verifying certificate. Please try again.',
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Certificate Verification Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Verify academic certificates using Hyperledger Fabric blockchain
        </p>
      </div>

      {/* Student Verification Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center">
            <Search className="size-6 text-white mr-3" />
            <div>
              <h2 className="text-xl font-bold text-white">Student Verification</h2>
              <p className="text-blue-100 text-sm">Quick verification by Certificate ID</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate ID *
            </label>
            <input
              type="text"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              placeholder="e.g., CERT-2026-12345"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
            />
            <p className="mt-2 text-xs text-gray-500">
              Enter the Certificate ID provided with your degree certificate
            </p>
          </div>

          <button
            onClick={handleVerify}
            disabled={!certificateId || verifying}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {verifying ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Verifying...
              </>
            ) : (
              <>
                <Search className="size-5 mr-2" />
                Verify Certificate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Verification Result */}
      {result && (
        <div className={`mt-6 bg-white rounded-xl shadow-lg border-2 p-6 sm:p-8 ${
          result.status === 'valid' ? 'border-green-500' : 'border-red-500'
        }`}>
          {result.status === 'valid' ? (
            <>
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-green-700">Certificate Verified ✓</h3>
                  <p className="text-gray-600">This certificate is authentic and registered on Hyperledger Fabric</p>
                </div>
              </div>

              <div className="space-y-4 border-t pt-6">
                <h4 className="font-semibold text-lg mb-3">Certificate Details</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Certificate ID</p>
                    <p className="font-semibold text-gray-900">{result.certificateId}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Student Name</p>
                    <p className="font-semibold text-gray-900">{result.studentName}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">University ID</p>
                    <p className="font-semibold text-gray-900">{result.universityId}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Institution</p>
                    <p className="font-semibold text-gray-900">{result.institution}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg sm:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Degree</p>
                    <p className="font-semibold text-gray-900">{result.degree} in {result.major}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">General Grade</p>
                    <p className="font-semibold text-gray-900">{result.generalGrade}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Graduation Date</p>
                    <p className="font-semibold text-gray-900">{result.graduationDate}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Issue Date</p>
                    <p className="font-semibold text-gray-900">{result.issueDate}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Verification Date</p>
                    <p className="font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-red-700">Certificate Not Verified</h3>
                <p className="text-gray-600 mt-1">{result.message || 'This certificate could not be verified or does not exist in the system'}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
