/**
 * Checks if a vote is valid.
 * Because below-the-line format takes precedence, if below-the-line is valid,
 * don't bother checking above-the-line.
 * 
 * @param: above: array representing the above-the-line boxes; eg: [3, 1, 4, 2]
 * @param: below: array representing the below-the-line boxes; eg: [2, 4, 1, 3]
 * @param: above_threshold: minimum required boxes ticked above the line; (parties)
 * @param: below_threshold: minimum required boxes ticked below the line; (candidates)
 * 
 * @returns: -1: if the vote is invalid
 *            1: if the above the line is valid
 *            2: if the below the line is valid
 */
function validate_vote(_above, _below, above_threshold, below_threshold)
{
    var above = _above.slice();
    var below = _below.slice();
    var above_valid = true;
    var below_valid = true;
    var above_length = above.length;
    var below_length = below.length;
    var i;

    /* part 1: check if below-the-line format is valid */

    /* remove all 0's from array */
    for(i = below_length - 1; i >= 0; i--)
    {
        if(below[i] === 0)
        {
            below.splice(i, 1);
        }
    }
    below_length = below.length;
    /* if too short, we know it's invalid */
    if(below_length < below_threshold)
    {
        below_valid = false;
    }
    else
    {
        /* make sure this array goes from at least {1 to below_threshold} */
        below.sort((a, b) => (a > b) ? 1 : -1);
        if(below[0] !== 1)
        {
            below_valid = false;
        }
        else
        {
            for(i = 1; i < below_threshold; i++)
            {
                if(below[i] !== (below[i-1] + 1) )
                {
                    below_valid = false;
                    break;
                }
            }
        }
    }
    if(below_valid === true)
    {
        return 2;
    }

    /* part 2: check if above-the-line format is valid */
    /* remove all 0's from array */
    for(i = above_length - 1; i >= 0; i--)
    {
        if(above[i] === 0)
        {
            above.splice(i, 1);
        }
    }
    above_length = above.length;
    /* if too short, we know it's invalid */
    if(above_length < above_threshold)
    {
        above_valid = false;
    }
    else
    {
        /* make sure this array goes from at least {1 to above_threshold} */
        above.sort((a, b) => (a > b) ? 1 : -1);
        if(above[0] !== 1)
        {
            above_valid = false;
        }
        else
        {
            for(i = 1; i < above_threshold; i++)
            {
                if(above[i] !== (above[i-1] + 1) )
                {
                    above_valid = false;
                    break;
                }
            }
        }
    }

    return (above_valid === true) ? 1 : -1;
}

/* for actual Australian voting, the thresholds are 6 and 12; this example is watered-down */

/*
var above_threshold = 4;
var below_threshold = 8;
var above = [0, 4, 3, 0, 2, 1, 6, 0];
var below = [0, 0, 7, 0, 3, 5, 1, 0, 2, 7, 0, 4, 0, 8, 0, 6, 0, 0];

console.log(validate_vote(above, below, above_threshold, below_threshold));
*/
export default validate_vote;