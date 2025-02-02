import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css'],
  imports: [RouterModule, CommonModule] 
})
export class BreadcrumbsComponent implements OnInit {
  breadcrumbs: string[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.getBreadcrumbs(this.activatedRoute.root);
      });
  }

  private getBreadcrumbs(route: ActivatedRoute, breadcrumbs: string[] = []): string[] {
    if (route.routeConfig && route.routeConfig.data && route.routeConfig.data['breadcrumbs']) {
      breadcrumbs = [...breadcrumbs, ...route.routeConfig.data['breadcrumbs']];
    }

    if (route.firstChild) {
      return this.getBreadcrumbs(route.firstChild, breadcrumbs);
    }

    return breadcrumbs;
  }
}