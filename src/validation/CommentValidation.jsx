import * as yup from 'yup';

export const commentValidationSchema = yup.object().shape({
  text: yup
  .string()
  .min(3, 'Comment must be at least 3 characters long')
  .max(150, 'Comment cannot be greater than 150  characters long')
  .trim()
  .required('Text is required')
});
