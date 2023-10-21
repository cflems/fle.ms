function generateSlug (len = 5) {
    const ALPHA_SIZE = 36;
    const MIN = 36**(len-1);
    const MAX = 36**len;
    const slugNumeric = Math.floor(Math.random() * (MAX-MIN))+MIN;
    return slugNumeric.toString(ALPHA_SIZE);
}

if (typeof module !== 'undefined')
    module.exports = {generateSlug};
