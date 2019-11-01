import Vote from "./Views/Vote.jsx";
import Results from "./Views/Results.jsx";
import Setup from "./Views/Setup.jsx";

const RouteObjects = [
    {
        path: "/vote",
        component: Vote,
    },
    {
        path: "/results",
        component: Results,
    },
    {
        path: "/setup",
        component: Setup,
    }
];

export default RouteObjects;