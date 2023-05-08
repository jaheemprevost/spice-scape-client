import * as yup from 'yup';

const FILE_SIZE = 16 * 1024 * 1024;
const SUPPORTED_FORMATS = [
  'image/jpg',
  'image/jpeg', 
  'image/png'
]; 

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

export const userRevisionSchema = yup.object().shape({
  username: yup
  .string() 
  .min(6, 'Username must be at least 6 characters long')
  .max(16, 'Username cannot be greater than 16 characters long')
  .trim()
  .required('Username is required'),
  biography: yup
  .string()
  .min(49, 'Biography must be at least 49 characters long')
  .max(250, 'Biography cannot be greater than 250 characters long')
  .trim()
  .required('Biography is required'),
  file: yup
  .mixed()
  .nullable()
  .test(
    'fileSize',
    'File too large',
    value => !value || value.size <= FILE_SIZE
  )
  .test(
    'fileFormat',
    'Unsupported Format',
    value => !value || SUPPORTED_FORMATS.includes(value.type)
  ) 
}); 
