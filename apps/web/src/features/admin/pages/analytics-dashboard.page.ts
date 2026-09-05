import { CommonModule } from "@angular/common";
import { Component, computed, inject } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ChartComponent
} from "ng-apexcharts";
import { EngagementService } from "../../../core/services/engagement.service";
import { ActivityFeedComponent } from "../../../shared/components/activity-feed.component";
import { LoaderComponent } from "../../../shared/components/loader.component";
import { PageHeaderComponent } from "../../../shared/components/page-header.component";
import { StatCardComponent } from "../../../shared/components/stat-card.component";

@Component({
  selector: "sf-analytics-dashboard-page",
  standalone: true,
  imports: [
    CommonModule,
    ActivityFeedComponent,
    ChartComponent,
    LoaderComponent,
    PageHeaderComponent,
    StatCardComponent
  ],
  template: `
    <sf-page-header
      title="Analytics Dashboard"
      subtitle="Executive-level visibility across growth, roles, and queue delivery performance."
    />

    <sf-loader
      [loading]="engagementService.analyticsLoading()"
      label="Loading analytics..."
    />

    <section class="stats-grid">
      <sf-stat-card label="Total Users" [value]="totalUsers()" hint="Registered SaaS members" />
      <sf-stat-card label="Active Users" [value]="activeUsers()" hint="Logged in within the last 30 days" />
      <sf-stat-card label="Sent Emails" [value]="sentNotifications()" hint="Welcome emails delivered successfully" />
      <sf-stat-card label="Queue Backlog" [value]="queuedNotifications()" hint="Background emails still waiting in queue" />
    </section>

    <section class="chart-grid">
      <article class="chart-panel wide">
        <div class="panel-copy">
          <p class="eyebrow">Growth</p>
          <h3>Daily registrations</h3>
          <p>See how user acquisition moves day by day across the last week.</p>
        </div>

        <apx-chart
          [chart]="registrationChart()"
          [series]="registrationSeries()"
          [stroke]="registrationStroke"
          [dataLabels]="dataLabels"
          [xaxis]="registrationXAxis()"
          [fill]="registrationFill"
          [tooltip]="tooltipConfig"
        />
      </article>

      <article class="chart-panel">
        <div class="panel-copy">
          <p class="eyebrow">Roles</p>
          <h3>Role distribution</h3>
          <p>Understand who runs the workspace and who participates in it.</p>
        </div>

        <apx-chart
          [chart]="roleChart"
          [series]="roleSeries()"
          [labels]="roleLabels()"
          [legend]="legendConfig"
          [plotOptions]="rolePlotOptions"
          [responsive]="responsiveConfig"
          [tooltip]="tooltipConfig"
        />
      </article>

      <article class="chart-panel">
        <div class="panel-copy">
          <p class="eyebrow">Delivery</p>
          <h3>Notification delivery</h3>
          <p>Track the health of the welcome-email workflow across BullMQ.</p>
        </div>

        <apx-chart
          [chart]="deliveryChart"
          [series]="deliverySeries()"
          [labels]="deliveryLabels"
          [legend]="legendConfig"
          [plotOptions]="deliveryPlotOptions"
          [responsive]="responsiveConfig"
          [tooltip]="tooltipConfig"
        />
      </article>
    </section>

    <section class="activity-section">
      <sf-activity-feed
        title="Recent system activity"
        [activities]="recentActivities()"
      />
    </section>
  `,
  styles: [
    `
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 1rem;
      }
      .chart-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }
      .chart-panel {
        padding: 1.35rem;
        border-radius: 1.4rem;
        background: var(--surface);
        border: 1px solid var(--border-color);
        box-shadow: var(--shadow-soft);
      }
      .chart-panel.wide {
        grid-column: span 2;
      }
      .panel-copy {
        margin-bottom: 1rem;
      }
      .eyebrow {
        margin: 0 0 0.35rem;
        color: var(--accent-strong);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 0.72rem;
        font-weight: 800;
      }
      h3,
      p {
        margin: 0;
      }
      .panel-copy p:last-child {
        margin-top: 0.45rem;
        color: var(--text-muted);
      }
      .activity-section {
        margin-top: 1rem;
      }
      @media (max-width: 1100px) {
        .stats-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .chart-grid {
          grid-template-columns: 1fr;
        }
        .chart-panel.wide {
          grid-column: span 1;
        }
      }
      @media (max-width: 720px) {
        .stats-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class AnalyticsDashboardPage {
  readonly engagementService = inject(EngagementService);
  readonly dataLabels: ApexDataLabels = {
    enabled: false
  };
  readonly registrationStroke: ApexStroke = {
    width: 4,
    curve: "smooth"
  };
  readonly registrationFill: ApexFill = {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.35,
      opacityTo: 0.05
    }
  };
  readonly roleChart: ApexChart = {
    type: "donut",
    height: 320,
    fontFamily: "Manrope, sans-serif",
    background: "transparent"
  };
  readonly deliveryChart: ApexChart = {
    type: "radialBar",
    height: 320,
    fontFamily: "Manrope, sans-serif",
    background: "transparent"
  };
  readonly rolePlotOptions: ApexPlotOptions = {
    pie: {
      donut: {
        size: "68%"
      }
    }
  };
  readonly deliveryPlotOptions: ApexPlotOptions = {
    radialBar: {
      hollow: {
        size: "34%"
      },
      track: {
        background: "#edf2f7"
      },
      dataLabels: {
        name: {
          fontSize: "14px"
        },
        value: {
          fontSize: "18px",
          fontWeight: 700
        }
      }
    }
  };
  readonly legendConfig: ApexLegend = {
    position: "bottom",
    fontFamily: "Manrope, sans-serif"
  };
  readonly responsiveConfig: ApexResponsive[] = [
    {
      breakpoint: 720,
      options: {
        chart: {
          height: 280
        },
        legend: {
          position: "bottom"
        }
      }
    }
  ];
  readonly tooltipConfig: ApexTooltip = {
    theme: "light"
  };
  readonly deliveryLabels = ["Queued", "Sent", "Failed"];

  readonly registrationChart = computed<ApexChart>(() => ({
    type: "area",
    height: 320,
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    },
    fontFamily: "Manrope, sans-serif",
    foreColor: "#53627c",
    background: "transparent"
  }));
  readonly registrationSeries = computed<ApexAxisChartSeries>(() => [
    {
      name: "Registrations",
      data: (this.engagementService.adminOverview()?.dailyRegistrations ?? []).map(
        (item) => item.count
      )
    }
  ]);
  readonly registrationXAxis = computed<ApexXAxis>(() => ({
    categories: (this.engagementService.adminOverview()?.dailyRegistrations ?? []).map(
      (item) => item.date.slice(5)
    ),
    axisBorder: {
      color: "#d6dde8"
    },
    axisTicks: {
      color: "#d6dde8"
    }
  }));
  readonly roleSeries = computed<ApexNonAxisChartSeries>(() =>
    (this.engagementService.adminOverview()?.roles ?? []).map((item) => item.count)
  );
  readonly roleLabels = computed(() =>
    (this.engagementService.adminOverview()?.roles ?? []).map(
      (item) => item.role
    )
  );
  readonly deliverySeries = computed<ApexNonAxisChartSeries>(() => {
    const delivery = this.engagementService.adminOverview()?.notificationDelivery;

    return delivery
      ? [delivery.queued, delivery.sent, delivery.failed]
      : [0, 0, 0];
  });
  readonly activeUsers = computed(
    () => String(this.engagementService.adminOverview()?.summary.activeUsers ?? 0)
  );
  readonly totalUsers = computed(
    () => String(this.engagementService.adminOverview()?.summary.totalUsers ?? 0)
  );
  readonly sentNotifications = computed(
    () =>
      String(this.engagementService.adminOverview()?.summary.sentNotifications ?? 0)
  );
  readonly queuedNotifications = computed(
    () =>
      String(
        this.engagementService.adminOverview()?.summary.queuedNotifications ?? 0
      )
  );
  readonly recentActivities = computed(
    () => this.engagementService.adminOverview()?.recentActivities ?? []
  );

  constructor() {
    this.engagementService.loadAdminOverview().subscribe();
  }
}
