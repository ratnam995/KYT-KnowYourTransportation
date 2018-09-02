import {
  Component,
  ViewEncapsulation,
  OnInit,
  Input,
  SimpleChange,
  SimpleChanges,
  Output,
  EventEmitter
} from "@angular/core";

import * as d3 from "d3-selection";
import * as d3Scale from "d3-scale";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";

import { BarSelectionService } from "../../shared/services/barSelection.service";
import { HttpService } from "../../shared/services/http-service";
import { DataService } from "../../shared/services/data.service";

@Component({
  selector: "app-bar-chart",
  encapsulation: ViewEncapsulation.None,
  templateUrl: "./bar-chart.component.html",
  styleUrls: ["./bar-chart.component.css"]
})
export class BarChartComponent implements OnInit {
  title = "Bar Chart";
  @Input()
  dataSet: any = [];
  @Output()
  yAxisModeEvent = new EventEmitter<any>();

  private width: number;
  private height: number;
  private margin = { top: 20, right: 20, bottom: 30, left: 40 };

  private x: any;
  private y: any;
  private svg: any;
  private g: any;
  public showNoDataFound: boolean = false;
  public currentYAxis: string = "duration";

  constructor(
    private httpService: HttpService,
    public barSelectionService: BarSelectionService,
    private dataService: DataService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.hasOwnProperty("dataSet")) {
      this.dataSet = changes.dataSet.currentValue;
      this.checkAndAddChart();
    }
  }

  ngOnInit() {
    this.dataService.watchDataObject$.subscribe(res => {
      if (res.length === 0) this.showNoDataFound = true;
      else this.showNoDataFound = false;
    });
  }

  checkAndAddChart() {
    if (this.dataSet.length === 0) {
      this.showNoDataFound = true;
      d3.select("#barSvg").attr("visibility", "hidden");
      this.barSelectionService.setCurrentSelectionObject({});
    } else if (this.dataSet) {
      this.showNoDataFound = false;
      d3.select("#barSvg").attr("visibility", "visible");
      d3.select("#barSvg").html("");
      this.initSvg();
      this.initAxis(this.currentYAxis === "count" ? "frequency" : "duration");
      this.drawAxis(this.currentYAxis);
      this.drawBars();
    }
  }

  switchModes(mode) {
    this.currentYAxis = mode;
    d3.select("#barSvg").html("");
    this.checkAndAddChart();
    this.yAxisModeEvent.emit(mode);
  }

  private initSvg() {
    this.svg = d3.select("#barSvg");
    this.width = +this.svg.attr("width") - this.margin.left - this.margin.right;
    this.height =
      +this.svg.attr("height") - this.margin.top - this.margin.bottom;
    this.g = this.svg
      .append("g")
      .attr(
        "transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")"
      );
  }

  private initAxis(yAxisKey) {
    this.x = d3Scale
      .scaleBand()
      .rangeRound([0, this.width])
      .padding(0.1);
    this.y = d3Scale.scaleLinear().rangeRound([this.height, 0]);
    this.x.domain(this.dataSet.map(d => d["mode"]));
    this.y.domain([
      0,
      d3Array.max(this.dataSet, d => {
        if (yAxisKey === "duration")
          return Math.ceil(parseFloat(d[yAxisKey]) / 60);

        return parseInt(d[yAxisKey]);
      })
    ]);
  }

  private drawAxis(yAxisKey) {
    let yAxisText = "Duration";
    if (yAxisKey === "count") {
      yAxisText = "Count";
    }
    this.g
      .append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3Axis.axisBottom(this.x))
      .append("text")
      .attr("class", "axis-title")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Mode");
    this.g
      .append("g")
      .attr("class", "axis axis--y")
      .call(d3Axis.axisLeft(this.y).ticks(10))
      .append("text")
      .attr("class", "axis-title")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text(yAxisText);
  }

  private drawBars() {
    this.barSelectionService.setCurrentSelectionObject(
      this.dataSet.filter((data, index) => index === 0)[0]
    );
    this.barSelectionService.currentSelectedMode = this.dataSet.filter(
      (data, index) => index === 0
    )[0].mode;
    var tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "bar-toolTip");
    this.g
      .selectAll(".bar")
      .data(this.dataSet)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => this.x(d.mode))
      .attr("y", d => this.y(parseFloat(d["duration"]) / 60))
      .attr("width", this.x.bandwidth())
      .attr("height", d => this.height - this.y(d["duration"] / 60))
      .on("click", barData => {
        this.barSelectionService.setCurrentSelectionObject(barData);
        this.barSelectionService.currentSelectedMode = barData.mode;
      })
      .on("mousemove", function(d) {
        tooltip
          .style("left", d3.event.pageX - 50 + "px")
          .style("top", d3.event.pageY - 70 + "px")
          .style("display", "inline-block")
          .html(d.duration / 60 + "(Click for details)");
      })
      .on("mouseout", function(d) {
        tooltip.style("display", "none");
      });
  }
}
