import * as Yup from "yup"

export const signUpSchema = Yup.object().shape({
  name: Yup.string().required("First name is required").min(2, "First name must be at least 2 characters"),
  surname: Yup.string().required("Surname is required").min(2, "Surname must be at least 2 characters"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-zA-Z]/, "Password must contain at least one letter")
    .matches(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  address: Yup.string().required("Address is required").min(5, "Address must be at least 5 characters"),
  postalCode: Yup.string()
    .required("Postal code is required")
    .matches(/^\d{5}$/, "Postal code must be 5 digits"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^\d{6}$/, "Phone number must be 6 digits"),
})

