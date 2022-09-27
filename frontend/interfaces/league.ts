import { Submission, SubmissionResponse } from "./submission";

export interface League {
    _id: string
    name: string;
    maxTeams: number;
    draftDateTime: string;
    commissionerFee: number;
    entryFee: number;
    isPrivate: boolean;
    createdAt?: string;
            "teamIds": [],
            "draftDateTime": "2022-10-21T00:00:00.000Z",
            "drafted": true,
            "maxTeams": 11,
            "commissionerWalletAddress": "0xd45Fb5019E13D1dE62DA32c13e751E62939f8D8F",
            "commissionerFee": 0.18,
            "entryFee": 1.5,
            "isPrivate": true,
            "createdAt": "2022-09-15T08:45:05.285Z",
            "deletedAt": null
}

export interface CreateLeagueDTO {
    name: string;
    maxTeams: number;
    draftDateTime: string;
    commissionerFee: number;
    entryFee: number;
    isPrivate: boolean;
    commissionerWalletAddress: string;
}

export interface LeagueResponse {
    id: number
    name: string;
    description: string;
    imageUrl: string
    endDate: string;
    minBalance: number;
    maxWinners: number;
    submissions: SubmissionResponse[]
    createdAt: string;
    updatedAt?: string
    deletedAt?: string
}

export interface GetLeaguesResponse {
    projects: League[];
    total: number
}

export interface LeagueForm {
    name: string;
    draftDateTime: string;
    maxTeams: string
    commissionerFee: string;
    entryFee: string;
    isPrivate: boolean;
    commissionerWalletAddress: string;
}