import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";

import {Location} from "../../model/location";
import {Device} from "../../model/device";
import {Floor} from "../../model/floor";

import * as faker from 'faker'

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  floor: Floor[] = [];
  locations: Location[] = [];
  devices: Device[] = [];

  constructor() {
    this.createData();
  }

  createData(): void {
    for(let i = 0; i < 100; i++){
      let dataStartTime: number = faker.date.past().valueOf();
      let dataValue: number = Math.random() * 100;
      let device_data: {y: number, x: number}[] = [];
      let device_data_size = Math.round(Math.random() * 30) + 10;
      let predictionSize = Math.round(Math.random() * 5) + 5;
      for(let c = 0; c < device_data_size; c++) {
        device_data.push({y: dataStartTime, x: dataValue});
        dataStartTime = Math.floor(Math.random() * 10**9 + 10**8 + 10**7) + Math.abs(dataStartTime);
        dataValue += (Math.random() * 20 + 5) * (Math.random() * 2 - 1 > 0 ? 1 : -1);
      }

      this.devices.push({
        identifier: i,
        name: "Device " + i,
        symbol: null,

        power_state: Math.random() >= 0.5,
        power_consumption: Math.floor(Math.random() * 100 * 100)/100,

        running: Math.floor(Math.random() * 200 + 50),
        down_time: Math.floor(Math.random() * 50),
        description: [
          {
            title: faker.commerce.productName(),
            desc: faker.hacker.phrase()
          },
          {
            title: faker.commerce.productName(),
            desc: faker.hacker.phrase()
          },
          {
            title: faker.commerce.productName(),
            desc: faker.hacker.phrase()
          },
          {
            title: faker.commerce.productName(),
            desc: faker.hacker.phrase()
          }
        ],
        issues: [
          {
            state: Math.random() >= 0.08,
            description: "",
            issue_date: faker.date.past().valueOf(),
            importance: Math.random() * 10
          },
          {
            state: Math.random() >= 0.08,
            description: "",
            issue_date: faker.date.past().valueOf(),
            importance: Math.random() * 10
          },
          {
            state: Math.random() >= 0.08,
            description: "",
            issue_date: faker.date.past().valueOf(),
            importance: Math.random() * 10
          },
          {
            state: Math.random() >= 0.08,
            description: "",
            issue_date: faker.date.past().valueOf(),
            importance: Math.random() * 10
          },
          {
            state: true,
            description: "",
            issue_date: Date.now(),
            importance: 0
          }
        ],
        data: device_data.slice(0, device_data.length - predictionSize),
        prediction: device_data.slice(device_data.length - predictionSize - 1, device_data.length)
      })
    }

    var devIndex = 0;
    for(let i = 0; i < 20; i++){
      let randNumber = Math.floor(Math.random() * 3) + 2;
      let location = {
        identifier: i,
        type: null,
        name: Math.random() > 0.5 ? "Room " + i : "Space " + i,
        position: null,
        devices: this.devices.slice(devIndex, devIndex + randNumber)
      };
      this.locations.push(location);
      devIndex = devIndex + randNumber;
    }

    var devFloor = 0;
    for(let i = 0; i < 2; i++) {
      let randNumber = Math.floor(Math.random() * 8) + 2;
      let floor: Floor = {
        identifier: "f" + i,
        name: "Floor " + i,
        level: i,
        locations: this.locations.slice(devFloor, devFloor + randNumber)
      };
      this.floor.push(floor);
      devFloor = devFloor + randNumber;
    }
  }

  getFloor(): Observable<{floors: Floor[], locations: Location[], devices: Device[]}> {
    return of({
      floors: this.floor,
      locations: this.locations,
      devices: this.devices});
  }
}
