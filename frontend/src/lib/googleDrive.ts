import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../../firebase-applet-config.json';

export const TARGET_DRIVE_FOLDER_ID = '1xmENp6VbWNHIWN4Eu1YmFFA6Wh0Bwjxp';
export const TARGET_DRIVE_FOLDER_URL = `https://drive.google.com/drive/folders/${TARGET_DRIVE_FOLDER_ID}?usp=sharing`;

export const SCOPES = ['https://www.googleapis.com/auth/drive'];

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));

let isSigningIn = false;
// In-memory cache only (never localStorage/sessionStorage)
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        onAuthSuccess?.(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        onAuthFailure?.(user);
      }
    } else {
      cachedAccessToken = null;
      onAuthFailure?.(null);
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Gagal mendapatkan akses Google Drive. Silakan coba login ulang.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => cachedAccessToken;

export const logoutGoogle = async (): Promise<void> => {
  await auth.signOut();
  cachedAccessToken = null;
};

export interface DriveUploadResult {
  id: string;
  name: string;
  webViewLink: string;
  uploadedToTargetFolder: boolean;
}

async function ensureFallbackFolder(accessToken: string): Promise<string> {
  const folderName = 'MI Apparel - Desain Pesanan';
  const query = encodeURIComponent(
    `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`
  );
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  if (searchRes.ok) {
    const searchData = await searchRes.json();
    if (searchData.files?.length > 0) {
      return searchData.files[0].id;
    }
  }

  const createRes = await fetch('https://www.googleapis.com/drive/v3/files?fields=id', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    }),
  });
  if (!createRes.ok) {
    throw new Error('Gagal membuat folder desain di Google Drive.');
  }
  const created = await createRes.json();
  return created.id;
}

async function multipartUpload(
  accessToken: string,
  file: File,
  parentFolderId: string,
  fileName: string
): Promise<{ id: string; name: string; webViewLink?: string }> {
  const metadata = {
    name: fileName,
    parents: [parentFolderId],
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append('file', file);

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true&fields=id,name,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    const error = new Error(errText || 'Upload gagal') as Error & { status?: number };
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export async function uploadDesignToDrive(
  file: File,
  productName: string,
  customerTag?: string
): Promise<DriveUploadResult> {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error('AUTH_REQUIRED');
  }

  const timestamp = new Date().toISOString().slice(0, 10);
  const safeProduct = productName.replace(/[^a-zA-Z0-9 _-]/g, '').trim();
  const safeCustomer = customerTag ? `_${customerTag.replace(/[^a-zA-Z0-9 _-]/g, '').trim()}` : '';
  const formattedName = `[MI Apparel - ${safeProduct}${safeCustomer}_${timestamp}] ${file.name}`;

  let uploaded: { id: string; name: string; webViewLink?: string };
  let uploadedToTargetFolder = true;

  try {
    uploaded = await multipartUpload(accessToken, file, TARGET_DRIVE_FOLDER_ID, formattedName);
  } catch (err) {
    const status = (err as { status?: number })?.status;
    // If target shared folder is not writable by this signed-in user, fall back to user's Drive folder + share link
    if (status === 401) {
      cachedAccessToken = null;
      throw new Error('AUTH_REQUIRED');
    }
    uploadedToTargetFolder = false;
    const fallbackFolderId = await ensureFallbackFolder(accessToken);
    uploaded = await multipartUpload(accessToken, file, fallbackFolderId, formattedName);

    // Make file viewable via link so MI Apparel admin can open it from WhatsApp order
    await fetch(
      `https://www.googleapis.com/drive/v3/files/${uploaded.id}/permissions?supportsAllDrives=true`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: 'reader', type: 'anyone' }),
      }
    ).catch(() => {
      // Ignore permission failure on restricted org accounts; webViewLink still returned
    });
  }

  return {
    id: uploaded.id,
    name: uploaded.name,
    webViewLink: uploaded.webViewLink || `https://drive.google.com/file/d/${uploaded.id}/view`,
    uploadedToTargetFolder,
  };
}
