
export const getSubmittingText = (buttonText: string) => {
    switch(buttonText) {
      case "Sign up":  return "Signing up";
      case "Sign in":  return "Signing in";
      case "Submit":  return "Submitting";
      default: return "Resetting";
  }
}