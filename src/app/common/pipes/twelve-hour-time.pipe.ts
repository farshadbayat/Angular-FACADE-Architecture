import { Pipe, PipeTransform } from "@angular/core";
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
 */
@Pipe({ name: "twelveHourTime" })
export class TwelveHourTimePipe implements PipeTransform {
  transform(second: number): string {
    if (second) {
      let minutes = Math.floor((second % 3600) / 60);
      let hours = Math.floor(second / 3600);
      second = second % 60;
      let clockFlag = hours >= 12 ? "PM" : "AM";

      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'

      let sec = second < 10 ? "0" + second.toString() : second.toString();
      let min = minutes < 10 ? "0" + minutes.toString() : minutes.toString();
      let h = hours < 10 ? "0" + hours.toString() : hours.toString();

      return h + ":" + min + " " + clockFlag;
    } else {
      return "-";
    }
  }

  getSecondToTime(value: string): number {
    let shift: string = value.substring(6, 8);
    let a = value.substring(0, 5).split(":");
    let time = +a[0] * 60 * 60 + +a[1] * 60;
    if (shift == "PM" && +a[0] != 12) {
      time += 12 * 60 * 60;
    }
    return time;
  }
}
