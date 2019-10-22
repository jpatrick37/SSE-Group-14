
import Candidates from "./Views/Candidates";
import Election from "./Views/Election";
import Settings from "./Views/Settings"

const RouteObjects = [
    {
        path: "/candidates",
        component: Candidates
    },
    {
        path: "/election",
        component: Election
    },
    {
        path: "/settings",
        component: Settings
    }
];

export default RouteObjects;