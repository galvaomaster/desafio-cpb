import { randomBytes } from 'node:crypto';
import { env } from '../config/env';

export interface UserData {
  name: string;
  email: string;
  password: string;
  title: string;
  birth_date: string;
  birth_month: string;
  birth_year: string;
  firstname: string;
  lastname: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
}

const random = () => randomBytes(3).toString('hex');

/** E-mail único por execução, em domínio de exemplo: qa_<owner>_<timestamp>_<aleatório>@example.com */
export function uniqueEmail(): string {
  return `qa_${env.owner}_${Date.now()}_${random()}@example.com`;
}

/** Usuário fictício. Nome começa com QA_ e a senha é gerada a cada execução. */
export function buildUser(): UserData {
  return {
    name: `QA_${env.owner}_${random()}`,
    email: uniqueEmail(),
    password: `Pw!${random()}${random()}`,
    title: 'Mr',
    birth_date: '10',
    birth_month: 'May',
    birth_year: '1990',
    firstname: 'QA',
    lastname: 'Ficticio',
    company: 'Empresa Ficticia',
    address1: `Rua Ficticia ${random()}`,
    address2: 'Sala 1',
    country: 'India',
    zipcode: '00000',
    state: 'Estado Ficticio',
    city: 'Cidade Ficticia',
    mobile_number: '0000000000',
  };
}

/** Confere se o e-mail segue o padrão das contas criadas pelos testes. */
export function isTestEmail(email: string): boolean {
  return /^qa_[a-z0-9]+_\d+_[0-9a-f]+@example\.com$/.test(email);
}
