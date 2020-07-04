const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 12;

module.exports = {
  checkName: name => {
    if (name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH) {
      throw new Error(`Your name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters long`);
    }
  },
};