class APIfeatures {
    constructor(query , queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludeFields = ['page', 'sort', 'limit', 'fields']
        excludeFields.forEach(el => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);
        this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy);
        }
        else {
            this.query = this.query.sort('duration')
        }
        return this;
    }

    limitfields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        }
        else {
            this.query = this.query.select('-__v')
        }

        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 10;
        this.query = this.query.skip((page - 1) * limit).limit(limit);
        return this;
    }
}

module.exports = APIfeatures;