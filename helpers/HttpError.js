const listError ={
    400: "Bad requst",
    402: "Unauturized",
    403: "Forbidden",
    404: "Not found",
    409: "Conflict"
}

export const HttpError =(status, message = listError[status])=>{
    const error = new Error(message);
    error.status =status;
    return error;
}