import {Component, input} from '@angular/core';

@Component({
  selector: 'app-image-loader',
  standalone: true,
  imports: [],
  templateUrl: './image-loader.component.html',
  styleUrl: './image-loader.component.scss'
})
export class ImageLoaderComponent {
  imageLink = input.required<string>()
  size = input.required<number>()
}
