import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
})
export class ItemsComponent implements OnInit {
  items: any[] = [];
  newItem: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.apiService.getItems().subscribe((data) => (this.items = data));
  }

  addItem(): void {
    if (this.newItem.trim()) {
      this.apiService.addItem({ name: this.newItem }).subscribe((item) => {
        this.items.push(item);
        this.newItem = '';
      });
    }
  }
}
