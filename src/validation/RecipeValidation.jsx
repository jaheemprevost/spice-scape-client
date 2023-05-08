import * as yup from 'yup';

const FILE_SIZE = 16 * 1024 * 1024;
const SUPPORTED_FORMATS = [
  'image/jpg',
  'image/jpeg', 
  'image/png'
]; 

export const recipeValidationSchema = yup.object().shape({
  recipeTitle: yup
  .string()
  .min(3, 'Recipe Title must be at least 3 characters long')
  .max(211, 'Recipe Title cannot be greater than 211 characters long')
  .trim()
  .required('Recipe Title is required'),
  recipeDescription: yup
  .string() 
  .min(100, 'Recipe Description must be at least 100 characters long')
  .max(800, 'Recipe Description cannot be greater than 800 characters long')
  .trim()
  .required('Recipe Description is required'),
  recipeIngredients: yup
  .string() 
  .min(100, 'Recipe Ingredients must be at least 100 characters long')
  .max(800, 'Recipe Ingredients cannot be greater than 800 characters long')
  .trim()
  .required('Recipe Ingredients are required'),
  recipeSteps: yup
  .string() 
  .min(100, 'Recipe Steps must be at least 100 characters long')
  .max(800, 'Recipe Steps cannot be greater than 800 characters long')
  .trim()
  .required('Recipe Steps are required'),
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
