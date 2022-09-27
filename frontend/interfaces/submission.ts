export interface Submission {
    id: number;
    walletAddress: string;
    projectId: number;
    result?: boolean;
    createdAt: string;
}

export interface SubmissionResponse {
    id: number;
    walletAddress: string;
    projectId: number;
    result?: boolean;
    createdAt: string;
    updatedAt?: string
    deletedAt?: string
}

export interface UpsertSubmissionDTO {
    walletAddress: string;
    projectId: number;
}