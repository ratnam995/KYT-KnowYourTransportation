import {
  Component,
  ViewEncapsulation,
  OnInit,
  Input,
  SimpleChanges
} from "@angular/core";

import * as d3 from "d3-selection";
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";

import { BarSelectionService } from "../../shared/services/barSelection.service";
import { DataService } from "../../shared/services/data.service";

@Component({
  selector: "app-donut-chart",
  encapsulation: ViewEncapsulation.None,
  templateUrl: "./donut-chart.component.html",
  styleUrls: ["./donut-chart.component.css"]
})
export class DonutChartComponent implements OnInit {
  title = "Donut Chart";

  @Input()
  dataSet: any = {};

  objectKeys = Object.keys; //To loop across an Object in html.
  parseF(value) {
    return parseFloat(value); //To loop across an Object in html.
  }

  private width: number;
  private height: number;

  private svg: any; // TODO replace all `any` by the right type
  private radius: number;
  public transportMode: string;

  private arc: any;
  private pie: any;
  private color: any;

  private g: any;
  private alive: boolean = true;
  public showNoDataFound: boolean = false;

  carTransportModeObjectArray = [
    { key: "count", frequency: 0 },
    { key: "duration", frequency: 0.0 },
    { key: "distance", frequency: 0.0 }
  ];

  constructor(
    public barSelectionService: BarSelectionService,
    public dataService: DataService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.hasOwnProperty("dataSet")) {
      if (Object.keys(changes.dataSet.currentValue).length) {
        this.showNoDataFound = false;
        d3.select("#donutSvg").attr("visibility", "visible");
        d3.select("#donutSvg").html("");
        this.transportMode = "Car";
        this.carTransportModeObjectArray[0]["frequency"] = parseInt(
          changes.dataSet.currentValue["frequency"]
        );
        this.carTransportModeObjectArray[1]["frequency"] =
          parseFloat(changes.dataSet.currentValue["duration"]) / 60;
        this.carTransportModeObjectArray[2]["frequency"] =
          parseFloat(changes.dataSet.currentValue["distance"]) / 1000;
        this.initSvg();
        this.drawChart(this.carTransportModeObjectArray);
      } else {
        this.showNoDataFound = true;
        d3.select("#donutSvg").attr("visibility", "hidden");
      }
    }
  }

  ngOnInit() {
    this.dataService.watchDataObject$.subscribe(res => {
      if (res.length === 0) this.showNoDataFound = true;
      else this.showNoDataFound = false;
    });
  }

  private initSvg() {
    this.svg = d3.select("#donutSvg");
    this.width = +this.svg.attr("width");
    this.height = +this.svg.attr("height");
    this.radius = Math.min(this.width, this.height) / 2;

    this.color = d3Scale
      .scaleOrdinal()
      .range([
        "#98abc5",
        "#8a89a6",
        "#7b6888",
        "#6b486b",
        "#a05d56",
        "#d0743c",
        "#ff8c00"
      ]);

    this.arc = d3Shape
      .arc()
      .outerRadius(this.radius - 10)
      .innerRadius(this.radius - 70);

    this.pie = d3Shape
      .pie()
      .sort(null)
      .value((d: any) => d.frequency);

    this.svg = d3
      .select("#donutSvg")
      .append("g")
      .attr(
        "transform",
        "translate(" + this.width / 2 + "," + this.height / 2 + ")"
      );
  }

  private drawChart(data: any[]) {
    let g = this.svg
      .selectAll(".arc")
      .data(this.pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    g.append("path")
      .attr("d", this.arc)
      .style("fill", d => this.color(d.data.frequency));

    g.append("text")
      .attr("transform", d => "translate(" + this.arc.centroid(d) + ")")
      .attr("dy", ".35em")
      .text(d => d.data.key);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
