import { ValidatorType } from './types';

export interface ValidationResult {
    success: boolean;
    message?: string; // Optional response message (e.g., HTTP response body)
    data?: any;
}

export type ValidatorFunction = (input: any, context?: any, params?: any) => ValidationResult;

export const LAB_VALIDATORS: Record<ValidatorType, ValidatorFunction> = {
    // 1. SQL Injection
    SQL_BASIC_AUTH_BYPASS: (input: string) => {
        // Simple check for common tautologies
        if (input.includes("' OR '1'='1") || input.includes("' OR 1=1")) {
            return { success: true };
        }
        return { success: false };
    },

    // 2. XSS
    XSS_SIMPLE_ALERT: (input: string) => {
        if (input.includes('<script>') || input.includes('onerror') || input.includes('javascript:') || input.includes('alert(')) {
            return { success: true };
        }
        return { success: false };
    },

    // 3. File Traversal
    FILE_LFI_PASSWD: (input: string) => {
        if (input.includes('passwd') && input.includes('..')) {
            return { success: true };
        }
        return { success: false };
    },

    // 4. Command Injection
    CMD_INJECTION_ROOT: (input: string) => {
        // Logic handled in component mostly, this validates the 'whoami' or file read result
        // Input here is usually the command executed or the result
        return { success: true }; 
    },

    // 5. CSRF
    CSRF_TRANSFER_BOT: (link: string, context: { target: string }) => {
        if (link.includes(context.target)) {
            return { success: true, message: 'Bot triggered transfer! Funds stolen.' };
        }
        return { success: false, message: 'Bot clicked link. Nothing happened.' };
    },

    // 6. SSRF
    SSRF_AWS_METADATA: (body: string) => {
        if (body.includes('AccessKeyId')) {
            return { success: true };
        }
        return { success: false };
    },

    // 7. IDOR
    IDOR_ADMIN_VIEW: (id: string) => {
        return { success: id === '1000' };
    },

    // 8. BOLA
    BOLA_VIP_ACCESS: (endpoint: string) => {
        return { success: endpoint.endsWith('/56') };
    },

    // 9. File Upload
    FILE_UPLOAD_DOUBLE_EXT: (filename: string) => {
        const isPhp = filename.endsWith('.php');
        const isDoubleExt = filename.includes('.php.') || filename.endsWith('.php5') || filename.endsWith('.phtml');
        
        if (isPhp) return { success: false, message: 'Extension .php is not allowed.' };
        if (isDoubleExt) return { success: true, message: 'Bypass successful! Web shell uploaded.' };
        return { success: false, message: 'File saved.' };
    },

    // 10. Privilege Escalation
    COOKIE_TAMPER_ADMIN: (inputs: { headers: Record<string, string> }) => {
        if (inputs.headers['Cookie']?.includes('role=admin')) {
            return { success: true, message: 'HTTP 200 OK\nWelcome Admin! FLAG: PRIV_ESC_SUCCESS' };
        }
        return { success: false, message: 'HTTP 403 Forbidden\nRole: User' };
    },

    // 11. JWT
    JWT_NONE_ALG: (inputs: { body: string }) => {
        // Check for base64 encoded {"alg":"none"} which is eyJhbGciOiJub25lIn0
        if (inputs.body && inputs.body.includes('eyJhbGciOiJub25lIn0')) {
            return { success: true, message: 'HTTP 200 OK\nJWT Accepted. Welcome Admin.' };
        }
        return { success: false, message: 'HTTP 401 Invalid Signature' };
    },

    // 12. Session Hijacking
    SESSION_HIJACK_REPLAY: (inputs: { headers: Record<string, string> }) => {
        if (inputs.headers['Cookie']?.includes('SID_12345')) {
            return { success: true, message: 'HTTP 200 OK\nAccount: VICTIM\nBalance: $1,000,000' };
        }
        return { success: false, message: 'HTTP 200 OK\nAccount: GUEST' };
    },

    // 13. CORS
    CORS_WILDCARD_ORIGIN: (inputs: { headers: Record<string, string> }) => {
        if (inputs.headers['Origin']?.includes('evil.com')) {
            return { success: true, message: 'HTTP 200 OK\nAccess-Control-Allow-Origin: https://evil.com\nAccess-Control-Allow-Credentials: true' };
        }
        return { success: false, message: 'HTTP 200 OK\nAccess-Control-Allow-Origin: https://bank.int' };
    },

    // 14. Deserialization
    DESERIALIZATION_PHP_BOOL: (inputs: { body: string }) => {
        if (inputs.body && inputs.body.includes('isAdmin";b:1')) {
            return { success: true, message: 'HTTP 200 OK\nObject Deserialized. Admin Privileges Granted.' };
        }
        return { success: false, message: 'HTTP 200 OK\nObject Deserialized. User Privileges.' };
    },

    // 15. Race Condition
    RACE_CONDITION_COUPON: (inputs: { body: string }) => {
        if (inputs.body && inputs.body.includes('threads=2')) {
            return { success: true, message: 'HTTP 200 OK\nCoupon Applied (Thread 1)\nCoupon Applied (Thread 2)\nDiscount: 20%' };
        }
        return { success: false, message: 'HTTP 200 OK\nCoupon Applied. Discount 10%' };
    },

    // 16. Logic Flaw
    LOGIC_NEGATIVE_PRICE: (inputs: { body: string }) => {
        if (inputs.body && inputs.body.includes('price":-100')) {
            return { success: true, message: 'HTTP 200 OK\nOrder Placed.\nRefund due: $100.' };
        }
        return { success: false, message: 'HTTP 200 OK\nOrder Placed. Charged $500.' };
    },

    // 17. Prototype Pollution
    PROTO_POLLUTION_ADMIN: (inputs: { body: string }) => {
        if (inputs.body && inputs.body.includes('__proto__') && inputs.body.includes('isAdmin')) {
            return { success: true, message: 'HTTP 200 OK\nConfig Updated.\n[SYSTEM] Admin check passed via prototype.' };
        }
        return { success: false, message: 'HTTP 200 OK\nConfig Updated.' };
    },

    // 18. Clickjacking
    CLICKJACKING_Basic: () => {
        return { success: true, message: 'HTTP 200 OK\nContent-Type: text/html\n(No X-Frame-Options header present)\nVulnerable to iframe embedding.' };
    },

    // 19. AI Prompt
    AI_PROMPT_LEAK: (input: string) => {
        if (input.includes('BRAINLOOM_AI_MASTER')) return { success: true };
        return { success: false };
    },

    // 20. RAG Poisoning
    RAG_POISONING: (filename: string) => {
        return { success: filename.toLowerCase().includes('policy') };
    },

    // 21. DoS
    DOS_IMAGE_RESIZE: (inputs: { headers: Record<string, string>, body: string }) => {
        if (inputs.headers['size']?.includes('10000') || (inputs.body && inputs.body.includes('10000'))) {
             return { success: true, message: 'HTTP 503 Service Unavailable\nMemory limit exceeded (DoS Successful).' };
        }
        return { success: false, message: 'HTTP 200 OK\nImage Resized.' };
    }
};

export const runValidator = (type: ValidatorType | undefined, input: any, context?: any, params?: any): ValidationResult => {
    if (!type || !LAB_VALIDATORS[type]) return { success: false, message: 'Validator not found' };
    return LAB_VALIDATORS[type](input, context, params);
};