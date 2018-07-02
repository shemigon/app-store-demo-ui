export class User {
  constructor(public uid: string) {}
}


export class UserFile {
  constructor(
    public id: string,
    public name: string,
    public size: number,
    public path: string,
    public type: string,
  ) {}

}
