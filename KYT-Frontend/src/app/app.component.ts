import { Component } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";

import { DataService } from "./visuals/shared/services/data.service";
import { HttpService } from "./visuals/shared/services/http-service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "app";
  completeTransportationData: any = [];
  firstModeCompleteData: any = [];
  transportationMode: string = "";
  yAxisValue: string = "Duration";
  carMode: string = "Car";
  carTransportationData: any = {};
  fetchingData: boolean = true;
  dateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dataService: DataService,
    private httpService: HttpService
  ) {}

  async ngOnInit() {
    this.initializeForm();

    this.dataService.watchFetchingData$.subscribe(fetching => {
      this.fetchingData = fetching;
    });

    await this.fetchDataSet();
  }

  initializeForm() {
    this.dateForm = this.fb.group({
      startDate: ["", []],
      endDate: ["", []]
    });
  }

  fetchFilteredDataSet(event?) {
    return new Promise((resolve, reject) => {
      this.dataService.setFetchingData(true);
      let paramsToBeSent = {
        startDate: "",
        endDate: ""
      };
      if (
        this.dateForm.getRawValue().startDate &&
        this.dateForm.getRawValue().endDate
      )
        paramsToBeSent = {
          startDate: JSON.parse(
            JSON.stringify(this.dateForm.getRawValue().startDate.jsdate)
          ),
          endDate: JSON.parse(
            JSON.stringify(this.dateForm.getRawValue().endDate.jsdate)
          )
        };

      this.httpService.post("getDataSet", paramsToBeSent).subscribe(
        res => {
          if (res.length) {
            this.completeTransportationData = res;
            this.carTransportationData = this.completeTransportationData.filter(
              data => data.mode === "car"
            )[0];
            this.dataService.setDataObject(res);
            this.dataService.setFetchingData(false);
          } else {
            this.completeTransportationData = [];
            this.carTransportationData = [];
            this.dataService.setDataObject([]);
            this.dataService.setFetchingData(false);
          }
        },
        err => {
          console.log("err fetchFilteredDataSet", err);
        }
      );
    });
  }

  fetchDataSet(event?) {
    return new Promise((resolve, reject) => {
      this.dataService.setFetchingData(true);
      let paramsToBeSent = {
        startDate: "",
        endDate: ""
      };

      this.httpService.post("getDataSet", paramsToBeSent).subscribe(
        res => {
          this.completeTransportationData = res;
          this.carTransportationData = this.completeTransportationData.filter(
            data => data.mode === "car"
          )[0];
          this.dataService.setDataObject(res);
          this.dataService.setFetchingData(false);
        },
        err => {
          console.log("err in fetchDataSet", err);
        }
      );
    });
  }

  onYAxisUpdateEvent(mode) {
    this.yAxisValue = mode === "count" ? "Count" : "Duration";
  }
}
