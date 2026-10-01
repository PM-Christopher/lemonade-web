export interface ValidationMessages {
  email: {
    required: string;
    invalid: string;
  };
  password: {
    required: string;
    minLength: (min: number) => string;
    strong: string;
  };
  confirmPassword: {
    required: string;
    match: string;
  };
  otp: {
    required: string;
    length: (length: number) => string;
  };
  phoneNumber: {
    required: string;
    invalid: string;
  };
}

export interface FieldNames {
  email: string;
  password: string;
  fullname: string;
  confirmPassword: string;
  code: string;
  username: string;
  bio: string;
  industry: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phoneNumber: string;
}

export const defaultFieldNames: FieldNames = {
  email: "Email",
  password: "Password",
  fullname: "Full name",
  confirmPassword: "Confirm password",
  code: "Code",
  username: "Username",
  bio: "Bio",
  industry: "Industry",
  address: "Address",
  city: "City",
  state: "State",
  country: "Country",
  phoneNumber: "Phone number",
};

export const defaultMessages: ValidationMessages = {
  email: {
    required: "Email is required",
    invalid: "Please enter a valid email",
  },
  password: {
    required: "Password is required",
    minLength: (min: number) => `Password must be at least ${min} characters`,
    strong:
      "Must Contain at least 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character",
  },
  confirmPassword: {
    required: "Confirm password is required",
    match: "Passwords must match",
  },
  otp: {
    required: "Code is required",
    length: (length: number) => `Code must be ${length} characters`,
  },
  phoneNumber: {
    required: "Phone number is required",
    invalid: "Invalid phone number",
  },
};
