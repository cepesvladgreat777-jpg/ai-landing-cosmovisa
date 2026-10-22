export interface Service {
  id: string;
  code: string;
  tag: string;
  name: string;
  summary: string;
  details: readonly string[];
  price: string;
  image: string;
  alt: string;
}

export interface ContactDetails {
  name: string;
  phone: string;
  partners: string;
  press: string;
  general: string;
}

export interface DocumentPlaceholder {
  label: string;
}
