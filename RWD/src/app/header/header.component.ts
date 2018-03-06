import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  positions: MenuPosition[];

  constructor() { }

  ngOnInit() {
    this.positions = [
      new MenuPosition('Lorem'),
      new MenuPosition('Ipsum'),
      new MenuPosition('Dolor'),
      new MenuPosition('Sit'),
      new MenuPosition('Amet')
    ];
  }

}

class MenuPosition {
  constructor(public name: string) {}
}
