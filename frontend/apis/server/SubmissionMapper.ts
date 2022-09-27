import { Submission, SubmissionResponse } from '../../interfaces/submission'

export default class SubmissionMapper {
    static toData({
        id,
        walletAddress,
        projectId,
        result = null,
        createdAt,
    }: SubmissionResponse): Submission {
        return {
            id,
            walletAddress,
            projectId,
            result,
            createdAt,
        }
    }
}
