import * as yup from 'yup';

export const userCreationSchema = yup.object().shape({
  username: yup
  .string()
  .min(6, 'Username must be at least 6 characters long')
  .max(16, 'Username cannot be greater than 16 characters long')
  .trim()
  .required('Username is required'),
  email: yup
  .string()
  .email('Please enter a valid email')
  .trim()
  .required('Email is required'),
  password: yup
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(16, 'Password cannot be greater than 16 characters long')
  .trim()
  .required('Password is required')
});

export const userLoginSchema = yup.object().shape({
  email: yup
  .string()
  .email('Please enter a valid email')
  .trim()
  .required('Email is required'),
  password: yup
  .string()
  .trim()
  .required('Password is required')
});
