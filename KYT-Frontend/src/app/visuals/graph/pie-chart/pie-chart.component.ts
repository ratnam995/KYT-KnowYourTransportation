import { Component, ViewEncapsulation, OnInit, Input } from "@angular/core";

import * as d3 from "d3-selection";
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";

import { BarSelectionService } from "../../shared/services/barSelection.service";
import { DataService } from "../../shared/services/data.service";

@Component({
  selector: "app-pie-chart",
  encapsulation: ViewEncapsulation.None,
  templateUrl: "./pie-chart.component.html",
  styleUrls: ["./pie-chart.component.css"]
})
export class PieChartComponent implements OnInit {
  title = "Pie Chart";

  @Input()
  dataSet: any = [];

  floor(value) {
    return Math.floor(value); //To get floor value of decimal in html.
  }

  private width: number;
  private height: number;

  private svg: any;
  private radius: number;
  public transportMode: string;

  private arc: any;
  private labelArc: any;
  private pie: any;
  private margin = { top: 20, right: 10, bottom: 30, left: 50 };
  private color: any;

  private g: any;
  private alive: boolean = true;
  private showNoDataFound: boolean = true;

  currentTransportModeObjectArray = [
    { key: "count", frequency: 0 },
    { key: "duration", frequency: 0 },
    { key: "distance", frequency: 0 }
  ];

  constructor(
    public barSelectionService: BarSelectionService,
    public dataService: DataService
  ) {}

  ngOnInit() {
    this.dataService.watchDataObject$.subscribe(res => {
      if (res.length === 0) this.showNoDataFound = true;
      else this.showNoDataFound = false;
    });
    this.barSelectionService.watchCurrentSelectionObject$
      .takeWhile(() => this.alive)
      .subscribe(selectedObject => {
        if (Object.keys(selectedObject).length) {
          this.showNoDataFound = false;
          d3.select("#pieSvg").attr("visibility", "visible");
          d3.select("#pieSvg").html("");
          this.transportMode = this.barSelectionService.currentSelectedMode;
          this.currentTransportModeObjectArray[0]["frequency"] = parseInt(
            selectedObject["frequency"]
          );
          this.currentTransportModeObjectArray[1]["frequency"] =
            parseFloat(selectedObject["duration"]) / 60;
          this.currentTransportModeObjectArray[2]["frequency"] =
            parseFloat(selectedObject["distance"]) / 1000;
          this.initSvg();
          this.drawPie();
        } else {
          if (
            Object.keys(this.dataService.dataObject.getValue()).length === 0
          ) {
            this.showNoDataFound = true;
            d3.select("#pieSvg").attr("visibility", "hidden");
          }
        }
      });
  }

  private initSvg() {
    this.width = 560 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
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
      .innerRadius(this.radius - 100);
    this.pie = d3Shape
      .pie()
      .sort(null)
      .value((d: any) => d.frequency);
    this.svg = d3
      .select("#pieSvg")
      .append("g")
      .attr(
        "transform",
        "translate(" + this.width / 2 + "," + this.height / 2 + ")"
      );
  }

  private drawPie() {
    let g = this.svg
      .selectAll(".arc")
      .data(this.pie(this.currentTransportModeObjectArray))
      .enter()
      .append("g")
      .attr("class", "arc");
    g.append("path")
      .attr("d", this.arc)
      .style("fill", (d: any) => this.color(d.data.key));
    g.append("text")
      .attr("transform", (d: any) => "translate(" + this.arc.centroid(d) + ")")
      .attr("dy", ".35em")
      .text((d: any) => d.data.key);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
