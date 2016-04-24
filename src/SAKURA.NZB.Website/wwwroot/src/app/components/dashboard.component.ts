import {Component, OnInit} from "angular2/core";

@Component({
    selector: "dashboard",
    templateUrl: "./src/app/components/dashboard.html",
	styleUrls: ["./src/app/components/dashboard.css"]
})
export class DashboardComponent implements OnInit {
    message: string;

    constructor() { }

    ngOnInit() {
        this.message = "The 'static.html' was used as the Angular2 'templateUrl'. There is a 'message' property bound to the <blockqoute> element."
    }
}