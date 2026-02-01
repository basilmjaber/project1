import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Hash function for certificate data using SHA-256
async function hashCertificateData(certificateData: any): Promise<string> {
  const dataString = JSON.stringify(certificateData);
  const encoder = new TextEncoder();
  const data = encoder.encode(dataString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return '0x' + hashHex;
}

// Simulate Hyperledger Fabric transaction
function generateFabricTransactionId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${random}`;
}

// AUTHENTICATION ROUTES

// Sign up new institution
app.post('/make-server-4ce262a1/auth/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, institutionName, country, institutionType } = body;

    if (!email || !password || !institutionName) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        institutionName,
        country,
        institutionType,
      },
      // Automatically confirm email since we haven't configured email server
      email_confirm: true,
    });

    if (error) {
      console.log(`Error creating user during signup: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Store institution metadata in KV store
    await kv.set(`institution:${data.user.id}`, {
      institutionName,
      country,
      institutionType,
      createdAt: new Date().toISOString(),
    });

    return c.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        institutionName,
      },
    });
  } catch (error) {
    console.log(`Server error during signup: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get current user info
app.get('/make-server-4ce262a1/auth/me', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      console.log(`Authorization error while getting user info: ${error?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get institution metadata
    const institutionData = await kv.get(`institution:${user.id}`);

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        ...user.user_metadata,
        ...institutionData,
      },
    });
  } catch (error) {
    console.log(`Server error while getting user info: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// CERTIFICATE ROUTES

// Issue a new certificate on Hyperledger Fabric
app.post('/make-server-4ce262a1/certificates/issue', async (c) => {
  try {
    const body = await c.req.json();
    const { studentName, universityId, degree, major, generalGrade, issueDate, graduationDate, institutionName, fileName, fileSize } = body;

    if (!studentName || !universityId || !degree || !major || !generalGrade || !issueDate || !graduationDate || !institutionName) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Generate certificate ID
    const certificateId = `CERT-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;

    // Prepare certificate data for hash (only essential data)
    const certificateDataForHash = {
      certificateId,
      institutionName,
      studentName,
      universityId,
      degree,
      major,
      generalGrade,
      issueDate,
      graduationDate,
      issuedAt: new Date().toISOString(),
    };

    // Generate hash using SHA-256
    const certificateHash = await hashCertificateData(certificateDataForHash);

    try {
      // Simulate Hyperledger Fabric blockchain interaction
      // In production, this would interact with Fabric SDK:
      // 1. Connect to Fabric network
      // 2. Submit transaction to chaincode
      // 3. Wait for transaction endorsement and commit
      
      const transactionId = generateFabricTransactionId();
      const channelName = 'certificate-channel';
      const chaincodeName = 'certificate-cc';
      
      // Simulated block height for Hyperledger Fabric
      const blockHeight = Math.floor(100000 + Math.random() * 50000);

      // Store certificate data in KV store (with all metadata)
      await kv.set(`certificate:${certificateId}`, {
        ...certificateDataForHash,
        fileName: fileName || null,
        fileSize: fileSize || null,
        blockchainHash: certificateHash,
        transactionId: transactionId,
        blockHeight: blockHeight,
        channelName: channelName,
        chaincodeName: chaincodeName,
        network: 'hyperledger-fabric',
      });

      console.log(`Certificate stored successfully: ${certificateId}`);

      return c.json({
        success: true,
        certificate: {
          certificateId,
          blockchainHash: certificateHash,
          transactionId: transactionId,
          blockHeight: blockHeight,
          channelName: channelName,
          chaincodeName: chaincodeName,
          timestamp: certificateDataForHash.issuedAt,
          network: 'hyperledger-fabric',
        },
      });
    } catch (blockchainError) {
      console.log(`Blockchain error while issuing certificate: ${blockchainError}`);
      return c.json({ error: 'Blockchain transaction failed' }, 500);
    }
  } catch (error) {
    console.log(`Server error while issuing certificate: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Verify a certificate
app.post('/make-server-4ce262a1/certificates/verify', async (c) => {
  try {
    const body = await c.req.json();
    const { certificateId, certificateData } = body;

    if (!certificateId && !certificateData) {
      return c.json({ error: 'Certificate ID or data required' }, 400);
    }

    let storedCertificate;

    if (certificateId) {
      // Verify by certificate ID
      console.log(`Looking for certificate: ${certificateId}`);
      storedCertificate = await kv.get(`certificate:${certificateId}`);
      console.log(`Certificate found:`, storedCertificate ? 'YES' : 'NO');
    } else if (certificateData) {
      // Verify by certificate data hash
      const providedHash = await hashCertificateData(certificateData);
      
      // Search for matching certificate
      const allKeys = await kv.getByPrefix('certificate:CERT-');
      for (const certData of allKeys) {
        if (certData.blockchainHash === providedHash) {
          storedCertificate = certData;
          break;
        }
      }
    }

    if (!storedCertificate) {
      return c.json({
        status: 'invalid',
        message: 'Certificate not found in blockchain records',
      });
    }

    // Verify hash integrity
    const currentHash = await hashCertificateData({
      certificateId: storedCertificate.certificateId,
      institutionName: storedCertificate.institutionName,
      studentName: storedCertificate.studentName,
      universityId: storedCertificate.universityId,
      degree: storedCertificate.degree,
      major: storedCertificate.major,
      generalGrade: storedCertificate.generalGrade,
      issueDate: storedCertificate.issueDate,
      graduationDate: storedCertificate.graduationDate,
      issuedAt: storedCertificate.issuedAt,
    });

    if (currentHash !== storedCertificate.blockchainHash) {
      return c.json({
        status: 'invalid',
        message: 'Certificate data has been tampered with',
      });
    }

    return c.json({
      status: 'valid',
      certificate: {
        certificateId: storedCertificate.certificateId,
        studentName: storedCertificate.studentName,
        universityId: storedCertificate.universityId,
        institution: storedCertificate.institutionName,
        degree: storedCertificate.degree,
        major: storedCertificate.major,
        generalGrade: storedCertificate.generalGrade,
        issueDate: storedCertificate.issueDate,
        graduationDate: storedCertificate.graduationDate,
        blockchainHash: storedCertificate.blockchainHash,
        transactionId: storedCertificate.transactionId,
        blockHeight: storedCertificate.blockHeight,
        channelName: storedCertificate.channelName,
        chaincodeName: storedCertificate.chaincodeName,
        network: storedCertificate.network,
        timestamp: storedCertificate.issuedAt,
      },
    });
  } catch (error) {
    console.log(`Server error while verifying certificate: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get institution's certificates
app.get('/make-server-4ce262a1/certificates/list', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      console.log(`Authorization error while listing certificates: ${error?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const certificateIds = (await kv.get(`institution:${user.id}:certificates`)) || [];
    const certificates = [];

    for (const certId of certificateIds) {
      const cert = await kv.get(`certificate:${certId}`);
      if (cert) {
        certificates.push({
          certificateId: cert.certificateId,
          studentName: cert.studentName,
          universityId: cert.universityId,
          degree: cert.degree,
          major: cert.major,
          issueDate: cert.issueDate,
          graduationDate: cert.graduationDate,
          blockHeight: cert.blockHeight,
          issuedAt: cert.issuedAt,
        });
      }
    }

    return c.json({ certificates });
  } catch (error) {
    console.log(`Server error while listing certificates: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Health check
app.get('/make-server-4ce262a1/health', (c) => {
  return c.json({ 
    status: 'ok', 
    blockchain: 'hyperledger-fabric',
    timestamp: new Date().toISOString() 
  });
});

// OCR and AI extraction endpoint for certificate processing
app.post('/make-server-4ce262a1/certificates/extract', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      console.log(`Authorization error while extracting certificate data: ${error?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { fileBase64, fileName } = body;

    if (!fileBase64) {
      return c.json({ error: 'No file data provided' }, 400);
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return c.json({ 
        error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to environment variables.' 
      }, 500);
    }

    // Convert PDF to image for vision API (first page only)
    // For production, you'd use a proper PDF to image converter
    // For now, we'll use OpenAI's vision API with the base64 data directly
    
    console.log(`Processing certificate: ${fileName}`);

    // Step 1: Detect stamps and signatures
    const stampDetectionPrompt = `Analyze this certificate image carefully. 
    
IMPORTANT: You must respond with ONLY valid JSON, no other text.

Check if this document contains:
1. Official stamps (university seals, registrar stamps)
2. Authorized signatures (dean, registrar, officials)
3. Official letterhead or institutional branding

Respond with this exact JSON structure:
{
  "hasStamps": true or false,
  "hasSignatures": true or false,
  "isAuthentic": true or false,
  "confidence": number between 0-100,
  "details": "brief description of what you found"
}`;

    const stampResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: stampDetectionPrompt },
              { 
                type: 'image_url', 
                image_url: { 
                  url: `data:image/jpeg;base64,${fileBase64}`,
                  detail: 'high'
                } 
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.1,
      }),
    });

    if (!stampResponse.ok) {
      const errorText = await stampResponse.text();
      console.log(`OpenAI API error during stamp detection: ${errorText}`);
      return c.json({ error: 'Failed to analyze certificate authenticity' }, 500);
    }

    const stampData = await stampResponse.json();
    const stampAnalysis = JSON.parse(stampData.choices[0].message.content);

    console.log('Stamp detection result:', stampAnalysis);

    // If no stamps or signatures detected, reject
    if (!stampAnalysis.isAuthentic || stampAnalysis.confidence < 50) {
      return c.json({
        success: false,
        error: 'Certificate validation failed',
        reason: 'No official stamps or signatures detected on the certificate. Please ensure the certificate is official and contains proper authorization.',
        details: stampAnalysis.details,
      });
    }

    // Step 2: Extract certificate data
    const extractionPrompt = `Extract the following information from this academic certificate.

IMPORTANT: You must respond with ONLY valid JSON, no other text or markdown.

Extract these fields:
1. Institution Name (university/college name)
2. Student Full Name
3. University ID Number (student ID, registration number)
4. Degree Type (Bachelor, Master, PhD, Diploma, Associate)
5. Major/Field of Study (the subject/major)
6. Graduation Date (in YYYY-MM-DD format if possible, otherwise any format found)
7. General Grade (look for: Excellent, Very Good, Good, or GPA - if GPA like 3.5/4.0, convert to grade category)

Grade conversion guide:
- GPA 3.5-4.0 or 85-100% = Excellent
- GPA 3.0-3.49 or 75-84% = Very Good  
- GPA 2.5-2.99 or 65-74% = Good

Respond with this exact JSON structure:
{
  "institutionName": "extracted value or null",
  "studentName": "extracted value or null",
  "universityId": "extracted value or null",
  "degree": "extracted value or null",
  "major": "extracted value or null",
  "graduationDate": "extracted value or null",
  "generalGrade": "Excellent, Very Good, Good, or null",
  "confidence": number between 0-100
}`;

    const extractionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: extractionPrompt },
              { 
                type: 'image_url', 
                image_url: { 
                  url: `data:image/jpeg;base64,${fileBase64}`,
                  detail: 'high'
                } 
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.1,
      }),
    });

    if (!extractionResponse.ok) {
      const errorText = await extractionResponse.text();
      console.log(`OpenAI API error during data extraction: ${errorText}`);
      return c.json({ error: 'Failed to extract certificate data' }, 500);
    }

    const extractionData = await extractionResponse.json();
    let extractedInfo;
    
    try {
      const content = extractionData.choices[0].message.content.trim();
      // Remove markdown code blocks if present
      const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      extractedInfo = JSON.parse(jsonContent);
    } catch (parseError) {
      console.log(`JSON parse error: ${parseError}, content: ${extractionData.choices[0].message.content}`);
      return c.json({ error: 'Failed to parse extracted data' }, 500);
    }

    console.log('Extraction result:', extractedInfo);

    return c.json({
      success: true,
      authenticated: true,
      stampAnalysis: {
        hasStamps: stampAnalysis.hasStamps,
        hasSignatures: stampAnalysis.hasSignatures,
        confidence: stampAnalysis.confidence,
        details: stampAnalysis.details,
      },
      extractedData: {
        institutionName: extractedInfo.institutionName || '',
        studentName: extractedInfo.studentName || '',
        universityId: extractedInfo.universityId || '',
        degree: extractedInfo.degree || '',
        major: extractedInfo.major || '',
        graduationDate: extractedInfo.graduationDate || '',
        generalGrade: extractedInfo.generalGrade || '',
      },
      confidence: extractedInfo.confidence,
    });

  } catch (error) {
    console.log(`Server error during certificate extraction: ${error}`);
    return c.json({ error: 'Internal server error during extraction' }, 500);
  }
});

Deno.serve(app.fetch);