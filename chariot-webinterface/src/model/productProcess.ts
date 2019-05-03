export class ProductProcess {
  identifier: number;

  productAddInfo: string;
  productName: string;


  statusInformation: String;
  status: String;

  state: boolean;

  image: string;

  productFlow: IndividualProcess[];

  productInfo: {
    name: string;
    value: string;
  }[]
}

export class IndividualProcess {
  icon: string;
  name: string;
  progress: number;
  paused: boolean;

  total: number;
  running: number;

  properties: {
    name: string;
    unit: string;
    value: any;
    size: number;
    icon: string;
    errorThreshold: number;
  }[]
}
