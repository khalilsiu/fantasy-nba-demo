import { League, GetLeaguesResponse, CreateLeagueDTO } from "../../interfaces/league";
import { UpsertSubmissionDTO } from "../../interfaces/submission";

const serverApiUri = process.env.NEXT_PUBLIC_SERVER_API

export const RESULT_PER_PAGE = 10

const errorHandler = (res: Response) => {
    throw new Error(res.statusText)
}
export class ServerAPI {
    static async createLeague(createLeagueDTO: CreateLeagueDTO): Promise<void> {
        const res = await fetch(serverApiUri + `/league`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                leagues: [createLeagueDTO]
            })
        })
        if (!res.ok) {
            return errorHandler(res)
        }
    }

    // static async fetchLeagues(page: number): Promise<GetLeaguesResponse> {
    //     const res = await fetch(serverApiUri + `/project?sortBy=endDate&order=-1&offset=${(page - 1) * RESULT_PER_PAGE}&limit=${RESULT_PER_PAGE}`)
    //     if (!res.ok) {
    //         return errorHandler(res)
    //     }
    //     const { projects, total } = await res.json()
    //     return { projects: projects.map(LeagueMapper.toData), total }
    // }

    // static async fetchLeagueById(id: number): Promise<League> {
    //     const res = await fetch(serverApiUri + '/project' + `/${id}`)
    //     if (!res.ok) {
    //         return errorHandler(res)
    //     }
    //     const project = await res.json()
    //     return LeagueMapper.toData(project)
    // }

    // static async updateLeagueById(projectDTO: CreateLeagueDTO) {
    //     const res = await fetch(serverApiUri + '/project', {
    //         method: "POST",
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             projects: [projectDTO]
    //         })
    //     })
    //     if (!res.ok) {
    //         return errorHandler(res)
    //     }
    // }

    // static async upsertSubmission(submissionDTO: UpsertSubmissionDTO) {
    //     const res = await fetch(serverApiUri + '/submission', {
    //         method: "POST",
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             submissions: [submissionDTO]
    //         })
    //     })
    //     if (!res.ok) {
    //         return errorHandler(res)
    //     }
    // }
}