import {DeviceGroup} from './deviceGroup';
import {Device} from './device';

export class Location {

  public identifier: string;
  public type: String;
  public name: String;
  public position: {
    lat: number;
    lng: number;
  };
  public devices: (Device | DeviceGroup) [];

  constructor(identifier: string, type: String, name: String, position: { lat: number; lng: number }) {
    this.identifier = identifier;
    this.type = type;
    this.name = name;
    this.position = position;
    this.devices = [];
  }

  public addDeviceGroup(deviceGroup: (Device | DeviceGroup)): void {
    this.devices.push(deviceGroup);
  }

  public getDeviceById(id : string) : (Device | DeviceGroup) {
    let device = this.devices.filter(element => element instanceof Device).find(device => device.identifier == id);
    if(device != undefined) return device;
    return this.devices.filter(element => element instanceof DeviceGroup).find(deviceGroup => deviceGroup.identifier == id);
  }

  getAllDevices(): Device[] {
    return this.devices.filter(element => element instanceof Device) as Device[];
  }

  getAllDeviceGroups(): DeviceGroup[] {
    return this.devices.filter(element => element instanceof DeviceGroup) as DeviceGroup[];
  }
}
