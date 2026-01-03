class ApiFeature{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr || "undefine";
    }
    search(){
        const keywords=this.queryStr.keywords ?
        {
            name:{
                $regex:this.queryStr.keywords,
                $options:"i"
            }}:
        {}
        console.log(keywords);
        this.query=this.query.find({...keywords});
        return this;
    }
filter() {
  const queryObj = {};

  // loop through each query param
  for (let key in this.queryStr) {
    // Handle keys like price[$gte]
    const match = key.match(/^(\w+)\[\$?(gt|gte|lt|lte)\]$/);
    if (match) {
      const field = match[1];      // e.g., "price"
      const operator = `$${match[2]}`; // $gte
      queryObj[field] = { [operator]: this.queryStr[key] };
    } else {
      queryObj[key] = this.queryStr[key];
    }
  }

  // Remove non-filter fields
  const removeFields = ["keyword", "keywords", "page", "limit"];
  removeFields.forEach(el => delete queryObj[el]);

  this.query = this.query.find(queryObj);
  return this;
}

pagination(resultPerPage){
    const currentPage=Number(this.queryStr.page) || 1;
    const skip=resultPerPage*(currentPage-1);
    this.query=this.query.limit(resultPerPage).skip(skip);
    return this;
}



     
}
module.exports=ApiFeature;