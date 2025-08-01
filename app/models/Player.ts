import { Match } from "./Match";

export class Player {
  id: number;
  name: string;
  phone: string;
  sex: string;
  ntrp: string;

  constructor({id, name, phone, sex, ntrp}: {id: number, name: string, phone: string, sex: string, ntrp: string}) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.sex = sex;
    this.ntrp = ntrp;
  }
}