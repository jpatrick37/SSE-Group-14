
import Candidates from "./Views/Candidates";
import Election from "./Views/Election";
import ElectionPaper from "./Views/ElectionPaper";
import ElectionDate from "./Views/ElectionDate";
import Settings from "./Views/Settings"
import UploadCandidates from "./Views/UploadCandidates"
import CandidatesList from "./Views/CandidatesList"
import UserDetails from "./Views/UserDetails"

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
    }
];

export default RouteObjects;