export const handlerErrorSave = (error,data,next)=>{
error.status=400;
next();
}

// використовуємо функціональний вираз щоб не втратити this
export  const addAdjustmentsBeforeUpdate = function(next){
    this.options.new =true;
    this.options.runValidators = true;
    next();
}