import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';


export function IsValidIranianPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsValidIranianPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
  
          const regex = /^09[0-9]{9}$/;
          return typeof value === 'string' && regex.test(value);  
        },
        defaultMessage(args: ValidationArguments) {
          return 'Phone number must be a valid Iranian number starting with 09 and followed by 9 digits';
        },
      },
    });
  };
}
