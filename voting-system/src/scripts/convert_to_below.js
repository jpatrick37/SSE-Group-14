/**
 * converts a VALID above-the-line vote to the VALID below-the-line vote.
 * this function assumse the above-the-line vote is valid.
 *     eg: if given [3, 1, 4, 6, 2], it will only go up to 4 as 6 is to high, but the vote is still valid
 * 
 * @param: above: above-the-line vote array. eg:
                                            [ {PARTY: "Pool Party",  PREFERENCE: 3},
                                              {PARTY: "Disco Party", PREFERENCE: 1},
                                              {PARTY: "Bday Party",  PREFERENCE: 4},
                                              {PARTY: "New Party",   PREFERENCE: 6},
                                              {PARTY: "Last Party",  PREFERENCE: 2} ]
           with this example array, only votes 1, 2, 3, 4 will count; 6 is invalid
 * @param: all_candidates: list of all candidate objects
 * 
 * @returns: an array representing the valid below-the-line vote equivalent
 */
function convert_to_below_line(_above, _all_candidates)
{
    var all_candidates = _all_candidates.slice();
    var above = _above.slice();
    var below_vote = [];
    var above_length = above.length;
    var all_candidates_length = all_candidates.length;
    var i, j;

    /* part 1: put the party vote in each candidate's vote index */
    j = 0;
    /* for each party */
    for(i = 0; i < above_length; i++)
    {
        while( (j < (all_candidates_length)) &&
               (all_candidates[j].PARTY === above[i].NAME) )
        {
            below_vote.push(above[i].PREFERENCE);
            j ++;
        }
    }
    /* now have below vote array where each index is that candidate's party's PREFERENCE */
    /* eg: [3, 3, 1, 1, 1, 4, 6, 6, 6, 2, 2] */
    
    /* part 2: change the party votes to individual candidate votes, based on their party PREFERENCE */
    var below_vote_length = below_vote.length;
    var a, b;
    var changed = [];
    for(i = 0; i < below_vote_length; i++)
    {
        changed.push(false);
    }/* eliminate any votes that are too high */
    /* eg: [3, 1, 4, 2, 6] => we'll remove all the '6' votes, because there's only 5 parties */
    for(i = 0; i < below_vote_length; i++)
    {
        if(below_vote[i] > above_length)
        {
            below_vote[i] = 0;
        }
    }

    a = 1;
    b = 1;
    /* for each party. eg: 1-5 */
    for(a = 1; a <= above_length; a++)
    {
        for(i = 0; i < below_vote_length; i++)
        {
            if( (below_vote[i] === a) &&
                (changed[i] === false) )
            {
                below_vote[i] = b ++;
                changed[i] = true;
            }
        }
    }

    return below_vote;
}

export default convert_to_below_line;

/*
The below vote form example would look like this:

 +========================================+
 | +----+  +-----+  +----+  +---+  +----+ |
 | |Pool|  |Disco|  |Bday|  |New|  |Last| |
 | +----+  +-----+  +----+  +---+  +----+ |
 +========================================+
 | +---+   +---+    +---+   +---+  +----+ |
 | |Jon|   |Ana|    |Bob|   |Tim|  |Bill| |
 | +---+   +---+    +---+   +---+  +----+ |
 | +---+   +---+            +---+  +----+ |
 | |Jim|   |Jen|            |Kat|  |Tash| |
 | +---+   +---+            +---+  +----+ |
 |         +-----+          +----+        |
 |         |Sally|          |Fred|        |
 |         +-----+          +----+        |
 +========================================+

 The specific vote for this example is:

 +========================================+
 | +----+  +-----+  +----+  +---+  +----+ |
 | |  3 |  |  1  |  |  4 |  | 6 |  |  2 | |
 | +----+  +-----+  +----+  +---+  +----+ |
 +========================================+
 |                                        |
 |          ... candidates ...            |
 |                                        |
 +========================================+

 The example above-the-line vote array is: [3, 1, 4, 6, 2]

 Parties who did not receive a vote are given a 0.
     For example, if the "New" party was ignored, instead of getting an invalid 6,
     the new array would be: [3, 1, 4, 0, 2]
*/

/*
var all_candidates = [];
all_candidates.push({total_votes: 0, elected: false, excluded: false, first_pref_votes: [], name: "Jon",
                     party: "Pool Party"});
all_candidates.push({total_votes: 0, elected: false, excluded: false, first_pref_votes: [], name: "Jim",
                     party: "Pool Party"});
all_candidates.push({total_votes: 0, elected: false, excluded: false, first_pref_votes: [], name: "Ana",
                     party: "Disco Party"});
all_candidates.push({total_votes: 0, elected: false, excluded: false, first_pref_votes: [], name: "Jen",
                     party: "Disco Party"});
all_candidates.push({total_votes: 0, elected: false, excluded: false, first_pref_votes: [], name: "Sally",
                     party: "Disco Party"});
all_candidates.push({total_votes: 0, elected: false, excluded: false, first_pref_votes: [], name: "Bob",
                     party: "Bday Party"});
all_candidates.push({total_votes: 0, elected: false, excluded: false, first_pref_votes: [], name: "Tim",
                     party: "New Party"});
all_candidates.push({total_votes: 0, elected: false, excluded: false, first_pref_votes: [], name: "Kat",
                     party: "New Party"});
all_candidates.push({total_votes: 0, elected: false, excluded: false, first_pref_votes: [], name: "Fred",
                     party: "New Party"});
all_candidates.push({total_votes: 0, elected: false, excluded: false, first_pref_votes: [], name: "Bill",
                     party: "Last Party"});
all_candidates.push({total_votes: 0, elected: false, excluded: false, first_pref_votes: [], name: "Tash",
                     party: "Last Party"});

var above = [];
above.push({PARTY: "Pool Party",  PREFERENCE: 3});
above.push({PARTY: "Disco Party", PREFERENCE: 1});
above.push({PARTY: "Bday Party",  PREFERENCE: 4});
above.push({PARTY: "New Party",   PREFERENCE: 6});
above.push({PARTY: "Last Party",  PREFERENCE: 2});

var new_below = convert_to_below_line(above, all_candidates);
console.log(new_below);
*/