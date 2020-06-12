const isEmpty = (string) => {
  if (string.trim() === '') {
    return true;
  } else {
    return false;
  }
};

const isEmail = (email) => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regex)) {
    return true;
  } else {
    return false;
  }
};

exports.validateSignupData = (data) => {
  // various errors pushed to object. If invalid value is entered -> pushed to obj. If obj !empty -> print errors.
  const errors = {};

  // validating email
  if (isEmpty(data.email)) {
    errors.email = 'Email must not be empty'
  } else if (!isEmail(data.email)) {
    errors.email = 'Must be a valid email address'
  }

  // validating pw
  if (isEmpty(data.password)) {
    errors.password = 'Password must not be empty'
  }
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  // validating username
  if (isEmpty(data.userHandle)) {
    errors.userHandle = 'Handle must not be empty'
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
};

exports.validateLoginData = (data) => {
  const errors = {};

  // validating email
  if (isEmpty(data.email)) {
    errors.email = 'Email must not be empty'
  }

  // validating pw
  if (isEmpty(data.password)) {
    errors.password = 'Password must not be empty'
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}

exports.reduceUserDetails = (data) => {
  let userDetails = {};
  if (!isEmpty(data.bio.trim())) {
    userDetails.bio = data.bio;
  };
  if (!isEmpty(data.website.trim())) {
    if (data.website.trim().substring(0, 4) !== 'http') {
      userDetails.website = `http://${data.website.trim()}`;
    } else {
      userDetails.website = data.website;
    }
  };
  if (!isEmpty(data.location.trim())) {
    userDetails.location = data.location;
  };
  return userDetails;
}