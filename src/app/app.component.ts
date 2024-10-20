import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule, HeaderComponent, FooterComponent] 
})
export class AppComponent { }
