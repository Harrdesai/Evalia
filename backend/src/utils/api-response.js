class ApiResponse {
  constructor(statusCode, data, message= "Success"){
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400; // boolean value : on the basis of status code
  }
}

export { ApiResponse }