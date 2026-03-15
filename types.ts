import React from 'react';

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  level: number;
  xp: number;
  rank: number;
  badges: BadgeType[];
  isPro?: boolean;
  isOnline?: boolean;
  role?: 'ADMIN' | 'USER';
}

export enum BadgeType {
  PYTHON_EXPERT = 'PYTHON_EXPERT',
  CRYPTO_MASTER = 'CRYPTO_MASTER',
  RED_TEAM = 'RED_TEAM',
  TERMINAL = 'TERMINAL',
  BUG_REPORT = 'BUG_REPORT',
  DNS = 'DNS',
  SHIELD = 'SHIELD',
  ROUTER = 'ROUTER',
  AI_SEC = 'AI_SEC',
}

export interface PodiumUser extends User {
  title?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  progress: number;
  timeEstimate: string;
  xpReward: number;
  category: 'Red Team' | 'Blue Team';
  icon: string;
  isLocked?: boolean;
  requiredLevel?: number;
  topics: string[];
}

// --- EDUCATIONAL CONTENT STRUCTURE ---

export interface CourseEducation {
  title: string;
  introduction: string; // 1. Intro
  technicalDeepDive: string; // 2. Deep Dive
  vulnerableCode: string; // 3. Code Example
  exploitationSteps: { title: string; steps: string[] }; // 4. Exploitation
  advancedTechniques?: string; // 5. Advanced
  labWalkthrough: string; // 6. Lab Specifics
  impact: string[]; // 7. Impact
  realWorldCase: { title: string; description: string }; // 8. Real World
  mitigation: { strategies: string[]; codeFix?: string }; // 9. Mitigation
  blueTeamDetection: string[]; // 10. Blue Team
  keyTakeaways: string[]; // 11. Takeaways
}

// --- LAB ARCHITECTURE ---

export type LabType = 
  | 'SQL_LOGIN' 
  | 'XSS_SEARCH' 
  | 'FILE_VIEWER' 
  | 'TERMINAL' 
  | 'BANK_PORTAL' 
  | 'REQUEST_SENDER' 
  | 'IDOR_PROFILE' 
  | 'BOLA_API'
  | 'FILE_UPLOAD'     
  | 'REPEATER'        
  | 'AI_TARGET';      

export type ValidatorType = 
  | 'SQL_BASIC_AUTH_BYPASS'
  | 'XSS_SIMPLE_ALERT'
  | 'FILE_LFI_PASSWD'
  | 'CMD_INJECTION_ROOT'
  | 'CSRF_TRANSFER_BOT'
  | 'SSRF_AWS_METADATA'
  | 'IDOR_ADMIN_VIEW'
  | 'BOLA_VIP_ACCESS'
  | 'FILE_UPLOAD_DOUBLE_EXT'
  | 'COOKIE_TAMPER_ADMIN'
  | 'JWT_NONE_ALG'
  | 'SESSION_HIJACK_REPLAY'
  | 'CORS_WILDCARD_ORIGIN'
  | 'DESERIALIZATION_PHP_BOOL'
  | 'RACE_CONDITION_COUPON'
  | 'LOGIC_NEGATIVE_PRICE'
  | 'PROTO_POLLUTION_ADMIN'
  | 'CLICKJACKING_Basic'
  | 'AI_PROMPT_LEAK'
  | 'RAG_POISONING'
  | 'DOS_IMAGE_RESIZE';

export interface LabStep {
  title: string;
  desc: string;
  task: string;
  hint: string;
}

// Environment Interfaces (Type-Safe Configs)
export interface SqlEnvironment {
  dbSchema: string[];
  dbSeed: string[];
  queryTemplate: string;
}

export interface FileSystemEnvironment {
  fsStructure: Record<string, any>;
  cwd: string;
}

export interface NetworkEnvironment {
  internalHosts?: Record<string, string>;
  botTarget?: string;
}

export interface RepeaterEnvironment {
  initialMethod?: string;
  initialHeaders?: Record<string, string>;
  initialBody?: string;
}

export interface TerminalEnvironment {
    fileSystem: Record<string, any>;
    commandResponses?: Record<string, string>;
}

export interface AiEnvironment {
    systemPrompt: string;
    secret?: string;
}

// Union of all environments
export type LabEnvironment = 
    | SqlEnvironment 
    | FileSystemEnvironment 
    | NetworkEnvironment 
    | RepeaterEnvironment 
    | TerminalEnvironment
    | AiEnvironment
    | Record<string, any>; // Fallback

export interface LabValidatorConfig {
    type: ValidatorType;
    params?: Record<string, any>;
}

export interface LabConfig {
  type: LabType;
  steps: LabStep[];
  urlBar: string;
  
  // Scalable Data Architecture
  environment?: LabEnvironment;
  validator?: LabValidatorConfig;
}

export interface CourseModule {
  id: string;
  content?: React.ReactNode;
  education?: CourseEducation;
  labConfig: LabConfig;
}

// --- SHARED LAB TYPES ---

export interface LogEntry {
  timestamp: string;
  type: 'INFO' | 'ERROR' | 'SUCCESS' | 'QUERY' | 'HTTP' | 'SHELL' | 'AI';
  message: string;
}

export interface LabComponentProps {
  config: LabConfig;
  activeStep: number;
  onStepAdvance: () => void;
  onMissionComplete: () => void;
  addLog: (type: LogEntry['type'], message: string) => void;
}