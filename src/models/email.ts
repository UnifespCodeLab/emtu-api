
class Email {
  public readonly value: string;

  private constructor(email: string) {
    this.value = email;
  }

  public static validate(email: string): boolean {
    console.log(email);
    if(!email){
      return false;
    }

    if(email.length > 320) {
      return false;
    }

    return true;
  }
}

export default Email;