const validator = require('validator');

const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least 1 uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least 1 lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least 1 number' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'Password must contain at least 1 special character' };
  }
  return { valid: true };
};

const validateEmail = (email) => {
  return validator.isEmail(email || '');
};

const validateSplits = (splits, totalAmount) => {
  if (!Array.isArray(splits) || splits.length === 0) {
    return { valid: false, message: 'Splits array is required' };
  }
  
  const sum = splits.reduce((acc, split) => acc + (split.amount || 0), 0);
  if (sum !== totalAmount) {
    return { 
      valid: false, 
      message: `Split amounts must equal total expense amount. Got ${sum}, expected ${totalAmount}` 
    };
  }
  
  return { valid: true };
};

const validateSplitMembers = (splits, groupMembers) => {
  const memberIds = groupMembers.map(m => m.toString());
  
  for (const split of splits) {
    if (!memberIds.includes(split.userId.toString())) {
      return { 
        valid: false, 
        message: 'All split members must be part of the group' 
      };
    }
  }
  
  return { valid: true };
};

const validateColor = (color) => {
  if (!color) return true;
  return /^#[0-9A-Fa-f]{6}$/.test(color);
};

module.exports = {
  validatePassword,
  validateEmail,
  validateSplits,
  validateSplitMembers,
  validateColor
};
