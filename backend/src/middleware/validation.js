const { body, validationResult } = require('express-validator');

exports.validateInventoryItem = [
  body('category')
    .isIn(['IMPLANT', 'ABUTMENT', 'COMPOSITE', 'LAMINATE'])
    .withMessage('Invalid category'),
  
  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Brand is required'),
  
  body('model')
    .trim()
    .notEmpty()
    .withMessage('Model is required'),
  
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  
  body('productionDate')
    .isISO8601()
    .withMessage('Invalid production date format'),
  
  body('expiryDate')
    .isISO8601()
    .withMessage('Invalid expiry date format')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.productionDate)) {
        throw new Error('Expiry date must be after production date');
      }
      return true;
    }),
  
  // Conditional validation based on category
  body('size')
    .if(body('category').equals('IMPLANT'))
    .notEmpty()
    .withMessage('Size is required for implants'),
  
  body('specificParameters')
    .if(body('category').equals('ABUTMENT'))
    .isObject()
    .withMessage('Specific parameters are required for abutments'),
  
  body('specificParameters.d')
    .if(body('category').equals('ABUTMENT'))
    .notEmpty()
    .withMessage('Parameter D is required for abutments'),
  
  body('specificParameters.g')
    .if(body('category').equals('ABUTMENT'))
    .notEmpty()
    .withMessage('Parameter G is required for abutments'),
  
  body('specificParameters.h')
    .if(body('category').equals('ABUTMENT'))
    .notEmpty()
    .withMessage('Parameter H is required for abutments'),
  
  // Validation result middleware
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
]; 