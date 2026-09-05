import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";

export type TableColumn = {
  key: string;
  label: string;
};

@Component({
  selector: "sf-table",
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="table-shell">
      @if (rows().length === 0) {
        <p class="empty-state">{{ emptyMessage() }}</p>
      } @else {
        <table>
          <thead>
            <tr>
              @for (column of columns(); track column.key) {
                <th>{{ column.label }}</th>
              }
              @if (rowLinkBasePath()) {
                <th>Action</th>
              }
            </tr>
          </thead>
          <tbody>
            @for (row of rows(); track row[trackByKey()]) {
              <tr>
                @for (column of columns(); track column.key) {
                  <td>{{ row[column.key] }}</td>
                }
                @if (rowLinkBasePath()) {
                  <td>
                    <a [routerLink]="[rowLinkBasePath(), row[trackByKey()]]">
                      {{ rowLinkLabel() }}
                    </a>
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      }
    </section>
  `,
  styles: [
    `
      .table-shell {
        overflow: hidden;
        border-radius: 1.2rem;
        background: var(--surface);
        border: 1px solid var(--border-color);
        box-shadow: var(--shadow-soft);
      }
      .empty-state {
        margin: 0;
        padding: 1.25rem;
        color: var(--text-muted);
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th,
      td {
        padding: 0.9rem;
        border-bottom: 1px solid rgba(148, 163, 184, 0.16);
        text-align: left;
      }
      th {
        font-size: 0.78rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--text-subtle);
        background: rgba(248, 250, 252, 0.86);
      }
      td {
        color: var(--text-primary);
      }
      a {
        font-weight: 700;
        color: var(--accent-strong);
      }
      @media (max-width: 720px) {
        .table-shell {
          overflow-x: auto;
        }
      }
    `
  ]
})
export class TableComponent {
  readonly columns = input.required<TableColumn[]>();
  readonly rows = input.required<Array<Record<string, string | number | null | undefined>>>();
  readonly trackByKey = input("id");
  readonly emptyMessage = input("No data found.");
  readonly rowLinkBasePath = input<string | null>(null);
  readonly rowLinkLabel = input("View");
}
