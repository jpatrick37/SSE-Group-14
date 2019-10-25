
import Candidates from "./Views/Candidate/CandidatesGrid";
import Election from "./Views/Election/ElectionGrid";
import ElectionPaper from "./Views/Election/ElectionPaper";
import ElectionDate from "./Views/Election/ElectionDate";
import Settings from "./Views/Settings/SettingsGrid"
import UploadCandidates from "./Views/Candidate/UploadCandidates"
import CandidatesList from "./Views/Candidate/CandidatesList"
import UserDetails from "./Views/Settings/UserDetails"
import Results from "./Views/Results/ResultsGrid"
import CalculateResults from "./Views/Results/CalculateResults"

const RouteObjects = [
    {
        path: "/candidates/update",
        component: UploadCandidates
    },
    {
        path: "/candidates/list",
        component: CandidatesList
    },
    {
        path: "/candidates",
        component: Candidates
    },
    {
        path: "/election/paper",
        component: ElectionPaper
    },
    {
        path: "/election/date",
        component: ElectionDate
    },
    {
        path: "/election",
        component: Election
    },
    {
        path: "/settings/user",
        component: UserDetails
    },
    {
        path: "/settings",
        component: Settings
    },
    {       
        path: "/results/calculation",
        component: CalculateResults
    },
    {
        path: "/results",
        component: Results
    }
];

export default RouteObjects;