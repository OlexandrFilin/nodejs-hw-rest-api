const isWrapperControler = (contr) => {
const funcWrap = async (reg, res, next) => {
    try {
      await contr(reg, res);
    } catch (error) {
      next(error);
    }
  };
  return funcWrap;
};
export default isWrapperControler;
