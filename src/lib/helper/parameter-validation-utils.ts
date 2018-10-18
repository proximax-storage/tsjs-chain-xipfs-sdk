/**
 * The utility class to verify method parameters
 */
export class ParameterValidationUtils {
  public static checkParameter(isValid: boolean, errorMessage: string) {
    if (!isValid) {
      throw new Error(errorMessage);
    }
  }
}
