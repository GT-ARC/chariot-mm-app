import {Issue} from './issue';
import seedrandom from 'seedrandom';
import {EventEmitter} from "@angular/core";

export class Device {
  identifier: string;

  deviceGroup = false;

  name: string;
  symbol: symbol;
  power_consumption: number;

  properties: Property [];

  running: number;
  down_time: number;

  description: {
    title: string,
    desc: string }[];
  issues: Issue[];

  issueDetected: boolean = false;

  lastIssueId: string = "";

  public isMock: boolean = false;

  constructor(identifier: string,
              name: string,
              symbol: symbol,
              power_consumption: number,
              running: number,
              down_time: number,
              description: { title: string, desc: string }[],
              issues?: Issue[]) {
    this.identifier = identifier;
    this.name = name;
    this.symbol = symbol;
    this.power_consumption = power_consumption;
    this.running = running;
    this.down_time = down_time;
    this.description = description;
    this.issues = issues;
  }


  getIssueID(): string {
    if(this.issues){
      let retIssue = this.issues.find(i => !i.state);
      if (retIssue) return retIssue.identifier;
    }
    return undefined;
  }

  hasIssue(): number {
    return this.issues.reduce((prev, curr) => curr.state == false ? prev + 1 : prev, 0)
  }

  lastIssue : Issue = null;

  addIssue(issue : Issue) {
    if(issue.state == false) {
      this.lastIssue = issue;
      this.lastIssueId = issue.identifier;
      this.issueDetected = true;
    }
    this.issues.push(issue);
  }

  resolveLastIssue() {
    if(this.issues != null && this.issues.length != 0) {
      this.lastIssue.state = true;
      this.issueDetected = false;
    }
  }

  getLastIssue() {
    if(this.issues && this.issues.length > 0)
      return this.issues[this.issues.length - 1];
      return undefined;
  }
}

export class PropertyBundle {
  bundledProperty : Property;
  areaMD : String;
  areaSD : String;
  areaXS : String;
  properties: Property [];
  device: Device;

  constructor(properties: Property [], device: Device, bundledProperty : Property) {
    this.device = device;
    this.bundledProperty = bundledProperty;
    this.properties = properties == undefined ? [] : properties;
    if(this.areaMD == undefined) {
      this.areaMD = this.getMdArea(properties.length, 1280);
    }
    if(this.areaSD == undefined) {
      this.areaSD = this.getMdArea(properties.length, 899);
    }
    if(this.areaXS == undefined) {
      this.areaXS = this.getMdArea(properties.length, 449);
    }
  }

  getMdArea(propAmount : number, width: number) : string {

    let getRow = function(i : number, amount: number) {
      if(amount == 1)
        return " a" + i + " " + "a" + i + " " + "a" + i + " " + "a" + i + " " + "a" + i + " " + "a" + i + " ";
      if(amount == 2)
        return " a" + i + " " + "a" + i + " " + "a" + i + " " + "a" + (i+1) + " " + "a" + (i+1) + " " + "a" + (i+1) + " ";
      if(amount == 3)
        return " a" + i + " " + "a" + i + " " + "a" + (i+1) + " " + "a" + (i+1) + " " + "a" + (i+2) + " " + "a" + (i+2) + " ";
    };

    let randObj = seedrandom( (this.bundledProperty ? this.bundledProperty.url : this.device.identifier) + width + "" + propAmount);

    let index = 0;
    let retString = "";
    while (index < propAmount) {
      let leftProperties = propAmount - index;
      if(retString != "") retString += "|";

      if(leftProperties == 0)
        break;

      let rand = randObj();

      // Make it size dependent
      let selectedAmount = 0;
      if (width < 450) selectedAmount = 1;
      else if (width < 900) selectedAmount = rand < 0.3 ? 1 : 2;
      else selectedAmount = rand < 0.1 ? 1 : (rand < 0.5 ? 2 : 3);

      if (selectedAmount > leftProperties)
        selectedAmount = leftProperties;

      retString += getRow(index, selectedAmount);
      index += selectedAmount;
    }
    return retString;
  }
}

export class Property {
  url: string;
  timestamp: number;
  topic?: string;
  type: string;
  name?: string;
  key: string;
  value: number | string | boolean | Property[];
  min_value?: any;
  max_value?: any;
  unit?: string;
  writable: boolean;

  data: {
    y: number,
    x: number
  }[];
  prediction: {
    y: number,
    x: number
  }[] = [];

  updateListener: EventEmitter<{
    y: number,
    x: number
  }>;

  constructor(
    timestamp: number,
    type: string,
    key: string,
    value: number | string | boolean | Property[],
    writable: boolean,
    topic?: string,
    name?: string,
    unit?: string,
    min_value?: number,
    max_value?: number,
  ) {
    this.timestamp = timestamp;
    this.type = type;
    this.key = key;
    this.value = value;
    this.writable = writable;
    this.topic = topic;
    this.name = name;
    this.unit = unit;
    this.min_value = min_value;
    this.max_value = max_value;
    this.data = []
  }

  createMockData( data: { y: number, x: number }[],
                  prediction: { y: number, x: number }[]) {
    this.data = data;
    this.prediction = prediction;
  }

}
