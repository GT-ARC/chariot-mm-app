import {Component, OnInit, Input, Output, SimpleChanges, OnDestroy, HostListener} from '@angular/core';
import {EventEmitter} from '@angular/core';
import {Device, Property, PropertyBundle} from '../../../model/device';
import {DeviceUpdateService} from '../../services/device-update.service';
import {AgentUpdateService} from '../../services/agent-update.service';

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

  deviceStatus: Property = null;

  arrayProperties: PropertyBundle[];
  normalProperties: PropertyBundle;
  selectedProperty: Property = null;

  ngOnChanges(changes: SimpleChanges) {
    // console.log("Selected device changed", changes);

    // Get the array properties and normal properties
    this.arrayProperties = this.getArrayProperties();
    this.normalProperties = this.getNormalProperties();

    // Select the first normal property
    if(this.normalProperties.properties.length > 0)
      this.selectedProperty = this.normalProperties.properties[0];

    // Set the device status property
    this.deviceStatus = this.device.properties.find(ele => ele.key === "status");
  }

  constructor(private deviceUpdateService: DeviceUpdateService,
              private proxyAgent: AgentUpdateService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.deviceUpdateService.unSubscribeDevice();
  }

  emitDeviceProperty(property: string, state: any) {
      this.device.properties.find(s => s.key == property).value = state;
      if(property == "status") this.uploaded.emit({device: this.device, state: state});

      let sendObject = {};
      sendObject[property] = state;

      this.proxyAgent.sendUpdate(this.device.identifier, sendObject);
  }

  getArrayProperties() : PropertyBundle[] {
    let retBundle = [];
    for(let propBundle of this.device.properties.filter(value => value.type === 'Array')) {
      // @ts-ignore
      let bundledProp = new PropertyBundle(propBundle.value, this.device, propBundle);
      retBundle.push(bundledProp);
    }
    return retBundle;
  }

  getNormalProperties() {
    return new PropertyBundle(
      this.device.properties.filter(value => value.type !== 'Array' && value.key != 'status' && value.key != 'pm_result'),
      this.device,
      undefined);
  }

}
