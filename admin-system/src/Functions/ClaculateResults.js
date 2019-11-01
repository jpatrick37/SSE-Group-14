/**
 * Calculate the senators to be elected, based on the provided votes.
 * 
 * @param: num_vacancies: the number of senators to be elected
 * @param: all_candidates: array of each candidate, in order of vote-form appearance
 * @param: all_votes: array of every vote, a vote is represented as an array. eg: [3, 1, 4, 2]
 * 
 * @returns: array of size [num_vacancies] containing all the elected senators
 */
export function calculateElectedSenators(num_vacancies, _all_candidates, _all_votes)
{
    var all_candidates = _all_candidates.slice()
    var all_votes = _all_votes.slice()
    var transfer_accuracy = 10;
    var num_candidates = all_candidates.length;
    var num_votes = all_votes.length;
    var i, j;
    var max_vote_count, max_cand_id, min_vote_count, min_cand_id;
    var next_best_pref, transfer_value, these_votes_size;
    var first_pref_votes, transfer_votes;
    var number_exclusion_runs = 0;

    if( (num_vacancies  < 1) ||
        (num_candidates < num_vacancies) ||
        (num_votes      < num_vacancies) )
    {
        console.log("Provided data error");
        return -1
    }

    var quota = (num_votes / (num_vacancies + 1)) + 1;
    console.log("quota: " + quota)

    /* ensure all candidates start with no votes */
    for(i = 0; i < num_candidates; i++)
    {
        console.log(all_candidates[i])
        all_candidates[i].total_votes = 0;
        all_candidates[i].elected  = false;
        all_candidates[i].excluded = false;
        all_candidates[i].first_pref_votes = [];
        console.log(all_candidates[i])
    }
    console.log("before")
    console.log(all_candidates)
    /* part 1 - assign votes to candidates */
    for(i = 0; i < num_votes; i++)
    {
        for(j = 0; j < num_candidates; j++)
        {
            if( all_votes[i][j] == 1 )
            {
                all_candidates[j].first_pref_votes.push(all_votes[i]);
                all_candidates[j].total_votes ++;
                break;
            }
        }
    }
    console.log("all_candidates")
    console.log(all_candidates)
    /* each candidate now has their first pref votes and total vote count */

    /**
     * part 2 - elect candidates, one at a time
     * each iteration, either:
     *     - elect ONE candidate who has reached quota (who has max votes) or
     *     - remove lowest candidate(s) until someone reaches quota
     */
    number_exclusion_runs = 0
    while( num_vacancies > 0 )
    {
        console.log("num_vaciaces > 0")
        /* check if any candidates have reached quota */
        max_vote_count = 0;
        max_cand_id = 0;
        for(i = 0; i < num_candidates; i++)
        {
            if(all_candidates[i].total_votes > max_vote_count)
            {
                max_vote_count = all_candidates[i].total_votes;
                max_cand_id = i;
            }
        }

        /* 2.1: if max vote count reached quota, elect candidate */
        if(max_vote_count >= quota)
        {
            all_candidates[max_cand_id].elected = true;
            num_vacancies --;
            /* surplus votes dsitributed */
            transfer_value = ((all_candidates[max_cand_id].total_votes - quota) / (all_candidates[max_cand_id].total_votes)).toFixed(transfer_accuracy);
            first_pref_votes = all_candidates[max_cand_id].first_pref_votes.slice();
            these_votes_size = first_pref_votes.length;
            transfer_votes = [];
            for(i = 0; i < num_candidates; i++)
            {
                transfer_votes.push(0);
            }
            /* for each vote give next available preference the vote */
            for(i = 0; i < these_votes_size; i++)
            {
                /* must find next available preference who isn't elected or excluded */
                next_best_pref = 2;
                for(j = 0; j < num_candidates; j++)
                {
                    if(first_pref_votes[i][j] == next_best_pref)
                    {
                        /* next best preference is available */
                        if( (all_candidates[j].elected  == false) &&
                            (all_candidates[j].excluded == false) )
                        {
                            transfer_votes[j] ++;
                            break;
                        }
                        /* next best preference isn't available, reset and look for new next */
                        else
                        {
                            next_best_pref ++;
                            /* reset to -1 because the for loop will j++ immediately */
                            j = -1;
                        }
                    }
                }
            }
            /* extra votes ready to dsitribute */
            for(i = 0; i < num_candidates; i++)
            {
                all_candidates[i].total_votes += (transfer_votes[i] * transfer_value);
            }
            /* this candidate has now been elected and their extra votes transfered; they can now be ingored */
            all_candidates[max_cand_id].total_votes = 0;
            /* reset to top of while loop and see if any other candidates have reached quota */
        }
        /* 2.2: otherwise, no candidate reached quota - eliminate candidate(s) */
        else
        {
            while(max_vote_count < quota)
            {
                console.log("max_vote_ < quota")
                console.log(all_candidates)
                /* find candidate with lowest vote count who isn't elected or excluded */
                min_vote_count = max_vote_count;
                min_cand_id = max_cand_id;
                for(i = 0; i < num_candidates; i++)
                {
                    if( (all_candidates[i].total_votes < min_vote_count) &&
                        (all_candidates[i].elected  == false) &&
                        (all_candidates[i].excluded == false) )
                    {
                        min_vote_count = all_candidates[i].total_votes;
                        min_cand_id = i;
                    }
                }
                
                console.log("min vote count " + min_vote_count)
                /* distribute this candidates votes and exclude them */
                first_pref_votes = all_candidates[min_cand_id].first_pref_votes.slice();
                these_votes_size = first_pref_votes.length;
                transfer_votes = [];
                for(i = 0; i < num_candidates; i++)
                {
                    transfer_votes.push(0);
                }
                /* for each vote give next available preference the vote */
                for(i = 0; i < these_votes_size; i++)
                {
                    /* must find next available preference who isn't elected or excluded */
                    next_best_pref = 2;
                    for(j = 0; j < num_candidates; j++)
                    {
                        if(first_pref_votes[i][j] == next_best_pref)
                        {
                            /* next best preference is available */
                            if( (all_candidates[j].elected  == false) &&
                                (all_candidates[j].excluded == false) )
                            {
                                transfer_votes[j] ++;
                                break;
                            }
                            /* next best preference isn't available, reset and look for new next */
                            else
                            {
                                next_best_pref ++;
                                /* reset to -1 because the for loop will j++ immediately */
                                j = -1;
                            }
                        }
                    }
                }
                /* votes ready to distribute */
                for(i = 0; i < num_candidates; i++)
                {
                    all_candidates[i].total_votes += transfer_votes[i];
                }
                /* this candidate has now had their votes transfered; they can now be excluded / ingored */
                console.log("exclude me please")
                console.log(all_candidates[min_cand_id])
                all_candidates[min_cand_id].excluded = true;
                all_candidates[min_cand_id].total_votes = 0;
                /* re-calculate current max vote count */
                max_vote_count = 0;
                for(i = 0; i < num_candidates; i++)
                {
                    if(all_candidates[i].total_votes > max_vote_count)
                    {
                        max_vote_count = all_candidates[i].total_votes;
                    }
                }
                if(max_vote_count < quota){
                    console.log("not enough, braking ")
                    break
                }

            } /* while max_vote_count < quota */

        } /* 2.2: no quota reached, remove lowest candidate(s) */
        
        if(number_exclusion_runs++ > num_candidates){
            break;
        }
    } /* while num_vacancies > 0 */

    /* add elected senators to final array */
    var elected_senators = [];
    for(i = 0; i < num_candidates; i++)
    {
        if(all_candidates[i].elected == true)
        {
            console.log(elected_senators)
            elected_senators.push(all_candidates[i]);
        }
    }

    return elected_senators;
}

/*
var num_vacancies = 3;
var all_candidates = [];
all_candidates.push({total_votes: 0,
                     elected: false,
                     excluded: false,
                     first_pref_votes: [],
                     name: "Jon",
                     party: "Pool Party"});
all_candidates.push({total_votes: 0,
                     elected: false,
                     excluded: false,
                     first_pref_votes: [],
                     name: "Ana",
                     party: "Disco Party"});
all_candidates.push({total_votes: 0,
                     elected: false,
                     excluded: false,
                     first_pref_votes: [],
                     name: "Bob",
                     party: "Pool Party"});
all_candidates.push({total_votes: 0,
                     elected: false,
                     excluded: false,
                     first_pref_votes: [],
                     name: "Tim",
                     party: "Single Party"});
all_candidates.push({total_votes: 0,
                     elected: false,
                     excluded: false,
                     first_pref_votes: [],
                     name: "Kat",
                     party: "Pool Party"});
all_candidates.push({total_votes: 0,
                     elected: false,
                     excluded: false,
                     first_pref_votes: [],
                     name: "Jen",
                     party: "Disco Party"});
var all_votes = [];
all_votes.push([3, 6, 2, 1, 5, 4]);
all_votes.push([4, 6, 1, 5, 2, 3]);
all_votes.push([5, 2, 4, 3, 1, 6]);
all_votes.push([1, 4, 2, 5, 6, 3]);
all_votes.push([5, 3, 6, 4, 1, 2]);
all_votes.push([6, 2, 1, 5, 4, 3]);
all_votes.push([5, 1, 3, 4, 6, 2]);
all_votes.push([2, 5, 6, 1, 3, 4]);
all_votes.push([1, 5, 2, 6, 4, 3]);
all_votes.push([2, 3, 1, 4, 5, 6]);
all_votes.push([4, 2, 6, 1, 5, 3]);
all_votes.push([2, 1, 3, 5, 6, 4]);
all_votes.push([4, 6, 3, 5, 1, 2]);
all_votes.push([2, 6, 4, 3, 1, 5]);
all_votes.push([1, 3, 6, 5, 4, 2]);
all_votes.push([6, 1, 4, 3, 5, 2]);
all_votes.push([3, 5, 1, 4, 6, 2]);
all_votes.push([2, 6, 1, 4, 5, 3]);
all_votes.push([4, 2, 3, 1, 5, 6]);
all_votes.push([1, 6, 2, 5, 3, 4]);
all_votes.push([4, 2, 5, 3, 6, 1]);
all_votes.push([3, 2, 6, 5, 1, 4]);
all_votes.push([2, 6, 5, 1, 4, 3]);
all_votes.push([5, 4, 6, 1, 3, 2]);
all_votes.push([6, 4, 1, 2, 3, 5]);
all_votes.push([1, 2, 5, 4, 6, 3]);
all_votes.push([6, 3, 2, 4, 1, 5]);
all_votes.push([5, 1, 2, 3, 6, 4]);
all_votes.push([5, 6, 4, 2, 1, 3]);
all_votes.push([2, 4, 1, 5, 3, 6]);
all_votes.push([2, 4, 1, 5, 6, 3]);
all_votes.push([1, 4, 3, 6, 2, 5]);
all_votes.push([2, 6, 1, 4, 3, 5]);
all_votes.push([2, 6, 4, 3, 1, 5]);
all_votes.push([6, 4, 3, 2, 5, 1]);
all_votes.push([5, 3, 6, 2, 1, 4]);
all_votes.push([1, 2, 4, 6, 3, 5]);
all_votes.push([4, 5, 6, 3, 2, 1]);
all_votes.push([3, 5, 4, 6, 1, 2]);
all_votes.push([6, 3, 1, 5, 2, 4]);
all_votes.push([3, 1, 4, 6, 5, 2]);
all_votes.push([6, 2, 4, 1, 3, 5]);
all_votes.push([6, 1, 2, 3, 5, 4]);
all_votes.push([6, 3, 1, 2, 4, 5]);
all_votes.push([2, 4, 5, 6, 1, 3]);
all_votes.push([5, 3, 2, 4, 1, 6]);
all_votes.push([4, 6, 1, 3, 5, 2]);
all_votes.push([5, 6, 3, 2, 4, 1]);
all_votes.push([4, 2, 1, 6, 5, 3]);
all_votes.push([3, 5, 6, 4, 1, 2]);
all_votes.push([6, 4, 1, 3, 5, 2]);
all_votes.push([1, 2, 4, 5, 6, 3]);
all_votes.push([2, 6, 3, 4, 1, 5]);
all_votes.push([5, 4, 2, 3, 6, 1]);
all_votes.push([3, 6, 5, 4, 1, 2]);
all_votes.push([4, 1, 5, 6, 2, 3]);
all_votes.push([1, 6, 3, 4, 2, 5]);
all_votes.push([1, 4, 5, 3, 6, 2]);
all_votes.push([4, 5, 1, 2, 3, 6]);
all_votes.push([3, 4, 1, 5, 2, 6]);
all_votes.push([2, 5, 4, 1, 6, 3]);
all_votes.push([4, 5, 1, 6, 3, 2]);
all_votes.push([3, 4, 2, 5, 1, 6]);
all_votes.push([5, 2, 6, 4, 1, 3]);
all_votes.push([6, 2, 1, 3, 4, 5]);
all_votes.push([3, 5, 6, 4, 2, 1]);
all_votes.push([3, 2, 5, 6, 4, 1]);
all_votes.push([5, 6, 3, 2, 1, 4]);
all_votes.push([3, 5, 2, 4, 1, 6]);
all_votes.push([3, 5, 4, 6, 1, 2]);
all_votes.push([6, 3, 2, 4, 5, 1]);
all_votes.push([6, 2, 5, 3, 4, 1]);
all_votes.push([3, 2, 1, 4, 6, 5]);
all_votes.push([4, 3, 5, 6, 2, 1]);
all_votes.push([1, 2, 5, 4, 3, 6]);
all_votes.push([4, 1, 3, 5, 6, 2]);
all_votes.push([4, 3, 5, 6, 1, 2]);
all_votes.push([3, 4, 6, 2, 1, 5]);
all_votes.push([4, 6, 2, 1, 5, 3]);
all_votes.push([3, 6, 1, 5, 4, 2]);
all_votes.push([3, 2, 4, 5, 6, 1]);
all_votes.push([1, 6, 3, 4, 5, 2]);
all_votes.push([4, 6, 3, 1, 2, 5]);
all_votes.push([3, 2, 6, 4, 1, 5]);
all_votes.push([4, 2, 6, 3, 5, 1]);
all_votes.push([3, 5, 1, 2, 6, 4]);
all_votes.push([3, 6, 5, 1, 2, 4]);
all_votes.push([1, 3, 5, 6, 2, 4]);
all_votes.push([2, 5, 6, 4, 1, 3]);
all_votes.push([4, 2, 1, 6, 5, 3]);
all_votes.push([3, 2, 1, 5, 4, 6]);
all_votes.push([6, 3, 2, 1, 5, 4]);
all_votes.push([5, 3, 2, 1, 4, 6]);
all_votes.push([6, 1, 4, 3, 5, 2]);
all_votes.push([3, 5, 6, 2, 1, 4]);
all_votes.push([5, 2, 4, 3, 1, 6]);
all_votes.push([5, 6, 3, 2, 1, 4]);
all_votes.push([2, 5, 4, 6, 3, 1]);
all_votes.push([5, 6, 2, 1, 3, 4]);
all_votes.push([3, 2, 1, 5, 6, 4]);
var results = calculate_elected_senators(num_vacancies, all_candidates, all_votes);
console.log("Elected senators:");
for(var i = 0; i < results.length; i++)
{
    console.log(results[i].name);
}
*/