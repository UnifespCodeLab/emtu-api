
class Email {
  public readonly value: string;

  private constructor(email: string) {
    this.value = email;
  }

  public static validate(email: string): boolean {
    if(!email)
      return false;

    if(email.length > 320) 
      return false;

    const [username, domain] = email.split('@');
    if(username.length > 64)
      return false;

    return true;
  }
}

export default Email;