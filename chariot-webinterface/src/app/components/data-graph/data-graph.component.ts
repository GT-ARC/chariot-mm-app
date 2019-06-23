import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {Color} from "ng2-charts";
import {ChartOptions} from "chart.js";

@Component({
  selector: 'app-data-graph',
  templateUrl: './data-graph.component.html',
  styleUrls: ['./data-graph.component.css']
})
export class DataGraphComponent implements OnInit {

  @Input()   data: {
    y: number,
    x: number
  }[];

  @Input() dataAmount: number;

  @Input() height: number = 20;

  constructor() { }

  oriLabels;

  ngOnInit() {
    document.getElementById("chart").setAttribute("height", this.height + "");

  }

  ngOnChanges(changes: SimpleChanges) {
    if ('dataAmount' in changes && !('data' in changes)){
      if (changes['dataAmount'].currentValue == changes['dataAmount'].previousValue - 1){
        this.lineChartLabels.shift();
        this.lineChartData[0].data.shift();
      } else if (changes['dataAmount'].currentValue == changes['dataAmount'].previousValue + 1){
        let dataPoint = this.data[this.data.length - this.dataAmount];
        this.lineChartLabels.splice(0, 0, this.monthAbrNames[new Date(dataPoint.y).getMonth()] + " " + new Date(dataPoint.y).getDay());
        this.lineChartData[0].data.splice(0, 0, dataPoint.x);
      } else {
        this.lineChartLabels = this.data.slice(this.data.length - this.dataAmount, this.data.length).map(data =>
          this.monthAbrNames[new Date(data.y).getMonth()] + " " + new Date(data.y).getDay()
        );
        this.lineChartData = [
          {
            data: this.data.slice(this.data.length - this.dataAmount, this.data.length).map(data => data.x),
            label: 'History'
          }
        ];
      }
    }
    if ('data' in changes) {
      this.lineChartLabels = this.data.slice(this.data.length - this.dataAmount, this.data.length).map(data =>
        this.monthAbrNames[new Date(data.y).getMonth()] + " " + new Date(data.y).getDay()
      );
      this.lineChartData = [
        {
          data: this.data.slice(this.data.length - this.dataAmount, this.data.length).map(data => data.x),
          label: 'History'
        }
      ];
    }

  }


  /** Graph data **/
  public lineChartOptions = {

    scaleShowVerticalLines: false,
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
  };


  public lineChartType = 'line';
  public lineChartLegend = true;
  public lineChartLabels = [];
  public lineChartData = [];
  public lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(48,92,255,0.1)',
      borderColor: 'rgba(48,92,255,1)',
      pointBorderColor: 'rgba(48,92,255,1)',
      pointBorderWidth: 2,
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
      pointBackgroundColor: '#fff',
      pointRadius: 3
    }
  ];

  monthAbrNames: string [] = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
  ];
}
