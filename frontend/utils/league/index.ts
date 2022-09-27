import { CreateLeagueDTO, LeagueForm } from "../../interfaces/league";

export function toLeagueDTO(entryForm: LeagueForm): CreateLeagueDTO {
    return {
        ...entryForm,
        maxTeams: parseInt(entryForm.maxTeams, 10),
        commissionerFee: parseFloat(entryForm.commissionerFee),
        entryFee: parseFloat(entryForm.entryFee),
    }
}
