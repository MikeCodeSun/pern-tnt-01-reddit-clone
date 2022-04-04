export const validator = (name) => {
  const error: any = {};
  if (name.trim() === "") {
    error.name = "name";
  }
  return {
    valid: Object.keys(error).length < 0,
    error,
  };
};
