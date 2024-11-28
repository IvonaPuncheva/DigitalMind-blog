import { Component } from "@angular/core";


@Component({
    selector: 'app-nav-bar',
    template: `<div class="nav-bar">
    <div>{{ title}}</div>
   <div class="nav-btn">Home</div>
    <div class="nav-btn">About</div>
     <div class="nav-btn">Catalog</div>
    </div>`,
    styles: `.nav-bar {
    width: 100%;
    height: 80px;
    padding: 20px;
    background-color: skyblue;
    color: #000;
    display: flex;
    justify-content: center;
    align-items: center;

    .nav-btn{
    margin-left: 10px;
    border: 1px solid black;
    padding: 10px;
    }
     .nav-btn:hover{
    cursor:pointer;
    background-color: grey;
    color: #fff;
    }
    }`,
    standalone: true,
})
export class NavBarComponent{
    title = 'My nav component'
}