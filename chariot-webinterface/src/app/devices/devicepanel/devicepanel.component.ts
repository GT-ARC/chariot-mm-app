import {Component, OnInit, Input, Output, SimpleChanges, SimpleChange, HostListener} from '@angular/core';

import {EventEmitter} from '@angular/core';

import {Device, Property} from '../../../model/device';
import {log} from 'util';


@Component({
  selector: 'app-devicepanel',
  templateUrl: './devicepanel.component.html',
  styleUrls: [
    './devicepanel.component.css'
  ]
})
export class DevicepanelComponent implements OnInit {

  @Input() device: Device;
  @Output() uploaded = new EventEmitter<{ device: Device, state: any }>();

  areaMD : String;
  areaSD : String;
  areaXS : String;

  arrayProperties: Property[];
  normalProperties: Property[];

  public issueState: boolean;
  property_open: boolean = true;

  ngOnChanges(changes: SimpleChanges) {
    this.issueState = this.device.issues.reduce((acc, curr) => acc && curr.state, true);
    this.arrayProperties = this.getArrayProperties();
    this.normalProperties = this.getNormalProperties();

    this.areaMD = DevicepanelComponent.getMdArea(this.normalProperties.length, 1280);
    this.areaSD = DevicepanelComponent.getMdArea(this.normalProperties.length, 899);
    this.areaXS = DevicepanelComponent.getMdArea(this.normalProperties.length, 449);
    this.getArea(null);
  }

  constructor() {
  }

  ngOnInit() {
  }

  emitDeviceProperty(property: string, state: any) {
    if (property == 'device_power') {
      this.uploaded.emit({device: this.device, state});
    } else {
      // TODO use the agent service to send the update too the respective device
      console.log(property, state);
    }
  }

  static getMdArea(propAmount : number, width: number) : string {

    let getRow = function(i : number, amount: number) {
      if(amount == 1)
        return " a" + i + " " + "a" + i + " " + "a" + i + " " + "a" + i + " " + "a" + i + " " + "a" + i + " ";
      if(amount == 2)
        return " a" + i + " " + "a" + i + " " + "a" + i + " " + "a" + (i+1) + " " + "a" + (i+1) + " " + "a" + (i+1) + " ";
      if(amount == 3)
        return " a" + i + " " + "a" + i + " " + "a" + (i+1) + " " + "a" + (i+1) + " " + "a" + (i+2) + " " + "a" + (i+2) + " ";
    };

    let index = 0;
    let retString = "";
    while (index < propAmount) {
      let leftProperties = propAmount - index;
      if(retString != "") retString += "|";

      if(leftProperties == 0)
        break;

      let rand = Math.random();

      // Make it size dependent
      let selectedAmount = 0;
      if (width < 450) selectedAmount = 1;
      else if (width < 900) selectedAmount = rand < 0.4 ? 1 : 2;
      else selectedAmount = rand < 0.2 ? 1 : (rand < 0.6 ? 2 : 3);

      if (selectedAmount > leftProperties)
        selectedAmount = leftProperties;

      retString += getRow(index, selectedAmount);
      index += selectedAmount;
    }
    return retString;
  }

  propertyArea = null;
  currentArea = null;
  currentColumns = null;

  @HostListener('window:resize', ['$event'])
  getArea(event) {
    if(window.innerWidth < 500){
      this.propertyArea =  this.areaXS;
      this.currentArea = "a0 | a1 | a2 | a3 | a4";
      for(let i = 0; i < this.arrayProperties.length + 3; i++){
        this.currentArea += "| a" + (i + 5);
      }
      this.currentColumns = "calc(100% - 16px)";
    }
    else if(window.innerWidth < 900){
      this.propertyArea =  this.areaSD;
      this.currentArea = "a0 a2 | a1 | a3 a4";
      for(let i = 0; i < this.arrayProperties.length + 3; i++){
        this.currentArea += "| a" + (i + 5);
      }
      this.currentColumns = "calc(35% - 16px) calc(67% - 16px) | calc(100% - 16px) | calc(35% - 16px) calc(67% - 16px)"
        + " | calc(100% - 16px)".repeat(this.arrayProperties.length + 20);
    }
    else {
      this.propertyArea = this.areaMD;
      this.currentArea = "a0 a1 a2 | a3  a4";
      for(let i = 0; i < this.arrayProperties.length + 3; i++){
        this.currentArea += "| a" + (i + 5);
      }
      this.currentColumns = "calc(29% - 16px) calc(42% - 16px) calc(29% - 16px) | calc(29% - 16px) calc(42% - 16px)"
        + " | calc(100% - 16px)".repeat(this.arrayProperties.length + 20);
    }

    console.log(this.currentArea);
    console.log(this.currentColumns);
    // console.log("Current Area", this.propertyArea)
  }

  getArrayProperties() {
    return this.device.properties.filter(value => value.type === 'array');
  }

  getNormalProperties() {
    return this.device.properties.filter(value => value.type !== 'array')
  }

}
