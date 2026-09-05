import { Pipe, PipeTransform } from "@angular/core";
import { AuthRole } from "../../core/models/auth.models";

@Pipe({
  name: "roleLabel",
  standalone: true
})
export class RoleLabelPipe implements PipeTransform {
  transform(role: AuthRole): string {
    switch (role) {
      case "admin":
        return "Admin";
      case "manager":
        return "Manager";
      case "user":
      default:
        return "User";
    }
  }
}
