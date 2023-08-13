const DEFAULT_PAGE_LIMIT = 0; // IF 0 THEN ALL DOCUMENTS WILL BE RETURNED

function getPagination(query){

const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
const page = Math.abs(query.page) || 1;
const skip = limit * (page-1);

return {
    skip,
    limit
}

}

module.exports = {
    getPagination,

}