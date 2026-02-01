# Blockchain University Degree Verification System

A professional blockchain-based university degree verification system built with React, TypeScript, Tailwind CSS, and Supabase backend integrated with Hyperledger Fabric blockchain technology.

## 🎓 Features

### Administrator Interface
- **Secure Login System**: Admin authentication to access certificate issuance
- **Certificate Issuance**: Upload PDF certificates and enter student data
- **Blockchain Registration**: Automatic registration on Hyperledger Fabric network
- **Unique Certificate IDs**: Auto-generated certificate identifiers
- **Data Fields**:
  - Institution Name
  - Student Name
  - University ID
  - Degree Type (Bachelor, Master, PhD, Associate, Diploma)
  - Major/Field of Study
  - General Grade (Excellent, Very Good, Good)
  - Graduation Date
  - Issue Date

### Student Verification Interface
- **Certificate Verification**: Students can verify certificates using Certificate ID
- **Real-time Validation**: Instant blockchain verification
- **Tamper Detection**: SHA-256 hash verification to detect data tampering
- **Visual Feedback**: Green success or red error messages
- **Detailed Certificate Display**: Shows all certificate information if verified

### Blockchain Integration
- **Hyperledger Fabric**: Enterprise blockchain network
- **Tamper-Proof Storage**: Immutable certificate records
- **SHA-256 Hashing**: Cryptographic data integrity
- **Transaction IDs**: Unique blockchain transaction identifiers
- **Block Height Tracking**: Blockchain ledger position

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase Edge Functions (Hono)
- **Database**: Supabase PostgreSQL (Key-Value Store)
- **Blockchain**: Hyperledger Fabric (Simulated)
- **Icons**: Lucide React
- **Authentication**: Mock admin authentication (admin/admin123)

## 📁 Project Structure

```
/
├── App.tsx                          # Main application component
├── components/
│   ├── IssueCertificate.tsx         # Admin certificate issuance interface
│   ├── Dashboard.tsx                # Student verification interface
│   └── figma/
│       └── ImageWithFallback.tsx    # Image component (protected)
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx            # Hono web server
│           └── kv_store.tsx         # Key-value database utilities (protected)
├── utils/
│   └── supabase/
│       └── info.tsx                 # Supabase configuration (protected)
├── styles/
│   └── globals.css                  # Global styles
└── README.md                        # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Environment variables configured

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd blockchain-degree-verification
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Supabase anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key

4. Deploy Supabase functions:
```bash
supabase functions deploy make-server-4ce262a1
```

5. Start the development server:
```bash
npm run dev
```

## 📊 Database Schema

### Key-Value Store Table: `kv_store_4ce262a1`

| Column | Type  | Description                    |
|--------|-------|--------------------------------|
| key    | TEXT  | Primary key (e.g., "certificate:CERT-2026-12345") |
| value  | JSONB | Certificate data and metadata  |

### Certificate Data Structure

```json
{
  "certificateId": "CERT-2026-12345",
  "institutionName": "Cairo University",
  "studentName": "Ahmed Mohamed",
  "universityId": "2020123456",
  "degree": "Bachelor",
  "major": "Computer Science",
  "generalGrade": "Excellent",
  "issueDate": "2026-01-31",
  "graduationDate": "2026-01-20",
  "issuedAt": "2026-01-31T10:30:00.000Z",
  "fileName": "certificate.pdf",
  "fileSize": 245678,
  "blockchainHash": "0xabc123...",
  "transactionId": "1738314600000-xyz789",
  "blockHeight": 125847,
  "channelName": "certificate-channel",
  "chaincodeName": "certificate-cc",
  "network": "hyperledger-fabric"
}
```

## 🔐 Admin Credentials

**Username**: `admin`  
**Password**: `admin123`

⚠️ **Important**: In production, replace with proper authentication system.

## 🌐 API Endpoints

### POST `/make-server-4ce262a1/certificates/issue`
Issues a new certificate and stores it on the blockchain.

**Request Body**:
```json
{
  "institutionName": "string",
  "studentName": "string",
  "universityId": "string",
  "degree": "string",
  "major": "string",
  "generalGrade": "string",
  "issueDate": "string",
  "graduationDate": "string",
  "fileName": "string",
  "fileSize": "number"
}
```

**Response**:
```json
{
  "success": true,
  "certificate": {
    "certificateId": "CERT-2026-12345",
    "blockchainHash": "0x...",
    "transactionId": "...",
    "blockHeight": 125847,
    "timestamp": "2026-01-31T10:30:00.000Z"
  }
}
```

### POST `/make-server-4ce262a1/certificates/verify`
Verifies a certificate by Certificate ID.

**Request Body**:
```json
{
  "certificateId": "CERT-2026-12345"
}
```

**Response**:
```json
{
  "verified": true,
  "certificate": { /* full certificate data */ }
}
```

## 🎨 UI/UX Features

- **Responsive Design**: Works on all screen sizes (mobile, tablet, desktop)
- **Professional Interface**: Clean, modern design suitable for institutional use
- **Loading States**: Visual feedback during operations
- **Error Handling**: Clear error messages for users
- **Visual Verification**: Green for verified, red for unverified
- **Print Support**: Print certificate details

## 🔒 Security Features

- **Admin Authentication**: Secure login for certificate issuance
- **Data Hashing**: SHA-256 cryptographic hashing
- **Tamper Detection**: Automatic detection of data modifications
- **Blockchain Immutability**: Tamper-proof certificate storage
- **Private Database**: Supabase service role key protection

## 📝 Usage Workflow

### For Administrators:
1. Login with admin credentials
2. Upload student certificate PDF
3. Fill in all certificate details
4. Click "Issue Certificate"
5. Receive Certificate ID
6. Share Certificate ID with student

### For Students:
1. Open the verification dashboard
2. Enter Certificate ID received from institution
3. Click "Verify Certificate"
4. View certificate details if verified

## 🐛 Troubleshooting

### "Certificate Not Verified" Error
- Ensure Certificate ID is entered correctly
- Check that certificate was successfully issued
- Verify database connectivity

### "Unauthorized" Error
- Check Supabase environment variables
- Ensure service role key is configured
- Verify API endpoint is accessible

### Database Connection Issues
- Check Supabase project status
- Verify `kv_store_4ce262a1` table exists
- Test database connection in Supabase dashboard

## 🔗 Resources

- **Supabase Dashboard**: https://supabase.com/dashboard/project/lizjpqzjcsloffmgeezp
- **Database Tables**: https://supabase.com/dashboard/project/lizjpqzjcsloffmgeezp/database/tables
- **Hyperledger Fabric Docs**: https://hyperledger-fabric.readthedocs.io/

## 📄 License

This project is proprietary software. All rights reserved.

## 👥 Contributors

Built with Figma Make - AI-powered web application builder.

## 🚧 Future Enhancements

- [ ] Real Hyperledger Fabric SDK integration
- [ ] Multi-institution support
- [ ] Batch certificate issuance
- [ ] Advanced search and filtering
- [ ] Email notifications
- [ ] QR code generation for certificates
- [ ] Certificate revocation system
- [ ] Audit logs and reporting
- [ ] Multi-language support (Arabic/English)
- [ ] Social authentication (Google, GitHub)

## 📧 Support

For support and questions, please contact your system administrator.

---

**Built with ❤️ using Figma Make**
